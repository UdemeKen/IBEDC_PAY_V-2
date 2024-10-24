import React, { useState } from 'react';
import CustomerPaymentInputDetails from './CustomerPaymentInputDetails';
import PaymentOptions from './PaymentOptions';
import { ChevronLeftIcon } from '@heroicons/react/24/outline';

export default function PaymentForm({ blur, setBlur, blur_01, setBlur_01 }) {

    const formList = [ "First Form", "Second Form", "Third Form", "Fourth Form" ];
    const [ page, setPage ] = useState(0);
    const formLength = formList.length;

    const handleNext = () => {
        setPage(page === formLength - 1 ? 0 : page + 1);
    }

    const handleBack = () => {
        setPage(page === 0 ? formLength - 1 : page - 1);
    }

    const handleFormSwitch = () => {
        switch (page) {
            case 0: {
                return <CustomerPaymentInputDetails handleNext={handleNext} blur={blur} blur_01={blur_01}/>
            }
            case 1: {
                return <PaymentOptions handleNext={handleNext} blur={blur} setBlur={setBlur}/>
            }
            default: {
                return null;
            }   
        }
    }

  return (
    <section>
        <div>
            {handleFormSwitch()}
        </div>
        <div className='flex justify-center items-center'>
            <div className={`text-center my-4 ${page === 0 ? "hidden" : ""} ${blur ? "hidden" : ""}`}>
                <button
                    onClick={handleBack}
                    className='bg-blue-950 opacity-75 hover:bg-orange-500 transform duration-300 ease-in-out text-white rounded-md px-2 py-1'
                >
                    <ChevronLeftIcon className='w-5 h-5'/>
                </button>
            </div>
        </div>
    </section>
  )
}
