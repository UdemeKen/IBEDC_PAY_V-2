import React, { useEffect, useState } from 'react';
import { Link, Navigate, Outlet, useLocation } from 'react-router-dom';
import { slideData } from '../views/slider/Slider_Data';
import { AiOutlineArrowRight, AiOutlineArrowLeft } from 'react-icons/ai';
import { useStateContext } from '../context/ContextProvider';
import GoogleStore from '../assets/images/googleStore.png';
import AppleStore from '../assets/images/appleStore.png';

export default function GuestLayout() {

  const location = useLocation();
  const { userToken } = useStateContext();
  const [ currentSlide, setCurrentSlide ] = useState(0);

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
        </div>
      </div>
    </section>
  )
}
