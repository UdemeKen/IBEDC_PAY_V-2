import React, { useEffect, useState } from 'react'
import axiosClient from '../../axios';
import SuccessIcon from '../../assets/icons/successIcon.png';

const completePaymentUrl = '/payment/complete-payment';

export default function CompletePayment({ blur, setBlur }) {

  const gateway_response = JSON.parse(localStorage.getItem('GATEWAY_RESPONSE')) || {};
  const transaction_id = localStorage.getItem("TRANSACTION_ID");
  const amount = (localStorage.getItem('AMOUNT')) || '';
  const meterNumber = (localStorage.getItem('METER_NUMBER')) || '';
  const accountType = (localStorage.getItem('ACCOUNT_TYPE')) || '';
  const phone = (localStorage.getItem('PHONE')) || '';
  const selectedOption = (localStorage.getItem('SELECTED_OPTION')) || '';
  const [loading, setLoading] = useState(false);
  console.log(amount);

    const uniqueInteger = Math.floor(Date.now() + Math.random() * 1000000000000).toString().substring(0, 12);

    const polarisRequestData = {
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

    console.log(Wallet_RequestData);
      
      useEffect(() => {
        const handleCompletePayment = async () => {
            try {
                const response = await axiosClient.post(completePaymentUrl, selectedOption === 'Polaris' ? polarisRequestData : selectedOption === 'fcmb' ? FCMB_RequestData : selectedOption === 'wallet' ? Wallet_RequestData : {});
                console.log(response);
            }catch(error) {
                console.log(error);
            }
        };
        handleCompletePayment();
      }, [polarisRequestData || FCMB_RequestData || Wallet_RequestData]);


    const backTODashboard = () => {
        setBlur(false);
        window.location.reload()
    }

  return (
    <section className='flex flex-col justify-center items-center shadow-md shadow-slate-500 bg-white px-12 pt-10 rounded-md'>
        <div>
            <img 
                src={SuccessIcon}
                alt={'success'}
                className='w-32 h-32 mx-auto'
            />
            <p className='text-center capitalize font-semibold text-lg'>payment successful</p>
            <p>Electricity Token has been sent to your email and phone number</p>
        </div>
        <div className='my-5'>
            <button
                onClick={backTODashboard}
                className='bg-blue-950 opacity-75 my-4 px-8 py-1 rounded-md text-slate-200 hover:bg-orange-500 transform duration-300 ease-in-out'>
                Dashboard
            </button>
        </div>
    </section>
  )
}
