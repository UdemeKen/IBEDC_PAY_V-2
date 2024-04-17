import React from 'react'
import { ReceiptHeaderImage, Black_Logo} from '../../assets/images'

export default function PrepaidTransactionReceipt() {
  return (
    <section>
      <div className="sm:mx-auto w-full sm:w-3/4 md:w-1/2">
          <div className='shadow-sm shadow-slate-500' 
          // ref={pdfRef}
          >
              <div>
                  <img 
                  src={ReceiptHeaderImage}
                  alt='header'/>
              </div>
              <div className='w-full text-center'>
                  <h1 className='sm:text-lg uppercase mb-4 font-semibold text-blue-900'>Prepaid Transaction Receipt</h1>
              </div>
              <div className='grid sm:grid-rows-5 sm:grid-flow-col gap-y-6 justify-between px-16 text-center sm:text-left'>
                <div className=''>
                    <label className='text-md font-semibold text-gray-800'>Customer Name</label>
                    <p className='text-sm font-semibold text-gray-500'>OMOWELE ADEKUMBI FUNMILAYO 16</p>
                </div>
                <div>
                    <label className='text-md font-semibold text-gray-800'>AcctNo/MeterNo</label>
                    <p className='text-sm font-semibold text-gray-500'>21/81/19/6334-01 | 70004984442</p>
                </div>
                <div className=''>
                    <label className='text-md font-semibold text-gray-800'>Customer Address</label>
                    <p className='text-sm font-semibold text-gray-500 sm:w-2/3'>Being plots 11B12,on Messrs lamidi atoyebi layout elebu</p>
                </div>
                <div>
                    <label className='text-md font-semibold text-gray-800'>Transaction Reference</label>
                    <p className='text-sm font-semibold text-gray-500'>112-0326334208</p>
                </div>
                <div>
                    <label className='text-md font-semibold text-gray-800'>Purpose of Payment</label>
                    <p className='text-sm font-semibold text-gray-500'>CREDIT TOKEN BY CUSTOMER</p>
                </div>
                <div>
                    <label className='text-md font-semibold text-gray-800'>Transaction Date</label>
                    <p className='text-sm font-semibold text-gray-500'>2024-03-26</p>
                </div>
                <div>
                    <label className='text-md font-semibold text-gray-800'>Transaction Status</label>
                    <p className='text-sm font-semibold text-gray-500'>Success</p>
                </div>
                <div>
                    <label className='text-md font-semibold text-gray-800'>Transaction Amount</label>
                    <p className='text-sm font-semibold text-gray-500'>₦10</p>
                </div>
                <div>
                    <label className='text-md font-semibold text-gray-800'>Customer Token</label>
                    <p className='text-sm font-semibold text-gray-500'>57053167681401162029</p>
                </div>
              </div>
              <div className='flex flex-col justify-center items-center text-xs my-4'>
                  <img 
                  src={Black_Logo}
                  alt="footer-logo" 
                  className='h-8 mx-3 w-20'/>
                  <p className='font-semibold w-full text-orange-500 text-center'>Distributing Power, Changing Lives</p>
              </div>
          </div>
          <div className='flex flex-col justify-center items-center'>
            <button 
            // onClick={downloadPDF} 
            className='flex flex-row justify-center text-white rounded-md border-none viewbtn my-1 px-2 py-1'>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                    <path d="M10.75 2.75a.75.75 0 00-1.5 0v8.614L6.295 8.235a.75.75 0 10-1.09 1.03l4.25 4.5a.75.75 0 001.09 0l4.25-4.5a.75.75 0 00-1.09-1.03l-2.955 3.129V2.75z" />
                    <path d="M3.5 12.75a.75.75 0 00-1.5 0v2.5A2.75 2.75 0 004.75 18h10.5A2.75 2.75 0 0018 15.25v-2.5a.75.75 0 00-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5z" />
                </svg>
                <p className=''>Download</p>
            </button>
          </div>
      </div>
    </section>
  )
}
