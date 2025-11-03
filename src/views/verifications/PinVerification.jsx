import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const pinVerificationUrl = 'https://ipay.ibedc.com:7642/api/V3_OUTRIBD_iOAUTH_markedxMONITOR/verify-pin';
const retryPinUrl = 'https://ipay.ibedc.com:7642/api/V3_OUTRIBD_iOAUTH_markedxMONITOR/retry-verification-code';
const meterNoAccNoConfirmationUrl = 'https://ipay.ibedc.com:7642/api/V3_OUTRIBD_iOAUTH_markedxMONITOR/add-meter';
const Accept = 'application/json';
const appSecret = 'UDCLIVE_168949MDUKDCMEU_45@MUDCaPP0921SDK_ibedc@';
const appToken = 'TlkDD_161719MFUPDCMEU_45@9023CaPP0921SDK_T2KL90MD';
const METER_ACCT_NUMBER_REGEX = /^[0-9\-/]{11,16}$/;

export default function PinVerification() {

    const userEmail = localStorage.getItem('USER_EMAIL');
    // const userEmail = "apwakunyamusa@yahoo.com";
    const navigate = useNavigate();

    const [ pin, setPin ] = useState('');
    const [ meterNo, setMeterNo ] = useState('');
    const [ loading, setLoading ] = useState(false);
    const [ buttonDisabled, setButtonDisabled ] = useState(false);
    const [ loading_02, setLoading_02 ] = useState(false);
    const [ loading_03, setLoading_03 ] = useState(false);
    const [ buttonDisabled_02, setButtonDisabled_02 ] = useState(false);
    const [ buttonDisabled_03, setButtonDisabled_03 ] = useState(false);
    const [ blur, setBlur ] = useState(false);

    const requestData = {
        "email": userEmail,
        "pin": pin,
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setButtonDisabled(true);

        try {
            const response = await axios.post(pinVerificationUrl, requestData, {
                headers: {
                    'Accept': Accept,
                    'appsecret': appSecret,
                    'apptoken': appToken,
                }
            });
            console.log(response.data?.message);
            toast.success(response?.data?.message);
            setLoading(false);
            setButtonDisabled(false);
            setPin('');
            setBlur(true);
        }catch(error) {
            console.log(error?.response?.data?.payload);
            toast.error(error?.response?.data?.payload);
            setLoading(false);
            setButtonDisabled(false);
            setPin('');
        }
    };

    const requestData_02 = {
        "email": userEmail
    };

    const handleRetryPin = async (e) => {
        e.preventDefault();
        setLoading_02(true);
        setButtonDisabled_02(true);

        try {
            const response = await axios.post(retryPinUrl, requestData_02, {
                headers: {
                    'Accept': Accept,
                    'appsecret': appSecret,
                    'apptoken': appToken,
                }
            });
            console.log(response.data?.message);
            toast.success(response?.data?.message);
            setLoading_02(false);
            setButtonDisabled_02(false);
        }catch(error) {
            console.log(error?.response?.data?.payload);
            toast.error(error?.response?.data?.payload);
            setLoading_02(false);
            setButtonDisabled_02(false);
        }
    };

    const requestData_03 = {
        "email": userEmail,
        "meter_no": meterNo,
        "account_type": "Prepaid"
    }

    if (meterNo.length > 11 && METER_ACCT_NUMBER_REGEX.test(meterNo)) {
        requestData_03["account_type"] = "Postpaid";
    }

    const handleMeterNo_AccNo_Confirmation = async (e) => {
        e.preventDefault();
        setLoading_03(true);
        setButtonDisabled_03(true);

        try {
            const response = await axios.post(meterNoAccNoConfirmationUrl, requestData_03, {
                headers: {
                    'Accept': Accept,
                    'appsecret': appSecret,
                    'apptoken': appToken,
                }
            });
            console.log(response.data?.message);
            toast.success(response?.data?.message);
            navigate('/');
            setLoading_03(false);
            setButtonDisabled_03(false);
            setMeterNo('');
            setBlur(false);
        }catch(error) {
            console.log(error?.response?.data?.payload);
            toast.error(error?.response?.data?.payload);
            setLoading_03(false);
            setButtonDisabled_03(false);
            setMeterNo('');
        };
    };
    
    return (
        <section className='flex flex-col justify-center items-center h-screen'>
        <div className='bg-slate-300 rounded-md'>
            <div className='flex flex-col justify-center items-center space-y-4 p-8'>
                <h1 className='text-4xl font-bold'>Verify it's you</h1>
                <p className='w-2/3 text-center'>We've sent a verification PIN CODE to your email <span className='font-semibold'>{userEmail}</span></p>
                <p>Enter the code from the email in the field below</p>
                <form className='flex flex-col justify-center items-center space-y-4'>
                    <input 
                        id='pin'
                        type="text"
                        value={pin}
                        onChange={(e) => setPin(e.target.value)}
                        autoComplete='off'
                        required
                        placeholder="Enter PIN"
                        className="block w-1/2 rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-slate-600 text-2xl text-center sm:leading-6"
                        />
                    <div>
                    <button onClick={handleSubmit} disabled={buttonDisabled} className={`w-full rounded-md py-1 px-6 text-sm font-semibold leading-6 shadow-sm transition duration-300 ease-in-out ${
                        (buttonDisabled)
                        ? 'w-full bg-blue-950 opacity-30 text-white cursor-not-allowed'
                        : 'w-full bg-blue-950 bg-opacity-75 text-white hover:bg-orange-500 hover:bg-opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-900'
                    }`}>
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
                </form>
            </div>
        </div>
        <div className='flex flex-col justify-center items-center my-4'>
            <p>Did not receive an email?</p>
            <button onClick={handleRetryPin} disabled={buttonDisabled_02} className={`w-full rounded-md py-1 px-6 text-sm font-semibold leading-6 shadow-sm transition duration-300 ease-in-out ${
                (buttonDisabled_02)
                ? 'w-full bg-blue-950 opacity-30 text-white cursor-not-allowed'
                : 'w-full bg-blue-950 bg-opacity-75 text-white hover:bg-orange-500 hover:bg-opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-900'
            }`}>
            {!loading_02 && <p>Retry pin</p>}
            {loading_02 && 
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
        {blur && <div className='fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm'></div>}
        {!loading_03 && <div className={`flex flex-col justify-center items-center relative bottom-64 mx-6 sm:mx-0 sm:w-1/2 bg-white py-4 rounded-lg ${!blur ? "hidden" : "block"}`}>
            <form className='flex flex-col justify-normal items-center space-y-2 w-full px-16'>
                <label className='block text-sm font-medium text-slate-600 capitalize text-center'>
                Enter meter/account number for confirmation:
                </label>
                <input
                    type="text"
                    id="meterNumber"
                    autoComplete="text"
                    value={meterNo}
                    onChange={(e) => setMeterNo(e.target.value)}
                    required
                    name="meter/account number"
                    placeholder='Enter meter/account number'
                    className="block text-center w-full rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-slate-600 text-sm sm:leading-6"
                />
                <button onClick={handleMeterNo_AccNo_Confirmation} disabled={buttonDisabled_03} className={`w-1/2 rounded-md py-1 px-2 text-sm font-semibold leading-6 shadow-sm transition duration-300 ease-in-out ${
                        (buttonDisabled_03)
                        ? 'w-1/2 bg-blue-950 opacity-30 text-white cursor-not-allowed'
                        : 'w-1/2 bg-blue-950 bg-opacity-75 text-white hover:bg-orange-500 hover:bg-opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-900'
                    }`}>
                    <p className='text-base'>Sign up</p>
                </button>
            </form>
        </div>}
        {loading_03 && 
            <div className='flex flex-row justify-center space-x-2 relative bottom-64'>
                <div>
                    <svg className="w-20 h-20 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        </div>
                    <div>
                </div>
            </div>
        }
    </section>
  )
}
