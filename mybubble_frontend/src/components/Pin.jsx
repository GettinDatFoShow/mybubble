import React, { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { MdDownloadForOffline } from 'react-icons/md';
import { AiTwotoneDelete } from 'react-icons/ai';
import { BsFillArrowUpRightCircleFill } from 'react-icons/bs';

import { client, urlFor } from '../client';
import { fetchUser } from '../utils';

const Pin = ({ pin: {postedBy, image, _id, destination, save}}) => {
    const [postHovered, setPostHovered] = useState(false);
    const [savingPost, setSavingPost] = useState(false);
    const [deletingPost, setDeletingPost] = useState(false);

    const navigate = useNavigate();

    const user = fetchUser();
    const alreadySaved = save?.some((item) => item.postedBy._id === user.sub);
    const reload = () => window.location.reload;
    const savePin = async (id) => {
        if(!alreadySaved) {
            setSavingPost(true);
            await client
                .patch(id)
                .setIfMissing({ save: [] })
                .insert('after','save[-1]', [{
                    _key: uuidv4(),
                    userId: user.sub,
                    postedBy: {
                        _type: 'postedBy',
                        _ref: user.sub
                    },
                }])
                .commit()
                .then(()=>{
                    reload();
                    setSavingPost(false);
                });
            };
        };

    const deletePin = async (id) => {
        deletingPost(true);
        await client.delete(id)
        .then(()=>{
            reload();
            deletingPost(false);
        })
    };
    const imgSaveDestButtonClass = 'rounded-3xl opacity-70 flex items-center justify-between hover:opacity-100 px-4 py-1 text-base hover:shadow-md outline-none font-bold';
    const imgIconDLDClass = 'bg-white w-9 h-9 rounded-full flex items-center justify-center text-dark text-xl opacity-75 hover:opacity-100 hover:shadow-md outline-none';

    return (
        <div className='m-2'>
            <div 
                onMouseEnter={() => setPostHovered(true)}
                onMouseLeave={() => setPostHovered(false)}
                onClick={() => navigate(`/pin-detail/${_id}`)}
                className='relative cursor-zoom-in w-auto hover:shadow-lg rounded-lg overflow-hidden transition-all duration-500 ease-in-out' >
                <img className='rounded-lg w-full' alt="user-post" src={urlFor(image).width(250).url()} />
                {postHovered && (
                    <div className='absolute top-0 w-full h-full flex flex-col justify-between p-1 pr-2 pt-2 pb-2 z-50'>
                        <div className='flex items-center justify-between'>
                            <div className='flex gap-2'>
                                <a 
                                    href={`${image?.asset?.url}?dl=`}
                                    download
                                    onClick={(e) => e.stopPropagation()}
                                    className={imgIconDLDClass}>
                                    <MdDownloadForOffline />
                                </a>
                            </div>
                            { alreadySaved ? (
                                <button 
                                    type='button' 
                                    className={`${imgSaveDestButtonClass} bg-red-500`}>
                                    {save?.length} Saved
                                </button>
                            ) : (
                                <button 
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        savePin(_id);
                                    }}
                                    type='button' 
                                    className={`${imgSaveDestButtonClass} bg-red-500`}>
                                    {savingPost ? 'Saving' : 'Save' }
                                </button>
                            )}
                        </div>
                        <div className='flex justify-between items-center gap-2 w-full'>
                            {destination && (
                                <a 
                                    href={destination}
                                    target='_blank'
                                    rel='noreferrer'
                                    className={`${imgSaveDestButtonClass} pl-2 bg-white`}>
                                        <span className='pr-2'><BsFillArrowUpRightCircleFill /></span>
                                        {destination.slice(8, 17)}
                                </a>
                            )}
                            {postedBy?._id === user.sub && (
                                <button 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    deletePin(_id);
                                }}
                                type='button' 
                                className={imgIconDLDClass}>
                                    <AiTwotoneDelete />
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </div>
            <Link to={`user-profile/${postedBy?._id}`} className='flex gap-2 mt-2 items-center'>
                <img 
                    className='w-8 h-8 rounded-full object-cover'
                    src={postedBy?.image} 
                    alt='user'/>
                    <p className='font-semibold capitalize'> 
                        {postedBy?.userName}
                    </p>
            </Link>
        </div>
  );
};

export default Pin;