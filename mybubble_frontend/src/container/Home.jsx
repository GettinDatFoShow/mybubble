import React, { useState, useRef, useEffect } from 'react'
import { HiMenu } from 'react-icons/hi';
import { AiFillCloseCircle } from 'react-icons/ai';
import { Link, Route, Routes } from 'react-router-dom';
import { UserProfile, Sidebar, Login } from '../components';
import { client } from '../client';
import logo from '../assets/logo.png';
import Pins from './Pins';
import { userQuery } from '../utils.js/data';

const Home = () => {
  const [toggleSidebar, setToggleSidebar] = useState(false);
  const [user, setUser] = useState(null);
  const userInfo = localStorage.getItem('user') !== 'undefined' ? JSON.parse(localStorage.getItem('user')) : localStorage.clear();
  useEffect(() => {
    console.log(userInfo);
    const query = userQuery(userInfo?.sub);
    client.fetch(query)
      .then((data)=> {
        console.log(data);
        setUser(data[0]);
      });
  }, [])
  
  return (
    <div className='flex bg-grey-50 md:flex-row flex-col h-screen transaction-height duration-75 ease-out'>
      <div className='hidden md:flex h-screen flex-initial'>
        <Sidebar user={user && user}/>
      </div>
      <div className='flex md:hidden flex-row'>
        <HiMenu fontSize={40} className='cursor-point' onClick={()=>setToggleSidebar(true)}/>
        <Link to='/'>
          <img src={logo} alt='logo' className='w-28' />
        </Link>
        <Link to={`user-profile/${user?._id}`}>
          <img src={user?.image} alt='profile-image' className='w-28' />
        </Link>
      </div>
      {toggleSidebar && (
        <div className='fixed w-4/5 bg-white h-screen overflow-y-auto shadow-md z-10 animate-slide-in'>
          <div className='absolute w-full flex justify-end items-center p-2' >
            <AiFillCloseCircle fontSize={30} className='cursor-pointer' onClick={()=>setToggleSidebar(false)}/>
          </div>
          <Sidebar user={user && user} closeToggle={setToggleSidebar}/>
        </div>
      )}
    </div>
  )
}

export default Home;