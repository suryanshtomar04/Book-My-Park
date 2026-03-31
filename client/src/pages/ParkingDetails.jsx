import React from 'react';
import { Link } from 'react-router-dom';

// Hardcoded preview dummy data aligned with Explore page details
const DUMMY_PARKING = {
  id: 'preview',
  title: 'Downtown Premium Garage',
  location: 'Sector 62, City Center',
  price: 50,
  image: 'https://images.unsplash.com/photo-1590674899484-ac33d3c80cd8?q=80&w=1200&auto=format&fit=crop',
};

export default function ParkingDetails() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-gray-900">
      
      {/* Main Container - added thick top padding to respect universal translucent navbar */}
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 pt-[140px] pb-24">
        
        {/* Core Layout Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* LEFT SIDE: Parking Details (Spans 7 columns on largest screens) */}
          <div className="xl:col-span-7 flex flex-col space-y-10">
            
            {/* Headers Configuration */}
            <div>
              <h1 className="text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight">
                {DUMMY_PARKING.title}
              </h1>
              <div className="flex items-center text-gray-500 text-base mt-3 font-medium tracking-wide">
                <svg className="w-5 h-5 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {DUMMY_PARKING.location}
              </div>
            </div>

            {/* Massive Premium Hero Image */}
            <div className="w-full aspect-[4/3] sm:aspect-video rounded-[2rem] overflow-hidden bg-white border border-gray-200 shadow-sm">
              <img 
                src={DUMMY_PARKING.image} 
                alt={DUMMY_PARKING.title} 
                className="w-full h-full object-cover"
              />
            </div>

            {/* Detail Overview */}
            <div className="border-t border-gray-200 pt-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">About this space</h2>
              <p className="text-gray-600 leading-relaxed text-[15px]">
                Enjoy secure, premium, guaranteed parking directly in the city center. Fully monitored 24/7 with effortless entry and exit. Close proximity to all major transit lines, corporate centers, and shopping districts. 
              </p>
            </div>

          </div>

          {/* RIGHT SIDE: Booking Form Widget (Spans 5 columns on largest screens, Sticky) */}
          <div className="xl:col-span-5 relative">
            <div className="bg-white backdrop-blur-md rounded-[2rem] border border-gray-200 p-8 sm:p-10 shadow-xl sticky top-[120px]">
              
              {/* Form Pricing Header */}
              <div className="flex items-baseline gap-2 mb-8">
                <span className="text-[32px] font-bold text-gray-900 tracking-tight">₹{DUMMY_PARKING.price}</span>
                <span className="text-[15px] font-medium text-gray-500">/ hour</span>
              </div>

              {/* Functional Layout Without Live Logic */}
              <form className="space-y-6">
                
                {/* 2x2 Clean Airbnb Style Booking Inputs */}
                <div className="grid grid-cols-2 gap-0 border border-gray-300 rounded-[1rem] overflow-hidden bg-white">
                  
                  {/* Start Date */}
                  <div className="col-span-1 border-r border-b border-gray-300 p-3.5 focus-within:bg-gray-50 transition-colors">
                    <label className="block text-[10px] font-extrabold text-gray-500 uppercase tracking-widest mb-1.5 ml-1">
                      Start Date
                    </label>
                    <input 
                      type="date" 
                      className="w-full outline-none bg-transparent text-gray-900 text-[14px] font-normal cursor-pointer px-1"
                    />
                  </div>

                  {/* Start Time */}
                  <div className="col-span-1 border-b border-gray-300 p-3.5 focus-within:bg-gray-50 transition-colors">
                    <label className="block text-[10px] font-extrabold text-gray-500 uppercase tracking-widest mb-1.5 ml-1">
                      Start Time
                    </label>
                    <input 
                      type="time" 
                      className="w-full outline-none bg-transparent text-gray-900 text-[14px] font-normal cursor-pointer px-1"
                    />
                  </div>

                  {/* End Date */}
                  <div className="col-span-1 border-r border-gray-300 p-3.5 focus-within:bg-gray-50 transition-colors">
                    <label className="block text-[10px] font-extrabold text-gray-500 uppercase tracking-widest mb-1.5 ml-1">
                      End Date
                    </label>
                    <input 
                      type="date" 
                      className="w-full outline-none bg-transparent text-gray-900 text-[14px] font-normal cursor-pointer px-1"
                    />
                  </div>

                  {/* End Time */}
                  <div className="col-span-1 p-3.5 focus-within:bg-gray-50 transition-colors">
                    <label className="block text-[10px] font-extrabold text-gray-500 uppercase tracking-widest mb-1.5 ml-1">
                      End Time
                    </label>
                    <input 
                      type="time" 
                      className="w-full outline-none bg-transparent text-gray-900 text-[14px] font-normal cursor-pointer px-1"
                    />
                  </div>
                </div>

                {/* Total Price Estimate (Static for now) */}
                <div className="pt-6 border-t border-gray-200 flex items-center justify-between">
                  <span className="text-[15px] font-semibold text-gray-700">Estimated Total</span>
                  <span className="text-xl font-bold text-gray-400 line-through">₹-.--</span>
                </div>

                {/* Confirm Action */}
                <Link 
                  to="/booking"
                  state={{ ...DUMMY_PARKING }}
                  className="block text-center w-full px-5 py-2.5 mt-2 bg-blue-600 hover:brightness-95 hover:shadow-md text-white text-[15px] font-medium rounded-xl transition-all duration-150 ease-out focus:outline-none"
                >
                  Reserve Space
                </Link>

                {/* Subtle trust metric */}
                <p className="text-center text-[13px] text-gray-400 font-medium mt-4">
                  You won't be charged yet
                </p>

              </form>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
