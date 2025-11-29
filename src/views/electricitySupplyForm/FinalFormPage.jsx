import React, { useState, useEffect, useRef } from 'react';
import { IBEDC_logo_Blue } from '../../assets/images';
import { Ibedc_Approved_Logo } from '../../assets/images';
import { toast } from 'react-toastify';
import axiosClient from '../../axios';
import { useNavigate, useLocation, Link, useSearchParams } from 'react-router-dom';
import statesData from '../../variants/states.json';

export default function FinalFormPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Initialize buildings state with empty array
  const [buildings, setBuildings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingExit, setLoadingExit] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalTrackingId, setModalTrackingId] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successData, setSuccessData] = useState(null);
  const [downloadsTriggered, setDownloadsTriggered] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editFormData, setEditFormData] = useState({});
  const [editLoading, setEditLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [summaryData, setSummaryData] = useState({});
  const [summaryLoading, setSummaryLoading] = useState(false);

  // State for dropdown options
  const [businessHubs, setBusinessHubs] = useState([]);
  const [serviceCenters, setServiceCenters] = useState({});
  const [dssList, setDssList] = useState({});

  // Loading states for dropdowns per building
  const [loadingServiceCenters, setLoadingServiceCenters] = useState({});

  const [trackingId, setTrackingId] = useState('');
  
  // IBEDC covered states only
  const allowedStates = ['Oyo', 'Ogun', 'Osun', 'Kwara', 'Ekiti', 'Kogi', 'Niger'];
  const filteredStatesData = statesData.filter((stateObj) => allowedStates.includes(stateObj.states.name));

  // Premise type and use options
  const premiseTypes = [
    '2Bedroom',
    '1Bedroom',
    '3Bedroom',
    '4Bedroom',
    'Tenement House',
    'Single Room',
    'Shop(s)',
    'Boys Qtrs',
    'Block of Flats',
    'Duplex',
    'Mansion',
    'Charlet',
    'Others'
  ];

  const premiseUses = [
    'Residential',
    'Commercial',
    'Special',
    'Industrial',
  ];

  // Initialize buildings with previously uploaded data
  useEffect(() => {
    const initializeBuildings = async () => {
      // Try multiple URL parameter names for tracking_id
      const urlTrackingId = searchParams.get('trackingId') || searchParams.get('tracking_id') || searchParams.get('id');
      if (urlTrackingId) {
        setTrackingId(urlTrackingId);
      }

      console.log(trackingId);
      
      // Get number of accounts from navigation state or default to 1
      const numAccounts = location.state?.numAccounts || 1;

      // If we have location state with prefill data, use it
      if (location.state?.prefill) {
        const existingBuildings = location.state.prefill.map(building => ({
          house_no: building.house_no,
          full_address: building.full_address,
          business_hub: building.business_hub,
          service_center: building.service_center,
          nearest_bustop: building.nearest_bustop,
          tga: building.tga,
          landmark: building.landmark,
          type_of_premise: building.type_of_premise,
          use_of_premise: building.use_of_premise,
          state: building.state,
          others_in_type_of_premise: building.others_in_type_of_premise,
          id: building.id
        }));

        setBuildings(existingBuildings);

        // Fetch service centers for each existing building
        existingBuildings.forEach((building, index) => {
          if (building.business_hub) {
            fetchServiceCentersForBusinessHub(index, building.business_hub);
          }
        });
      } else {
        // Create empty buildings based on number of accounts
        const emptyBuildings = Array.from({ length: numAccounts }, () => ({
          house_no: '',
          full_address: '',
          business_hub: '',
          service_center: '',
          nearest_bustop: '',
          tga: '',
          landmark: '',
          type_of_premise: '',
          use_of_premise: '',
          state: '',
          others_in_type_of_premise: ''
        }));
        
        setBuildings(emptyBuildings);
      }
    };

    initializeBuildings();
  }, [location.state]);

  // Fetch business hubs on component mount
  useEffect(() => {
    const fetchBusinessHubs = async () => {
      try {
        const response = await axiosClient.get('/V4IBEDC_new_account_setup_sync/initiate/all_business_hub');
        console.log("Business Hub: ", response.data.payload.business_hubs);
        
        if (response.data.success) {
          setBusinessHubs(response.data.payload.business_hubs);
        } else {
          toast.error(response.data.message || 'Failed to load business hubs');
        }
      } catch (error) {
        toast.error('Failed to load business hubs');
      }
    };
    
    fetchBusinessHubs();
  }, []);

  const handleBuildingChange = (index, e) => {
    const { name, value } = e.target;
    const newBuildings = [...buildings];
    newBuildings[index][name] = value;

    // Reset dependent dropdowns when parent changes
    if (name === 'business_hub') {
      newBuildings[index].service_center = '';
      fetchServiceCentersForBusinessHub(index, value);
    }
    // Reset LGA if state changes
    if (name === 'state') {
      // Reset LGA when state changes
      newBuildings[index].tga = '';
      // If selected state is not part of IBEDC coverage, clear it
      if (!allowedStates.includes(value)) {
        newBuildings[index].state = '';
      }
    }
    setBuildings(newBuildings);
  };

  const handleAddBuilding = () => {
    setBuildings([...buildings, {
      house_no: '',
      full_address: '',
      business_hub: '',
      service_center: '',
      nearest_bustop: '',
      tga: '',
      landmark: '',
      type_of_premise: '',
      use_of_premise: '',
      state: '',
      others_in_type_of_premise: ''
    }]);
  };

  const handleRemoveBuilding = (index) => {
    const newBuildings = buildings.filter((_, i) => i !== index);
    setBuildings(newBuildings);
  };

  // Fetch service centers when business hub changes for a specific building
  const fetchServiceCentersForBusinessHub = async (index, businessHub) => {
     if (!businessHub) {
      setServiceCenters(prev => ({ ...prev, [index]: [] }));
      setLoadingServiceCenters(prev => ({ ...prev, [index]: false }));
      return;
    }
    setLoadingServiceCenters(prev => ({ ...prev, [index]: true }));
    try {
      const response = await axiosClient.get(`/V4IBEDC_new_account_setup_sync/initiate/new/service_centers/${businessHub}`);
      if (response.data && Array.isArray(response.data)) {
        setServiceCenters(prev => ({ ...prev, [index]: response.data.map(item => item.service_center) }));
      } else {
        console.error('Service centers response structure:', response.data);
        toast.error(`Failed to load service centers for business hub ${businessHub}`);
      }
    } catch (error) {
      toast.error(`Failed to load service centers for business hub ${businessHub}`);
    } finally {
      setLoadingServiceCenters(prev => ({ ...prev, [index]: false }));
    }
  };

  const requiredFields = [
    'house_no',
    'full_address',
    'business_hub',
    'service_center',
    'nearest_bustop',
    'tga',
    'landmark',
    'type_of_premise',
    'use_of_premise',
    'state',
    'others_in_type_of_premise'
  ];

  const validateForm = () => {
    const missing = [];
    buildings.forEach((building, index) => {
      requiredFields.forEach(field => {
        // Skip validation for "others_in_type_of_premise" if "Others" is not selected
        if (field === 'others_in_type_of_premise' && building.type_of_premise !== 'Others') {
          return;
        }
        
        if (!building[field] || (typeof building[field] === 'string' && building[field].trim() === '')) {
          missing.push(`Building ${index + 1} - ${field.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}`);
        }
      });
    });
    return missing;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const missingFields = validateForm();
    if (missingFields.length > 0) {
      toast.error(`Please fill in the following field(s): ${missingFields.join(', ')}`);
      return;
    }
    
    // Submit directly without showing summary modal
    await handleFinalSubmit();
  };

  const handleFinalSubmit = async () => {
    setLoading(true);
    setShowSummaryModal(false);

    const formData = new FormData();
    formData.append('tracking_id', trackingId);

    // Only append new buildings (those without an id)
    const newBuildings = buildings.filter(building => !building.id);
    if (newBuildings.length === 0) {
      toast.error('No new buildings to submit. Please add at least one new building.');
      setLoading(false);
      return;
    }

    newBuildings.forEach((building, index) => {
      formData.append(`uploads[${index}][house_no]`, building.house_no);
      formData.append(`uploads[${index}][full_address]`, building.full_address);
      formData.append(`uploads[${index}][business_hub]`, building.business_hub);
      formData.append(`uploads[${index}][service_center]`, building.service_center);
      formData.append(`uploads[${index}][nearest_bustop]`, building.nearest_bustop);
      formData.append(`uploads[${index}][lga]`, building.tga);
      formData.append(`uploads[${index}][landmark]`, building.landmark);
      formData.append(`uploads[${index}][type_of_premise]`, building.type_of_premise);
      formData.append(`uploads[${index}][use_of_premise]`, building.use_of_premise);
      formData.append(`uploads[${index}][state]`, building.state);
      formData.append(`uploads[${index}][others_in_type_of_premise]`, building.others_in_type_of_premise);
    });

    try {
      const response = await axiosClient.post('/V4IBEDC_new_account_setup_sync/initiate/final-application', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      const data = response.data;
      if (data.success) {
        toast.success(data.message || 'Final form submitted successfully!');
        // Show LECAN information modal with auto-download
        setSuccessData({
          trackingId: data.payload.customer.tracking_id,
          buildings: buildings,
          numBuildings: buildings.length,
          uploadedBuildings: data.payload.customer.uploaded_pictures || buildings,
          buildingIds: data.payload.customer.uploaded_pictures
            ? data.payload.customer.uploaded_pictures.map((pic) => pic.id)
            : [],
          lecanMessage: data.payload.lecan,
          lecanLink: data.payload.link
        });
        setShowSuccessModal(true);
        setDownloadsTriggered(false); // Reset for new modal
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

  // Function to trigger automatic downloads
  const triggerDownloads = () => {
    if (successData?.lecanLink && !downloadsTriggered) {
      // Open the LECAN form(s) in new tab(s)
      for (let i = 0; i < successData.numBuildings; i++) {
        window.open(successData.lecanLink, '_blank');
      }
      setDownloadsTriggered(true);
    }
  };

  // Trigger downloads when modal appears
  useEffect(() => {
    if (showSuccessModal && successData && !downloadsTriggered) {
      // Small delay to ensure modal is rendered
      setTimeout(() => {
        triggerDownloads();
      }, 1000);
    }
  }, [showSuccessModal, successData, downloadsTriggered]);

  // Fetch all existing data for summary
  const fetchExistingData = async () => {
    if (!trackingId) {
      toast.error('Tracking ID not found');
      return;
    }
    
    setSummaryLoading(true);
    try {
      const response = await axiosClient.post('/V4IBEDC_new_account_setup_sync/initiate/track-application', {
        tracking_id: trackingId
      });
      
      if (response.data.success && response.data.payload?.customer) {
        const customer = response.data.payload.customer;
        const continuation = customer.continuation;
        
        setSummaryData({
          // Part 1 - Customer Information
          customer: {
            tracking_id: customer.tracking_id,
            phone: customer.phone,
            email: customer.email,
            title: customer.title,
            surname: customer.surname,
            firstname: customer.firstname,
            other_name: customer.other_name,
            status: customer.status,
            status_name: customer.status_name,
            no_of_account_apply_for: customer.no_of_account_apply_for,
            region: customer.region,
            default_house_no: customer.default_house_no
          },
          // Part 2 - Landlord Information
          landlord: continuation ? {
            nin_number: continuation.nin_number,
            landlord_surname: continuation.landlord_surname,
            landlord_othernames: continuation.landlord_othernames,
            landlord_dob: continuation.landlord_dob,
            landlord_telephone: continuation.landlord_telephone,
            landlord_email: continuation.landlord_email,
            name_address_of_previous_employer: continuation.name_address_of_previous_employer,
            previous_customer_address: continuation.previous_customer_address,
            previous_account_number: continuation.previous_account_number,
            previous_meter_number: continuation.previous_meter_number,
            landlord_personal_identification: continuation.landlord_personal_identification,
            prefered_method_of_recieving_bill: continuation.prefered_method_of_recieving_bill,
            comments: continuation.comments,
            organisational_name: continuation.organisational_name,
            is_organizational: !!continuation.organisational_name,
            no_of_account_apply_for: continuation.no_of_account_apply_for,
            // Uploaded Documents
            landloard_picture: continuation.landloard_picture,
            nin_slip: continuation.nin_slip,
            cac_slip: continuation.cac_slip
          } : null,
          // Part 3 - Building Information
          buildings: buildings
        });
        setShowSummaryModal(true);
      } else {
        toast.error('No data found for this tracking ID');
      }
    } catch (error) {
      console.error('Error fetching existing data:', error);
      toast.error('Failed to fetch existing data');
    } finally {
      setSummaryLoading(false);
    }
  };

  // Fetch tracking data for editing
  const fetchTrackingData = async () => {
    if (!trackingId) {
      toast.error('Tracking ID not found');
      return;
    }
    
    setFetchLoading(true);
    try {
      const response = await axiosClient.post('/V4IBEDC_new_account_setup_sync/initiate/track-application', {
        tracking_id: trackingId
      });
      if (response.data.success && response.data.payload?.customer?.continuation) {
        const continuation = response.data.payload.customer.continuation;
        setEditFormData({
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
        });
        setShowEditModal(true);
      } else {
        toast.error('No continuation data found for this tracking ID');
      }
    } catch (error) {
      console.error('Error fetching tracking data:', error);
      toast.error('Failed to fetch tracking data');
    } finally {
      setFetchLoading(false);
    }
  };

  // Handle edit form changes
  const handleEditChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setEditFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setEditFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  // Handle edit form submission
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setEditLoading(true);
    
    try {
      const payload = {
        tracking_id: trackingId,
        nin_number: editFormData.nin_number,
        landlord_surname: editFormData.landlord_surname,
        landlord_othernames: editFormData.landlord_othernames,
        landlord_dob: editFormData.landlord_dob,
        landlord_telephone: editFormData.landlord_telephone,
        landlord_email: editFormData.landlord_email,
        name_address_of_previous_employer: editFormData.name_address_of_previous_employer,
        previous_customer_address: editFormData.previous_customer_address,
        previous_account_number: editFormData.previous_account_number,
        previous_meter_number: editFormData.previous_meter_number,
        landlord_personal_identification: editFormData.landlord_personal_identification,
        ...(editFormData.is_organizational_account && { organisational_name: editFormData.organisational_name }),
        prefered_method_of_recieving_bill: editFormData.prefered_method_of_recieving_bill ? `Bill Sent ${editFormData.prefered_method_of_recieving_bill}` : '',
        comments: editFormData.comments,
        no_of_account_apply_for: editFormData.no_of_account_apply_for,
        latitude: localStorage.getItem('LATITUDE') || '0.00000',
        longitude: localStorage.getItem('LONGITUDE') || '0.00000',
      };

      const response = await axiosClient.post('/V4IBEDC_new_account_setup_sync/initiate/edit_landlord_information', payload);
      
      if (response.data.success) {
        toast.success('Landlord information updated successfully!');
        setShowEditModal(false);
      } else {
        toast.error(response.data.message || 'Failed to update landlord information');
      }
    } catch (error) {
      console.error('Error updating landlord information:', error);
      if (error.response?.data?.success === false) {
        toast.error(error.response?.data?.payload?.nin_number || error.response.data.message);
      } else {
        toast.error('Network error. Please try again.');
      }
    } finally {
      setEditLoading(false);
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

    const formData = new FormData();
     formData.append('tracking_id', trackingId);

     buildings.forEach((building, index) => {
        formData.append(`uploads[${index}][house_no]`, building.house_no);
        formData.append(`uploads[${index}][full_address]`, building.full_address);
        formData.append(`uploads[${index}][business_hub]`, building.business_hub);
        formData.append(`uploads[${index}][service_center]`, building.service_center);
        formData.append(`uploads[${index}][nearest_bustop]`, building.nearest_bustop);
        formData.append(`uploads[${index}][tga]`, building.tga);
        formData.append(`uploads[${index}][landmark]`, building.landmark);
        formData.append(`uploads[${index}][type_of_premise]`, building.type_of_premise);
        formData.append(`uploads[${index}][use_of_premise]`, building.use_of_premise);
        formData.append(`uploads[${index}][state]`, building.state);
        formData.append(`uploads[${index}][others_in_type_of_premise]`, building.others_in_type_of_premise);
    });

     // TODO: Replace with the correct API endpoint for FinalForm submission
    const apiUrl = '/your/final/submission/api'; 

    try {
      const response = await axiosClient.post(apiUrl, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      const data = response.data;
      if (data.success && trackingId) {
        setModalTrackingId(trackingId);
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
            <Link to={'/'} className='w-full sm:w-auto flex justify-center sm:justify-start'>
              <img src={IBEDC_logo_Blue} alt="logo" className='w-20 sm:w-40 h-10 sm:h-20' />
            </Link>
            <div className='flex flex-col justify-center items-center text-base sm:text-xl w-full sm:w-1/2 h-auto sm:h-40 text-center px-2 sm:px-0'>
              <h2 className='font-bold text-lg sm:text-xl'>IBADAN ELECTRICITY DISTRIBUTION COMPANY PLC</h2>
              <h4 className='text-base sm:text-lg'>New Customer Account Creation Form</h4>
              <p className='text-sm sm:text-base text-center'>Application for electricity supply and agreement form.</p>
              <p className='text-sm sm:text-base text-center'>Tracking ID: {trackingId}</p>
            </div>
            <div className='text-gray-200 hidden sm:block'>
              <p>Kendrick</p>
            </div>
          </div>
        </div>

        {/* Title Section */}
        <div className='flex justify-between items-center font-bold text-base sm:text-lg mt-4 sm:mt-8 mx-4 sm:mx-20 -mb-2'>
          <h1>PART 3: BUILDING DETAILS</h1>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => navigate(`/continuationForm?trackingId=${trackingId}&update=true`)}
              className="px-4 py-2 text-sm bg-green-600 text-white font-semibold rounded-lg shadow hover:bg-green-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-400"
            >
              Edit Landlord Information
            </button>
            <button
              type="button"
              onClick={fetchTrackingData}
              disabled={fetchLoading}
              className="px-4 py-2 text-sm bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:bg-gray-400"
            >
              {fetchLoading ? 'Loading...' : 'Quick Edit Modal'}
            </button>
          </div>
        </div>

        {/* Form Section */}
        <form onSubmit={handleSubmit} className="mx-2 sm:mx-4 md:mx-8 lg:mx-20 xl:mx-52 my-4 sm:my-10">
          <input type="hidden" name="tracking_id" value={trackingId} />
          {buildings.map((building, index) => (
            <div key={building.id || index} className="mb-4 sm:mb-8 p-3 sm:p-6 border rounded shadow-sm bg-white flex flex-col sm:flex-row gap-4 sm:gap-8">
              {/* Column 1 */}
              <div className="flex flex-col flex-1 gap-4 sm:gap-6">
                <h3 className="text-base sm:text-lg font-bold">
                  Building {index + 1}
                  {building.id && <span className="text-xs sm:text-sm text-gray-500 ml-2">(Previously Uploaded)</span>}
                </h3>
                <label className="font-semibold text-sm sm:text-base">House No.:
                  <input
                    type="text"
                    name="house_no"
                    value={building.house_no}
                    onChange={(e) => handleBuildingChange(index, e)}
                    className="border rounded px-2 py-1 mt-2 mb-2 w-full text-sm sm:text-base"
                    required
                  />
                </label>

                <label className="font-semibold text-sm sm:text-base">Full Address:
                  <textarea
                    name="full_address"
                    value={building.full_address}
                    onChange={(e) => handleBuildingChange(index, e)}
                    className="mt-2 border rounded px-2 py-1 w-full text-sm sm:text-base"
                    rows={3}
                    required
                  />
                </label>

                <label className="font-semibold text-sm sm:text-base">Business Hub:
                  <select
                    name="business_hub"
                    value={building.business_hub}
                    onChange={(e) => handleBuildingChange(index, e)}
                    className="border rounded px-2 py-1 mt-2 mb-2 w-full text-sm sm:text-base"
                    required
                    disabled={building.id}
                  >
                    <option value="" disabled>Select business hub</option>
                    {businessHubs.map((hub) => (
                      <option key={hub.BuzhubCode} value={hub.businesshub}>{hub.businesshub}</option>
                    ))}
                  </select>
                  {loadingServiceCenters[index] && <span className="text-xs sm:text-sm text-gray-500">Loading service centers...</span>}
                </label>
                <label className="font-semibold text-sm sm:text-base">Service Center:
                  <select
                    name="service_center"
                    value={building.service_center}
                    onChange={(e) => handleBuildingChange(index, e)}
                    className="border rounded px-2 py-1 mt-2 mb-2 w-full text-sm sm:text-base"
                    required
                    disabled={!building.business_hub || (serviceCenters[index]?.length ?? 0) === 0 || loadingServiceCenters[index]}
                  >
                    <option value="" disabled>Select service center</option>
                    {serviceCenters[index]?.map((center) => (
                      <option key={center} value={center}>{center}</option>
                    ))}
                  </select>
                  {loadingServiceCenters[index] && <span className="text-xs sm:text-sm text-gray-500">Loading service centers...</span>}
                </label>
                <label className="font-semibold text-sm sm:text-base">Nearest Bus Stop:
                  <input
                    type="text"
                    name="nearest_bustop"
                    value={building.nearest_bustop}
                    onChange={(e) => handleBuildingChange(index, e)}
                    className="border rounded px-2 py-1 mt-2 mb-2 w-full text-sm sm:text-base"
                    required
                  />
                </label>
              </div>

              {/* Column 2 */}
              <div className="flex flex-col flex-1 gap-4 sm:gap-6">
                <label className="font-semibold text-sm sm:text-base">Landmark:
                  <input
                    type="text"
                    name="landmark"
                    value={building.landmark}
                    onChange={(e) => handleBuildingChange(index, e)}
                    className="border rounded px-2 py-1 mt-2 mb-2 w-full text-sm sm:text-base"
                    required
                  />
                </label>

                <label className="font-semibold text-sm sm:text-base">Type of Premise:
                  <select
                    name="type_of_premise"
                    value={building.type_of_premise}
                    onChange={(e) => handleBuildingChange(index, e)}
                    className="border rounded px-2 py-1 mt-2 mb-2 w-full text-sm sm:text-base"
                    required
                  >
                    <option value="" disabled>Select type of premise</option>
                    {premiseTypes.map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </label>

                  {building.type_of_premise === 'Others' && (
                    <label className="font-semibold text-sm sm:text-base">Others in Type of Premise:
                      <input
                        type="text"
                        name="others_in_type_of_premise"
                        value={building.others_in_type_of_premise}
                        onChange={(e) => handleBuildingChange(index, e)}
                        className="border rounded px-2 py-1 mt-2 mb-2 w-full text-sm sm:text-base"
                        required
                        placeholder="Please specify the type of premise"
                      />
                    </label>
                  )}
                <label className="font-semibold text-sm sm:text-base">Use of Premise:
                  <select
                    name="use_of_premise"
                    value={building.use_of_premise}
                    onChange={(e) => handleBuildingChange(index, e)}
                    className="border rounded px-2 py-1 mt-2 mb-2 w-full text-sm sm:text-base"
                    required
                  >
                    <option value="" disabled>Select use of premise</option>
                    {premiseUses.map((use) => (
                      <option key={use} value={use}>{use}</option>
                    ))}
                  </select>
                </label>


                <label className="font-semibold text-sm sm:text-base">State:
                  <select
                    name="state"
                    value={building.state}
                    onChange={(e) => handleBuildingChange(index, e)}
                    className="border rounded px-2 py-1 mt-2 mb-2 w-full text-sm sm:text-base"
                    required
                  >
                    <option value="" disabled>Select state</option>
                    {filteredStatesData.map((stateObj) => (
                      <option key={stateObj.states.id} value={stateObj.states.name}>
                        {stateObj.states.name}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="font-semibold text-sm sm:text-base">LGA:
                  <select
                    name="tga"
                    value={building.tga}
                    onChange={(e) => handleBuildingChange(index, e)}
                    className="border rounded px-2 py-1 mt-2 mb-2 w-full text-sm sm:text-base"
                    required
                    disabled={!building.state}
                  >
                    <option value="" disabled>Select LGA</option>
                    {filteredStatesData
                      .find((stateObj) => stateObj.states.name === building.state)?.states.locals.map((lga) => (
                        <option key={lga.id} value={lga.name}>
                          {lga.name}
                        </option>
                      ))}
                  </select>
                </label>
              </div>

              {!building.id && buildings.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemoveBuilding(index)}
                  className="self-start px-3 py-1 text-sm sm:text-base bg-red-500 text-white font-semibold rounded shadow hover:bg-red-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-400"
                >
                  Remove
                </button>
              )}
            </div>
          ))}

          {/* Add Building Button */}
          <div className="flex flex-col items-center mt-4">
            <div className="mb-2 text-sm text-gray-600">
              Buildings: {buildings.length} ({location.state?.numAccounts || 1} required)
            </div>
            <button
              type="button"
              onClick={handleAddBuilding}
              className="px-4 sm:px-6 py-2 text-sm sm:text-base bg-green-600 text-white font-semibold rounded-lg shadow hover:bg-green-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-400"
            >
              Add Building
            </button>
          </div>

          {/* Submit Button */}
          <div className='flex flex-row justify-center items-center gap-4 sm:gap-52 w-full my-6 sm:my-10'>
            <button
              type="submit"
              className="px-4 sm:px-6 py-2 text-sm sm:text-base bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 w-full sm:w-auto"
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save and Continue'}
            </button>
          </div>
        </form>
      </section>

      {/* Tracking ID Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
          <div className="bg-white p-4 sm:p-8 rounded shadow-lg w-full max-w-md flex flex-col items-center">
            <h2 className="text-lg sm:text-xl font-bold mb-4 text-center text-blue-700">Please Take Note of Your Tracking ID</h2>
            <p className="mb-2 text-center text-sm sm:text-base">Your Tracking ID is:</p>
            <div className="text-xl sm:text-2xl font-mono font-bold text-blue-900 mb-4 p-2 border border-blue-300 rounded bg-blue-50 w-full text-center break-all">{modalTrackingId}</div>
            <p className="mb-4 text-center text-red-600 font-semibold text-sm sm:text-base">Please write down this Tracking ID. You will need it to continue your application in the future.</p>
            <button
              onClick={() => { setShowModal(false); navigate('/'); }}
              className="mt-2 px-4 sm:px-6 py-2 text-sm sm:text-base bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 w-full sm:w-auto"
            >
              Close
            </button>
          </div>
        </div>
      )}


      {/* Edit Landlord Information Modal */}
      {showEditModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
          <div className="bg-white p-4 sm:p-8 rounded shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg sm:text-xl font-bold text-blue-700">Edit Landlord Information</h2>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
              >
                ×
              </button>
            </div>
            
            <form onSubmit={handleEditSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">NIN Number:</label>
                  <input
                    type="text"
                    name="nin_number"
                    value={editFormData.nin_number || ''}
                    onChange={handleEditChange}
                    required
                    pattern="[0-9]{11}"
                    title="Please enter a valid 11-digit NIN number"
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold mb-2">Landlord Surname:</label>
                  <input
                    type="text"
                    name="landlord_surname"
                    value={editFormData.landlord_surname || ''}
                    onChange={handleEditChange}
                    required
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold mb-2">Landlord Other Names:</label>
                  <input
                    type="text"
                    name="landlord_othernames"
                    value={editFormData.landlord_othernames || ''}
                    onChange={handleEditChange}
                    required
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold mb-2">Date of Birth:</label>
                  <input
                    type="date"
                    name="landlord_dob"
                    value={editFormData.landlord_dob || ''}
                    onChange={handleEditChange}
                    required
                    max={new Date(new Date().setFullYear(new Date().getFullYear() - 18)).toISOString().split('T')[0]}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold mb-2">Telephone:</label>
                  <input
                    type="tel"
                    name="landlord_telephone"
                    value={editFormData.landlord_telephone || ''}
                    onChange={handleEditChange}
                    required
                    pattern="[0-9]{11}"
                    title="Please enter a valid 11-digit phone number"
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold mb-2">Email:</label>
                  <input
                    type="email"
                    name="landlord_email"
                    value={editFormData.landlord_email || ''}
                    onChange={handleEditChange}
                    required
                    pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
                    title="Please enter a valid email address"
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold mb-2">Previous Account Number:</label>
                  <input
                    type="text"
                    name="previous_account_number"
                    value={editFormData.previous_account_number || ''}
                    onChange={handleEditChange}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold mb-2">Previous Meter Number:</label>
                  <input
                    type="text"
                    name="previous_meter_number"
                    value={editFormData.previous_meter_number || ''}
                    onChange={handleEditChange}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold mb-2">Preferred Method of Receiving Bill:</label>
                  <select
                    name="prefered_method_of_recieving_bill"
                    value={editFormData.prefered_method_of_recieving_bill || ''}
                    onChange={handleEditChange}
                    required
                    className="w-full border rounded px-3 py-2"
                  >
                    <option value="">Select Method</option>
                    <option value="By Email">By Email</option>
                    <option value="By SMS">By SMS</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold mb-2">Number of Accounts:</label>
                  <input
                    type="number"
                    name="no_of_account_apply_for"
                    value={editFormData.no_of_account_apply_for || '1'}
                    onChange={handleEditChange}
                    required
                    min="1"
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
              </div>
              
              {/* Organizational Account Checkbox */}
              <div className="flex items-center mb-4">
                <input
                  type="checkbox"
                  name="is_organizational_account"
                  checked={editFormData.is_organizational_account || false}
                  onChange={handleEditChange}
                  className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="text-sm font-semibold text-gray-700">
                  Is this account for an organization?
                </label>
              </div>

              {/* Organizational Fields - Only show if checkbox is checked */}
              {editFormData.is_organizational_account && (
                <div>
                  <label className="block text-sm font-semibold mb-2">Organizational Name:</label>
                  <input
                    type="text"
                    name="organisational_name"
                    value={editFormData.organisational_name || ''}
                    onChange={handleEditChange}
                    placeholder="Enter organizational name"
                    required={editFormData.is_organizational_account}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
              )}
              
              {/* <div>
                <label className="block text-sm font-semibold mb-2">Comments:</label>
                <textarea
                  name="comments"
                  value={editFormData.comments || ''}
                  onChange={handleEditChange}
                  rows={3}
                  className="w-full border rounded px-3 py-2"
                />
              </div> */}
              
              <div className="flex justify-end gap-4 pt-6 border-t">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-6 py-2 bg-gray-500 text-white font-semibold rounded-lg shadow hover:bg-gray-600 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={editLoading}
                  className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 transition-colors duration-200 disabled:bg-gray-400"
                >
                  {editLoading ? 'Updating...' : 'Update'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Summary Modal */}
      {showSummaryModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
          <div className="bg-white p-4 sm:p-8 rounded shadow-lg w-full max-w-6xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg sm:text-xl font-bold text-blue-700">Application Summary - Review Before Submission</h2>
              <button
                onClick={() => setShowSummaryModal(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
              >
                ×
              </button>
            </div>
            
            {summaryLoading ? (
              <div className="flex justify-center items-center py-8">
                <div className="text-blue-600">Loading summary...</div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Part 1 - Customer Information */}
                {summaryData.customer && (
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="text-lg font-bold text-blue-900 mb-4">Part 1: Customer Information</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div><strong>Tracking ID:</strong> {summaryData.customer.tracking_id}</div>
                      <div><strong>Phone:</strong> {summaryData.customer.phone}</div>
                      <div><strong>Email:</strong> {summaryData.customer.email}</div>
                      <div><strong>Title:</strong> {summaryData.customer.title}</div>
                      <div><strong>Name:</strong> {summaryData.customer.surname} {summaryData.customer.firstname} {summaryData.customer.other_name}</div>
                      <div><strong>Status:</strong> {summaryData.customer.status_name}</div>
                      {/* <div><strong>Region:</strong> {summaryData.customer.region}</div> */}
                    </div>
                  </div>
                )}

                {/* Part 2 - Landlord Information */}
                {summaryData.landlord && (
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h3 className="text-lg font-bold text-green-900 mb-4">Part 2: Landlord Information</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div><strong>NIN Number:</strong> {summaryData.landlord.nin_number}</div>
                      <div><strong>Landlord Name:</strong> {summaryData.landlord.landlord_surname} {summaryData.landlord.landlord_othernames}</div>
                      <div><strong>Date of Birth:</strong> {summaryData.landlord.landlord_dob}</div>
                      <div><strong>Telephone:</strong> {summaryData.landlord.landlord_telephone}</div>
                      <div><strong>Email:</strong> {summaryData.landlord.landlord_email}</div>
                      {/* <div><strong>ID Type:</strong> {summaryData.landlord.landlord_personal_identification}</div> */}
                      <div><strong>Bill Method:</strong> {summaryData.landlord.prefered_method_of_recieving_bill}</div>
                      <div><strong>Accounts Applied For:</strong> {summaryData.landlord.no_of_account_apply_for}</div>
                      <div><strong>Previous Account:</strong> {summaryData.landlord.previous_account_number || 'N/A'}</div>
                      <div><strong>Previous Meter:</strong> {summaryData.landlord.previous_meter_number || 'N/A'}</div>
                      {summaryData.landlord.is_organizational && (
                        <div className="sm:col-span-2"><strong>Organizational Name:</strong> {summaryData.landlord.organisational_name}</div>
                      )}
                      
                      {/* Uploaded Documents */}
                      <div className="sm:col-span-2">
                        <strong>Uploaded Documents:</strong>
                        <div className="mt-2 flex flex-wrap gap-4">
                          {summaryData.landlord.landloard_picture && (
                            <div>
                              <div className="text-sm font-semibold text-gray-700 mb-1">Landlord Picture:</div>
                              <img 
                                src={`https://ipay.ibedc.com:7642/storage/${summaryData.landlord.landloard_picture}`}
                                alt="Landlord Picture"
                                className="w-32 h-32 object-cover border rounded shadow-sm"
                                onError={(e) => {
                                  e.target.style.display = 'none';
                                  e.target.nextSibling.style.display = 'block';
                                }}
                              />
                              <div className="text-xs text-gray-500 mt-1" style={{display: 'none'}}>
                                Image not available: {summaryData.landlord.landloard_picture}
                              </div>
                            </div>
                          )}
                          {summaryData.landlord.nin_slip && (
                            <div>
                              <div className="text-sm font-semibold text-gray-700 mb-1">NIN Slip:</div>
                              {summaryData.landlord.nin_slip.toLowerCase().endsWith('.pdf') ? (
                                <div className="text-sm text-blue-600">
                                  <a 
                                    href={`https://ipay.ibedc.com:7642/storage/${summaryData.landlord.nin_slip}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="underline"
                                  >
                                    📄 View PDF Document
                                  </a>
                                </div>
                              ) : (
                                <img 
                                  src={`https://ipay.ibedc.com:7642/storage/${summaryData.landlord.nin_slip}`}
                                  alt="NIN Slip"
                                  className="w-32 h-32 object-cover border rounded shadow-sm"
                                  onError={(e) => {
                                    e.target.style.display = 'none';
                                    e.target.nextSibling.style.display = 'block';
                                  }}
                                />
                              )}
                              <div className="text-xs text-gray-500 mt-1" style={{display: 'none'}}>
                                Document not available: {summaryData.landlord.nin_slip}
                              </div>
                            </div>
                          )}
                          {summaryData.landlord.cac_slip && (
                            <div>
                              <div className="text-sm font-semibold text-gray-700 mb-1">CAC Slip:</div>
                              {summaryData.landlord.cac_slip.toLowerCase().endsWith('.pdf') ? (
                                <div className="text-sm text-blue-600">
                                  <a 
                                    href={`https://ipay.ibedc.com:7642/storage/${summaryData.landlord.cac_slip}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="underline"
                                  >
                                    📄 View PDF Document
                                  </a>
                                </div>
                              ) : (
                                <img 
                                  src={`https://ipay.ibedc.com:7642/storage/${summaryData.landlord.cac_slip}`}
                                  alt="CAC Slip"
                                  className="w-32 h-32 object-cover border rounded shadow-sm"
                                  onError={(e) => {
                                    e.target.style.display = 'none';
                                    e.target.nextSibling.style.display = 'block';
                                  }}
                                />
                              )}
                              <div className="text-xs text-gray-500 mt-1" style={{display: 'none'}}>
                                Document not available: {summaryData.landlord.cac_slip}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {/* {summaryData.landlord.comments && (
                        <div className="sm:col-span-2"><strong>Comments:</strong> {summaryData.landlord.comments}</div>
                      )} */}
                    </div>
                  </div>
                )}

                {/* Part 3 - Building Information */}
                {summaryData.buildings && summaryData.buildings.length > 0 && (
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <h3 className="text-lg font-bold text-yellow-900 mb-4">Part 3: Building Information ({summaryData.buildings.length} building{summaryData.buildings.length > 1 ? 's' : ''})</h3>
                    <div className="space-y-4">
                      {summaryData.buildings.map((building, index) => (
                        <div key={index} className="bg-white p-4 rounded border">
                          <h4 className="font-bold text-gray-800 mb-2">Building {index + 1}</h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                            <div><strong>House No:</strong> {building.house_no}</div>
                            <div><strong>Address:</strong> {building.full_address}</div>
                            <div><strong>Business Hub:</strong> {building.business_hub}</div>
                            <div><strong>Service Center:</strong> {building.service_center}</div>
                            <div><strong>Nearest Bus Stop:</strong> {building.nearest_bustop}</div>
                            <div><strong>LGA:</strong> {building.tga}</div>
                            <div><strong>Landmark:</strong> {building.landmark}</div>
                            <div><strong>Premise Type:</strong> {building.type_of_premise}</div>
                            <div><strong>Premise Use:</strong> {building.use_of_premise}</div>
                            <div><strong>State:</strong> {building.state}</div>
                            {building.others_in_type_of_premise && (
                              <div className="sm:col-span-2"><strong>Other Premise Type:</strong> {building.others_in_type_of_premise}</div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex justify-end gap-4 pt-6 border-t">
                  <button
                    onClick={() => setShowSummaryModal(false)}
                    className="px-6 py-2 bg-gray-500 text-white font-semibold rounded-lg shadow hover:bg-gray-600 transition-colors duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleFinalSubmit}
                    disabled={loading}
                    className="px-6 py-2 bg-green-600 text-white font-semibold rounded-lg shadow hover:bg-green-700 transition-colors duration-200 disabled:bg-gray-400"
                  >
                    {loading ? 'Submitting...' : 'Confirm & Submit'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* LECAN Information Modal */}
      {showSuccessModal && successData && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
          <div className="bg-white p-4 sm:p-8 rounded shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="text-center mb-6">
              <h2 className="text-lg sm:text-xl font-bold mb-4 text-green-700">Building Details Submitted Successfully!</h2>
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
            </div>
            
            <div className="space-y-4 mb-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="font-semibold text-blue-900 mb-2">Your Tracking ID:</p>
                <p className="font-mono text-lg text-blue-700 break-all">{successData.trackingId}</p>
                <p className="text-sm text-blue-600 mt-2">Please save this tracking ID - you'll need it to continue your application.</p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="font-semibold text-gray-900 mb-2">Buildings Submitted:</p>
                <p className="text-gray-700">{successData.numBuildings} building(s)</p>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <div className="flex items-center mb-2">
                  <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                  </svg>
                  <p className="font-semibold text-green-900">License Electrical Contractor Forms Downloaded</p>
                </div>
                <p className="text-green-800 text-sm">
                  {successData.numBuildings} License Electrical Contractor form(s) have been automatically downloaded to your device. 
                  Please fill out each form completely before uploading.
                </p>
              </div>
              
              {successData.lecanMessage && (
                <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                  <p className="font-semibold text-yellow-900 mb-2">Important Information:</p>
                  <p className="text-yellow-800">{successData.lecanMessage}</p>
                </div>
              )}
            </div>
            
            <div className="border-t pt-6">
              <h3 className="font-bold text-lg mb-4 text-center">Next Steps</h3>
              <div className="space-y-3 mb-6">
                <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                  <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mt-0.5">1</div>
                  <div>
                    <p className="font-medium text-blue-900">Fill out the downloaded License Electrical Contractor forms</p>
                    <p className="text-sm text-blue-700">Complete all required fields in each form for your buildings</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                  <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mt-0.5">2</div>
                  <div>
                    <p className="font-medium text-blue-900">Upload completed forms</p>
                    <p className="text-sm text-blue-700">Submit the filled License Electrical Contractor forms for each building</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                  <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mt-0.5">3</div>
                  <div>
                    <p className="font-medium text-blue-900">Capture building images</p>
                    <p className="text-sm text-blue-700">Take photos of each building with location data</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row justify-center gap-3 mt-6 pt-6 border-t">
              <button
                onClick={() => { 
                  setShowSuccessModal(false); 
                  navigate('/lecanUpload', {
                    state: {
                      trackingId: successData.trackingId,
                      buildings: successData.buildings,
                      numBuildings: successData.numBuildings,
                      uploadedBuildings: successData.uploadedBuildings,
                      buildingIds: successData.buildingIds,
                      lecanMessage: successData.lecanMessage,
                      lecanLink: successData.lecanLink
                    }
                  });
                }}
                className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                Continue to LECAN Upload
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 