import React, { useEffect, useState, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faTimes, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import '../../components/UniversalCss.css';
import { toast } from 'react-toastify';
import axiosClient from '../../axios';

const processPaymentUrl = "/V3_OUTRIBD_iOAUTH_markedxMONITOR/payment/initiate-payment";
const METER_ACCT_NUMBER_REGEX = /^[0-9\-/]{11,16}$/;

export default function CustomerPaymentInputDetails({ handleNext, blur, blur_01 }) {
  
  const [ amount, setAmount ] = useState('');
  const [ accountType, setAccountType ] = useState('');
  const [ owner, setOwner ] = useState('');
  const [ user, setUser ] = useState('');
  const [ formattedUser, setFormattedUser ] = useState('');
  const [ validMeterAcctNo, setValidMeterAcctNo ] = useState(false);
  const [ userFocus, setUserFocus ] = useState(false);
  const [ buttonDisabled, setButtonDisabled ] = useState(false);
  const [ loading, setLoading ] = useState(false);
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState(''); 
  localStorage.setItem('AMOUNT', amount);
  localStorage.setItem('ACCOUNT_TYPE', accountType);
  
  useEffect(() => {
    const isValid = METER_ACCT_NUMBER_REGEX.test(user);
    setValidMeterAcctNo(isValid);
    }, [user]);
    
    useEffect(() => {
      const formattedAccountNumber = user.replace(/[^0-9]/g, '');
      if (accountType === 'Postpaid') {
        if (formattedAccountNumber.length >= 2) {
          setFormattedUser(formattedAccountNumber.replace(/(\d{2})(\d{2})(\d{2})(\d{4})(\d{2})/, '$1/$2/$3/$4-$5'));
          } else {
            setFormattedUser(formattedAccountNumber);
      } 
      } else if (accountType === 'Prepaid') {
        // Leave it as it's
        } else {
          setFormattedUser('');
          }
          }, [accountType, user]);
          
          const meterNo_Or_AccountNo = accountType === "Postpaid" ? formattedUser : user;
          localStorage.setItem('METER_NUMBER', meterNo_Or_AccountNo);

  const requestData = {
    "amount": parseInt(amount),
    "account_type": accountType,
    [accountType === "Prepaid" ? "MeterNo" : "account_number"]: meterNo_Or_AccountNo,
    "owner": owner,
    "latitude": parseFloat(localStorage.getItem('LATITUDE')) || 0.0,
    "longitude": parseFloat(localStorage.getItem('LONGITUDE')) || 0.0,
    "source_type": 'Web',
    "email": email,
    "phone": phone, 
  };
  
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setButtonDisabled(true);
    
    try {
      const response = await axiosClient.post(processPaymentUrl, requestData);
      console.log(response);
      toast.success(response?.data?.message);
      localStorage.setItem('TRANSACTION_ID', response?.data?.payload?.transaction_id);
      localStorage.setItem('EMAIL', response?.data?.payload?.email);
      localStorage.setItem('PHONE', response?.data?.payload?.phone);
      localStorage.setItem('CUSTOMER_NAME', response?.data?.payload?.customer_name);
      localStorage.setItem('SUB_ACCOUNT', response?.data?.payload?.sub_account);
      handleNext();
    }catch(error) {
      console.log(error);
      toast.error(error?.response?.data?.message);
    }finally {
      setLoading(false);
      setButtonDisabled(false);
      setAmount('');
      setAccountType('');
      setUser('');
      setOwner('');
      setEmail('');
      setPhone(''); 
    }
  };

  return (
    <section>
        <form className='flex flex-col justify-center space-y-3 xs:w-64 w-full px-4 my-4' onSubmit={handleSubmit}>
            <div>
                <label className='block text-sm font-medium text-slate-600 capitalize my-2 mx-2'>
                amount
                </label>
                <input
                type="text"
                id="amount"
                autoComplete="on"
                onChange={(e) => setAmount(e.target.value)}
                value={amount}
                required
                name="amount"
                placeholder='Enter amount to pay'
                className="block w-full rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-slate-600 text-sm sm:leading-6"
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-slate-600 capitalize mb-2 mx-2'>
                    account type
                </label>
                <select
                id="accountType"
                onChange={(e) => setAccountType(e.target.value)}
                value={accountType}
                name="accountType"
                required
                className="block w-full rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-slate-600 text-sm sm:leading-6">
                <option disabled value="">--Account Type--</option>
                <option value="Prepaid">Prepaid</option>
                <option value="Postpaid">Postpaid</option>
                </select>
              </div>
              <div>
                <label className='block text-sm font-medium text-slate-600 capitalize my-2 mx-2'>
                meterNo/accountNo
                  <span className={validMeterAcctNo ? "valid" : "hide"}>
                    <FontAwesomeIcon icon={faCheck} />
                  </span>
                  <span className={validMeterAcctNo || !user ? "hide" : "invalid"}>
                    <FontAwesomeIcon icon={faTimes} />
                  </span>
                </label>
                <input
                type="text"
                id="meterNumber"
                autoComplete="on"
                value={accountType === "Postpaid" ? formattedUser : user}
                onChange={(e) => setUser(e.target.value)}
                required
                aria-invalid={validMeterAcctNo ? "false" : "true"}
                aria-describedby="uidnote"
                onFocus={() => setUserFocus(true)}
                onBlur={() => setUserFocus(false)}
                name="meterNumber"
                placeholder='Enter meter number'
                className="block w-full rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-slate-600 text-sm sm:leading-6"
                />
                <p id="uidnote" className={userFocus && user && !validMeterAcctNo ? 
                  "instructions" : "offscreen"}
                  >
                  <FontAwesomeIcon icon={faInfoCircle} />
                  11 to 16 digits.<br />
                  Numbers, dashes and slashes allowed.<br />
                  No spaces.
                </p>
              </div>
              <div>
                <label className='block text-sm font-medium text-slate-600 capitalize my-2 mx-2'>
                  Email
                </label>
                  <input
                    type="email"
                    id="email"
                    autoComplete="on"
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    name="email"
                    placeholder='Enter your email'
                    className="block w-full rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-slate-600 text-sm sm:leading-6"
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-slate-600 capitalize my-2 mx-2'>
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    autoComplete="on"
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    name="phone"
                    placeholder='Enter your phone number'
                    className="block w-full rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-slate-600 text-sm sm:leading-6"
                  />
                </div>
              <div>
                <label className='block text-sm font-medium text-slate-600 capitalize mb-2 mx-2'>
                  owner
                </label>
                <select
                id="owner"
                value={owner}
                onChange={(e) => setOwner(e.target.value)}
                name="owner"
                required
                className="block w-full rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-slate-600 text-sm sm:leading-6">
                <option disabled value="">--Owner Type--</option>
                <option value="landlord">Landlord</option>
                <option value="tenant">Tenant</option>
                </select>
              </div>
              {!blur_01 && <div className='flex flex-col justify-center items-center'>
                <button
                type="submit"
                disabled={buttonDisabled}
                className={`w-full rounded-md py-1 text-sm font-semibold leading-6 shadow-sm transition duration-300 ease-in-out ${
                    (buttonDisabled)
                    ? 'w-full bg-blue-950 opacity-30 text-white cursor-not-allowed'
                    : !buttonDisabled && blur ? 'w-full bg-blue-950 text-white hover:bg-orange-500 hover:bg-opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-900'
                    : 'w-full bg-blue-950 opacity-75 text-white hover:bg-orange-500 hover:bg-opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-900'
                }`}
                >
                {!loading && <p>Send Payment</p>}
                {loading && 
                <div className='flex flex-row justify-center space-x-2'>
                    <div>
                        <svg className="w-5 h-5 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            </div>
                        <div>
                        <span className="font-medium"> Processing... </span>
                    </div>
                </div>
                }
                </button>
            </div>}
        </form>
    </section>
  )
}
