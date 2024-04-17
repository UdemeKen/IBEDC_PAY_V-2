import React, { useState } from 'react';
import { Form, Link, useNavigate } from 'react-router-dom';
import { FormView, FormViewHide } from 'grommet-icons';
import axios from 'axios';
import { toast } from 'react-toastify';


const Accept = 'application/json';
const appSecret = 'SK_161719MDUKDCMEU_45@MUDCaPP0921SDK_VSION11';
const appToken = 'TK_161719MDUKDCMEU_45@MUDCaPP0921SDK_TK190MD';
const registerCustomerUrl = 'https://ipay.ibedc.com:7642/api/V2_ibedc_OAUTH_tokenReviwed/registration';

export default function Signup() {
    const navigate = useNavigate();

    const [ fullName, setFullNmae ] = useState('');
    const [ email, setEmail ] = useState('');
    const [ phoneNumber, setPhoneNumber ] = useState('');
    const [ password, setPassword ] = useState('');
    const [ showPassword, setShowPassword ] = useState(false);
    const [ buttonDisabled, setButtonDisabled ] = useState(false);
    const [ loading, setLoading ] = useState(false);

    const requestData = {
        "name": fullName,
        "email": email,
        "phone": phoneNumber,
        "password": password
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setButtonDisabled(true);

        try {
            const response = await axios.post(registerCustomerUrl, requestData, {
                headers: {
                    'Accept': Accept,
                    'appsecret': appSecret,
                    'apptoken': appToken,
                }
            });
            toast.success(response?.data?.message);
            localStorage.setItem('USER_EMAIL', response?.data?.payload?.payload?.email);
            navigate('/pinverification');
            setLoading(false);
            setButtonDisabled(false);
            setFullNmae('');
            setEmail('');
            setPhoneNumber('');
            setPassword('');
        }catch(error) {
            toast.error(error.response.data.payload.email);
            toast.error(error.response.data.payload.phone);
            setLoading(false);
            setButtonDisabled(false);
            setFullNmae('');
            setEmail('');
            setPhoneNumber('');
            setPassword('');
        }
    };

    const showPasswordHandler = () => {
        setShowPassword(!showPassword);
    };
    
  return (
    <section className='sm:w-2/3 w-full'>
        <div className='sm:block w-full h-screen sm:h-full flex flex-col justify-center items-center'>
            <div className='flex justify-center w-full'>
                <div className='flex flex-col items-center justify-center w-3/4'>
                    <div className='mb-5'>
                        <h1 className='font-bold capitalize text-3xl text-blue-900 text-center'>customer registration</h1>
                    </div>
                    <form className='flex flex-col justify-center space-y-3 xs:w-64 w-4/5' 
                    onSubmit={handleSubmit}
                    >
                        <div>
                        <label className='block text-sm font-medium text-slate-600 capitalize'>
                        full name
                        </label>
                        <div className="">
                            <input
                            type="text"
                            id="fullName"
                            autoComplete="text"
                            value={fullName}
                            onChange={(e) => setFullNmae(e.target.value)}
                            required
                            name="fullName"
                            placeholder='Enter your your full name'
                            className="block w-full rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-slate-600 text-sm sm:leading-6"
                            />
                        </div>
                        </div>
                            <div>
                            <label className='block text-sm font-medium text-slate-600 capitalize'>
                            email address
                            </label>
                            <div className="">
                                <input
                                type="email"
                                id="email"
                                autoComplete="text"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                name="email address"
                                placeholder='Enter your email address'
                                className="block w-full rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-slate-600 text-sm sm:leading-6"
                                />
                            </div>
                            </div>
                            <div>
                            <label className='block text-sm font-medium text-slate-600 capitalize'>
                            phone number
                            </label>
                            <div className="">
                                <input
                                type="text"
                                id="phone number"
                                autoComplete="text"
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                required
                                name="phone number"
                                placeholder='Enter your phone number'
                                className="block w-full rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-slate-600 text-sm sm:leading-6"
                                />
                            </div>
                            </div>
                            <div>
                            <label className='block text-sm font-medium text-slate-600 capitalize'>
                            password
                            </label>
                            <div className="relative">
                                <span className='absolute inset-y-0 right-0 mx-2 cursor-pointer' onClick={showPasswordHandler}>
                                    {showPassword ? <FormView className='mt-2'/> : <FormViewHide className='mt-1'/>}
                                </span>
                                <input
                                type={showPassword ? 'text' : 'password'}
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                name="password"
                                placeholder='Enter your password'
                                className="block w-full rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-slate-600 text-sm sm:leading-6"
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
                        <div className='flex flex-col justify-center items-center space-y-12 text-slate-500'>
                            <div className='text-xs mt-6 font-semibold text-center'>
                                <p className=''>Already an IBEDC Customer? <span className='text-orange-500'><Link to={"/login"}>Login</Link></span></p>
                            </div>
                        </div>
                    </form>
                    <div className='text-xs font-semibold text-slate-500 my-5 text-center'>
                        <p>By clicking on Sign up, you agree to our <span className='text-orange-500'><Link to={"https://www.ibedc.com/terms-of-service"} target='_blank'>terms & conditions</Link></span> and <span className='text-orange-500'><Link to={"https://www.ibedc.com/privacy"} target='_blank'>privacy policy</Link></span></p>
                    </div>
                </div>
            </div>
        </div>
    </section>
  )
}
