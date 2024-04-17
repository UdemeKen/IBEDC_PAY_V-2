import React from 'react'
import { Link } from 'react-router-dom'

export default function TransactionViewDetails() {
  return (
    <section className='flex flex-col items-center w-full px-4 py-10'>
        <div className='shadow-sm shadow-slate-500 rounded-lg flex flex-col justify-center w-full sm:w-1/2 items-center py-4'>
            <div className='grid sm:grid-rows-3 sm:grid-flow-col gap-y-4 sm:gap-5 sm:p-16 text-center w-full'>
                <div>
                    <label className='text-md font-bold'>Transaction ID</label>
                    <p>1234567890</p>
                </div>
                <div>
                    <label className='text-md font-bold'>Transaction Date</label>
                    <p>2024-03-26</p>
                </div>
                <div>
                    <label className='text-md font-bold'>Amount Paid</label>
                    <p>₦10</p>
                </div>
                <div>
                    <label className='text-md font-bold'>Payment Status</label>
                    <p className='text-green-700 font-bold italic'>Successful</p>
                </div>
            </div>
            <Link to='' className='bg-blue-950 opacity-80 my-10 hover:bg-orange-700 traznsform duration-300 ease-in-out text-white sm:w-1/3 text-center rounded-md py-2 px-2 capitalize mb-4'>view receipt</Link>
        </div>
    </section>
  )
}
