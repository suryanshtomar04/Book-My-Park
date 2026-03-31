import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function Hero() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Add a tiny delay to ensure paint has happened so the transition triggers fluidly
    const timer = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative w-full min-h-screen pt-32 pb-20 flex flex-col justify-center items-center bg-gradient-to-b from-white to-gray-100 overflow-hidden">
      
      {/* Decorative Blur Blobs for subtle background depth */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-100/40 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-100/40 rounded-full blur-[100px] pointer-events-none"></div>

      {/* Floating Mock UI Card (Left) */}
      <div className={`hidden lg:flex absolute left-[6%] top-[25%] bg-white/90 backdrop-blur-md p-5 rounded-3xl shadow-xl border border-white/50 flex-col gap-4 w-[240px] transition-all duration-[1200ms] delay-100 ease-out transform ${mounted ? 'translate-y-0 opacity-100 -rotate-3 hover:rotate-0' : 'translate-y-16 opacity-0'}`}>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gray-100 rounded-xl overflow-hidden shrink-0">
            <img src="https://images.unsplash.com/photo-1590674899484-ac33d3c80cd8?w=100&q=80" alt="spot" className="w-full h-full object-cover" />
          </div>
          <div>
            <div className="text-[13px] font-bold text-gray-900 leading-tight">City Center Plaza</div>
            <div className="text-[12px] text-green-600 font-medium">Available Now</div>
          </div>
        </div>
        <div className="flex justify-between items-center pt-2 border-t border-gray-100">
          <span className="text-[11px] text-gray-500 font-medium tracking-wide border border-gray-200 px-2 py-1 rounded-md">1.2 km away</span>
          <span className="text-[14px] font-extrabold text-blue-600">₹50/hr</span>
        </div>
      </div>

      {/* Floating Mock UI Card (Right) */}
      <div className={`hidden lg:flex absolute right-[6%] bottom-[25%] bg-white/90 backdrop-blur-md p-4 rounded-3xl shadow-xl border border-white/50 flex-col gap-3 w-[220px] transition-all duration-[1200ms] delay-300 ease-out transform ${mounted ? 'translate-y-0 opacity-100 rotate-3 hover:rotate-0' : 'translate-y-16 opacity-0'}`}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center shrink-0">
            <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div>
            <div className="text-[14px] font-bold text-gray-900">Spot Confirmed</div>
            <div className="text-[12px] text-gray-500 font-medium">Booking ID: #8892</div>
          </div>
        </div>
      </div>

      {/* Content wrapper */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center">
        
        {/* Premium Typography - Staggered Fade Up */}
        <div className={`flex flex-col items-center transition-all duration-[1000ms] ease-out ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="inline-block px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 mb-6">
            <p className="text-blue-600 text-[11px] sm:text-[13px] font-bold tracking-[0.2em] text-center uppercase">
              The Smarter Way to Park
            </p>
          </div>
          
          <h1 className="text-5xl sm:text-6xl md:text-[4.5rem] font-black text-gray-900 mb-8 text-center tracking-tight leading-[1.05]">
            Find Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Perfect</span> Space
          </h1>
          <p className="text-lg sm:text-xl text-gray-500 mb-14 text-center max-w-2xl font-medium leading-relaxed">
            Reserve premium parking spots in seconds. Save time and avoid the hassle with our instant booking platform.
          </p>
        </div>

        {/* Floating Search Bar Container - Delayed Slide Up */}
        <div 
          className={`w-full max-w-[960px] mx-auto bg-white rounded-full flex flex-col md:flex-row items-center p-1.5 sm:p-2 border border-blue-100/50 shadow-[0_20px_60px_rgba(0,0,0,0.06)] relative transition-all duration-[1000ms] delay-200 ease-out ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
        >

          {/* Location Field */}
          <div className="flex-[1.5] w-full px-5 py-2 hover:bg-gray-50 focus-within:bg-gray-50 rounded-full transition-all duration-200 cursor-pointer">
            <input 
              type="text" 
              placeholder="Where do you need parking?" 
              className="w-full bg-transparent text-gray-900 text-[14px] font-medium focus:outline-none placeholder-gray-400 min-w-0"
            />
          </div>

          <div className="hidden md:block w-px h-8 bg-gray-100 mx-1"></div>

          {/* Date Field */}
          <div className="flex-1 w-full px-4 py-2 hover:bg-gray-50 focus-within:bg-gray-50 rounded-full transition-all duration-200 cursor-pointer">
            <label className="block text-[10px] font-bold text-blue-600 uppercase tracking-widest mb-0.5 cursor-pointer">Start Date</label>
            <input 
              type="date" 
              className="w-full bg-transparent text-gray-900 text-[13px] font-medium focus:outline-none cursor-pointer min-w-0"
            />
          </div>

          <div className="hidden md:block w-px h-8 bg-gray-100 mx-1"></div>

          {/* Time Field */}
          <div className="flex-1 w-full px-4 py-2 hover:bg-gray-50 focus-within:bg-gray-50 rounded-full transition-all duration-200 cursor-pointer">
            <label className="block text-[10px] font-bold text-blue-600 uppercase tracking-widest mb-0.5 cursor-pointer">Start Time</label>
            <input 
              type="time" 
              className="w-full bg-transparent text-gray-900 text-[13px] font-medium focus:outline-none cursor-pointer min-w-0"
            />
          </div>

          {/* Search Button - Floating Scale Hover */}
          <div className="w-full md:w-auto mt-3 md:mt-0 md:ml-3">
            <button className="w-full md:w-auto bg-blue-600 hover:brightness-95 text-white font-bold text-[15px] py-4 px-10 rounded-full transition-all duration-150 ease-out shadow-[0_10px_20px_rgb(37,99,235,0.2)] hover:shadow-[0_10px_25px_rgb(37,99,235,0.3)] flex items-center justify-center gap-2 whitespace-nowrap">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              Search
            </button>
          </div>

        </div>

        {/* Trust Badges */}
        <div className={`mt-14 flex flex-col sm:flex-row items-center gap-4 transition-all duration-[1000ms] delay-300 ease-out ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="flex -space-x-3">
            <div className="w-10 h-10 rounded-full border-2 border-white shadow-sm bg-blue-100 flex items-center justify-center text-[12px] font-extrabold text-blue-700 select-none">JD</div>
            <div className="w-10 h-10 rounded-full border-2 border-white shadow-sm bg-green-100 flex items-center justify-center text-[12px] font-extrabold text-green-700 select-none">SR</div>
            <div className="w-10 h-10 rounded-full border-2 border-white shadow-sm bg-purple-100 flex items-center justify-center text-[12px] font-extrabold text-purple-700 select-none">AL</div>
            <div className="w-10 h-10 rounded-full border-2 border-white shadow-sm bg-amber-100 flex items-center justify-center text-[12px] font-extrabold text-amber-700 select-none">KT</div>
            <div className="w-10 h-10 rounded-full border-2 border-white shadow-sm bg-gray-100 flex items-center justify-center text-[10px] font-black text-gray-600 select-none">+</div>
          </div>
          <div className="flex flex-col text-left items-center sm:items-start">
            <div className="flex items-center gap-1 mb-0.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg key={star} className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                </svg>
              ))}
            </div>
            <span className="text-[13px] font-bold text-gray-700 tracking-wide">Trusted by 500+ drivers</span>
          </div>
        </div>

      </div>
    </div>
  );
}
