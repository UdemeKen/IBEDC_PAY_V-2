import React, { useEffect, useState } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom';
import PostpaidBillReceipt from '../receipts/PostpaidBillReceipt';

export default function BillViewDetails({selectedBill}) {

    const location = useLocation();
    
  return (
    <section className={`${location.pathname === "/default/alltransactions" ? "hidden" : ""} w-full h-full`}>
        {selectedBill &&
            <div className='shadow-sm shadow-slate-500 w-full h-full rounded-lg'>
                <h4 className="text-gray-800 opacity-75 tracking-tighter text-center font-serif font-bold underline pt-5">Bill Details</h4>
                <div className='text-center my-4'>
                <label className='text-md font-sans font-semibold'>Customer Name</label>
                <p>{selectedBill.CustomerName}</p>
                </div>
                <div className='grid grid-cols-1 sm:grid-cols-3 gap-y-4 text-center text-sm'>
                <div>
                    <label className='text-md font-sans font-semibold'>Account Number</label>
                    <p>{selectedBill?.AccountNo}</p>
                </div>
                <div>
                    <label className='text-md font-sans font-semibold'>Account Type</label>
                    <p>{selectedBill?.AcctTye}</p>
                </div>
                <div>
                    <label className='text-md font-sans font-semibold'>Amount Billed</label>
                    <p>₦{((Number(selectedBill?.CurrentChgTotal) || 0) + (Number(selectedBill?.VAT) || 0)).toLocaleString('en-NG', { style: 'decimal', minimumFractionDigits: 2 })}</p>
                </div>
                <div>
                    <label className='text-md font-sans font-semibold'>Bill ID</label>
                    <p>{selectedBill?.BillID}</p>
                </div>
                <div>
                    <label className='text-md font-sans font-semibold'>Service Address</label>
                    <p>{selectedBill?.ServiceAddress1}</p>
                </div>
                <div>
                    <label className='text-md font-sans font-semibold'>NetArrears</label>
                    <p>₦{(Number(selectedBill?.NetArrears) || 0).toLocaleString()}</p>
                </div>
                <div>
                    <label className='text-md font-sans font-semibold'>Business Hub ID</label>
                    <p>{selectedBill?.BUID}</p>
                </div>
                <div>
                    <label className='text-md font-sans font-semibold'>Business Hub</label>
                    <p>{selectedBill?.BUName1}</p>
                </div>
                <div>
                    <label className='text-md font-sans font-semibold'>Last Payment Amount</label>
                    <p>₦{selectedBill?.LastPayAmount === ".00" ? "0.00" : (Number(selectedBill?.LastPayAmount)).toLocaleString()}</p>
                </div>
                <div>
                    <label className='text-md font-sans font-semibold'>CurrentKWH</label>
                    <p>{selectedBill?.CurrentKWH}</p>
                </div>
                <div>
                    <label className='text-md font-sans font-semibold'>ConsumptionKWH</label>
                    <p>{selectedBill?.ConsumptionKWH === null ? "Not available" : selectedBill?.ConsumptionKWH}</p>
                </div>
                <div>
                    <label className='text-md font-sans font-semibold'>Rate</label>
                    <p>{selectedBill?.Rate}</p>
                </div>
                <div>
                    <label className='text-md font-sans font-semibold'>Billed Date</label>
                    <p>{selectedBill?.Billdate.slice(0, 10)}</p>
                </div>
                <div>
                    <label className='text-md font-sans font-semibold'>Service Band</label>
                    <p>{selectedBill?.ServiceID}</p>
                </div>
                <div>
                    <label className='text-md font-sans font-semibold'>Tarriff Code</label>
                    <p>{selectedBill?.TariffCode}</p>
                </div>
                <div className='text-white sm:block hidden'>
                    <label className='text-md font-sans font-semibold'>Undertakings</label>
                    {/* <p>{selectedTransaction?.status === "processing" ? <span className='text-extra-xs'>Display on payment successful...</span> : selectedTransaction?.status === "failed" ? "no unit" : selectedTransaction?.udertaking}</p> */}
                </div>
                <div>
                    <label className='text-md font-sans font-semibold'>Total Due</label>
                    <p>₦{(Number(selectedBill?.TotalDue)).toLocaleString()}</p>
                </div>
                <div className='text-white sm:block hidden'>
                    <label className='text-md font-sans font-semibold'>DSS Name</label>
                    {/* <p>{selectedTransaction?.status === "processing" ? <span className='text-extra-xs'>Display on payment successful...</span> : selectedTransaction?.status === "failed" ? "no unit" : selectedTransaction?.dssName}</p> */}
                </div>
            </div>
            <div className='flex justify-center items-center'>
                <Link to={`/postpaidbillreceipt/${selectedBill?.BillID}`} target='_blank' className='bg-blue-950 opacity-80 my-10 hover:bg-orange-700 traznsform duration-300 ease-in-out text-white sm:w-1/3 text-center rounded-md py-2 px-2 capitalize mb-4'>view receipt</Link>
            </div>
        </div>
         }
         {/* <div className='hidden'>
            <PostpaidBillReceipt currentBill={currentBill}/>
         </div> */}
    </section>
  )
}
