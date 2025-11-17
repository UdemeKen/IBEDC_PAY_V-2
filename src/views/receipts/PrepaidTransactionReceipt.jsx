import React, { useRef, useState } from 'react'
import { ReceiptHeaderImage, Black_Logo} from '../../assets/images'
import { useParams } from 'react-router-dom';
import { ClipLoader } from 'react-spinners';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export default function PrepaidTransactionReceipt() {

    // const account_number = localStorage.getItem('USER_METER_NUMBER');

    const [loading, setLoading] = useState(false);

    const allTransactions = JSON.parse(localStorage.getItem('TRANSACTION_HISTORY')) || [];
    const { id } = useParams();
    const transaction = allTransactions.find(transaction => transaction.transaction_id == id || transaction.TransactionNo == id);

    if(!transaction) {
        return <h1>Transaction not found</h1>
    }

    const { 
        transaction_id,
        TransactionNo, 
        TransactionDateTime,
        date_entered,
        Amount,
        amount,
        MeterNo,
        meter_no,
        account_number,
        status,
        account_type,
        transref,
        providerRef,
        Reasons,
        BUID,
        Units,
        units,
        CostOfUnits,
        costOfUnits,
        VAT,
        Address,
        Token,
        token
         } = transaction;

    const pdfRef = useRef();

    const downloadPDF = () => {
        setLoading(true);
        const input = pdfRef.current;
        html2canvas(input, {
            scale: 2
        }).then(canvas => {
            setLoading(false);
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4', true);
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            const imgWidth = canvas.width;
            const imgHeight = canvas.height;
            const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
            const imgX = (pdfWidth - imgWidth * ratio) / 2;
            const imgY = (pdfHeight - imgHeight * ratio) / 2 - 72;
            pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
            pdf.save('transaction-receipt.pdf')
        })
    }

    function formatToken(token) {
        if (!token) return '';
        return token.replace(/(\d{4})(?=\d)/g, '$1-');
    }

  return (
    <section>
      <div className="sm:mx-auto w-full sm:w-3/4">
          <div className='shadow-sm shadow-slate-500' ref={pdfRef}
          >
              <div>
                  <img 
                  src={ReceiptHeaderImage}
                  alt='header'
                  className='w-full'
                  />
              </div>
              <div className='w-full text-center py-4 border-b-2 border-gray-300'>
                  <h1 className='text-xl sm:text-2xl uppercase font-bold text-blue-900'>Transaction Receipt</h1>
              </div>
              
              {/* Transaction Information Section */}
              <div className='px-4 sm:px-6 py-4 border-b border-gray-200'>
                  <h2 className='text-lg font-bold text-gray-800 mb-3 text-center'>Transaction Information</h2>
                  <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                      <div className='bg-gray-50 p-3 rounded'>
                          <label className='text-sm font-semibold text-gray-600 block mb-1'>Transaction ID</label>
                          <p className='text-base font-bold text-gray-900'>{transaction_id || TransactionNo || 'N/A'}</p>
                      </div>
                      <div className='bg-gray-50 p-3 rounded'>
                          <label className='text-sm font-semibold text-gray-600 block mb-1'>Receipt / Token</label>
                          <p className='text-sm text-gray-900 break-all'>
                              {formatToken(token || Token || '') || transref || providerRef || 'N/A'}
                          </p>
                      </div>
                      <div className='bg-gray-50 p-3 rounded'>
                          <label className='text-sm font-semibold text-gray-600 block mb-1'>Transaction Date</label>
                          <p className='text-base text-gray-900'>{(date_entered || TransactionDateTime || '').slice(0,10)}</p>
                      </div>
                      <div className='bg-gray-50 p-3 rounded'>
                          <label className='text-sm font-semibold text-gray-600 block mb-1'>Status</label>
                          <p className={`text-base font-semibold ${status === 'success' ? 'text-green-600' : status === 'failed' ? 'text-red-600' : 'text-yellow-600'}`}>
                              {status ? status.toUpperCase() : 'N/A'}
                          </p>
                      </div>
                  </div>
              </div>

              {/* Payment Details Section */}
              <div className='px-4 sm:px-6 py-4 border-b border-gray-200'>
                  <h2 className='text-lg font-bold text-gray-800 mb-3 text-center'>Payment Details</h2>
                  <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                      <div className='bg-blue-50 p-4 rounded border-2 border-blue-200'>
                          <label className='text-sm font-semibold text-gray-600 block mb-2'>Amount Paid</label>
                          <p className='text-2xl font-bold text-blue-900'>₦{Number(amount || Amount || 0).toLocaleString()}</p>
                      </div>
                      <div className='bg-gray-50 p-3 rounded'>
                          <label className='text-sm font-semibold text-gray-600 block mb-1'>Cost of Units</label>
                          <p className='text-base font-semibold text-gray-900'>
                              {status === "processing" ? <span className='text-xs text-yellow-600'>Processing...</span> : status === "failed" ? <span className='text-red-600'>N/A</span> : `₦${Number(costOfUnits || CostOfUnits || 0).toLocaleString()}`}
                          </p>
                      </div>
                      <div className='bg-gray-50 p-3 rounded'>
                          <label className='text-sm font-semibold text-gray-600 block mb-1'>VAT</label>
                          <p className='text-base font-semibold text-gray-900'>
                              {status === "processing" ? <span className='text-xs text-yellow-600'>Processing...</span> : status === "failed" ? <span className='text-red-600'>N/A</span> : `₦${Number(VAT || 0).toLocaleString()}`}
                          </p>
                      </div>
                      <div className='bg-gray-50 p-3 rounded'>
                          <label className='text-sm font-semibold text-gray-600 block mb-1'>Units</label>
                          <p className='text-base font-semibold text-gray-900'>
                              {status === "processing" ? <span className='text-xs text-yellow-600'>Processing...</span> : status === "failed" ? <span className='text-red-600'>N/A</span> : (units || Units || '0')}
                          </p>
                      </div>
                  </div>
              </div>

              {/* Account Information Section */}
              <div className='px-4 sm:px-6 py-4 border-b border-gray-200'>
                  <h2 className='text-lg font-bold text-gray-800 mb-3 text-center'>Account Information</h2>
                  <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                      {account_type === "Prepaid" && <div className='bg-gray-50 p-3 rounded'>
                          <label className='text-sm font-semibold text-gray-600 block mb-1'>Meter Number</label>
                          <p className='text-base font-semibold text-gray-900'>{meter_no || MeterNo || 'N/A'}</p>
                      </div>}
                      {account_type === "Postpaid" && <div className='bg-gray-50 p-3 rounded'>
                          <label className='text-sm font-semibold text-gray-600 block mb-1'>Account Number</label>
                          <p className='text-base font-semibold text-gray-900'>{account_number || 'N/A'}</p>
                      </div>}
                      <div className='bg-gray-50 p-3 rounded'>
                          <label className='text-sm font-semibold text-gray-600 block mb-1'>BUID</label>
                          <p className='text-base text-gray-900'>{BUID || 'N/A'}</p>
                      </div>
                      <div className='bg-gray-50 p-3 rounded sm:col-span-2'>
                          <label className='text-sm font-semibold text-gray-600 block mb-1'>Service Address</label>
                          <p className='text-sm text-gray-900'>{Address === null || !Address ? "No Address" : Address}</p>
                      </div>
                  </div>
              </div>

              {/* Token Section (Prepaid Only) */}
              {(() => {
                  // Get account type from localStorage as fallback
                  const accountTypeFromStorage = localStorage.getItem('LOGIN_ACCOUNT_TYPE') || localStorage.getItem('ACCOUNT_TYPE');
                  
                  // Strictly check if it's Prepaid - must NOT be Postpaid
                  const isPrepaid = (account_type === "Prepaid" || accountTypeFromStorage === "Prepaid") && 
                                   account_type !== "Postpaid" && 
                                   accountTypeFromStorage !== "Postpaid";
                  
                  // Only show token for prepaid accounts with successful transactions
                  return isPrepaid && (status === "success" || !status) && (token || Token || transref || providerRef) && (
                      <div className='px-4 sm:px-6 py-4 border-b border-gray-200'>
                          <h2 className='text-lg font-bold text-gray-800 mb-3 text-center'>Token Information</h2>
                          <div className='bg-orange-50 p-4 rounded border-2 border-orange-200'>
                              <label className='text-sm font-semibold text-gray-600 block mb-2'>Token</label>
                              <p className='text-xl font-mono font-bold text-orange-900 text-center break-all'>
                                  {formatToken(token || Token || transref || providerRef || '')}
                              </p>
                          </div>
                      </div>
                  );
              })()}
              <div className='flex flex-col justify-center items-center text-xs py-4'>
                  <img 
                  src={Black_Logo}
                  alt="footer-logo" 
                  className='h-8 mx-3 w-20'/>
                  <p className='font-semibold w-full text-orange-500 text-center'>Distributing Power, Changing Lives</p>
              </div>
          </div>
          <div className='flex flex-col justify-center items-center'>
            <button 
            onClick={downloadPDF}
            className='flex flex-row justify-center text-white rounded-md border-none viewbtn my-1 px-2 py-1 hover:bg-orange-500 transform duration-300 ease-in-out'>
                {!loading && <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                    <path d="M10.75 2.75a.75.75 0 00-1.5 0v8.614L6.295 8.235a.75.75 0 10-1.09 1.03l4.25 4.5a.75.75 0 001.09 0l4.25-4.5a.75.75 0 00-1.09-1.03l-2.955 3.129V2.75z" />
                    <path d="M3.5 12.75a.75.75 0 00-1.5 0v2.5A2.75 2.75 0 004.75 18h10.5A2.75 2.75 0 0018 15.25v-2.5a.75.75 0 00-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5z" />
                </svg>}
                <ClipLoader color='white' size={20} loading={loading} />
                {!loading && <p className=''>Download</p>}
            </button>
          </div>
      </div>
    </section>
  )
}
