import { createBrowserRouter } from "react-router-dom";
import { DefaultLayout, GuestLayout } from "./components";
import { Login, Signup } from "./views/auth";
import PinVerification from "./views/verifications/PinVerification";
import CustomerDashboard from "./views/dashboard/CustomerDashboard";
import CompletePayment from "./components/paymentProcess/CompletePayment";
import WalletPage from "./views/wallet/WalletPage";
import AllTransactions from "./views/transactions/AllTransactions";
import UserProfile from "./views/profile/UserProfile";
import FAQ from "./views/faq/FAQ";
import ContactUs from "./views/contact_us/ContactUs";
import ForgotPassword from "./views/password/ForgotPassword";
import VerifyPassword from "./views/verifyPassword/VerifyPassword";
import ResetPassword from "./views/resetPassword/ResetPassword";
import TransactionViewDetails from "./views/viewDetails/TransactionViewDetails";
import PrepaidTransactionReceipt from "./views/receipts/PrepaidTransactionReceipt";
import MeterNumberLogin from "./views/auth/loginTypes/MeterNumberLogin";
import ErrorBoundary from "./views/errorBoundary/ErrorBoundary";
import ErrorPage from "./views/errorBoundary/ErrorPage";
import BillHistory from "./views/transactions/BillHistory";
import PostpaidBillReceipt from "./views/receipts/PostpaidBillReceipt";
import WalletHistory from "./views/transactions/WalletHistory";
import CancelPayment from "./views/errorBoundary/CancelPayment";
import CancelPay from "./views/errorBoundary/CancelPay";
import SuccessfulPay from "./views/errorBoundary/SuccessPay";
import Spinner from "./views/errorBoundary/Spinner";
import PrivacyPolicy from "./views/policies/Privacy-Policy";
import ElectricitySupplyForm from "./views/electricitySupplyForm/ElectricitySupplyForm";
import ContinuationForm from "./views/electricitySupplyForm/ContinuationForm";
import DocumentUpload from "./views/electricitySupplyForm/DocumentUpload";
import ConnectionDetailsPage from "./views/electricitySupplyForm/ConnectionDetailsPage";
import FinalFormPage from "./views/electricitySupplyForm/FinalFormPage";
import LecanUploadPage from "./views/electricitySupplyForm/LecanUploadPage";

