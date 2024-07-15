import React, { useEffect, useState } from 'react';
import { Frame_01 } from '../../assets/images';
import { BanknotesIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function AllTransactions() {

  const [ allTransactions, setAllTransactions ] = useState(JSON.parse(localStorage.getItem('TRANSACTION_HISTORY')) || []);
  const [ allTransactionsPerPage, setAllTransactionsPerPage ] = useState(5);
  const [ currentPage, setCurrentPage ] = useState(1);
  const [ activeTransaction, setActiveTransaction ] = useState(0);
  const [ selectedTransaction, setSelectedTransaction ] = useState(null);
  const numOfTotalPages = Math.ceil(allTransactions.length / allTransactionsPerPage);
  const pages = [...Array(numOfTotalPages + 1).keys()].slice(1);

  const indexOfLastTransaction = currentPage * allTransactionsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - allTransactionsPerPage;

  const visibleTransactions = allTransactions.slice(indexOfFirstTransaction, indexOfLastTransaction);

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

  const handleTransactionSelection = (index) => {
    setActiveTransaction(index);
    setSelectedTransaction(visibleTransactions[index]);
  };

  useEffect(() => {
    setSelectedTransaction(visibleTransactions[activeTransaction]);
  }, [visibleTransactions, activeTransaction]);

  const getCurrentMonthTransactions = (transactions) => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    return transactions.filter(transaction => {
        const transactionDate = new Date(transaction.date_entered);
        return transactionDate.getMonth() === currentMonth && transactionDate.getFullYear() === currentYear;
    });
  };

  const calculateMonthlyTotal = (transactions) => {
      return transactions.reduce((total, transaction) => total + parseFloat(transaction.amount), 0.0);
  };

  const currentMonthTransactions = getCurrentMonthTransactions(allTransactions);
  const monthlyTotal = calculateMonthlyTotal(currentMonthTransactions);


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
    className='sm:mx-20 lg:mx-32 mx-2 mt-4'>
      <motion.div 
        variants={hero_01Variants}
        initial='hidden'
        animate='visible'
      className='flex flex-col sm:flex-row justify-normal space-y-4 sm:space-y-0 sm:space-x-4 sm:my-10'>
        <div className='shadow-sm shadow-slate-500 w-full h-36 rounded-lg flex justify-center items-center'>
        <div className='relative flex-grow shadow-sm shadow-slate-500 w-full h-36 rounded-lg flex flex-col justify-center items-center'>
          <img 
            src={Frame_01}
            alt={'Frame_01'}
            className='w-full h-full object-cover rounded-lg'
          />
          <div className="absolute inset-0 rounded-lg bg-blue-950 opacity-70"></div>
          <div className='absolute flex flex-col justify-center items-center capitalize text-white'>
            <BanknotesIcon className='w-8 h-8'/>
            <p>monthly total transaction</p>
            <p className='text-4xl font-semibold'>₦ {monthlyTotal.toLocaleString()}</p>
          </div>
        </div>
        </div>
        <div className='shadow-sm shadow-slate-500 w-full h-36 rounded-lg flex justify-center items-center'>
            <div className='shadow-sm shadow-slate-500 w-full h-36 rounded-lg flex justify-center items-center'>
              <div className='relative flex-grow shadow-sm shadow-slate-500 w-full h-36 rounded-lg flex flex-col justify-center items-center'>
                <img 
                  src={Frame_01}
                  alt={'Frame_01'}
                  className='w-full h-full object-cover rounded-lg'
                />
                <div className="absolute inset-0 rounded-lg bg-orange-500 opacity-70"></div>
                <div className='absolute flex flex-col justify-center items-center capitalize text-white'>
                  <BanknotesIcon className='w-8 h-8'/>
                  <p>monthly total income</p>
                  <p className='text-xs italic'>Coming soon in the next update!</p>
                  {/* <p className='text-4xl font-semibold'>₦ 0.00</p> */}
                </div>
              </div>
          </div>
        </div>
      </motion.div>
      <motion.div 
        variants={hero_02Variants}
        initial='hidden'
        animate='visible'
      className='flex flex-col sm:flex-row justify-normal space-y-4 sm:space-y-0 sm:space-x-4 mb-4 sm:mb-10'>
        <div className='shadow-sm shadow-slate-500 w-full h-full rounded-lg flex flex-col justify-center items-center mt-4 sm:mt-0 space-y-4'>
        <ul className='flex justify-between text-normal p-1 capitalize font-semibold text-slate-600 rounded-t-lg shadow-sm shadow-slate-500 w-full'>
          <li>Transaction history</li>
        </ul>
        <div className='flex flex-col justify-normal space-y-4 w-full px-4 pb-4'>
        {visibleTransactions.length === 0 && 
            <div className='flex flex-row justify-center items-center rounded-lg px-4 py-2 mx-2 shadow-sm shadow-gray-500'>
              <h4 className='text-gray-800 opacity-75 tracking-tighter'>No transaction history</h4>
            </div>
          }
          {visibleTransactions.length > 0 ? visibleTransactions.map((transaction, index) => (
            <div className={`hover:bg-slate-100 transform duration-300 ease-in-out opacity-90 p-2 rounded-lg ${index === activeTransaction ? 'bg-slate-200' : ''}`}>
              <div className={`flex flex-row justify-between items-center rounded-lg p-4 w-full h-full py-2 shadow-sm shadow-gray-500 hover:cursor-pointer`} key={index} onClick={() => handleTransactionSelection(index)}>
                <div className='text-blue-900'>
                  <h4 className='tracking-tighter text-left'>Amount paid: <span className='font-bold md:text-lg'>&#8358;{(Number(transaction.amount)).toLocaleString()}</span></h4>
                  <h4 className={`font-semibold text-sm text-gray-800 tracking-tighter text-left`}>
                    Date: 
                    <span className='font-normal'>
                        {`${transaction.date_entered.slice(8,10)}-${transaction.date_entered.slice(5,7)}-${transaction.date_entered.slice(0,4)}`} | {transaction.date_entered.slice(10,16)}
                    </span> 
                    <span className={`${transaction.status === 'failed' ? 'text-red-500' : transaction.status === 'processing' ? 'text-yellow-500' : 'text-green-500'} lowercase mx-2`}>{transaction?.status}</span>
                  </h4>
                </div>
                {/* <Link to={'/default/customerdashboard'} className={`bg-blue-950 rounded-lg text-xs sm:text-sm text-white text-center capitalize px-2 py-1 sm:px-4 sm:py-2 hover:bg-orange-500 duration-300 ease-in-out opacity-75`}>view</Link> */}
              </div>
            </div>
          )).slice(0,5) : null}
          </div>
          <div className='flex justify-center items-center space-x-5 pb-6'>
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
        <div className='shadow-sm shadow-slate-500 sm:w-2/5 rounded-lg flex justify-center items-center'>
        {selectedTransaction === null && <h4 className='text-gray-800 opacity-75 tracking-tighter text-center'>No transaction details</h4>}
        {selectedTransaction &&
          <>
          <div className='flex flex-col justify-center items-center'>
          <h4 className="text-gray-800 opacity-75 tracking-tighter text-center font-serif font-bold underline">Transaction Details</h4>
            <div className='grid grid-rows-3 gap-5 text-center w-full pt-4'>
              <div>
                  <label className='text-md font-sans font-semibold'>Transaction ID</label>
                  <p>{selectedTransaction?.transaction_id}</p>
              </div>
              <div>
                  <label className='text-md font-sans font-semibold'>Transaction Date</label>
                  <p>{selectedTransaction?.date_entered.slice(0, 10)}</p>
              </div>
              <div>
                  <label className='text-md font-sans font-semibold'>Amount Paid</label>
                  <p>₦{selectedTransaction?.amount}</p>
              </div>
              <div>
                  <label className='text-md font-sans font-semibold'>Payment Status</label>
                  <p className='text-green-700 font-bold italic'>{selectedTransaction?.status}</p>
              </div>
            </div>
            <Link to={`/prepaidtransactionreceipt/${selectedTransaction?.id}`} target='_blank' className='bg-blue-950 opacity-80 my-10 hover:bg-orange-700 traznsform duration-300 ease-in-out text-white text-center rounded-md py-2 px-2 capitalize mb-4'>view receipt</Link>
          </div>
          </>}
        </div>
        </motion.div>
        </motion.section>
        </div>
  )
}
