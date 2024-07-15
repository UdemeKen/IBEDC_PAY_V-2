import React, { useEffect, useState } from 'react'
import '../../components/UniversalCss.css';
import { Frame_01, Advert_01 } from '../../assets/images';
import { VectorIcon } from '../../assets/icons';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faTimes, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { CreditCardIcon, BanknotesIcon, PhoneIcon, WalletIcon } from '@heroicons/react/24/outline';
import PaymentForm from '../../components/paymentProcess/PaymentForm';
import CompletePayment from '../../components/paymentProcess/CompletePayment';
import { Link } from 'react-router-dom';
import axiosClient from '../../axios';
import { toast } from 'react-toastify';
import { heroVariants } from '../../variants';

const transactionHistoryUrl = "/history/get-history";
// const getCustomerDetailsUrl = "/dashboard/get-details";
const getOutstandingBalanceUrl = "/outstanding/get-balance";
const showOutstandingBalanceUrl = "/outstanding/show-balance";
// const getWalletBalance_HistoryUrl = "/wallet/wallet-balance-history";
const METER_ACCT_NUMBER_REGEX = /^[0-9\-/]{11,16}$/;


export default function CustomerDashboard() {

  const userEmail = localStorage.getItem("USER_EMAIL");
  const username = localStorage.getItem("USER_NAME");
  const account_type = localStorage.getItem("ACCOUNT_TYPE");
  const meterNumber = localStorage.getItem("USER_METER_NUMBER");
  // const phoneNumber = localStorage.getItem("PHONE_NUMBER");
  const cleanedUsername = username ? username.replace(/\./g, '') : '';
  
  const [ transactionHistory, setTransactionHistory ] = useState([]);
  const [ loading, setLoading ] = useState(false);
  const [ loading_01, setLoading_01 ] = useState(false);
  const [ loading_02, setLoading_02 ] = useState(false);
  const [ loading_03, setLoading_03 ] = useState(false);
  const [ buttonDisabled, setButtonDisabled ] = useState(false);
  const [ blur, setBlur ] = useState(false);
  const [ blur_01, setBlur_01 ] = useState(false);
  const [ blur_02, setBlur_02 ] = useState(false);
  const [ userFocus, setUserFocus ] = useState(false);
  const [ accountType, setAccountType ] = useState('');
  const [ user, setUser ] = useState('');
  const [ formattedUser, setFormattedUser ] = useState('');
  const [ validMeterAcctNo, setValidMeterAcctNo ] = useState(false);
  // const [ walletHistory, setWalletHistory ] = useState([]);
  // const [ walletBalance, setWalletBalance ] = useState("")
  const [ pin, setPin ] = useState("")
  const [ success, setSuccess ] = useState();
  const [ outStandingbalance, setOutStandingbalance ] = useState("");
  console.log(accountType);

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
  console.log(meterNo_Or_AccountNo);

  const requestData = {
    "email": userEmail,
    "account_type": accountType,
    "account_no": meterNumber,
  };

  // useEffect(() => {
    const handleGetOutStandingBalance = async (e) => {
      e.preventDefault();
      setButtonDisabled(true);
      setLoading_01(true);

      if (accountType === "Postpaid") {
        toast.error("Visit the nearest IBEDC office for postpaid outstanding balance.", {
          autoClose: false,
        });
        setButtonDisabled(false);
        setLoading_01(false);
        return;
      }
  
      try{
        const response = await axiosClient.post(getOutstandingBalanceUrl, requestData);
        console.log(response);
        toast.success(response?.data?.message);
        setButtonDisabled(false);
        setLoading_01(false);
        setBlur_01(false);
        setBlur_02(true);
      }catch(error){
        console.log(error);
        setButtonDisabled(false);
        setLoading_01(false);
      };
    }
    // handleGetOutStandingBalance();
  // }, []);

  const requestData_01 = {
    "email": userEmail,
    "account_no": meterNo_Or_AccountNo,
    "account_type": accountType,
    "pin": pin,
  }

  const handleShowOutStandingBalance = async (e) => {
    e.preventDefault();
    setButtonDisabled(true);
    setLoading_03(true);

    if (pin === "") {
      toast.error("Please enter the PIN sent to your email");
      setButtonDisabled(false);
      setLoading_03(false);
      return;
    }

    try{
      const response = await axiosClient.post(showOutstandingBalanceUrl, requestData_01);
      console.log(response);
      toast.success(response?.data?.message);
      setSuccess(response?.data?.success);
      setOutStandingbalance(response?.data?.payload?.balance?.Balance);
      setButtonDisabled(false);
      setLoading_03(false);
      setBlur_02(false);
      setAccountType("");
      setUser("");
      setPin("");
    }catch(error){
      console.log(error.response?.data?.payload);
      toast.error(error.response?.data?.payload);
      setButtonDisabled(false);
      setLoading_03(false);
      setBlur_02(false);
      setAccountType("");
      setUser("");
      setPin("");
  }
};

console.log(outStandingbalance);

  const handleBlur_01 = () => {
    setBlur_01(!blur_01);
    setAccountType("");
    setUser("");
  };

  const handleBlur_02 = () => {
    setBlur_02(!blur_02);
    setAccountType("");
    setUser("");
  };
  
  // useEffect(() => {
  //   const getCustomerDetails = async () => {
  //     try {
  //       const response = await axiosClient.get(getCustomerDetailsUrl);
  //       console.log(response?.data);
  //     }catch(error) {
  //       console.log(error);
  //     };
  //   }
  //   getCustomerDetails();
  // }, []);
  
  useEffect(() => {
    const getTransactionHistory = async () => {
      setLoading(true);
      try {
        const response = await axiosClient.get(transactionHistoryUrl);
        console.log(response?.data?.payload?.data?.[0]);
        setTransactionHistory(response?.data?.payload?.data);
        localStorage.setItem('TRANSACTION_HISTORY', JSON.stringify(response?.data?.payload?.data || []));
        localStorage.setItem('CUSTOMER_NAME', JSON.stringify(response?.data?.payload?.data?.[0]?.customer_name));
        localStorage.setItem('ACCOUNT_TYPE', JSON.stringify(response?.data?.payload?.data?.[0]?.account_type));
        localStorage.setItem('METER_NUMBER', JSON.stringify(response?.data?.payload?.data?.[0]?.meter_no));
        localStorage.setItem('PHONE_NUMBER', JSON.stringify(response?.data?.payload?.data?.[0]?.phone));
        localStorage.setItem('BUSINESS_HUB', JSON.stringify(response?.data?.payload?.data?.[0]?.udertaking));
        localStorage.setItem('TARRIF_CODE', JSON.stringify(response?.data?.payload?.data?.[0]?.tariffcode));
        setLoading(false);
      }catch(error) {
        console.log(error);
      };
    }
    getTransactionHistory();
  }, []);

  // useEffect(() => {
  //     const getWalletBalance_History = async () => {
  //       setLoading_02(true);
  //       try{
  //         const response = await axiosClient.get(getWalletBalance_HistoryUrl);
  //         setWalletHistory(response?.data?.payload?.balance_history);
  //         setWalletBalance(response?.data?.payload?.user_balance?.wallet_amount);
  //         localStorage.setItem('WALLET_HISTORY', JSON.stringify(response?.data?.payload?.balance_history || []));
  //         localStorage.setItem('WALLET_BALANCE', response?.data?.payload?.user_balance?.wallet_amount);
  //         setLoading_02(false);
  //       }catch(error){
  //         console.log(error);
  //       };
  //     }
  //     getWalletBalance_History();
  // }, []);

  console.log(outStandingbalance);


  return (
    <div className='bg-white bg-cover pb-4'>
    <motion.section 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
    className={`mx-2 mt-4 sm:mx-20 ${blur || blur_01 || blur_02 ? "fixed sm:w-4/5" : ""} w-full sm:w-4/5`} >
          {blur && <div className='fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm'></div>}
          {blur_01 && <div className='fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm' onClick={handleBlur_01}></div>}
          {blur_02 && <div className='fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm' onClick={handleBlur_02}></div>}
      <div className={`flex justify-center items-center top-0 relative ${!blur ? "hidden" : "block"}`}>
        <CompletePayment blur={blur} blur_01={blur_01} setBlur={setBlur} setBlur_01={setBlur_01}/>
      </div>
      <div className={`flex justify-center items-center top-20 ml-16 sm:ml-0 right-32 sm:right-0 relative lg:mx-80 rounded-md ${!blur_01 ? "hidden" : "block"}`}>
      <div className='bg-slate-300 rounded-md w-72 sm:w-full'>
            <div className='flex flex-col justify-center items-center space-y-4 p-8'>
                <h1 className='text-4xl font-bold text-center'>Verify account</h1>
                <form className='flex flex-col justify-center space-y-3 xs:w-64 w-full px-4 my-4' 
                onSubmit={handleGetOutStandingBalance}
                >
                <div>
                  <label className='block text-sm font-medium text-slate-600 capitalize mb-2 mx-2 text-center'>
                      account type
                  </label>
                  <select
                    id="accountType"
                    value={accountType}
                    onChange={(e) => setAccountType(e.target.value)}
                    name="accountType"
                    required
                    className="block w-full rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-slate-600 text-sm sm:leading-6">
                    <option disabled value="">--Account Type--</option>
                    <option value="Prepaid">Prepaid</option>
                    <option value="Postpaid">Postpaid</option>
                  </select>
                </div>
                <div>
                  <label className='block text-sm font-medium text-slate-600 capitalize my-2 mx-2 text-center'>
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
                    <button disabled={buttonDisabled} className={`w-full rounded-md py-1 px-6 text-sm font-semibold leading-6 shadow-sm transition duration-300 ease-in-out ${
                        (buttonDisabled)
                        ? 'w-full bg-blue-950 opacity-30 text-white cursor-not-allowed'
                        : 'w-full bg-blue-950 bg-opacity-75 text-white hover:bg-orange-500 hover:bg-opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-900'
                    }`}>
                    {!loading_01 && <p>Authenticate</p>}
                    {loading_01 && 
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
      <div className={`flex justify-center items-center top-20 ml-16 sm:ml-0 right-32 sm:right-0 relative lg:mx-80 rounded-md ${!blur_02 ? "hidden" : "block"}`}>
      <div className='bg-slate-300 rounded-md w-full'>
      <div className='flex flex-col justify-center items-center space-y-4 p-8'>
                <h1 className='text-4xl font-bold text-center'>Verify it's you</h1>
                <p className=' text-center'>We've sent a verification PIN CODE to your email <span className='font-semibold text-center w-full'>{userEmail}</span></p>
                <p className='text-center'>Enter the code from the email in the field below:</p>
                <form className='flex flex-col justify-center items-center space-y-4'
                onSubmit={handleShowOutStandingBalance}
                >
                    <input 
                        id='pin'
                        type="text"
                        value={pin}
                        onChange={(e) => setPin(e.target.value)}
                        autoComplete='off'
                        required
                        placeholder="Enter PIN"
                        className="block w-1/2 rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-slate-600 text-sm sm:text-2xl text-center sm:leading-6"
                        />
                    <div>
                    <button disabled={buttonDisabled} className={`w-full rounded-md py-1 px-6 text-sm font-semibold leading-6 shadow-sm transition duration-300 ease-in-out ${
                        (buttonDisabled)
                        ? 'w-full bg-blue-950 opacity-30 text-white cursor-not-allowed'
                        : 'w-full bg-blue-950 bg-opacity-75 text-white hover:bg-orange-500 hover:bg-opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-900'
                    }`}>
                    {!loading_03 && <p>Verify</p>}
                    {loading_03 && 
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
      <motion.div 
        variants={heroVariants.hero_09Variants}
        initial="hidden"
        animate="visible"
      className={`flex flex-col space-y-4 sm:space-y-0 sm:flex-row justify-normal sm:space-x-4 lg:px-10 sm:mt-10 ${blur || blur_01 || blur_02 ? "hidden" : ""}`}>
        <div className='flex flex-col justify-normal space-y-4 w-full text-xs'>
            <h1 className='flex font-semibold text-lg'>Welcome! <span className='text-blue-950 opacity-80 font-semibold ml-1'>{cleanedUsername}</span></h1>
            <h1 className='flex font-semibold w-full'>Meter/Acct No: <span className='font-normal ml-1'>{meterNumber === null ? "" : meterNumber === "undefined" ? "Not yet available" : meterNumber.replace(/"/g, '')}</span></h1>
            <h1 className='flex font-semibold w-full'>Account Type: <span className='font-normal ml-1'>{meterNumber && meterNumber.length > 11 ? "Postpaid" : "Prepaid"}</span></h1>
            {/* <h1 className='flex font-semibold w-full'>Phone Number: <span className='font-normal ml-1'>{phoneNumber === null ? "" : phoneNumber === "undefined" ? "Not yet available" : phoneNumber.replace(/"/g, '')}</span></h1> */}
            {/* <h1 className='flex font-semibold w-full'>Address: <span className='font-normal ml-1'>{"Not found"}</span></h1> */}
        </div>
        <div className='relative shadow-sm shadow-slate-500 w-full h-52 rounded-lg flex flex-col justify-center items-center'>
          <img 
            src={Frame_01}
            alt={'Frame_01'}
            className='w-full h-full object-cover rounded-lg'
            />
          <div className="absolute inset-0 rounded-lg bg-blue-950 opacity-70"></div>
          <div className='absolute flex flex-col justify-center items-center capitalize text-white'>
              <CreditCardIcon className='w-8 h-8'/>
            <p className='text-center'>outstanding balance</p>
              {outStandingbalance === undefined && <p className='text-4xl font-semibold'>₦0.00</p>}
              {outStandingbalance === "" && <p className='text-4xl font-semibold'></p>}
              {outStandingbalance !== undefined && outStandingbalance !== "" && <p className='text-4xl font-semibold'>{`₦ ${outStandingbalance}`}</p>}
            {/* {success === true ? <p className='text-4xl font-semibold'>₦{outStandingbalance}</p> : ""} */}
            <button onClick={handleBlur_01} className='bg-slate-300 text-slate-600 rounded-md capitalize text-sm transform duration-300 ease-in-out hover:px-2'>
              <p className='px-2'>click to view</p>
            </button>
          </div>
        </div>
        {accountType === "Postpaid" && <div className='relative flex-grow shadow-sm shadow-slate-500 w-full h-52 rounded-lg flex flex-col justify-center items-center'>
          <img 
            src={Frame_01}
            alt={'Frame_01'}
            className='w-full h-full object-cover rounded-lg'
          />
          <div className="absolute inset-0 rounded-lg bg-blue-950 opacity-70"></div>
          <div className='absolute flex flex-col justify-center items-center capitalize text-white'>
            <BanknotesIcon className='w-8 h-8'/>
            <p>current bill</p>
            <p className='text-4xl font-semibold'>₦ 0.00</p>
          </div>
        </div>}
        <div className='relative flex-grow shadow-sm shadow-slate-500 w-full h-52 rounded-lg flex flex-col justify-center items-center'>
        <img 
            src={Frame_01}
            alt={'Frame_01'}
            className='w-full h-full object-cover rounded-lg'
          />
          <div className="absolute inset-0 rounded-lg bg-orange-500 opacity-70"></div>
          <div className='absolute flex flex-col justify-center items-center capitalize text-white'>
            <PhoneIcon className='w-8 h-8'/>
            <p>need help:</p>
            <p className='lg:text-2xl font-semibold text-center'>call: 07001239999</p>
          </div>
        </div>
        {/* <div className='relative flex-grow shadow-sm shadow-slate-500 w-full h-40 rounded-lg flex flex-col justify-center items-center'>
        <img 
            src={Frame_01}
            alt={'Frame_01'}
            className='w-full h-full object-cover rounded-lg'
          />
          <div className="absolute inset-0 rounded-lg bg-blue-950 opacity-70"></div>
          <div className='absolute flex flex-col justify-center items-center capitalize text-white'>
            <WalletIcon className='w-8 h-8'/>
            <p>wallet balance</p>
            {loading && 
            <div className={`flex flex-row justify-center space-x-2 ${blur ? "hidden" : ""}`}>
                <div>
                    <svg className={`w-5 h-5 animate-spin  text-white ${blur_01 ? "hidden" : ""}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        {!blur_01 && <circle className={`${!blur_01 ? "opacity-25" : ""}`} cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>}
                        {blur && <circle className={`${!blur ? "opacity-25" : ""}`} cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>}
                            {!blur_01 && <path className={`${!blur_01 ? "opacity-75" : ""}`} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>}
                            {blur && <path className={`${!blur ? "opacity-75" : ""}`} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>}
                            </svg>
                        </div>
                    <div>
                </div>
            </div>
            }
            {!loading && <p className='text-4xl font-semibold'>₦ {walletBalance}</p>}
            <p className='normal-case'>-Not yet available-</p>
          </div>
        </div> */}
      </motion.div>
      <motion.div 
        variants={heroVariants.hero_10Variants}
        initial="hidden"
        animate="visible"
      className='flex flex-col space-y-4 sm:space-y-0 sm:flex-row justify-center sm:space-x-4 lg:px-10 my-8 sm:my-10 w-full'>
        <div className='shadow-sm shadow-slate-500 w-full sm:w-3/4 rounded-lg'>
          <div className='flex justify-between items-center shadow-sm shadow-slate-500 rounded-t-lg capitalize text-lg font-semibold px-4 py-2'>
            <h2 className='text-slate-600'>make payment</h2>
            {blur &&<span className={`bg-blue-950 ${!blur ? "opacity-90" : ""} px-2 text-3xl text-slate-200 w-12 h-10 rounded-lg text-center`}>₦</span>}
            {blur_01 && <span className={`bg-blue-950 ${!blur_01 ? "opacity-90" : ""} px-2 text-3xl text-slate-200 w-12 h-10 rounded-lg text-center`}>₦</span>}
          </div>
          <PaymentForm blur={blur} blur_01={blur_01} setBlur={setBlur} setBlur_01={setBlur_01} />
        </div>
        <div className='shadow-sm shadow-slate-500 w-full rounded-lg flex flex-col justify-normal text-center space-y-4 pb-4'>
          <div className='flex justify-between items-center w-full h-5 text-sm py-5 font-semibold shadow-sm shadow-slate-500 rounded-t-md px-2 text-slate-600'>
            <p className='sm:h-5'>Transaction History</p>
            <Link to={"/default/alltransactions"} className='hover:underline cursor-pointer h-5 flex justify-center items-center font-medium'>
              View all <span className='hidden sm:block ml-1'>transactions</span> 
              <span className='mx-2'>
                <img src={VectorIcon} alt='vector' className='w-3'/>
              </span>
            </Link>
          </div>
          {loading && 
            <div className={`flex flex-row justify-center space-x-2 ${blur ? "hidden" : ""}`}>
                <div>
                    <svg className={`w-5 h-5 animate-spin  text-white ${blur_01 ? "hidden" : ""}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        {!blur_01 && <circle className={`${!blur_01 ? "opacity-25" : ""}`} cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>}
                        {blur && <circle className={`${!blur ? "opacity-25" : ""}`} cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>}
                            {!blur_01 && <path className={`${!blur_01 ? "opacity-75" : ""}`} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>}
                            {blur && <path className={`${!blur ? "opacity-75" : ""}`} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>}
                            </svg>
                        </div>
                    <div>
                    <span class="font-medium"> Processing... </span>
                </div>
            </div>
          }
          {!loading && transactionHistory.length === 0 && 
            <div className='flex flex-row justify-center items-center rounded-lg px-4 py-2 mx-2 shadow-sm shadow-gray-500'>
              <h4 className='text-gray-800 opacity-75 tracking-tighter'>No transaction history</h4>
            </div>
          }
          {!loading && transactionHistory.length > 0 ? transactionHistory.map((transaction) => (
            <div className={`flex flex-row justify-between items-center rounded-lg px-4 py-2 mx-2 shadow-sm shadow-gray-500 ${blur || blur_02 ? "hidden" : ""}`}>
              <div className='text-blue-900'>
                <h4 className='tracking-tighter text-left'>Amount paid: <span className='font-bold md:text-lg'>&#8358;{(Number(transaction.amount)).toLocaleString()}</span></h4>
                {!blur_01 && <h4 className={`font-semibold text-sm text-gray-800 ${!blur_01 ? "opacity-75" : ""} tracking-tighter text-left`}>
                  Date: 
                  <span className='font-normal'>
                    {`${transaction.date_entered.slice(8,10)}-${transaction.date_entered.slice(5,7)}-${transaction.date_entered.slice(0,4)}`} | {transaction.date_entered.slice(10,16)}
                  </span> 
                  {blur && <span className={`lowercase text-emerald-900 ${!blur ? "opacity-90" : ""}`}>{transaction?.status}</span>}
                  {!blur_01 && <span className={`lowercase text-emerald-900 mx-1 ${!blur_01 ? "opacity-90" : ""}`}>{transaction?.status}</span>}
                </h4>}
                {blur && <h4 className={`font-semibold text-sm text-gray-800 ${!blur ? "opacity-75" : ""} tracking-tighter text-left`}>
                  Date: 
                  <span className='font-normal'>
                    {`${transaction.date_entered.slice(8,10)}-${transaction.date_entered.slice(5,7)}-${transaction.date_entered.slice(0,4)}`} | {transaction.date_entered.slice(10,16)}
                  </span> 
                  {blur && <span className={`lowercase text-emerald-900 ${!blur ? "opacity-90" : ""}`}>{transaction?.status}</span>}
                  {!blur_01 && <span className={`lowercase text-emerald-900 mx-1 ${!blur_01 ? "opacity-90" : ""}`}>{transaction?.status}</span>}
                </h4>}
              </div>
              {blur &&<Link to={`/default/transactionviewdetails/${transaction.id}`} className={`bg-blue-950 ${!blur ? "opacity-75" : ""} rounded-lg text-xs sm:text-sm text-white text-center capitalize px-2 py-1 sm:px-4 sm:py-2 hover:bg-orange-500 duration-300 ease-in-out`}>view</Link>}
              {!blur_01 &&<Link to={`/default/transactionviewdetails/${transaction.id}`} className={`bg-blue-950 ${!blur_01 ? "opacity-75" : ""} rounded-lg text-xs sm:text-sm text-white text-center capitalize px-2 py-1 sm:px-4 sm:py-2 hover:bg-orange-500 duration-300 ease-in-out`}>view</Link>}
            </div>
          )).slice(0,5) : null}
        </div>
      </motion.div>
      <motion.div 
        variants={heroVariants.hero_11Variants}
        initial="hidden"
        animate="visible"
      className={`flex flex-col sm:flex-row justify-center sm:space-x-4 lg:px-10 sm:my-10 ${blur && 'hidden'}`}>
        <div className='relative shadow-sm shadow-slate-500 w-3/4 rounded-lg flex justify-center items-center hidden sm:block'>
          <div className='absolute inset-0 bg-gradient-to-t from-orange-500 opacity-80 rounded-lg from-0%'></div>
          <img
            src={Advert_01}
            alt='advert_01'
            className={"h-52 w-full rounded-lg"}
           />
        </div>
        <div className='shadow-sm shadow-slate-500 w-full rounded-lg flex flex-col-reverse sm:flex-row justify-center sm:space-x-2 mb-4 sm:mb-0'>
          <div className='shadow-sm shadow-slate-500 sm:w-3/4 rounded-l-lg flex flex-col justify-normal items-center mt-2 sm:mt-0 pb-2 sm:pb-0'>
            <div className='flex flex-col justify-center items-center w-full h-6 mt-2'>
              <h2 className='font-semibold text-slate-700 opacity-75'>Account details</h2>
              <hr className='w-4/5 border-1 border-black'/>
            </div>
            <h1 className='mt-10 font-semibold text-xl text-center'>Not yet Available</h1>
            {/* <ul className='text-xs capitalize m-2 flex flex-col justify-center items-center italic font-semibold space-y-1 mb-4'>
              <li className='text-center'>account name:<br /> <span className='not-italic font-normal'>{accountName}</span></li>
              <li className='text-center'>account NO:<br /> <span className='not-italic font-normal'>{accountNumber}</span></li>
              <li className='text-center'>bank name:<br /> <span className='not-italic font-normal'>{bankName}</span></li>
            </ul> */}
            {/* <div>
              <Link to={""} className='px-4 font-semibold text-lg bg-slate-500 text-slate-200 rounded-md capitalize hover:bg-orange-500 opacity-75 transform duration-300 ease-in-out sm:py-2'>
                fund wallet
              </Link>
            </div> */}
          </div>
          <div className='shadow-sm shadow-slate-500 w-full rounded-r-lg'>
            <ul className='flex justify-between text-sm p-1 capitalize font-semibold text-slate-600'>
              <li>wallet history</li>
              <Link to={""} className='hover:underline'>
                <li>view all</li>
              </Link>
            </ul>
            {loading_02 && 
            <div className={`flex flex-row justify-center space-x-2 ${blur ? "hidden" : ""}`}>
                <div>
                    <svg className={`w-5 h-5 animate-spin  text-white ${blur_01 ? "hidden" : ""}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        {!blur_01 && <circle className={`${!blur_01 ? "opacity-25" : ""}`} cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>}
                        {blur && <circle className={`${!blur ? "opacity-25" : ""}`} cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>}
                            {!blur_01 && <path className={`${!blur_01 ? "opacity-75" : ""}`} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>}
                            {blur && <path className={`${!blur ? "opacity-75" : ""}`} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>}
                            </svg>
                        </div>
                    <div>
                    <span class="font-medium"> Processing... </span>
                </div>
            </div>
            }
            {/* {!loading_02 && walletHistory.length === 0 &&  */}
            <div className='flex flex-row justify-center items-center rounded-lg px-4 py-2 mx-2 shadow-sm shadow-gray-500'>
              <h4 className='text-gray-800 opacity-75 tracking-tighter text-center'>This update is not yet available </h4>
            </div>
            {/* } */}
            {/* {!loading_02 && walletHistory.length > 0 &&  */}
            <div>
              {/* {walletHistory.map((wallHistory) => ( */}
              {/* <div className='shadow-sm shadow-slate-500 rounded-md m-2 flex justify-between items-center p-2'> */}
                <div>
                  <>
                    {/* <p className='text-xs capitalize'>credited: <span>&#8358;{(Number(wallHistory.price)).toLocaleString()}</span></p> */}
                    {/* <p className='text-xs capitalize'>date: <span>{`${wallHistory.created_at.slice(8,10)}-${wallHistory.created_at.slice(5,7)}-${wallHistory.created_at.slice(0,4)}`} | {wallHistory.created_at.slice(11,16)}</span></p> */}
                  </>
                </div>
                {/* <div className='bg-blue-950 opacity-75 flex justify-center items-center rounded-md cursor-pointer text-xs px-2 py-1 text-white hover:bg-orange-500 transform duration-300 ease-in-out'>
                  <Link to={""}>view</Link>
                </div> */}
              {/* </div> */}
              {/* )).slice(0, 3)} */}
            </div>
            {/* } */}
          </div>
        </div>
      </motion.div>
    </motion.section>
    </div>
  )
}
