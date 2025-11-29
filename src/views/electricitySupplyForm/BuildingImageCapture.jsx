import React, { useState, useEffect, useRef } from 'react';
import { IBEDC_logo_Blue } from '../../assets/images';
import { Ibedc_Approved_Logo } from '../../assets/images';
import { toast } from 'react-toastify';
import axiosClient from '../../axios';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import Webcam from 'react-webcam';

export default function BuildingImageCapture() {
  const location = useLocation();
  const navigate = useNavigate();

  // Get building data from navigation state
  const { trackingId, buildings = [], numBuildings = 0, buildingIds = [], lecanMessage, lecanLink } = location.state || {};

  const [buildingImages, setBuildingImages] = useState([]);
  const [capturedImages, setCapturedImages] = useState([]);
  const [buildingLatitudes, setBuildingLatitudes] = useState([]);
  const [buildingLongitudes, setBuildingLongitudes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentBuildingIndex, setCurrentBuildingIndex] = useState(0);
  const webcamRef = useRef(null);
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [summaryData, setSummaryData] = useState({});
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successData, setSuccessData] = useState(null);

  // Initialize state based on number of buildings
  useEffect(() => {
    if (!trackingId || (!buildings || buildings.length === 0)) {
      toast.error('Invalid data received. Redirecting...');
      navigate('/finalForm');
      return;
    }

    const numBuildingsToCapture = buildings.length || numBuildings || 1;
    setBuildingImages(new Array(numBuildingsToCapture).fill(null));
    setCapturedImages(new Array(numBuildingsToCapture).fill(null));
    setBuildingLatitudes(new Array(numBuildingsToCapture).fill(null));
    setBuildingLongitudes(new Array(numBuildingsToCapture).fill(null));
  }, [trackingId, buildings, numBuildings, navigate]);

  // Redirect if no data is passed
  useEffect(() => {
    if (!trackingId || (!buildings || buildings.length === 0)) {
      toast.error('Invalid data received. Redirecting...');
      navigate('/finalForm');
    }
  }, [trackingId, buildings, navigate]);

  const handleCapturePhoto = (index) => {
    if (webcamRef && webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      const newCapturedImages = [...capturedImages];
      newCapturedImages[index] = imageSrc;
      setCapturedImages(newCapturedImages);
      
      // Convert base64 to blob for storage
      fetch(imageSrc)
        .then(res => res.blob())
        .then(blob => {
          const newBuildingImages = [...buildingImages];
          newBuildingImages[index] = blob;
          setBuildingImages(newBuildingImages);
        });

      // Capture geolocation
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const newLatitudes = [...buildingLatitudes];
            const newLongitudes = [...buildingLongitudes];
            newLatitudes[index] = position.coords.latitude;
            newLongitudes[index] = position.coords.longitude;
            setBuildingLatitudes(newLatitudes);
            setBuildingLongitudes(newLongitudes);
          },
          (error) => {
            toast.error(`Location error: ${error.message}`);
            console.error('Geolocation error:', error);
          },
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
          }
        );
      } else {
        toast.error('Geolocation is not supported by this browser.');
      }
    }
  };

  const handleRetake = (index) => {
    const newBuildingImages = [...buildingImages];
    const newCapturedImages = [...capturedImages];
    const newLatitudes = [...buildingLatitudes];
    const newLongitudes = [...buildingLongitudes];
    newBuildingImages[index] = null;
    newCapturedImages[index] = null;
    newLatitudes[index] = null;
    newLongitudes[index] = null;
    setBuildingImages(newBuildingImages);
    setCapturedImages(newCapturedImages);
    setBuildingLatitudes(newLatitudes);
    setBuildingLongitudes(newLongitudes);
  };

  const handleNext = () => {
    if (currentBuildingIndex < buildings.length - 1) {
      setCurrentBuildingIndex(currentBuildingIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentBuildingIndex > 0) {
      setCurrentBuildingIndex(currentBuildingIndex - 1);
    }
  };

  const validateForm = () => {
    const missingImages = buildingImages.filter(img => !img);
    return missingImages.length === 0;
  };

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
          buildings: buildings,
          // Part 4 - Building Images
          buildingImages: buildingImages,
          // Location data
          buildingLatitudes: buildingLatitudes,
          buildingLongitudes: buildingLongitudes
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


  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please capture images for all buildings.');
      return;
    }
    
    // Show summary modal before final submission
    await fetchExistingData();
  };

  const handleFinalSubmit = async () => {
    setLoading(true);
    setShowSummaryModal(false);

    try {
      // Build a single FormData payload with an uploads[...] array,
      // similar to how FinalFormPage submits building details.
      const formData = new FormData();
      formData.append('tracking_id', trackingId);

      buildingImages.forEach((image, index) => {
        if (!image) {
          return;
        }

        const building = buildings[index];
        const buildingId = building?.id || buildingIds[index] || (index + 1);
        const latitude = buildingLatitudes[index] || '';
        const longitude = buildingLongitudes[index] || '';

        // Validate coordinates per building before appending
        if (!latitude || !longitude) {
          throw new Error(
            `Building ${index + 1}: Location data is missing. Please retake the photo.`
          );
        }

        formData.append(`uploads[${index}][id]`, buildingId);
        formData.append(`uploads[${index}][picture]`, image, `building_${index + 1}.jpg`);
        formData.append(`uploads[${index}][latitude]`, latitude);
        formData.append(`uploads[${index}][longitude]`, longitude);
        // NOTE: Do NOT append region, per requirements
      });

      const response = await axiosClient.post(
        '/V4IBEDC_new_account_setup_sync/initiate/v5/customer_house_upload_latlong',
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      );

      const data = response.data;

      if (data.success) {
        toast.success(data.message || 'Building images uploaded successfully!');
        setSuccessData({
          trackingId,
          numBuildings: buildings.length || numBuildings,
          uploadedBuildings: buildings.map((b, i) => ({
            ...b,
            id: b.id || buildingIds[i] || (i + 1),
          })),
          buildingIds,
        });
        setShowSuccessModal(true);
      } else {
        // Show any backend validation messages, especially for uploads
        if (data.payload) {
          Object.entries(data.payload).forEach(([field, message]) => {
            if (message) {
              toast.error(`${message}`);
            }
          });
        } else {
          toast.error(data.message || 'An error occurred during upload.');
        }
      }
    } catch (error) {
      if (error.message && error.message.startsWith('Building')) {
        // Custom validation error thrown above (e.g., missing lat/long)
        toast.error(error.message);
      } else if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else if (error.response?.data?.payload) {
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

  if (!trackingId || (!buildings || buildings.length === 0)) {
    return null;
  }

  const currentBuilding = buildings[currentBuildingIndex];
  const currentImage = capturedImages[currentBuildingIndex];
  const hasImage = buildingImages[currentBuildingIndex] !== null;

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
              <h4 className='text-base sm:text-lg'>New Customer Account Creation Form - Building Image Capture</h4>
              <p className='text-sm sm:text-base text-center'>Tracking ID: {trackingId}</p>
            </div>
            <div className='text-gray-200 hidden sm:block'>
              <p>Kendrick</p>
            </div>
          </div>
        </div>

        {/* Title Section */}
        <div className='font-bold text-base sm:text-lg mt-4 sm:mt-8 mx-4 sm:mx-20 -mb-2'>
          <h1>PART 5: BUILDING IMAGE CAPTURE</h1>
        </div>

        {/* Progress Indicator */}
        <div className='mx-2 sm:mx-4 md:mx-8 lg:mx-20 xl:mx-52 my-4'>
          <div className='bg-white p-4 rounded-lg shadow-sm'>
            <p className='text-sm sm:text-base text-gray-600 mb-2'>
              Building {currentBuildingIndex + 1} of {buildings.length}
            </p>
            <div className='w-full bg-gray-200 rounded-full h-2'>
              <div 
                className='bg-blue-600 h-2 rounded-full transition-all duration-300'
                style={{ width: `${((currentBuildingIndex + 1) / buildings.length) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Form Section */}
        <form onSubmit={handleSubmit} className="mx-2 sm:mx-4 md:mx-8 lg:mx-20 xl:mx-52 my-4 sm:my-10">
          <div className="bg-white p-4 sm:p-6 border rounded shadow-sm">
            {/* Building Information */}
            <div className="mb-6">
              <h2 className="text-base sm:text-lg font-bold mb-4">
                Building {currentBuildingIndex + 1} Details
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <strong>House No:</strong> {currentBuilding?.house_no || 'N/A'}
                </div>
                <div>
                  <strong>Address:</strong> {currentBuilding?.full_address || 'N/A'}
                </div>
                <div>
                  <strong>Business Hub:</strong> {currentBuilding?.business_hub || 'N/A'}
                </div>
                <div>
                  <strong>Service Center:</strong> {currentBuilding?.service_center || 'N/A'}
                </div>
              </div>
            </div>

            {/* Image Capture Section */}
            <div className="mb-6">
              <label className="block text-sm sm:text-base font-semibold mb-2">
                Building Image {hasImage && <span className="text-green-600">✓</span>}
              </label>
              
              <div>
                {!currentImage ? (
                  <div>
                    <Webcam
                      audio={false}
                      ref={webcamRef}
                      screenshotFormat="image/jpeg"
                      width="100%"
                      height={240}
                      videoConstraints={{ facingMode: 'environment' }}
                      className="rounded border mb-2"
                    />
                    <button
                      type="button"
                      onClick={() => handleCapturePhoto(currentBuildingIndex)}
                      className="bg-blue-500 text-white px-4 py-2 rounded mt-2 hover:bg-blue-600 transition-colors"
                    >
                      Capture Building Image
                    </button>
                  </div>
                ) : (
                  <div>
                    <img
                      src={currentImage}
                      alt={`Building ${currentBuildingIndex + 1} Preview`}
                      className="w-full max-w-md h-auto object-cover rounded border mb-2"
                    />
                    <button
                      type="button"
                      onClick={() => handleRetake(currentBuildingIndex)}
                      className="bg-gray-400 text-white px-4 py-2 rounded mt-2 hover:bg-gray-500 transition-colors"
                    >
                      Retake
                    </button>
                  </div>
                )}
              </div>

              {/* Display Latitude and Longitude */}
              {buildingLatitudes[currentBuildingIndex] && buildingLongitudes[currentBuildingIndex] && (
                <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <h4 className="text-sm font-semibold text-blue-900 mb-2">Location Coordinates:</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                    <div>
                      <strong>Latitude:</strong> {buildingLatitudes[currentBuildingIndex].toFixed(6)}
                    </div>
                    <div>
                      <strong>Longitude:</strong> {buildingLongitudes[currentBuildingIndex].toFixed(6)}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center mb-6">
              <button
                type="button"
                onClick={handlePrevious}
                disabled={currentBuildingIndex === 0}
                className="px-4 py-2 bg-gray-500 text-white font-semibold rounded-lg shadow hover:bg-gray-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Previous Building
              </button>
              {currentBuildingIndex < buildings.length - 1 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 transition-colors"
                >
                  Next Building
                </button>
              ) : (
                <span className="text-sm text-gray-600">Last Building</span>
              )}
            </div>

            {/* Summary Section */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold mb-2">Capture Summary:</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm">
                {buildings.map((building, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <span className={`w-4 h-4 rounded-full ${buildingImages[index] ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                    <span>Building {index + 1}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center mt-6">
              <button
                type="submit"
                disabled={loading || !validateForm()}
                className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {loading ? 'Uploading...' : 'Save and Continue to LECAN Upload'}
              </button>
            </div>
          </div>
        </form>
      </section>

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

                {/* Part 5 - Building Images */}
                {summaryData.buildingImages && (
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h3 className="text-lg font-bold text-purple-900 mb-4">Part 5: Building Images & Location</h3>
                    <div className="space-y-3">
                      {buildings.map((building, index) => (
                        <div key={index} className="bg-white p-3 rounded border">
                          <div className="flex items-center gap-2 mb-2">
                            <span className={`w-4 h-4 rounded-full ${summaryData.buildingImages[index] ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                            <span className="font-semibold">Building {index + 1}</span>
                          </div>
                          {buildingLatitudes[index] && buildingLongitudes[index] && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm mt-2">
                              <div><strong>Latitude:</strong> {buildingLatitudes[index].toFixed(6)}</div>
                              <div><strong>Longitude:</strong> {buildingLongitudes[index].toFixed(6)}</div>
                            </div>
                          )}
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

      {/* Success Modal */}
      {showSuccessModal && successData && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
          <div className="bg-white p-4 sm:p-8 rounded shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="text-center mb-6">
              <h2 className="text-lg sm:text-xl font-bold mb-4 text-green-700">Application Submitted Successfully!</h2>
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
                <p className="text-sm text-blue-600 mt-2">Please save this tracking ID for future reference.</p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="font-semibold text-gray-900 mb-2">Buildings Submitted:</p>
                <p className="text-gray-700">{successData.numBuildings} building(s)</p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row justify-center gap-3 mt-6 pt-6 border-t">
              <button
                onClick={() => { 
                  setShowSuccessModal(false); 
                  navigate('/'); 
                }}
                className="px-6 py-2 bg-gray-600 text-white font-semibold rounded-lg shadow hover:bg-gray-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400"
              >
                Close and Return Home
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

