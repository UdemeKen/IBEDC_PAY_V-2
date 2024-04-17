import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { slideData } from '../views/slider/Slider_Data';
import { AiOutlineArrowRight, AiOutlineArrowLeft } from 'react-icons/ai';
import { useStateContext } from '../context/ContextProvider';

export default function GuestLayout() {

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
    <section>
      <div className='flex justify-center items-center h-full '>
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
        <Outlet/>
      </div>
    </section>
  )
}
