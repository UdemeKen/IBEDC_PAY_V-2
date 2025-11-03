import React, { useState } from 'react';
import axiosClient from '../../axios';
import { toast } from 'react-toastify';

const virtualAccountUrl = "/V3_OUTRIBD_iOAUTH_markedxMONITOR/virtual/account";

const VirtualAccountModal = ({ isOpen, onClose }) => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [bvn, setBvn] = useState('');
    const [email, setEmail] = useState(localStorage.getItem("USER_EMAIL"));
    const [phoneNumber, setPhoneNumber] = useState('');
    const [loading, setLoading] = useState(false);

    const userEmail = localStorage.getItem("USER_EMAIL");

    const requestData = {
        "email" : email,
        "bvn" : bvn,
        "phonenumber" : phoneNumber,
        "firstname" : firstName,
        "lastname" : lastName
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Await the promise to resolve
            const response = await axiosClient.post(virtualAccountUrl, requestData);

            // Destructure the data from the response
            const { account_name, account_no, bank_name, customer_email, user_id, status } = response.data.payload.account;

            // Save the extracted data to localStorage
            localStorage.setItem('account_name', account_name);
            localStorage.setItem('account_no', account_no);
            localStorage.setItem('bank_name', bank_name);
            localStorage.setItem('customer_email', customer_email);
            localStorage.setItem('user_id', user_id);
            localStorage.setItem('STATUS', status);

            // Notify the user with a success message using Toastify
            toast.success('Virtual Account Successfully Created!', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });

            console.log('Response received:', response.data);
        } catch (error) {
            console.error('Error occurred:', error);

            // Notify the user with an error message
            toast.error('Something went wrong while creating the account.', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        } finally {
            setLoading(false);
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 w-full z-10">
            <div className="bg-white p-6 rounded-md shadow-md">
                <h2 className="text-xl font-bold text-slate-800 text-center mb-4">Create a Virtual Account</h2>
                <form onSubmit={handleSubmit}>
                    <input type="text" placeholder="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} required className="block w-full mb-2 text-black" />
                    <input type="text" placeholder="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} required className="block w-full mb-2 text-black" />
                    <input type="email" placeholder="Email" value={email} required className="block w-full mb-2 text-black" />
                    <input type="text" placeholder="BVN" value={bvn} onChange={(e) => setBvn(e.target.value)} required className="block w-full mb-2 text-black" />
                    <input type="text" placeholder="Phone Number" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} required className="block w-full mb-4 text-black" />
                    <button type="submit" className="bg-blue-950 hover:bg-blue-900 transform duration-300 ease-in-out text-white px-4 py-2 rounded" disabled={loading}>
                        {loading ? (
                            <div className='flex items-center'>
                                <svg className="w-5 h-5 animate-spin text-white mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Processing...
                            </div>
                        ) : (
                            "Create Account"
                        )}
                    </button>
                    <button type="button" 
                    onClick={onClose}
                    className="ml-2 bg-gray-300 text-black px-4 py-2 rounded">Cancel</button>
                </form>
            </div>
        </div>
    );
};

export default VirtualAccountModal;