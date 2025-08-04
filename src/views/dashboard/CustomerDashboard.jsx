import React, { useEffect, useState } from 'react'
import '../../components/UniversalCss.css';
import { Frame_01, Advert_01 } from '../../assets/images';
import { VectorIcon } from '../../assets/icons';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faTimes, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { CreditCardIcon, BanknotesIcon, PhoneIcon, WalletIcon } from '@heroicons/react/24/outline';
import PaymentForm from '../../components/paymentProcess/PaymentForm';
import CompletePayment from '../../components/paymentProcess/CompletePayment';
import { Link, useNavigate } from 'react-router-dom';
import axiosClient from '../../axios';
import { toast } from 'react-toastify';
import { heroVariants } from '../../variants';
import VirtualAccountModal from '../virtualAccountModal/VirtualAccountModal';
import Webcam from 'react-webcam';

const transactionHistoryUrl = "/V2_ibedc_OAUTH_tokenReviwed/history/other-history";
// const transactionHistoryUrl = "/V2_ibedc_OAUTH_tokenReviwed/history/get-history";
const billHistoryOutstandingBalanceUrl = "/V2_ibedc_OAUTH_tokenReviwed/history/get-bill-history";
// const billHistoryOutstandingBalanceUrl = "/V2_ibedc_OAUTH_agency_sync/customerhistory/bill-history";
// const getCustomerDetailsUrl = "/dashboard/get-details";
const getOutstandingBalanceUrl = "/V2_ibedc_OAUTH_tokenReviwed/outstanding/get-balance";
const showOutstandingBalanceUrl = "/V2_ibedc_OAUTH_tokenReviwed/outstanding/show-balance";
const getWalletBalance_HistoryUrl = "/V2_ibedc_OAUTH_tokenReviwed/wallet/wallet-balance-history";
const METER_ACCT_NUMBER_REGEX = /^[0-9\-/]{11,16}$/;


