import React, { useEffect, useMemo, useState } from 'react';
import { Frame_01 } from '../../assets/images';
import { BanknotesIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function BillHistory() {

    const getStoredBills = () => {
        const storedBills = localStorage.getItem('BILL_HISTORY');
        try {
          return JSON.parse(storedBills) || [];
        } catch (error) {
          console.error("Error parsing BILL_HISTORY from localStorage:", error);
          return [];
        }
      };

  const [ allBills, setAllBills ] = useState(getStoredBills());
  const [ allBillsPerPage, setAllBillsPerPage ] = useState(5);
  const [ currentPage, setCurrentPage ] = useState(1);
  const [ activeBills, setActiveBills ] = useState(0);
  const [ selectedBill, setSelectedBill ] = useState(null);
  const numOfTotalPages = Math.ceil(allBills.length / allBillsPerPage);
  const pages = [...Array(numOfTotalPages + 1).keys()].slice(1);

  const indexOfLastBill = currentPage * allBillsPerPage;
  const indexOfFirstBill = indexOfLastBill - allBillsPerPage;

  const visibleBills = allBills.slice(indexOfFirstBill, indexOfLastBill);

  const prevPageHandler = () => {
    if(currentPage !== 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const nextPageHandler = () => {
    if(currentPage !== numOfTotalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleBillSelection = (index) => {
    setActiveBills(index);
    const pickedBill = visibleBills[index];
    setSelectedBill(pickedBill);
    localStorage.setItem('SELECTED_BILL', JSON.stringify(pickedBill));
  };

  useEffect(() => {
    setSelectedBill(visibleBills[activeBills] || null);
  }, [visibleBills, activeBills]);

  const getBillDate = (bill) => {
    if (!bill?.Billdate) return null;
    const normalized = bill.Billdate.replace(' ', 'T');
    const parsed = new Date(normalized);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  };

  const getCurrentMonthBills = (bills) => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    return bills.filter(bill => {
        const billDate = getBillDate(bill);
        return billDate && billDate.getMonth() === currentMonth && billDate.getFullYear() === currentYear;
    });
  };

  const monthlyBills = getCurrentMonthBills(allBills);
  const monthlyTotalBilled = monthlyBills.reduce((total, bill) => {
    const currentCharge = Number(bill?.CurrentChgTotal) || 0;
    const vat = Number(bill?.VAT) || 0;
    return total + currentCharge + vat;
  }, 0);

  const latestBill = useMemo(() => {
    if (!Array.isArray(allBills) || allBills.length === 0) return null;
    const sorted = [...allBills].sort((a, b) => {
      const dateA = getBillDate(a)?.getTime() || 0;
      const dateB = getBillDate(b)?.getTime() || 0;
      return dateB - dateA;
    });
    return sorted[0];
  }, [allBills]);

  const formatBillDateTime = (bill) => {
    const date = getBillDate(bill);
    if (!date) return 'N/A';
    const formattedDate = date.toLocaleDateString('en-NG', { day: '2-digit', month: '2-digit', year: 'numeric' });
    const formattedTime = date.toLocaleTimeString('en-NG', { hour: '2-digit', minute: '2-digit' });
    return `${formattedDate} | ${formattedTime}`;
  };

  const getBillTotal = (bill) => {
    if (!bill) return 0;
    const currentCharge = Number(bill?.CurrentChgTotal) || 0;
    const vat = Number(bill?.VAT) || 0;
    return currentCharge + vat;
  };


  const hero_01Variants = {
    hidden: {
      opacity: 0,
      y: -100,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.5,
        duration: 1,
      },
    },
  };
  
  const hero_02Variants = {
    hidden: {
      opacity: 0,
      x: 100,
    },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        delay: 0.5,
        duration: 1,
      },
    },
  };

  
  return (
    <div className='bg-white bg-cover pb-4'>
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1 }}
        className=''
      >
        {/* <motion.div 
          variants={hero_01Variants}
          initial='hidden'
          animate='visible'
          className='flex flex-col sm:flex-row justify-between space-y-4 sm:space-y-0 sm:space-x-4 sm:my-10'
        >
          <div className='relative flex-grow shadow-sm shadow-slate-500 w-full h-36 rounded-lg flex flex-col justify-center items-center overflow-hidden'>
            <img 
              src={Frame_01}
              alt={'Frame_01'}
              className='w-full h-full object-cover rounded-lg'
            />
            <div className="absolute inset-0 rounded-lg bg-blue-950 opacity-70"></div>
            <div className='absolute inset-0 flex flex-col justify-center items-center text-white px-4 text-center'>
              <BanknotesIcon className='w-8 h-8 mb-1' />
              <p className='uppercase text-xs tracking-[0.3em]'>Monthly Bills</p>
              <p className='text-3xl sm:text-4xl font-semibold mt-1'>{`₦${monthlyTotalBilled.toLocaleString()}`}</p>
              <p className='text-[11px] text-blue-100/80 mt-2'>Total billed amount for this month</p>
            </div>
          </div>
          <div className='relative flex-grow shadow-sm shadow-slate-500 w-full h-36 rounded-lg flex flex-col justify-center items-center overflow-hidden'>
            <img 
              src={Frame_01}
              alt={'Frame_01'}
              className='w-full h-full object-cover rounded-lg'
            />
            <div className="absolute inset-0 rounded-lg bg-orange-500 opacity-80"></div>
            <div className='absolute inset-0 flex flex-col justify-center items-center text-white px-4 text-center'>
              <BanknotesIcon className='w-8 h-8 mb-1' />
              <p className='uppercase text-xs tracking-[0.3em]'>Latest Bill Due</p>
              <p className='text-3xl sm:text-4xl font-semibold mt-1'>
                {latestBill ? `₦${(Number(latestBill?.TotalDue) || getBillTotal(latestBill)).toLocaleString()}` : '₦0'}
              </p>
              <p className='text-[11px] text-orange-100/90 mt-2'>
                {latestBill ? formatBillDateTime(latestBill) : 'No bills available'}
              </p>
            </div>
          </div>
        </motion.div> */}

        <div className='flex flex-col sm:flex-row sm:space-x-4 w-full'>
          <div className='shadow-sm shadow-slate-500 w-full rounded-lg flex flex-col items-center mt-4 sm:mt-0'>
            {/* <p className='text-center sm:my-4 text-xl text-slate-500 font-serif underline'>Bill History</p> */}
            <div className='w-full flex flex-col sm:flex-row justify-center sm:space-x-4 pb-4'>
              <div className='flex flex-col w-full sm:w-[58%] space-y-4'>
                {visibleBills.length === 0 && (
                  <div className='flex flex-row justify-center items-center rounded-lg px-4 py-6 mx-2 shadow-sm shadow-gray-500 bg-slate-50'>
                    <h4 className='text-gray-800 opacity-75 tracking-tight'>No bill history available</h4>
                  </div>
                )}
                {visibleBills.length > 0 && visibleBills.map((bill, index) => {
                  const totalBillAmount = getBillTotal(bill);
                  return (
                    <div
                      key={bill?.BillID || index}
                      className={`hover:bg-slate-100 transition duration-300 ease-in-out rounded-lg px-2 ${index === activeBills ? 'bg-slate-200' : ''}`}
                    >
                      <div
                        className='flex flex-row justify-between items-center rounded-lg p-4 shadow-sm shadow-gray-500 cursor-pointer'
                        onClick={() => handleBillSelection(index)}
                      >
                        <div className='text-blue-900'>
                          <h4 className='tracking-tight text-left text-sm sm:text-base'>
                            Amount billed: <span className='font-bold text-lg'>&#8358;{totalBillAmount.toLocaleString()}</span>
                          </h4>
                          <p className='text-xs text-gray-600 mt-1'>
                            {formatBillDateTime(bill)}
                          </p>
                        </div>
                        <div className='text-right text-xs text-gray-500 uppercase tracking-widest'>
                          {bill?.TariffCode || 'N/A'}
                        </div>
                      </div>
                    </div>
                  );
                })}

                {visibleBills.length > 0 && (
                  <div className='flex justify-center items-center space-x-5 pt-4'>
                    <button
                      onClick={prevPageHandler}
                      disabled={currentPage === 1}
                      className='shadow-sm shadow-slate-500 bg-blue-950 opacity-75 text-white hover:bg-orange-500 disabled:opacity-40 px-4 py-2 rounded-lg'
                    >
                      Prev
                    </button>
                    <div className='flex flex-wrap gap-2 text-lg justify-center'>
                      {pages.map(page => (
                        <span
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`shadow-sm shadow-slate-500 cursor-pointer bg-blue-950 opacity-75 text-white hover:bg-orange-500 px-4 py-2 rounded-lg ${currentPage === page ? "bg-orange-500" : ""}`}
                        >
                          {page}
                        </span>
                      ))}
                    </div>
                    <button
                      onClick={nextPageHandler}
                      disabled={currentPage === numOfTotalPages}
                      className='shadow-sm shadow-slate-500 bg-blue-950 opacity-75 text-white hover:bg-orange-500 disabled:opacity-40 px-4 py-2 rounded-lg'
                    >
                      Next
                    </button>
                  </div>
                )}
              </div>

              <div className='w-full sm:w-[42%] mt-6 sm:mt-0'>
                {selectedBill ? (
                  <div className='bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200'>
                    <div className='bg-gradient-to-r from-blue-950 to-blue-800 text-white px-6 py-4'>
                      <h3 className="text-xl font-bold text-center">Bill Details</h3>
                      <div className='flex flex-col sm:flex-row justify-between items-center mt-3 gap-2 text-sm'>
                        <div className='text-center sm:text-left'>
                          <p className='text-xs text-blue-200'>Bill ID</p>
                          <p className='text-sm font-semibold'>{selectedBill?.BillID || 'N/A'}</p>
                        </div>
                        <div className='text-center sm:text-left'>
                          <p className='text-xs text-blue-200'>Billed On</p>
                          <p className='text-sm font-semibold'>{formatBillDateTime(selectedBill)}</p>
                        </div>
                      </div>
                    </div>

                    <div className='px-6 py-5 space-y-6'>
                      <div className='bg-slate-50 rounded-lg p-4 border border-slate-100'>
                        <p className='text-xs uppercase tracking-[0.3em] text-slate-500 mb-2'>Billing Summary</p>
                        <div className='grid grid-cols-2 gap-4 text-sm text-slate-700'>
                          <div>
                            <p className='text-[11px] uppercase text-slate-500'>Current Charge</p>
                            <p className='text-lg font-semibold text-slate-900'>
                              ₦{(Number(selectedBill?.CurrentChgTotal) || 0).toLocaleString()}
                            </p>
                          </div>
                          <div>
                            <p className='text-[11px] uppercase text-slate-500'>VAT</p>
                            <p className='text-lg font-semibold text-slate-900'>
                              ₦{(Number(selectedBill?.VAT) || 0).toLocaleString()}
                            </p>
                          </div>
                          <div>
                            <p className='text-[11px] uppercase text-slate-500'>Total Due</p>
                            <p className='text-lg font-semibold text-slate-900'>
                              ₦{(Number(selectedBill?.TotalDue) || getBillTotal(selectedBill)).toLocaleString()}
                            </p>
                          </div>
                          <div>
                            <p className='text-[11px] uppercase text-slate-500'>Net Arrears</p>
                            <p className='text-lg font-semibold text-slate-900'>
                              ₦{(Number(selectedBill?.NetArrears) || 0).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className='grid grid-cols-1 gap-4'>
                        <div className='rounded-lg border border-slate-100 p-4'>
                          <p className='text-xs uppercase tracking-[0.3em] text-slate-500 mb-2'>Account Information</p>
                          <div className='space-y-2 text-sm text-slate-700'>
                            <p><span className='font-semibold text-slate-900'>Customer:</span> {selectedBill?.CustomerName || 'N/A'}</p>
                            <p><span className='font-semibold text-slate-900'>Account No:</span> {selectedBill?.AccountNo || 'N/A'}</p>
                            <p><span className='font-semibold text-slate-900'>Account Type:</span> {selectedBill?.AcctTye || 'N/A'}</p>
                            <p><span className='font-semibold text-slate-900'>Tariff:</span> {selectedBill?.TariffCode || 'N/A'}</p>
                          </div>
                        </div>
                        <div className='rounded-lg border border-slate-100 p-4'>
                          <p className='text-xs uppercase tracking-[0.3em] text-slate-500 mb-2'>Service Details</p>
                          <div className='space-y-2 text-sm text-slate-700'>
                            <p><span className='font-semibold text-slate-900'>Address:</span> {selectedBill?.ServiceAddress1 || 'N/A'}</p>
                            <p><span className='font-semibold text-slate-900'>Business Hub:</span> {selectedBill?.BUName1 || 'N/A'}</p>
                            <p><span className='font-semibold text-slate-900'>Service Band:</span> {selectedBill?.ServiceID || 'N/A'}</p>
                            <p><span className='font-semibold text-slate-900'>Consumption:</span> {selectedBill?.ConsumptionKWH ?? 'N/A'} kWh</p>
                          </div>
                        </div>
                      </div>

                      <div className='flex justify-center'>
                        <Link
                          to={`/postpaidbillreceipt/${selectedBill?.BillID}`}
                          target='_blank'
                          className='bg-blue-950 text-white px-6 py-2 rounded-md text-sm font-semibold hover:bg-orange-500 transition duration-300'
                        >
                          View Receipt
                        </Link>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className='bg-slate-50 border border-dashed border-slate-200 rounded-xl h-full flex items-center justify-center text-slate-500 text-sm'>
                    Select a bill to view details
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.section>
    </div>
  )
}

