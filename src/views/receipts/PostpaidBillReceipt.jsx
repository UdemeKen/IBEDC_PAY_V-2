import React, { useRef, useState } from 'react'
import { ReceiptHeaderImage, Black_Logo} from '../../assets/images'
import { useParams } from 'react-router-dom';
import { ClipLoader } from 'react-spinners';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export default function PostpaidBillReceipt() {

    const [loading, setLoading] = useState(false);

    const allBills = JSON.parse(localStorage.getItem('BILL_HISTORY')) || [];
    const { id } = useParams();
    console.log("ID from URL:", id);
    console.log("All Bills:", allBills);
    const bill = allBills.find((bill) => bill.BillID === id);
    console.log("Found Bill:", bill);

    if(!bill) {
        return <h1>Bill not found</h1>
    }

    const { 
        CustomerName,
        AccountNo,
        AcctTye,
        CurrentChgTotal,
        VAT,
        BillID,
        ServiceAddress1,
        NetArrears,
        BUID,
        BUName1,
        LastPayAmount, 
        CurrentKWH,
        ConsumptionKWH, 
        Rate,
        Billdate,
        ServiceID,
        TariffCode,
        TotalDue
         } = bill;

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
              <div className='w-full text-center'>
                  <h1 className='sm:text-lg uppercase mb-4 font-semibold text-blue-900'>Bill Receipt</h1>
              </div>
              <div className='grid sm:grid-cols-3 gap-y-4 justify-center px-16 text-center sm:text-left'>
                <div className='text-center'>
                    <label className='text-md font-semibold text-gray-800'>Customer Name</label>
                    <p className='text-sm font-semibold text-gray-500'>{CustomerName}</p>
                </div>
                <div className='text-center'>
                    <label className='text-md font-semibold text-gray-800'>Account Number</label>
                    <p className='text-sm font-semibold text-gray-500'>{AccountNo}</p>
                </div>
                <div className='text-center'>
                    <label className='text-md font-semibold text-gray-800'>Account Type</label>
                    <p className='text-sm font-semibold text-gray-500'>{AcctTye}</p>
                </div>
                <div className='text-center'>
                    <label className='text-md font-semibold text-gray-800'>Amount Billed</label>
                    <p className='text-sm font-semibold text-gray-500'>₦{((Number(CurrentChgTotal) || 0) + (Number(VAT) || 0)).toLocaleString('en-NG', { style: 'decimal', minimumFractionDigits: 2 })}</p>
                </div>
                <div className='text-center'>
                    <label className='text-md font-semibold text-gray-800'>Bill ID</label>
                    <p className='text-sm font-semibold text-gray-500'>{BillID}</p>
                </div>
                <div className='text-center'>
                    <label className='text-md font-semibold text-gray-800'>Service Address</label>
                    <p className='text-sm font-semibold text-gray-500'>{ServiceAddress1}</p>
                </div>
                <div className='text-center'>
                    <label className='text-md font-semibold text-gray-800'>NetArrears</label>
                    <p className='text-sm font-semibold text-gray-500'>₦{(Number(NetArrears) || 0).toLocaleString()}</p>
                </div>
                <div className='text-center'>
                    <label className='text-md font-semibold text-gray-800'>Business Hub ID</label>
                    <p className='text-sm font-semibold text-gray-500'>{BUID}</p>
                </div>
                <div className='text-center'>
                    <label className='text-md font-semibold text-gray-800'>Business Hub</label>
                    <p className='text-sm font-semibold text-gray-500'>{BUName1}</p>
                </div>
                <div className='text-center'>
                    <label className='text-md font-semibold text-gray-800'>Last Payment Amount</label>
                    <p className='text-sm font-semibold text-gray-500' >₦{LastPayAmount === ".00" ? "0.00" : (Number(LastPayAmount)).toLocaleString()}</p>
                </div>
                <div className='text-center'>
                    <label className='text-md font-semibold text-gray-800'>CurrentKWH</label>
                    <p className='text-sm font-semibold text-gray-500'>{CurrentKWH}</p>
                </div>
                <div className='text-center'>
                    <label className='text-md font-semibold text-gray-800'>ConsumptionKWH</label>
                    <p className='text-sm font-semibold text-gray-500'>{ConsumptionKWH}</p>
                </div>
                <div className='text-center'>
                    <label className='text-md font-semibold text-gray-800'>Rate</label>
                    <p className='text-sm font-semibold text-gray-500'>{Rate}</p>
                </div>
                <div className='text-center'>
                    <label className='text-md font-semibold text-gray-800'>Billed Date</label>
                    <p className='text-sm font-semibold text-gray-500'>{Billdate?.slice(0, 10)}</p>
                </div>
                <div className='text-center'>
                    <label className='text-md font-semibold text-gray-800'>Service Band</label>
                    <p className='text-sm font-semibold text-gray-500'>{ServiceID}</p>
                </div>
                <div className='text-center'>
                    <label className='text-md font-semibold text-gray-800'>Tarriff Code</label>
                    <p className='text-sm font-semibold text-gray-500'>{TariffCode}</p>
                </div>
                <div className='text-center'>
                    <label className='text-md font-semibold text-gray-800'>Tarriff Code</label>
                    <p className='text-sm font-semibold text-gray-500'>{TariffCode}</p>
                </div>
                <div className='text-center'>
                    <label className='text-md font-semibold text-gray-800'>Total Due</label>
                    <p className='text-sm font-semibold text-gray-500'>{TotalDue}</p>
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
