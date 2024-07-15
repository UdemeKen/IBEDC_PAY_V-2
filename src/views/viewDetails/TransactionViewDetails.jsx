import React from 'react'
import { Link, useParams } from 'react-router-dom'

export default function TransactionViewDetails() {

    const allTransactions = JSON.parse(localStorage.getItem('TRANSACTION_HISTORY')) || [];
    const { id } = useParams();
    const transaction = allTransactions.find(transaction => transaction.id == id);

    if(!transaction) {
        return <h1>Transaction not found</h1>
    }

    const { transaction_id, date_entered, amount, status } = transaction;

  return (
    <section className='flex flex-col items-center w-full px-4 py-10'>
        <div className='shadow-sm shadow-slate-500 rounded-lg flex flex-col justify-center w-full sm:w-1/2 items-center py-4'>
            <h4 className="text-gray-800 opacity-75 tracking-tighter text-center font-serif font-bold underline">Transaction Details</h4>
            <div className='grid sm:grid-rows-3 sm:grid-flow-col gap-y-4 sm:gap-5 sm:px-16 sm:py-4 text-center w-full'>
                <div>
                    <label className='text-md font-bold'>Transaction ID</label>
                    <p>{transaction_id}</p>
                </div>
                <div>
                    <label className='text-md font-bold'>Transaction Date</label>
                    <p>{date_entered.slice(0,10)}</p>
                </div>
                <div>
                    <label className='text-md font-bold'>Amount Paid</label>
                    <p>₦{amount}</p>
                </div>
                <div>
                    <label className='text-md font-bold'>Payment Status</label>
                    <p className='text-green-700 font-bold italic'>{status}</p>
                </div>
            </div>
            <Link to={`/prepaidtransactionreceipt/${id}`} target='_blank' className='bg-blue-950 opacity-80 my-10 hover:bg-orange-700 traznsform duration-300 ease-in-out text-white sm:w-1/3 text-center rounded-md py-2 px-2 capitalize mb-4'>view receipt</Link>
        </div>
    </section>
  )
}
