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
import PostpaidTransactionReceipt from "./views/receipts/PostpaidTransactionReceipt";

const router = createBrowserRouter([
    {
        path: "/",
        element: <GuestLayout />,
        children: [
            {
                path: "signup",
                element: <Signup />
            },
            {
                path: "login",
                element: <Login />
            }
        ]
    },
    {
        path: "/default",
        element: <DefaultLayout />,
        children: [
            {
                path: "customerdashboard",
                element: <CustomerDashboard />
            },
            {
                path: "completepayment",
                element: <CompletePayment />
            },
            {
                path: "wallet",
                element: <WalletPage />
            },
            {
                path: "alltransactions",
                element: <AllTransactions />
            },
            {
                path: "profile",
                element: <UserProfile />
            },
            {
                path: "faq",
                element: <FAQ />
            },
            {
                path: "contactus",
                element: <ContactUs />
            },
            {
                path: "transactionviewdetails",
                element: <TransactionViewDetails />
            },
        ]
    },
    {
        path: "prepaidtransactionreceipt",
        element: <PrepaidTransactionReceipt />
    },
    {
        path: "postpaidtransactionreceipt",
        element: <PostpaidTransactionReceipt />
    },
    {
        path: "/pinverification",
        element: <PinVerification />
    },
    {
        path: "/forgotpassword",
        element: <ForgotPassword />
    },
    {
        path: "/verifypassword",
        element: <VerifyPassword />
    },
    {
        path: "/resetpassword",
        element: <ResetPassword />
    }
]);

export default router;