import React, { useState } from 'react';
import { ExclamationCircleIcon, ChevronLeftIcon } from '@heroicons/react/24/outline';
import { Link, useNavigate } from 'react-router-dom';
import axiosClient from '../../axios';
import { toast } from 'react-toastify';

const forgotPasswordUrl = '/forgot-password';

export default function ForgotPassword() {

    const navigate = useNavigate();
    const [ loading, setLoading ] = useState(false);
    const [ buttonDisabled, setButtonDisabled ] = useState(false);
    const [ email, setEmail ] = useState('');

    const requestData = {
        email: email,
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setButtonDisabled(true);

        try {
            const response = await axiosClient.post(forgotPasswordUrl, requestData);
            console.log(response);
            toast.success(response?.data?.message);
            localStorage.setItem('USER_EMAIL', response?.data?.payload?.payload?.email);
            navigate('/verifypassword');
            setLoading(false);
            setButtonDisabled(false);
        }catch(error) {
            console.log(error?.response?.data?.payload);
            toast.error(error?.response?.data?.payload)
            setLoading(false);
            setButtonDisabled(false);
        };
    }

  return (
    <section>
        <div className='flex justify-center items-center h-screen'>
            <div className='bg-slate-300 flex flex-col justify-center items-center rounded-lg p-10 space-y-4'>
                <ExclamationCircleIcon className='w-20 h-20 text-orange-500'/>
                <div className='flex flex-col justify-center items-center space-y-4 text-center'>
                    <h1 className='text-xl capitalize font-semibold font-sans'>forgot password</h1>
                    <p>Enter your email and we'll send you a code to reset your password</p>
                    <form className='flex flex-col justify-center space-y-8 xs:w-64 w-4/5' 
                    onSubmit={handleSubmit}
                    >
                        <div>
                        <div className="">
                            <input
                            type="email"
                            id="email"
                            autoComplete="on"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            name="email address"
                            placeholder='Enter your email address'
                            className="block w-full rounded-md border-1 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 bg-transparent placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-slate-600 text-sm sm:leading-6"
                            />
                        </div>
                        </div>
                        <div className='flex flex-col justify-center items-center'>
                        <button
                        type="submit"
                        disabled={buttonDisabled}
                        className={`w-full rounded-md py-1 text-sm font-semibold leading-6 shadow-sm transition duration-300 ease-in-out ${
                            (buttonDisabled)
                            ? 'w-full bg-blue-950 opacity-30 text-white cursor-not-allowed '
                            : 'w-full bg-blue-950 opacity-75 text-white hover:bg-orange-500 hover:bg-opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-900'
                        }`}
                        onClick={handleSubmit}
                        >
                        {!loading && <p>Sign up</p>}
                        {loading && 
                        <div className='flex flex-row justify-center space-x-2'>
                            <div>
                                <svg className="w-5 h-5 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                    </div>
                                <div>
                                <span class="font-medium"> Processing... </span>
                            </div>
                        </div>
                        }
                        </button>
                        </div>
                        <div className='flex justify-center items-center'>
                            {/* <ChevronLeftIcon className='w-5 h-5' /> */}
                            <Link to={"/"} className='bg-slate-950 opacity-50 text-white px-2 hover:px-3 transform duration-300 ease-in-out rounded-md'>Back to Login</Link>
                        </div>
                        </form>
                </div>
            </div>
        </div>
    </section>
  )
}