const router = createBrowserRouter([
    {
        path: "/",
        element: <ErrorBoundary><GuestLayout /></ErrorBoundary>,
        children: [
            {
                path: "signup",
                element: <ErrorBoundary><Signup /></ErrorBoundary>,
                errorElement: <ErrorPage />
            },
            {
                path: "",
                element: <ErrorBoundary><Login /></ErrorBoundary>,
                children: [
                    {
                        path: "meternumber",
                        element: <ErrorBoundary><MeterNumberLogin /></ErrorBoundary>,
                        errorElement: <ErrorPage />
                    }
                ]
            }
        ]
        
    },
    {
        path: "/default",
        element: <ErrorBoundary><DefaultLayout /></ErrorBoundary>,
        children: [
            {
                path: "customerdashboard",
                element: <ErrorBoundary><CustomerDashboard /></ErrorBoundary>,
                errorElement: <ErrorPage />
            },
            {
                path: "completepayment",
                element: <ErrorBoundary><CompletePayment /></ErrorBoundary>,
                errorElement: <ErrorPage />
            },
            {
                path: "wallet",
                element: <ErrorBoundary><WalletPage /></ErrorBoundary>,
                errorElement: <ErrorPage />
            },
            {
                path: "alltransactions",
                element: <ErrorBoundary><AllTransactions /></ErrorBoundary>,
                errorElement: <ErrorPage />,
                children: [
                    {
                        path: "billhistory",
                        element: <ErrorBoundary><BillHistory /></ErrorBoundary>,
                        errorElement: <ErrorPage />
                    },
                    {
                        path: "wallethistory",
                        element: <ErrorBoundary><WalletHistory /></ErrorBoundary>,
                        errorElement: <ErrorPage />
                    }
                ]
            },
            {
                path: "profile",
                element: <ErrorBoundary><UserProfile /></ErrorBoundary>,
                errorElement: <ErrorPage />
            },
            {
                path: "faq",
                element: <ErrorBoundary><FAQ /></ErrorBoundary>,
                errorElement: <ErrorPage />
            },
            {
                path: "contactus",
                element: <ErrorBoundary><ContactUs /></ErrorBoundary>,
                errorElement: <ErrorPage />
            },
            {
                path: "transactionviewdetails/:id",
                element: <ErrorBoundary><TransactionViewDetails /></ErrorBoundary>,
                errorElement: <ErrorPage />
            },
            {
                path: "cancelpayment",
                element: <ErrorBoundary><CancelPayment /></ErrorBoundary>,
                errorElement: <ErrorPage />
            },
            {
                path: "spinner",
                element: <ErrorBoundary><Spinner /></ErrorBoundary>,
                errorElement: <ErrorPage />
            },
            {
                path: "cancelpay",
                element: <ErrorBoundary><CancelPay /></ErrorBoundary>,
                errorElement: <ErrorPage />
            },
            {
                path: "successpay",
                element: <ErrorBoundary><SuccessfulPay /></ErrorBoundary>,
                errorElement: <ErrorPage />
            }
        ]
    },
    {
        path: "prepaidtransactionreceipt/:id",
        element: <ErrorBoundary><PrepaidTransactionReceipt /></ErrorBoundary>,
        errorElement: <ErrorPage />
    },
    {
        path: "postpaidtransactionreceipt/:postId",
        element: <ErrorBoundary><PostpaidBillReceipt /></ErrorBoundary>,
        errorElement: <ErrorPage />
    },
    {
        path: "postpaidbillreceipt/:id",
        element: <ErrorBoundary><PostpaidBillReceipt /></ErrorBoundary>,
        errorElement: <ErrorPage />
    },
    {
        path: "/pinverification",
        element: <ErrorBoundary><PinVerification /></ErrorBoundary>,
        errorElement: <ErrorPage />
    },
    {
        path: "/forgotpassword",
        element: <ErrorBoundary><ForgotPassword /></ErrorBoundary>,
        errorElement: <ErrorPage />
    },
    {
        path: "/verifypassword",
        element: <ErrorBoundary><VerifyPassword /></ErrorBoundary>,
        errorElement: <ErrorPage />
    },
    {
        path: "/resetpassword",
        element: <ErrorBoundary><ResetPassword /></ErrorBoundary>,
        errorElement: <ErrorPage />
    },
    {
        path: "/privacypolicy",
        element: <ErrorBoundary><PrivacyPolicy /></ErrorBoundary>,
        errorElement: <ErrorPage />
    },
    {
        path: "/electricitySupplyForm",
        element: <ErrorBoundary><ElectricitySupplyForm /></ErrorBoundary>,
        errorElement: <ErrorPage />
    },
    {
        path: "/continuationForm",
        element: <ErrorBoundary><ContinuationForm /></ErrorBoundary>,
        errorElement: <ErrorPage />
    },
    {
        path: "/documentUpload",
        element: <ErrorBoundary><DocumentUpload /></ErrorBoundary>,
        errorElement: <ErrorPage />
    },
    {
        path: "/connectionDetails",
        element: <ErrorBoundary><ConnectionDetailsPage /></ErrorBoundary>,
        errorElement: <ErrorPage />
    },
    {
        path: "/finalForm",
        element: <ErrorBoundary><FinalFormPage /></ErrorBoundary>,
        errorElement: <ErrorPage />
    },
    {
        path: "/lecanUpload",
        element: <ErrorBoundary><LecanUploadPage /></ErrorBoundary>,
        errorElement: <ErrorPage />
    }
]);

export default router;