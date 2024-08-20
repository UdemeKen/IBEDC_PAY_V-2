import React, { useEffect, useState } from 'react';
import { Frame_01 } from '../../assets/images';
import { BanknotesIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import BillViewDetails from '../viewDetails/BillViewDetails';
import AllTransactions from './AllTransactions';

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
    const selectedBill = visibleBills[index];
    localStorage.setItem('SELECTED_BILL', JSON.stringify(selectedBill));
  };

  useEffect(() => {
    setSelectedBill(visibleBills[activeBills]);
  }, [visibleBills, activeBills]);

//   const getCurrentMonthBills = (bills) => {
//     const currentMonth = new Date().getMonth();
//     const currentYear = new Date().getFullYear();
//     return bills.filter(bill => {
//         const billDate = new Date(bill.Billdate);
//         return billDate.getMonth() === currentMonth && billDate.getFullYear() === currentYear;
//     });
//   };


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
    <div className='bg-white bg-cover'>
    <section
    className=''>
      <div className='flex flex-col sm:flex-row sm:space-x-4 w-full'>
      <div
        className='flex flex-col sm:flex-row justify-normal sm:space-y-0 sm:space-x-4 w-full'>
        <div className='w-full h-full rounded-lg flex flex-col sm:justify-center sm:items-center'>
        <div className='flex flex-col justify-normal sm:space-y-4 sm:pb-4 w-full'>
        {visibleBills.length === 0 && 
            <div className='flex flex-row justify-center items-center rounded-lg px-4 sm:py-2 mx-2 shadow-sm shadow-gray-500'>
              <h4 className='text-gray-800 opacity-75 tracking-tighter'>No bill history</h4>
            </div>
          }
    {visibleBills.length > 0 ? visibleBills.map((bill, index) => {
    const totalBillAmount = (Number(bill.CurrentChgTotal) + Number(bill.VAT)).toLocaleString(); // Calculate total bill amount
    return (
      <div key={index} className={`hover:bg-slate-100 transform duration-300 ease-in-out opacity-90 p-2 rounded-lg ${index === activeBills ? 'bg-slate-200' : ''}`}>
              <div className={`flex flex-row justify-between items-center rounded-lg p-4 w-full h-full sm:py-2 shadow-sm shadow-gray-500 hover:cursor-pointer`} onClick={() => handleBillSelection(index)}>
                <div className='text-blue-900'>
                <h4 className='tracking-tighter text-left'>Amount paid: <span className='font-bold md:text-lg'>&#8358;{totalBillAmount}</span></h4>
                  <h4 className={`font-semibold text-sm text-gray-800 tracking-tighter text-left`}>
                    Date: 
                    <span className='font-normal'>
                        {`${bill.Billdate.slice(8,10)}-${bill.Billdate.slice(5,7)}-${bill.Billdate.slice(0,4)}`} | {bill.Billdate.slice(10,16)}
                    </span> 
                    {/* <span className={`${transaction.status === 'failed' ? 'text-red-500' : transaction.status === 'processing' ? 'text-yellow-500' : 'text-green-500'} lowercase mx-2`}>{transaction?.status}</span> */}
                  </h4>
                </div>
                {/* <Link to={'/default/customerdashboard'} className={`bg-blue-950 rounded-lg text-xs sm:text-sm text-white text-center capitalize px-2 py-1 sm:px-4 sm:py-2 hover:bg-orange-500 duration-300 ease-in-out opacity-75`}>view</Link> */}
              </div>
            </div>
          )}).slice(0,5) : null}
          </div>
          <div className='flex justify-center items-center space-x-5 sm:h-full my-4'>
            <div className='capitalize'>
              <p onClick={prevPageHandler} className='shadow-sm shadow-slate-500 cursor-pointer bg-blue-950 opacity-75 text-white hover:bg-orange-500 duration-300 ease-in-out px-4 py-2 rounded-lg'>prev</p>
            </div>
            <div>
              <p className='flex justify-normal space-x-5 text-lg'>{pages.map(page => <span key={page} onClick={() => setCurrentPage(page)} className={`shadow-sm shadow-slate-500 cursor-pointer bg-blue-950 opacity-75 text-white hover:bg-orange-500 duration-300 ease-in-out px-4 py-2 rounded-lg ${currentPage === page ? "bg-orange-500" : ""}`}>{page}</span>)}</p>
            </div>
            <div className='capitalize'>
              <p onClick={nextPageHandler} className='shadow-sm shadow-slate-500 cursor-pointer bg-blue-950 opacity-75 text-white hover:bg-orange-500 duration-300 ease-in-out px-4 py-2 rounded-lg'>next</p>
            </div>
          </div>
        </div>
        {selectedBill === null && <h4 className='text-gray-800 opacity-75 tracking-tighter text-center'>No transaction details</h4>}
      </div>
        <BillViewDetails selectedBill={selectedBill} />
      </div>
    </section>
  </div>
  )
}

