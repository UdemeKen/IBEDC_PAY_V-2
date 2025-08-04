import React, { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { toast } from 'react-toastify'

export default function PaymentCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const status = searchParams.get('status');
  const txRef = searchParams.get('tx_ref');
  const isSuccess = status === 'successful' || status === 'completed';
  const isCancelled = status === 'cancelled' || status === 'failed';

  useEffect(() => {
    // Clear payment-related data from localStorage
    localStorage.removeItem('TRANSACTION_ID');
    localStorage.removeItem('AMOUNT');
    localStorage.removeItem('ACCOUNT_TYPE');
    localStorage.removeItem('METER_NUMBER');
    localStorage.removeItem('EMAIL');
    localStorage.removeItem('PHONE');
    localStorage.removeItem('CUSTOMER_NAME');
    localStorage.removeItem('SUB_ACCOUNT');
    localStorage.removeItem('SELECTED_OPTION');
    localStorage.removeItem('GATEWAY_RESPONSE');

    // Show appropriate toast message
    if (isSuccess) {
      toast.success('Payment completed successfully!');
    } else if (isCancelled) {
      toast.error('Payment was cancelled');
    }
  }, [isSuccess, isCancelled]);

  const handleReturnToDashboard = () => {
    navigate('/default/customerdashboard');
  };

  return (
    <section className='flex flex-col justify-center items-center pt-[10rem]'>
        <div className='shadow-md shadow-slate-500 flex flex-col justify-center items-center rounded-lg space-y-8 capitalize p-[5rem]'>
            <h1 className={`text-3xl font-bold ${isSuccess ? 'text-green-600' : 'text-red-600'}`}>
              -{isSuccess ? 'payment successful' : 'payment cancelled'}-
            </h1>
            <p className='text-[16px] font-semibold'>{isSuccess ? 'payment completed successfully' : 'payment was cancelled'}</p>
            {txRef && (
              <p className='text-[12px] text-gray-600'>Transaction Reference: {txRef}</p>
            )}
            {status && (
              <p className='text-[12px] text-gray-600'>Status: {status}</p>
            )}
            <div className='flex flex-row justify-center space-x-2'>
                <div>
                    <svg className={`w-10 h-10 ${isSuccess ? 'text-green-500' : 'text-red-500'}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        {isSuccess ? (
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        ) : (
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        )}
                    </svg>
                </div>
            </div>
            <button
              onClick={handleReturnToDashboard}
              className='bg-blue-950 text-white font-bold py-3 px-6 rounded-lg hover:bg-orange-500 hover:bg-opacity-90 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-900'
            >
              Return to Dashboard
            </button>
        </div>
    </section>
  )
} 