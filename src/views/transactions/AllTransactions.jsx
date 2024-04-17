import React from 'react';
import { Frame_01 } from '../../assets/images';
import { BanknotesIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';

export default function AllTransactions() {

  const transactionHistory = JSON.parse(localStorage.getItem('TRANSACTION_HISTORY')) || [];

  return (
    <section className='sm:mx-20 lg:mx-32 mx-2 mt-4'>
      <div className='flex flex-col sm:flex-row justify-normal space-y-4 sm:space-y-0 sm:space-x-4 sm:my-10'>
        <div className='shadow-sm shadow-slate-500 w-full h-48 rounded-lg flex justify-center items-center'>
        <div className='shadow-sm shadow-slate-500 w-full h-48 rounded-lg flex justify-center items-center'>
        <div className='relative flex-grow shadow-sm shadow-slate-500 w-full h-48 rounded-lg flex flex-col justify-center items-center'>
          <img 
            src={Frame_01}
            alt={'Frame_01'}
            className='w-full h-full object-cover rounded-lg'
          />
          <div className="absolute inset-0 rounded-lg bg-blue-950 opacity-70"></div>
          <div className='absolute flex flex-col justify-center items-center capitalize text-white'>
            <BanknotesIcon className='w-8 h-8'/>
            <p>monthly total transaction</p>
            <p className='text-4xl font-semibold'>₦ 0.00</p>
          </div>
        </div>
        </div>
        </div>
        <div className='shadow-sm shadow-slate-500 w-full h-48 rounded-lg flex justify-center items-center'>
          <div className='shadow-sm shadow-slate-500 w-full h-48 rounded-lg flex justify-center items-center'>
            <div className='shadow-sm shadow-slate-500 w-full h-48 rounded-lg flex justify-center items-center'>
              <div className='relative flex-grow shadow-sm shadow-slate-500 w-full h-48 rounded-lg flex flex-col justify-center items-center'>
                <img 
                  src={Frame_01}
                  alt={'Frame_01'}
                  className='w-full h-full object-cover rounded-lg'
                />
                <div className="absolute inset-0 rounded-lg bg-orange-500 opacity-70"></div>
                <div className='absolute flex flex-col justify-center items-center capitalize text-white'>
                  <BanknotesIcon className='w-8 h-8'/>
                  <p>monthly total income</p>
                  <p className='text-4xl font-semibold'>₦ 0.00</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className='flex flex-col sm:flex-row justify-normal space-y-4 sm:space-y-0 sm:space-x-4 mb-4 sm:mb-10'>
        <div className='shadow-sm shadow-slate-500 w-full h-full rounded-lg flex flex-col justify-center items-center mt-4 sm:mt-0 space-y-4'>
        <ul className='flex justify-between text-normal p-1 capitalize font-semibold text-slate-600 rounded-t-lg shadow-sm shadow-slate-500 w-full'>
          <li>Transaction history</li>
        </ul>
        <div className='flex flex-col justify-normal space-y-4 w-full px-4 pb-4'>
        {transactionHistory.length === 0 && 
            <div className='flex flex-row justify-center items-center rounded-lg px-4 py-2 mx-2 shadow-sm shadow-gray-500'>
              <h4 className='text-gray-800 opacity-75 tracking-tighter'>No transaction history</h4>
            </div>
          }
          {transactionHistory.length > 0 ? transactionHistory.map((transaction) => (
            <div className={`flex flex-row justify-between items-center rounded-lg p-4 w-full h-full py-2 shadow-sm shadow-gray-500`}>
              <div className='text-blue-900'>
                <h4 className='tracking-tighter text-left'>Amount paid: <span className='font-bold md:text-lg'>&#8358;{(Number(transaction.amount)).toLocaleString()}</span></h4>
                <h4 className={`font-semibold text-sm text-gray-800 tracking-tighter text-left`}>
                  Date: 
                  <span className='font-normal'>
                    {`${transaction.date_entered.slice(8,10)}-${transaction.date_entered.slice(5,7)}-${transaction.date_entered.slice(0,4)}`} | {transaction.date_entered.slice(10,16)}
                  </span> 
                  <span className={`lowercase text-emerald-900 mx-2`}>{transaction?.status}</span>
                </h4>
              </div>
              <Link to={'/default/customerdashboard'} className={`bg-blue-950 rounded-lg text-xs sm:text-sm text-white text-center capitalize px-2 py-1 sm:px-4 sm:py-2 hover:bg-orange-500 duration-300 ease-in-out opacity-75`}>view</Link>
            </div>
          )).slice(0,5) : null}
          </div>
        </div>
        <div className='shadow-sm shadow-slate-500 sm:w-2/5 rounded-lg flex justify-center items-center'>
        {transactionHistory.length === 0 && 
          <h4 className='text-gray-800 opacity-75 tracking-tighter'>No transaction details</h4>
        }
        {transactionHistory.length > 0 ? transactionHistory.map((transaction) => (
          <div className='flex flex-col justify-center items-center'>
            <div className='grid grid-rows-3 sm:grid-flow-col gap-5 text-center w-full pt-4'>
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
            <Link to='' className='bg-blue-950 opacity-80 my-10 hover:bg-orange-700 traznsform duration-300 ease-in-out text-white text-center rounded-md py-2 px-2 capitalize mb-4'>view receipt</Link>
          </div>
        )).slice(0,5) : null}
        </div>
      </div>
    </section>
  )
}
