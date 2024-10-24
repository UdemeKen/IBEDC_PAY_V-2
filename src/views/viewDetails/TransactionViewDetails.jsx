import React from 'react'
import { Link, useParams } from 'react-router-dom'

export default function TransactionViewDetails() {

    const allTransactions = JSON.parse(localStorage.getItem('TRANSACTION_HISTORY')) || [];
    const accountTypeRaw = localStorage.getItem('LOGIN_ACCOUNT_TYPE');
    const accountType = accountTypeRaw ? accountTypeRaw : ""; // Directly assign the raw value
    const { id } = useParams();
    let transaction;
    if (accountType === "Prepaid") {
        transaction = allTransactions.find(transaction => transaction.TransactionNo == id);
    } else {
        transaction = allTransactions.find(transaction => transaction.PaymentID == id);
    }
    console.log(transaction);
    

    if(!transaction) {
        return <h1>Transaction not found</h1>
    }

  return (
    <section className='flex flex-col items-center w-full px-4 py-10'>
        <div className='shadow-sm shadow-slate-500 rounded-lg flex flex-col justify-center w-full sm:w-1/2 items-center py-4'>
            <h4 className="text-gray-800 opacity-75 tracking-tighter text-center font-serif font-bold underline mb-4">Transaction Details</h4>
            <div className='grid sm:grid-rows-4 sm:grid-cols-3 sm:grid-flow-col gap-y-4 sm:gap-5 sm:px-16 sm:py-4 text-center w-full'>
                {accountType === "Prepaid" && <div>
                    <label className='text-md font-bold'>Transaction Reference</label>
                    <p className='w-full text-xs'>{transaction?.transref}</p>
                </div>}
                {accountType === "Postpaid" && <div>
                    <label className='text-md font-bold'>Bill ID</label>
                    <p className='w-full text-xs'>{transaction?.BillID}</p>
                </div>}
                {accountType === "Prepaid" && <div>
                    <label className='text-md font-bold'>Amount Paid</label>
                    <p>₦{transaction?.Amount}</p>
                </div>}
                {accountType === "Postpaid" && <div>
                    <label className='text-md font-bold'>Amount Paid</label>
                    <p>₦{transaction?.Payments}</p>
                </div>}
                {accountType === "Prepaid" && <div>
                    <label className='text-md font-bold'>Address</label>
                    <p>{transaction?.Address === null ? "No Address" : transaction?.Address}</p>
                </div>}
                {accountType === "Postpaid" && <div>
                    <label className='text-md font-bold'>Business Unit</label>
                    <p>{transaction?.BusinessUnit === null ? "No Business Unit" : transaction?.BusinessUnit}</p>
                </div>}
                {accountType === "Postpaid" && <div className="sm:text-white lg:text-white">
                    <label className='text-md font-bold'>Operator ID</label>
                    <p>{transaction?.OperatorID}</p>
                </div>}
                {accountType === "Prepaid" && <div>
                    <label className='text-md font-bold'>Transaction Date</label>
                    <p>{transaction?.TransactionDateTime.slice(0,10)}</p>
                </div>}
                {accountType === "Postpaid" && <div>
                    <label className='text-md font-bold'>Transaction Date</label>
                    <p>{transaction?.DateEngtered.slice(0,10)}</p>
                </div>}
                {accountType === "Postpaid" && <div>
                    <label className='text-md font-bold'>Account Number</label>
                    <p>{transaction?.AccountNo}</p>
                </div>}
                {accountType === "Prepaid" && <div>
                    <label className='text-md font-bold'>Meter Number</label>
                    <p>{transaction?.meter_no}</p>
                </div>}
                {accountType === "Prepaid" && <div>
                    <label className='text-md font-bold'>Reasons</label>
                    <p>{transaction?.Reasons}</p>
                </div>}
                {accountType === "Postpaid" && <div>
                    <label className='text-md font-bold'>Customer ID</label>
                    <p>{transaction?.CustomerID}</p>
                </div>}
                {accountType === "Prepaid" && <div>
                    <label className='text-md font-bold'>Cost of Units</label>
                    <p>₦{transaction?.CostOfUnits}</p>
                </div>}
                {accountType === "Prepaid" && <div>
                    <label className='text-md font-bold'>BUID</label>
                    <p>{transaction?.BUID}</p>
                </div>}
                {accountType === "Postpaid" && <div>
                    <label className='text-md font-bold'>Payment ID</label>
                    <p>{transaction?.PaymentID}</p>
                </div>}
                {accountType === "Prepaid" && <div>
                    <label className='text-md font-bold'>Units</label>
                    <p>{transaction?.Units}</p>
                </div>}
                {accountType === "Postpaid" && <div>
                    <label className='text-md font-bold'>Payment Transaction Id</label>
                    <p>{transaction?.PaymentTransactionId}</p>
                </div>}
                {accountType === "Prepaid" && <div>
                    <label className='text-md font-bold'>Transaction Number</label>
                    <p className='flex justify-center'>{transaction?.TransactionNo}</p>
                </div>}
                {accountType === "Prepaid" && <div>
                    <label className='text-md font-bold'>MeterNo/Account No</label>
                    <p className=''>{transaction?.MeterNo}</p>
                </div>}
                {accountType === "Postpaid" && <div>
                    <label className='text-md font-bold'>Receipt Number</label>
                    <p className=''>{transaction?.receiptnumber}</p>
                </div>}
                {accountType === "Prepaid" && <div>
                    <label className='text-md font-bold'>VAT</label>
                    <p>₦{transaction?.VAT}</p>
                </div>}
                {accountType === "Prepaid" && <div>
                    <label className='text-md font-bold'>Token</label>
                    <p>{transaction?.Token}</p>
                </div>}
                {accountType === "Postpaid" && <div>
                    <label className='text-md font-bold'>Rowguid</label>
                    <p>{transaction?.rowguid}</p>
                </div>}
                {accountType === "Postpaid" && <div className='hidden'>
                    <label className='text-md font-bold'>Token</label>
                    <p>{transaction?.rowguid}</p>
                </div>}
            </div>
            {accountType === "Prepaid" && <Link to={`/prepaidtransactionreceipt/${id}`} target='_blank' className='bg-blue-950 opacity-80 my-10 hover:bg-orange-700 traznsform duration-300 ease-in-out text-white sm:w-1/3 text-center rounded-md py-2 px-2 capitalize mb-4'>view receipt</Link>}
            {accountType === "Postpaid" && <Link to={`/postpaidtransactionreceipt/${id}`} target='_blank' className='bg-blue-950 opacity-80 my-10 hover:bg-orange-700 traznsform duration-300 ease-in-out text-white sm:w-1/3 text-center rounded-md py-2 px-2 capitalize mb-4'>view receipt</Link>}
        </div>
    </section>
  )
}
