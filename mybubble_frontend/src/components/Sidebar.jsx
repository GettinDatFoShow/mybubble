import React from 'react'
import { NavLink, Link } from 'react-router-dom';
import { RiHomeFill } from 'react-icons/ri';
import { IoIosArrowForward } from 'react-icons/io';

import logo from '../assets/logo.png';

const isNotActiveStyle = 'flex items-center px-5 gap-3 text-grey-500 hover:text-black transition-all duration-200 ease-in-out capitalize';
const isActiveStyle = 'flex items-center px-5 gap-3 font-extrabold border-r-2 border-r-black transition-all duration-200 ease-in-out capitalize';

const Sidebar = ({user, closeToggle}) => {

    const handleCloseSidebar = () => {
        if(closeToggle) {
            closeToggle(false);
        } 
    }

    const categories = [
        {name : 'Animals'},
        {name : 'Food'},
        {name : 'Gaming'},
        {name : 'Photography'},
        {name : 'WallPapers'},
        {name : 'Other'},
    ]
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
                    <h3 className='mt-2 px-5 text-base 2xl:text-xl'>Discover Catergories</h3>
                    {categories.slice(0, categories.length - 1).map( (category) =>(
                        <NavLink 
                            to={`/category/${category.name}`}
                            className={({ isActive }) => isActive ? isActiveStyle : isNotActiveStyle}
                            key={category.name}
                            onClick={handleCloseSidebar}
                        >{category.name}</NavLink>
                    ))}
                </div>
            </div>
            {user && (
                <Link to={`/user-profile/${user._id}`}
                className='flex my-5 gap-2 p-2 items-center bg-white rounded-lg shadow-lg mx-3'
                onClick={handleCloseSidebar}>
                    <img src={user.image} className='w-10 h-10 rounded-full' alt='user-profile' />
                    <p>{user.userName}</p>
                </Link>
            )}
        </div>
    )
}   

export default Sidebar