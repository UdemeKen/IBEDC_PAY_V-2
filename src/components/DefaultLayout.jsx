import { Black_Logo } from '../assets/images';
import React, { useEffect, useState } from 'react';
import { useStateContext } from '../context/ContextProvider';
import { toast } from 'react-toastify';
import { Link, Navigate, Outlet, useLocation } from 'react-router-dom';
import { CircleQuestion, Contact, CreditCard, Home, Dashboard, DocumentUser, Info, Transaction, WhatsApp } from 'grommet-icons';
import { Cog8ToothIcon, BellIcon, TrashIcon, CubeTransparentIcon, UserIcon, CircleStackIcon, KeyIcon, CommandLineIcon, ClipboardDocumentIcon, TicketIcon, ArrowLeftStartOnRectangleIcon, ChevronRightIcon, ChevronDownIcon, ChevronUpIcon, } from '@heroicons/react/24/outline';
import axiosClient from '../axios';
import Modal from 'react-modal';

const deleteAccountUrl = '/V2_ibedc_OAUTH_tokenReviwed/delete/remove-account';
const changePasswordUrl = '/V2_ibedc_OAUTH_tokenReviwed/change-password';
const forgotPasswordUrl = '/V2_ibedc_OAUTH_tokenReviwed/forgot-password';
const pinVerificationUrl = '/V2_ibedc_OAUTH_tokenReviwed/verify-pin';

