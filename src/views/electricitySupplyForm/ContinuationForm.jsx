import React, { useState, useEffect } from 'react';
import { IBEDC_logo_Blue } from '../../assets/images';
import { Ibedc_Approved_Logo } from '../../assets/images';
import { toast } from 'react-toastify';
import axiosClient from '../../axios';
import { useNavigate, useLocation, Link, useSearchParams } from 'react-router-dom';

const landlordIdOptions = [
  'NIN',
  'International Passport',
  "Driver's License",
  'PVC',
];
// Display-only suffixes; actual value sent to API will be prefixed with "Bill Sent "
const billMethods = [
  'By Email',
  'By SMS',
];

export default function ContinuationForm() {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [form, setForm] = useState({
    tracking_id: '',
    nin_number: '',
    landlord_surname: '',
    landlord_othernames: '',
    landlord_dob: '',
    landlord_telephone: '',
    // landlord_alternate_telephone: '', // NEW FIELD
    landlord_email: '',
    name_address_of_previous_employer: '',
    previous_customer_address: '',
    previous_account_number: '',
    previous_meter_number: '',
    landlord_personal_identification: 'NIN',
    landloard_picture: null,
    nin_slip: null,
    cac_slip: null,
    organisational_name: '',
    is_organizational_account: false,
    prefered_method_of_recieving_bill: '',
    comments: 'Making the user go viral',
    no_of_account_apply_for: '1',
    latitude: '0.39849',
    longitude: '1.9849',
  });
  const [picturePreview, setPicturePreview] = useState(null);
  const [ninPreviewUrl, setNinPreviewUrl] = useState(null);
  const [ninIsPdf, setNinIsPdf] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingExit, setLoadingExit] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalTrackingId, setModalTrackingId] = useState('');
  const [isUpdateMode, setIsUpdateMode] = useState(false);
  const [fetchingData, setFetchingData] = useState(false);
  
  const navigate = useNavigate();

  // Fetch existing data for update mode
  const fetchExistingData = async (trackingId) => {
    setFetchingData(true);
    try {
      const response = await axiosClient.post('/V4IBEDC_new_account_setup_sync/initiate/track-application', {
        tracking_id: trackingId
      });
      
      if (response.data.success && response.data.payload?.customer?.continuation) {
        const continuation = response.data.payload.customer.continuation;
        setForm(prev => ({
          ...prev,
          tracking_id: trackingId,
          nin_number: continuation.nin_number || '',
          landlord_surname: continuation.landlord_surname || '',
          landlord_othernames: continuation.landlord_othernames || '',
          landlord_dob: continuation.landlord_dob || '',
          landlord_telephone: continuation.landlord_telephone || '',
          landlord_email: continuation.landlord_email || '',
          name_address_of_previous_employer: continuation.name_address_of_previous_employer || '',
          previous_customer_address: continuation.previous_customer_address || '',
          previous_account_number: continuation.previous_account_number || '',
          previous_meter_number: continuation.previous_meter_number || '',
          landlord_personal_identification: continuation.landlord_personal_identification || 'NIN',
          prefered_method_of_recieving_bill: continuation.prefered_method_of_recieving_bill?.replace('Bill Sent ', '') || '',
          comments: continuation.comments || '',
          no_of_account_apply_for: continuation.no_of_account_apply_for || '1',
          organisational_name: continuation.organisational_name || '',
          is_organizational_account: !!continuation.organisational_name
        }));
        setIsUpdateMode(true);
        toast.success('Existing data loaded. You can now make updates.');
      } else {
        toast.error('No existing data found for this tracking ID');
      }
    } catch (error) {
      console.error('Error fetching existing data:', error);
      toast.error('Failed to load existing data');
    } finally {
      setFetchingData(false);
    }
  };

  // Set tracking_id from URL or location.state
  useEffect(() => {
    if (location.state && location.state.prefill) {
      setForm(prev => ({
        ...prev,
        ...location.state.prefill,
        tracking_id: location.state.prefill.tracking_id || prev.tracking_id,
      }));
    } else {
      const urlTrackingId = searchParams.get('trackingId') || searchParams.get('tracking_id') || searchParams.get('id');
      const isUpdate = searchParams.get('update') === 'true';
      
      if (urlTrackingId) {
        setForm((prev) => ({ ...prev, tracking_id: urlTrackingId }));
        
        // If this is an update scenario, fetch existing data
        if (isUpdate) {
          fetchExistingData(urlTrackingId);
        }
      }
    }
  }, [location.state, searchParams]);

  const handleChange = (e) => {
    const { name, value, type, files, checked } = e.target;
    if (type === 'file') {
      const file = files && files[0] ? files[0] : null;
      setForm((prev) => ({ ...prev, [name]: file }));
      if (name === 'landloard_picture') {
        if (file) {
          const reader = new FileReader();
          reader.onloadend = () => setPicturePreview(reader.result);
          reader.readAsDataURL(file);
        } else {
          setPicturePreview(null);
        }
      } else if (name === 'nin_slip') {
        // Revoke previous preview URL if exists
        if (ninPreviewUrl) {
          URL.revokeObjectURL(ninPreviewUrl);
        }
        if (file) {
          const isPdf = file.type === 'application/pdf' || (file.name && file.name.toLowerCase().endsWith('.pdf'));
          setNinIsPdf(isPdf);
          const objectUrl = URL.createObjectURL(file);
          setNinPreviewUrl(objectUrl);
        } else {
          setNinIsPdf(false);
          setNinPreviewUrl(null);
        }
      }
    } else if (type === 'checkbox') {
      setForm((prev) => ({ ...prev, [name]: checked }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Cleanup preview URL on unmount or when it changes
  useEffect(() => {
    return () => {
      if (ninPreviewUrl) {
        URL.revokeObjectURL(ninPreviewUrl);
      }
    };
  }, [ninPreviewUrl]);

  // Helper: Validate required fields (manual mode only)
  const requiredFields = [
    'tracking_id',
    'nin_number',
    'landlord_surname',
    'landlord_othernames',
    'landlord_dob',
    'landlord_telephone',
    'landlord_email',
  ];

  const validateForm = () => {
    return requiredFields.filter(field => !form[field] || form[field].toString().trim() === '');
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
      // landlord_alternate_telephone: form.landlord_alternate_telephone, // NEW FIELD
      landlord_email: form.landlord_email,
      name_address_of_previous_employer: form.name_address_of_previous_employer,
      previous_customer_address: form.previous_customer_address,
      previous_account_number: form.previous_account_number,
      previous_meter_number: form.previous_meter_number,
      landlord_personal_identification: form.landlord_personal_identification,
      ...(form.is_organizational_account && { organisational_name: form.organisational_name }),
      prefered_method_of_recieving_bill: form.prefered_method_of_recieving_bill ? `Bill Sent ${form.prefered_method_of_recieving_bill}` : '',
      comments: form.comments,
      no_of_account_apply_for: form.no_of_account_apply_for,
      latitude: localStorage.getItem('LATITUDE') || '0.00000',
      longitude: localStorage.getItem('LONGITUDE') || '0.00000',
    };

    // If file, handle FormData
    let dataToSend = payload;
    let config = {};
    if (form.landloard_picture || form.nin_slip || (form.is_organizational_account && form.cac_slip)) {
      dataToSend = new FormData();
      Object.entries(payload).forEach(([key, value]) => {
        dataToSend.append(key, value || '');
      });
      if (form.landloard_picture) dataToSend.append('landloard_picture', form.landloard_picture);
      if (form.nin_slip) dataToSend.append('nin_slip', form.nin_slip);
      if (form.is_organizational_account && form.cac_slip) dataToSend.append('cac_slip', form.cac_slip);
      config = { headers: { 'Content-Type': 'multipart/form-data' } };
    }

    try {
      // Use update API if in update mode, otherwise use continue-application API
      const apiEndpoint = isUpdateMode 
        ? '/V4IBEDC_new_account_setup_sync/initiate/edit_landlord_information'
        : '/V4IBEDC_new_account_setup_sync/initiate/continue-application';
      
      const response = await axiosClient.post(apiEndpoint, dataToSend, config);
      console.log(response);
      if (response?.response?.data?.success === false) {
        toast.error(response.response.data.payload || 'An error occurred.');
      } else {
      const data = response.data;
      console.log(data);
      if (data.success || response.response.data.success) {
        const successMessage = isUpdateMode 
          ? 'Landlord information updated successfully!' 
          : 'Continuation submitted successfully!';
        toast.success(data.message || successMessage);
        
        if (isUpdateMode) {
          // Navigate back to final form after update
          navigate(`/finalForm?trackingId=${encodeURIComponent(form.tracking_id)}`);
        } else {
          const numAccounts = parseInt(form.no_of_account_apply_for) || 1;
          navigate(`/finalForm?trackingId=${encodeURIComponent(form.tracking_id)}${Number.isFinite(numAccounts) ? `&numAccounts=${numAccounts}` : ''}`);
        }
      } else {
        toast.error(response.response.data.payload?.nin_number || response.response.data.payload || 'An error occurred.');
        toast.error(data.payload?.nin_number || data.message || 'An error occurred.');
      }
    }
    } catch (error) {
      console.log(error.response?.data?.success);
      if (error.response?.data?.success === false) {
        const errorPayload = error.response?.data?.payload || error.response.data.payload;
        const firstError = Object.values(errorPayload).find(value => value !== null && value !== undefined);
        toast.error(firstError || 'An error occurred.');
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
      // landlord_alternate_telephone: form.landlord_alternate_telephone, // NEW FIELD
      landlord_email: form.landlord_email,
      name_address_of_previous_employer: form.name_address_of_previous_employer,
      previous_customer_address: form.previous_customer_address,
      previous_account_number: form.previous_account_number,
      previous_meter_number: form.previous_meter_number,
      landlord_personal_identification: form.landlord_personal_identification,
      ...(form.is_organizational_account && { organisational_name: form.organisational_name }),
      prefered_method_of_recieving_bill: form.prefered_method_of_recieving_bill ? `Bill Sent ${form.prefered_method_of_recieving_bill}` : '',
      comments: form.comments,
      no_of_account_apply_for: form.no_of_account_apply_for,
      latitude: localStorage.getItem('LATITUDE') || '0.00000',
      longitude: localStorage.getItem('LONGITUDE') || '0.00000',
    };
    console.log(payload);
    

    let dataToSend = payload;
    let config = {};
    if (form.landloard_picture || form.nin_slip || (form.is_organizational_account && form.cac_slip)) {
      dataToSend = new FormData();
      Object.entries(payload).forEach(([key, value]) => {
        dataToSend.append(key, value || '');
      });
      if (form.landloard_picture) dataToSend.append('landloard_picture', form.landloard_picture);
      if (form.nin_slip) dataToSend.append('nin_slip', form.nin_slip);
      if (form.is_organizational_account && form.cac_slip) dataToSend.append('cac_slip', form.cac_slip);
      config = { headers: { 'Content-Type': 'multipart/form-data' } };
    }

    try {
      // Use update API if in update mode, otherwise use continue-application API
      const apiEndpoint = isUpdateMode 
        ? '/V4IBEDC_new_account_setup_sync/initiate/edit_landlord_information'
        : '/V4IBEDC_new_account_setup_sync/initiate/continue-application';
      
      const response = await axiosClient.post(apiEndpoint, dataToSend, config);
      console.log(response?.response?.data);
      if (response?.response?.data?.success === false) {
        toast.error(response.response.data.payload || 'An error occurred.');
      } else {
      const data = response.data;
      if (data.success && form.tracking_id) {
        if (isUpdateMode) {
          toast.success('Landlord information updated successfully!');
          navigate('/finalForm?trackingId=' + encodeURIComponent(form.tracking_id));
        } else {
          setModalTrackingId(form.tracking_id);
          setShowModal(true);
        }
      } else if (data.success) {
        toast.success(data.message || 'Saved and exited successfully!');
        navigate('/');
      } else {
        toast.error(data.payload?.nin_number || data.message || 'An error occurred.');
      }
    }
    } catch (error) {
      if (error.response?.data?.message) {
        const errorPayload = error.response?.data?.payload || error.response.data.payload;
        const firstError = Object.values(errorPayload).find(value => value !== null && value !== undefined);
        toast.error(firstError || 'An error occurred.');
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
            <Link to={'/'} className='w-full sm:w-auto flex justify-center sm:justify-start'>
            <img src={IBEDC_logo_Blue} alt="logo" className='w-20 sm:w-40 h-10 sm:h-20' />
            </Link>
            <div className='flex flex-col justify-center items-center text-base sm:text-xl w-full sm:w-1/2 h-auto sm:h-40 text-center px-2 sm:px-0'>
              <h2 className='font-bold text-lg sm:text-xl'>IBADAN ELECTRICITY DISTRIBUTION COMPANY PLC</h2>
              <h4 className='text-base sm:text-lg'>New Customer Account Creation Form</h4>
              <p className='text-sm sm:text-base text-center'>Application for electricity supply and agreement form</p>
              <p className='text-sm sm:text-base text-center'>Tracking ID: {form.tracking_id}</p>
            </div>
            <div className='text-gray-200 hidden sm:block'>
              <p>Kendrick</p>
            </div>
          </div>
        </div>

        {/* Title Section */}
        <div className='font-bold text-base sm:text-lg mt-4 sm:mt-8 mx-4 sm:mx-20 -mb-2'>
          <h1>PART 2: LANDLORD'S INFORMATION {isUpdateMode && <span className="text-blue-600 text-sm">(Update Mode)</span>}</h1>
          {fetchingData && <p className="text-sm text-blue-600 mt-2">Loading existing data...</p>}
        </div>

        {/* Form Section */}
        <form onSubmit={handleSubmit} className="mx-2 sm:mx-4 md:mx-8 lg:mx-20 xl:mx-52 my-4 sm:my-10">
          <div className="bg-white p-4 sm:p-6 border rounded shadow-sm">
            {/* Landlord Information Section */}
            <div className="mb-6">
              <h2 className="text-base sm:text-lg font-bold mb-4">Landlord's Information</h2>
              
              {/* Manual Mode Only */}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label className="block text-sm sm:text-base font-semibold mb-2">NIN Number:</label>
                  <div className="flex gap-2 items-center">
                    <input
                      type="text"
                      name="nin_number"
                      value={form.nin_number}
                      onChange={handleChange}
                      required
                      pattern="[0-9]{11}"
                      title="Please enter a valid 11-digit NIN number"
                      className="w-full border rounded px-2 py-1 text-sm sm:text-base"
                    />
                  </div>
                </div>
                <>
                <div>
                  <label className="block text-sm sm:text-base font-semibold mb-2">Landlord Surname:</label>
                  <input
                    type="text"
                    name="landlord_surname"
                    value={form.landlord_surname}
                    onChange={handleChange}
                    required
                    className="w-full border rounded px-2 py-1 text-sm sm:text-base"
                    // placeholder={manualMode ? "Enter landlord surname" : ""}
                  />
                </div>
                <div>
                  <label className="block text-sm sm:text-base font-semibold mb-2">Landlord Other Names:</label>
                  <input
                    type="text"
                    name="landlord_othernames"
                    value={form.landlord_othernames}
                    onChange={handleChange}
                    required
                    className="w-full border rounded px-2 py-1 text-sm sm:text-base"
                    // placeholder={manualMode ? "Enter landlord other names" : ""}
                  />
                </div>
                <div>
                  <label className="block text-sm sm:text-base font-semibold mb-2">Landlord Date of Birth:</label>
                  <input
                    type="date"
                    name="landlord_dob"
                    value={form.landlord_dob}
                    onChange={handleChange}
                    required
                    className="w-full border rounded px-2 py-1 text-sm sm:text-base"
                    max={new Date(new Date().setFullYear(new Date().getFullYear() - 18)).toISOString().split('T')[0]}
                  />
                </div>
                <div>
                  <label className="block text-sm sm:text-base font-semibold mb-2">Landlord Telephone:</label>
                  <input
                    type="tel"
                    name="landlord_telephone"
                    value={form.landlord_telephone}
                    onChange={handleChange}
                    required
                    pattern="[0-9]{11}"
                    title="Please enter a valid 11-digit phone number"
                    className="w-full border rounded px-2 py-1 text-sm sm:text-base"
                    // placeholder={manualMode ? "Enter landlord phone number" : ""}
                  />
                </div>
                {/* <div>
                  <label className="block text-sm sm:text-base font-semibold mb-2">Alternate Landlord Telephone:</label>
                  <input
                    type="tel"
                    name="landlord_alternate_telephone"
                    value={form.landlord_alternate_telephone}
                    onChange={handleChange}
                    className="w-full border rounded px-2 py-1 text-sm sm:text-base"
                    placeholder="Enter alternate phone number (optional)"
                  />
                </div> */}
                <div>
                  <label className="block text-sm sm:text-base font-semibold mb-2">Landlord Email:</label>
                  <input
                    type="email"
                    name="landlord_email"
                    value={form.landlord_email}
                    onChange={handleChange}
                    required
                    pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
                    title="Please enter a valid email address"
                    className="w-full border rounded px-2 py-1 text-sm sm:text-base"
                    // placeholder={manualMode ? "Enter landlord email" : ""}
                  />
                </div>
                <div>
                  <label className="block text-sm sm:text-base font-semibold mb-2">NIN Slip:</label>
                  <input
                    type="file"
                    name="nin_slip"
                    onChange={handleChange}
                    required
                    accept="image/*,application/pdf"
                    className="w-full text-xs sm:text-sm text-gray-500
                      file:mr-2 sm:file:mr-4 file:py-1 sm:file:py-2 file:px-2 sm:file:px-4
                      file:rounded-full file:border-0
                      file:text-xs sm:file:text-sm file:font-semibold
                      file:bg-blue-50 file:text-blue-700
                      hover:file:bg-blue-100"
                  />
                  {ninPreviewUrl && (
                    <div className="mt-2">
                      {ninIsPdf ? (
                        <a
                          href={ninPreviewUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 underline text-sm"
                        >
                          Open PDF preview
                        </a>
                      ) : (
                        <img
                          src={ninPreviewUrl}
                          alt="NIN Slip Preview"
                          className="mt-2 w-32 h-32 object-cover border rounded"
                        />
                      )}
                    </div>
                  )}
                </div>
                <>
                <div>
                  <label className="block text-sm sm:text-base font-semibold mb-2">Number of Accounts to Apply For:</label>
                  <input
                    type="number"
                    name="no_of_account_apply_for"
                    value={form.no_of_account_apply_for}
                    required
                    onChange={handleChange}
                    className="w-full border rounded px-2 py-1 text-sm sm:text-base"
                  />
                </div>
                {/* <div>
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
                </div> */}
                <div>
                  <label className="block text-sm sm:text-base font-semibold mb-2">Landlord Picture:</label>
                  <input
                    type="file"
                    name="landloard_picture"
                    onChange={handleChange}
                    required
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
                </>
                {/* Organizational Account Checkbox */}
                <div className="col-span-1 sm:col-span-2">
                  <div className="flex items-center mb-4">
                    <input
                      type="checkbox"
                      name="is_organizational_account"
                      checked={form.is_organizational_account}
                      onChange={handleChange}
                      className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label className="text-sm sm:text-base font-semibold text-gray-700">
                      Is this account for an organization?
                    </label>
                  </div>
                </div>

                {/* Organizational Fields - Only show if checkbox is checked */}
                {form.is_organizational_account && (
                  <>
                    <div>
                      <label className="block text-sm sm:text-base font-semibold mb-2">CAC Slip:</label>
                      <input
                        type="file"
                        name="cac_slip"
                        onChange={handleChange}
                        accept="image/*,application/pdf"
                        className="w-full text-xs sm:text-sm text-gray-500
                          file:mr-2 sm:file:mr-4 file:py-1 sm:file:py-2 file:px-2 sm:file:px-4
                          file:rounded-full file:border-0
                          file:text-xs sm:file:text-sm file:font-semibold
                          file:bg-blue-50 file:text-blue-700
                          hover:file:bg-blue-100"
                      />
                    </div>
                    <div>
                      <label className="block text-sm sm:text-base font-semibold mb-2">Organizational Name:</label>
                      <input
                        type="text"
                        name="organisational_name"
                        value={form.organisational_name}
                        onChange={handleChange}
                        placeholder="Enter organizational name"
                        required={form.is_organizational_account}
                        className="w-full border rounded px-2 py-1 text-sm sm:text-base"
                      />
                    </div>
                  </>
                )}
                </>
                {/* End landlord fields */}
              </div>
            </div>

            {/* Previous Information Section */}
            <div className="mb-6">
              <h2 className="text-base sm:text-lg font-bold mb-4">Previous Information</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                {/* <div>
                  <label className="block text-sm sm:text-base font-semibold mb-2">Name/Address of Previous Employer:</label>
                  <input
                    type="text"
                    name="name_address_of_previous_employer"
                    value={form.name_address_of_previous_employer}
                    onChange={handleChange}
                    placeholder="Enter name/address of previous employer (optional)"
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
                    placeholder="Enter previous customer address (optional)"
                    className="w-full border rounded px-2 py-1 text-sm sm:text-base"
                  />
                </div> */}

                <div>
                  <label className="block text-sm sm:text-base font-semibold mb-2">Previous Account Number:</label>
                  <input
                    type="text"
                    name="previous_account_number"
                    value={form.previous_account_number}
                    onChange={handleChange}
                    placeholder="Enter previous account number (optional)"
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
                    placeholder="Enter previous meter number (optional)"
                    className="w-full border rounded px-2 py-1 text-sm sm:text-base"
                  />
                </div>
              </div>
            </div>

            {/* Bill Receiving Method Section */}
            <div className="mb-6">
              <h2 className="text-base sm:text-lg font-bold mb-4">Information Receiving Method</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label className="block text-sm sm:text-base font-semibold mb-2">Preferred Method of Receiving Information:</label>
                  <select
                    name="prefered_method_of_recieving_bill"
                    value={form.prefered_method_of_recieving_bill}
                    onChange={handleChange}
                    required
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