import React, { useEffect, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function Spinner() {

    const navigate = useNavigate();

    const [ paymentStatus, setPaymentStatus ] = useState();
    
    const [searchParams] = useSearchParams();
    const status = searchParams.get('status');

    useEffect(() => {
        setPaymentStatus(status);
    }, [status]);

    console.log(paymentStatus);

    useEffect(() => {
        if (paymentStatus === "cancelled") {
            toast.success(paymentStatus);
            const timer = setTimeout(() => {navigate("/default/cancelpay");}, 5000);
            return () => clearTimeout(timer)
        } else {
            toast.success(paymentStatus);
            const timer = setTimeout(() => {navigate("/default/successpay");}, 5000);
            return () => clearTimeout(timer)
        }
    }, [paymentStatus]);

    return (
        <section className='flex flex-col justify-center items-center pt-[10rem]'>
            <div className='shadow-md shadow-slate-500 flex flex-col justify-center items-center rounded-lg space-y-8 capitalize p-[5rem]'>
                <div className='flex flex-row justify-center space-x-2'>
                    <div>
                        <svg className="w-10 h-10 animate-spin text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    </div>
                </div>
            </div>
        </section>
    )
}
