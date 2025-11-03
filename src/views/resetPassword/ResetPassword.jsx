import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import axiosClient from '../../axios';
import { FormView, FormViewHide } from 'grommet-icons';
import { toast } from 'react-toastify';

const resetPasswordUrl = '/V3_OUTRIBD_iOAUTH_markedxMONITOR/change-password';

export default function ResetPassword() {

    const navigate = useNavigate();

    const userEmail = localStorage.getItem('USER_EMAIL');
    const userCode = localStorage.getItem('USER_CODE');

    const [ loading, setLoading ] = useState(false);
    const [ buttonDisabled, setButtonDisabled ] = useState(false);
    const [ password, setPassword ] = useState('');
    const [ confirmPassword, setConfirmPassword ] = useState('');
    const [ showPassword_01, setShowPassword_01 ] = useState(false);
    const [ showPassword_02, setShowPassword_02 ] = useState(false);

    const requestData = {
        email: userEmail,
        password: password,
        confirm_password: confirmPassword,
        pin: userCode
    }



    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setButtonDisabled(true);

        try {
            const response = await axiosClient.post(resetPasswordUrl, requestData);
            console.log(response);
            toast.success('Password reset successfully!');
            navigate('/')
        } catch (error) {
            console.log(error);
            toast.error('Error resetting password!');
        } finally {
            setLoading(false);
            setButtonDisabled(false);
        }
    };

    const showPasswordToggler_01 = () => {
        setShowPassword_01(!showPassword_01);
    }

    const showPasswordToggler_02 = () => {
        setShowPassword_02(!showPassword_02);
    }

  return (
    <section>
        <div className='flex justify-center items-center h-screen'>
            <div className='bg-slate-300 flex flex-col justify-center items-center rounded-lg p-10 space-y-4 w-1/2'>
                <div className='flex flex-col justify-center items-center space-y-4 w-full'>
                    <h1 className='text-xl capitalize font-semibold font-sans text-center'>reset password</h1>
                    <form className='flex flex-col justify-center space-y-8 xs:w-64 w-full' 
                    onSubmit={handleSubmit}
                    >
                        <div className="">
                        <label htmlFor="password" className='text-sm font-semibold'>New Password</label>
                        <div className="relative">
                        <span className='absolute inset-y-0 right-0 top-1 mr-5 cursor-pointer' onClick={showPasswordToggler_01}>
                        {showPassword_01 ? <FormView className='mt-1'/> : <FormViewHide className='mt-1'/>}
                        </span>
                            <input
                            type={showPassword_01 ? 'text' : 'password'}
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            name="password"
                            placeholder='Enter new password'
                            className="block w-full rounded-md border-1 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 bg-transparent placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-slate-600 text-sm sm:leading-6"
                            />
                        </div>
                        </div>
                        <div className="">
                        <label htmlFor="password" className='text-sm font-semibold'>Confirm New Password</label>
                        <div className="relative">
                        <span className='absolute inset-y-0 right-0 top-1 mr-5 cursor-pointer' onClick={showPasswordToggler_02}>
                        {showPassword_02 ? <FormView className='mt-1'/> : <FormViewHide className='mt-1'/>}
                        </span>
                            <input
                            type={showPassword_02 ? 'text' : 'password'}
                            id="confirmpassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            name="confirm password"
                            placeholder='Enter confirmed password'
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
                        >
                        {!loading && <p>Reset</p>}
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
                        </form>
                </div>
            </div>
        </div>
    </section>
  )
}
