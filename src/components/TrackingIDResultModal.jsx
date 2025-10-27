import React from 'react';

const TrackingIDResultModal = ({ isOpen, onClose, customerData }) => {
    if (!isOpen) return null;
    
    if (!customerData) {
        return (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 w-full z-50">
                <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full mx-4">
                    <h2 className="text-xl font-bold text-slate-800 text-center mb-4">No Data</h2>
                    <p className="text-center text-gray-600 mb-4">No customer data available</p>
                    <button 
                        onClick={onClose}
                        className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-2 rounded-md font-semibold transform duration-300 ease-in-out w-full"
                    >
                        Close
                    </button>
                </div>
            </div>
        );
    }

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 w-full z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full mx-4">
                <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-slate-800 mb-2">Tracking ID Retrieved</h2>
                    <p className="text-sm text-gray-600">Your account information has been found</p>
                </div>
                
                <div className="space-y-4 mb-6">
                    {/* Tracking ID - Highlighted */}
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Tracking ID</label>
                        <p className="text-2xl font-bold text-orange-600 break-all">{customerData.tracking_id}</p>
                    </div>

                    {/* Customer Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                            <p className="text-gray-900 font-semibold">
                                {customerData.title} {customerData.surname} {customerData.firstname} {customerData.other_name}
                            </p>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                            <p className="text-gray-900">{customerData.email}</p>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                            <p className="text-gray-900">{customerData.phone}</p>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                            <p className="text-gray-900 capitalize">{customerData.status_name}</p>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Account ID</label>
                            <p className="text-gray-900">{customerData.id}</p>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Accounts Applied For</label>
                            <p className="text-gray-900">{customerData.no_of_account_apply_for}</p>
                        </div>
                        
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Created Date</label>
                            <p className="text-gray-900">{formatDate(customerData.created_at)}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                    <div className="flex items-start">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <h3 className="text-sm font-medium text-blue-800">Important Note</h3>
                            <div className="mt-2 text-sm text-blue-700">
                                <p>Please keep your Tracking ID safe. You'll need it to track your account application status and for future reference.</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-center">
                    <button 
                        onClick={onClose}
                        className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-2 rounded-md font-semibold transform duration-300 ease-in-out"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TrackingIDResultModal;
