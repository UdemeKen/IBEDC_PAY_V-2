import React, { useRef, useState } from 'react'
import { ReceiptHeaderImage, Black_Logo} from '../../assets/images'
import { useParams } from 'react-router-dom';
import { ClipLoader } from 'react-spinners';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export default function PrepaidTransactionReceipt() {

    const account_number = localStorage.getItem('USER_METER_NUMBER');

    const [loading, setLoading] = useState(false);

    const allTransactions = JSON.parse(localStorage.getItem('TRANSACTION_HISTORY')) || [];
    const { id } = useParams();
    const transaction = allTransactions.find(transaction => transaction.id == id);

    const { customer_name, account_type, meter_no, providerRef, transaction_id, date_entered, amount, status } = transaction;

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
            pdf.save('prepaid-transaction-receipt.pdf')
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
              <div className='w-full text-center'>
                  <h1 className='sm:text-lg uppercase mb-4 font-semibold text-blue-900'>Transaction Receipt</h1>
              </div>
              <div className='grid sm:grid-rows-4 sm:grid-flow-col gap-y-6 gap-x-12 justify-center px-16 text-center sm:text-left'>
                <div className='text-center'>
                    <label className='text-md font-semibold text-gray-800'>Customer Name</label>
                    <p className='text-sm font-semibold text-gray-500'>{customer_name}</p>
                </div>
                <div className='text-center'>
                    <label className='text-md font-semibold text-gray-800'>AcctNo/MeterNo</label>
                    <p className='text-sm font-semibold text-gray-500'>{account_type === "Prepaid" ? meter_no : account_number}</p>
                </div>
                {/* <div className=''>
                    <label className='text-md font-semibold text-gray-800'>Customer Address</label>
                    <p className='text-sm font-semibold text-gray-500 sm:w-2/3'>Not found</p>
                </div> */}
                <div className='text-center'>
                    <label className='text-md font-semibold text-gray-800'>Transaction Reference</label>
                    <p className='text-sm font-semibold text-gray-500'>{providerRef}</p>
                </div>
                <div className='text-center'>
                    <label className='text-md font-semibold text-gray-800'>Purpose of Payment</label>
                    <p className='text-sm font-semibold text-gray-500'>Buy Electricity</p>
                </div>
                <div className='text-center'>
                    <label className='text-md font-semibold text-gray-800'>Transaction Date</label>
                    <p className='text-sm font-semibold text-gray-500'>{date_entered.slice(0,10)}</p>
                </div>
                <div className='text-center'>
                    <label className='text-md font-semibold text-gray-800'>Transaction Status</label>
                    <p className='text-sm font-semibold text-gray-500'>{status}</p>
                </div>
                <div className='text-center'>
                    <label className='text-md font-semibold text-gray-800'>Transaction Amount</label>
                    <p className='text-sm font-semibold text-gray-500'>₦{amount}</p>
                </div>
                {/* <div className='text-center'>
                    <label className='text-md font-semibold text-gray-800'>Customer Token</label>
                    <p className='text-sm font-semibold text-gray-500'>Not found</p>
                </div> */}
              </div>
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
