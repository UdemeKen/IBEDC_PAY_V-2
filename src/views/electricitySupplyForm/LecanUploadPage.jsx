import React, { useState, useEffect } from 'react';
import { Black_Logo } from '../../assets/images';
import { Ibedc_Approved_Logo } from '../../assets/images';
import { toast } from 'react-toastify';
import axiosClient from '../../axios';
import { useNavigate, useLocation } from 'react-router-dom';

export default function LecanUploadPage() {
  const location = useLocation();
  const navigate = useNavigate();

  // Get the list of buildings that have already been uploaded
  const { trackingId, numBuildings: numBuildingsRaw, uploadedBuildings = [], buildingIds = [] } = location.state || {};
  // Fallback: if numBuildings is not set, use uploadedBuildings.length
  const numBuildings = typeof numBuildingsRaw === 'number' && numBuildingsRaw > 0 ? numBuildingsRaw : uploadedBuildings.length;
  console.log(buildingIds);
  

  // Only buildings with lecan_link === null need upload
  const buildingsNeedingLecan = uploadedBuildings.filter(b => !b.lecan_link);
  const [lecanFiles, setLecanFiles] = useState(new Array(buildingsNeedingLecan.length).fill(null));
  const [loading, setLoading] = useState(false);

  // Redirect if no data is passed
  useEffect(() => {
    if (!trackingId || !Array.isArray(uploadedBuildings) || uploadedBuildings.length === 0) {
      toast.error('Invalid data received. Redirecting...');
      navigate('/');
    }
  }, [trackingId, numBuildings, uploadedBuildings, navigate]);

  const handleFileChange = (index, file) => {
    const newFiles = [...lecanFiles];
    newFiles[index] = file;
    setLecanFiles(newFiles);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validate that all files for buildings needing LECAN are selected
    const missingFiles = lecanFiles.some(file => file === null);
    if (missingFiles && buildingsNeedingLecan.length > 0) {
      toast.error('Please upload a LECAN form for each pending building.');
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append('tracking_id', trackingId);

    // Only include files for buildings needing LECAN
    buildingsNeedingLecan.forEach((building, index) => {
      const file = lecanFiles[index];
      if (file) {
        const buildingId = building.id || index + 1;
        formData.append(`uploads[${index}][id]`, buildingId);
        formData.append(`uploads[${index}][building_number]`, building.house_no || index + 1);
        formData.append(`uploads[${index}][lecan_link]`, file);
      }
    });

    const apiUrl = '/V4IBEDC_new_account_setup_sync/initiate/upload-lecan-form-application';

    try {
      const response = await axiosClient.post(apiUrl, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      const data = response.data;
      if (data.success) {
        toast.success(data.message || 'LECAN forms uploaded successfully!');
        navigate('/');
      } else {
        toast.error(data.message || 'An error occurred during upload.');
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

  if (!trackingId || !Array.isArray(uploadedBuildings) || uploadedBuildings.length === 0) {
    return null;
  }

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
              <h4 className='text-base sm:text-lg'>New Customer Account Creation Form - LECAN Upload</h4>
              <p className='text-sm sm:text-base text-center'>Tracking ID: {trackingId}</p>
            </div>
            <div className='text-gray-200 hidden sm:block'>
              <p>Kendrick</p>
            </div>
          </div>
        </div>

        {/* Title Section */}
        <div className='font-bold text-base sm:text-lg mt-4 sm:mt-8 mx-4 sm:mx-20 -mb-2'>
          <h1>LECAN Form Information</h1>
        </div>

        {/* Form Section */}
        <div className="mx-2 sm:mx-4 md:mx-8 lg:mx-20 xl:mx-52 my-4 sm:my-10 p-4 sm:p-6 border rounded shadow-sm bg-white">
          {/* Display message for previously uploaded buildings */} 
          {/* {uploadedBuildings.length > 0 && ( 
            <div className="mt-4 mb-6 p-4 bg-gray-50 rounded-lg"> 
              <h3 className="font-semibold text-sm sm:text-base mb-2">Previously Uploaded Buildings:</h3> 
              <p className="text-sm sm:text-base text-gray-600"> 
                {uploadedBuildings.filter(b => b.lecan_link).map((b, i) => (
                  <span key={b.id || i}>
                    Building {b.house_no || (i + 1)}{i < uploadedBuildings.length - 1 ? ', ' : ''}
                  </span>
                ))} were previously uploaded and do not require new LECAN forms. 
              </p> 
            </div> 
          )}  */}

          {/* Display upload fields only for buildings needing LECAN */} 
          {buildingsNeedingLecan.length > 0 ? (
            <>
              <h2 className="text-base sm:text-lg font-bold mt-6 sm:mt-8 mb-4">
                Upload LECAN Forms for Pending Buildings
              </h2>

              <form onSubmit={handleSubmit}>
                {buildingsNeedingLecan.map((building, index) => (
                  <div key={building.id || index} className="mb-4">
                    <label className="font-semibold text-sm sm:text-base">
                      Building {building.house_no || (index + 1)} ({building.full_address}) LECAN Form:
                    </label>
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => handleFileChange(index, e.target.files[0])}
                      className="mt-2 block w-full text-xs sm:text-sm text-gray-500
                        file:mr-2 sm:file:mr-4 file:py-1 sm:file:py-2 file:px-2 sm:file:px-4
                        file:rounded-full file:border-0
                        file:text-xs sm:file:text-sm file:font-semibold
                        file:bg-blue-50 file:text-blue-700
                        hover:file:bg-blue-100"
                      required
                    />
                    {lecanFiles[index] && (
                      <p className="mt-1 text-xs sm:text-sm text-gray-600 break-all">
                        Selected file: {lecanFiles[index].name}
                      </p>
                    )}
                  </div>
                ))}

                <div className='flex justify-center mt-6 sm:mt-8'>
                  <button
                    type="submit"
                    className="w-full sm:w-auto px-4 sm:px-6 py-2 text-sm sm:text-base bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    disabled={loading}
                  >
                    {loading ? 'Submitting...' : 'Submit'}
                  </button>
                </div>
              </form>
            </>
          ) : ( 
            <div className="mt-6 p-4 bg-green-50 rounded-lg"> 
              <p className="text-center text-sm sm:text-base text-green-700 font-semibold"> 
                All required LECAN forms have been uploaded. 
              </p> 
            </div> 
          )} 
        </div>
      </section>
    </div>
  );
} 