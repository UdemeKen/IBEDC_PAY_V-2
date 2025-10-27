import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosClient from '../../axios';
import { toast } from 'react-toastify';

export default function NewAccount() {
  const navigate = useNavigate();

  const [trackingId, setTrackingId] = useState('');
  const [loading, setLoading] = useState(false);
  const [showChecklist, setShowChecklist] = useState(false);
  const [showProcessingModal, setShowProcessingModal] = useState(false);
  const [applicationStatus, setApplicationStatus] = useState(null);

  const handleContinueWithTrackingId = async () => {
    if (!trackingId.trim()) return;
    setLoading(true);
    try {
      const response = await axiosClient.post('/V4IBEDC_new_account_setup_sync/initiate/track-application', { tracking_id: trackingId.trim() });
      const data = response.data;
      if (data.success && data.payload && data.payload.customer) {
        const customer = data.payload.customer;
        if (customer.no_of_account_apply_for) {
          localStorage.setItem('no_of_account_apply_for', customer.no_of_account_apply_for);
        }
        if (customer.continuation?.latitude) {
          localStorage.setItem('LATITUDE', customer.continuation.latitude);
          localStorage.setItem('LONGITUDE', customer.continuation.longitude);
        }

        const hasMissingLecan = customer.uploaded_pictures?.some(picture => !picture.lecan_link);
        if (hasMissingLecan) {
          const numBuildings = customer.no_of_account_apply_for
            ? Number(customer.no_of_account_apply_for)
            : (customer.uploaded_pictures && customer.uploaded_pictures.length)
              ? customer.uploaded_pictures.length
              : 1;
          navigate('/lecanUpload', {
            state: {
              trackingId: String(customer.tracking_id),
              numBuildings,
              uploadedBuildings: customer.uploaded_pictures || [],
              buildingIds: customer.uploaded_pictures ? customer.uploaded_pictures.map(pic => pic.id) : []
            }
          });
          return;
        }

        const hasPendingApplications = customer.uploaded_pictures?.some(picture => !picture.account_no);
        if (hasPendingApplications) {
          setApplicationStatus({
            status: customer.status,
            status_name: customer.status_name,
            tracking_id: customer.tracking_id
          });
          setShowProcessingModal(true);
          setLoading(false);
          return;
        }

        if (!customer.continuation) {
          navigate(`/continuationForm?trackingId=${encodeURIComponent(String(customer.tracking_id))}`, { state: { prefill: customer } });
        } else if (!customer.uploadinformation) {
          navigate(`/finalForm?trackingId=${encodeURIComponent(String(customer.tracking_id))}`, { state: { prefill: customer.continuation } });
        } else if (!customer.uploaded_pictures || customer.uploaded_pictures.length === 0) {
          navigate(`/finalForm?trackingId=${encodeURIComponent(String(customer.tracking_id))}`, { state: { prefill: customer.uploaded_pictures } });
        } else {
          navigate(`/finalForm?trackingId=${encodeURIComponent(String(customer.tracking_id))}`, { state: { prefill: customer.uploaded_pictures } });
        }
      } else {
        toast.error(data.message || 'Invalid tracking ID.');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className='w-full min-h-screen flex items-center justify-center bg-gray-50 p-4'>
      <div className='bg-white rounded shadow p-6 w-full max-w-lg'>
        <h1 className='text-2xl font-bold text-center text-blue-900 mb-4'>New Customer Account Creation</h1>

        <div className='space-y-6'>
          <div>
            <label className='block text-sm font-medium text-slate-700 mb-1'>Have a Tracking ID?</label>
            <div className='flex gap-2'>
              <input
                type='text'
                value={trackingId}
                onChange={(e) => setTrackingId(e.target.value)}
                placeholder='Enter Tracking ID'
                className='flex-1 rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-slate-600 text-sm'
              />
              <button
                onClick={handleContinueWithTrackingId}
                disabled={!trackingId.trim() || loading}
                className='px-4 py-2 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700 disabled:opacity-50'
              >
                {loading ? 'Loading...' : 'Continue'}
              </button>
            </div>
          </div>

          <div className='relative'>
            <div className='border-t pt-4'>
              <p className='text-center text-gray-600 text-sm mb-4'>Or start a new application</p>
              <button
                onClick={() => setShowChecklist(true)}
                className='w-full px-4 py-2 bg-gray-700 text-white rounded-md font-semibold hover:bg-gray-800'
              >
                Start New
              </button>
            </div>
          </div>

          {showChecklist && (
            <div className='mt-4 p-4 bg-blue-50 border border-blue-200 rounded'>
              <h2 className='text-blue-900 font-semibold mb-2'>Checklist: What You Need to Start</h2>
              <ul className='list-disc list-inside text-sm text-gray-800'>
                <li>Valid phone number and email address.</li>
                <li>Address and closest landmark of Building.</li>
                <li>Landlord's full name, phone number, email and NIN.</li>
                <li>Business hub and Service Center of the area your building is located.</li>
                <li>Complete Licenced Electrical Contractor form (Form will be downloaded to your device after putting in building information)</li>
              </ul>
              <button
                onClick={() => navigate('/electricitySupplyForm')}
                className='mt-4 w-full px-4 py-2 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700'
              >
                Proceed to Application
              </button>
            </div>
          )}
        </div>

        <div className='mt-6 text-center text-sm text-gray-600'>
          <Link to={'/'} className='text-blue-700 hover:underline'>Back to login</Link>
        </div>
      </div>

      {/* Application Processing Modal */}
      {showProcessingModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
          <div className="bg-white p-6 sm:p-8 rounded-lg shadow-xl w-full max-w-md">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                </svg>
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Application Under Processing</h2>
              <p className="text-gray-600 text-sm mb-4">
                Your previous application is currently being processed.
              </p>
              
              {/* Application Status Information */}
              {applicationStatus && (
                <div className="bg-gray-50 p-4 rounded-lg border">
                  <h3 className="font-semibold text-gray-900 mb-2">Application Status</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tracking ID:</span>
                      <span className="font-mono font-semibold text-blue-600">{applicationStatus.tracking_id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <span className="font-semibold text-orange-600 capitalize">
                        {applicationStatus.status}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg mb-6">
              <h3 className="font-semibold text-blue-900 mb-3">Need Help?</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center">
                  <svg className="w-4 h-4 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                  </svg>
                  <span className="text-blue-800">customercare@ibedc.com</span>
                </div>
                <div className="flex items-center">
                  <svg className="w-4 h-4 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                  </svg>
                  <span className="text-blue-800">07001239999</span>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-3">Follow Us</h3>
              <div className="flex justify-center space-x-4">
                <a 
                  href="https://www.facebook.com/ibedc.ng" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a 
                  href="https://www.instagram.com/ibedc.ng" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-pink-600 text-white rounded-full flex items-center justify-center hover:bg-pink-700 transition-colors"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987s11.987-5.367 11.987-11.987C24.004 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.297C4.198 14.895 3.708 13.744 3.708 12.447s.49-2.448 1.297-3.323c.875-.807 2.026-1.297 3.323-1.297s2.448.49 3.323 1.297c.807.875 1.297 2.026 1.297 3.323s-.49 2.448-1.297 3.323c-.875.807-2.026 1.297-3.323 1.297zm7.718-1.297c-.875.807-2.026 1.297-3.323 1.297s-2.448-.49-3.323-1.297c-.807-.875-1.297-2.026-1.297-3.323s.49-2.448 1.297-3.323c.875-.807 2.026-1.297 3.323-1.297s2.448.49 3.323 1.297c.807.875 1.297 2.026 1.297 3.323s-.49 2.448-1.297 3.323z"/>
                  </svg>
                </a>
                <a 
                  href="https://www.twitter.com/ibedc_ng" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-blue-400 text-white rounded-full flex items-center justify-center hover:bg-blue-500 transition-colors"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </a>
              </div>
            </div>

            <div className="flex justify-center">
              <button
                onClick={() => setShowProcessingModal(false)}
                className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}


