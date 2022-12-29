import React, {useState, useEffect} from 'react'
import { MdDownloadForOffline } from 'react-icons/md';
import { Link, useParams } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

import { client, urlFor } from '../client';
import MasonryLayout from './MasonryLayout';
import { pinDetailMorePinQuery, pinDetailQuery } from '../utils/data';
import Spinner from './Spinner';

const PinDetail = ({ user }) => {
    const [pins, setPins] = useState(null);
    const [pinDetail, setPinDetail] = useState(null);
    const [comment, setComment] = useState('');
    const [addingComment, setAddingComment] = useState(false);
    const { pinId } = useParams();

    const addComment = async () => {
        if (comment) {
          setAddingComment(true);
    
          await client
            .patch(pinId)
            .setIfMissing({ comments: [] })
            .insert('after', 'comments[-1]', [{ comment, _key: uuidv4(), postedBy: { _type: 'postedBy', _ref: user._id } }])
            .commit()
            .then(() => {
              fetchPinDetails();
              setComment('');
              setAddingComment(false);
              window.location.reload();
            });
        }
      };
    const fetchPinDetails = () => { 
        let query = pinDetailQuery(pinId);
        if (query) {
            client.fetch(query)
               .then(res => {
                    setPinDetail(res[0])
                    if(res[0]) {
                        query = pinDetailMorePinQuery(res[0]);
                        client.fetch(query)
                            .then(res => {
                                setPins(res);
                            }).catch(err => {
                                console.error('there was an issue fetching related pins', err);
                        });
                    }
               }).catch(e => {
                    console.error('there was an issue fetching pin details', e);
            });
        }
    }
    useEffect(() => {
        fetchPinDetails();
    }, [pinId]);
    
    if(!pinDetail) return <Spinner message='Loading pin..' />;

    const imgIconDLDClass = 'bg-white w-9 h-9 rounded-full flex items-center justify-center text-dark text-xl opacity-75 hover:opacity-100 hover:shadow-md outline-none';

    return (
        <>
        <div className='flex xl-flex-row flex-col m-auto bg-white' style={{ maxWidth: '1500', borderRadius: '32px'}}>
            <div className='flex justify-center items-center md:items-start flex-initial'>  
                <img src={pinDetail?.image && urlFor(pinDetail.image).url()} 
                className='rounded-t-3xl rounded-b-lg' 
                alt='pin-detail'/> 
            </div>
            <div className='w-full p-5 flex-1 xl:min-w-620'>
                <div className='flex items-center justify-between'>
                    <div className='flex gap-2 items-center'>
                        <a 
                            href={`${pinDetail?.image.asset.url}?dl=`}
                            download
                            onClick={(e) => e.stopPropagation()}
                            className={imgIconDLDClass}>
                            <MdDownloadForOffline />
                        </a>
                    </div>
                    <a href={pinDetail?.destination} target="_blank" rel="noreferrer">
                        {pinDetail?.destination.replace('https://', '').replace('http://', '').split('/')[0]}
                    </a>
                </div>
                <div>
                    <h1 className='text-4xl font-bold break-words mt-3'>
                        {pinDetail?.title}
                    </h1>
                    <p className="mt-3">
                        {pinDetail?.about}
                    </p>
                </div>
                <Link to={`user-profile/${pinDetail?.postedBy?._id}`} className='flex gap-2 mt-5 items-center bg-white rounded-lg'>
                <img 
                    className='w-8 h-8 rounded-full object-cover'
                    src={pinDetail?.postedBy?.image} 
                    alt='user-profile'/>
                    <p className='font-semibold capitalize'> 
                        {pinDetail?.postedBy?.userName}
                    </p>
                </Link>
                <h2 className='mt-5 text-2xl'>Comments</h2>
                <div className='max-h-370 overflow-y-auto'>
                    {pinDetail?.comments?.map((comment, i) => (
                        <div className='flex gap-2 rounded-lg bg-white'>
                            <img src={comment?.postedBy?.image} alt='user-profile' className='w-10 h-10 rounded-full cursor-pointer'></img>
                            <div className='flex flex-col'>
                                <p className='font-bold'> {comment.postedBy.userName}</p>
                                <p>{comment.comment}</p>
                            </div>
                        </div>
                    ))}
                </div>
                <div className='flex flex-wrap mt-6 gap-3'>
                <Link to={`user-profile/${pinDetail?.postedBy?._id}`} className=''>
                <img 
                    className='w-10 h-10 rounded-full object-cover cursor-pointer'
                    src={pinDetail?.postedBy?.image} 
                    alt='user-profile'/>
                </Link>
                <input 
                    className='flex-1 border-gray-100 outline-none border-2 p-2 rounded-2xl focus:border-gray-300'
                    type='text'
                    onChange={(e)=>setComment(e.target.value)}
                    placeholder='Add a comment'
                    value={comment}
                    />
                    <button 
                        onClick={(e)=> addComment()}
                        type="button"
                        className='bg-red-500 text-white rounded-full px-6 py-2 font-semibold text-base outline-none'>
                        {addingComment ? 'Posting the Comment..' : 'Post'}
                    </button>
                </div>
            </div>
        </div>
        {pins?.length > 0 && (
                <h2 className="text-center font-bold text-2xl mt-8 mb-4">
                Check out more like this..
                </h2>
            )}
            {pins ? (
                <MasonryLayout pins={pins} />
            ) : (
                <Spinner message="Loading more pins" />
            )}
        </>
    );
};

export default PinDetail