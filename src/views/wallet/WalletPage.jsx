import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import { Frame_01 } from '../../assets/images';
import { BanknotesIcon, WalletIcon } from '@heroicons/react/24/outline';

export default function WalletPage() {

  const userEmail = localStorage.getItem("USER_EMAIL");
  const accountName = localStorage.getItem("ACCOUNT_NAME");
  const accountNumber = localStorage.getItem("ACCOUNT_NUMBER");
  const bankName = localStorage.getItem("BANK_NAME");

  const walletHistory = JSON.parse(localStorage.getItem('WALLET_HISTORY')) || [];
  const walletBalance = localStorage.getItem('WALLET_BALANCE') || '';

  return (
    <section className='sm:mx-20 lg:mx-32 mx-2 mt-4'>
      <div className='flex flex-col sm:flex-row justify-normal space-y-4 sm:space-y-0 sm:space-x-4 sm:my-10'>
        <div className='shadow-sm shadow-slate-500 w-full h-48 rounded-lg flex justify-center items-center'>
        <div className='relative flex-grow shadow-sm shadow-slate-500 w-full h-48 rounded-lg flex flex-col justify-center items-center'>
        <img 
            src={Frame_01}
            alt={'Frame_01'}
            className='w-full h-full object-cover rounded-lg'
          />
          <div className="absolute inset-0 rounded-lg bg-blue-950 opacity-70"></div>
          <div className='absolute flex flex-col justify-center items-center capitalize text-white'>
            <WalletIcon className='w-8 h-8'/>
            <p>wallet balance</p>
            <p className='text-4xl font-semibold'>₦ {walletBalance}</p>
          </div>
        </div>
        </div>
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
            <p>monthly total income</p>
            <p className='text-4xl font-semibold'>₦ 0.00</p>
          </div>
        </div>
        </div>
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
            <p>monthly total expenses</p>
            <p className='text-4xl font-semibold'>₦ 0.00</p>
          </div>
        </div>
        </div>
      </div>
      <div className='flex flex-col sm:flex-row justify-normal space-y-4 sm:space-y-0 sm:space-x-4 my-4 sm:mb-10'>
        <div className='shadow-sm shadow-slate-500 sm:w-5/6 h-96 rounded-lg flex justify-center'>
        <div className='w-full'>
            <ul className='flex justify-between text-normal p-1 capitalize font-semibold text-slate-600 rounded-t-lg shadow-sm shadow-slate-500 mb-5'>
              <li>wallet history</li>
            </ul>
            {walletHistory.length === 0 && 
            <div className='flex flex-row justify-center items-center rounded-lg px-4 py-2 mx-2 shadow-sm shadow-gray-500'>
              <h4 className='text-gray-800 opacity-75 tracking-tighter'>No wallet history</h4>
            </div>
            }
            {walletHistory.length > 0 && 
            <div>
              {walletHistory.map((wallHistory) => (
              <div className='shadow-sm shadow-slate-500 rounded-md m-2 flex justify-between items-center p-2'>
                <div>
                  <>
                    <p className='text-xs capitalize'>credited: <span>&#8358;{(Number(wallHistory.price)).toLocaleString()}</span></p>
                    <p className='text-xs capitalize'>date: <span>{`${wallHistory.created_at.slice(8,10)}-${wallHistory.created_at.slice(5,7)}-${wallHistory.created_at.slice(0,4)}`} | {wallHistory.created_at.slice(11,16)}</span></p>
                  </>
                </div>
                <div className='bg-blue-950 opacity-75 flex justify-center items-center rounded-md cursor-pointer text-xs px-2 py-1 text-white hover:bg-orange-500 transform duration-300 ease-in-out'>
                  <Link to={""}>view</Link>
                </div>
              </div>
              )).slice(0, 3)}
            </div>
            }
          </div>
        </div>
        <div className='shadow-sm shadow-slate-500 sm:w-2/5 h-96 rounded-lg flex justify-center items-center py-4'>
          <div className='w-full rounded-l-lg flex flex-col justify-normal items-center h-full'>
            <div className='flex flex-col justify-center items-center w-full py-4'>
              <h2 className='font-semibold text-slate-700 opacity-75'>Account details</h2>
              <hr className='w-4/5 border-1 border-black'/>
            </div>
            <ul className='grid grid-cols-2 gap-2 gap-y-4 text-sm capitalize italic font-semibold mb-20'>
              <li className='text-center'>account name:<br /> <span className='not-italic font-normal'>{accountName}</span></li>
              <li className='text-center'>account NO:<br /> <span className='not-italic font-normal'>{accountNumber}</span></li>
              <li className='text-center'>bank name:<br /> <span className='not-italic font-normal'>{bankName}</span></li>
            </ul>
            <div>
              <Link to={""} className='px-4 font-semibold text-lg bg-slate-500 text-slate-200 rounded-md capitalize hover:bg-orange-500 opacity-75 transform duration-300 ease-in-out py-2 '>
                fund wallet
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
