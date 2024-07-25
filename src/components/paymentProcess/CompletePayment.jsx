import React, { useEffect, useState } from 'react'
import axiosClient from '../../axios';
import { SuccessIcon, ErrorIcon } from '../../assets/icons';

const completePaymentUrl = '/V2_ibedc_OAUTH_tokenReviwed/payment/complete-payment';

export default function CompletePayment({ blur, setBlur }) {

  const gateway_response = JSON.parse(localStorage.getItem('GATEWAY_RESPONSE')) || {};
  const transaction_id = localStorage.getItem("TRANSACTION_ID");
  const amount = (localStorage.getItem('AMOUNT')) || '';
  const meterNumber = (localStorage.getItem('METER_NUMBER')) || '';
  const accountType = (localStorage.getItem('ACCOUNT_TYPE')) || '';
  const phone = (localStorage.getItem('USER_PHONE')) || '';
  const selectedOption = (localStorage.getItem('SELECTED_OPTION')) || '';
  const [loading, setLoading] = useState(false);
  console.log(amount);

    const uniqueInteger = Math.floor(Date.now() + Math.random() * 1000000000000).toString().substring(0, 12);
    const [ error, setError ] = useState('');
    const [ e, setE ] = useState(false);

    const polarisRequestDatas = {
        "payment_status": {
          "url": "http://localhost",
          "txnref": gateway_response?.tx_ref,
          "resp": "00",
          "desc": "Approved by Financial Institution",
          "retRef": uniqueInteger,
          "apprAmt": parseInt(gateway_response?.charged_amount),
          "amount": parseInt(gateway_response?.amount),
          "payRef": `${gateway_response?.flw_ref}`,
          // "payRef": `FBN|WEB|MX19329|${currentDateTime}|${flutter_Response?.flw_ref}|${flutter_Response?.transaction_id}`,
          "cardNum": "",
          "mac": "",
          "provider": "Polaris Bank",
          "MeterNo" : meterNumber,
          "account_type": accountType,
          "phone": phone
        }
      };

      
      const polarisRequestData = {
        "url": "http://localhost",
        "transacion_id" : transaction_id,
        "resp": "00",
        "desc": "Approved by Financial Institution",
        "retRef": uniqueInteger,
        "account_type" : accountType,
        "apprAmt": parseInt(gateway_response?.charged_amount),
        "amount" : parseInt(amount),
        "provider" : "Polaris",
        "cardNum": "",
        "mac": "",
        "phone" : phone,
        "account_id" : meterNumber,
        "payRef" : gateway_response?.flw_ref
        } 
        console.log(polarisRequestData);
        
    const FCMB_RequestData = {
        "transacion_id" : transaction_id,
        "account_type" : accountType,
        "amount" : parseInt(amount),
        "provider" : "FCMB",
        "phone" : phone,
        "account_id" : meterNumber,
        "payRef" : gateway_response?.transactionRef
      }

    const Wallet_RequestData = {
        "transacion_id" : transaction_id,
        "account_type" : accountType,
        "amount" : parseInt(amount),
        "provider" : "WALLET",
        "phone" : phone,
        "account_id" : meterNumber,
        "payRef" : uniqueInteger
      }

    // console.log(Wallet_RequestData);
      
      useEffect(() => {
        if (blur) {
          handleCompletePayment();
        }
      // }, [blur]);

      // handleCompletePayment();
    }, [blur]);

    const handleCompletePayment = async () => {
        setLoading(true);
        try {
            const response = await axiosClient.post(completePaymentUrl, selectedOption === 'polaris' ? polarisRequestData : selectedOption === 'fcmb' ? FCMB_RequestData : selectedOption === 'wallet' ? Wallet_RequestData : {});
            console.log(response);
            setLoading(false);
        }catch(error) {
            console.log();
            setError(error?.response?.data?.payload);
            setE(true);
            setLoading(false);
        }
    };


    const backTODashboard = () => {
        setBlur(false);
        window.location.reload()
    }

  return (
    <section className='flex flex-col justify-center items-center mt-40 w-full'>
      {loading && <div className='flex flex-col justify-center space-x-2'>
        <div className='flex flex-col justify-center items-center'>
            <svg className="w-52 h-52 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <div className='my-6'>
                <span class="font-semibold text-2xl">Generating token. Please hold on...</span>
            </div>
        </div>
      </div>}
      {!loading && !e && <div className='flex flex-col justify-center items-center shadow-md shadow-slate-500 bg-white px-12 pt-10 rounded-md w-1/2'>
          <div>
              <img 
                  src={SuccessIcon}
                  alt={'success'}
                  className='w-32 h-32 mx-auto'
              />
              <p className='text-center capitalize font-semibold text-lg'>electricity token successfully generated</p>
              <p className='text-center'>Electricity Token has been sent to your email and phone number</p>
          </div>
          <div className='my-5'>
              <button
                  onClick={backTODashboard}
                  className='bg-blue-950 opacity-75 my-4 px-8 py-1 rounded-md text-slate-200 hover:bg-orange-500 transform duration-300 ease-in-out'>
                  Back to Dashboard
              </button>
          </div>
      </div>}
      {!loading && e && <div className='flex flex-col justify-center items-center shadow-md shadow-slate-500 bg-white px-12 pt-10 rounded-md w-1/2'>
          <div>
              <img 
                  src={ErrorIcon}
                  alt={'success'}
                  className='w-32 h-32 mx-auto'
              />
              <p className='text-center capitalize font-semibold text-lg'>electricity token not successfully generated</p>
              <p className='text-center'>{error}</p>
          </div>
          <div className='my-5'>
              <button
                  onClick={backTODashboard}
                  className='bg-blue-950 opacity-75 my-4 px-8 py-1 rounded-md text-slate-200 hover:bg-orange-500 transform duration-300 ease-in-out'>
                  Back to Dashboard
              </button>
          </div>
      </div>}
    </section>
  )
}
