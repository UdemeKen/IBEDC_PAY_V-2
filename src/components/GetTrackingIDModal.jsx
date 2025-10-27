import React, { useState } from 'react';
import axiosClient from '../axios';
import { toast } from 'react-toastify';

const getTrackingIDUrl = "/V4IBEDC_new_account_setup_sync/initiate/get_trackingid";

const GetTrackingIDModal = ({ isOpen, onClose, onSuccess }) => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const requestData = {
            "tracker": email
        };

        try {
            const response = await axiosClient.post(getTrackingIDUrl, requestData);
            
            if (response.data.success) {
                onSuccess(response.data.payload.customer);
                onClose(); // Close the input modal
                toast.success(response.data.message, {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            } else {
                onClose(); // Close the modal on error
                toast.error('Failed to retrieve tracking ID', {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            }
        } catch (error) {
            console.error('Error occurred:', error);
            onClose(); // Close the modal on error
            toast.error(error.response?.data?.message || 'Something went wrong while retrieving tracking ID.', {
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
            // Don't close the modal here - let the success handler manage the flow
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 w-full z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full mx-4">
                <h2 className="text-xl font-bold text-slate-800 text-center mb-4">Get Tracking ID</h2>
                <p className="text-sm text-gray-600 text-center mb-6">
                    Enter the email address you used when registering for a new account
                </p>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <input 
                            type="email" 
                            placeholder="Enter your email address" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            required 
                            className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-black" 
                        />
                    </div>
                    <div className="flex space-x-3">
                        <button 
                            type="submit" 
                            className="flex-1 bg-orange-500 hover:bg-orange-600 transform duration-300 ease-in-out text-white px-4 py-2 rounded-md font-semibold disabled:opacity-50 disabled:cursor-not-allowed" 
                            disabled={loading}
                        >
                            {loading ? (
                                <div className='flex items-center justify-center'>
                                    <svg className="w-5 h-5 animate-spin text-white mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Retrieving...
                                </div>
                            ) : (
                                "Get Tracking ID"
                            )}
                        </button>
                        <button 
                            type="button" 
                            onClick={onClose}
                            className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-md font-semibold transform duration-300 ease-in-out"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default GetTrackingIDModal;
