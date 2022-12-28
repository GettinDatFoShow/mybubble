import React, { useEffect, useState } from 'react'
import { NavLink, Link } from 'react-router-dom';
import { RiHomeFill } from 'react-icons/ri';
import { IoIosArrowForward } from 'react-icons/io';

import logo from '../assets/logo.png';
import { fetchCategories } from '../utils';

const isNotActiveStyle = 'flex items-center px-5 gap-3 text-grey-500 hover:text-black transition-all duration-200 ease-in-out capitalize';
const isActiveStyle = 'flex items-center px-5 gap-3 font-extrabold border-r-2 border-r-black transition-all duration-200 ease-in-out capitalize';

const Sidebar = ({user, closeToggle}) => {
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState();

    useEffect(() => {
        // setLoading(true);
         fetchCategories().then((data) => { 
            console.log('Fetching all categories...');
            console.log(data);
            setCategories(data);
            setLoading(false);
        }).catch((error) => {
            console.error(error);
            // setLoading(false);
        })
    },[]);

    const handleCloseSidebar = () => {
        if(closeToggle) {
            closeToggle(false);
        } 
    }

    return (
        <div className='flex flex-col justify-between bg-white h-full overflow-y-scroll min-w-210 hide-scroll'>
            <div className='flex flex-col'>
                <Link to="/" 
                    className="flex px-5 gap-2 my-6 pt-1 w-190 items-center"
                    onClick={handleCloseSidebar}>
                    <img src={logo} className='w-full' alt='logo'/>
                </Link>
                <div className='flex flex-col gap-5'>
                    <NavLink to="/" className={({ isActive }) => isActive ? isActiveStyle : isNotActiveStyle}
                        onClick={handleCloseSidebar}>
                        <RiHomeFill />
                        Home
                    </NavLink>
                    <div className='flex flex-col gap-5 overflow-y-hidden'>
                        <h3 className='mt-2 px-5 text-base 2xl:text-xl'>Discover Catergories</h3>
                        {categories?.map( (category) =>(
                            <NavLink 
                                to={`/category/${category.name}`}
                                className={({ isActive }) => isActive ? isActiveStyle : isNotActiveStyle}
                                key={category.name}
                                onClick={handleCloseSidebar}
                            >
                            <img src={category?.imageUrl} 
                            alt='category-image'  
                            className='w-8 h-8 rounded-full'/>
                            {category.name}</NavLink>
                        ))}
                    </div>
                </div>
            </div>
            {user && (
                <Link to={`/user-profile/${user._id}`}
                className='flex my-5 gap-2 py-2 px-3 items-center bg-slate-400 rounded-lg shadow-lg mx-3'
                onClick={handleCloseSidebar}>
                    <img src={user?.image} className='w-10 h-10 rounded-full' alt='user' />
                    <p className='font-semibold capitalize'> 
                        {user?.userName}
                    </p>
                </Link>
            )}
        </div>
    )
}   

export default Sidebar