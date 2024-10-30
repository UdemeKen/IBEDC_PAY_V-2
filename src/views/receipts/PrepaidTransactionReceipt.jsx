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
    const transaction = allTransactions.find(transaction => transaction.TransactionNo == id);

    if(!transaction) {
        return <h1>Transaction not found</h1>
    }

    const { 
        TransactionNo, 
        TransactionDateTime,
        Amount,
        MeterNo,
        status,
        account_number,
        account_type,
        meter_no,
        transref,
        Reasons,
        BUID,
        Units,
        CostOfUnits,
        VAT,
        Address,
        Token
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
      <div className="sm:mx-auto w-full sm:w-3/4 md:w-1/2">
          <div className='shadow-sm shadow-slate-500' ref={pdfRef}
          >
              <div>
                  <img 
                  src={ReceiptHeaderImage}
                  alt='header'
                  className='w-full'
                  />
              </div>
              <div className='w-full text-center'>
                  <h1 className='sm:text-lg uppercase mb-4 font-semibold text-blue-900'>Transaction Receipt</h1>
              </div>
              <div className='grid sm:grid-rows-4 sm:grid-cols-3 sm:grid-flow-col gap-y-4 sm:gap-x-1 sm:py-4 text-center w-full'>
                
              <div>
                    <label className='text-md font-bold'>Transaction Reference</label>
                    <p className='w-full text-xs'>{transref}</p>
                </div>
                <div>
                    <label className='text-md font-bold'>Amount Paid</label>
                    <p>₦{Amount}</p>
                </div>
                <div>
                    <label className='text-md font-bold'>Address</label>
                    <p>{Address === null ? "No Address" : Address}</p>
                </div>
                <div>
                    <label className='text-md font-bold'>Transaction Date</label>
                    <p>{TransactionDateTime.slice(0,10)}</p>
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
                    <label className='text-md font-bold'>Reasons</label>
                    <p>{Reasons}</p>
                </div>
                <div>
                    <label className='text-md font-bold'>Cost of Units</label>
                    <p>₦{status === "processing" ? <span className='text-extra-xs'>Display on payment successful...</span> : status === "failed" ? "no unit" : CostOfUnits}</p>
                </div>
                <div>
                    <label className='text-md font-bold'>BUID</label>
                    <p>{BUID}</p>
                </div>
                <div>
                    <label className='text-md font-bold'>Units</label>
                    <p>₦{status === "processing" ? <span className='text-extra-xs'>Display on payment successful...</span> : status === "failed" ? "no unit" : Units}</p>
                </div>
                <div>
                    <label className='text-md font-bold'>Transaction Number</label>
                    <p className='flex justify-center'>{TransactionNo}</p>
                </div>
                <div>
                    <label className='text-md font-bold'>MeterNo/Account No</label>
                    <p className=''>{MeterNo}</p>
                </div>
                <div>
                    <label className='text-md font-bold'>VAT</label>
                    <p>₦{status === "processing" ? <span className='text-extra-xs'>Display on payment successful...</span> : status === "failed" ? "no unit" : VAT}</p>
                </div>
                <div>
                    <label className='text-md font-bold'>Token</label>
                    <p>{status === "processing" ? <span className='text-extra-xs'>Display on payment successful...</span> : status === "failed" ? "no unit" : formatToken(Token)}</p>
                </div>
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
