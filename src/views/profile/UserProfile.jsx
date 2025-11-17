import { EnvelopeIcon, PhoneIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import React from 'react'

export default function UserProfile() {
  const rawName = localStorage.getItem('USER_NAME') || '';
  const meterNumber = (localStorage.getItem('USER_METER_NUMBER') || '').replace(/"/g, '');
  const phoneNumber = (localStorage.getItem('USER_PHONE') || '').replace(/"/g, '');
  const email = localStorage.getItem('USER_EMAIL') || '';
  const accountType =
    localStorage.getItem('LOGIN_ACCOUNT_TYPE') ||
    localStorage.getItem('ACCOUNT_TYPE') ||
    (meterNumber.length <= 13 ? 'Prepaid' : meterNumber ? 'Postpaid' : '—');

  const formattedName = rawName.replace(/"/g, '') || 'Customer';

  const infoTiles = [
    { label: 'Meter / Account No.', value: meterNumber || 'Not yet available' },
    { label: 'Account Type', value: accountType || 'Not yet available' },
    { label: 'Phone Number', value: phoneNumber || 'Not yet available' },
    { label: 'Email Address', value: email || 'Not yet available' },
  ];

  return (
    <div className='bg-[#f5f7fb] min-h-screen w-full'>
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.8 }}
        className='mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-10'
      >
        {/* Top summary card */}
        <div className='relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-900 via-blue-800 to-blue-600 text-white shadow-lg'>
          <div className='absolute inset-0 opacity-20 mix-blend-screen bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.4),_transparent_45%)]' />
          <div className='relative flex flex-col gap-6 p-6 sm:flex-row sm:items-center sm:justify-between'>
            <div className='flex flex-1 items-center gap-4'>
              <div className='flex h-20 w-20 items-center justify-center rounded-full bg-white/20 ring-2 ring-white/40'>
                <UserCircleIcon className='h-12 w-12 text-white' />
              </div>
              <div>
                <p className='text-xs uppercase tracking-[0.35em] text-blue-100'>Profile</p>
                <h1 className='text-2xl font-semibold text-white mt-1'>
                  Hello, <span className='font-bold'>{formattedName}</span>
                </h1>
                <p className='text-sm text-blue-100 mt-1'>
                  Keep your account information up to date for seamless payments.
                </p>
              </div>
            </div>
            <div className='flex flex-col gap-3 border-t border-white/20 pt-4 text-sm sm:border-l sm:border-t-0 sm:pl-6 sm:pt-0'>
              <div className='inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1'>
                <span className='h-2 w-2 rounded-full bg-emerald-400 animate-pulse' />
                <span className='font-semibold'>Active Customer</span>
              </div>
              <div className='flex flex-col gap-2 text-blue-100'>
                <div className='flex items-center gap-2'>
                  <PhoneIcon className='h-4 w-4' />
                  <span>{phoneNumber || 'Not available'}</span>
                </div>
                <div className='flex items-center gap-2'>
                  <EnvelopeIcon className='h-4 w-4' />
                  <span className='truncate'>{email || 'Not available'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Details grid */}
        <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
          {infoTiles.map((tile) => (
            <div
              key={tile.label}
              className='rounded-xl border border-slate-100 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md'
            >
              <p className='text-[11px] uppercase tracking-[0.3em] text-slate-500'>{tile.label}</p>
              <p className='mt-2 text-lg font-semibold text-slate-900 break-words'>{tile.value}</p>
            </div>
          ))}
        </div>

        {/* Support card */}
        <div className='rounded-2xl border border-slate-100 bg-white p-6 shadow-sm'>
          <h2 className='text-lg font-semibold text-slate-900'>Need to update something?</h2>
          <p className='mt-2 text-sm text-slate-600'>
            Contact IBEDC support to make changes to your registered details, request a virtual account,
            or get help with recent transactions.
          </p>
          <div className='mt-4 flex flex-col gap-3 text-sm text-slate-700 sm:flex-row sm:items-center sm:justify-between'>
            <div className='flex items-center gap-2'>
              <span className='font-semibold text-blue-900'>Support Email:</span>
              <span>customercare@ibedc.com</span>
            </div>
            <button className='inline-flex items-center justify-center rounded-md bg-blue-900 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-blue-800'>
              Contact Support
            </button>
          </div>
        </div>
      </motion.section>
    </div>
  )
}
