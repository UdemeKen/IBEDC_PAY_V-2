import React from 'react'
import { Link, useParams } from 'react-router-dom'

export default function TransactionViewDetails() {

    const allTransactions = JSON.parse(localStorage.getItem('TRANSACTION_HISTORY')) || [];
    const { id } = useParams();
    const transaction = allTransactions.find(transaction => transaction.id == id);

    if(!transaction) {
        return <h1>Transaction not found</h1>
    }

    const { 
        transaction_id, 
        date_entered,
        amount,
        status,
        account_number,
        account_type,
        meter_no,
        customer_name,
        provider,
        BUID,
        units,
        costOfUnits,
        VAT,
        tariffcode,
        serviceBand,
        feederName,
        dssName,
        udertaking,
        providerRef,
        Address,
        receiptno
         } = transaction;

  return (
    <section className='flex flex-col items-center w-full px-4 py-10'>
        <div className='shadow-sm shadow-slate-500 rounded-lg flex flex-col justify-center w-full sm:w-1/2 items-center py-4'>
            <h4 className="text-gray-800 opacity-75 tracking-tighter text-center font-serif font-bold underline mb-4">Transaction Details</h4>
            <div className='grid sm:grid-rows-7 sm:grid-cols-3 sm:grid-flow-col gap-y-4 sm:gap-5 sm:px-16 sm:py-4 text-center w-full'>
                <div>
                    <label className='text-md font-bold'>Customer Name</label>
                    <p className='w-full text-xs'>{customer_name}</p>
                </div>
                <div>
                    <label className='text-md font-bold'>Amount Paid</label>
                    <p>₦{amount}</p>
                </div>
                <div>
                    <label className='text-md font-bold'>Address</label>
                    <p>{Address === null ? "No Address" : Address}</p>
                </div>
                <div>
                    <label className='text-md font-bold'>Transaction Date</label>
                    <p>{date_entered.slice(0,10)}</p>
                </div>
                <div>
                    <label className='text-md font-bold'>Units</label>
                    <p>{status === "processing" ? <span className='text-extra-xs'>Display on payment successful...</span> : status === "failed" ? "no unit" : units}</p>
                </div>
                <div>
                    <label className='text-md font-bold'>Tarriff Code</label>
                    <p>{status === "processing" ? <span className='text-extra-xs'>Display on payment successful...</span> : status === "failed" ? "no unit" : tariffcode}</p>
                </div>
                <div>
                    <label className='text-md font-bold'>DSS Name</label>
                    <p>{status === "processing" ? <span className='text-extra-xs'>Display on payment successful...</span> : status === "failed" ? "no unit" : dssName}</p>
                </div>
                {account_type === "Postpaid" && <div>
                    <label className='text-md font-bold'>Account Number</label>
                    <p>{account_number}</p>
                </div>}
                {account_type === "Prepaid" && <div>
                    <label className='text-md font-bold'>Meter Number</label>
                    <p>{meter_no}</p>
                </div>}
                <div>
                    <label className='text-md font-bold'>BUID</label>
                    <p>{BUID}</p>
                </div>
                <div>
                    <label className='text-md font-bold'>Provider</label>
                    <p>{provider}</p>
                </div>
                <div>
                    <label className='text-md font-bold'>Cost of Units</label>
                    <p>{status === "processing" ? <span className='text-extra-xs'>Display on payment successful...</span> : status === "failed" ? "no unit" : costOfUnits}</p>
                </div>
                <div>
                    <label className='text-md font-bold'>Feeder Name</label>
                    <p>{status === "processing" ? <span className='text-extra-xs'>Display on payment successful...</span> : status === "failed" ? "no unit" : feederName}</p>
                </div>
                <div>
                    <label className='text-md font-bold'>Undertakings</label>
                    <p>{status === "processing" ? <span className='text-extra-xs'>Display on payment successful...</span> : status === "failed" ? "no unit" : udertaking}</p>
                </div>
                <div className='text-white sm:block hidden'>
                    <label className='text-md font-bold'>Token</label>
                    <p>{status === "processing" ? <span className='text-extra-xs'>Display on payment successful...</span> : status === "failed" ? "no unit" : receiptno}</p>
                </div>
                <div>
                    <label className='text-md font-bold'>Account Type</label>
                    <p>{account_type}</p>
                </div>
                <div>
                    <label className='text-md font-bold'>Transaction ID</label>
                    <p className='flex justify-center'>{transaction_id}</p>
                </div>
                <div>
                    <label className='text-md font-bold'>Payment Status</label>
                    <p className='text-green-700 font-bold italic'>{status === "processing" ? <span className='text-yellow-500'>{status}</span> : status === "failed" ? <span className='text-red-500'>{status}</span> : <span className='text-green-500'>{status}</span>}</p>
                </div>
                <div>
                    <label className='text-md font-bold'>VAT</label>
                    <p>{status === "processing" ? <span className='text-extra-xs'>Display on payment successful...</span> : status === "failed" ? "no unit" : VAT}</p>
                </div>
                <div>
                    <label className='text-md font-bold'>Service Band</label>
                    <p>{status === "processing" ? <span className='text-extra-xs'>Display on payment successful...</span> : status === "failed" ? "no unit" : serviceBand}</p>
                </div>
                <div>
                    <label className='text-md font-bold'>Provider Reference</label>
                    <p>{status === "processing" ? <span className='text-extra-xs'>Display on payment successful...</span> : status === "failed" ? "no unit" : providerRef}</p>
                </div>
                <div>
                    <label className='text-md font-bold'>Token</label>
                    <p>{status === "processing" ? <span className='text-extra-xs'>Display on payment successful...</span> : status === "failed" ? "no unit" : receiptno}</p>
                </div>
            </div>
            <Link to={`/prepaidtransactionreceipt/${id}`} target='_blank' className='bg-blue-950 opacity-80 my-10 hover:bg-orange-700 traznsform duration-300 ease-in-out text-white sm:w-1/3 text-center rounded-md py-2 px-2 capitalize mb-4'>view receipt</Link>
        </div>
    </section>
  )
}
