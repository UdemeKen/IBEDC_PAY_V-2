import React, { useEffect, useState, useRef } from 'react';
import { FlutterWaveButton, closePaymentModal } from 'flutterwave-react-v3';
import { Polaris_Bank_Logo, FCMB_Logo, Wallet_Logo } from '../../assets/images';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axiosClient from '../../axios';

const completePaymentUrl = '/V2_ibedc_OAUTH_tokenReviwed/payment/complete-payment';
const walletCompletePaymentUrl = '/V2_ibedc_OAUTH_tokenReviwed/payment/wallet-payment';

export default function PaymentOptions({ handleCompletePayment, blur, setBlur }) {

const navigate = useNavigate();

    const continuePaymentUrl = "/V2_ibedc_OAUTH_tokenReviwed/payment/continue-payment";
    const meterNumber = (localStorage.getItem('METER_NUMBER')) || '';
    const accountType = (localStorage.getItem('ACCOUNT_TYPE')) || '';
    const uniqueInteger = Math.floor(Date.now() + Math.random() * 1000000000000).toString().substring(0, 12);
    
    // const [ transaction_id, setTransactionId ] = useState('');
    // const [ amount, setAmount ] = useState('');
    const [ walletBalance, setWalletBalance ] = useState(localStorage.getItem('WALLET_BALANCE'));
    // const [ email, setEmail ] = useState('');
    // const [ phone, setPhone ] = useState('');
    // const [ customer_name, setCustomerName ] = useState('');
    // const [ sub_account, setSubAccount ] = useState('');
    // const [ account_type, setAccount_type ] = useState('');
    const [selectedOption, setSelectedOption] = useState('polaris');
    const [buttonDisabled, setButtonDisabled] = useState(false);
    const [loading, setLoading] = useState(false);
    const [loading_01, setLoading_01] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [modalMessage, setModalMessage] = useState('');

    localStorage.setItem('SELECTED_OPTION', selectedOption);

    // const hasRunOnceRef = useRef(false);

    // if(!hasRunOnceRef.current) {
        const transaction_id = localStorage.getItem("TRANSACTION_ID");
        const amount = localStorage.getItem("AMOUNT");
        const email = localStorage.getItem("EMAIL");
        const phone = localStorage.getItem("PHONE");
        const customer_name = localStorage.getItem("CUSTOMER_NAME");
        const sub_account = localStorage.getItem("SUB_ACCOUNT");
        const account_type = localStorage.getItem("ACCOUNT_TYPE");
        const meter_number = localStorage.getItem("USER_METER_NUMBER");
        // setTransactionId(transaction_id);
        // setAmount(amount);
        // setEmail(email);
        // setPhone(phone);
        // setCustomerName(customer_name);
        // setSubAccount(sub_account);
        // setAccount_type(account_type);
        // hasRunOnceRef.current = true;
    // }

    // public_key: 'FLWPUBK-a349e9ca32655cb4a7c3c0c35ecdec70-X',
    const config = {
    //   public_key: 'FLWPUBK_TEST-3c82072dbfc36f267a1fa4e4bd43c5ed-X',
      public_key: 'FLWPUBK-08ba487d23894235a61e5005f1e0d8d6-X',
      tx_ref: transaction_id,
      amount: parseInt(amount),
      currency: 'NGN',
      payment_options: 'card,mobilemoney,ussd',
      customer: {
        email: email,
        phone_number: phone,
        name: customer_name,
      },
      customizations: {
        title: account_type === 'Prepaid' ? 'Buy Energy' : 'Pay Bill',
        description: 'Payment for Electricity Bill',
        logo: 'https://i.ibb.co/g9Wz1Hc/ibedc-black-logo.pnghttps://i.ibb.co/5jzYjPS/Flutter.png',
      },
      subaccounts: [
        {
            id: sub_account || 'RS_574474F4E2F1F8869DA149F013AD46BF',
        },
      ]
    };

    console.log(config);
    const fwConfig = {
      ...config,
      text: 'Authorize Payment',
      callback: (response) => {
        console.log('Callback executed for Polaris', response);
        localStorage.setItem('GATEWAY_RESPONSE', JSON.stringify(response))
        setBlur(true);
        closePaymentModal()
      },
      onClose: () => {},
    };

    // const payload = { 
        // merchantCode: '2437355',
        // Test Key
        // publicKey: 'FERNKEY_PUB_TEST2437355_c05e79d3-df6f-44c7-90d2-6584870c9499',
        // Live Key
        // publicKey: 'FERNKEY_PUB_2437355_23744863-1004-4ab7-a9bf-f5cc4f8851d0',
        // amount: parseInt(amount),
        // email: email,
        // customerName: customer_name,
        // orderId: transaction_id,
        // paymentOption: {
        //   card: true,
        //   payWithBank: true,
        //   payLater: true,
        //   USSD: true,
        // },
        // onSuccess: (response) => {
        //   console.log('Callback executed for FCMB', response);
        //   toast.success('Payment successful');
        //   localStorage.setItem('GATEWAY_RESPONSE', JSON.stringify(response));
        //   setBlur(true);
        // }, 
        // onFailure: (error) => {
        //   console.log('Callback error executed for FCMB', error);
        //   toast.error('Payment failed');
        // },
        // subaccounts: [
        //       {
        //           id: paymentData?.sub_account || 'RS_574474F4E2F1F8869DA149F013AD46BF',
        //       },
        //   ]
    // };
   const payload = {
        "tx_ref": transaction_id,
        "amount": parseInt(amount),
        "currency": "NGN",
        "redirect_url": "https://ibedcnew.ibedc.com/default/customerdashboard",
          "customer": {
            "name": customer_name,
            "phonenumber": phone,
             "account_type" : account_type,
            "MeterNo" : meter_number,
            "email" : email,
            "phone" : phone
          },
          "customizations": {
            "title": "IBEDC"
          },
          subaccounts: [
            {
                id: sub_account || 'RS_574474F4E2F1F8869DA149F013AD46BF',
            },
          ]
        //"payment_source" : "currenct_charge"  // This is for agency alone | current_charge or oustanding_balance
    }

    const fcmbpayloadRequest = async () => {
        setLoading_01(true);
        try {
            const response = await axiosClient.post(continuePaymentUrl, payload);
            console.log(response);
            window.location.href = response?.data?.payload?.data?.link;
            setBlur(true);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading_01(false);
        }
    }
  
    //for javascript frameworks
    // const payFunction = () => { 
    //  window.fernGatewayPlugin.render(payload) 
    // }

    const Wallet_RequestData = {
        "transacion_id": localStorage.getItem("TRANSACTION_ID"),
        "account_type": localStorage.getItem('ACCOUNT_TYPE'),
        "amount": parseInt(amount),
        "provider": "Wallet",
        "phone": localStorage.getItem("PHONE"),
        "account_id": localStorage.getItem('METER_NUMBER'),
        "payRef": uniqueInteger // Use the generated uniqueInteger here
    };

    const walletFunction = async () => {
        if (walletBalance < amount) {
            toast.error("Insufficient Funds");
        } else {
            setIsModalVisible(true); // Show the modal
            setModalMessage("Processing your wallet payment..."); // Set the message
            try {
                const response = await axiosClient.post(walletCompletePaymentUrl, Wallet_RequestData);
                console.log(response);
                if (response.status === 200) {
                    toast.success(response?.data?.message);
                    window.location.reload();
                }
            } catch (error) {
                console.log(error);
                toast.error("Transaction failed. Please try again.");
            } finally {
                setIsModalVisible(false); // Hide the modal
                setBlur(false);
                setLoading_01(false);
            }
        }
    };

    useEffect(() => {
        setSelectedOption('polaris');
    }, []);

    const handleOptionChange = (option) => {
        setSelectedOption(option);
    };

  return (
    <section>
        <div className={`bg-blue-950 opacity-75 capitalize text-center font-semibold text-slate-200 py-1 ${blur ? "hidden" : ""}`}>
            select payment option
        </div>
        <div className={`flex justify-center my-10 mx-2 capitalize rounded-md space-x-10 ${blur ? "hidden" : ""}`}>
            <div className={`flex justify-center items-center w-16 sm:w-32 text-center cursor-pointer sm:py-2 rounded-md text-slate-200 hover:bg-orange-600 transform duration-300 ease-in-out ${
                selectedOption === 'polaris' ? 'bg-orange-400' : ''
            }`} onClick={() => handleOptionChange('polaris')}>
                <img 
                    src={Polaris_Bank_Logo} 
                    alt={'polaris bank'} 
                    className='w-10 sm:w-20 h-10 sm:h-20'/>
            </div>
            {/* <div className={`flex justify-center items-center w-16 sm:w-32 text-center cursor-pointer py-2 rounded-md text-slate-200 hover:bg-orange-600 transform duration-300 ease-in-out ${
                selectedOption === 'fcmb' ? 'bg-orange-600' : ''
            }`} onClick={() => handleOptionChange('fcmb')}>
                <img 
                    src={FCMB_Logo} 
                    alt={'fcmb'} 
                    className='w-10 sm:w-20 h-10 sm:h-20'/>
            </div> */}
            <div className={`flex justify-center items-center w-16 sm:w-32 text-center cursor-pointer py-2 rounded-md text-slate-200 hover:bg-orange-600 transform duration-300 ease-in-out ${
                selectedOption === 'wallet' ? 'bg-orange-600' : ''
            }`} onClick={() => handleOptionChange('wallet')}>
                <img 
                    src={Wallet_Logo} 
                    alt={'wallet'} 
                    className='w-10 sm:w-20 h-10 sm:h-20'/>
            </div>
        </div>
        <div className={`flex flex-col justify-center items-center ${blur ? "hidden" : ""}`}>
            <button
            type="submit"
            disabled={buttonDisabled || loading_01}
            onClick={!loading && selectedOption === "fcmb" ? fcmbpayloadRequest : !loading && selectedOption === "wallet" ? walletFunction : null}
            className={`w-1/2 rounded-md py-1 text-sm font-semibold leading-6 shadow-sm transition duration-300 ease-in-out ${
                (buttonDisabled || loading_01)
                ? 'w-1/2 bg-blue-950 opacity-30 text-white cursor-not-allowed '
                : 'w-1/2 bg-blue-950 opacity-75 text-white hover:bg-orange-500 hover:bg-opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-900'
            }`}
            >
            {loading_01 ? ( // Show spinning icon when loading
        <div className='flex flex-row justify-center space-x-2'>
            <div>
                <svg className="w-5 h-5 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
            </div>
            <div>
                <span className="font-medium"> Processing... </span>
            </div>
        </div>
    ) : (
        selectedOption === "polaris" ? <FlutterWaveButton {...fwConfig}/> : "Authorize Payment"
    )}
            </button>
        </div>

        {/* Modal for loading state */}
        {isModalVisible && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-white p-5 rounded shadow-lg">
                    <div className='flex flex-row justify-center items-center space-x-2'>
                        <div>
                            <svg className="w-10 h-10 animate-spin text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        </div>
                        <div>
                            <span className="font-medium">{modalMessage}</span>
                        </div>
                    </div>
                </div>
            </div>
        )}
    </section>
  )
}
