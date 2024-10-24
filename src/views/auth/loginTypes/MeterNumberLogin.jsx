import React, { useEffect, useRef, useState } from 'react'
import { faCheck, faTimes, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import "../../../components/UniversalCss.css";
import axiosClient from '../../../axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useStateContext } from '../../../context/ContextProvider';

const METER_ACCT_NUMBER_REGEX = /^[0-9\-/]{11,16}$/;

export default function MeterNumberLogin() {

  const userRef = useRef();
  const navigateTo = useNavigate();

  const { setCurrentUser, setUserToken } = useStateContext();
  const [ validMeterAcctNo, setValidMeterAcctNo ] = useState(false);
  const [ user, setUser ] = useState('');
  const [ formattedUser, setFormattedUser ] = useState('');
  const [selectedAccountType, setSelectedAccountType] = useState('');
  const [ userFocus, setUserFocus ] = useState(false);
  const [ buttonDisabled, setButtonDisabled ] = useState(false);
  const [ loading, setLoading ] = useState(false);
  
  useEffect(() => {
    const isValid = METER_ACCT_NUMBER_REGEX.test(user);
    setValidMeterAcctNo(isValid);
  }, [user]);
  
  const handleAccountTypeChange = (event) => {
    setSelectedAccountType(event.target.value);
  };

  useEffect(() => {
    userRef.current.focus();
  }, []);

  
  useEffect(() => {
    const formattedAccountNumber = user.replace(/[^0-9]/g, '');
    if (selectedAccountType === 'Postpaid') {
      if (formattedAccountNumber.length >= 2) {
        setFormattedUser(formattedAccountNumber.replace(/(\d{2})(\d{2})(\d{2})(\d{4})(\d{2})/, '$1/$2/$3/$4-$5'));
      } else {
        setFormattedUser(formattedAccountNumber);
      } 
    } else if (selectedAccountType === 'Prepaid') {
      // Leave it as it's
    } else {
      setFormattedUser('');
    }
  }, [selectedAccountType, user]);
  
  const meterNo_Or_AccountNo = selectedAccountType === "Postpaid" ? formattedUser : user;

  const requestData = {
    "meter_no": meterNo_Or_AccountNo,
    "account_type": selectedAccountType
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setButtonDisabled(true);
    setLoading(true);

    try {
      const response = await axiosClient.post('/V2_ibedc_OAUTH_tokenReviwed/meter_authenticate', requestData);
      console.log(response);
      localStorage.setItem('USER_METER_NUMBER', response?.data?.payload?.user?.meter_no_primary);
      localStorage.setItem('USER_EMAIL', response?.data?.payload?.user?.email);
      localStorage.setItem('USER_NAME', response?.data?.payload?.user?.name);
      localStorage.setItem('USER_PHONE', response?.data?.payload?.user?.phone);
      localStorage.setItem('USER_ID', response?.data?.payload?.user?.id);
      localStorage.setItem('STATUS', response?.data?.payload?.user?.virtual_account?.status);
      localStorage.setItem('account_name', response?.data?.payload?.user?.virtual_account?.account_name);
      localStorage.setItem('account_no', response?.data?.payload?.user?.virtual_account?.account_no);
      localStorage.setItem('bank_name', response?.data?.payload?.user?.virtual_account?.bank_name);
      localStorage.setItem('customer_email', response?.data?.payload?.user?.virtual_account?.customer_email);
      localStorage.setItem('LOGIN_ACCOUNT_TYPE', response?.data?.payload?.user?.account_type);
      // localStorage.setItem('WALLET_AMOUNT', response?.data?.payload?.wallet?.wallet_amount);
      setUserToken(response?.data?.payload?.token);
      setCurrentUser(response?.data?.payload?.user?.name);
      navigateTo('/default/customerdashboard');
      toast.success(response?.data?.message);
      setButtonDisabled(false);
      setLoading(false);
    }catch(error) {
      console.log(error);
      toast.error(error.response?.data?.payload);
      setButtonDisabled(false);
      setLoading(false);
      navigateTo('/meternumber');
    }
  }
  
  return (
    <div className='flex flex-col space-y-2'>
        <div>
          <label className='block text-sm font-medium text-slate-600 capitalize'>
              account type
          </label>
          <select
            id="accountType"
            ref={userRef}
            onChange={handleAccountTypeChange}
            value={selectedAccountType}
            name="accountType"
            required
            className="block w-full rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-slate-600 text-sm sm:leading-6">
            <option disabled value="">--Account Type--</option>
            <option value="Prepaid">Prepaid</option>
            <option value="Postpaid">Postpaid</option>
          </select>
        </div>
        <div>
            <label className='block text-sm font-medium text-slate-600 capitalize'>
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
            value={selectedAccountType === "Postpaid" ? formattedUser : user}
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
              "instructions text-xs" : "offscreen"}
              >
              <FontAwesomeIcon icon={faInfoCircle} />
              11 to 16 digits.<br />
              Numbers, dashes and slashes allowed.<br />
              No spaces.
            </p>
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
        </div>
  )
}
