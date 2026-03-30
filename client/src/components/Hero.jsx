import React, { useState, useEffect } from 'react';

export default function Hero() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Add a tiny delay to ensure paint has happened so the transition triggers fluidly
    const timer = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative w-full h-screen flex flex-col justify-center items-center bg-gray-900 overflow-hidden">
      
      {/* Background Image & Overlay */}
      <div 
        className={`absolute inset-0 z-0 bg-cover bg-center bg-no-repeat transition-all duration-[2000ms] ease-out ${mounted ? 'scale-100 opacity-100' : 'scale-105 opacity-80'}`}
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=2666&auto=format&fit=crop')" }}
      >
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Content wrapper */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center">
        
        {/* Premium Typography - Staggered Fade Up */}
        <div className={`flex flex-col items-center transition-all duration-1000 ease-out ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <p className="text-white/70 text-[11px] sm:text-[13px] font-medium mb-4 tracking-[0.2em] text-center uppercase">
            Find parking spaces for rent near you
          </p>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-medium text-white mb-14 text-center tracking-wide leading-tight">
            Find Your Perfect Space
          </h1>
        </div>

        {/* Floating Search Bar Container - Delayed Slide Up */}
        <div 
          className={`w-full max-w-[960px] mx-auto bg-white rounded-full flex flex-col md:flex-row items-center p-1.5 sm:p-2 shadow-[0_12px_40px_rgba(0,0,0,0.12)] relative transition-all duration-1000 delay-200 ease-out ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
        >

          {/* Location Field */}
          <div className="flex-[1.5] w-full px-5 py-2 hover:bg-gray-50/80 focus-within:bg-gray-50/80 rounded-full transition-all duration-200 cursor-pointer">
            <input 
              type="text" 
              placeholder="Where do you need parking?" 
              className="w-full bg-transparent text-gray-900 text-[14px] font-normal focus:outline-none placeholder-gray-400 min-w-0 pointer-events-none md:pointer-events-auto"
            />
          </div>

          <div className="hidden md:block w-px h-6 bg-gray-100 mx-1"></div>

          {/* Start Date Field */}
          <div className="flex-1 w-full px-4 py-2 hover:bg-gray-50/80 focus-within:bg-gray-50/80 rounded-full transition-all duration-200 cursor-pointer">
            <label className="block text-[9px] font-medium text-gray-400 uppercase tracking-widest mb-0.5 cursor-pointer">Start Date</label>
            <input 
              type="date" 
              className="w-full bg-transparent text-gray-800 text-[13px] font-normal focus:outline-none cursor-pointer min-w-0"
            />
          </div>

          <div className="hidden md:block w-px h-6 bg-gray-100 mx-1"></div>

          {/* Start Time Field */}
          <div className="flex-1 w-full px-4 py-2 hover:bg-gray-50/80 focus-within:bg-gray-50/80 rounded-full transition-all duration-200 cursor-pointer">
            <label className="block text-[9px] font-medium text-gray-400 uppercase tracking-widest mb-0.5 cursor-pointer">Start Time</label>
            <input 
              type="time" 
              className="w-full bg-transparent text-gray-800 text-[13px] font-normal focus:outline-none cursor-pointer min-w-0"
            />
          </div>

          <div className="hidden md:block w-px h-6 bg-gray-100 mx-1"></div>

          {/* End Date Field */}
          <div className="flex-1 w-full px-4 py-2 hover:bg-gray-50/80 focus-within:bg-gray-50/80 rounded-full transition-all duration-200 cursor-pointer">
            <label className="block text-[9px] font-medium text-gray-400 uppercase tracking-widest mb-0.5 cursor-pointer">End Date</label>
            <input 
              type="date" 
              className="w-full bg-transparent text-gray-800 text-[13px] font-normal focus:outline-none cursor-pointer min-w-0"
            />
          </div>

          <div className="hidden md:block w-px h-6 bg-gray-100 mx-1"></div>

          {/* End Time Field */}
          <div className="flex-1 w-full px-4 py-2 hover:bg-gray-50/80 focus-within:bg-gray-50/80 rounded-full transition-all duration-200 cursor-pointer">
            <label className="block text-[9px] font-medium text-gray-400 uppercase tracking-widest mb-0.5 cursor-pointer">End Time</label>
            <input 
              type="time" 
              className="w-full bg-transparent text-gray-800 text-[13px] font-normal focus:outline-none cursor-pointer min-w-0"
            />
          </div>

          {/* Search Button - Floating Scale Hover */}
          <div className="w-full md:w-auto mt-2 md:mt-0 md:ml-2">
            <button className="w-full md:w-auto bg-[#3b5cf2] hover:bg-[#2e47c7] text-white font-medium text-[14px] py-3 px-8 rounded-full transition-all duration-300 transform hover:-translate-y-0.5 hover:scale-[1.03] active:scale-[0.97] flex items-center justify-center gap-2 whitespace-nowrap shadow-md hover:shadow-xl shadow-blue-500/20 hover:shadow-blue-500/30">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              Search
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
