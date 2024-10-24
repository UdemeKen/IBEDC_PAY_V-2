import React, { useEffect, useState } from 'react';
import { Frame_01 } from '../../assets/images';
import { BanknotesIcon } from '@heroicons/react/24/outline';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function AllTransactions() {

  const location = useLocation();
  const wallet_amount = localStorage.getItem("WALLET_BALANCE");
  const customer_name = localStorage.getItem("CUSTOMER_NAME");
  const account_type = localStorage.getItem('LOGIN_ACCOUNT_TYPE');


  const [ allTransactions, setAllTransactions ] = useState(JSON.parse(localStorage.getItem('TRANSACTION_HISTORY')) || []);
  const [ allTransactionsPerPage, setAllTransactionsPerPage ] = useState(5);
  const [ currentPage, setCurrentPage ] = useState(1);
  const [ activeTransaction, setActiveTransaction ] = useState(0);
  const [ selectedTransaction, setSelectedTransaction ] = useState(null);
  const numOfTotalPages = Math.ceil(allTransactions.length / allTransactionsPerPage);
  const pages = [...Array(numOfTotalPages + 1).keys()].slice(1);

  const indexOfLastTransaction = currentPage * allTransactionsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - allTransactionsPerPage;

  const visibleTransactions = Array.isArray(allTransactions) ? allTransactions.slice(indexOfFirstTransaction, indexOfLastTransaction) : [];
  console.log(visibleTransactions);

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
    return transactions
      .filter(transaction => transaction.status === 'success')
      .reduce((total, transaction) => total + parseFloat(transaction.amount), 0.0);
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
      className='mx-4 sm:mx-20 lg:mx-32 mt-5'
    >
      <motion.div 
        variants={hero_01Variants}
        initial='hidden'
        animate='visible'
        className='flex flex-col sm:flex-row justify-between space-y-4 sm:space-y-0 sm:space-x-4 sm:my-10'
      >
        <div className='shadow-sm shadow-slate-500 w-full sm:w-1/2 h-36 rounded-lg flex flex-col justify-center items-center'>
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
            <p className='text-4xl font-semibold'>{`₦${(Number(monthlyTotal)).toLocaleString()}`}</p>
          </div>
        </div>
        </div>
        <div className='shadow-sm shadow-slate-500 w-full sm:w-1/2 h-36 rounded-lg flex flex-col justify-center items-center'>
            <div className='shadow-sm shadow-slate-500 w-full h-36 rounded-lg flex flex-col sm:flex-row justify-center items-center'>
              <div className='relative flex-grow shadow-sm shadow-slate-500 w-full h-36 rounded-lg flex flex-col justify-center items-center'>
                <img 
                  src={Frame_01}
                  alt={'Frame_01'}
                  className='w-full h-full object-cover rounded-lg'
                />
                <div className="absolute inset-0 rounded-lg bg-orange-500 opacity-70"></div>
                <div className='absolute flex flex-col justify-center items-center capitalize text-white'>
                  <BanknotesIcon className='w-8 h-8'/>
                  <p>Wallet Balance</p>
                  <p className='text-4xl font-semibold'>₦ {wallet_amount}</p>
                </div>
              </div>
          </div>
        </div>
      </motion.div>
      <div className='flex flex-col sm:flex-row sm:space-x-4 w-full'>
      <motion.div 
        variants={hero_02Variants}
        initial='hidden'
        animate='visible'
        className='space-y-4 sm:space-y-0 sm:space-x-4 mb-4 sm:mb-10 w-full'
        >
        <div className='shadow-sm shadow-slate-500 w-full rounded-lg flex flex-col items-center mt-4 sm:mt-0'>
        <p className='text-center sm:my-4 text-xl text-slate-500 font-serif underline'>All Transactions</p>
        <ul className='flex flex-col sm:flex-row justify-center space-x-0 sm:space-x-10 p-5 text-center capitalize font-semibold text-slate-600 rounded-t-lg shadow-sm shadow-slate-500 w-full'>
          <Link to={""} className={`${location.pathname === "/default/alltransactions" ? "bg-slate-300 px-4 py-1 rounded-md" : "px-4 py-1"}`}>Payment history</Link>
          {account_type === "Postpaid" && <Link to={"/default/alltransactions/billhistory"} className={`${location.pathname === "/default/alltransactions/billhistory" ? "bg-slate-300 px-4 py-1 rounded-md" : "px-4 py-1"}`}>Bill history</Link>}
          <Link to={"/default/alltransactions/wallethistory"} className={`${location.pathname === "/default/alltransactions/wallethistory" ? "bg-slate-300 px-4 py-1 rounded-md" : "px-4 py-1"}`}>Wallet history</Link>
        </ul>
        <div className='w-full flex flex-col sm:flex-row justify-center sm:space-x-4 px-4'>
        <div className='flex flex-col justify-normal sm:space-y-4 w-full py-4'>
          <Outlet />
        {visibleTransactions.length === 0 && 
            <div className='flex flex-row justify-center items-center rounded-lg px-4 sm:py-2 mx-2 shadow-sm shadow-gray-500'>
              <h4 className='text-gray-800 opacity-75 tracking-tighter'>No transaction history</h4>
            </div>
          }
          {visibleTransactions.length > 0 ? visibleTransactions.map((transaction, index) => (
            <div className={`${location.pathname === "/default/alltransactions/billhistory" || location.pathname === "/default/alltransactions/wallethistory" ? "hidden" : ""} hover:bg-slate-100 transform duration-300 ease-in-out opacity-90 w-full p-2 rounded-lg ${index === activeTransaction ? 'bg-slate-200' : ''}`}>
              <div className={`flex flex-row justify-between items-center rounded-lg p-4 w-full h-full py-2 shadow-sm shadow-gray-500 hover:cursor-pointer`} key={index} onClick={() => handleTransactionSelection(index)}>
                <div className='text-blue-900'>
                  {account_type === "Prepaid" && <h4 className='tracking-tighter text-left'>Amount paid: <span className='font-bold md:text-lg'>&#8358;{(Number(transaction.Amount)).toLocaleString()}</span></h4>}
                  {account_type === "Postpaid" && <h4 className='tracking-tighter text-left'>Amount paid: <span className='font-bold md:text-lg'>&#8358;{(Number(transaction.Payments)).toLocaleString()}</span></h4>}
                  {account_type === "Prepaid" && <h4 className={`font-semibold text-sm text-gray-800 tracking-tighter text-left`}>
                    Date: 
                    <span className='font-normal'>
                        {`${transaction.TransactionDateTime.slice(8,10)}-${transaction.TransactionDateTime.slice(5,7)}-${transaction.TransactionDateTime.slice(0,4)}`} | {transaction.TransactionDateTime.slice(10,16)}
                    </span> 
                    <span className={`${transaction.status === 'failed' ? 'text-red-500' : transaction.status === 'processing' ? 'text-yellow-500' : 'text-green-500'} lowercase mx-2`}>{transaction?.status}</span>
                  </h4>}
                  {account_type === "Postpaid" && <h4 className={`font-semibold text-sm text-gray-800 tracking-tighter text-left`}>
                    Date: 
                    <span className='font-normal'>
                        {`${transaction.PayDate.slice(8,10)}-${transaction.PayDate.slice(5,7)}-${transaction.PayDate.slice(0,4)}`} | {transaction.PayDate.slice(10,16)}
                    </span> 
                    <span className={`${transaction.status === 'failed' ? 'text-red-500' : transaction.status === 'processing' ? 'text-yellow-500' : 'text-green-500'} lowercase mx-2`}>{transaction?.status}</span>
                  </h4>}
                </div>
                {/* <Link to={'/default/customerdashboard'} className={`bg-blue-950 rounded-lg text-xs sm:text-sm text-white text-center capitalize px-2 py-1 sm:px-4 sm:py-2 hover:bg-orange-500 duration-300 ease-in-out opacity-75`}>view</Link> */}
              </div>
            </div>
          )).slice(0,5) : null}
          <div className={`${location.pathname === "/default/alltransactions/billhistory" || location.pathname === "/default/alltransactions/wallethistory" ? "hidden" : ""} flex justify-center items-center space-x-5 pt-6 sm:pb-6`}>
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
        <>
        {selectedTransaction &&
        <div className={`${location.pathname === "/default/alltransactions/billhistory" || location.pathname === "/default/alltransactions/wallethistory" ? "hidden" : ""} shadow-sm shadow-slate-500 sm:w-full h-full rounded-lg my-6 px-5`}>
            <h4 className="text-gray-800 opacity-75 tracking-tighter text-center font-serif font-bold underline my-5">Transaction Details</h4>
            {/* <div className='text-center my-4'>
              <label className='text-md font-sans font-semibold'>Customer Name</label>
              <p>{customer_name}</p>
            </div> */}
              <div className='grid grid-cols-1 sm:grid-cols-3 gap-y-4 text-center text-sm'>
              {selectedTransaction?.account_type === "Prepaid" && <div>
                  <label className='text-md font-sans font-semibold'>Meter Number</label>
                  <p>{selectedTransaction?.meter_no}</p>
              </div>}
              {selectedTransaction?.account_type === "Postpaid" && <div>
                  <label className='text-md font-sans font-semibold'>Account Number</label>
                  <p>{selectedTransaction?.account_number}</p>
              </div>}
              <div>
                  <label className='text-md font-sans font-semibold'>Account Type</label>
                  <p>{account_type}</p>
              </div>
              <div>
                  <label className='text-md font-sans font-semibold'>Amount Paid</label>
                  {account_type === "Prepaid" && <p>₦{selectedTransaction?.Amount}</p>}
                  {account_type === "Postpaid" && <p>₦{selectedTransaction?.Payments}</p>}
              </div>
              <div>
                  <label className='text-md font-sans font-semibold'>BUID</label>
                  <p>{selectedTransaction?.BUID}</p>
              </div>
              <div>
                  <label className='text-md font-sans font-semibold'>Transaction ID</label>
                  <p>{selectedTransaction?.TransactionNo}</p>
              </div>
              <div>
                  <label className='text-md font-sans font-semibold'>Address</label>
                  <p>{selectedTransaction?.Address === null ? "No Address" : selectedTransaction?.Address}</p>
              </div>
              {/* <div>
                  <label className='text-md font-sans font-semibold'>Provider</label>
                  <p>{selectedTransaction?.provider}</p>
              </div>
              <div>
                  <label className='text-md font-sans font-semibold'>Payment Status</label>
                  <p className='text-green-700 font-bold italic'>{selectedTransaction?.status === "processing" ? <span className='text-yellow-500'>{selectedTransaction?.status}</span> : selectedTransaction?.status === "failed" ? <span className='text-red-500'>{selectedTransaction?.status}</span> : <span className='text-green-500'>{selectedTransaction?.status}</span>}</p>
              </div> */}
              <div>
                  <label className='text-md font-sans font-semibold'>Transaction Date</label>
                  {account_type === "Prepaid" && <p>{selectedTransaction?.TransactionDateTime.slice(0, 10)}</p>}
                  {account_type === "Postpaid" && <p>{selectedTransaction?.PayDate.slice(0, 10)}</p>}
              </div>
              <div>
                  <label className='text-md font-sans font-semibold'>Cost of Units</label>
                  <p>{selectedTransaction?.status === "processing" ? <span className='text-extra-xxs'>Display on payment successful...</span> : selectedTransaction?.status === "failed" ? "no unit" : selectedTransaction?.CostOfUnits}</p>
              </div>
              <div>
                  <label className='text-md font-sans font-semibold'>VAT</label>
                  <p>{selectedTransaction?.status === "processing" ? <span className='text-extra-xs'>Display on payment successful...</span> : selectedTransaction?.status === "failed" ? "no unit" : selectedTransaction?.VAT}</p>
              </div>
              <div>
                  <label className='text-md font-sans font-semibold'>Units</label>
                  <p>{selectedTransaction?.status === "processing" ? <span className='text-extra-xs'>Display on payment successful...</span> : selectedTransaction?.status === "failed" ? "no unit" : selectedTransaction?.Units}</p>
              </div>
              {/* <div>
                  <label className='text-md font-sans font-semibold'>Feeder Name</label>
                  <p>{selectedTransaction?.status === "processing" ? <span className='text-extra-xs'>Display on payment successful...</span> : selectedTransaction?.status === "failed" ? "no unit" : selectedTransaction?.feederName}</p>
              </div>
              <div>
                  <label className='text-md font-sans font-semibold'>Service Band</label>
                  <p>{selectedTransaction?.status === "processing" ? <span className='text-extra-xs'>Display on payment successful...</span> : selectedTransaction?.status === "failed" ? "no unit" : selectedTransaction?.serviceBand}</p>
              </div> */}
              {/* <div>
                  <label className='text-md font-sans font-semibold'>Tarriff Code</label>
                  <p>{selectedTransaction?.status === "processing" ? <span className='text-extra-xs'>Display on payment successful...</span> : selectedTransaction?.status === "failed" ? "no unit" : selectedTransaction?.tariffcode}</p>
              </div>
              <div>
                  <label className='text-md font-sans font-semibold'>Undertakings</label>
                  <p>{selectedTransaction?.status === "processing" ? <span className='text-extra-xs'>Display on payment successful...</span> : selectedTransaction?.status === "failed" ? "no unit" : selectedTransaction?.udertaking}</p>
              </div> */}
              <div>
                  <label className='text-md font-sans font-semibold'>Transaction Reference</label>
                  <p>{selectedTransaction?.status === "processing" ? <span className='text-extra-xs'>Display on payment successful...</span> : selectedTransaction?.status === "failed" ? "no unit" : selectedTransaction?.transref}</p>
              </div>
              {/* <div>
                  <label className='text-md font-sans font-semibold'>DSS Name</label>
                  <p>{selectedTransaction?.status === "processing" ? <span className='text-extra-xs'>Display on payment successful...</span> : selectedTransaction?.status === "failed" ? "no unit" : selectedTransaction?.dssName}</p>
              </div> */}
              <div className='text-white sm:block hidden'>
                  <label className='text-md font-sans font-semibold'>Blank</label>
                  <p>{selectedTransaction?.status === "processing" ? <span className='text-extra-xs'>Display on payment successful...</span> : selectedTransaction?.status === "failed" ? "no unit" : selectedTransaction?.dssName}</p>
              </div>
              <div>
                  <label className='text-md font-sans font-semibold'>Token</label>
                  <p>{selectedTransaction?.status === "processing" ? <span className='text-extra-xs'>Display on payment successful...</span> : selectedTransaction?.status === "failed" ? "no unit" : selectedTransaction?.Token}</p>
              </div>
              {/* <div className='text-white sm:block hidden'>
                  <label className='text-md font-sans font-semibold'>Blank</label>
                  <p>{selectedTransaction?.status === "processing" ? <span className='text-extra-xs'>Display on payment successful...</span> : selectedTransaction?.status === "failed" ? "no unit" : selectedTransaction?.receiptno}</p>
              </div> */}
          </div>
            <div className='flex flex-col justify-center items-center my-4'>
              {account_type === "Prepaid" && <Link to={`/prepaidtransactionreceipt/${selectedTransaction?.TransactionNo}`} target='_blank' className='bg-blue-950 opacity-80 hover:bg-orange-700 transform duration-300 ease-in-out text-white text-center rounded-md py-2 px-2 capitalize w-1/2 sm:w-1/3'>view receipt</Link>}
              {account_type === "Postpaid" && <Link to={`/postpaidtransactionreceipt/${selectedTransaction?.PaymentID}`} target='_blank' className='bg-blue-950 opacity-80 hover:bg-orange-700 transform duration-300 ease-in-out text-white text-center rounded-md py-2 px-2 capitalize w-1/2 sm:w-1/3'>view receipt</Link>}
          </div>
        </div>
        }
        </>
          </div>
          </div>
        {selectedTransaction === null && <h4 className='text-gray-800 opacity-75 tracking-tighter text-center'>No transaction details</h4>}
      </motion.div>
      </div>
    </motion.section>
  </div>
  )
}
