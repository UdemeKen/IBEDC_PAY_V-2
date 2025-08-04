import React, { useEffect, useState } from 'react';
import { Link, Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { slideData } from '../views/slider/Slider_Data';
import { AiOutlineArrowRight, AiOutlineArrowLeft } from 'react-icons/ai';
import { useStateContext } from '../context/ContextProvider';
import GoogleStore from '../assets/images/googleStore.png';
import AppleStore from '../assets/images/appleStore.png';
import axiosClient from '../axios';
import { toast } from 'react-toastify';

export default function GuestLayout() {

  const location = useLocation();
  const { userToken } = useStateContext();
  const [ currentSlide, setCurrentSlide ] = useState(0);
  const [showTrackingModal, setShowTrackingModal] = useState(false);
  const [trackingIdInput, setTrackingIdInput] = useState('');
  const [modalLoading, setModalLoading] = useState(false);
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [showChecklistModal, setShowChecklistModal] = useState(false);
  const navigate = useNavigate();

  const slideLength = slideData.length;

  const autoSlide = true;
  let autoSlideInterval;
  let autoSlideTimeout = 10000;
  const nextSlide = () => {
      setCurrentSlide(currentSlide === slideLength - 1 ? 0 : currentSlide + 1)
  }
  const prevSlide = () => {
      setCurrentSlide(currentSlide === 0 ? slideLength - 1 : currentSlide - 1)
  }
  function resetAutoSlide() {
      autoSlideInterval = setInterval(nextSlide, autoSlideTimeout);
  }
  useEffect(() => {
      setCurrentSlide(0)
  }, [])
  useEffect(() => {
      if (autoSlide) {
          resetAutoSlide();
      }
      return () => {
          if (autoSlide) {
              clearInterval(autoSlideInterval);
          }
      }
  }, [currentSlide])
  const handlePageRefresh = () => {
      window.location.reload();
  };

  if (userToken) {
    return <Navigate to="/default/customerdashboard" />;
  }

  const handleNewCustomerClick = (e) => {
    e.preventDefault();
    setShowTrackingModal(true);
  };

  const handleContinueWithTrackingId = async () => {
    if (trackingIdInput.trim()) {
      setModalLoading(true);
      try {
        const response = await axiosClient.post('/V4IBEDC_new_account_setup_sync/initiate/track-application', { tracking_id: trackingIdInput.trim() });
        const data = response.data;
        if (data.success && data.payload && data.payload.customer) {
          setShowTrackingModal(false);
          setModalLoading(false);
          const customer = data.payload.customer;

          // Store all relevant data in localStorage for later use
          localStorage.setItem('TRACKING_ID', customer.tracking_id);
          if (customer.no_of_account_apply_for) {
            localStorage.setItem('no_of_account_apply_for', customer.no_of_account_apply_for);
          }
          if (customer.continuation?.latitude) {
            localStorage.setItem('LATITUDE', customer.continuation.latitude);
            localStorage.setItem('LONGITUDE', customer.continuation.longitude);
          }

          // Check if all uploaded pictures have lecan links
          const hasMissingLecan = customer.uploaded_pictures?.some(picture => !picture.lecan_link);
          if (hasMissingLecan) {
            const numBuildings = customer.no_of_account_apply_for
              ? Number(customer.no_of_account_apply_for)
              : (customer.uploaded_pictures && customer.uploaded_pictures.length)
                ? customer.uploaded_pictures.length
                : 1;
            console.log('Navigating to /lecanUpload with:', {
              trackingId: String(customer.tracking_id),
              numBuildings,
              uploadedBuildings: customer.uploaded_pictures || [],
              buildingIds: customer.uploaded_pictures ? customer.uploaded_pictures.map(pic => pic.id) : []
            });
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

          // Check if all uploaded pictures have account numbers
          const hasPendingApplications = customer.uploaded_pictures?.some(picture => !picture.account_no);
          if (hasPendingApplications) {
            setShowWarningModal(true);
            setModalLoading(false);
            return;
          }

          // Navigation logic based on what is filled
          if (!customer.continuation) {
            // Only main form filled, go to continuation form
            navigate('/continuationForm', { state: { prefill: customer } });
          } else if (!customer.uploadinformation) {
            // Main + continuation filled, go to document upload
            navigate('/finalForm', { state: { prefill: customer.continuation } });
          } else if (!customer.uploaded_pictures || customer.uploaded_pictures.length === 0) {
            // Main + continuation + document upload filled, go to final upload
            navigate('/finalForm', { state: { prefill: customer.uploaded_pictures } });
          } else {
            // All steps complete, show summary or success
            navigate('/finalForm', { state: { prefill: customer.uploaded_pictures } });
          }
        } else {
          toast.error(data.message || 'Invalid tracking ID.');
          setModalLoading(false);
        }
      } catch (error) {
        toast.error(error.response?.data?.message || 'Network error. Please try again.');
        setModalLoading(false);
      }
    }
  };

  const handleCloseWarningModal = () => {
    setShowWarningModal(false);
    setShowTrackingModal(false);
  };

  const handleStartNew = () => {
    setShowTrackingModal(false);
    setShowChecklistModal(true);
  };

  return (
    <section className='bg-white border border-black h-screen sm:h-full'>
      <div className='flex justify-center items-center h-full'>
        {slideData.map((slide, index) => {
            return (
                <div className={index === currentSlide ? "w-full h-full pageSlide currentPage hidden sm:block" : "hidden sm:block pageSlide"} key={index}>
                {index === currentSlide && (
                <div className='relative'>
                    <div className='absolute inset-0 bg-gradient-to-t from-black from-0%'></div>
                        <div className='flex flex-row justify-between items-center absolute inset-0 mx-4 opacity-40'>
                            <AiOutlineArrowLeft className='sm:w-6 sm:h-6 text-white border-2 border-white hover:border-orange-500 rounded-full cursor-pointer prev hover:text-orange-500 transform duration-300 ease-in-out' onClick={prevSlide}/>
                            <AiOutlineArrowRight className='sm:w-6 sm:h-6 text-white border-2 border-white hover:border-orange-500 rounded-full cursor-pointer next hover:text-orange-500 transform duration-300 ease-in-out' onClick={nextSlide}/>
                        </div>
                    <img src={slide.image} alt='backgroundSlideImage' className='w-full h-screen object-cover bg-Image-slide bg-current'/>
                    <div className='absolute inset-0 w-1/2 h-1/6 flex justify-start my-4 mx-4' onClick={handlePageRefresh}>
                        <img src={slide.logo} alt='logo' className='w-20 h-20 cursor-pointer'/>
                    </div>
                    <div className='absolute inset-y-80'>
                        <div className='w-68 sm:my-16 mx-10 text-center'>
                            <h1 className='text-white text-4xl font-bold leading-snug'>{slide.title}</h1>
                        </div>
                    </div>
                </div>
                )}
            </div>
          )
        })}
        <div className='flex flex-col justify-center items-center px-4 w-full sm:w-1/2'>
            <Outlet/>
            <div className='flex flex-col items-center space-y-4 text-slate-500'>
                {location.pathname == "/" && <div className='text-sm font-semibold text-center my-5'>
                    <p>Don't have a password? Click <span className='text-orange-500'><Link to={"/meternumber"} className='text-2xl'>(Here)</Link></span> to login with your <span className='capitalize'>meter number</span> and <span className='capitalize'>account type</span></p>
                </div>}
                {location.pathname == "/meternumber" && <div className='text-sm font-semibold text-center my-5'>
                    <p>Don't have a meter number? Click <span className='text-orange-500'><Link to={"/"}className='text-2xl'>(Here)</Link></span> to login with your <span className='capitalize'>password</span></p>
                </div>}
                <div className='capitalize text-sm'>
                    <Link to={"/forgotpassword"} className={"text-amber-600 opacity-70 hover:text-orange-500 hover:font-semibold transform duration-300 ease-in-out"}>forgot password</Link>
                </div>
                <div className='text-xs font-semibold text-center'>
                    {location.pathname == "/" && <p className=''>Not yet an IBEDC Customer? <span className='text-orange-500'><Link to={"/signup"}>Signup</Link></span></p>}
                    {location.pathname == "/meternumber" && <p className=''>Not yet an IBEDC Customer? <span className='text-orange-500'><Link to={"/signup"}>Signup</Link></span></p>}
                    {location.pathname == "/signup" && <p className=''>Already an IBEDC Customer? <span className='text-orange-500'><Link to={"/"}>Login</Link></span></p>}
                </div>
                <div className='text-xs font-semibold text-slate-500 my-5 text-center'>
                    <p>By clicking on Sign up, you agree to our <span className='text-orange-500'><Link to={"https://www.ibedc.com/terms-of-service"} target='_blank'>terms & conditions</Link></span> and <span className='text-orange-500'><Link to={"/privacypolicy"} target='_blank'>privacy policy</Link></span></p>
                </div>
            </div>
            <div className='flex flex-row justify-center items-center space-x-10 my-5'>
                <Link to={"https://play.google.com/store/apps/details?id=com.ibedc.ibedcpay"} target='_blank'>
                    <img 
                        src={GoogleStore}
                        alt="google_playstore-link"
                        width={150}
                        height={150}
                    />
                </Link>
                <Link to={"https://apps.apple.com/ng/app/ibedcpay/id6478964557"} target='_blank'>
                    <img 
                        src={AppleStore}
                        alt="google_playstore-link"
                        width={150}
                        height={150}
                        className='h-[75px]'
                    />
                </Link>
            </div> 
            <div className='flex flex-row justify-center items-center space-x-10'>
                <button
                    className='bg-blue-950 opacity-75 hover:bg-orange-500 duration-300 ease-in-out text-white font-bold py-2 px-4 rounded'
                    onClick={handleNewCustomerClick}
                >
                    New Customer Account Creation
                </button>
            </div>
        </div>
      </div>
      {showTrackingModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-8 rounded shadow-lg max-w-md w-full flex flex-col items-center">
            <h2 className="text-xl font-bold mb-4 text-center text-blue-700">Continue Application</h2>
            <p className="mb-2 text-center">If you have a Tracking ID, enter it below to continue your application. Otherwise, start a new application.</p>
            <input
              type="text"
              placeholder="Enter Tracking ID"
              value={trackingIdInput}
              onChange={e => setTrackingIdInput(e.target.value)}
              className="mb-4 border rounded px-2 py-1 w-full text-center"
            />
            <div className="flex flex-row gap-4 w-full justify-center">
              <button
                onClick={handleContinueWithTrackingId}
                className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
                disabled={!trackingIdInput.trim() || modalLoading}
              >
                {modalLoading ? 'Loading...' : 'Continue'}
              </button>
              <button
                onClick={handleStartNew}
                className="px-6 py-2 bg-gray-400 text-white font-semibold rounded-lg shadow hover:bg-gray-500 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-300"
                disabled={modalLoading}
              >
                Start New
              </button>
            </div>
          </div>
        </div>
      )}

      {showWarningModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-8 rounded shadow-lg max-w-md w-full flex flex-col items-center">
            <h2 className="text-xl font-bold mb-4 text-center text-yellow-600">Application Status Pending</h2>
            <div className="text-center mb-6">
              <p className="mb-2">Your previous application is currently being processed.</p>
              <p className="mb-2">Please check back after 10 days to continue with your application.</p>
              <p className="text-sm text-gray-600">This is to ensure all your previous applications are properly processed.</p>
            </div>
            <button
              onClick={handleCloseWarningModal}
              className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {showChecklistModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-8 rounded shadow-lg max-w-lg w-full flex flex-col items-center">
            <h2 className="text-xl font-bold mb-4 text-center text-blue-700">Checklist: What You Need to Start</h2>
            <p className="mb-4 text-center text-gray-700">Dear customer, to fill this form successfully, please ensure you have the following information and documents ready before starting your application:</p>
            <ul className="list-disc list-inside text-left mb-6 text-gray-800 text-sm sm:text-base">
              <li>Valid phone number and email address</li>
              <li>National Identification Number (NIN)</li>
              <li>Landlord's full name, phone number, and email</li>
              <li>Landlord's date of birth</li>
              <li>Landlord's means of identification (e.g., NIN, Driver's License, International Passport)</li>
            </ul>
            <button
              onClick={() => {
                setShowChecklistModal(false);
                navigate('/electricitySupplyForm');
              }}
              className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 w-full mt-2"
            >
              Proceed to Application
            </button>
          </div>
        </div>
      )}
    </section>
  )
}
