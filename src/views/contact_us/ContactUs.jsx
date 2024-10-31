import React, { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faTimes, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import  { Facebook, Instagram, Mail, Twitter, Youtube } from 'grommet-icons';
import axiosClient from '../../axios';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PhoneIcon } from '@heroicons/react/24/outline';

const METER_ACCT_NUMBER_REGEX = /^[0-9\-/]{11,16}$/;
const contactUsUrl = '/V2_ibedc_OAUTH_tokenReviwed/contact/help';

export default function ContactUs() {

  const [ buttonDisabled, setButtonDisabled ] = useState(false);
  const [ loading, setLoading ] = useState(false);
  const [ user, setUser ] = useState('');
  const [ formattedUser, setFormattedUser ] = useState('');
  const [ accountType, setAccountType ] = useState('');
  const [ validMeterAcctNo, setValidMeterAcctNo ] = useState(false);
  const [ userFocus, setUserFocus ] = useState(false);
  const [ subject, setSubject ] = useState('');
  const [ message, setMessage ] = useState('');


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

  const isFormValid = () => {
    return true;
  };

  const requestData = {
    account_type: accountType,
    unique_code: user,
    subject: subject,
    message: message
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setButtonDisabled(true);
    setLoading(true);

    try{
      const response = await axiosClient.post(contactUsUrl, requestData);
      console.log(response?.data);
      toast.success(response?.data?.message);
      setLoading(false);
      setButtonDisabled(false);
      setAccountType('');
      setUser('');
      setSubject('');
      setMessage('');
    }catch(error){
      console.error(error);
      toast.error('An error occurred. Please try again');
      setLoading(false);
      setButtonDisabled(false);
      setAccountType('');
      setUser('');
      setSubject('');
      setMessage('');
    };
  };

  return (
    <div className='bg-white bg-cover pb-4'>
    <motion.section 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
    className='flex justify-center mx-2 sm:mx-0'>
      <div className='shadow-sm shadow-slate-500 flex flex-col justify-center items-center sm:w-1/2 my-10 py-5 rounded-lg'>
        <h1 className='text-2xl font-semibold text-slate-700 opacity-75 underline'>Feedback Form</h1>
        <form 
        onSubmit={handleSubmit}
        className='flex flex-col justify-center space-y-2 sm:w-2/3 rounded-xl capitalize mx-2 my-4'>
                <div>
                  <label className='block text-sm font-medium text-slate-600 capitalize'>
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
                <div className='text-slate-600'>
                  <label className='text-sm'>subject*</label>
                  <input
                  id='subject' 
                  name='subject'
                  type='text'
                  placeholder='xxxxxxxxxxxxth'
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  autoComplete='off'
                  required
                  className="w-full text-base font-normal rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 placeholder:text-sm focus:ring-2 focus:ring-inset focus:ring-blue-900"/>
                </div>
                <div className='text-slate-600'>
                  <label className='text-sm'>message*</label>
                  <textarea
                  id='message'
                  name='message'
                  type='text'
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  className="w-full text-base font-normal rounded-md border-0 text-gray-900 shadow-sm placeholder:text-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-900"
                  placeholder="Enter your message...">  
                  </textarea>
                </div>
                <div className='flex flex-col justify-center items-center'>
                  <button
                    type='submit'
                    disabled={!isFormValid() || buttonDisabled}
                    className={`bg-slate-600 opacity-75 rounded-lg text-white hover:bg-orange-500 transform duration-300 ease-in-out mx-10 py-1 px-4  cursor-pointer`}>
                    {!loading && <p>Submit</p>}
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
                    </div>}
                  </button>
                </div>
          </form>
          <div className='flex flex-col justify-center items-center mt-5 '>
            <p className='text-slate-600 text-center mx-2'>For more information please contact us on</p>
            <ul className='flex flex-row justify-between my-4 px-2 w-full mb-10'>
              <Link to={"https://www.facebook.com/ibedc.ng"} target='_blank'><li><Facebook /></li></Link>
              <Link to={"https://www.instagram.com/ibedc.ng"} target='_blank'><li><Instagram /></li></Link>
              <Link to={"https://www.twitter.com/ibedc_ng"} target='_blank'><li><Twitter /></li></Link>
              <Link to={"https://www.youtube.com/@IBEDC"} target='_blank'><li><Youtube /></li></Link>
            </ul>
            <div className='flex flex-row justify-center items-center gap-4 px-2'>
              <div className='flex flex-col justify-center items-center'>
                <Mail />
                <span className='text-slate-600'>customercare@ibedc.com</span>
              </div>
              <div className='flex flex-col justify-center items-center gap-[5px]'>
                <PhoneIcon className='w-5 h-5'/>
                <p className='flex gap-2 text-slate-600 text-center'><span className='hidden sm:block'>call:</span> 07001239999</p>
              </div>
            </div>
          </div>
      </div>
    </motion.section>
    </div>
  )
}
