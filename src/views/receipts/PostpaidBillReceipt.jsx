import React, { useRef, useState } from 'react'
import { ReceiptHeaderImage, Black_Logo} from '../../assets/images'
import { useParams, useLocation } from 'react-router-dom';
import { ClipLoader } from 'react-spinners';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export default function PostpaidBillReceipt() {

    const [loading, setLoading] = useState(false);
    const location = useLocation();

    const accountTypeRaw = localStorage.getItem('LOGIN_ACCOUNT_TYPE');
    const accountType = accountTypeRaw ? accountTypeRaw : "";
    const allTransactions = JSON.parse(localStorage.getItem('TRANSACTION_HISTORY')) || [];
    const { postId } = useParams();
    const transaction = allTransactions.find((transaction) => transaction.transaction_id === postId || transaction.PaymentID === postId);
    console.log(transaction);
    
    const allBills = JSON.parse(localStorage.getItem('BILL_HISTORY')) || [];
    const { id } = useParams();
    const bill = allBills.find((bill) => bill.BillID === id);
    console.log("Found Bill:", bill);

    // if(!bill) {
    //     return <h1>Bill not found</h1>
    // }

    // const { 
    //     CustomerName,
    //     AccountNo,
    //     AcctTye,
    //     CurrentChgTotal,
    //     VAT,
    //     BillID,
    //     ServiceAddress1,
    //     NetArrears,
    //     BUID,
    //     BUName1,
    //     LastPayAmount, 
    //     CurrentKWH,
    //     ConsumptionKWH, 
    //     Rate,
    //     Billdate,
    //     ServiceID,
    //     TariffCode,
    //     TotalDue
    //      } = bill;

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
            pdf.save('bill-receipt.pdf')
        })
    }

  return (
    <section>
      <div className="sm:mx-auto w-full sm:w-3/4 md:w-1/2">
          <div className='shadow-sm shadow-slate-500' ref={pdfRef}
          >
              <div>
                  <img 
                  src={ReceiptHeaderImage}
                  alt='header'/>
              </div>
              <div className='w-full text-center py-4 border-b-2 border-gray-300'>
                  <h1 className='text-xl sm:text-2xl uppercase font-bold text-blue-900'>Bill Receipt</h1>
              </div>
              
              {/* Transaction Information Section */}
              {accountType === "Postpaid" && transaction && (
                  <div className='px-4 sm:px-6 py-4 border-b border-gray-200'>
                      <h2 className='text-lg font-bold text-gray-800 mb-3 text-center'>Transaction Information</h2>
                      <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                          <div className='bg-gray-50 p-3 rounded'>
                              <label className='text-sm font-semibold text-gray-600 block mb-1'>Transaction ID</label>
                              <p className='text-base font-bold text-gray-900'>{transaction?.transaction_id || transaction?.PaymentID || 'N/A'}</p>
                          </div>
                          <div className='bg-gray-50 p-3 rounded'>
                              <label className='text-sm font-semibold text-gray-600 block mb-1'>Payment Transaction ID</label>
                              <p className='text-sm text-gray-900'>{transaction?.transaction_id || transaction?.PaymentTransactionId || 'N/A'}</p>
                          </div>
                          <div className='bg-blue-50 p-4 rounded border-2 border-blue-200'>
                              <label className='text-sm font-semibold text-gray-600 block mb-2'>Amount Paid</label>
                              <p className='text-2xl font-bold text-blue-900'>₦{Number(transaction?.amount || transaction?.Payments || 0).toLocaleString()}</p>
                          </div>
                          <div className='bg-gray-50 p-3 rounded'>
                              <label className='text-sm font-semibold text-gray-600 block mb-1'>Receipt Number</label>
                              <p className='text-base text-gray-900'>{transaction?.receiptno || 'N/A'}</p>
                          </div>
                      </div>
                  </div>
              )}

              {/* Account Information Section */}
              <div className='px-4 sm:px-6 py-4 border-b border-gray-200'>
                  <h2 className='text-lg font-bold text-gray-800 mb-3 text-center'>Account Information</h2>
                  <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                      {accountType === "Postpaid" && transaction && <div className='bg-gray-50 p-3 rounded'>
                          <label className='text-sm font-semibold text-gray-600 block mb-1'>Account Number</label>
                          <p className='text-base font-semibold text-gray-900'>{transaction?.account_number || transaction?.AccountNo || 'N/A'}</p>
                      </div>}
                      {location.pathname !== `/postpaidtransactionreceipt/${postId}` && bill && <div className='bg-gray-50 p-3 rounded'>
                          <label className='text-sm font-semibold text-gray-600 block mb-1'>Account Number</label>
                          <p className='text-base font-semibold text-gray-900'>{bill?.AccountNo || 'N/A'}</p>
                      </div>}
                      {location.pathname !== `/postpaidtransactionreceipt/${postId}` && bill && <div className='bg-gray-50 p-3 rounded'>
                          <label className='text-sm font-semibold text-gray-600 block mb-1'>Account Type</label>
                          <p className='text-base text-gray-900'>{bill?.AcctTye || 'N/A'}</p>
                      </div>}
                      {location.pathname !== `/postpaidtransactionreceipt/${postId}` && bill && <div className='bg-gray-50 p-3 rounded'>
                          <label className='text-sm font-semibold text-gray-600 block mb-1'>Customer Name</label>
                          <p className='text-base text-gray-900'>{bill?.CustomerName || 'N/A'}</p>
                      </div>}
                      {location.pathname !== `/postpaidtransactionreceipt/${postId}` && bill && <div className='bg-gray-50 p-3 rounded sm:col-span-2'>
                          <label className='text-sm font-semibold text-gray-600 block mb-1'>Service Address</label>
                          <p className='text-sm text-gray-900'>{bill?.ServiceAddress1 || 'N/A'}</p>
                      </div>}
                  </div>
              </div>

              {/* Bill Details Section */}
              {location.pathname !== `/postpaidtransactionreceipt/${postId}` && bill && (
                  <div className='px-4 sm:px-6 py-4 border-b border-gray-200'>
                      <h2 className='text-lg font-bold text-gray-800 mb-3 text-center'>Bill Details</h2>
                      <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                          <div className='bg-gray-50 p-3 rounded'>
                              <label className='text-sm font-semibold text-gray-600 block mb-1'>Bill ID</label>
                              <p className='text-base font-semibold text-gray-900'>{bill?.BillID || 'N/A'}</p>
                          </div>
                          <div className='bg-gray-50 p-3 rounded'>
                              <label className='text-sm font-semibold text-gray-600 block mb-1'>Billed Date</label>
                              <p className='text-base text-gray-900'>{bill?.Billdate?.slice(0, 10) || 'N/A'}</p>
                          </div>
                          <div className='bg-blue-50 p-4 rounded border-2 border-blue-200'>
                              <label className='text-sm font-semibold text-gray-600 block mb-2'>Amount Billed</label>
                              <p className='text-xl font-bold text-blue-900'>₦{((Number(bill?.CurrentChgTotal) || 0) + (Number(bill?.VAT) || 0)).toLocaleString('en-NG', { style: 'decimal', minimumFractionDigits: 2 })}</p>
                          </div>
                          <div className='bg-gray-50 p-3 rounded'>
                              <label className='text-sm font-semibold text-gray-600 block mb-1'>Total Due</label>
                              <p className='text-base font-semibold text-gray-900'>₦{Number(bill?.TotalDue || 0).toLocaleString()}</p>
                          </div>
                          <div className='bg-gray-50 p-3 rounded'>
                              <label className='text-sm font-semibold text-gray-600 block mb-1'>Net Arrears</label>
                              <p className='text-base font-semibold text-gray-900'>₦{Number(bill?.NetArrears || 0).toLocaleString()}</p>
                          </div>
                          <div className='bg-gray-50 p-3 rounded'>
                              <label className='text-sm font-semibold text-gray-600 block mb-1'>Last Payment Amount</label>
                              <p className='text-base text-gray-900'>₦{bill?.LastPayAmount === ".00" ? "0.00" : Number(bill?.LastPayAmount || 0).toLocaleString()}</p>
                          </div>
                      </div>
                  </div>
              )}

              {/* Consumption Details Section */}
              {location.pathname !== `/postpaidtransactionreceipt/${postId}` && bill && (
                  <div className='px-4 sm:px-6 py-4 border-b border-gray-200'>
                      <h2 className='text-lg font-bold text-gray-800 mb-3 text-center'>Consumption Details</h2>
                      <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                          <div className='bg-gray-50 p-3 rounded'>
                              <label className='text-sm font-semibold text-gray-600 block mb-1'>Current KWH</label>
                              <p className='text-base text-gray-900'>{bill?.CurrentKWH || 'N/A'}</p>
                          </div>
                          <div className='bg-gray-50 p-3 rounded'>
                              <label className='text-sm font-semibold text-gray-600 block mb-1'>Consumption KWH</label>
                              <p className='text-base text-gray-900'>{bill?.ConsumptionKWH || 'N/A'}</p>
                          </div>
                          <div className='bg-gray-50 p-3 rounded'>
                              <label className='text-sm font-semibold text-gray-600 block mb-1'>Rate</label>
                              <p className='text-base text-gray-900'>{bill?.Rate || 'N/A'}</p>
                          </div>
                          <div className='bg-gray-50 p-3 rounded'>
                              <label className='text-sm font-semibold text-gray-600 block mb-1'>Tariff Code</label>
                              <p className='text-base text-gray-900'>{bill?.TariffCode || 'N/A'}</p>
                          </div>
                          <div className='bg-gray-50 p-3 rounded'>
                              <label className='text-sm font-semibold text-gray-600 block mb-1'>Service Band</label>
                              <p className='text-base text-gray-900'>{bill?.ServiceID || 'N/A'}</p>
                          </div>
                      </div>
                  </div>
              )}

              {/* Business Information Section */}
              <div className='px-4 sm:px-6 py-4 border-b border-gray-200'>
                  <h2 className='text-lg font-bold text-gray-800 mb-3 text-center'>Business Information</h2>
                  <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                      {accountType === "Postpaid" && transaction && <div className='bg-gray-50 p-3 rounded'>
                          <label className='text-sm font-semibold text-gray-600 block mb-1'>Business Unit</label>
                          <p className='text-base text-gray-900'>{transaction?.BusinessUnit === null ? "No Business Unit" : transaction?.BusinessUnit || 'N/A'}</p>
                      </div>}
                      {location.pathname !== `/postpaidtransactionreceipt/${postId}` && bill && <div className='bg-gray-50 p-3 rounded'>
                          <label className='text-sm font-semibold text-gray-600 block mb-1'>Business Hub ID</label>
                          <p className='text-base text-gray-900'>{bill?.BUID || 'N/A'}</p>
                      </div>}
                      {location.pathname !== `/postpaidtransactionreceipt/${postId}` && bill && <div className='bg-gray-50 p-3 rounded'>
                          <label className='text-sm font-semibold text-gray-600 block mb-1'>Business Hub</label>
                          <p className='text-base text-gray-900'>{bill?.BUName1 || 'N/A'}</p>
                      </div>}
                      {accountType === "Postpaid" && transaction && <div className='bg-gray-50 p-3 rounded'>
                          <label className='text-sm font-semibold text-gray-600 block mb-1'>Operator ID</label>
                          <p className='text-base text-gray-900'>{transaction?.OperatorID || 'N/A'}</p>
                      </div>}
                      {accountType === "Postpaid" && transaction && <div className='bg-gray-50 p-3 rounded'>
                          <label className='text-sm font-semibold text-gray-600 block mb-1'>Rowguid</label>
                          <p className='text-xs text-gray-900 break-all'>{transaction?.rowguid || 'N/A'}</p>
                      </div>}
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
