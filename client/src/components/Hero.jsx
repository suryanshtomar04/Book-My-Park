import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Hero() {
  const [mounted, setMounted] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative w-full min-h-screen bg-white flex flex-col lg:block">
      
      {/* ------------------------------------------- */}
      {/* LEFT SIDE: Content & Messaging              */}
      {/* ------------------------------------------- */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 lg:min-h-screen flex items-center pt-32 pb-16 lg:py-0">
        <div className={`w-full lg:w-[50%] lg:pr-16 transition-all duration-1000 ease-out ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          
          <div className="mb-6">
            <span className="text-gray-900 font-bold text-[12px] sm:text-[13px] tracking-[0.2em] uppercase">
              The Smarter Way to Park
            </span>
          </div>
          
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-black text-gray-900 leading-[1.05] mb-6 tracking-tight">
            Find Your <br/>
            <span className="text-blue-600">Perfect</span> Space
          </h1>
          
          <p className="text-lg text-gray-500 mb-10 max-w-md font-medium leading-relaxed">
            Reserve premium parking spots in seconds. Save time and avoid the hassle with our instant booking platform.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link 
              to="/explore" 
              className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-bold text-[16px] px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 group"
            >
              Explore Spaces
              <svg className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3"/>
              </svg>
            </Link>
            
            {user?.role === 'admin' && (
              <Link 
                to="/add-parking" 
                className="inline-flex items-center justify-center bg-white hover:bg-gray-50 text-gray-900 border border-gray-200 font-bold text-[16px] px-8 py-4 rounded-xl transition-all duration-200"
              >
                List Your Space
              </Link>
            )}
          </div>
          
        </div>
      </div>

      {/* ------------------------------------------- */}
      {/* RIGHT SIDE: Clean Rounded Image             */}
      {/* ------------------------------------------- */}
      <div className={`w-full lg:absolute lg:top-0 lg:bottom-0 lg:right-0 lg:w-[50%] h-[40vh] sm:h-[50vh] lg:h-full transition-all duration-1000 ease-out delay-200 mt-6 lg:mt-0 ${mounted ? 'opacity-100' : 'opacity-0 lg:translate-x-12'} overflow-hidden lg:overflow-visible pointer-events-none z-0`}>
        
        {/* Desktop Diagonal Wrapper */}
        <div 
          className="hidden lg:block absolute top-0 bottom-0 right-[0] left-[-15%] rounded-bl-[80px] shadow-2xl overflow-hidden pointer-events-auto"
          style={{ transform: 'skewX(10deg)', transformOrigin: 'top right' }}
        >
          {/* Inner Image - Inverse Skew and Scale to prevent distortion */}
          <img 
            src="https://images.unsplash.com/photo-1541443131876-44b03de101c5?q=80&w=2666&auto=format&fit=crop" 
            alt="Bright Premium Parking" 
            className="absolute inset-0 w-full h-full object-cover object-[75%_center]"
            style={{ transform: 'skewX(-10deg) scale(1.15)', transformOrigin: 'top right' }}
          />
          {/* Subtle Left Edge Blend Gradient */}
          <div 
            className="absolute inset-y-0 left-0 w-[40%] bg-gradient-to-r from-white/80 via-white/20 to-transparent pointer-events-none"
            style={{ transform: 'skewX(-10deg) scale(1.15)', transformOrigin: 'top right' }}
          />
        </div>

        {/* Mobile Variant */}
        <div className="lg:hidden w-full h-full px-4 sm:px-6 pb-6 relative">
          <div className="w-full h-full rounded-3xl shadow-xl overflow-hidden pointer-events-auto relative">
             <img 
              src="https://images.unsplash.com/photo-1541443131876-44b03de101c5?q=80&w=2666&auto=format&fit=crop" 
              alt="Premium Parking Location" 
              className="w-full h-full object-cover object-center pointer-events-none"
            />
            {/* Subtle Top Edge Blend Gradient */}
            <div className="absolute top-0 left-0 right-0 h-[40%] bg-gradient-to-b from-white/60 to-transparent pointer-events-none" />
          </div>
        </div>

      </div>

    </div>
  );
}
