import React, { useState, useEffect } from 'react'
import { IBEDC_logo_Blue } from '../../assets/images'
import { Ibedc_Approved_Logo, } from '../../assets/images'
import { toast } from 'react-toastify';
import axiosClient from '../../axios';
import { Link, useLocation, useNavigate } from 'react-router-dom';

export default function ElectricitySupplyForm() {
  const location = useLocation();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    surname: '',
    firstname: '',
    other_name: '',
    title: '',
    phone: '',
    email: '',
  });
  const [loading, setLoading] = useState(false);
  const [loading01, setLoading01] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [trackingId, setTrackingId] = useState('');
  const [lastResponse, setLastResponse] = useState(null);

  const requiredFields = [
    'surname', 'firstname', 'other_name', 'title', 'phone', 'email'
  ];

  const validateForm = () => {
    const missing = requiredFields.filter(field => !form[field] || form[field].toString().trim() === '');
    return missing;
  };

  useEffect(() => {
    if (location.state && location.state.prefill) {
      const prefill = location.state.prefill;
      setForm(prev => ({
        ...prev,
        surname: prefill.surname || '',
        firstname: prefill.firstname || '',
        other_name: prefill.other_name || '',
        title: prefill.title || '',
        phone: prefill.phone || '',
        email: prefill.email || '',
      }));
    }
  }, [location.state]);

  const titles = ['Mr', 'Mrs', 'Miss', 'Dr', 'Prof'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Save and Continue (submit form)
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
      const response = await axiosClient.post('/V4IBEDC_new_account_setup_sync/initiate/register-customer', form);
      console.log(response.data);
      if (response.data.success || response.response.data.success) {
        const data = response.data;
        setLastResponse(data);
        setTrackingId(data.payload.customer.tracking_id);
        toast.success(data.message || 'Customer created successfully!');
        navigate(`/continuationForm?trackingId=${encodeURIComponent(data.payload.customer.tracking_id)}`);
      } else if (response.response.data.message === 'Validation error') {
        toast.error(response.response.data.payload.phone || 'An error occurred.');
        toast.error(response.response.data.payload.email || 'An error occurred.');
      } else {
        toast.error(response.response.data.payload || 'An error occurred.');
      }
    } catch (error) {
      console.log(error.response.data.success);
      toast.error(error.response.data.payload.phone || 'An error occurred.');
      toast.error(error.response.data.payload.email || 'An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  // Save and Exit (show modal with tracking id)
  const handleSaveAndExit = async (e) => {
    e.preventDefault();
    setLoading01(true);
    const missingFields = validateForm();
    if (missingFields.length > 0) {
      toast.error(`Please fill in the following field(s): ${missingFields.join(', ')}`);
      setLoading01(false);
      return;
    }
    try {
      const response = await axiosClient.post('/V4IBEDC_new_account_setup_sync/initiate/register-customer', form);
      console.log(response.response.data.success);
      if (response.response.data.success) {
        const data = response.data;
        setLastResponse(data);
        setTrackingId(data.payload.customer.tracking_id);
        setShowModal(true);
      } else {
        toast.error(response.response.data.payload || 'An error occurred.');
      }
    } catch (error) {
      console.log(error);
    } 
    finally {
      setLoading01(false);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    navigate('/');
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
            <Link to={'/'} className='w-full sm:w-auto flex justify-center sm:justify-start'>
              <img src={IBEDC_logo_Blue} alt="logo" className='w-20 sm:w-40 h-10 sm:h-20' />
            </Link>
            <div className='flex flex-col justify-center items-center text-base sm:text-xl w-full sm:w-1/2 h-auto sm:h-40 text-center px-2 sm:px-0'>
              <h2 className='font-bold text-lg sm:text-xl'>IBADAN ELECTRICITY DISTRIBUTION COMPANY PLC</h2>
              <h4 className='text-base sm:text-lg'>New Customer Account Creation Form</h4>
              <p className='text-sm sm:text-base text-center'>Application for electricity supply and agreement form</p>
            </div>
            <div className='text-gray-200 hidden sm:block'>
              <p>Kendrick</p>
            </div>
          </div>
        </div>

        {/* Title Section */}
        <div className='font-bold text-base sm:text-lg mt-4 sm:mt-8 mx-4 sm:mx-20 -mb-2'>
          <h1>PART 1: CUSTOMER DETAILS</h1>
        </div>

        {/* Form Section */}
        <form onSubmit={handleSubmit} className="mx-2 sm:mx-4 md:mx-8 lg:mx-20 xl:mx-52 my-4 sm:my-10">
          <div className="bg-white p-4 sm:p-6 border rounded shadow-sm">
            {/* Personal Information Section */}
            <div className="mb-6">
              <h2 className="text-base sm:text-lg font-bold mb-4">Personal Information</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label className="block text-sm sm:text-base font-semibold mb-2">Title*:</label>
                  <select
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    className="w-full border rounded px-2 py-1 text-sm sm:text-base"
                    required
                  >
                    <option value="">Select Title</option>
                    {titles.map((title) => (
                      <option key={title} value={title}>{title}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm sm:text-base font-semibold mb-2">Surname*:</label>
                  <input
                    type="text"
                    name="surname"
                    value={form.surname}
                    onChange={handleChange}
                    className="w-full border rounded px-2 py-1 text-sm sm:text-base"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm sm:text-base font-semibold mb-2">First Name*:</label>
                  <input
                    type="text"
                    name="firstname"
                    value={form.firstname}
                    onChange={handleChange}
                    className="w-full border rounded px-2 py-1 text-sm sm:text-base"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm sm:text-base font-semibold mb-2">Other Names*:</label>
                  <input
                    type="text"
                    name="other_name"
                    value={form.other_name}
                    onChange={handleChange}
                    className="w-full border rounded px-2 py-1 text-sm sm:text-base"
                  />
                </div>

                <div>
                  <label className="block text-sm sm:text-base font-semibold mb-2">Phone Number*:</label>
                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    className="w-full border rounded px-2 py-1 text-sm sm:text-base"
                    required
                    pattern="[0-9]{11}"
                    title="Please enter a valid 11-digit phone number"
                  />
                </div>

                <div>
                  <label className="block text-sm sm:text-base font-semibold mb-2">Email*:</label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    className="w-full border rounded px-2 py-1 text-sm sm:text-base"
                    required
                    pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
                    title="Please enter a valid email address"
                  />
                </div>
              </div>
            </div>

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
                disabled={loading01}
              >
                {loading01 ? 'Saving...' : 'Save and Exit'}
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
              <div className="text-xl sm:text-2xl font-mono font-bold text-blue-900 mb-4 p-2 border border-blue-300 rounded bg-blue-50 break-all">{trackingId}</div>
              <p className="mb-4 text-center text-sm sm:text-base text-red-600 font-semibold">Please write down this Tracking ID. You will need it to continue your application in the future.</p>
              <button
                onClick={closeModal}
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
