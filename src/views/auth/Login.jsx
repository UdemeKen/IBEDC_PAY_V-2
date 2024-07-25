import React, { useEffect, useState } from 'react'
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { FormView, FormViewHide } from 'grommet-icons';
import axiosClient from '../../axios';
import { toast } from 'react-toastify';
import { useStateContext } from '../../context/ContextProvider';

const loginUrl = '/V2_ibedc_OAUTH_tokenReviwed/authenticate';

export default function Login() {

    const navigate = useNavigate();
    const location = useLocation();

    const { setCurrentUser, setUserToken } = useStateContext();
    const [ email, setEmail ] = useState('');
    const [ password, setPassword ] = useState('');
    const [ showPassword, setShowPassword ] = useState(false);
    const [ buttonDisabled, setButtonDisabled ] = useState(false);
    const [ loading, setLoading ] = useState(false);

    const requestData = {
        email: email,
        password: password
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setButtonDisabled(true);

        try {
            const response = await axiosClient.post(loginUrl, requestData);
            console.log(response?.data);
            console.log(response?.data?.payload?.user?.name);
            localStorage.setItem('USER_NAME', response?.data?.payload?.user?.name);
            localStorage.setItem('USER_EMAIL', response?.data?.payload?.user?.email);
            localStorage.setItem('USER_METER_NUMBER', response?.data?.payload?.user?.meter_no_primary);
            localStorage.setItem('USER_PHONE', response?.data?.payload?.user?.phone);
            localStorage.setItem('USER_ID', response?.data?.payload?.user?.id);
            // localStorage.setItem('BANK_NAME', response?.data?.payload?.user?.virtual_account?.bank_name);
            // localStorage.setItem('ACCOUNT_NAME', response?.data?.payload?.user?.virtual_account?.account_name);
            // localStorage.setItem('ACCOUNT_NUMBER', response?.data?.payload?.user?.virtual_account?.account_no);
            console.log(response?.data?.payload?.token);
            setUserToken(response?.data?.payload?.token);
            setCurrentUser(response?.data?.payload?.user?.name);
            toast.success(response?.data?.message);
            navigate('/default/customerdashboard');
            setLoading(false);
            setButtonDisabled(false);
            setEmail('');
            setPassword('');
        }catch(error) {
            console.log(error);
            toast.error(error.response?.data?.payload);
            setLoading(false);
            setButtonDisabled(false);
            setEmail('');
            setPassword('');
        };
    };

    useEffect(() => {
        navigator.geolocation.getCurrentPosition((position) => {
          console.log(position.coords.latitude, position.coords.longitude);
          localStorage.setItem('LATITUDE', position.coords.latitude);
          localStorage.setItem('LONGITUDE', position.coords.longitude);
        });
    }, []);

    const showPasswordToggler = () => {
        setShowPassword(!showPassword);
    }

  return (
    <section className='sm:w-2/3 w-full'>
        <div className='sm:block w-full h-screen sm:h-full flex flex-col justify-center items-center'>
            <div className='flex justify-center w-full'>
                <div className='flex flex-col items-center justify-center w-full sm:w-3/4'>
                    <div className='mb-5 text-center'>
                        <h1 className='font-bold capitalize text-3xl text-blue-900'>customer login</h1>
                    </div>
                    <form className='flex flex-col justify-center space-y-3 xs:w-64 w-4/5' 
                    onSubmit={handleSubmit}
                    >
                        <Outlet />
                        <div className={`${location.pathname === "/meternumber" ? "hidden" : ""}`}>
                        <label className='block text-sm font-medium text-slate-600 capitalize'>
                        email address
                        </label>
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
                            className="block w-full rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-slate-600 text-sm sm:leading-6"
                            />
                        </div>
                        </div>
                        <div className={`${location.pathname === "/meternumber" ? "hidden" : ""}`}>
                        <label className='block text-sm font-medium text-slate-600 capitalize'>
                        password
                        </label>
                        <div className="relative">
                            <span className='absolute inset-y-0 right-0 top-1 mr-5 cursor-pointer' onClick={showPasswordToggler}>
                                {showPassword ? <FormView className='mt-1'/> : <FormViewHide className='mt-1'/>}
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
                        <div className={`flex flex-col justify-center items-center ${location.pathname == "/" ? "block" : "hidden"}`}>
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
                        {!loading && <p>Sign in</p>}
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
                        <div className='flex flex-col items-center space-y-4 text-slate-500'>
                            {location.pathname == "/" && <div className='text-sm font-semibold text-center my-5'>
                                <p>Don't have a password? Click <span className='text-orange-500'><Link to={"/meternumber"}>here</Link></span> to login with your <span className='capitalize'>meter number</span> and <span className='capitalize'>account type</span></p>
                            </div>}
                            {location.pathname == "/meternumber" && <div className='text-sm font-semibold text-center my-5'>
                                <p>Don't have a meter number? Click <span className='text-orange-500'><Link to={"/"}>here</Link></span> to login with your <span className='capitalize'>password</span></p>
                            </div>}
                            <div className='capitalize text-sm'>
                                <Link to={"/forgotpassword"} className={"text-amber-600 opacity-70 hover:text-orange-500 hover:font-semibold transform duration-300 ease-in-out"}>forgot password</Link>
                            </div>
                            <div className='text-xs font-semibold text-center'>
                                <p className=''>Not yet an IBEDC Customer? <span className='text-orange-500'><Link to={"/signup"}>Signup</Link></span></p>
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
