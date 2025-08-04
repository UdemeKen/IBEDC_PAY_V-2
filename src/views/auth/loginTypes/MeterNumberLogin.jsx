import React, { useEffect, useRef, useState } from 'react'
import { faCheck, faTimes, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import "../../../components/UniversalCss.css";
import axiosClient from '../../../axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useStateContext } from '../../../context/ContextProvider';

const METER_ACCT_NUMBER_REGEX = /^[0-9\-/]{11,16}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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
  const [validEmail, setValidEmail] = useState(false);
  const [showTokenModal, setShowTokenModal] = useState(false);
  const [specialToken, setSpecialToken] = useState("");
  const [specialEmail, setSpecialEmail] = useState("");
  const [specialTokenLoading, setSpecialTokenLoading] = useState(false);
  const [specialTokenError, setSpecialTokenError] = useState("");
  const [specialTrackId, setSpecialTrackId] = useState("");
  
  useEffect(() => {
    if (selectedAccountType === 'Special') {
      setValidEmail(EMAIL_REGEX.test(user));
    } else {
      const isValid = METER_ACCT_NUMBER_REGEX.test(user);
      setValidMeterAcctNo(isValid);
    }
  }, [user, selectedAccountType]);
  
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

  const specialAPIURL = "/V4IBEDC_new_account_setup_sync/initiate/validate_user";
  const getPendingAccountUploadAPIURL = "/V4IBEDC_new_account_setup_sync/initiate/get_pending_account_upload";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setButtonDisabled(true);
    setLoading(true);

    if (selectedAccountType === 'Special') {
      // Special account type: validate email and show token modal
      try {
        const response = await axiosClient.post(specialAPIURL, { email: user });
        if (response.data.success) {
          setSpecialEmail(user);
          setShowTokenModal(true);
          setButtonDisabled(false);
          setLoading(false);
          toast.success(response.data.message);
          return;
        } else {
          toast.error(response.data.message || 'Failed to send token.');
        }
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to send token.');
      }
      setButtonDisabled(false);
      setLoading(false);
      return;
    }

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
    <section>
    <div className='flex flex-col w-full space-y-2'>
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
            <option value="Special">Special</option>
          </select>
        </div>
        <div>
            <label className='block text-sm font-medium text-slate-600 capitalize'>
              {selectedAccountType === 'Special' ? 'email address' : 'meterNo/accountNo'}
              <span className={selectedAccountType === 'Special' ? (validEmail ? "valid" : "hide") : (validMeterAcctNo ? "valid" : "hide")}>
                <FontAwesomeIcon icon={faCheck} />
              </span>
              <span className={selectedAccountType === 'Special' ? (validEmail || !user ? "hide" : "invalid") : (validMeterAcctNo || !user ? "hide" : "invalid")}>
                <FontAwesomeIcon icon={faTimes} />
              </span>
            </label>
            <input
            type={selectedAccountType === 'Special' ? 'email' : 'text'}
            id={selectedAccountType === 'Special' ? 'email' : 'meterNumber'}
            autoComplete={selectedAccountType === 'Special' ? 'email' : 'on'}
            value={selectedAccountType === "Postpaid" ? formattedUser : user}
            onChange={(e) => setUser(e.target.value)}
            required
            aria-invalid={selectedAccountType === 'Special' ? (validEmail ? "false" : "true") : (validMeterAcctNo ? "false" : "true")}
            aria-describedby="uidnote"
            onFocus={() => setUserFocus(true)}
            onBlur={() => setUserFocus(false)}
            name={selectedAccountType === 'Special' ? 'email' : 'meterNumber'}
            placeholder={selectedAccountType === 'Special' ? 'Enter email address' : 'Enter meter number'}
            className="block w-full rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-slate-600 text-sm sm:leading-6"
            />
            <p id="uidnote" className={userFocus && user && (selectedAccountType === 'Special' ? !validEmail : !validMeterAcctNo) ? 
              "instructions text-xs" : "offscreen"}
            >
              <FontAwesomeIcon icon={faInfoCircle} />
              {selectedAccountType === 'Special' ? (
                <>Enter a valid email address.</>
              ) : (
                <>
                  11 to 16 digits.<br />
                  Numbers, dashes and slashes allowed.<br />
                  No spaces.
                </>
              )}
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
        <div>
        {/* Token Modal for Special Account Type */}
        {showTokenModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded shadow-lg w-full max-w-md flex flex-col items-center">
              <h2 className="text-lg font-bold mb-4 text-center">Enter Token & Tracking ID</h2>
              <p className="mb-2 text-center text-sm">A token has been sent to your email: <span className="font-semibold">{specialEmail}</span></p>
              <p className="mb-2 text-center text-xs text-blue-700 font-semibold">Please also enter the Tracking ID that was sent to you by the DTM. This is required for DTE login.</p>
              <input
                type="text"
                value={specialTrackId || ''}
                onChange={e => setSpecialTrackId(e.target.value)}
                placeholder="Enter Tracking ID from DTM"
                className="w-full border rounded px-2 py-2 mb-4 text-center"
                autoFocus
              />
              <input
                type="text"
                value={specialToken}
                onChange={e => setSpecialToken(e.target.value)}
                placeholder="Enter token"
                className="w-full border rounded px-2 py-2 mb-4 text-center"
              />
              {specialTokenError && <p className="text-red-600 text-sm mb-2">{specialTokenError}</p>}
              <button
                className="w-full bg-blue-600 text-white font-semibold rounded px-4 py-2 mb-2 hover:bg-blue-700 transition"
                onClick={async () => {
                  setSpecialTokenLoading(true);
                  setSpecialTokenError("");
                  try {
                    const response = await axiosClient.post(getPendingAccountUploadAPIURL, {
                      email: specialEmail,
                      code: specialToken,
                      tracking_id: specialTrackId
                    });
                    if (response.data.success && response.data.payload && response.data.payload.accounts && Array.isArray(response.data.payload.accounts.data)) {
                      setShowTokenModal(false);
                      setSpecialTokenLoading(false);
                      // Navigate to DTEValidation page with accounts data
                      navigateTo('/dtevalidation', { state: { accounts: response.data.payload.accounts.data, trackingId: specialTrackId } });
                    } else {
                      setSpecialTokenError(response.data.message || 'Invalid token or tracking ID.');
                      setSpecialTokenLoading(false);
                    }
                  } catch (error) {
                    setSpecialTokenError(error.response?.data?.message || 'Network error. Please try again.');
                    setSpecialTokenLoading(false);
                  }
                }}
                disabled={specialTokenLoading || !specialToken || !specialTrackId}
              >
                {specialTokenLoading ? 'Verifying...' : 'Verify Token'}
              </button>
              <button
                className="w-full bg-gray-400 text-white font-semibold rounded px-4 py-2 mt-2 hover:bg-gray-500 transition"
                onClick={() => setShowTokenModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
    </div>
    </section>
  )
}
