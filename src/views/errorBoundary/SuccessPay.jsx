import React, { useEffect, useState } from 'react'
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function SuccessfulPay() {

    return (
        <section className='flex flex-col justify-center items-center pt-[10rem]'>
            <div className='shadow-md shadow-slate-500 flex flex-col justify-center items-center rounded-lg space-y-8 capitalize p-[5rem]'>
                <h1 className='text-3xl font-bold text-green-600'>-payment successful-</h1>
                <p className='text-[16px] font-semibold'>navigate back to dashboard</p>
                <Link to={"/default/customerdashboard"} className='bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 transition duration-300'>dashboard</Link>
            </div>
        </section>
    )
}
