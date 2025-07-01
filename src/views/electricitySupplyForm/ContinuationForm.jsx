import React, { useState, useEffect } from 'react';
import { Black_Logo } from '../../assets/images';
import { Ibedc_Approved_Logo } from '../../assets/images';
import { toast } from 'react-toastify';
import axiosClient from '../../axios';
import { useNavigate, useLocation } from 'react-router-dom';

const landlordIdOptions = [
  'NIN',
  'International Passport',
  "Driver's License",
  'PVC',
];
const billMethods = [
  'Bill Sent By Email',
  'Bill Sent By SMS',
  'Bills Delivery to the House',
];

export default function ContinuationForm() {
  const location = useLocation();
  const [form, setForm] = useState({
    tracking_id: '',
    nin_number: '',
    landlord_surname: '',
    landlord_othernames: '',
    landlord_dob: '',
    landlord_telephone: '',
    landlord_email: '',
    name_address_of_previous_employer: '',
    previous_customer_address: '',
    previous_account_number: '',
    previous_meter_number: '',
    landlord_personal_identification: '',
    landloard_picture: null,
    prefered_method_of_recieving_bill: '',
    comments: 'Making the user go viral',
    no_of_account_apply_for: '0',
    latitude: '',
    longitude: '',
  });
  const [picturePreview, setPicturePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingExit, setLoadingExit] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalTrackingId, setModalTrackingId] = useState('');
  const navigate = useNavigate();

  // Set tracking_id from location.state if available
  useEffect(() => {
    if (location.state && location.state.prefill) {
      setForm(prev => ({
        ...prev,
        ...location.state.prefill,
        tracking_id: location.state.prefill.tracking_id || prev.tracking_id,
      }));
    } else if (location.state && location.state.trackingId) {
      setForm((prev) => ({ ...prev, tracking_id: location.state.trackingId }));
    } else {
      // Check localStorage if not in location state
      const storedTrackingId = localStorage.getItem('TRACKING_ID');
      if (storedTrackingId) {
        setForm((prev) => ({ ...prev, tracking_id: storedTrackingId }));
      }
    }
  }, [location.state]);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      setForm((prev) => ({ ...prev, [name]: files[0] }));
      if (files[0]) {
        const reader = new FileReader();
        reader.onloadend = () => setPicturePreview(reader.result);
        reader.readAsDataURL(files[0]);
      } else {
        setPicturePreview(null);
      }
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Helper: Validate required fields (customize as needed)
  const requiredFields = [
    // Add required fields here as per your business logic
    // 'tracking_id',
    // 'nin_number',
    // ...
  ];
  const validateForm = () => {
    const missing = requiredFields.filter(field => !form[field] || form[field].toString().trim() === '');
    return missing;
  };

  // API submit logic
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const missingFields = validateForm();
    if (missingFields.length > 0) {
      toast.error(`Please fill in the following field(s): ${missingFields.join(', ')}`);
      setLoading(false);
      return;
    }

    // Only include fields that exist in the continue_account_creations table
    const payload = {
      tracking_id: form.tracking_id,
      nin_number: form.nin_number,
      landlord_surname: form.landlord_surname,
      landlord_othernames: form.landlord_othernames,
      landlord_dob: form.landlord_dob,
      landlord_telephone: form.landlord_telephone,
      landlord_email: form.landlord_email,
      name_address_of_previous_employer: form.name_address_of_previous_employer,
      previous_customer_address: form.previous_customer_address,
      previous_account_number: form.previous_account_number,
      previous_meter_number: form.previous_meter_number,
      landlord_personal_identification: form.landlord_personal_identification,
      prefered_method_of_recieving_bill: form.prefered_method_of_recieving_bill,
      comments: form.comments,
      no_of_account_apply_for: form.no_of_account_apply_for,
      latitude: localStorage.getItem('LATITUDE') || '',
      longitude: localStorage.getItem('LONGITUDE') || '',
    };

    // If file, handle FormData
    let dataToSend = payload;
    let config = {};
    if (form.landloard_picture) {
      dataToSend = new FormData();
      Object.entries(payload).forEach(([key, value]) => {
        if (key === 'landloard_picture' && value) {
          dataToSend.append(key, value);
        } else {
          dataToSend.append(key, value || '');
        }
      });
      config = { headers: { 'Content-Type': 'multipart/form-data' } };
    }

    try {
      const response = await axiosClient.post('/V4IBEDC_new_account_setup_sync/initiate/continue-application', dataToSend, config);
      const data = response.data;
      if (data.success) {
        toast.success(data.message || 'Continuation submitted successfully!');
        navigate('/finalForm');
      } else {
        toast.error(data.message || 'An error occurred.');
      }
    } catch (error) {
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Network error. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Save and Exit logic (optional, similar to handleSubmit)
  const handleSaveAndExit = async (e) => {
    e.preventDefault();
    setLoadingExit(true);
    const missingFields = validateForm();
    if (missingFields.length > 0) {
      toast.error(`Please fill in the following field(s): ${missingFields.join(', ')}`);
      setLoadingExit(false);
      return;
    }

    // Only include fields that exist in the continue_account_creations table
    const payload = {
      tracking_id: form.tracking_id,
      nin_number: form.nin_number,
      landlord_surname: form.landlord_surname,
      landlord_othernames: form.landlord_othernames,
      landlord_dob: form.landlord_dob,
      landlord_telephone: form.landlord_telephone,
      landlord_email: form.landlord_email,
      name_address_of_previous_employer: form.name_address_of_previous_employer,
      previous_customer_address: form.previous_customer_address,
      previous_account_number: form.previous_account_number,
      previous_meter_number: form.previous_meter_number,
      landlord_personal_identification: form.landlord_personal_identification,
      prefered_method_of_recieving_bill: form.prefered_method_of_recieving_bill,
      comments: form.comments,
      no_of_account_apply_for: form.no_of_account_apply_for,
      latitude: localStorage.getItem('LATITUDE') || '',
      longitude: localStorage.getItem('LONGITUDE') || '',
    };

    let dataToSend = payload;
    let config = {};
    if (form.landloard_picture) {
      dataToSend = new FormData();
      Object.entries(payload).forEach(([key, value]) => {
        if (key === 'landloard_picture' && value) {
          dataToSend.append(key, value);
        } else {
          dataToSend.append(key, value || '');
        }
      });
      config = { headers: { 'Content-Type': 'multipart/form-data' } };
    }

    try {
      const response = await axiosClient.post('/V4IBEDC_new_account_setup_sync/initiate/continue-application', dataToSend, config);
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
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
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
          <h1>PART 2: CUSTOMER DETAILS CONTINUATION</h1>
        </div>

        {/* Form Section */}
        <form onSubmit={handleSubmit} className="mx-2 sm:mx-4 md:mx-8 lg:mx-20 xl:mx-52 my-4 sm:my-10">
          <div className="bg-white p-4 sm:p-6 border rounded shadow-sm">
            {/* Landlord Information Section */}
            <div className="mb-6">
              <h2 className="text-base sm:text-lg font-bold mb-4">Landlord Information</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label className="block text-sm sm:text-base font-semibold mb-2">NIN Number:</label>
                  <input
                    type="text"
                    name="nin_number"
                    value={form.nin_number}
                    onChange={handleChange}
                    className="w-full border rounded px-2 py-1 text-sm sm:text-base"
                  />
                </div>

                <div>
                  <label className="block text-sm sm:text-base font-semibold mb-2">Landlord Surname:</label>
                  <input
                    type="text"
                    name="landlord_surname"
                    value={form.landlord_surname}
                    onChange={handleChange}
                    className="w-full border rounded px-2 py-1 text-sm sm:text-base"
                  />
                </div>

                <div>
                  <label className="block text-sm sm:text-base font-semibold mb-2">Landlord Other Names:</label>
                  <input
                    type="text"
                    name="landlord_othernames"
                    value={form.landlord_othernames}
                    onChange={handleChange}
                    className="w-full border rounded px-2 py-1 text-sm sm:text-base"
                  />
                </div>

                <div>
                  <label className="block text-sm sm:text-base font-semibold mb-2">Landlord Date of Birth:</label>
                  <input
                    type="date"
                    name="landlord_dob"
                    value={form.landlord_dob}
                    onChange={handleChange}
                    className="w-full border rounded px-2 py-1 text-sm sm:text-base"
                  />
                </div>

                <div>
                  <label className="block text-sm sm:text-base font-semibold mb-2">Landlord Telephone:</label>
                  <input
                    type="tel"
                    name="landlord_telephone"
                    value={form.landlord_telephone}
                    onChange={handleChange}
                    className="w-full border rounded px-2 py-1 text-sm sm:text-base"
                  />
                </div>

                <div>
                  <label className="block text-sm sm:text-base font-semibold mb-2">Landlord Email:</label>
                  <input
                    type="email"
                    name="landlord_email"
                    value={form.landlord_email}
                    onChange={handleChange}
                    className="w-full border rounded px-2 py-1 text-sm sm:text-base"
                  />
                </div>

                <div>
                  <label className="block text-sm sm:text-base font-semibold mb-2">Number of Accounts to Apply For:</label>
                  <input
                    type="number"
                    name="no_of_account_apply_for"
                    value={form.no_of_account_apply_for}
                    onChange={handleChange}
                    className="w-full border rounded px-2 py-1 text-sm sm:text-base"
                  />
                </div>

                <div>
                  <label className="block text-sm sm:text-base font-semibold mb-2">Landlord Personal Identification:</label>
                  <select
                    name="landlord_personal_identification"
                    value={form.landlord_personal_identification}
                    onChange={handleChange}
                    className="w-full border rounded px-2 py-1 text-sm sm:text-base"
                  >
                    <option value="">Select ID Type</option>
                    {landlordIdOptions.map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm sm:text-base font-semibold mb-2">Landlord Picture:</label>
                  <input
                    type="file"
                    name="landloard_picture"
                    onChange={handleChange}
                    accept="image/*"
                    className="w-full text-xs sm:text-sm text-gray-500
                      file:mr-2 sm:file:mr-4 file:py-1 sm:file:py-2 file:px-2 sm:file:px-4
                      file:rounded-full file:border-0
                      file:text-xs sm:file:text-sm file:font-semibold
                      file:bg-blue-50 file:text-blue-700
                      hover:file:bg-blue-100"
                  />
                  {picturePreview && (
                    <img
                      src={picturePreview}
                      alt="Landlord Preview"
                      className="mt-2 w-32 h-32 object-cover border rounded"
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Previous Information Section */}
            <div className="mb-6">
              <h2 className="text-base sm:text-lg font-bold mb-4">Previous Information</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label className="block text-sm sm:text-base font-semibold mb-2">Name/Address of Previous Employer:</label>
                  <input
                    type="text"
                    name="name_address_of_previous_employer"
                    value={form.name_address_of_previous_employer}
                    onChange={handleChange}
                    className="w-full border rounded px-2 py-1 text-sm sm:text-base"
                  />
                </div>

                <div>
                  <label className="block text-sm sm:text-base font-semibold mb-2">Previous Customer Address:</label>
                  <input
                    type="text"
                    name="previous_customer_address"
                    value={form.previous_customer_address}
                    onChange={handleChange}
                    className="w-full border rounded px-2 py-1 text-sm sm:text-base"
                  />
                </div>

                <div>
                  <label className="block text-sm sm:text-base font-semibold mb-2">Previous Account Number:</label>
                  <input
                    type="text"
                    name="previous_account_number"
                    value={form.previous_account_number}
                    onChange={handleChange}
                    className="w-full border rounded px-2 py-1 text-sm sm:text-base"
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
                  />
                </div>
              </div>
            </div>

            {/* Bill Receiving Method Section */}
            <div className="mb-6">
              <h2 className="text-base sm:text-lg font-bold mb-4">Bill Receiving Method</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label className="block text-sm sm:text-base font-semibold mb-2">Preferred Method of Receiving Bill:</label>
                  <select
                    name="prefered_method_of_recieving_bill"
                    value={form.prefered_method_of_recieving_bill}
                    onChange={handleChange}
                    className="w-full border rounded px-2 py-1 text-sm sm:text-base"
                  >
                    <option value="">Select Method</option>
                    {billMethods.map((method) => (
                      <option key={method} value={method}>{method}</option>
                    ))}
                  </select>
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
                {loading ? 'Submitting...' : 'Submit'}
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