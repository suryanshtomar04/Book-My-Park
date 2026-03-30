import React from 'react';

export default function Hero() {
  return (
    <div className="relative w-full h-screen flex flex-col justify-center items-center bg-gray-900">
      
      {/* Background Image & Overlay */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1543362906-acfc16c67564?q=80&w=2565&auto=format&fit=crop')" }}
      >
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* Content wrapper */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 flex flex-col items-center">
        
        {/* Typography following second screenshot's layout */}
        <p className="text-white/90 text-sm sm:text-base font-medium mb-3 tracking-wide text-center">
          Find parking spaces for rent near you
        </p>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-12 text-center tracking-tight">
          Find Your Perfect Space
        </h1>

        {/* Combined Floating Rounded Search Bar Container */}
        <div className="w-full max-w-6xl bg-white rounded-full flex flex-col md:flex-row items-center p-2 shadow-2xl relative">

          {/* Location Field */}
          <div className="flex-[1.5] w-full px-5 py-3 border-b md:border-b-0 md:border-r border-gray-200 focus-within:bg-gray-50 rounded-t-3xl md:rounded-l-full md:rounded-tr-none transition-colors">
            <input 
              type="text" 
              placeholder="Where do you need parking?" 
              className="w-full bg-transparent text-gray-900 text-[15px] font-medium focus:outline-none placeholder-gray-500 min-w-0"
            />
          </div>

          {/* Start Date Field */}
          <div className="flex-1 w-full px-5 py-3 border-b md:border-b-0 md:border-r border-gray-200 focus-within:bg-gray-50 transition-colors">
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Start Date</label>
            <input 
              type="date" 
              className="w-full bg-transparent text-gray-900 text-sm font-medium focus:outline-none cursor-pointer min-w-0"
            />
          </div>

          {/* Start Time Field */}
          <div className="flex-1 w-full px-5 py-3 border-b md:border-b-0 md:border-r border-gray-200 focus-within:bg-gray-50 transition-colors">
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Start Time</label>
            <input 
              type="time" 
              className="w-full bg-transparent text-gray-900 text-sm font-medium focus:outline-none cursor-pointer min-w-0"
            />
          </div>

          {/* End Date Field */}
          <div className="flex-1 w-full px-5 py-3 border-b md:border-b-0 md:border-r border-gray-200 focus-within:bg-gray-50 transition-colors">
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">End Date</label>
            <input 
              type="date" 
              className="w-full bg-transparent text-gray-900 text-sm font-medium focus:outline-none cursor-pointer min-w-0"
            />
          </div>

          {/* End Time Field */}
          <div className="flex-1 w-full px-5 py-3 focus-within:bg-gray-50 transition-colors">
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">End Time</label>
            <input 
              type="time" 
              className="w-full bg-transparent text-gray-900 text-sm font-medium focus:outline-none cursor-pointer min-w-0"
            />
          </div>

          {/* Search Button (Blue to match BoxCars screenshot) */}
          <div className="w-full md:w-auto pb-2 md:pb-0 pl-2 pr-2 md:pr-0 md:ml-1 mt-2 md:mt-0">
            <button className="w-full md:w-auto bg-[#4755f1] hover:bg-[#3944c2] text-white font-semibold py-4 px-10 rounded-full transition-colors flex items-center justify-center gap-2 whitespace-nowrap shadow-md">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
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
