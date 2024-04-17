import { Black_Logo } from '../assets/images';
import React, { useEffect, useState } from 'react';
import { useStateContext } from '../context/ContextProvider';
import { Link, Navigate, Outlet, useLocation } from 'react-router-dom';
import { CircleQuestion, Contact, CreditCard, Dashboard, DocumentUser, Info, Transaction, WhatsApp } from 'grommet-icons';
import { Cog8ToothIcon, BellIcon, TrashIcon, CubeTransparentIcon, UserIcon, CircleStackIcon, KeyIcon, CommandLineIcon, ClipboardDocumentIcon, TicketIcon, ArrowLeftStartOnRectangleIcon, ChevronRightIcon, ChevronDownIcon, ChevronUpIcon, } from '@heroicons/react/24/outline';

export default function DefaultLayout() {

  const location = useLocation();

  const { userToken, setCurrentUser, setUserToken } = useStateContext();
  const [ userToggler, setUserToggler ] = useState(false);
  const [ userToggler_01, setUserToggler_01 ] = useState(false);
  const [ userToggler_02, setUserToggler_02 ] = useState(false);
  const userName = localStorage.getItem('USER_NAME');
  const account_number = localStorage.getItem('ACCOUNT_NUMBER');

  const handleUserToggler = () => {
    setUserToggler(!userToggler)
    if(userToggler_01) {
      setUserToggler_01(!userToggler_01);
    }
    if(userToggler_02) {
    setUserToggler_02(!userToggler_02);
    }
  };

  const handleUserToggler_01 = () => {
    setUserToggler_01(!userToggler_01);
    if(userToggler_02) {
      setUserToggler_02(!userToggler_02);
    }
  };

  const handleUserToggler_02 = () => {
    setUserToggler_02(!userToggler_02);
  };

  if (!userToken) {
    return <Navigate to="/login" />;
  }

  const handleLogout = () => {
    localStorage.clear()
    setCurrentUser({});
    setUserToken(null);
  };

  return (
    <>
    <div onClick={userToggler ? handleUserToggler : ""} className='hidden sm:block'>
      <div className={`flex justify-between items-center shadow-sm shadow-slate-500 py-3 sm:px-2`}>
        <Link to={"/"}>
            <img
                src={Black_Logo}
                alt={'logo'}
                className='w-16 h-8'
            />
        </Link>
        <div>
          <ul className='flex justify-center items-center space-x-4 capitalize'>
            <li><Link to={"/default/customerdashboard"} className={`${location.pathname === "/default/customerdashboard" ? "bg-blue-950 opacity-75 text-slate-300 rounded-md px-3 py-1" : "hover:bg-blue-950 opacity-75 transform duration-300 ease-in-out rounded-md px-3 py-1 hover:text-slate-300"}`}>dashboard</Link></li>
            <li><Link to={"/default/wallet"} className={`${location.pathname === "/default/wallet" ? "bg-blue-950 opacity-75 text-slate-300 rounded-md px-3 py-1" : "hover:bg-blue-950 opacity-75 transform duration-300 ease-in-out rounded-md px-3 py-1 hover:text-slate-300"}`}>wallet</Link></li>
            <li><Link to={"/default/alltransactions"} className={`${location.pathname === "/default/alltransactions" ? "bg-blue-950 opacity-75 text-slate-300 rounded-md px-3 py-1" : "hover:bg-blue-950 opacity-75 transform duration-300 ease-in-out rounded-md px-3 py-1 hover:text-slate-300"}`}>transactions</Link></li>
            <li><Link to={"/default/profile"} className={`${location.pathname === "/default/profile" ? "bg-blue-950 opacity-75 text-slate-300 rounded-md px-3 py-1" : "hover:bg-blue-950 opacity-75 transform duration-300 ease-in-out rounded-md px-3 py-1 hover:text-slate-300"}`}>profile</Link></li>
            <li><Link to={"/default/faq"} className={`${location.pathname === "/default/faq" ? "bg-blue-950 opacity-75 text-slate-300 rounded-md px-3 py-1" : "hover:bg-blue-950 opacity-75 transform duration-300 ease-in-out rounded-md px-3 py-1 hover:text-slate-300"}`}>FAQ</Link></li>
            <li><Link to={"/default/contactus"} className={`${location.pathname === "/default/contactus" ? "bg-blue-950 opacity-75 text-slate-300 rounded-md px-3 py-1" : "hover:bg-blue-950 opacity-75 transform duration-300 ease-in-out rounded-md px-3 py-1 hover:text-slate-300"}`}>contact</Link></li>
          </ul>
        </div>
        <div className='flex justify-normal items-center space-x-8'>
          <div className='flex justify-normal items-center space-x-4 rounded-md hover:bg-blue-950 opacity-75 transform duration-300 ease-in-out'>
            <BellIcon className='w-7 h-7 cursor-pointer hover:text-white p-1'/>
          </div>
          <div className='flex flex-col justify-normal items-center space-x-4 capitalize'>
            <div className='flex justify-normal items-center space-x-4'>
              {/* <div>
                <p className='font-semibold text-slate-600 text-sm italic'>User Name: <span className='opacity-75 '>{userName}</span></p>
                <p className='font-semibold text-slate-600 text-xs italic'>Account Number: <span className='opacity-75 '>{account_number}</span></p>
              </div> */}
              <div className='flex justify-normal items-center'>
                <UserIcon className='w-8 h-8 border-2 border-black rounded-full'/>
                <ChevronDownIcon className={`w-5 h-5 cursor-pointer ${userToggler ? "hidden" : ""}`} onClick={handleUserToggler}/>
                <ChevronUpIcon className={`w-5 h-5 cursor-pointer ${!userToggler ? "hidden" : ""}`} onClick={handleUserToggler}/>
              </div>
            </div>
          </div>
        </div>
      </div>
    <Outlet />
    </div>
    {userToggler &&
    <div className='absolute top-16 sm:top-16 sm:right-8 right-2 w-32 shadow-md shadow-slate-500 rounded-md px-2 text-sm capitalize bg-white z-30' onClick={userToggler ? "" : handleUserToggler}>
      <ul className='flex flex-col justify-normal space-y-4 my-2'>
        <li className='flex justify-normal items-center cursor-pointer hover:bg-blue-950 hover:opacity-75 rounded-md hover:text-white transform duration-300 ease-in-out hover:px-1'>
          <span><UserIcon className='w-4 h-4 mr-2' /></span>
          profile
        </li>
        <li 
          onClick={handleUserToggler_01} 
          className='flex justify-normal items-center cursor-pointer hover:bg-blue-950 hover:opacity-75 rounded-md hover:text-white transform duration-300 ease-in-out hover:px-1'>
            <span><Cog8ToothIcon className='w-4 h-4 mr-2' /></span>
            settings
            {!userToggler_01 && <span><ChevronRightIcon className='w-4 h-4 mx-4'/></span>}
            {userToggler_01 && <span><ChevronDownIcon className='w-4 h-4 mx-4'/></span>}
        </li>
        <li 
          onClick={handleUserToggler_02}
          className='flex justify-normal items-center cursor-pointer hover:bg-blue-950 hover:opacity-75 rounded-md hover:text-white transform duration-300 ease-in-out hover:px-1'>
            <span><ClipboardDocumentIcon className='w-4 h-4 mr-2' /></span>
            policies
            {!userToggler_02 && <span><ChevronRightIcon className='w-4 h-4 mx-4'/></span>}
            {userToggler_02 && <span><ChevronDownIcon className='w-4 h-4 mx-4'/></span>}
        </li>
        <li onClick={handleLogout} className='flex justify-normal items-center cursor-pointer hover:bg-blue-950 hover:opacity-75 rounded-md hover:text-white transform duration-300 ease-in-out hover:px-1'><span><ArrowLeftStartOnRectangleIcon className='w-4 h-4 mr-2' /></span>logout</li>
      </ul>
    </div>
    }
    {userToggler_01 &&<div className='absolute top-36 sm:top-36 right-2 sm:right-0 bg-slate-100 w-40 rounded-md capitalize z-30'>
      <ul className='flex flex-col justify-normal space-y-4 px-2 my-2 text-sm'>
        <li className='flex justify-normal items-center cursor-pointer hover:bg-blue-950 hover:opacity-75 rounded-md hover:text-white transform duration-300 ease-in-out hover:px-1'><span><TrashIcon className='w-4 h-4 mr-2' /></span>delete account</li>
        <li className='flex justify-normal items-center cursor-pointer hover:bg-blue-950 hover:opacity-75 rounded-md hover:text-white transform duration-300 ease-in-out hover:px-1'><span><CubeTransparentIcon className='w-4 h-4 mr-2' /></span>change password</li>
      </ul>
    </div>}
    {userToggler_02 &&<div className='absolute top-44 right-2 sm:right-0 bg-slate-100 w-40 rounded-md capitalize z-30'>
      <ul className='flex flex-col justify-normal space-y-4 px-2 my-2 text-sm'>
        <Link to={"https://www.ibedc.com/privacy"} target='_blank'><li className='flex justify-normal items-center cursor-pointer hover:bg-blue-950 hover:opacity-75 rounded-md hover:text-white transform duration-300 ease-in-out hover:px-1'><span><KeyIcon className='w-4 h-4 mr-2' /></span>privacy policy</li></Link>
        <Link to={"https://www.ibedc.com/terms-of-service"} target='_blank'><li className='flex justify-normal items-center cursor-pointer hover:bg-blue-950 hover:opacity-75 rounded-md hover:text-white transform duration-300 ease-in-out hover:px-1'><span><CommandLineIcon className='w-4 h-4 mr-2' /></span>terms of service</li></Link>
        <li className='flex justify-normal items-center cursor-pointer hover:bg-blue-950 hover:opacity-75 rounded-md hover:text-white transform duration-300 ease-in-out hover:px-1'><span><CircleStackIcon className='w-4 h-4 mr-2' /></span>data protection policy</li>
        <li className='flex justify-normal items-center cursor-pointer hover:bg-blue-950 hover:opacity-75 rounded-md hover:text-white transform duration-300 ease-in-out hover:px-1'><span><TicketIcon className='w-4 h-4 mr-2' /></span>terms and conditions</li>
      </ul>
    </div>}

    {/* Mobile View */}
    <div className='sm:hidden'>
      <div className='shadow-sm shadow-slate-500 w-full h-full flex justify-between py-2 px-1'>
          <Link to={"/"}>
              <img
                  src={Black_Logo}
                  alt={'logo'}
                  className='w-16 h-8'
                  />
          </Link>
          <div className='flex flex-col justify-normal items-center space-x-4 capitalize'>
            <div className='flex justify-normal items-center space-x-4'>
              <div>
                <p className='font-semibold text-slate-600 text-xs italic'>User: <span className='opacity-75 '>{userName}</span></p>
                <p className='font-semibold text-slate-600 text-xs italic'>Acct NO: <span className='opacity-75 '>{account_number}</span></p>
              </div>
              <div className='flex justify-normal items-center'>
                <UserIcon className='w-6 h-6 border-2 border-black rounded-full'/>
                <ChevronDownIcon className={`w-5 h-5 cursor-pointer ${userToggler ? "hidden" : ""}`} onClick={handleUserToggler}/>
                <ChevronUpIcon className={`w-5 h-5 cursor-pointer ${!userToggler ? "hidden" : ""}`} onClick={handleUserToggler}/>
              </div>
            </div>
          </div>
      </div>
      <div className='flex'>
      <div className='shadow-sm shadow-slate-500 w-1/4 py-4 flex flex-col justify-between'>
        <ul className='flex flex-col justify-normal items-center space-y-8'>
          <li><Link to={"/default/customerdashboard"} className={`${location.pathname === "/default/customerdashboard" ? "bg-blue-950 opacity-75 rounded-md px-3 py-2" : " "}`}><Dashboard /></Link></li>
          <li><Link to={"/default/wallet"} className={`${location.pathname === "/default/wallet" ? "bg-blue-950 opacity-75  rounded-md px-3 py-2" : " "}`}><CreditCard /></Link></li>
          <li><Link to={"/default/alltransactions"} className={`${location.pathname === "/default/alltransactions" ? "bg-blue-950 opacity-75 text-slate-300 rounded-md px-3 py-2" : " "}`}><Transaction /></Link></li>
          <li><Link to={"/default/profile"} className={`${location.pathname === "/default/profile" ? "bg-blue-950 opacity-75 text-slate-300 rounded-md px-3 py-2" : " "}`}><DocumentUser /></Link></li>
          <li><Link to={"/default/faq"} className={`${location.pathname === "/default/faq" ? "bg-blue-950 opacity-75 text-slate-300 rounded-md px-3 py-2" : " "}`}><CircleQuestion /></Link></li>
          <li><Link to={"/default/contactus"} className={`${location.pathname === "/default/contactus" ? "bg-blue-950 opacity-75 text-slate-300 rounded-md px-3 py-2" : " "}`}><Contact /></Link></li>
        </ul>
        <div className='text-white'>
        <p>.</p>
        <p>.</p>
        <p>.</p>
        <p>.</p>
        <p>.</p>
        <p>.</p>
        <p>.</p>
        <p>.</p>
        <p>.</p>
        <p>.</p>
        </div>
        <div className='text-xs flex flex-col justify-center items-center'>
          <WhatsApp />
          <p>07059093900</p>
        </div>
      </div>
      <Outlet />
      </div>
    </div>
    </>
  )
}
