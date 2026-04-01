import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';

// Viewport fade-in wrapper
const FadeInView = ({ children, className = '', delay = 0 }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-40px' });
  
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.5, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

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
      
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 pt-[140px] pb-24">
        
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* LEFT SIDE: Parking Details */}
          <div className="xl:col-span-7 flex flex-col space-y-10">
            
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight">
                {DUMMY_PARKING.title}
              </h1>
              <div className="flex items-center text-gray-500 text-base mt-3 font-medium tracking-wide">
                <motion.svg
                  whileHover={{ scale: 1.2 }}
                  className="w-5 h-5 mr-2 text-blue-500 icon-hover cursor-pointer"
                  fill="none" viewBox="0 0 24 24" stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </motion.svg>
                {DUMMY_PARKING.location}
              </div>
            </motion.div>

            {/* Premium Hero Image */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="w-full aspect-[4/3] sm:aspect-video rounded-[2rem] overflow-hidden bg-white border border-gray-200 shadow-sm group"
            >
              <img 
                src={DUMMY_PARKING.image} 
                alt={DUMMY_PARKING.title} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />
            </motion.div>

            {/* Detail Overview */}
            <FadeInView>
              <div className="border-t border-gray-200 pt-10">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">About this space</h2>
                <p className="text-gray-600 leading-relaxed text-[15px]">
                  Enjoy secure, premium, guaranteed parking directly in the city center. Fully monitored 24/7 with effortless entry and exit. Close proximity to all major transit lines, corporate centers, and shopping districts. 
                </p>
              </div>
            </FadeInView>

            {/* Amenities */}
            <FadeInView delay={0.1}>
              <div className="border-t border-gray-200 pt-10">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">What this place offers</h2>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z', label: 'CCTV Surveillance' },
                    { icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z', label: '24/7 Access' },
                    { icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z', label: 'Digital Payment' },
                    { icon: 'M13 10V3L4 14h7v7l9-11h-7z', label: 'EV Charging' },
                  ].map((amenity, idx) => (
                    <motion.div
                      key={idx}
                      whileHover={{ scale: 1.03, y: -2 }}
                      className="flex items-center gap-3 p-4 rounded-xl bg-gray-50 border border-gray-100 cursor-default"
                    >
                      <motion.div
                        whileHover={{ scale: 1.15, rotate: 5 }}
                        className="w-10 h-10 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg flex items-center justify-center flex-shrink-0"
                      >
                        <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={amenity.icon} />
                        </svg>
                      </motion.div>
                      <span className="text-sm font-medium text-gray-700">{amenity.label}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </FadeInView>

          </div>

          {/* RIGHT SIDE: Booking Form Widget */}
          <div className="xl:col-span-5 relative">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="bg-white backdrop-blur-md rounded-[2rem] border border-gray-200 p-8 sm:p-10 shadow-xl shadow-blue-500/5 sticky top-[120px]"
            >
              
              {/* Form Pricing Header */}
              <div className="flex items-baseline gap-2 mb-8">
                <span className="text-[32px] font-bold text-gray-900 tracking-tight">₹{DUMMY_PARKING.price}</span>
                <span className="text-[15px] font-medium text-gray-500">/ hour</span>
              </div>

              <form className="space-y-6">
                
                {/* 2x2 Airbnb Style Booking Inputs */}
                <div className="grid grid-cols-2 gap-0 border border-gray-300 rounded-[1rem] overflow-hidden bg-white">
                  
                  {[
                    { label: 'Start Date', type: 'date', border: 'border-r border-b' },
                    { label: 'Start Time', type: 'time', border: 'border-b' },
                    { label: 'End Date', type: 'date', border: 'border-r' },
                    { label: 'End Time', type: 'time', border: '' },
                  ].map((field, idx) => (
                    <div key={idx} className={`col-span-1 ${field.border} border-gray-300 p-3.5 focus-within:bg-blue-50/30 transition-colors duration-200`}>
                      <label className="block text-[10px] font-extrabold text-gray-500 uppercase tracking-widest mb-1.5 ml-1">
                        {field.label}
                      </label>
                      <input 
                        type={field.type} 
                        className="w-full outline-none bg-transparent text-gray-900 text-[14px] font-normal cursor-pointer px-1 input-glow rounded-md"
                      />
                    </div>
                  ))}
                </div>

                {/* Total Price Estimate */}
                <div className="pt-6 border-t border-gray-200 flex items-center justify-between">
                  <span className="text-[15px] font-semibold text-gray-700">Estimated Total</span>
                  <span className="text-xl font-bold text-gray-400 line-through">₹-.--</span>
                </div>

                {/* Confirm Action */}
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
                  <Link 
                    to="/booking"
                    state={{ ...DUMMY_PARKING }}
                    className="block text-center w-full px-5 py-3 mt-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-[15px] font-medium rounded-xl transition-all duration-200 ease-out focus:outline-none btn-glow btn-ripple shadow-lg shadow-blue-500/15"
                  >
                    Reserve Space
                  </Link>
                </motion.div>

                <p className="text-center text-[13px] text-gray-400 font-medium mt-4">
                  You won't be charged yet
                </p>

              </form>
            </motion.div>
          </div>

        </div>
      </div>
    </div>
  );
}
