import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosClient from '../../axios';
import { toast } from 'react-toastify';

export default function NewAccount() {
  const navigate = useNavigate();

  const [trackingId, setTrackingId] = useState('');
  const [loading, setLoading] = useState(false);
  const [showChecklist, setShowChecklist] = useState(false);

  const handleContinueWithTrackingId = async () => {
    if (!trackingId.trim()) return;
    setLoading(true);
    try {
      const response = await axiosClient.post('/V4IBEDC_new_account_setup_sync/initiate/track-application', { tracking_id: trackingId.trim() });
      const data = response.data;
      if (data.success && data.payload && data.payload.customer) {
        const customer = data.payload.customer;
        localStorage.setItem('TRACKING_ID', customer.tracking_id);
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
          toast.warn('Your previous application is currently being processed. Please check back after 10 days.');
          setLoading(false);
          return;
        }

        if (!customer.continuation) {
          navigate('/continuationForm', { state: { prefill: customer } });
        } else if (!customer.uploadinformation) {
          navigate('/finalForm', { state: { prefill: customer.continuation } });
        } else if (!customer.uploaded_pictures || customer.uploaded_pictures.length === 0) {
          navigate('/finalForm', { state: { prefill: customer.uploaded_pictures } });
        } else {
          navigate('/finalForm', { state: { prefill: customer.uploaded_pictures } });
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
                <li>Valid phone number and email address</li>
                <li>National Identification Number (NIN)</li>
                <li>Landlord's full name, phone number, and email</li>
                <li>Landlord's date of birth</li>
                <li>Landlord's means of identification (e.g., NIN, Driver's License, International Passport)</li>
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
    </section>
  );
}


