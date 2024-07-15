import { UserIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import React from 'react'

export default function UserProfile() {

  const customer_name = localStorage.getItem('USER_NAME') || '';
  const meterNumber = localStorage.getItem('USER_METER_NUMBER') || '';
  const phoneNumber = localStorage.getItem("USER_PHONE") || '';

  return (
    <div className='bg-white bg-cover pb-4 w-full'>
    <motion.section 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
      className='flex flex-col sm:flex-row w-full justify-center items-center'>
      <div className='shadow-sm shadow-slate-500 w-full sm:w-3/4 mb-10 rounded-b-md'>
        <div className='flex flex-col justify-center items-center pt-10'>
          <div className='shadow-md shadow-slate-500 w-fit rounded-md'>
            <UserIcon className='h-40 w-40 text-slate-700 opacity-15' />
          </div>
        </div>
        <div className='px-10'>
          <hr className='my-5 sha-1 border-black w-full' />
        </div>
        <h1 className='text-md font-semibold text-slate-600 text-center underline'>User Details</h1>
        <div className='pb-10 px-10'>
          <div className='grid sm:grid-cols-2 gap-4 my-4 text-center sm:text-left'>
            <div className='capitalize'>
              <label className='text-sm font-semibold text-slate-600'>account name</label>
              <p className='w-full'>{customer_name.replace(/"/g, '')}</p>
              <hr className='border-black w-full' />
            </div>
            {/* <div className='capitalize'>
              <label className='text-sm font-semibold text-slate-600'>Wallet account number</label>
              <p className='w-full'>1234567890</p>
              <hr className='border-black w-full' />
            </div> */}
            <div className='capitalize'>
              <label className='text-sm font-semibold text-slate-600'>meter no/acct no</label>
              <p className='w-full'>{meterNumber.replace(/"/g, '')}</p>
              <hr className='border-black w-full' />
            </div>
            {/* <div className='capitalize'>
              <label className='text-sm font-semibold text-slate-600'>bank name</label>
              <p className='w-full'>1234567890</p>
              <hr className='border-black w-full' />
            </div> */}
            <div className='capitalize'>
              <label className='text-sm font-semibold text-slate-600'>phone number</label>
              <p className='w-full'>{phoneNumber.replace(/"/g, '')}</p>
              <hr className='border-black w-full' />
            </div>
            <div className='capitalize'>
              <label className='text-sm font-semibold text-slate-600'>account type</label>
              <p className='w-full'>{meterNumber.length > 11 ? "Postpaid" : "Prepaid"}</p>
              <hr className='border-black w-full' />
            </div>
          </div>
          {/* <div className='capitalize w-full text-center sm:text-left'>
              <label className='text-sm font-semibold text-slate-600'>address</label>
              <p className='w-full'>not found</p>
              <hr className='border-black w-full' />
          </div> */}
          {/* <div className='grid sm:grid-cols-3 gap-4 mt-4 text-center sm:text-left'>
            <div className='capitalize'>
              <label className='text-sm font-semibold text-slate-600'>state</label>
              <p className='w-full'>Nin</p>
              <hr className='border-black w-full' />
            </div>
            <div className='capitalize'>
              <label className='text-sm font-semibold text-slate-600'>LGA</label>
              <p className='w-full'>Nin</p>
              <hr className='border-black w-full' />
            </div>
            <div className='capitalize'>
              <label className='text-sm font-semibold text-slate-600'>city</label>
              <p className='w-full'>Nin</p>
              <hr className='border-black w-full' />
            </div>
            <div className='capitalize'>
              <label className='text-sm font-semibold text-slate-600'>tarrif code</label>
              <p className='w-full'>{tarrif_code.replace(/"/g, '')}</p>
              <hr className='border-black w-full' />
            </div>
            <div className='capitalize'>
              <label className='text-sm font-semibold text-slate-600'>old tarrif code</label>
              <p className='w-full'>Nin</p>
              <hr className='border-black w-full' />
            </div>
            <div className='capitalize'>
              <label className='text-sm font-semibold text-slate-600'>account description</label>
              <p className='w-full'>Nin</p>
              <hr className='border-black w-full' />
            </div>
            <div className='capitalize'>
              <label className='text-sm font-semibold text-slate-600'>region</label>
              <p className='w-full'>Nin</p>
              <hr className='border-black w-full' />
            </div>
            <div className='capitalize'>
              <label className='text-sm font-semibold text-slate-600'>business hub</label>
              <p className='w-full'>{business_hub.replace(/"/g, '')}</p>
              <hr className='border-black w-full' />
            </div>
            <div className='capitalize'>
              <label className='text-sm font-semibold text-slate-600'>service center</label>
              <p className='w-full'>Nin</p>
              <hr className='border-black w-full' />
            </div>
          </div> */}
        </div>
      </div>
    </motion.section>
    </div>
  )
}
