import React, { useEffect, useState, useRef } from 'react'
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

// const transactionHistoryUrl = "/V2_ibedc_OAUTH_tokenReviwed/history/other-history";
const transactionHistoryUrl = "/V3_OUTRIBD_iOAUTH_markedxMONITOR/history/get-history";
const billHistoryOutstandingBalanceUrl = "/V3_OUTRIBD_iOAUTH_markedxMONITOR/history/get-bill-history";
// const billHistoryOutstandingBalanceUrl = "/V2_ibedc_OAUTH_agency_sync/customerhistory/bill-history";
// const getCustomerDetailsUrl = "/dashboard/get-details";
const getOutstandingBalanceUrl = "/V3_OUTRIBD_iOAUTH_markedxMONITOR/outstanding/get-balance";
const showOutstandingBalanceUrl = "/V3_OUTRIBD_iOAUTH_markedxMONITOR/outstanding/show-balance";
const getWalletBalance_HistoryUrl = "/V3_OUTRIBD_iOAUTH_markedxMONITOR/wallet/wallet-balance-history";
const METER_ACCT_NUMBER_REGEX = /^[0-9\-/]{11,16}$/;


export default function CustomerDashboard() {

  const userEmail = localStorage.getItem("USER_EMAIL");
  const username = localStorage.getItem("USER_NAME");
  const account_type = localStorage.getItem("LOGIN_ACCOUNT_TYPE") || localStorage.getItem("ACCOUNT_TYPE");
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
  const [dtmPagination, setDtmPagination] = useState({
    current_page: 1,
    last_page: 1,
    total: 0,
    per_page: 10,
    from: 0,
    to: 0
  });
  const navigate = useNavigate();

  const [validateModalOpen, setValidateModalOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);

  const [serviceCenters, setServiceCenters] = useState([]);
  const [selectedServiceCenter, setSelectedServiceCenter] = useState('');

  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [viewAccount, setViewAccount] = useState(null);
  
  // Add allBusinessHubs state for both validation modal and view modal
  const [allBusinessHubs, setAllBusinessHubs] = useState([]);
  
  // Add allRegions state
  const [allRegions, setAllRegions] = useState([]);
  
  // Add rejection modal state
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectingAccount, setRejectingAccount] = useState(null);
  const [rejectComment, setRejectComment] = useState('');
  const [rejecting, setRejecting] = useState(false);

  // DTM final approval processing state
  const [approving, setApproving] = useState(false);

  const [viewOutstandingModal, setViewOutstandingModal] = useState(false);

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
        // updated API response expects transactions at response.data.payload.data
        const response = await axiosClient.get(transactionHistoryUrl);
        const fetchedData = response?.data?.payload?.data || [];

        setTransactionHistory(fetchedData);
        localStorage.setItem('TRANSACTION_HISTORY', JSON.stringify(fetchedData));
      }catch(error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
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

  // Fetch all regions
  useEffect(() => {
    const fetchAllRegions = async () => {
      try {
        const res = await axiosClient.get('/V4IBEDC_new_account_setup_sync/initiate/new/regions');
        console.log("Regions response:", res.data);
        setAllRegions(res.data || []);
      } catch (e) {
        console.error("Error fetching regions:", e);
        setAllRegions([]);
      }
    };
    fetchAllRegions();
  }, []);

  // Fetch all business hubs for region derivation
  useEffect(() => {
    const fetchAllBusinessHubs = async () => {
      try {
        const res = await axiosClient.get('/V4IBEDC_new_account_setup_sync/initiate/new/business_hub');
        console.log("Business hubs response:", res.data);
        setAllBusinessHubs(res.data || []);
      } catch (e) {
        setAllBusinessHubs([]);
      }
    };
    fetchAllBusinessHubs();
  }, []);

  useEffect(() => {
    if (authority === 'dtm') {
      const fetchPendingAccounts = async (page = 1) => {
        setDtmLoading(true);
        try {
          const response = await axiosClient.get(`/V4IBEDC_new_account_setup_sync/initiate/get_pending_account?page=${page}`);
          const accountsData = response?.data?.payload?.accounts;
          const accounts = accountsData?.data || [];
          
          setDtmPendingAccounts(accounts);
          
          // Set pagination info
          setDtmPagination({
            current_page: accountsData?.current_page || 1,
            last_page: accountsData?.last_page || 1,
            total: accountsData?.total || 0,
            per_page: accountsData?.per_page || 10,
            from: accountsData?.from || 0,
            to: accountsData?.to || 0
          });
          
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
      fetchPendingAccounts(dtmPage);
    }
  }, [authority, dtmPage]);

  // Handle page change
  const handlePageChange = (newPage) => {
    setDtmPage(newPage);
  };

  // DTM action handlers
  const handleReject = (account) => {
    // Prevent rejection of DTE-validated accounts
    if (account.dss && account.dss !== null && account.tarrif && account.tarrif !== null) {
      toast.error("Cannot reject: This application has been validated by DTE and cannot be rejected.");
      return;
    }
    setRejectingAccount(account);
    setRejectModalOpen(true);
  };

  const handleRejectSubmit = async () => {
    if (!rejectComment.trim()) {
      toast.error("Please provide a reason for rejection");
      return;
    }
    
    // Prevent rejection of DTE-validated accounts
    if (rejectingAccount && rejectingAccount.dss && rejectingAccount.dss !== null && rejectingAccount.tarrif && rejectingAccount.tarrif !== null) {
      toast.error("Cannot reject: This application has been validated by DTE and cannot be rejected.");
      setRejectModalOpen(false);
      setRejectComment('');
      setRejectingAccount(null);
      return;
    }
    
    setRejecting(true);
    try {
      const payload = {
        tracking_id: rejectingAccount.tracking_id,
        type: 'reject',
        comment: rejectComment.trim(),
        id: String(rejectingAccount.id)
      };
      
      await axiosClient.post('/V4IBEDC_new_account_setup_sync/initiate/approve_request', payload);
      setDtmPendingAccounts(prev => prev.filter(acc => acc.id !== rejectingAccount.id));
      toast.success("Application rejected successfully.");
      setRejectModalOpen(false);
      setRejectComment('');
      setRejectingAccount(null);
    } catch (e) {
      toast.error("Failed to reject application: " + (e.response?.data?.payload || e.payload));
    } finally {
      setRejecting(false);
    }
  };

  const handleApprove = async (account) => {
    setApproving(true);
    try {
      const payload = {
        tracking_id: account.tracking_id,
        type: 'approve',
        comment: 'approve',
        id: String(account.id)
      };
      await axiosClient.post('/V4IBEDC_new_account_setup_sync/initiate/approve_request', payload);
      setDtmPendingAccounts(prev => prev.filter(acc => acc.id !== account.id));
      toast.success('Application approved successfully.');
    } catch (e) {
      toast.error('Failed to approve application: ' + (e.response?.data?.payload?.comment || e.payload?.comment || e.message));
    } finally {
      setApproving(false);
    }
  };

  // Removed approve modal submission; approval happens immediately in handleApprove

  const handleValidate = (id) => {
    // Placeholder for validation logic
    toast.info("Validate action coming soon.");
  };

  // DTM Dashboard rendering
  if (authority === 'dtm') {
    // Use pagination from API response
    const dtmTotalPages = dtmPagination.last_page;
    const dtmPaginatedAccounts = dtmPendingAccounts; // Already paginated by API
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
                      {(isPending(acc) || needsCustomerDtmValidation(acc)) && <button className="bg-green-500 text-white px-3 py-1 rounded font-semibold text-xs" onClick={() => { setSelectedAccount(acc); setValidateModalOpen(true); }}>Validate</button>}
                      {isPending(acc) && !isDteValidated(acc) && (
                        <button
                          className={`px-3 py-1 rounded font-semibold text-xs flex items-center justify-center min-w-[70px] ${
                            acc.lecan_link && acc.lecan_link !== "0" 
                              ? "bg-red-500 text-white" 
                              : "bg-gray-400 text-gray-600 cursor-not-allowed"
                          }`}
                          onClick={() => acc.lecan_link && acc.lecan_link !== "0" ? handleReject(acc) : null}
                          disabled={!acc.lecan_link || acc.lecan_link === "0"}
                          title={!acc.lecan_link || acc.lecan_link === "0" ? "Cannot reject: Licensed contractor form missing" : ""}
                        >
                          Reject
                        </button>
                      )}
                      {isValidated(acc) && !needsCustomerDtmValidation(acc) && (
                        <div className="flex items-center gap-2">
                          <span className="text-green-600 font-semibold">Validated</span>
                          {/* DTM can do final approval or reject */}
                          <button
                            className="bg-green-600 text-white px-3 py-1 rounded font-semibold text-xs"
                            onClick={() => handleApprove(acc)}
                          >
                            Final Approve
                          </button>
                          {/* Only show reject button if account is NOT DTE-validated */}
                          {!isDteValidated(acc) && (
                            <button
                              className={`px-3 py-1 rounded font-semibold text-xs ${
                                acc.lecan_link && acc.lecan_link !== "0" 
                                  ? "bg-red-600 text-white" 
                                  : "bg-gray-400 text-gray-600 cursor-not-allowed"
                              }`}
                              onClick={() => acc.lecan_link && acc.lecan_link !== "0" ? handleReject(acc) : null}
                              disabled={!acc.lecan_link || acc.lecan_link === "0"}
                              title={!acc.lecan_link || acc.lecan_link === "0" ? "Cannot reject: Licensed contractor form missing" : ""}
                            >
                              Reject
                            </button>
                          )}
                        </div>
                      )}
                      <button className="bg-blue-500 text-white px-3 py-1 rounded font-semibold text-xs" onClick={() => { setViewAccount(acc); setViewModalOpen(true); }}>View</button>
                    </div>
                  </div>
                ))}
                {/* Pagination Controls */}
                {dtmTotalPages > 1 && (
                  <div className="flex justify-center items-center gap-2 mt-4">
                    <button
                      onClick={() => handlePageChange(Math.max(dtmPage - 1, 1))}
                      disabled={dtmPage === 1}
                      className="px-3 py-1 rounded bg-gray-200 text-gray-700 font-semibold disabled:opacity-50"
                    >
                      Prev
                    </button>
                    <span className="font-semibold">
                      Page {dtmPagination.current_page} of {dtmPagination.last_page} 
                      ({dtmPagination.from}-{dtmPagination.to} of {dtmPagination.total} total)
                    </span>
                    <button
                      onClick={() => handlePageChange(Math.min(dtmPage + 1, dtmPagination.last_page))}
                      disabled={dtmPage === dtmPagination.last_page}
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
            allBusinessHubs={allBusinessHubs}
            allRegions={allRegions}
          />
        )}
        {viewModalOpen && viewAccount && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded shadow-lg w-full max-w-2xl overflow-y-auto max-h-[90vh]">
              <h2 className="font-bold mb-4 text-lg">Account Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="mb-2"><strong>Tracking ID:</strong> {viewAccount.tracking_id}</div>
                  <div className="mb-2"><strong>Region:</strong> {(() => {
                    // Try to get region from viewAccount.region first, if null, derive from business hub
                    if (viewAccount.region) {
                      return viewAccount.region;
                    }
                    // Find the business hub in allBusinessHubs to get its region
                    if (allBusinessHubs.length > 0 && viewAccount.business_hub) {
                      const found = allBusinessHubs.find(
                        hub => hub.businesshub.trim().toLowerCase() === viewAccount.business_hub.trim().toLowerCase()
                      );
                      if (found && found.Region) {
                        return found.Region.replace(/region/i, '').trim();
                      }
                    }
                    return 'Not specified';
                  })()}</div>
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
                  <div className="mb-2"><strong>License Electrical Contractor Link:</strong><br/>
                    {viewAccount.lecan_link && (
                      <a href={`https://ipay.ibedc.com:7642/storage/${viewAccount.lecan_link}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">View License Electrical Contractor Document</a>
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
        
        {/* Final Approval Modal removed per requirement — approval processes immediately on click */}

        {/* Rejection Modal */}
        {rejectModalOpen && rejectingAccount && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded shadow-lg w-full max-w-md mx-4">
              <h2 className="font-bold mb-4 text-lg text-red-600">Reject Application</h2>
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">
                  <strong>Tracking ID:</strong> {rejectingAccount.tracking_id}
                </p>
                <p className="text-sm text-gray-600 mb-2">
                  <strong>Customer:</strong> {rejectingAccount.account?.surname} {rejectingAccount.account?.firstname} {rejectingAccount.account?.other_name}
                </p>
                <p className="text-sm text-gray-600 mb-2">
                  <strong>Address:</strong> {rejectingAccount.full_address}
                </p>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-semibold mb-2 text-gray-700">
                  Reason for Rejection (required)
                </label>
                <textarea
                  value={rejectComment}
                  onChange={(e) => setRejectComment(e.target.value)}
                  placeholder="Please provide a detailed reason for rejecting this application..."
                  className="w-full border rounded px-3 py-2 text-sm resize-none"
                  rows={4}
                  required
                />
              </div>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => {
                    setRejectModalOpen(false);
                    setRejectComment('');
                    setRejectingAccount(null);
                  }}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                  disabled={rejecting}
                >
                  Cancel
                </button>
                <button
                  onClick={handleRejectSubmit}
                  disabled={rejecting || !rejectComment.trim()}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
                >
                  {rejecting ? (
                    <div className="flex items-center gap-2">
                      <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Rejecting...
                    </div>
                  ) : (
                    'Reject Application'
                  )}
                </button>
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
    className={`flex flex-col justify-center items-center mt-4 ${blur || blur_01 || blur_02 ? "fixed sm:w-full" : ""}`} >
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
        <div className='w-full'>
          <div className='relative w-full rounded-lg shadow-sm shadow-slate-500 overflow-hidden min-h-[15rem] sm:min-h-[16rem]'>
            <img 
              src={Frame_01}
              alt='Frame_01'
              className='absolute inset-0 w-full h-full object-cover'
            />
            <div className='absolute inset-0 bg-gradient-to-br from-white/95 via-white/90 to-blue-50/80' />
            <div className='relative z-10 flex h-full w-full flex-col justify-between p-5 text-slate-800 min-h-[15rem] sm:min-h-[16rem]'>
              <div className='flex items-start justify-between gap-3 w-full'>
                <div className='w-full'>
                  <div className='flex items-center justify-between gap-3'>
                    <p className='text-[11px] uppercase tracking-[0.3em] text-slate-500'>Dashboard</p>
                    <div className='inline-flex items-center gap-2 rounded-full bg-blue-900/10 px-3 py-1 text-[11px] font-semibold text-blue-900'>
                      <span className='h-2 w-2 rounded-full bg-emerald-500 animate-pulse'></span>
                      Active
                    </div>
                  </div>
                  <h1 className='text-xl font-semibold text-slate-900 mt-1 w-full'>
                    Welcome back, <span className='text-blue-900 capitalize'>{(cleanedUsername || 'Customer')}</span>
                  </h1>
                </div>
              </div>

              <div className='mt-2 grid grid-cols-1 sm:grid-cols-2 gap-3 text-[13px]'>
                <div className='rounded-lg border border-slate-200 bg-white/80 px-3 py-2'>
                  <p className='text-[10px] uppercase tracking-widest text-slate-400'>Meter / Account</p>
                  <p className='mt-1 font-semibold text-slate-900 break-all'>
                    {meterNumber === null ? "" : meterNumber === "undefined" ? "Not yet available" : meterNumber.replace(/"/g, '')}
                  </p>
                </div>
                <div className='rounded-lg border border-slate-200 bg-white/80 px-3 py-2'>
                  <p className='text-[10px] uppercase tracking-widest text-slate-400'>Account Type</p>
                  <p className='mt-1 font-semibold text-slate-900'>
                    {account_type === "" ? "—" : account_type}
                  </p>
                </div>
                <div className='rounded-lg border border-slate-200 bg-white/80 px-3 py-2 sm:col-span-2'>
                  <p className='text-[10px] uppercase tracking-widest text-slate-400'>Email</p>
                  <p className='mt-1 font-semibold text-slate-900 break-words'>
                    {userEmail}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='relative shadow-sm shadow-slate-500 w-full h-52 rounded-lg flex flex-col justify-center items-center'>
          <img 
            src={Frame_01}
            alt={'Frame_01'}
            className='w-full h-full object-cover rounded-lg'
          />
          {/* keep existing primary brand color */}
          <div className="absolute inset-0 rounded-lg bg-blue-950 opacity-70"></div>
          <div className="absolute inset-0 flex flex-col justify-between px-4 py-4 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/10">
                  <CreditCardIcon className='w-5 h-5' />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-blue-100">
                    Outstanding
                  </p>
                  <p className="text-xs font-semibold text-white/90">
                    Postpaid balance
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-2 mb-2">
              {account_type === "Postpaid" && (
                <p className="text-2xl sm:text-3xl font-semibold leading-tight">
                  {userOutandingBalance === "" ? (
                    <span className="text-sm font-normal opacity-80">
                      Loading...
                    </span>
                  ) : (
                    `₦${Number(userOutandingBalance).toLocaleString()}`
                  )}
                </p>
              )}
              {outStandingbalance !== undefined &&
                outStandingbalance !== "" && (
                  <p className="text-lg sm:text-2xl font-semibold mt-1">
                    {`₦${Number(outStandingbalance).toLocaleString()}`}
                  </p>
                )}
            </div>

            <div className="flex items-center justify-between">
              <p className="text-[10px] sm:text-[11px] text-blue-100/80">
                View details securely with a one‑time PIN sent to your email.
              </p>
              {account_type === "Postpaid" ? (
                <button
                  onClick={() => setViewOutstandingModal(true)}
                  className="ml-2 inline-flex items-center rounded-md bg-white/90 px-3 py-1.5 text-[10px] sm:text-xs font-semibold text-blue-900 hover:bg-white transition"
                >
                  View outstanding
                </button>
              ) : (
                <button
                  onClick={handleBlur_01}
                  className="ml-2 inline-flex items-center rounded-md bg-white/90 px-3 py-1.5 text-[10px] sm:text-xs font-semibold text-blue-900 hover:bg-white transition"
                >
                  Click to view
                </button>
              )}
            </div>
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
          {/* keep existing brand color overlay */}
          <div className="absolute inset-0 rounded-lg bg-orange-500 opacity-70"></div>
          {/* redesigned account details content */}
          <div className='absolute inset-0 flex flex-col justify-center items-center px-4 text-white'>
            <div className="w-full max-w-xs">
              <div className="mb-2 text-center">
                <p className="text-[10px] uppercase tracking-[0.2em] font-semibold text-orange-100">
                  Account Details
                </p>
                <h2 className="text-sm font-semibold text-white/90">
                  Virtual Payment Account
                </h2>
              </div>
              <div className="mt-3 space-y-2 text-xs">
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase tracking-wide text-orange-100/90">
                    Account Number
                  </span>
                  <span className="mt-0.5 text-lg sm:text-xl font-semibold tracking-wider">
                    {accountNo === "undefined" || !accountNo ? "Not yet available" : accountNo}
                  </span>
                </div>
                <div className="flex justify-between gap-4 mt-2">
                  <div className="flex-1">
                    <span className="text-[10px] uppercase tracking-wide text-orange-100/90">
                      Account Name
                    </span>
                    <p className="mt-0.5 text-[11px] sm:text-xs font-medium break-words">
                      {accountName === "undefined" || !accountName ? "Not yet available" : accountName}
                    </p>
                  </div>
                  <div className="flex-1 text-right">
                    <span className="text-[10px] uppercase tracking-wide text-orange-100/90">
                      Bank
                    </span>
                    <p className="mt-0.5 text-[11px] sm:text-xs font-medium break-words">
                      {bankName === "undefined" || !bankName ? "Not yet available" : bankName}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='relative flex-grow shadow-sm shadow-slate-500 w-full h-52 rounded-lg flex flex-col justify-center items-center'>
          <img 
            src={Frame_01}
            alt={'Frame_01'}
            className='w-full h-full object-cover rounded-lg'
          />
          {/* keep existing primary brand color */}
          <div className="absolute inset-0 rounded-lg bg-blue-950 opacity-70"></div>
          <div className='absolute inset-0 flex flex-col justify-between px-4 py-4 text-white'>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/10">
                  <WalletIcon className='w-5 h-5' />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-blue-100">
                    Wallet
                  </p>
                  <p className="text-xs font-semibold text-white/90">
                    IBEDC Pay Wallet
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-2 mb-2">
              {status === "active" && (
                <>
                  {loading ? (
                    <div className="flex items-center gap-2 text-xs text-blue-100">
                      <svg
                        className="w-4 h-4 animate-spin text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2
                          5.291A7.962 7.962 0 014 12H0c0 3.042 1.135
                          5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      <span>Fetching wallet balance...</span>
                    </div>
                  ) : (
                    <p className='text-2xl sm:text-3xl font-semibold'>
                      {`₦${Number(wallet_amount || 0).toLocaleString()}`}
                    </p>
                  )}
                  <p className="mt-1 text-[10px] sm:text-[11px] text-blue-100/80">
                    Use your wallet for faster, seamless electricity payments.
                  </p>
                </>
              )}

              {status === "undefined" && (
                <p className="text-[11px] sm:text-xs text-blue-100/90">
                  Create a virtual account to enable wallet funding and quicker
                  payments on this dashboard.
                </p>
              )}
            </div>

            <div className="flex justify-end">
              {status === "undefined" && (
                <button
                  onClick={handleCreateAccountClick}
                  className='inline-flex items-center justify-center rounded-md bg-white/90 px-3 py-1.5 text-[10px] sm:text-xs font-semibold text-blue-900 hover:bg-white transition w-2/3 text-center'
                >
                  Create a new virtual account
                </button>
              )}
            </div>

            <VirtualAccountModal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
            />
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
            <div className={`flex flex-row justify-between items-center rounded-lg px-4 py-2 mx-2 shadow-sm shadow-gray-500 ${blur || blur_02 ? "hidden" : ""}`} key={transaction.id}>
              <div className='text-blue-900'>
                <h4 className='tracking-tighter text-left'>Amount paid: <span className='font-bold md:text-lg'>&#8358;{Number(transaction.amount || 0).toLocaleString()}</span></h4>
                <h4 className={`font-semibold text-sm text-gray-800 ${!blur_01 ? "opacity-75" : ""} tracking-tighter text-left`}>
                  Date:
                  <span className='font-normal'>
                    {transaction.date_entered ? `${transaction.date_entered.slice(8,10)}-${transaction.date_entered.slice(5,7)}-${transaction.date_entered.slice(0,4)} | ${transaction.date_entered.slice(11,16)}` : "N/A"}
                  </span>
                  <span className={`${transaction.status === 'failed' ? 'text-red-500' : transaction.status === 'processing' ? 'text-yellow-500' : 'text-green-500'} lowercase mx-2`}>{transaction?.status}</span>
                </h4>
              </div>
            </div>
          )).slice(0,7) : null}
        </div>
      </motion.div>
      <motion.div 
        variants={heroVariants.hero_11Variants}
        initial="hidden"
        animate="visible"
      className={`flex flex-col sm:flex-row justify-center sm:space-x-4 lg:px-10 sm:my-10 w-full ${blur && 'hidden'}`}>
        <div className='relative shadow-sm shadow-slate-500 w-3/4 rounded-lg hidden sm:flex justify-center items-center'>
          <div className='absolute inset-0 bg-gradient-to-t from-orange-500 opacity-80 rounded-lg from-0%'></div>
          <img
            src={Advert_01}
            alt='advert_01'
            className={"h-52 w-full rounded-lg"}
           />
        </div>
        <div className='shadow-sm shadow-slate-500 w-full rounded-lg flex flex-col-reverse sm:flex-row sm:space-x-2 mb-4 sm:mb-0'>
          <div className='shadow-sm shadow-slate-500 sm:w-3/4 rounded-l-lg flex flex-col mt-2 sm:mt-0 pb-2 sm:pb-0 bg-white'>
            <div className='flex flex-col justify-center items-start w-full px-4 pt-3'>
              <p className='text-[10px] uppercase tracking-[0.2em] font-semibold text-slate-500'>
                Account Details
              </p>
              <h2 className='mt-1 text-sm font-semibold text-slate-800'>
                Virtual Payment Account
              </h2>
            </div>
            <div className="mt-3 px-4 space-y-3 text-xs text-slate-700">
              <div className="flex flex-col">
                <span className="text-[10px] uppercase tracking-wide text-slate-500">
                  Account Name
                </span>
                <span className="mt-0.5 font-medium break-words">
                  {accountName === "undefined" || !accountName ? "Not yet available" : accountName}
                </span>
              </div>
              <div className="flex flex-wrap justify-between gap-4">
                <div className="flex-1 min-w-[40%]">
                  <span className="text-[10px] uppercase tracking-wide text-slate-500">
                    Account Number
                  </span>
                  <span className="mt-0.5 block font-semibold text-sm tracking-wide">
                    {accountNo === "undefined" || !accountNo ? "Not yet available" : accountNo}
                  </span>
                </div>
                <div className="flex-1 min-w-[40%]">
                  <span className="text-[10px] uppercase tracking-wide text-slate-500">
                    Bank Name
                  </span>
                  <span className="mt-0.5 block font-medium break-words">
                    {bankName === "undefined" || !bankName ? "Not yet available" : bankName}
                  </span>
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] uppercase tracking-wide text-slate-500">
                  Email
                </span>
                <span className="mt-0.5 font-medium break-words">
                  {customerEmail === "undefined" || !customerEmail ? "Not yet available" : customerEmail}
                </span>
              </div>
            </div>
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
      {viewOutstandingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-sm mx-4 text-center">
            <h2 className="font-bold mb-3 text-lg text-slate-800">Outstanding Balance</h2>
            <p className="text-2xl font-semibold text-blue-900 mb-4">{userOutandingBalance === "" ? '₦0' : `₦${(Number(userOutandingBalance)).toLocaleString()}`}</p>
            <button onClick={() => setViewOutstandingModal(false)} className="bg-gray-400 text-white px-4 py-2 rounded">Close</button>
          </div>
        </div>
      )}
    </motion.section>
    </div>
  )
}

// Helper functions for DTM status
const isPending = (acc) => acc.picture === "0" || acc.latitude === "0" || acc.longitude === "0";
const isValidated = (acc) => acc.picture !== "0" && acc.latitude !== "0" && acc.longitude !== "0";
// Check if account is validated by DTE (has both dss and tarrif)
const isDteValidated = (acc) => acc.dss && acc.dss !== null && acc.tarrif && acc.tarrif !== null;
// Check if account is customer-submitted (needs DTM validation - dss and tarrif null but picture exists)
const needsCustomerDtmValidation = (acc) => (!acc.dss || acc.dss === null) && (!acc.tarrif || acc.tarrif === null) && acc.picture && acc.picture !== "0";

function ValidateAccountModal({ account, onClose, onValidated, allBusinessHubs, allRegions }) {
  console.log("ValidateAccountModal received allRegions:", allRegions);
  
  // Determine account state
  const accountDss = account.dss;
  const accountTarrif = account.tarrif;
  const accountPicture = account.picture;
  
  // Determine validation scenario
  const needsImageCapture = (!accountDss || accountDss === null) && (!accountTarrif || accountTarrif === null) && (accountPicture === "0" || !accountPicture);
  const needsDtmValidation = (!accountDss || accountDss === null) && (!accountTarrif || accountTarrif === null) && accountPicture && accountPicture !== "0";
  const needsFinalApprove = accountDss && accountDss !== null && accountTarrif && accountTarrif !== null && accountPicture && accountPicture !== "0";
  
  const [picture, setPicture] = useState(null);
  const [latitude, setLatitude] = useState(account.latitude);
  const [longitude, setLongitude] = useState(account.longitude);
  const [submitting, setSubmitting] = useState(false);
  const [captured, setCaptured] = useState(false);
  const [dssList, setDssList] = useState([]);
  const [selectedDss, setSelectedDss] = useState(accountDss || '');
  const [tariffList, setTariffList] = useState([]);
  const [selectedTariff, setSelectedTariff] = useState(accountTarrif || '');
  const [regionForHub, setRegionForHub] = useState(account.region);
  const [serviceCenters, setServiceCenters] = useState([]);
  const [selectedServiceCenter, setSelectedServiceCenter] = useState(account.service_center || '');
  
  // New state for editable region and business hub
  const [selectedRegion, setSelectedRegion] = useState(account.region);
  const [businessHubsForRegion, setBusinessHubsForRegion] = useState([]);
  const [selectedBusinessHub, setSelectedBusinessHub] = useState(account.business_hub);
  const [redirecting, setRedirecting] = useState(false);
  const [approving, setApproving] = useState(false);
  
  const webcamRef = useRef(null);

  // Track previous region to detect changes
  const prevRegionRef = useRef(account.region);
  
  // Fetch business hubs when region changes
  useEffect(() => {
    if (!selectedRegion) return;
    const fetchBusinessHubsForRegion = async () => {
      try {
        const res = await axiosClient.get(`/V4IBEDC_new_account_setup_sync/initiate/new/business_hub/${selectedRegion}`);
        console.log("Business hubs response for region", selectedRegion, ":", res.data);
        setBusinessHubsForRegion(Array.isArray(res.data) ? res.data.map(h => h.bhub) : []);
        // Only reset business hub and service center when region actually changes (not on initial load)
        if (prevRegionRef.current && prevRegionRef.current !== selectedRegion) {
          setSelectedBusinessHub('');
          setSelectedServiceCenter('');
        }
        prevRegionRef.current = selectedRegion;
      } catch (e) {
        console.error("Error fetching business hubs for region", selectedRegion, ":", e);
        setBusinessHubsForRegion([]);
      }
    };
    fetchBusinessHubsForRegion();
  }, [selectedRegion]);



  // Set region for selected business hub
  useEffect(() => {
    if (selectedRegion && selectedBusinessHub) {
      setRegionForHub(selectedRegion);
    }
  }, [selectedRegion, selectedBusinessHub]);

  // Fetch DSS and Tariff only after regionForHub is set
  useEffect(() => {
    if (!regionForHub || !selectedBusinessHub || !selectedServiceCenter) return;
    // Fetch DSS
    const fetchDss = async () => {
      try {
        const url = `/V4IBEDC_new_account_setup_sync/initiate/get_dss?region=${encodeURIComponent(regionForHub)}&hub=${encodeURIComponent(selectedBusinessHub)}&service_center=${encodeURIComponent(selectedServiceCenter)}`;
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
        const allTariffs = res.data.payload.tarriff || [];
        // Filter to only show NMD tariff codes
        const nmdTariffs = allTariffs.filter(tariff => tariff.TariffCode === 'NMD');
        setTariffList(nmdTariffs);
      } catch (e) {
        setTariffList([]);
      }
    };
    fetchDss();
    fetchTariff();
  }, [regionForHub, selectedBusinessHub, selectedServiceCenter]);

  // Initialize regionForHub and fetch data if account already has region, business_hub, service_center
  useEffect(() => {
    if (account.region && account.business_hub && account.service_center && !regionForHub) {
      setRegionForHub(account.region);
      setSelectedRegion(account.region);
      setSelectedBusinessHub(account.business_hub);
      setSelectedServiceCenter(account.service_center);
    }
  }, [account.region, account.business_hub, account.service_center]);

  // Fetch service centers when business hub changes
  useEffect(() => {
    if (!selectedBusinessHub) return;
    const fetchServiceCenters = async () => {
      try {
        const url = `/V4IBEDC_new_account_setup_sync/initiate/new/service_centers/${encodeURIComponent(selectedBusinessHub)}`;
        const res = await axiosClient.get(url);
        console.log("Service centers response for business hub", selectedBusinessHub, ":", res.data);
        setServiceCenters(Array.isArray(res.data) ? res.data.map(c => c.service_center) : []);
        // Reset service center when business hub changes
        setSelectedServiceCenter('');
      } catch (e) {
        console.error("Error fetching service centers for business hub", selectedBusinessHub, ":", e);
        setServiceCenters([]);
      }
    };
    fetchServiceCenters();
  }, [selectedBusinessHub, regionForHub]);

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

  // Handle DTM validation (when dss and tarrif are null but picture exists)
  const handleDtmValidation = async () => {
    setSubmitting(true);
    try {
      const payload = {
        tracking_id: account.tracking_id,
        region: selectedRegion || account.region,
        business_hub: selectedBusinessHub || account.business_hub,
        service_center: selectedServiceCenter || account.service_center,
        dss: selectedDss,
        id: String(account.id),
        tarrif: selectedTariff
      };
      
      await axiosClient.post('/V4IBEDC_new_account_setup_sync/initiate/v5/dtm_customer_validation', payload);
      toast.success('Account validated successfully!');
      if (typeof onValidated === 'function') onValidated();
      if (typeof onClose === 'function') onClose();
    } catch (e) {
      toast.error('Validation failed: ' + (e.response?.data?.message || e.message));
    } finally {
      setSubmitting(false);
    }
  };

  // Handle final approval (from DTE - when dss, tarrif, and picture all exist)
  const handleFinalApprove = async () => {
    setApproving(true);
    try {
      const payload = {
        tracking_id: account.tracking_id,
        type: 'approve',
        comment: 'approve',
        id: String(account.id)
      };
      
      await axiosClient.post('/V4IBEDC_new_account_setup_sync/initiate/approve_request', payload);
      toast.success('Application approved successfully!');
      if (typeof onValidated === 'function') onValidated();
      if (typeof onClose === 'function') onClose();
    } catch (e) {
      toast.error('Approval failed: ' + (e.response?.data?.payload?.comment || e.payload?.comment || e.message));
    } finally {
      setApproving(false);
    }
  };

  // Handle image capture validation (original logic)
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
    formData.append('region', selectedRegion);
    formData.append('business_hub', selectedBusinessHub);
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

  const handleRedirect = async () => {
    setRedirecting(true);
    try {
      const payload = {
        tracking_id: account.tracking_id,
        region: selectedRegion,
        business_hub: selectedBusinessHub,
        service_center: selectedServiceCenter,
        id: String(account.id),
        email: account.account.email
      };
      
      await axiosClient.post('/V4IBEDC_new_account_setup_sync/initiate/change_account_location', payload);
      toast.success('Account redirected successfully!');
      if (typeof onValidated === 'function') onValidated();
      if (typeof onClose === 'function') onClose();
    } catch (e) {
      toast.error('Redirect failed: ' + (e.response?.data?.message || e.message));
    } finally {
      setRedirecting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="font-bold mb-4">Validate Account</h2>
        <div className="mb-2">Tracking ID: <span className="font-mono">{account.tracking_id}</span></div>
        
        {/* Scenario 1: Final Approve (from DTE - dss, tarrif, and picture all exist) */}
        {needsFinalApprove && (
          <div className="space-y-4">
            <div className="p-4 bg-green-50 border border-green-200 rounded">
              <p className="text-sm text-green-800">
                <strong>Account Status:</strong> This account has been validated by DTE with all required information (DSS, Tariff, and Picture). 
                You can proceed with final approval.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="mb-2"><strong>Region:</strong> {account.region || 'N/A'}</div>
                <div className="mb-2"><strong>Business Hub:</strong> {account.business_hub || 'N/A'}</div>
                <div className="mb-2"><strong>Service Center:</strong> {account.service_center || 'N/A'}</div>
                <div className="mb-2"><strong>DSS:</strong> {accountDss || 'N/A'}</div>
                <div className="mb-2"><strong>Tariff:</strong> {accountTarrif || 'N/A'}</div>
              </div>
              <div>
                {accountPicture && accountPicture !== "0" && (
                  <div className="mb-2">
                    <strong>Picture:</strong><br/>
                    <img 
                      src={`https://ipay.ibedc.com:7642/storage/${accountPicture}`} 
                      alt="Building" 
                      className="w-40 h-40 object-cover rounded border" 
                    />
                  </div>
                )}
                <div className="mb-2"><strong>Latitude:</strong> {account.latitude || 'N/A'}</div>
                <div className="mb-2"><strong>Longitude:</strong> {account.longitude || 'N/A'}</div>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={handleFinalApprove}
                disabled={approving}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                {approving ? 'Approving...' : 'Final Approve'}
              </button>
              <button
                onClick={typeof onClose === 'function' ? onClose : undefined}
                className="bg-gray-300 px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Scenario 2: DTM Validation (dss and tarrif are null but picture exists - from customers) */}
        {needsDtmValidation && (
          <div className="space-y-4">
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded">
              <p className="text-sm text-yellow-800">
                <strong>Account Status:</strong> Customer-submitted application with building image captured. Please select Region, Business Hub, Service Center, DSS, and Tariff to complete validation.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="mb-2">
                  <label className="block text-sm font-semibold mb-1">Region:</label>
                  <select
                    value={selectedRegion}
                    onChange={e => setSelectedRegion(e.target.value)}
                    className="block w-full border rounded p-2"
                    required
                  >
                    <option value="">Select Region</option>
                    {allRegions.map(region => (
                      <option key={region} value={region}>{region}</option>
                    ))}
                  </select>
                </div>
                <div className="mb-2">
                  <label className="block text-sm font-semibold mb-1">Business Hub:</label>
                  <select
                    value={selectedBusinessHub}
                    onChange={e => setSelectedBusinessHub(e.target.value)}
                    className="block w-full border rounded p-2"
                    required
                    disabled={businessHubsForRegion.length === 0}
                  >
                    <option value="">Select Business Hub</option>
                    {businessHubsForRegion.map(hub => (
                      <option key={hub} value={hub}>{hub}</option>
                    ))}
                  </select>
                </div>
                <div className="mb-2">
                  <label className="block text-sm font-semibold mb-1">Service Center:</label>
                  <select
                    value={selectedServiceCenter}
                    onChange={e => setSelectedServiceCenter(e.target.value)}
                    className="block w-full border rounded p-2"
                    required
                    disabled={serviceCenters.length === 0}
                  >
                    <option value="">Select Service Center</option>
                    {serviceCenters.map(sc => (
                      <option key={sc} value={sc}>{sc}</option>
                    ))}
                  </select>
                </div>
                <div className="mb-2">
                  <label className="block text-sm font-semibold mb-1">DSS:</label>
                  <select
                    value={selectedDss}
                    onChange={e => setSelectedDss(e.target.value)}
                    className="block w-full border rounded p-2"
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
                  <label className="block text-sm font-semibold mb-1">Tariff:</label>
                  <select
                    value={selectedTariff}
                    onChange={e => setSelectedTariff(e.target.value)}
                    className="block w-full border rounded p-2"
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
              </div>
              <div>
                {accountPicture && accountPicture !== "0" && (
                  <div className="mb-4">
                    <strong className="block text-sm font-semibold mb-2">Building Image:</strong>
                    <img 
                      src={`https://ipay.ibedc.com:7642/storage/${accountPicture}`} 
                      alt="Building" 
                      className="w-full max-w-xs h-auto object-cover rounded border shadow-sm" 
                    />
                  </div>
                )}
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={handleDtmValidation}
                disabled={submitting || !selectedDss || !selectedTariff || !selectedServiceCenter || !selectedRegion || !selectedBusinessHub}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? 'Validating...' : 'Validate'}
              </button>
              <button
                onClick={typeof onClose === 'function' ? onClose : undefined}
                className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Scenario 3: Image Capture (original DTM validation logic) */}
        {needsImageCapture && (
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 border border-blue-200 rounded">
              <p className="text-sm text-blue-800">
                <strong>Account Status:</strong> Please capture building image and provide location details to complete validation.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="mb-2">
                  <label>Region:</label>
                  <select
                    value={selectedRegion}
                    onChange={e => setSelectedRegion(e.target.value)}
                    className="block w-full border rounded p-1"
                    required
                  >
                    <option value="">Select Region</option>
                    {allRegions.map(region => (
                      <option key={region} value={region}>{region}</option>
                    ))}
                  </select>
                </div>
                <div className="mb-2">
                  <label>Business Hub:</label>
                  <select
                    value={selectedBusinessHub}
                    onChange={e => setSelectedBusinessHub(e.target.value)}
                    className="block w-full border rounded p-1"
                    required
                    disabled={businessHubsForRegion.length === 0}
                  >
                    <option value="">Select Business Hub</option>
                    {businessHubsForRegion.map(hub => (
                      <option key={hub} value={hub}>{hub}</option>
                    ))}
                  </select>
                </div>
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
                      <option key={sc} value={sc}>{sc}</option>
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
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded">
              <p className="text-sm text-blue-800">
                <strong>Note:</strong> Use the <strong>Redirect</strong> button if the business hub or service center doesn't match your jurisdiction. 
                This will redirect the account to the correct DTM for validation.
              </p>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={handleRedirect}
                disabled={redirecting || !selectedRegion || !selectedBusinessHub || !selectedServiceCenter}
                className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
              >
                {redirecting ? 'Redirecting...' : 'Redirect'}
              </button>
              <button
                onClick={handleSubmit}
                disabled={submitting || !picture || !latitude || !longitude || !selectedDss || !selectedTariff || !selectedServiceCenter || !selectedRegion || !selectedBusinessHub}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
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
        )}
      </div>
    </div>
  );
}
