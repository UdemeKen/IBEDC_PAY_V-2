import React, { useState, useEffect } from 'react';
import { Black_Logo } from '../../assets/images';
import { Ibedc_Approved_Logo } from '../../assets/images';
import { toast } from 'react-toastify';
import axiosClient from '../../axios';
import { useNavigate, useLocation } from 'react-router-dom';

export default function ConnectionDetailsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    tracking_id: '',
    comment: '',
  });
  const [loading, setLoading] = useState(false);
  const [loadingExit, setLoadingExit] = useState(false);
  
  // State for modal
  const [showModal, setShowModal] = useState(false);
  const [modalTrackingId, setModalTrackingId] = useState('');

  // Set tracking_id from localStorage
  useEffect(() => {
    const storedTrackingId = localStorage.getItem('TRACKING_ID');
    if (storedTrackingId) {
      setForm((prev) => ({ ...prev, tracking_id: storedTrackingId }));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => {
      const newForm = { ...prev, [name]: value };
      return newForm;
    });
  };

  const requiredFields = [
    'tracking_id',
  ];

  const validateForm = () => {
    const missing = requiredFields.filter(field => !form[field] || form[field].toString().trim() === '');
    return missing;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const missingFields = validateForm();
    if (missingFields.length > 0) {
      toast.error(`Please fill in the following field(s): ${missingFields.join(', ')}`);
      setLoading(false);
      return;
    }

    try {
      const response = await axiosClient.post('/V4IBEDC_new_account_setup_sync/initiate/complete-application', form);
      const data = response.data;
      if (data.success) {
        toast.success(data.message || 'Connection details submitted successfully!');
        navigate('/finalForm');
      } else {
        toast.error(data.message || 'An error occurred.');
      }
    } catch (error) {
      if (error.response?.data?.payload) {
        Object.entries(error.response.data.payload).forEach(([field, message]) => {
          if (message) {
            toast.error(`${message}`);
          }
        });
      } else {
        toast.error('Network error. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAndExit = async (e) => {
    e.preventDefault();
    setLoadingExit(true);
    const missingFields = validateForm();
    if (missingFields.length > 0) {
      toast.error(`Please fill in the following field(s): ${missingFields.join(', ')}`);
      setLoadingExit(false);
      return;
    }

    try {
      const response = await axiosClient.post('/V4IBEDC_new_account_setup_sync/initiate/complete-application', form);
      const data = response.data;
      if (data.success && form.tracking_id) {
        setModalTrackingId(form.tracking_id);
        setShowModal(true);
      } else if (data.success) {
        toast.success(data.message || 'Saved and exited successfully!');
        navigate('/');
      } else {
        toast.error(data.message || 'An error occurred.');
      }
    } catch (error) {
      if (error.response?.data?.payload) {
        Object.entries(error.response.data.payload).forEach(([field, message]) => {
          if (message) {
            toast.error(`${message}`);
          }
        });
      } else {
        toast.error('Network error. Please try again.');
      }
    } finally {
      setLoadingExit(false);
    }
  };

  return (
    <div
      style={{
        backgroundImage: `url(${Ibedc_Approved_Logo})`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        backgroundSize: 'contain',
        minHeight: '100vh',
        width: '100%',
        position: 'relative',
      }}
    >
      {/* Overlay for reduced opacity */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'rgba(255,255,255,0.85)',
        zIndex: 1,
      }} />
      <section style={{ position: 'relative', zIndex: 2 }}>
        {/* Header Section */}
        <div className='flex flex-col sm:flex-row bg-gray-200 rounded-lg px-2 sm:px-4 mx-2 sm:mx-10 mt-5'>
          <div className='flex flex-col sm:flex-row justify-center items-center w-full gap-4 sm:gap-72'>
            <div className='w-full sm:w-auto flex justify-center sm:justify-start'>
              <img src={Black_Logo} alt="logo" className='w-16 sm:w-20 h-8 sm:h-10' />
            </div>
            <div className='flex flex-col justify-center items-center text-base sm:text-xl w-full sm:w-1/2 h-auto sm:h-40 text-center px-2 sm:px-0'>
              <h2 className='font-bold text-lg sm:text-xl'>IBADAN ELECTRICITY DISTRIBUTION COMPANY PLC</h2>
              <h4 className='text-base sm:text-lg'>New Customer Account Creation Form</h4>
              <p className='text-sm sm:text-base text-center'>Application for electricity supply and agreement form (To be completed in duplicate by the applicant after studying the conditions and regulations of supply specified overleaf)</p>
              <p className='text-sm sm:text-base text-center'>Tracking ID: {form.tracking_id}</p>
            </div>
            <div className='text-gray-200 hidden sm:block'>
              <p>Kendrick</p>
            </div>
          </div>
        </div>

        {/* Title Section */}
        <div className='font-bold text-base sm:text-lg mt-4 sm:mt-8 mx-4 sm:mx-20 -mb-2'>
          <h1>PART 3: CONNECTION DETAILS</h1>
        </div>

        {/* Form Section */}
        <form onSubmit={handleSubmit} className="mx-2 sm:mx-4 md:mx-8 lg:mx-20 xl:mx-52 my-4 sm:my-10">
          <div className="bg-white p-4 sm:p-6 border rounded shadow-sm">
            {/* Connection Information Section */}
            <div className="mb-6">
              <h2 className="text-base sm:text-lg font-bold mb-4">Connection Information</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label className="block text-sm sm:text-base font-semibold mb-2">Connection Type:</label>
                  <select
                    name="connection_type"
                    value={form.connection_type}
                    onChange={handleChange}
                    className="w-full border rounded px-2 py-1 text-sm sm:text-base"
                    required
                  >
                    <option value="">Select Connection Type</option>
                    <option value="New Connection">New Connection</option>
                    <option value="Reconnection">Reconnection</option>
                    <option value="Change of Name">Change of Name</option>
                    <option value="Change of Address">Change of Address</option>
                    <option value="Change of Tariff">Change of Tariff</option>
                    <option value="Change of Meter">Change of Meter</option>
                    <option value="Others">Others</option>
                  </select>
                </div>

                {form.connection_type === 'Others' && (
                  <div>
                    <label className="block text-sm sm:text-base font-semibold mb-2">Specify Other Connection Type:</label>
                    <input
                      type="text"
                      name="others_in_connection_type"
                      value={form.others_in_connection_type}
                      onChange={handleChange}
                      className="w-full border rounded px-2 py-1 text-sm sm:text-base"
                      required
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm sm:text-base font-semibold mb-2">Connection Status:</label>
                  <select
                    name="connection_status"
                    value={form.connection_status}
                    onChange={handleChange}
                    className="w-full border rounded px-2 py-1 text-sm sm:text-base"
                    required
                  >
                    <option value="">Select Connection Status</option>
                    <option value="Connected">Connected</option>
                    <option value="Disconnected">Disconnected</option>
                    <option value="Pending">Pending</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm sm:text-base font-semibold mb-2">Connection Date:</label>
                  <input
                    type="date"
                    name="connection_date"
                    value={form.connection_date}
                    onChange={handleChange}
                    className="w-full border rounded px-2 py-1 text-sm sm:text-base"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm sm:text-base font-semibold mb-2">Connection Fee:</label>
                  <input
                    type="number"
                    name="connection_fee"
                    value={form.connection_fee}
                    onChange={handleChange}
                    className="w-full border rounded px-2 py-1 text-sm sm:text-base"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm sm:text-base font-semibold mb-2">Connection Fee Payment Status:</label>
                  <select
                    name="connection_fee_payment_status"
                    value={form.connection_fee_payment_status}
                    onChange={handleChange}
                    className="w-full border rounded px-2 py-1 text-sm sm:text-base"
                    required
                  >
                    <option value="">Select Payment Status</option>
                    <option value="Paid">Paid</option>
                    <option value="Unpaid">Unpaid</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm sm:text-base font-semibold mb-2">Connection Fee Payment Date:</label>
                  <input
                    type="date"
                    name="connection_fee_payment_date"
                    value={form.connection_fee_payment_date}
                    onChange={handleChange}
                    className="w-full border rounded px-2 py-1 text-sm sm:text-base"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm sm:text-base font-semibold mb-2">Connection Fee Payment Reference:</label>
                  <input
                    type="text"
                    name="connection_fee_payment_reference"
                    value={form.connection_fee_payment_reference}
                    onChange={handleChange}
                    className="w-full border rounded px-2 py-1 text-sm sm:text-base"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Previous Connection Details Section */}
            {(form.connection_type === 'Reconnection' || form.connection_type === 'Change of Name' || form.connection_type === 'Change of Address') && (
              <div className="mb-6">
                <h2 className="text-base sm:text-lg font-bold mb-4">Previous Connection Details</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <label className="block text-sm sm:text-base font-semibold mb-2">Previous Account Number:</label>
                    <input
                      type="text"
                      name="previous_account_number"
                      value={form.previous_account_number}
                      onChange={handleChange}
                      className="w-full border rounded px-2 py-1 text-sm sm:text-base"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm sm:text-base font-semibold mb-2">Previous Meter Number:</label>
                    <input
                      type="text"
                      name="previous_meter_number"
                      value={form.previous_meter_number}
                      onChange={handleChange}
                      className="w-full border rounded px-2 py-1 text-sm sm:text-base"
                      required
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-sm sm:text-base font-semibold mb-2">Previous Address:</label>
                    <textarea
                      name="previous_address"
                      value={form.previous_address}
                      onChange={handleChange}
                      className="w-full border rounded px-2 py-1 text-sm sm:text-base"
                      rows={3}
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Submit Buttons */}
            <div className="flex flex-col sm:flex-row justify-center gap-4 mt-6 sm:mt-8">
              <button
                type="submit"
                className="w-full sm:w-auto px-4 sm:px-6 py-2 text-sm sm:text-base bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Save and Continue'}
              </button>
              <button
                type="button"
                onClick={handleSaveAndExit}
                className="w-full sm:w-auto px-4 sm:px-6 py-2 text-sm sm:text-base bg-gray-400 text-white font-semibold rounded-lg shadow hover:bg-gray-500 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-300"
                disabled={loadingExit}
              >
                {loadingExit ? 'Saving...' : 'Save and Exit'}
              </button>
            </div>
          </div>
        </form>

        {/* Modal for tracking ID */}
        {showModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-4 sm:p-8 rounded shadow-lg max-w-md w-full mx-4 sm:mx-0 flex flex-col items-center">
              <h2 className="text-lg sm:text-xl font-bold mb-4 text-center text-blue-700">Please Take Note of Your Tracking ID</h2>
              <p className="mb-2 text-center text-sm sm:text-base">Your Tracking ID is:</p>
              <div className="text-xl sm:text-2xl font-mono font-bold text-blue-900 mb-4 p-2 border border-blue-300 rounded bg-blue-50 break-all">{modalTrackingId}</div>
              <p className="mb-4 text-center text-sm sm:text-base text-red-600 font-semibold">Please write down this Tracking ID. You will need it to continue your application in the future.</p>
              <button
                onClick={() => { setShowModal(false); navigate('/'); }}
                className="w-full sm:w-auto px-4 sm:px-6 py-2 text-sm sm:text-base bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
} 