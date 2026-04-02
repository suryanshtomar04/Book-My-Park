import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

export default function Hero() {
  const { user } = useAuth();

  return (
    <div className="relative w-full min-h-screen bg-white flex flex-col lg:block">
      
      {/* LEFT SIDE: Content & Messaging */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 lg:min-h-screen flex items-center pt-32 pb-16 lg:py-0">
        <div className="w-full lg:w-[50%] lg:pr-16">
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-6"
          >
            <span className="text-gray-900 font-bold text-[12px] sm:text-[13px] tracking-[0.2em] uppercase inline-block px-4 py-1.5 rounded-full bg-gradient-to-r from-blue-50/80 to-blue-100/60 border border-blue-100/50">
              The Smarter Way to Park
            </span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.4, 0, 0.2, 1] }}
            className="text-5xl sm:text-6xl md:text-7xl font-black text-gray-900 leading-[1.05] mb-6 tracking-tight"
          >
            Find Your <br/>
            <span className="text-gradient-animated">Perfect</span> Space
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-lg text-gray-500 mb-10 max-w-md font-medium leading-relaxed"
          >
            Reserve premium parking spots in seconds. Save time and avoid the hassle with our instant booking platform.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.55 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }} transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}>
              <Link 
                to="/explore" 
                className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-semibold text-[16px] px-8 py-4 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 group btn-glow btn-ripple focus:outline-none"
              >
                Explore Spaces
                <svg className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3"/>
                </svg>
              </Link>
            </motion.div>
            
            {user?.role === 'admin' && (
              <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }} transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}>
                <Link 
                  to="/add-parking" 
                  className="inline-flex items-center justify-center bg-white hover:bg-gray-50 text-gray-900 border border-gray-200 hover:border-gray-300 font-semibold text-[16px] px-8 py-4 rounded-xl transition-all duration-300 hover:shadow-sm focus:outline-none"
                >
                  List Your Space
                </Link>
              </motion.div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.65 }}
            className="mt-8 flex items-center gap-3 text-sm font-medium text-gray-500"
          >
            <div className="flex -space-x-2">
               <div className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-[10px] font-bold text-gray-700 bg-gray-100 shadow-sm relative z-40">
                <img src="https://i.pravatar.cc/150?img=33" alt="Driver" className="w-full h-full rounded-full object-cover" />
               </div>
               <div className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-[10px] font-bold text-gray-700 bg-gray-100 shadow-sm relative z-30">
                <img src="https://i.pravatar.cc/150?img=47" alt="Driver" className="w-full h-full rounded-full object-cover" />
               </div>
               <div className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-[10px] font-bold text-gray-700 bg-gray-100 shadow-sm relative z-20">
                <img src="https://i.pravatar.cc/150?img=12" alt="Driver" className="w-full h-full rounded-full object-cover" />
               </div>
               <div className="w-8 h-8 rounded-full bg-blue-50 border-2 border-white flex items-center justify-center text-[10px] font-bold text-blue-700 shadow-sm relative z-101">10k+</div>
            </div>
            <span>Trusted by 10,000+ drivers</span>
          </motion.div>
          
        </div>
      </div>

      {/* RIGHT SIDE: Clean Rounded Image */}
      <motion.div
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, delay: 0.3, ease: [0.4, 0, 0.2, 1] }}
        className="w-full lg:absolute lg:top-0 lg:bottom-0 lg:right-0 lg:w-[50%] h-[40vh] sm:h-[50vh] lg:h-full mt-6 lg:mt-0 overflow-hidden lg:overflow-visible pointer-events-none z-0"
      >
        
        {/* Desktop Diagonal Wrapper */}
        <div 
          className="hidden lg:block absolute top-0 bottom-0 right-[0] left-[-15%] rounded-bl-[80px] shadow-2xl overflow-hidden pointer-events-auto"
          style={{ transform: 'skewX(10deg)', transformOrigin: 'top right' }}
        >
          <img 
            src="https://images.unsplash.com/photo-1541443131876-44b03de101c5?q=80&w=2666&auto=format&fit=crop" 
            alt="Bright Premium Parking" 
            className="absolute inset-0 w-full h-full object-cover object-[75%_center]"
            style={{ transform: 'skewX(-10deg) scale(1.15)', transformOrigin: 'top right' }}
          />
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
            <div className="absolute top-0 left-0 right-0 h-[40%] bg-gradient-to-b from-white/60 to-transparent pointer-events-none" />
          </div>
        </div>

      </motion.div>

    </div>
  );
}
