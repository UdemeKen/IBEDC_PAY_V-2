import React, { useState } from 'react'
import { ChevronDownIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

export default function FAQ() {

  const [ toggler, setToggler ] = useState(false);
  const [ toggler_2, setToggler_2 ] = useState(false);
  const [ toggler_3, setToggler_3 ] = useState(false);
  const [ toggler_4, setToggler_4 ] = useState(false);
  const [ toggler_5, setToggler_5 ] = useState(false);
  const [ toggler_6, setToggler_6 ] = useState(false);
  const [ toggler_7, setToggler_7 ] = useState(false);
  const [ toggler_8, setToggler_8 ] = useState(false);

  const handleToggler = () => {
    setToggler(!toggler);
  };

  const handleToggler_2 = () => {
    setToggler_2(!toggler_2);
  };

  const handleToggler_3 = () => {
    setToggler_3(!toggler_3);
  };
  const handleToggler_4 = () => {
    setToggler_4(!toggler_4);
  };
  const handleToggler_5 = () => {
    setToggler_5(!toggler_5);
  };
  const handleToggler_6 = () => {
    setToggler_6(!toggler_6);
  };
  const handleToggler_7 = () => {
    setToggler_7(!toggler_7);
  };
  const handleToggler_8 = () => {
    setToggler_8(!toggler_8);
  };


  return (
    <section className='flex flex-col sm:flex-row sm:justify-center mx-2 my-4'>
      <div className='shadow-sm shadow-slate-500 sm:my-10 sm:w-1/2 flex flex-col sm:justify-center sm:items-center py-5 rounded-lg'>
        <div className='sm:w-3/4 px-2'>
          <div className='shadow-sm shadow-slate-500 bg-slate-700 hover:bg-orange-500 transform duration-300 ease-in-out opacity-85 text-center flex justify-between px-5 py-2 rounded-t-md cursor-pointer' onClick={handleToggler}>
            <p className='text-slate-700 opacity-85'>.</p>
            <p className='text-white capitalize'>What are the available payment methods?</p>
            {!toggler ? <ChevronRightIcon className='h-6 w-6 text-white' /> : <ChevronDownIcon className='h-6 w-6 text-white' />}
          </div>
          {toggler && <div className='shadow-sm shadow-slate-500 bg-slate-200 text-justify'>
            <p className='text-orange-800 opacity-80 text-sm p-2 text-center'>Card and Transfer.</p>
          </div>}
          <div className='flex justify-center'>
            <hr className='my-1 sha-1 border-black w-1/3 items-center' />
          </div>
          <div className='shadow-sm shadow-slate-500  bg-slate-700 hover:bg-orange-500 transform duration-300 ease-in-out opacity-85 text-center flex justify-between px-5 py-2 cursor-pointer' onClick={handleToggler_2}>
            <p className='text-slate-700 opacity-85'>.</p>
            <p className='text-white capitalize'>Is the IBEDC PAY Application for all IBEDC customers?</p>
            {!toggler_2 ? <ChevronRightIcon className='h-6 w-6 text-white' /> : <ChevronDownIcon className='h-6 w-6 text-white' />}
          </div>
          {toggler_2 && <div className='shadow-sm shadow-slate-500 bg-slate-200 text-justify'>
            <p className='text-orange-800 opacity-80 text-sm p-2 text-center'>Yes, it is for both IBEDC Postpaid and Prepaid customers</p>
          </div>}
          <div className='flex justify-center'>
            <hr className='my-1 sha-1 border-black w-1/3 items-center' />
          </div>
          <div className='shadow-sm shadow-slate-500  bg-slate-700 hover:bg-orange-500 transform duration-300 ease-in-out opacity-85 text-center flex justify-between px-5 py-2 cursor-pointer' onClick={handleToggler_3}>
            <p className='text-slate-700 opacity-85'>.</p>
            <p className='text-white capitalize'>How do I update my profile on the IBEDC PAY Application?</p>
            {!toggler_3 ? <ChevronRightIcon className='h-6 w-6 text-white' /> : <ChevronDownIcon className='h-6 w-6 text-white' />}
          </div>
          {toggler_3 && <div className='shadow-sm shadow-slate-500 bg-slate-200 text-justify'>
            <p className='text-orange-800 opacity-80 text-sm p-2 text-center'> You cannot update your profile on the Application, rather you have to visit the nearest IBEDC office.</p>
          </div>}
          <div className='flex justify-center'>
            <hr className='my-1 sha-1 border-black w-1/3 items-center' />
          </div>
          <div className='shadow-sm shadow-slate-500  bg-slate-700 hover:bg-orange-500 transform duration-300 ease-in-out opacity-85 text-center flex justify-between px-5 py-2 cursor-pointer' onClick={handleToggler_4}>
            <p className='text-slate-700 opacity-85'>.</p>
            <p className='text-white capitalize'>How do I get a confirmation for payment from the IBEDC PAY Application?</p>
            {!toggler_4 ? <ChevronRightIcon className='h-6 w-6 text-white' /> : <ChevronDownIcon className='h-6 w-6 text-white' />}
          </div>
          {toggler_4 && <div className='shadow-sm shadow-slate-500 bg-slate-200 text-justify'>
            <p className='text-orange-800 opacity-80 text-sm p-2 text-center'>Once your payment has been successful, you will receive a response via your email. Also, your payment details will reflect on your “History” page. </p>
          </div>}
          <div className='flex justify-center'>
            <hr className='my-1 sha-1 border-black w-1/3 items-center' />
          </div>
          <div className='shadow-sm shadow-slate-500  bg-slate-700 hover:bg-orange-500 transform duration-300 ease-in-out opacity-85 text-center flex justify-between px-5 py-2 cursor-pointer' onClick={handleToggler_5}>
            <p className='text-slate-700 opacity-85'>.</p>
            <p className='text-white capitalize'>Why is my meter rejecting the token?</p>
            {!toggler_5 ? <ChevronRightIcon className='h-6 w-6 text-white' /> : <ChevronDownIcon className='h-6 w-6 text-white' />}
          </div>
          {toggler_5 && <div className='shadow-sm shadow-slate-500 bg-slate-200 text-justify'>
            <p className='text-orange-800 opacity-80 text-sm p-2 text-center'>You might need to upgrade your meter using the KCT 1 and KCT 2 codes.</p>
          </div>}
          <div className='flex justify-center'>
            <hr className='my-1 sha-1 border-black w-1/3 items-center' />
          </div>
          <div className='shadow-sm shadow-slate-500  bg-slate-700 hover:bg-orange-500 transform duration-300 ease-in-out opacity-85 text-center flex justify-between px-5 py-2 cursor-pointer' onClick={handleToggler_6}>
            <p className='text-slate-700 opacity-85'>.</p>
            <p className='text-white capitalize'>How do I get the KCT 1 and KCT 2 codes?</p>
            {!toggler_6 ? <ChevronRightIcon className='h-6 w-6 text-white' /> : <ChevronDownIcon className='h-6 w-6 text-white' />}
          </div>
          {toggler_6 && <div className='shadow-sm shadow-slate-500 bg-slate-200 text-justify'>
            <p className='text-orange-800 opacity-80 text-sm p-2 text-center'>Visit our portal via https://tidrollover.ibedc.com/kctupgrade/</p>
          </div>}
          <div className='flex justify-center'>
            <hr className='my-1 sha-1 border-black w-1/3 items-center' />
          </div>
          <div className='shadow-sm shadow-slate-500  bg-slate-700 hover:bg-orange-500 transform duration-300 ease-in-out opacity-85 text-center flex justify-between px-5 py-2 cursor-pointer' onClick={handleToggler_7}>
            <p className='text-slate-700 opacity-85'>.</p>
            <p className='text-white capitalize'>Why didn’t I get my token after a successful purchase?</p>
            {!toggler_7 ? <ChevronRightIcon className='h-6 w-6 text-white' /> : <ChevronDownIcon className='h-6 w-6 text-white' />}
          </div>
          {toggler_7 && <div className='shadow-sm shadow-slate-500 bg-slate-200 text-justify'>
            <p className='text-orange-800 opacity-80 text-sm p-2 text-center'>Kindly ensure you put in the correct phone number and email address while filling out the form for your electricity purchase. Also, check your transaction “History” on the Application. </p>
          </div>}
          <div className='flex justify-center'>
            <hr className='my-1 sha-1 border-black w-1/3 items-center' />
          </div>
          <div className='shadow-sm shadow-slate-500  bg-slate-700 hover:bg-orange-500 transform duration-300 ease-in-out opacity-85 text-center flex justify-between px-5 py-2 rounded-b-md cursor-pointer' onClick={handleToggler_8}>
            <p className='text-slate-700 opacity-85'>.</p>
            <p className='text-white capitalize'> What do I do when I purchase electricity but don’t receive my token?</p>
            {!toggler_8 ? <ChevronRightIcon className='h-6 w-6 text-white' /> : <ChevronDownIcon className='h-6 w-6 text-white' />}
          </div>
          {toggler_8 && <div className='shadow-sm shadow-slate-500 bg-slate-200 text-justify'>
            <p className='text-orange-800 opacity-80 text-sm p-2 text-center'>Kindly contact our IBEDC Customer Care Centre via  07001239999 or send an email to  customercare@ibedc.com</p>
          </div>}
        </div>
      </div>
    </section>
  )
}