export default function CustomerDashboard() {

  const userEmail = localStorage.getItem("USER_EMAIL");
  const username = localStorage.getItem("USER_NAME");
  const account_type = localStorage.getItem("LOGIN_ACCOUNT_TYPE");
  const meterNumber = localStorage.getItem("USER_METER_NUMBER");
  const wallet_amount = localStorage.getItem("WALLET_BALANCE");
  const cleanedUsername = username ? username.replace(/\./g, '') : '';
  
  const [ transactionHistory, setTransactionHistory ] = useState([]);
  const [ loading, setLoading ] = useState(false);
  const [ loading_01, setLoading_01 ] = useState(false);
  const [ loading_02, setLoading_02 ] = useState(false);
  const [ loading_03, setLoading_03 ] = useState(false);
  const [ loading_04, setLoading_04 ] = useState(false);
  const [ buttonDisabled, setButtonDisabled ] = useState(false);
  const [ blur, setBlur ] = useState(false);
  const [ blur_01, setBlur_01 ] = useState(false);
  const [ blur_02, setBlur_02 ] = useState(false);
  const [ userFocus, setUserFocus ] = useState(false);
  const [ accountType, setAccountType ] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);

    const handleCreateAccountClick = () => {
        setIsModalOpen(true);
    };

  // const [ displayAccountType, setDisplayAccountType ] = useState(meterNumber && meterNumber.length === 13 ? "Prepaid" : "Postpaid");
  const [ user, setUser ] = useState('');
  const [ formattedUser, setFormattedUser ] = useState('');
  const [ validMeterAcctNo, setValidMeterAcctNo ] = useState(false);
  const [ walletHistory, setWalletHistory ] = useState([]);
  const [ walletBalance, setWalletBalance ] = useState("")
  const [ pin, setPin ] = useState("")
  const [ success, setSuccess ] = useState();
  const [ outStandingbalance, setOutStandingbalance ] = useState("");
  const [currentChargeTotal, setCurrentChargeTotal] = useState("");
  const [VAT, setVAT] = useState("");
  const [userOutandingBalance, setUserOutandingBalance] = useState(() => {
    return localStorage.getItem('USER_OUTSTANDING_BALANCE') || "";
  });
  const [userCurrentBill, setUserCurrentBill] = useState(() => {
    return localStorage.getItem('CURRENT_BILL') || "";
  });

  const authority = localStorage.getItem('AUTHORITY');
  const region = localStorage.getItem('REGION');
  const businessHub = localStorage.getItem('BUSINESS_HUB');
  const serviceCenter = localStorage.getItem('SERVICE_CENTER');
  const [dtmPendingAccounts, setDtmPendingAccounts] = useState([]);
  const [dtmStats, setDtmStats] = useState({pending: 0, validated: 0, rejected: 0, photos: 0});
  const [dtmLoading, setDtmLoading] = useState(false);
  const [dtmRecentActivity, setDtmRecentActivity] = useState([]);
  const [dtmPage, setDtmPage] = useState(1);
  const dtmPerPage = 4;
  const navigate = useNavigate();

  const [validateModalOpen, setValidateModalOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [dtmRejectingId, setDtmRejectingId] = useState(null);

  const [serviceCenters, setServiceCenters] = useState([]);
  const [selectedServiceCenter, setSelectedServiceCenter] = useState('');

  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [viewAccount, setViewAccount] = useState(null);

  useEffect(() => {
    const isValid = METER_ACCT_NUMBER_REGEX.test(user);
    setValidMeterAcctNo(isValid);
  }, [user]);

  useEffect(() => {
    const formattedAccountNumber = user.replace(/[^0-9]/g, '');
    if (accountType === 'Postpaid') {
      if (formattedAccountNumber.length >= 2) {
        setFormattedUser(formattedAccountNumber.replace(/(\d{2})(\d{2})(\d{2})(\d{4})(\d{2})/, '$1/$2/$3/$4-$5'));
      } else {
        setFormattedUser(formattedAccountNumber);
      }
    } else if (accountType === 'Prepaid') {
      // Leave it as it's
    } else {
      setFormattedUser('');
    }
  }, [accountType, user]);
  
  const meterNo_Or_AccountNo = accountType === "Postpaid" ? formattedUser : user;
  console.log(meterNo_Or_AccountNo);

  

  useEffect(() => {
    const fetchBillHistoryOutstandingBalance = async () => {
      setLoading_04(true);
        const payload = {
            "type": "Postpaid",
            "customer_number": meterNumber
        };

        if (account_type !== "Postpaid") {
          setLoading_04(false);
          return;
        }

        try {
            const response = await axiosClient.get(billHistoryOutstandingBalanceUrl, payload);
            const totalDue = response?.data?.data?.[0]?.TotalDue;
            const currentCharge = response?.data?.data?.[0]?.CurrentChgTotal;
            const vat = response?.data?.data?.[0]?.VAT;
            const billHistory = response?.data?.data;
            setUserOutandingBalance(totalDue);
            setCurrentChargeTotal(currentCharge);
            setVAT(vat);

            console.log(billHistory);
            setUserCurrentBill((Number(currentCharge) + Number(vat)).toString());
            localStorage.setItem('BILL_HISTORY', JSON.stringify(billHistory));
            localStorage.setItem('USER_OUTSTANDING_BALANCE', totalDue);
            localStorage.setItem('USER_CURRENT_CHARGE', currentCharge);
            localStorage.setItem('USER_CURRENT_VAT', vat);
            localStorage.setItem('CURRENT_BILL', (Number(currentCharge) + Number(vat)).toString());
        } catch (error) {
            console.log(error);
        } finally {
            setLoading_04(false);
        }
    };

    fetchBillHistoryOutstandingBalance();
    }, [account_type]);

    const requestData = {
      "email": userEmail,
      "account_type": accountType,
      "account_no": meterNumber,
    };
    const handleGetOutStandingBalance = async (e) => {
      e.preventDefault();
      setButtonDisabled(true);
      setLoading_01(true);
  
      try{
        const response = await axiosClient.post(getOutstandingBalanceUrl, requestData);
        console.log(response);
        toast.success(response?.data?.message);
        setButtonDisabled(false);
        setLoading_01(false);
        setBlur_01(false);
        setBlur_02(true);
      }catch(error){
        console.log(error);
        setButtonDisabled(false);
        setLoading_01(false);
      };
    }

  const requestData_01 = {
    "email": userEmail,
    "account_no": meterNo_Or_AccountNo,
    "account_type": accountType,
    "pin": pin,
  }

  const handleShowOutStandingBalance = async (e) => {
    e.preventDefault();
    setButtonDisabled(true);
    setLoading_03(true);

    if (pin === "") {
      toast.error("Please enter the PIN sent to your email");
      setButtonDisabled(false);
      setLoading_03(false);
      return;
    }

    try{
      const response = await axiosClient.post(showOutstandingBalanceUrl, requestData_01);
      console.log(response?.data?.payload);
      toast.success(response?.data?.message);
      setSuccess(response?.data?.success);
      setOutStandingbalance(response?.data?.payload?.balance?.Balance);
      setButtonDisabled(false);
      setLoading_03(false);
      setBlur_02(false);
      setAccountType("");
      setUser("");
      setPin("");
    }catch(error){
      console.log(error);
      toast.error(error.response?.data?.payload);
      setButtonDisabled(false);
      setLoading_03(false);
      setBlur_02(false);
      setAccountType("");
      setUser("");
      setPin("");
  }
};

  const handleBlur_01 = () => {
    setBlur_01(!blur_01);
    setAccountType("");
    setUser("");
  };

  const handleBlur_02 = () => {
    setBlur_02(!blur_02);
    setAccountType("");
    setUser("");
  };

  useEffect(() => {
    const handleBeforeUnload = () => {
        localStorage.removeItem('TRANSACTION_HISTORY');  
        localStorage.removeItem('BILL_HISTORY');  
        localStorage.removeItem('USER_OUTSTANDING_BALANCE'); 
        localStorage.removeItem('CURRENT_BILL'); 
    };
        window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
        window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);
  
  useEffect(() => {
    const getTransactionHistory = async () => {
      setLoading(true);
      try {
        const localHistory = JSON.parse(localStorage.getItem('TRANSACTION_HISTORY')) || [];
        if (Array.isArray(localHistory) && localHistory.length > 0) {
          setTransactionHistory(localHistory)
          console.log(localHistory);
        } else {
          const response = await axiosClient.get(transactionHistoryUrl);
          const fetchedData = response?.data?.data || []; // Ensure fetchedData is an array
          setTransactionHistory(fetchedData);
          console.log(fetchedData);
          // setTransactionHistory(response?.data?.payload?.data);
          localStorage.setItem('TRANSACTION_HISTORY', JSON.stringify(fetchedData || []));
          // localStorage.setItem('CUSTOMER_NAME', JSON.stringify(response?.data?.payload?.data?.[0]?.customer_name));
          // localStorage.setItem('ACCOUNT_TYPE', JSON.stringify(response?.data?.payload?.data?.[0]?.account_type));
          // localStorage.setItem('METER_NUMBER', JSON.stringify(response?.data?.payload?.data?.[0]?.meter_no));
          // localStorage.setItem('PHONE_NUMBER', JSON.stringify(response?.data?.payload?.data?.[0]?.phone));
          // localStorage.setItem('BUSINESS_HUB', JSON.stringify(response?.data?.payload?.data?.[0]?.udertaking));
          // localStorage.setItem('TARRIF_CODE', JSON.stringify(response?.data?.payload?.data?.[0]?.tariffcode));
        }
      }catch(error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }
    getTransactionHistory();
  }, []);

  console.log('transactionHistory:', transactionHistory);
  // console.log('current transaction:', transaction);

  useEffect(() => {
      const getWalletBalance_History = async () => {
        setLoading_02(true);
        try{
          const response = await axiosClient.get(getWalletBalance_HistoryUrl);
          console.log("WalletAmount:", response?.data);
          setWalletHistory(response?.data?.payload?.balance_history);
          setWalletBalance(response?.data?.payload?.user_balance?.wallet_amount);
          localStorage.setItem('WALLET_HISTORY', JSON.stringify(response?.data?.payload?.balance_history || []));
          localStorage.setItem('WALLET_BALANCE', response?.data?.payload?.user_balance?.wallet_amount);
          setLoading_02(false);
        }catch(error){
          console.log(error);
        };
      }
      getWalletBalance_History();
  }, []);

    const accountName = localStorage.getItem('account_name');
    const accountNo = localStorage.getItem('account_no');
    const bankName = localStorage.getItem('bank_name');
    const customerEmail = localStorage.getItem('customer_email');
    const userId = localStorage.getItem('user_id');
    const status = localStorage.getItem('STATUS');

  // console.log(  displayAccountType  );

  useEffect(() => {
    if (authority === 'dtm') {
      const fetchPendingAccounts = async () => {
        setDtmLoading(true);
        try {
          const response = await axiosClient.get('/V4IBEDC_new_account_setup_sync/initiate/get_pending_account');
          const accounts = response?.data?.payload?.accounts?.data || [];
          setDtmPendingAccounts(accounts);
          // Calculate stats
          let pending = 0, validated = 0, photos = 0;
          let recent = [];
          accounts.forEach(acc => {
            if (isPending(acc)) pending++;
            if (isValidated(acc)) validated++;
            if (acc.picture && acc.picture !== "0") photos++;
            // Build recent activity (example)
            if (acc.account && acc.account.status_name) {
              recent.push({
                type: acc.account.status_name,
                tracking_id: acc.tracking_id,
                time: acc.updated_at
              });
            }
          });
          setDtmStats({pending, validated, rejected: 0, photos});
          setDtmRecentActivity(recent.slice(0, 5));
        } catch (e) {
          setDtmPendingAccounts([]);
        } finally {
          setDtmLoading(false);
        }
      };
      fetchPendingAccounts();
    }
  }, [authority]);

  // DTM action handlers
  const handleReject = async (id) => {
    setDtmRejectingId(id);
    try {
      await axiosClient.post('/V4IBEDC_new_account_setup_sync/initiate/rejectform', { id: String(id) });
      setDtmPendingAccounts(prev => prev.filter(acc => acc.id !== id));
      toast.success("Application rejected and removed.");
    } catch (e) {
      toast.error("Failed to reject application.");
    } finally {
      setDtmRejectingId(null);
    }
  };

  const handleValidate = (id) => {
    // Placeholder for validation logic
    toast.info("Validate action coming soon.");
  };

  // DTM Dashboard rendering
  if (authority === 'dtm') {
    const dtmTotalPages = Math.ceil(dtmPendingAccounts.length / dtmPerPage);
    const dtmPaginatedAccounts = dtmPendingAccounts.slice((dtmPage - 1) * dtmPerPage, dtmPage * dtmPerPage);
    return (
      <div className="bg-[#f5f7fa] min-h-screen p-4">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold mb-1">Welcome, {cleanedUsername}</h2>
            <p className="text-sm text-gray-600">DTM Validation & Management Dashboard</p>
          </div>
          <div className="text-right">
            <div className="text-blue-900 font-bold">{region ? `${region} Region` : ''}</div>
            <div className="text-sm text-blue-700">{businessHub ? `Business Hub: ${businessHub}` : ''}</div>
            <div className="text-sm text-blue-700">{serviceCenter ? `Service Center: ${serviceCenter}` : ''}</div>
          </div>
        </div>
        {/* Stats */}
        {/* <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center">
            <span className="text-2xl font-bold text-pink-500">{dtmStats.pending}</span>
            <span className="text-xs text-gray-500 mt-1">PENDING APPLICATIONS</span>
          </div>
          <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center">
            <span className="text-2xl font-bold text-purple-500">{dtmStats.validated}</span>
            <span className="text-xs text-gray-500 mt-1">VALIDATED THIS MONTH</span>
          </div>
          <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center">
            <span className="text-2xl font-bold text-orange-500">{dtmStats.rejected}</span>
            <span className="text-xs text-gray-500 mt-1">REJECTED APPLICATIONS</span>
          </div>
          <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center">
            <span className="text-2xl font-bold text-indigo-500">{dtmStats.photos}</span>
            <span className="text-xs text-gray-500 mt-1">PHOTOS CAPTURED</span>
          </div>
        </div> */}
        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Account Applications */}
          <div className="flex-1 bg-white rounded-lg shadow p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg">Account Applications</h3>
              {/* Filter buttons can be added here */}
            </div>
            {dtmLoading ? (
              <div className="text-center py-8">Loading...</div>
            ) : (
              <div className="space-y-4">
                {dtmPaginatedAccounts.map((acc, idx) => (
                  <div key={acc.id} className={`border-l-4 ${isPending(acc) ? 'border-blue-500' : isValidated(acc) ? 'border-green-500' : 'border-red-500'} bg-gray-50 rounded p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-2`}>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-blue-900">{acc.tracking_id}</span>
                        <span className={`text-xs font-semibold ml-2 ${isPending(acc) ? 'text-yellow-600' : isValidated(acc) ? 'text-green-600' : 'text-red-600'}`}>{isPending(acc) ? 'PENDING' : isValidated(acc) ? 'VALIDATED' : ''}</span>
                      </div>
                      <div className="text-xs text-gray-700 mb-1">Customer: {acc.account?.surname} {acc.account?.firstname} {acc.account?.other_name}</div>
                      <div className="text-xs text-gray-700 mb-1">Phone: {acc.account?.phone}</div>
                      <div className="text-xs text-gray-700 mb-1">Address: {acc.full_address}</div>
                      <div className="text-xs text-gray-700 mb-1">LGA: {acc.lga}</div>
                      <div className="text-xs text-gray-700 mb-1">Premise: {acc.type_of_premise} {acc.use_of_premise}</div>
                      <div className="text-xs text-gray-700 mb-1">Submitted: {acc.created_at?.slice(0,10)}</div>
                    </div>
                    <div className="flex flex-col md:flex-row gap-2 mt-2 md:mt-0">
                      {isPending(acc) && <button className="bg-green-500 text-white px-3 py-1 rounded font-semibold text-xs" onClick={() => { setSelectedAccount(acc); setValidateModalOpen(true); }}>Validate</button>}
                      {isPending(acc) && (
                        <button
                          className="bg-red-500 text-white px-3 py-1 rounded font-semibold text-xs flex items-center justify-center min-w-[70px]"
                          onClick={() => handleReject(acc.id)}
                          disabled={dtmRejectingId === acc.id}
                        >
                          {dtmRejectingId === acc.id ? (
                            <>
                              <svg className="animate-spin h-4 w-4 mr-1 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Pending...
                            </>
                          ) : (
                            'Reject'
                          )}
                        </button>
                      )}
                      {isValidated(acc) && <span className="text-green-600 font-semibold">Validated</span>}
                      <button className="bg-blue-500 text-white px-3 py-1 rounded font-semibold text-xs" onClick={() => { setViewAccount(acc); setViewModalOpen(true); }}>View</button>
                    </div>
                  </div>
                ))}
                {/* Pagination Controls */}
                {dtmTotalPages > 1 && (
                  <div className="flex justify-center items-center gap-2 mt-4">
                    <button
                      onClick={() => setDtmPage((prev) => Math.max(prev - 1, 1))}
                      disabled={dtmPage === 1}
                      className="px-3 py-1 rounded bg-gray-200 text-gray-700 font-semibold disabled:opacity-50"
                    >
                      Prev
                    </button>
                    <span className="font-semibold">{dtmPage} / {dtmTotalPages}</span>
                    <button
                      onClick={() => setDtmPage((prev) => Math.min(prev + 1, dtmTotalPages))}
                      disabled={dtmPage === dtmTotalPages}
                      className="px-3 py-1 rounded bg-gray-200 text-gray-700 font-semibold disabled:opacity-50"
                    >
                      Next
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
          {/* Sidebar */}
          {/* <div className="w-full lg:w-1/3 flex flex-col gap-6"> */}
            {/* Quick Actions */}
            {/* <div className="bg-white rounded-lg shadow p-4">
              <h4 className="font-bold mb-2">Quick Actions</h4>
              <div className="flex flex-col gap-2">
                <button className="bg-purple-500 text-white px-3 py-2 rounded font-semibold text-left">Search Applications</button>
                <button className="bg-yellow-400 text-white px-3 py-2 rounded font-semibold text-left">Bulk Validation</button>
                <button className="bg-blue-500 text-white px-3 py-2 rounded font-semibold text-left">Generate Report</button>
                <button className="bg-orange-300 text-white px-3 py-2 rounded font-semibold text-left">Settings</button>
              </div>
            </div> */}
            {/* Recent Activity */}
            {/* <div className="bg-white rounded-lg shadow p-4">
              <h4 className="font-bold mb-2">Recent Activity</h4>
              <ul className="text-xs text-gray-700 space-y-2">
                {dtmRecentActivity.length === 0 && <li>No recent activity</li>}
                {dtmRecentActivity.map((act, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${act.type.includes('Validated') ? 'bg-purple-500' : act.type.includes('Rejected') ? 'bg-orange-500' : 'bg-pink-500'}`}></span>
                    <span>{act.type} {act.tracking_id}</span>
                    <span className="ml-auto text-gray-400 text-[10px]">{act.time?.slice(11,16)} {act.time?.slice(0,10)}</span>
                  </li>
                ))}
              </ul>
            </div> */}
          {/* </div> */}
        </div>
        {validateModalOpen && selectedAccount && (
          <ValidateAccountModal
            account={selectedAccount}
            onClose={() => setValidateModalOpen(false)}
            onValidated={() => {
              setDtmPendingAccounts((prev) => prev.filter(acc => acc.id !== selectedAccount.id));
            }}
          />
        )}
        {viewModalOpen && viewAccount && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded shadow-lg w-full max-w-2xl overflow-y-auto max-h-[90vh]">
              <h2 className="font-bold mb-4 text-lg">Account Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="mb-2"><strong>Tracking ID:</strong> {viewAccount.tracking_id}</div>
                  <div className="mb-2"><strong>Region:</strong> {viewAccount.region}</div>
                  <div className="mb-2"><strong>State:</strong> {viewAccount.state}</div>
                  <div className="mb-2"><strong>Business Hub:</strong> {viewAccount.business_hub}</div>
                  <div className="mb-2"><strong>Service Center:</strong> {viewAccount.service_center}</div>
                  <div className="mb-2"><strong>DSS:</strong> {viewAccount.dss}</div>
                  <div className="mb-2"><strong>House No:</strong> {viewAccount.house_no}</div>
                  <div className="mb-2"><strong>Full Address:</strong> {viewAccount.full_address}</div>
                  <div className="mb-2"><strong>Nearest Bus Stop:</strong> {viewAccount.nearest_bustop}</div>
                  <div className="mb-2"><strong>LGA:</strong> {viewAccount.lga}</div>
                  <div className="mb-2"><strong>Landmark:</strong> {viewAccount.landmark}</div>
                  <div className="mb-2"><strong>Type of Premise:</strong> {viewAccount.type_of_premise}</div>
                  <div className="mb-2"><strong>Use of Premise:</strong> {viewAccount.use_of_premise}</div>
                  {/* <div className="mb-2"><strong>Tariff:</strong> {viewAccount.tarrif}</div> */}
                  {/* <div className="mb-2"><strong>Latitude:</strong> {viewAccount.latitude}</div>
                  <div className="mb-2"><strong>Longitude:</strong> {viewAccount.longitude}</div> */}
                  <div className="mb-2"><strong>Account:</strong> {viewAccount.account?.surname} {viewAccount.account?.firstname} {viewAccount.account?.other_name}</div>
                  <div className="mb-2"><strong>Phone:</strong> {viewAccount.account?.phone}</div>
                  <div className="mb-2"><strong>Email:</strong> {viewAccount.account?.email}</div>
                </div>
                <div>
                  <div className="mb-2"><strong>Picture:</strong><br/>
                    {viewAccount.picture && (
                      <img src={`https://ipay.ibedc.com:7642/storage/${viewAccount.picture}`} alt="Account" className="w-40 h-40 object-cover rounded border mb-2" />
                    )}
                  </div>
                  <div className="mb-2"><strong>LECAN Link:</strong><br/>
                    {viewAccount.lecan_link && (
                      <a href={`https://ipay.ibedc.com:7642/storage/${viewAccount.lecan_link}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">View LECAN Document</a>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex justify-end mt-4">
                <button onClick={() => setViewModalOpen(false)} className="bg-gray-400 text-white px-4 py-2 rounded">Close</button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className='bg-white bg-cover h-full'>
    <motion.section 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
    className={`flex flex-col justify-center items-center mt-4 px-2 sm:px-20 ${blur || blur_01 || blur_02 ? "fixed sm:w-full" : ""}`} >
          {blur && <div className='fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm'></div>}
          {blur_01 && <div className='fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm' onClick={handleBlur_01}></div>}
          {blur_02 && <div className='fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm' onClick={handleBlur_02}></div>}
      <div className={`flex justify-center items-center top-0 relative ${!blur ? "hidden" : "block"}`}>
        <CompletePayment blur={blur} blur_01={blur_01} setBlur={setBlur} setBlur_01={setBlur_01}/>
      </div>
      <div className={`bg-slate-300 rounded-md sm:w-1/3 right-12 sm:right-0 relative ${!blur_01 ? "hidden" : "block"}`}>
      <div className='flex flex-col justify-center items-center space-y-4 p-4 sm:p-8'>
                <h1 className='text-xl sm:text-4xl font-bold text-center'>Verify Account</h1>
                <form className='flex flex-col justify-center space-y-3 xs:w-64 w-full px-4 my-4' 
                onSubmit={handleGetOutStandingBalance}
                >
                <div>
                  <label className='block text-sm font-medium text-slate-600 capitalize mb-2 mx-2 text-center'>
                      account type
                  </label>
                  <select
                    id="accountType"
                    value={accountType}
                    onChange={(e) => setAccountType(e.target.value)}
                    name="accountType"
                    required
                    className="block w-full rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-slate-600 text-sm sm:leading-6">
                    <option disabled value="">--Account Type--</option>
                    <option value="Prepaid">Prepaid</option>
                    <option value="Postpaid">Postpaid</option>
                  </select>
                </div>
                <div>
                  <label className='block text-sm font-medium text-slate-600 capitalize my-2 mx-2 text-center'>
                    meterNo/accountNo
                    <span className={validMeterAcctNo ? "valid" : "hide"}>
                      <FontAwesomeIcon icon={faCheck} />
                    </span>
                    <span className={validMeterAcctNo || !user ? "hide" : "invalid"}>
                      <FontAwesomeIcon icon={faTimes} />
                    </span>
                  </label>
                  <input
                    type="text"
                    id="meterNumber"
                    autoComplete="on"
                    value={accountType === "Postpaid" ? formattedUser : user}
                    onChange={(e) => setUser(e.target.value)}
                    required
                    aria-invalid={validMeterAcctNo ? "false" : "true"}
                    aria-describedby="uidnote"
                    onFocus={() => setUserFocus(true)}
                    onBlur={() => setUserFocus(false)}
                    name="meterNumber"
                    placeholder='Enter meter number'
                    className="block w-full rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-slate-600 text-sm sm:leading-6"
                  />
                  <p id="uidnote" className={userFocus && user && !validMeterAcctNo ? 
                    "instructions" : "offscreen"}
                  >
                    <FontAwesomeIcon icon={faInfoCircle} />
                    11 to 16 digits.<br />
                    Numbers, dashes and slashes allowed.<br />
                    No spaces.
                  </p>
                </div>
                    <div>
                    <button disabled={buttonDisabled} className={`w-full rounded-md py-1 px-6 text-sm font-semibold leading-6 shadow-sm transition duration-300 ease-in-out ${
                        (buttonDisabled)
                        ? 'w-full bg-blue-950 opacity-30 text-white cursor-not-allowed'
                        : 'w-full bg-blue-950 bg-opacity-75 text-white hover:bg-orange-500 hover:bg-opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-900'
                    }`}>
                    {!loading_01 && <p>Authenticate</p>}
                    {loading_01 && 
                    <div className='flex flex-row justify-center space-x-2'>
                        <div>
                            <svg className="w-5 h-5 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                </div>
                            <div>
                            <span class="font-medium"> Processing... </span>
                        </div>
                    </div>
                    }
                    </button>
                    </div>
                </form>
            </div>
      </div>
      <div className={`bg-slate-300 rounded-md sm:w-1/3 right-12 sm:right-0 relative ${!blur_02 ? "hidden" : "block"}`}>
      <div className='flex flex-col justify-center items-center space-y-4 p-4 sm:p-8'>
                <h1 className='text-xl sm:text-4xl font-bold text-center'>Verify it's you</h1>
                <p className=' text-center'>We've sent a verification PIN CODE to your email <span className='font-semibold text-center w-full'>{userEmail}</span></p>
                <p className='text-center'>Enter the code from the email in the field below:</p>
                <form className='flex flex-col justify-center items-center space-y-4'
                onSubmit={handleShowOutStandingBalance}
                >
                    <input 
                        id='pin'
                        type="text"
                        value={pin}
                        onChange={(e) => setPin(e.target.value)}
                        autoComplete='off'
                        required
                        placeholder="Enter PIN"
                        className="block w-1/2 rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-slate-600 text-sm sm:text-2xl text-center sm:leading-6"
                        />
                    <div>
                    <button disabled={buttonDisabled} className={`w-full rounded-md py-1 px-6 text-sm font-semibold leading-6 shadow-sm transition duration-300 ease-in-out ${
                        (buttonDisabled)
                        ? 'w-full bg-blue-950 opacity-30 text-white cursor-not-allowed'
                        : 'w-full bg-blue-950 bg-opacity-75 text-white hover:bg-orange-500 hover:bg-opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-900'
                    }`}>
                    {!loading_03 && <p>Verify</p>}
                    {loading_03 && 
                    <div className='flex flex-row justify-center space-x-2'>
                        <div>
                            <svg className="w-5 h-5 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                </div>
                            <div>
                            <span class="font-medium"> Processing... </span>
                        </div>
                    </div>
                    }
                    </button>
                    </div>
                </form>
            </div>
      </div>
      <motion.div 
        variants={heroVariants.hero_09Variants}
        initial="hidden"
        animate="visible"
      className={`flex flex-col space-y-4 sm:space-y-0 sm:flex-row justify-normal sm:space-x-4 lg:px-10 -mt-[12px] sm:mt-10 ${blur || blur_01 || blur_02 ? "hidden" : ""}`}>
        <div className='flex flex-col justify-normal space-y-4 w-full text-xs'>
            <h1 className='flex font-semibold text-lg'>Welcome! <span className='text-blue-950 opacity-80 font-semibold ml-1'>{cleanedUsername}</span></h1>
            <h1 className='flex font-semibold w-full'>Meter/Acct No: <span className='font-normal ml-1'>{meterNumber === null ? "" : meterNumber === "undefined" ? "Not yet available" : meterNumber.replace(/"/g, '')}</span></h1>
            <h1 className='flex font-semibold w-full'>Account Type: <span className='font-normal ml-1'>{account_type}</span></h1>
            <h1 className='flex font-semibold w-full'>Email: <span className='font-normal text-center ml-1'>{userEmail}</span></h1>
        </div>
        <div className='relative shadow-sm shadow-slate-500 w-full h-52 rounded-lg flex flex-col justify-center items-center'>
          <img 
            src={Frame_01}
            alt={'Frame_01'}
            className='w-full h-full object-cover rounded-lg'
            />
          <div className="absolute inset-0 rounded-lg bg-blue-950 opacity-70"></div>
          <div className='absolute flex flex-col justify-center items-center capitalize text-white'>
              <CreditCardIcon className='w-8 h-8'/>
            <p className='text-center'>outstanding balance</p>
              {account_type === "Postpaid" && <p className='sm:text-3xl font-semibold'>{userOutandingBalance === "" ? <span className='text-base'>Loading...</span> : `₦${(Number(userOutandingBalance)).toLocaleString()}`}</p>}
              {outStandingbalance === undefined || outStandingbalance === "" && <p className='text-3xl font-semibold'></p>}
              {outStandingbalance !== undefined && outStandingbalance !== "" && <p className='text-3xl font-semibold'>{`₦${(Number(outStandingbalance)).toLocaleString()}`}</p>}
              {account_type === "Prepaid" && <button onClick={handleBlur_01} className='bg-slate-300 text-slate-600 rounded-md capitalize text-sm transform duration-300 ease-in-out hover:px-2'>
              <p className='px-2'>click to view</p>
            </button>}
          </div>
        </div>
        {account_type === "Postpaid" && <div className='relative flex-grow shadow-sm shadow-slate-500 w-full h-52 rounded-lg flex flex-col justify-center items-center'>
          <img 
            src={Frame_01}
            alt={'Frame_01'}
            className='w-full h-full object-cover rounded-lg'
          />
          <div className="absolute inset-0 rounded-lg bg-blue-950 opacity-70"></div>
          <div className='absolute flex flex-col justify-center items-center capitalize text-white'>
            <BanknotesIcon className='w-8 h-8'/>
            <p>current bill</p>
            <p className='sm:text-3xl font-semibold'>{userCurrentBill === "" ? <span className='text-base'>Loading...</span> : `₦${(Number(userCurrentBill)).toLocaleString()}`}</p>
          </div>
        </div>}
        <div className='relative flex-grow shadow-sm shadow-slate-500 w-full h-52 rounded-lg flex flex-col justify-center items-center'>
        <img 
            src={Frame_01}
            alt={'Frame_01'}
            className='w-full h-full object-cover rounded-lg'
          />
          <div className="absolute inset-0 rounded-lg bg-orange-500 opacity-70"></div>
          <div className='absolute flex flex-col justify-center items-center capitalize text-white'>
          <div>
            <div className='flex flex-col justify-center items-center w-full h-6 mt-2'>
              <h2 className='font-semibold text-slate-700 opacity-75'>Account details</h2>
              <hr className='w-4/5 border-1 border-black'/>
            </div>
            {/* <h1 className='mt-10 font-semibold text-xl text-center'>Not yet Available</h1> */}
            {/* <div className='flex justify-center'>
              <Link to={""} className='px-4 font-semibold text-lg mt-2 bg-slate-500 text-slate-200 rounded-md capitalize hover:bg-orange-500 opacity-75 transform duration-300 ease-in-out sm:py-2'>
                fund wallet
              </Link>
            </div> */}
            <ul className='text-sm capitalize mt-4 flex justify-center items-center italic font-semibold mb-2'>
              <li className='text-center'>account NO:<br /> <span className='text-4xl not-italic font-normal'>{accountNo === "undefined" ? " " : accountNo}</span></li>
            </ul>
            <ul className='text-sm capitalize m-2 flex justify-between items-center italic font-semibold mb-2 px-4 gap-4'>
              <li className='text-center'>account name:<br /> <span className='not-italic font-normal'>{accountName === "undefined" ? " " : accountName}</span></li>
              <li className='text-center'>bank name:<br /> <span className='not-italic font-normal'>{bankName === "undefined" ? " " : bankName}</span></li>
            </ul>
            {/* <ul className='text-sm capitalize flex justify-center items-center italic font-semibold mb-2'>
              <li className='text-center'>email:<br /> <span className='not-italic font-normal'>{customerEmail === "undefined" ? " " : customerEmail}</span></li>
            </ul> */}
          </div>
            {/* <PhoneIcon className='w-8 h-8'/>
            <p>need help:</p>
            <p className='lg:text-2xl font-semibold text-center'>call: 07001239999</p> */}
          </div>
        </div>
        <div className='relative flex-grow shadow-sm shadow-slate-500 w-full h-52 rounded-lg flex flex-col justify-center items-center'>
        <img 
            src={Frame_01}
            alt={'Frame_01'}
            className='w-full h-full object-cover rounded-lg'
          />
          <div className="absolute inset-0 rounded-lg bg-blue-950 opacity-70"></div>
          <div className='absolute flex flex-col justify-center items-center gap-4 capitalize text-white'>
            {status === "active" && <WalletIcon className='w-8 h-8'/>}
            {status === "active" && <p>wallet balance</p>}
            {status === "undefined" && <p className='text-center'>Click on the button below to create a new virtual account</p>}
            {status === "active" && loading && 
            <div className={`flex flex-col justify-center items-center ${blur ? "hidden" : ""}`}>
                <div>
                    <svg className={`w-5 h-5 animate-spin  text-white ${blur_01 ? "hidden" : ""}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        {!blur_01 && <circle className={`${!blur_01 ? "opacity-25" : ""}`} cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>}
                        {blur && <circle className={`${!blur ? "opacity-25" : ""}`} cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>}
                            {!blur_01 && <path className={`${!blur_01 ? "opacity-75" : ""}`} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>}
                            {blur && <path className={`${!blur ? "opacity-75" : ""}`} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>}
                            </svg>
                        </div>
                    <div>
                </div>
            </div>
            }
            {!loading && status === "active" && <p className='font-semibold text-3xl -mt-4'>{`₦${(Number(wallet_amount)).toLocaleString()}`}</p>}
            {status === "undefined" && <button onClick={handleCreateAccountClick} className='bg-slate-300 text-slate-600 font-bold rounded-md capitalize text-sm transform duration-300 ease-in-out w-2/3 p-4'>
              <p className='px-2'>Create a new virtual account</p>
            </button>}
            <VirtualAccountModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
            {/* {!loading && <p className='text-4xl font-semibold'>₦ {walletBalance}</p>} */}
          </div>
        </div>
      </motion.div>
      <motion.div 
        variants={heroVariants.hero_10Variants}
        initial="hidden"
        animate="visible"
      className='flex flex-col space-y-4 sm:space-y-0 sm:flex-row justify-center sm:space-x-4 lg:px-10 my-8 sm:my-10 w-full'>
        <div className='shadow-sm shadow-slate-500 w-full sm:w-3/4 rounded-lg'>
          <div className='flex justify-between items-center shadow-sm shadow-slate-500 rounded-t-lg capitalize text-lg font-semibold px-4 py-2'>
            <h2 className='text-slate-600'>make payment</h2>
            {blur &&<span className={`bg-blue-950 ${!blur ? "opacity-90" : ""} px-2 text-3xl text-slate-200 w-12 h-10 rounded-lg text-center`}>₦</span>}
            {blur_01 && <span className={`bg-blue-950 ${!blur_01 ? "opacity-90" : ""} px-2 text-3xl text-slate-200 w-12 h-10 rounded-lg text-center`}>₦</span>}
          </div>
          <PaymentForm blur={blur} blur_01={blur_01} setBlur={setBlur} setBlur_01={setBlur_01} />
        </div>
        <div className='shadow-sm shadow-slate-500 w-full rounded-lg flex flex-col justify-normal text-center space-y-4 pb-4'>
          <div className='flex justify-between items-center w-full h-5 text-sm py-5 font-semibold shadow-sm shadow-slate-500 rounded-t-md px-2 text-slate-600'>
            <p className='sm:h-5'>Transaction History</p>
            <Link to={"/default/alltransactions"} className='hover:underline cursor-pointer h-5 flex justify-center items-center font-medium'>
              View all <span className='hidden sm:block ml-1'>transactions</span> 
              <span className='mx-2'>
                <img src={VectorIcon} alt='vector' className='w-3'/>
              </span>
            </Link>
          </div>
          {loading && 
            <div className={`flex flex-row justify-center space-x-2 ${blur ? "hidden" : ""}`}>
                <div>
                    <svg className={`w-5 h-5 animate-spin  text-white ${blur_01 ? "hidden" : ""}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        {!blur_01 && <circle className={`${!blur_01 ? "opacity-25" : ""}`} cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>}
                        {blur && <circle className={`${!blur ? "opacity-25" : ""}`} cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>}
                            {!blur_01 && <path className={`${!blur_01 ? "opacity-75" : ""}`} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>}
                            {blur && <path className={`${!blur ? "opacity-75" : ""}`} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>}
                            </svg>
                        </div>
                    <div>
                    <span class="font-medium"> Processing... </span>
                </div>
            </div>
          }
          {!loading && transactionHistory.length === 0 && 
            <div className='flex flex-row justify-center items-center rounded-lg px-4 py-2 mx-2 shadow-sm shadow-gray-500'>
              <h4 className='text-gray-800 opacity-75 tracking-tighter'>No transaction history</h4>
            </div>
          }
          {!loading && transactionHistory.length > 0 ? transactionHistory.map((transaction) => (
            <div className={`flex flex-row justify-between items-center rounded-lg px-4 py-2 mx-2 shadow-sm shadow-gray-500 ${blur || blur_02 ? "hidden" : ""}`}>
              <div className='text-blue-900'>
                {account_type === "Prepaid" && <h4 className='tracking-tighter text-left'>Amount paid: <span className='font-bold md:text-lg'>&#8358;{(Number(transaction.Amount)).toLocaleString()}</span></h4>}
                {account_type === "Postpaid" && <h4 className='tracking-tighter text-left'>Amount paid: <span className='font-bold md:text-lg'>&#8358;{(Number(transaction.Payments)).toLocaleString()}</span></h4>}
                {account_type === "Prepaid" && !blur_01 && !isModalOpen && <h4 className={`font-semibold text-sm text-gray-800 ${!blur_01 ? "opacity-75" : ""} tracking-tighter text-left`}>
                  Date: 
                  <span className='font-normal'>
                  {transaction.TransactionDateTime ? 
                            `${transaction.TransactionDateTime.slice(8,10)}-${transaction.TransactionDateTime.slice(5,7)}-${transaction.TransactionDateTime.slice(0,4)} | ${transaction.TransactionDateTime.slice(10,16)}` : 
                            "N/A" // Fallback if date_entered is undefined
                        }
                    {/* {`${transaction.date_entered.slice(8,10)}-${transaction.date_entered.slice(5,7)}-${transaction.date_entered.slice(0,4)}`} | {transaction.date_entered.slice(10,16)} */}
                  </span> 
                  {blur && <span className={`lowercase mx-1 ${!blur ? "opacity-90" : ""}`}>{transaction.status === "failed" && <span className="text-red-500">{transaction.status}</span>}</span>}
                  {blur && <span className={`lowercase mx-1 ${!blur ? "opacity-90" : ""}`}>{transaction.status === "processing" && <span className="text-yellow-500">{transaction.status}</span>}</span>}
                  {blur && <span className={`lowercase mx-1 ${!blur ? "opacity-90" : ""}`}>{transaction.status === "success" && <span className="text-green-500">{transaction.status}</span>}</span>}
                  {!blur_01 && <span className={`lowercase mx-1 ${!blur_01 ? "opacity-90" : ""}`}>{transaction.status === "failed" && <span className="text-red-500">{transaction.status}</span>}</span>}
                  {!blur_01 && <span className={`lowercase  mx-1 ${!blur_01 ? "opacity-90" : ""}`}>{transaction.status === "processing" && <span className="text-yellow-500">{transaction.status}</span>}</span>}
                  {!blur_01 && <span className={`lowercase  mx-1 ${!blur_01 ? "opacity-90" : ""}`}>{transaction.status === "success" && <span className="text-green-500">{transaction.status}</span>}</span>}
                </h4>}
                {account_type === "Postpaid" && !blur_01 && !isModalOpen && <h4 className={`font-semibold text-sm text-gray-800 ${!blur_01 ? "opacity-75" : ""} tracking-tighter text-left`}>
                  Date: 
                  <span className='font-normal'>
                  {transaction.PayDate ? 
                            `${transaction.PayDate.slice(8,10)}-${transaction.PayDate.slice(5,7)}-${transaction.PayDate.slice(0,4)} | ${transaction.PayDate.slice(10,16)}` : 
                            "N/A" // Fallback if date_entered is undefined
                        }
                    {/* {`${transaction.date_entered.slice(8,10)}-${transaction.date_entered.slice(5,7)}-${transaction.date_entered.slice(0,4)}`} | {transaction.date_entered.slice(10,16)} */}
                  </span> 
                  {blur && <span className={`lowercase mx-1 ${!blur ? "opacity-90" : ""}`}>{transaction.status === "failed" && <span className="text-red-500">{transaction.status}</span>}</span>}
                  {blur && <span className={`lowercase mx-1 ${!blur ? "opacity-90" : ""}`}>{transaction.status === "processing" && <span className="text-yellow-500">{transaction.status}</span>}</span>}
                  {blur && <span className={`lowercase mx-1 ${!blur ? "opacity-90" : ""}`}>{transaction.status === "success" && <span className="text-green-500">{transaction.status}</span>}</span>}
                  {!blur_01 && <span className={`lowercase mx-1 ${!blur_01 ? "opacity-90" : ""}`}>{transaction.status === "failed" && <span className="text-red-500">{transaction.status}</span>}</span>}
                  {!blur_01 && <span className={`lowercase  mx-1 ${!blur_01 ? "opacity-90" : ""}`}>{transaction.status === "processing" && <span className="text-yellow-500">{transaction.status}</span>}</span>}
                  {!blur_01 && <span className={`lowercase  mx-1 ${!blur_01 ? "opacity-90" : ""}`}>{transaction.status === "success" && <span className="text-green-500">{transaction.status}</span>}</span>}
                </h4>}
              </div>
              {blur &&<Link to={`/default/transactionviewdetails/${transaction.TransactionNo}`} className={`bg-blue-950 ${!blur ? "opacity-75" : ""} rounded-lg text-xs sm:text-sm text-white text-center capitalize px-2 py-1 sm:px-4 sm:py-2 hover:bg-orange-500 duration-300 ease-in-out`}>view</Link>}
              {!blur_01 && account_type === "Prepaid" && <Link to={`/default/transactionviewdetails/${transaction.TransactionNo}`} className={`bg-blue-950 ${!blur_01 ? "opacity-75" : ""} rounded-lg text-xs sm:text-sm text-white text-center capitalize px-2 py-1 sm:px-4 sm:py-2 hover:bg-orange-500 duration-300 ease-in-out`}>view</Link>}
              {!blur_01 && account_type === "Postpaid" && <Link to={`/default/transactionviewdetails/${transaction.PaymentID}`} className={`bg-blue-950 ${!blur_01 ? "opacity-75" : ""} rounded-lg text-xs sm:text-sm text-white text-center capitalize px-2 py-1 sm:px-4 sm:py-2 hover:bg-orange-500 duration-300 ease-in-out`}>view</Link>}
            </div>
          )).slice(0,7) : null}
        </div>
      </motion.div>
      <motion.div 
        variants={heroVariants.hero_11Variants}
        initial="hidden"
        animate="visible"
      className={`flex flex-col sm:flex-row justify-center sm:space-x-4 lg:px-10 sm:my-10 w-full ${blur && 'hidden'}`}>
        <div className='relative shadow-sm shadow-slate-500 w-3/4 rounded-lg flex justify-center items-center hidden sm:block'>
          <div className='absolute inset-0 bg-gradient-to-t from-orange-500 opacity-80 rounded-lg from-0%'></div>
          <img
            src={Advert_01}
            alt='advert_01'
            className={"h-52 w-full rounded-lg"}
           />
        </div>
        <div className='shadow-sm shadow-slate-500 w-full rounded-lg flex flex-col-reverse sm:flex-row sm:space-x-2 mb-4 sm:mb-0'>
          <div className='shadow-sm shadow-slate-500 sm:w-3/4 rounded-l-lg flex flex-col  mt-2 sm:mt-0 pb-2 sm:pb-0'>
            <div className='flex flex-col justify-center items-center w-full h-6 mt-2'>
              <h2 className='font-semibold text-slate-700 opacity-75'>Account details</h2>
              <hr className='w-4/5 border-1 border-black'/>
            </div>
            {/* <h1 className='mt-10 font-semibold text-xl text-center'>Not yet Available</h1> */}
            {/* <div className='flex justify-center'>
              <Link to={""} className='px-4 font-semibold text-lg mt-2 bg-slate-500 text-slate-200 rounded-md capitalize hover:bg-orange-500 opacity-75 transform duration-300 ease-in-out sm:py-2'>
                fund wallet
              </Link>
            </div> */}
            <ul className='text-sm capitalize mt-4 flex justify-center items-center italic font-semibold mb-2'>
              <li className='text-center'>account name:<br /> <span className='not-italic font-normal'>{accountName === "undefined" ? " " : accountName}</span></li>
            </ul>
            <ul className='text-sm capitalize m-2 flex justify-between items-center italic font-semibold mb-2 px-4'>
              <li className='text-center'>account NO:<br /> <span className='not-italic font-normal'>{accountNo === "undefined" ? " " : accountNo}</span></li>
              <li className='text-center'>bank name:<br /> <span className='not-italic font-normal'>{bankName === "undefined" ? " " : bankName}</span></li>
            </ul>
            <ul className='text-sm capitalize flex justify-center items-center italic font-semibold mb-2'>
              <li className='text-center'>email:<br /> <span className='not-italic font-normal'>{customerEmail === "undefined" ? " " : customerEmail}</span></li>
            </ul>
          </div>
          <div className='shadow-sm shadow-slate-500 w-full rounded-r-lg'>
            <ul className='flex justify-between text-sm p-1 capitalize font-semibold text-slate-600'>
              <li>wallet history</li>
              <Link to={""} className='hover:underline'>
                <li>view all</li>
              </Link>
            </ul>
            {loading_02 && 
            <div className={`flex flex-row justify-center space-x-2 ${blur ? "hidden" : ""}`}>
                <div>
                    <svg className={`w-5 h-5 animate-spin  text-white ${blur_01 ? "hidden" : ""}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        {!blur_01 && <circle className={`${!blur_01 ? "opacity-25" : ""}`} cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>}
                        {blur && <circle className={`${!blur ? "opacity-25" : ""}`} cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>}
                            {!blur_01 && <path className={`${!blur_01 ? "opacity-75" : ""}`} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>}
                            {blur && <path className={`${!blur ? "opacity-75" : ""}`} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>}
                            </svg>
                        </div>
                    <div>
                    <span class="font-medium"> Processing... </span>
                </div>
            </div>
            }
            {/* {!loading_02 && walletHistory.length === 0 &&
            <div className='flex flex-row justify-center items-center rounded-lg px-4 py-2 mx-2 shadow-sm shadow-gray-500'>
              <h4 className='text-gray-800 opacity-75 tracking-tighter text-center'>This update is not yet available </h4>
            </div>
             } */}
            {!loading_02 && walletHistory.length > 0 &&
            <div>
              {walletHistory.map((wallHistory) => ( 
              <div className='shadow-sm shadow-slate-500 rounded-md m-2 flex justify-between items-center p-2'>
                <div>
                  <>
                    <p className='text-xs capitalize'>amount paid: <span>&#8358;{(Number(wallHistory.price)).toLocaleString()}</span></p>
                    <p className='text-xs capitalize'>date: <span>{`${wallHistory.created_at.slice(8,10)}-${wallHistory.created_at.slice(5,7)}-${wallHistory.created_at.slice(0,4)}`} | {wallHistory.created_at.slice(11,16)}</span></p>
                  </>
                </div>
                <div className='bg-blue-950 opacity-75 flex justify-center items-center rounded-md cursor-pointer text-xs px-2 py-1 text-white hover:bg-orange-500 transform duration-300 ease-in-out'>
                  <Link to={""}>view</Link>
                </div>
              </div>
              )).slice(0, 3)}
            </div>
            }
            {!loading_02 && walletHistory.length <= 0 && 
              <p className='text-center my-5'>No Wallet History Yet!</p>
            }
          </div>
        </div>
      </motion.div>
    </motion.section>
    </div>
  )
}

// Helper functions for DTM status
const isPending = (acc) => acc.picture === "0" || acc.latitude === "0" || acc.longitude === "0";
const isValidated = (acc) => acc.picture !== "0" && acc.latitude !== "0" && acc.longitude !== "0";

function ValidateAccountModal({ account, onClose, onValidated }) {
  const [picture, setPicture] = useState(null);
  const [latitude, setLatitude] = useState(account.latitude);
  const [longitude, setLongitude] = useState(account.longitude);
  const [submitting, setSubmitting] = useState(false);
  const [captured, setCaptured] = useState(false);
  const [dssList, setDssList] = useState([]);
  const [selectedDss, setSelectedDss] = useState('');
  const [tariffList, setTariffList] = useState([]);
  const [selectedTariff, setSelectedTariff] = useState('');
  const [allBusinessHubs, setAllBusinessHubs] = useState([]);
  const [regionForHub, setRegionForHub] = useState(account.region);
  const [serviceCenters, setServiceCenters] = useState([]);
  const [selectedServiceCenter, setSelectedServiceCenter] = useState('');
  const webcamRef = React.useRef(null);

  // Fetch all business hubs on mount
  useEffect(() => {
    const fetchAllBusinessHubs = async () => {
      try {
        const res = await axiosClient.get('/V4IBEDC_new_account_setup_sync/initiate/all_business_hub');
        setAllBusinessHubs(res.data.payload.business_hubs || []);
      } catch (e) {
        setAllBusinessHubs([]);
      }
    };
    fetchAllBusinessHubs();
  }, []);

  // Set region for selected business hub
  useEffect(() => {
    if (allBusinessHubs.length > 0 && account.business_hub) {
      const found = allBusinessHubs.find(
        hub => hub.Business_Hub.trim().toLowerCase() === account.business_hub.trim().toLowerCase()
      );
      if (found) {
        // Remove 'REGION' (case-insensitive) and trim whitespace
        const cleanRegion = (found.Region || account.region || '').replace(/region/i, '').trim();
        setRegionForHub(cleanRegion);
      }
    }
  }, [allBusinessHubs, account.business_hub, account.region]);

  // Fetch DSS and Tariff only after regionForHub is set
  useEffect(() => {
    if (!regionForHub || !account.business_hub || !account.service_center) return;
    // Fetch DSS
    const fetchDss = async () => {
      try {
        const url = `/V4IBEDC_new_account_setup_sync/initiate/get_dss?region=${encodeURIComponent(regionForHub)}&hub=${encodeURIComponent(account.business_hub)}&service_center=${encodeURIComponent(account.service_center)}`;
        const res = await axiosClient.get(url);
        setDssList(res.data.payload.dss || []);
      } catch (e) {
        setDssList([]);
      }
    };
    // Fetch Tariff
    const fetchTariff = async () => {
      try {
        const res = await axiosClient.get('/V4IBEDC_new_account_setup_sync/initiate/get_tarriff');
        setTariffList(res.data.payload.tarriff || []);
      } catch (e) {
        setTariffList([]);
      }
    };
    fetchDss();
    fetchTariff();
  }, [regionForHub, account.business_hub, account.service_center]);

  // Fetch service centers when business hub changes
  useEffect(() => {
    if (!account.business_hub) return;
    const fetchServiceCenters = async () => {
      try {
        const url = `/V4IBEDC_new_account_setup_sync/initiate/service_centers/${encodeURIComponent(account.business_hub)}`;
        const res = await axiosClient.get(url);
        setServiceCenters(res.data.payload.service_center || []);
      } catch (e) {
        setServiceCenters([]);
      }
    };
    fetchServiceCenters();
  }, [account.business_hub, regionForHub]);

  // Handler for capturing photo and location
  const handleCapturePhoto = () => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      setPicture(imageSrc);
      setCaptured(true);
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            setLatitude(pos.coords.latitude);
            setLongitude(pos.coords.longitude);
          },
          (err) => alert('Location error: ' + err.message)
        );
      }
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    const authority = localStorage.getItem('AUTHORITY');
    const code = authority === 'dtm'
      ? localStorage.getItem('TOKEN')
      : account.email;
    const formData = new FormData();
    formData.append('tracking_id', account.tracking_id);
    // Convert base64 image to blob for upload
    if (picture) {
      const res = await fetch(picture);
      const blob = await res.blob();
      formData.append('picture', blob, 'capture.jpg');
    }
    formData.append('latitude', latitude);
    formData.append('longitude', longitude);
    formData.append('region', regionForHub);
    formData.append('business_hub', account.business_hub);
    formData.append('service_center', selectedServiceCenter);
    formData.append('dss', selectedDss);
    formData.append('id', account.id);
    formData.append('tarrif', selectedTariff);
    formData.append('code', code);
    formData.append('email', account.account.email);
    try {
      await axiosClient.post('/V4IBEDC_new_account_setup_sync/initiate/process_account', formData);
      toast.success('Account validated!');
      if (typeof onValidated === 'function') onValidated();
      if (typeof onClose === 'function') onClose();
    } catch (e) {
      toast.error('Validation failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-lg w-full max-w-2xl">
        <h2 className="font-bold mb-4">Validate Account</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Column 1 */}
          <div>
            <div className="mb-2">Tracking ID: <span className="font-mono">{account.tracking_id}</span></div>
            <div className="mb-2">Region: {regionForHub}</div>
            <div className="mb-2">Business Hub: {account.business_hub}</div>
            <div className="mb-2">
              <label>Service Center:</label>
              <select
                value={selectedServiceCenter}
                onChange={e => setSelectedServiceCenter(e.target.value)}
                className="block w-full border rounded p-1"
                required
                disabled={serviceCenters.length === 0}
              >
                <option value="">Select Service Center</option>
                {serviceCenters.map(sc => (
                  <option key={sc.DSS_11KV_415V_Owner} value={sc.DSS_11KV_415V_Owner}>{sc.DSS_11KV_415V_Owner}</option>
                ))}
              </select>
            </div>
            <div className="mb-2">
              <label>DSS:</label>
              <select
                value={selectedDss}
                onChange={e => setSelectedDss(e.target.value)}
                className="block w-full border rounded p-1"
                required
              >
                <option value="">Select DSS</option>
                {dssList.map(dss => (
                  <option key={dss.Assetid} value={dss.Assetid}>
                    {dss.DSS_11KV_415V_Name} ({dss.DSS_11KV_415V_Address})
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-2">
              <label>Tariff:</label>
              <select
                value={selectedTariff}
                onChange={e => setSelectedTariff(e.target.value)}
                className="block w-full border rounded p-1"
                required
              >
                <option value="">Select Tariff</option>
                {tariffList.map(tariff => (
                  <option key={tariff.TariffID} value={tariff.TariffID}>
                    {tariff.Description}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-2">Email: {account.account.email}</div>
            <div className="mb-2">ID: {account.id}</div>
          </div>
          {/* Column 2 */}
          <div>
            <div className="mb-2">
              <label>Picture (real-time capture):</label>
              {!captured ? (
                <>
                  <Webcam
                    audio={false}
                    ref={webcamRef}
                    screenshotFormat="image/jpeg"
                    width={320}
                    height={240}
                    videoConstraints={{ facingMode: 'environment' }}
                    className="rounded border"
                  />
                  <button
                    type="button"
                    onClick={handleCapturePhoto}
                    className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
                  >
                    Capture Building
                  </button>
                </>
              ) : (
                <div className="mb-2">
                  <img
                    src={picture}
                    alt="Preview"
                    className="w-32 h-32 object-cover rounded"
                  />
                  <button
                    type="button"
                    onClick={() => { setCaptured(false); setPicture(null); }}
                    className="bg-gray-400 text-white px-2 py-1 rounded mt-2 ml-2"
                  >
                    Retake
                  </button>
                </div>
              )}
            </div>
            <div className="mb-2">Latitude: {latitude}</div>
            <div className="mb-2">Longitude: {longitude}</div>
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={handleSubmit}
            disabled={submitting || !picture || !latitude || !longitude || !selectedDss || !selectedTariff || !selectedServiceCenter}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            {submitting ? 'Submitting...' : 'Submit'}
          </button>
          <button
            onClick={typeof onClose === 'function' ? onClose : undefined}
            className="bg-gray-300 px-4 py-2 rounded"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