export default function DefaultLayout() {

  const location = useLocation();

  const { userToken, setCurrentUser, setUserToken } = useStateContext();
  const [ userToggler, setUserToggler ] = useState(false);
  const [ userToggler_01, setUserToggler_01 ] = useState(false);
  const [ userToggler_02, setUserToggler_02 ] = useState(false);
  const [ loading, setLoading ] = useState(false);
  const [ isModalOpen, setIsModalOpen ] = useState(false);
  const [ password, setPassword ] = useState('');
  const [ confirmPassword, setConfirmPassword ] = useState('');
  const [ isVerifyModalOpen, setIsVerifyModalOpen ] = useState(false);
  const [ pin, setPin ] = useState('');
  const [ enteredPin, setEnteredPin ] = useState('');
  const [ isSendingPin, setIsSendingPin ] = useState(false);
  const [isVerifyingPin, setIsVerifyingPin] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const userEmail = localStorage.getItem('USER_EMAIL');
  const userName = localStorage.getItem('USER_NAME');
  const userId = localStorage.getItem('USER_ID');
  const account_number = localStorage.getItem('USER_METER_NUMBER');

  const handleSendPin = async () => {
    setIsSendingPin(true);
    try {
      const response = await axiosClient.post(forgotPasswordUrl, {
        "email": userEmail
      });
      console.log(response);
      setIsVerifyModalOpen(true);
    } catch (error) {
      console.log(error);
    } finally {
      setIsSendingPin(false);
    }
  };

  const handleVerifyPin = async (e) => {
    e.preventDefault();
    setIsVerifyingPin(true);
    try {
      const response = await axiosClient.post(pinVerificationUrl, {
        "email": userEmail,
        "pin": enteredPin,
      });
      console.log(response.data?.message);
      toast.success(response?.data?.message);
      setIsVerifyModalOpen(false);
      setIsModalOpen(true);
    } catch (error) {
      console.log(error?.response?.data?.payload);
      toast.error(error?.response?.data?.payload);
    } finally {
      setIsVerifyingPin(false);
    }
  };

  const handleChangePassword = () => {
    handleSendPin();
  }

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setIsChangingPassword(true);

    if (password === confirmPassword) {
      try {
        const response = await axiosClient.post(changePasswordUrl, {
          "email": userEmail,
          "password": password,
          "confirm_password": confirmPassword,
          "pin": enteredPin,
        });
        console.log(response);
        toast.success("Password changed successfully");
        setIsModalOpen(false);
      } catch (error) {
        console.log(error);
      } finally {
        setIsChangingPassword(false);
      }
      } else {
        console.log("Passwords do not match");
        toast.error("Passwords do not match");
        setIsChangingPassword(false);
      }
  }

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
    return <Navigate to="/" />;
  }

  const deleteAccount = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axiosClient.post(deleteAccountUrl, {
        user_id: userId
      }
    );
      console.log(response);
      setLoading(false);
      toast.success(response?.data?.message);
      window.location.reload()
    }catch(error) {
      console.log(error);
      setLoading(false);
      toast.error(error.response?.data?.message);
    }
  };

  const handleLogout = () => {
    localStorage.clear()
    setCurrentUser({});
    setUserToken(null);
  };

  return (
    <section className='bg-white bg-cover w-full'>
      <Modal
        isOpen={isVerifyModalOpen}
        onRequestClose={() => setIsVerifyModalOpen(false)}
        contentLabel="Verify Email"
        className="flex justify-center my-40 w-full"
      >
        <div className="flex flex-col justify-center items-center shadow-lg shadow-slate-500 sm:w-80 rounded-xl bg-slate-200">
          <h2 className='underline'>Verify Email</h2>
          <form onSubmit={handleVerifyPin} className='flex flex-col justify-center'>
            <label className='flex flex-col'>
              Enter PIN:
              <input
                type="text"
                value={enteredPin}
                onChange={(e) => setEnteredPin(e.target.value)}
                required
                className='bg-transparent rounded-lg'
              />
            </label>
            <div className='flex justify-between my-4'>
              <button type="submit" className='bg-slate-500 hover:bg-orange-500 opacity-75 px-4 transform duration-300 ease-in-out rounded-lg'>
                {isVerifyingPin ? (
                  <svg className="w-5 h-5 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  'Verify'
                )}
              </button>
              <button type="button" className='bg-slate-500 hover:bg-orange-500 opacity-75 px-4 transform duration-300 ease-in-out rounded-lg' onClick={() => setIsVerifyModalOpen(false)}>Cancel</button>
            </div>
          </form>
        </div>
      </Modal>

      <Modal
      isOpen={isModalOpen}
      onRequestClose={handleCloseModal}
      contentLabel="Change Password"
      className="flex justify-center my-40 w-full"
    >
      <div className="flex flex-col justify-center items-center shadow-lg shadow-slate-500 sm:w-80 rounded-xl bg-slate-200">
      <h2 className='underline'>Change Password</h2>
      <form onSubmit={handlePasswordChange} className='flex flex-col justify-center'>
        <label className='flex flex-col'>
          Password:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className='bg-transparent rounded-lg'
          />
        </label>
        <label className='flex flex-col'>
          Confirm Password:
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className='bg-transparent rounded-lg'
          />
        </label>
        <div className='flex justify-between my-4'>
          <button type="submit" className='bg-slate-500 hover:bg-orange-500 opacity-75 px-4 transform duration-300 ease-in-out rounded-lg'>
            {isChangingPassword ? (
              <svg className="w-5 h-5 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              'Submit'
            )}
          </button>
          <button type="button" className='bg-slate-500 hover:bg-orange-500 opacity-75 px-4 transform duration-300 ease-in-out rounded-lg' onClick={handleCloseModal}>Cancel</button>
        </div>
      </form>
      </div>
    </Modal>
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
            {/* <li><Link to={"/default/wallet"} className={`${location.pathname === "/default/wallet" ? "bg-blue-950 opacity-75 text-slate-300 rounded-md px-3 py-1" : "hover:bg-blue-950 opacity-75 transform duration-300 ease-in-out rounded-md px-3 py-1 hover:text-slate-300"}`}>wallet</Link></li> */}
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
                <p className='font-semibold text-slate-600 tex=t-xs italic'>Account Number: <span className='opacity-75 '>{account_number}</span></p>
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
        <Link to={"/default/profile"} className='flex justify-normal items-center cursor-pointer hover:bg-blue-950 hover:opacity-75 rounded-md hover:text-white transform duration-300 ease-in-out hover:px-1'>
          <span><UserIcon className='w-4 h-4 mr-2' /></span>
          profile
        </Link>
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
        <li onClick={deleteAccount} className='flex justify-normal items-center cursor-pointer hover:bg-blue-950 hover:opacity-75 rounded-md hover:text-white transform duration-300 ease-in-out hover:px-1'><span><TrashIcon className='w-4 h-4 mr-2' /></span>
        {!loading && <p>delete account</p>}
        {loading && 
        <div className='flex flex-row justify-center space-x-2'>
            <div>
                <svg className="w-5 h-5 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    </div>
                <div>
                <span class="font-medium"> Deleting... </span>
            </div>
        </div>
        }
        </li>
        <li onClick={handleChangePassword} className='flex justify-normal items-center cursor-pointer hover:bg-blue-950 hover:opacity-75 rounded-md hover:text-white transform duration-300 ease-in-out hover:px-1'>
          <span><CubeTransparentIcon className='w-4 h-4 mr-2' /></span>
          password
        </li>
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
          <li><Link to={"/default/customerdashboard"} className={`${location.pathname === "/default/customerdashboard" ? "bg-blue-950 opacity-75 rounded-md px-3 py-2" : " "}`}><Home /></Link></li>
          {/* <li><Link to={"/default/wallet"} className={`${location.pathname === "/default/wallet" ? "bg-blue-950 opacity-75  rounded-md px-3 py-2" : " "}`}><CreditCard /></Link></li> */}
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

    {isSendingPin && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="flex items-center justify-center space-x-2">
            <svg className="w-8 h-8 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span className="text-white">Sending PIN...</span>
          </div>
        </div>
      )}
    </section>
  )
}
