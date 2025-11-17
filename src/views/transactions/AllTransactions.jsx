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
  const [ allTransactionsPerPage, setAllTransactionsPerPage ] = useState(8);
  const [ currentPage, setCurrentPage ] = useState(1);
  const [ activeTransaction, setActiveTransaction ] = useState(0);
  const [ selectedTransaction, setSelectedTransaction ] = useState(null);
  const numOfTotalPages = Math.ceil(allTransactions.length / allTransactionsPerPage);
  const pages = [...Array(numOfTotalPages + 1).keys()].slice(1);

  const indexOfLastTransaction = currentPage * allTransactionsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - allTransactionsPerPage;

  const paymentHistoryTransactions = Array.isArray(allTransactions) ? allTransactions : [];
  const visibleTransactions = paymentHistoryTransactions.slice(indexOfFirstTransaction, indexOfLastTransaction);
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

  const getTransactionDate = (transaction) => {
    const rawDate = transaction?.date_entered || transaction?.TransactionDateTime;
    if (!rawDate) return null;
    const normalized = rawDate.replace(' ', 'T');
    const parsed = new Date(normalized);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  };

  const getCurrentMonthTransactions = (transactions) => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    return transactions.filter(transaction => {
        const transactionDate = getTransactionDate(transaction);
        return transactionDate && transactionDate.getMonth() === currentMonth && transactionDate.getFullYear() === currentYear;
    });
  };

  const calculateMonthlyTotal = (transactions) => {
    return transactions
      .filter(transaction => transaction.status === 'success')
      .reduce((total, transaction) => total + parseFloat(transaction.amount || 0), 0.0);
  };

  const currentMonthTransactions = getCurrentMonthTransactions(paymentHistoryTransactions);
  const monthlyTotal = calculateMonthlyTotal(currentMonthTransactions);

  const sanitizedWalletBalance = (() => {
    if (!wallet_amount || wallet_amount === 'undefined' || wallet_amount === 'null') return 0;
    const numericValue = Number(wallet_amount.toString().replace(/,/g, '').trim());
    return Number.isFinite(numericValue) ? numericValue : 0;
  })();


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

  function formatToken(token) {
    if (!token) return '';
    return token.replace(/(\d{4})(?=\d)/g, '$1-');
}
  
  
  return (
    <div className='bg-white bg-cover pb-4'>
    <motion.section 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
      className='mx-4 sm:mx-10 mt-5'
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
                  <p className='text-4xl font-semibold'>{`₦${sanitizedWalletBalance.toLocaleString()}`}</p>
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
        <div className='w-full flex flex-col sm:flex-row justify-center sm:space-x-4'>
        <div className='flex flex-col justify-normal sm:space-y-4 w-full py-4'>
          <Outlet />
        {visibleTransactions.length === 0 && 
            <div className='flex flex-row justify-center items-center rounded-lg px-4 sm:py-2 mx-2 shadow-sm shadow-gray-500'>
              <h4 className='text-gray-800 opacity-75 tracking-tighter'>No transaction history</h4>
            </div>
          }
          {visibleTransactions.length > 0 ? visibleTransactions.map((transaction, index) => (
            <div className={`${location.pathname === "/default/alltransactions/billhistory" || location.pathname === "/default/alltransactions/wallethistory" ? "hidden" : ""} hover:bg-slate-100 transform duration-300 ease-in-out opacity-90 w-full p-2 rounded-lg ${index === activeTransaction ? 'bg-slate-200' : ''}`} key={transaction.id}>
              <div className={`flex flex-row justify-between items-center rounded-lg p-4 w-full h-full py-2 shadow-sm shadow-gray-500 hover:cursor-pointer`} onClick={() => handleTransactionSelection(index)}>
                <div className='text-blue-900'>
                  <h4 className='tracking-tighter text-left'>Amount paid: <span className='font-bold md:text-lg'>&#8358;{Number(transaction.amount || 0).toLocaleString()}</span></h4>
                  <h4 className={`font-semibold text-sm text-gray-800 tracking-tighter text-left`}>
                    Date: 
                    <span className='font-normal'>
                      {transaction.date_entered ? `${transaction.date_entered.slice(8,10)}-${transaction.date_entered.slice(5,7)}-${transaction.date_entered.slice(0,4)} | ${transaction.date_entered.slice(11,16)}` : 'N/A'}
                    </span> 
                    <span className={`${transaction.status === 'failed' ? 'text-red-500' : transaction.status === 'processing' ? 'text-yellow-500' : 'text-green-500'} lowercase mx-2`}>{transaction?.status}</span>
                  </h4>
                </div>
              </div>
            </div>
          )) : null}
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
        <div className={`${location.pathname === "/default/alltransactions/billhistory" || location.pathname === "/default/alltransactions/wallethistory" ? "hidden" : ""} bg-white shadow-lg rounded-xl my-6 overflow-hidden border border-gray-200`}>
            {/* Header Section */}
            <div className='bg-gradient-to-r from-blue-950 to-blue-800 text-white px-6 py-4'>
                <h3 className="text-xl font-bold text-center">Transaction Details</h3>
                <div className='flex flex-col sm:flex-row justify-between items-center mt-3 gap-2'>
                    <div className='text-center sm:text-left'>
                        <p className='text-xs text-blue-200'>Transaction ID</p>
                        <p className='text-sm font-semibold'>{selectedTransaction?.transaction_id || 'N/A'}</p>
                    </div>
                    <div className={`px-4 py-1 rounded-full text-xs font-semibold ${
                        selectedTransaction?.status === 'success' ? 'bg-green-500' : 
                        selectedTransaction?.status === 'failed' ? 'bg-red-500' : 
                        'bg-yellow-500'
                    }`}>
                        {selectedTransaction?.status ? selectedTransaction.status.toUpperCase() : 'PENDING'}
                    </div>
                </div>
            </div>

            <div className='px-4 sm:px-6 py-5'>
                {/* Payment Summary Section */}
                <div className='bg-blue-50 rounded-lg p-4 mb-5 border-2 border-blue-200'>
                    <h4 className='text-sm font-semibold text-gray-600 mb-3 text-center'>Payment Summary</h4>
                    <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                        <div className='text-center'>
                            <label className='text-xs font-semibold text-gray-600 block mb-1'>Amount Paid</label>
                            <p className='text-2xl font-bold text-blue-900'>₦{Number(selectedTransaction?.amount || 0).toLocaleString()}</p>
                        </div>
                        {selectedTransaction?.costOfUnits && (
                            <div className='text-center'>
                                <label className='text-xs font-semibold text-gray-600 block mb-1'>Cost of Units</label>
                                <p className='text-lg font-semibold text-gray-800'>₦{Number(selectedTransaction?.costOfUnits || 0).toLocaleString()}</p>
                            </div>
                        )}
                        {selectedTransaction?.VAT && (
                            <div className='text-center'>
                                <label className='text-xs font-semibold text-gray-600 block mb-1'>VAT</label>
                                <p className='text-lg font-semibold text-gray-800'>₦{Number(selectedTransaction?.VAT || 0).toLocaleString()}</p>
                            </div>
                        )}
                        {selectedTransaction?.units && (
                            <div className='text-center'>
                                <label className='text-xs font-semibold text-gray-600 block mb-1'>Units</label>
                                <p className='text-lg font-semibold text-gray-800'>{selectedTransaction?.units}</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Transaction Information Section */}
                <div className='mb-5'>
                    <h4 className='text-sm font-bold text-gray-700 mb-3 pb-2 border-b border-gray-200'>Transaction Information</h4>
                    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
                        <div className='bg-gray-50 p-3 rounded-lg'>
                            <label className='text-xs font-semibold text-gray-600 block mb-1'>Transaction Date</label>
                            <p className='text-sm font-medium text-gray-900'>{selectedTransaction?.date_entered ? selectedTransaction.date_entered.slice(0,10) : 'N/A'}</p>
                        </div>
                        <div className='bg-gray-50 p-3 rounded-lg'>
                            <label className='text-xs font-semibold text-gray-600 block mb-1'>Receipt / Token</label>
                            <p className='text-sm font-medium text-gray-900 break-all'>
                                {formatToken(selectedTransaction?.token || selectedTransaction?.Token || '') ||
                                 selectedTransaction?.receiptno ||
                                 selectedTransaction?.TransactionNo ||
                                 'N/A'}
                            </p>
                        </div>
                        <div className='bg-gray-50 p-3 rounded-lg'>
                            <label className='text-xs font-semibold text-gray-600 block mb-1'>Provider</label>
                            <p className='text-sm font-medium text-gray-900'>{selectedTransaction?.provider || 'N/A'}</p>
                        </div>
                    </div>
                </div>

                {/* Account Information Section */}
                <div className='mb-5'>
                    <h4 className='text-sm font-bold text-gray-700 mb-3 pb-2 border-b border-gray-200'>Account Information</h4>
                    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
                        {selectedTransaction?.meter_no && (
                            <div className='bg-gray-50 p-3 rounded-lg'>
                                <label className='text-xs font-semibold text-gray-600 block mb-1'>Meter Number</label>
                                <p className='text-sm font-medium text-gray-900'>{selectedTransaction.meter_no}</p>
                            </div>
                        )}
                        {selectedTransaction?.account_number && (
                            <div className='bg-gray-50 p-3 rounded-lg'>
                                <label className='text-xs font-semibold text-gray-600 block mb-1'>Account Number</label>
                                <p className='text-sm font-medium text-gray-900'>{selectedTransaction.account_number}</p>
                            </div>
                        )}
                        <div className='bg-gray-50 p-3 rounded-lg'>
                            <label className='text-xs font-semibold text-gray-600 block mb-1'>Account Type</label>
                            <p className='text-sm font-medium text-gray-900'>{selectedTransaction?.account_type || account_type || 'N/A'}</p>
                        </div>
                        {selectedTransaction?.customer_name && (
                            <div className='bg-gray-50 p-3 rounded-lg sm:col-span-2 lg:col-span-1'>
                                <label className='text-xs font-semibold text-gray-600 block mb-1'>Customer Name</label>
                                <p className='text-sm font-medium text-gray-900'>{selectedTransaction.customer_name}</p>
                            </div>
                        )}
                        {selectedTransaction?.Address && (
                            <div className='bg-gray-50 p-3 rounded-lg sm:col-span-2'>
                                <label className='text-xs font-semibold text-gray-600 block mb-1'>Service Address</label>
                                <p className='text-sm font-medium text-gray-900'>{selectedTransaction.Address === null ? "No Address" : selectedTransaction.Address}</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Service Details Section */}
                {(selectedTransaction?.BUID || selectedTransaction?.tariff || selectedTransaction?.serviceBand || selectedTransaction?.feederName || selectedTransaction?.dssName) && (
                    <div className='mb-5'>
                        <h4 className='text-sm font-bold text-gray-700 mb-3 pb-2 border-b border-gray-200'>Service Details</h4>
                        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
                            {selectedTransaction?.BUID && (
                                <div className='bg-gray-50 p-3 rounded-lg'>
                                    <label className='text-xs font-semibold text-gray-600 block mb-1'>BUID</label>
                                    <p className='text-sm font-medium text-gray-900'>{selectedTransaction.BUID}</p>
                                </div>
                            )}
                            {selectedTransaction?.tariff && (
                                <div className='bg-gray-50 p-3 rounded-lg'>
                                    <label className='text-xs font-semibold text-gray-600 block mb-1'>Tariff</label>
                                    <p className='text-sm font-medium text-gray-900'>{selectedTransaction.tariff}</p>
                                </div>
                            )}
                            {selectedTransaction?.serviceBand && (
                                <div className='bg-gray-50 p-3 rounded-lg'>
                                    <label className='text-xs font-semibold text-gray-600 block mb-1'>Service Band</label>
                                    <p className='text-sm font-medium text-gray-900'>{selectedTransaction.serviceBand}</p>
                                </div>
                            )}
                            {selectedTransaction?.feederName && (
                                <div className='bg-gray-50 p-3 rounded-lg'>
                                    <label className='text-xs font-semibold text-gray-600 block mb-1'>Feeder Name</label>
                                    <p className='text-sm font-medium text-gray-900'>{selectedTransaction.feederName}</p>
                                </div>
                            )}
                            {selectedTransaction?.dssName && (
                                <div className='bg-gray-50 p-3 rounded-lg'>
                                    <label className='text-xs font-semibold text-gray-600 block mb-1'>DSS Name</label>
                                    <p className='text-sm font-medium text-gray-900'>{selectedTransaction.dssName}</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* View Receipt Button */}
                <div className='flex flex-col justify-center items-center pt-4 border-t border-gray-200'>
                    {(account_type === "Prepaid" || !account_type || account_type === "null") && (
                        <Link 
                            to={`/prepaidtransactionreceipt/${selectedTransaction?.transaction_id}`} 
                            target='_blank' 
                            className='bg-blue-950 hover:bg-orange-600 transform duration-300 ease-in-out text-white text-center rounded-lg py-3 px-6 capitalize font-semibold shadow-md hover:shadow-lg w-full sm:w-auto min-w-[200px]'
                        >
                            View Receipt
                        </Link>
                    )}
                    {account_type === "Postpaid" && (
                        <Link 
                            to={`/postpaidtransactionreceipt/${selectedTransaction?.transaction_id}`} 
                            target='_blank' 
                            className='bg-blue-950 hover:bg-orange-600 transform duration-300 ease-in-out text-white text-center rounded-lg py-3 px-6 capitalize font-semibold shadow-md hover:shadow-lg w-full sm:w-auto min-w-[200px]'
                        >
                            View Receipt
                        </Link>
                    )}
                </div>
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
