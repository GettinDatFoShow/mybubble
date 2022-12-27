import React, {useState} from 'react';
import { AiOutlineCloudUpload } from 'react-icons/ai';
import { MdDelete } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';

import { client } from '../client'; 
import Spinner from './Spinner';
import { categories } from '../utils/data';
// categories [{name: 'sports', image: ''}]

const CreatePin = ({ user }) => {
    
    const [title, setTitle] = useState('');
    const [about, setAbout] = useState('');
    const [destination, setDestination] = useState('');
    const [loading, setLoading] = useState(false);
    const [fields, setFields] = useState();
    const [category, setCategory] = useState();
    const [imageAsset, setImageAsset] = useState();
    const [wrongImageType, setWrongImageType] = useState(false);

    const navigate = useNavigate();
    
    const uploadImage = (e) => {
        const selectedFile = e.target.files[0];
        const { type, name } = selectedFile
        if (['png', 'svg', 'jpeg', 'jpg', 'gif', 'tiff'].includes(type.slice(6))) {
            setWrongImageType(false);
            setLoading(true);
            client.assets.upload('image', selectedFile).then(
                (document) => {
                    console.log('UPLOAD SUCCESS', document);
                    setImageAsset(document);
                    setLoading(false);
                }
            ).catch(
                (error) => {
                    console.error('Image upload error', error);
                    setLoading(false);
                }
            );
        } else {
            setWrongImageType(true, selectedFile, { contentType: type, fileName: name })
        }
    };

    const deleteImage = () => {
        setImageAsset(null);
    };

    const savePin = (e) => {
        if(title && about && destination && imageAsset?._id && category) {
            const doc = {
                _type: 'pin',
                title,
                about,
                destination,
                image: {
                    _type: 'image',
                    asset: {
                        _type: 'reference',
                        _ref: imageAsset?._id,
                    },
                },
                userId: user._id,
                postedBy: {
                    _type: 'postedBy',
                    _ref: user._id,
                },
                category,
            };
            client.create(doc).then( (response) => { 
                console.log('Successfuly Create', response);
                navigate('/');
            }).catch( (err) => { 
                console.error('Pin Create Error', err);
            })
        }
    };

    return (
        <div className='flex flex-col justify-center items-center mt-5 lg:h-4/5'>
      {fields && (
        <p className="text-red-500 mb-5 text-xl transition-all duration-150 ease-in ">Please add all fields.</p>
      )}
            <div className='flex lg:flex-row flex-col justify-center items-center bg-white lg:p-5 p-3 lg:w-4/5 w-full'>
                <div className='bg-secondaryColor p-3 flex flex-0.7 w-full'>
                    <div className='flex flex-col justify-center items-center w-full border-2 border-dotted border-gray-300 p-3 h-420'>
                        {loading && <Spinner message={'of course im loading fool'}/>}
                        {wrongImageType && <p>It&apos;s wrong file type.</p>}
                        {!imageAsset ? (
                            <label>
                                <div className='flex flex-col items-center justify-center h-full'>
                                    <div className='flex flex-col justify-center items-center'>
                                        <p className='font-bold text-2xl'>
                                            <AiOutlineCloudUpload />
                                        </p>
                                        <p className='text-lg'>
                                            Click to Upload Image
                                        </p>
                                    </div>
                                    <p className='text-grey-400 mt-32'>
                                        Use high-quality JPG, JPEG, SVG, PNG, GIF or TIFF less than 20mb
                                    </p>
                                </div>
                                <input 
                                    type='file'
                                    name='upload-image'
                                    onChange={uploadImage}
                                    className='w-0 h-0'
                                />
                            </label>
                        ) : (
                            <div className='relative h-full'>
                                <img src={imageAsset?.url} alt='uploaded-image' className='h-full w-full'/>
                                <button 
                                    type='button'
                                    onClick={deleteImage}
                                    className='absolute bottom-3 right-3 p-3 rounded-full bg-white text-xl cursor-pointer outline-1 outline-double outline-gray-600 hover:shadow-md transition-all duration-500 ease-in-out'>
                                        <MdDelete />
                                    </button>
                            </div>
                        )}
                    </div>
                </div>

                <div className='flex flex-1 flex-col gap-6 lg:pl-5 mt-5 w-full'>
                    <input 
                        type='text'
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        placeholder='Add your title here'
                        className='outline-none text-base sm:text-lg font-bold border-b-2 border-gray-200 p-1'
                    />
                    <input 
                        type='text'
                        value={about}
                        onChange={e => setAbout(e.target.value)}
                        placeholder='What is your pin about'
                        className='outline-none text-base sm:text-lg font-bold border-b-2 border-gray-200 p-1'
                    />
                    <input 
                        type='url'
                        value={destination}
                        onChange={e => setDestination(e.target.value)}
                        placeholder='Add a destination link'
                        className='outline-none text-base sm:text-lg font-bold border-b-2 border-gray-200 p-1'
                    />
                    <div className='flex flex-col'>
                        <div>
                            <p className='mb-2 font-semibold text-lg sm:text-xl'> Choose Pin Category </p>
                            <select 
                                onChange={(e)=> {
                                    setCategory(e.target.value);
                                }}      
                                className='outline-none w-4/5 text-base border-b-2 border-gray-200 p-2 rounded-md cursor-pointer'                      
                            >
                            <option 
                                value='others'
                                className='sm:text-bg bg-white'>   
                                Select Category                             
                            </option>
                            { categories.map((category) => (
                                <option 
                                className='text-base border-0 outline-none capitalize bg-white text-black'
                                 value={category.name}>{category.name}
                                </option>
                            ))}
                            </select>
                        </div>
                        <div className='flex justify-end items-end mt-5'>
                            <button 
                                className='bg-red-500 text-white font-bold p-2 rounded-full outline-none w-28'
                                onClick={savePin}
                                type='button'>Save Pin</button>
                        </div>
                    </div>

                    {/* {user && (
                        <div className='flex gap-2 my-2 items-center justify-end bg-white' >
                                <img src={user?.image} 
                                    alt='user-profile'
                                    className='w-10 h-10 rounded-full'/>
                                <p className='font-bold'>{user?.userName}</p>
                        </div>
                    )}  */}
                </div>

            </div>


        </div>
    )
}

export default CreatePin