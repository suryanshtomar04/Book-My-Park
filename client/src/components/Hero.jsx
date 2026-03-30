import React from 'react';

export default function Hero() {
  return (
    <div className="relative w-full h-screen flex flex-col justify-center items-center bg-gray-900">
      
      {/* Background Image & Overlay */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=2666&auto=format&fit=crop')" }}
      >
        {/* Dark overlay for premium marketplace aesthetic */}
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Content wrapper carefully centered vertically and horizontally */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 flex flex-col items-center justify-center">
        
        {/* Premium Typography */}
        <p className="text-white/80 text-sm sm:text-base font-semibold mb-6 tracking-widest text-center uppercase">
          Find parking spaces for rent near you
        </p>
        
        {/* Maximized heading with generous bottom spacing */}
        <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-[6rem] xl:text-[7rem] font-bold text-white mb-24 text-center tracking-tight leading-none">
          Find Your Perfect Space
        </h1>

        {/* Combined Floating Rounded Search Bar Container */}
        {/* Slightly thinner width (max-w-4xl to 1000px) and tighter inner padding (p-2 to 2.5) */}
        <div className="w-full max-w-[1000px] mx-auto bg-white rounded-full flex flex-col md:flex-row items-center p-2 sm:p-2.5 shadow-2xl relative">

          {/* Location Field */}
          <div className="flex-[1.5] w-full px-6 py-1.5 border-b border-gray-100 md:border-b-0 focus-within:bg-gray-50/50 rounded-t-3xl md:rounded-l-full md:rounded-tr-none transition-colors">
            <input 
              type="text" 
              placeholder="Where do you need parking?" 
              className="w-full bg-transparent text-gray-900 text-[15px] font-medium focus:outline-none placeholder-gray-400 min-w-0"
            />
          </div>

          {/* Subtle Divider */}
          <div className="hidden md:block w-px h-8 bg-gray-200 mx-1"></div>

          {/* Start Date Field */}
          <div className="flex-1 w-full px-5 py-1.5 border-b border-gray-100 md:border-b-0 focus-within:bg-gray-50/50 transition-colors">
            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Start Date</label>
            <input 
              type="date" 
              className="w-full bg-transparent text-gray-900 text-sm font-medium focus:outline-none cursor-pointer min-w-0"
            />
          </div>

          {/* Subtle Divider */}
          <div className="hidden md:block w-px h-8 bg-gray-200 mx-1"></div>

          {/* Start Time Field */}
          <div className="flex-1 w-full px-5 py-1.5 border-b border-gray-100 md:border-b-0 focus-within:bg-gray-50/50 transition-colors">
            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Start Time</label>
            <input 
              type="time" 
              className="w-full bg-transparent text-gray-900 text-sm font-medium focus:outline-none cursor-pointer min-w-0"
            />
          </div>

          {/* Subtle Divider */}
          <div className="hidden md:block w-px h-8 bg-gray-200 mx-1"></div>

          {/* End Date Field */}
          <div className="flex-1 w-full px-5 py-1.5 border-b border-gray-100 md:border-b-0 focus-within:bg-gray-50/50 transition-colors">
            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">End Date</label>
            <input 
              type="date" 
              className="w-full bg-transparent text-gray-900 text-sm font-medium focus:outline-none cursor-pointer min-w-0"
            />
          </div>

          {/* Subtle Divider */}
          <div className="hidden md:block w-px h-8 bg-gray-200 mx-1"></div>

          {/* End Time Field */}
          <div className="flex-1 w-full px-5 py-1.5 focus-within:bg-gray-50/50 transition-colors">
            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">End Time</label>
            <input 
              type="time" 
              className="w-full bg-transparent text-gray-900 text-sm font-medium focus:outline-none cursor-pointer min-w-0"
            />
          </div>

          {/* Search Button */}
          <div className="w-full md:w-auto mt-3 md:mt-0 md:ml-3">
            <button className="w-full md:w-auto bg-[#3b5cf2] hover:bg-[#2e47c7] text-white font-medium text-[15px] py-3.5 px-8 rounded-full transition-all flex items-center justify-center gap-2 whitespace-nowrap shadow-xl shadow-blue-500/25">
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
