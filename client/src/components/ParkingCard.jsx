import React, { useState, forwardRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';

const ParkingCard = forwardRef(({ 
  id = 'preview', 
  image = 'https://images.unsplash.com/photo-1590674899484-ac33d3c80cd8?q=80&w=800&auto=format&fit=crop', 
  title = 'Premium Parking Space',
  location = '123 Main St, City Center',
  price = 50,
  availability,
  availableSlots,
  totalSlots,
  isActive = false,
  isHovered = false,
  distance = null,
  onClick,
  onHoverStart,
  onHoverEnd,
}, ref) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [successFeedback, setSuccessFeedback] = useState(false);

  const handleBookNow = (e) => {
    e.stopPropagation();
    
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    setShowConfirmModal(true);
  };

  const handleConfirmBooking = async (e) => {
    if (e) e.stopPropagation();
    setLoading(true);
    
    try {
      const now = new Date();
      const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);
      
      const demoBooking = {
        _id: Date.now().toString(),
        parkingId: {
          description: title,
          location: { address: location }
        },
        startTime: now.toISOString(),
        endTime: oneHourLater.toISOString(),
        totalPrice: price
      };
      
      const existingBookings = JSON.parse(localStorage.getItem('demoBookings') || '[]');
      localStorage.setItem('demoBookings', JSON.stringify([demoBooking, ...existingBookings]));

      setSuccessFeedback(true);

      setTimeout(() => {
        setShowConfirmModal(false);
        setSuccessFeedback(false);
        navigate('/dashboard', { state: { newBooking: true, bookingId: demoBooking._id } });
      }, 1200);
    } catch (err) {
      console.error("Booking error:", err);
      alert(err.response?.data?.message || 'Failed to complete booking.');
      setLoading(false);
    }
  };

  let badgeText = availability || 'Available';
  let badgeColor = 'bg-green-500';
  let badgeTextColor = 'text-gray-800';
  let pulseClass = 'animate-pulse';
  
  if (availableSlots !== undefined) {
    if (availableSlots === 0) {
      badgeText = 'Full';
      badgeColor = 'bg-red-500';
      badgeTextColor = 'text-red-700';
      pulseClass = '';
    } else if (availableSlots <= 2 || (totalSlots > 0 && availableSlots / totalSlots <= 0.15)) {
      badgeText = 'Almost full';
      badgeColor = 'bg-orange-500';
      badgeTextColor = 'text-orange-700';
    } else {
      badgeText = `${availableSlots} spots left`;
      badgeColor = 'bg-green-500';
      badgeTextColor = 'text-green-700';
    }
  } else if (availability?.toLowerCase() === 'full') {
    badgeText = 'Full';
    badgeColor = 'bg-red-500';
    badgeTextColor = 'text-red-700';
    pulseClass = '';
  }

  const isFull = availableSlots !== undefined ? availableSlots === 0 : availability?.toLowerCase() === 'full';

  return (
    <motion.div
      ref={ref}
      onClick={onClick}
      onHoverStart={onHoverStart}
      onHoverEnd={onHoverEnd}
      whileHover={{ y: -1, scale: 1.0 }}
      whileTap={{ scale: 0.99 }}
      transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
      className={`bg-white rounded-[1.25rem] border overflow-hidden flex flex-col sm:flex-row group w-full p-2.5 sm:p-3 gap-5 sm:gap-6 h-auto sm:h-[220px] cursor-pointer card-glow
        ${isActive 
          ? 'border-blue-400 shadow-[0_4px_16px_rgba(59,130,246,0.12)] bg-blue-50/10' 
          : isHovered
            ? 'border-gray-300'
            : 'border-black/[0.04]'
        }`}
      style={{
        transition: 'border-color 0.25s ease, box-shadow 0.25s ease, background-color 0.25s ease',
      }}
    >
      
      {/* Image Container */}
      <div className="relative w-full sm:w-[280px] xl:w-[320px] h-[200px] sm:h-full overflow-hidden rounded-[1rem] bg-gray-100 flex-shrink-0">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover group-hover:scale-[1.05] transition-transform duration-700 ease-out"
        />
        {/* Availability Badge */}
        <div className={`absolute top-3 left-3 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-full shadow-md flex items-center gap-1.5 border border-gray-100 ${badgeTextColor}`}>
          <span className={`w-2 h-2 rounded-full ${badgeColor} ${pulseClass}`}></span>
          <span className="text-[10px] font-bold tracking-wider uppercase">
            {badgeText}
          </span>
        </div>
      </div>

      {/* Content Body */}
      <div className="py-3 pr-4 sm:pr-5 flex flex-col flex-1 min-w-0">
        
        {/* Top Header Section */}
        <div className="mb-2">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className="text-gray-500 text-[13px] font-medium tracking-wide truncate max-w-[150px]">{location}</span>
            {distance !== null && distance < 2.0 && (
              <span className="px-2.5 py-0.5 bg-blue-50 text-blue-600 rounded-md text-[10px] font-bold uppercase tracking-wider whitespace-nowrap">
                Near you
              </span>
            )}
            {distance !== null && (
              <span className="text-gray-400 text-[12px] font-medium ml-auto">
                {distance.toFixed(1)} km away
              </span>
            )}
          </div>
          <h3 className="text-[18px] sm:text-[20px] font-semibold text-gray-900 leading-snug tracking-tight line-clamp-2 pr-2">{title}</h3>
          <div className="flex items-center gap-1.5 mt-1.5 mb-2">
            <span className="flex items-center text-[13px] font-semibold text-gray-900">
              <svg className="w-4 h-4 text-amber-400 mr-0.5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
              {title.length % 2 === 0 ? "4.8" : "4.9"}
            </span>
            <span className="text-gray-400 text-[12px]">({100 + (title.length * 3)} reviews)</span>
          </div>
          
          <div className="w-8 h-[1px] bg-gray-200 my-4"></div>
          
          <p className="text-[14px] text-gray-600 leading-relaxed line-clamp-1">
            Secure • 24/7 Access • Instant Booking
          </p>
        </div>

        {/* Bottom Footer: Price & Action */}
        <div className="mt-auto flex items-end justify-between px-1">
          <div className="flex items-baseline gap-1">
            <span className="text-[22px] sm:text-[26px] font-bold text-gray-900 tracking-tight">₹{price}</span>
            <span className="text-[14px] text-gray-500 font-medium">/ hour</span>
          </div>
          
          <motion.button
            onClick={handleBookNow}
            disabled={loading || isFull}
            whileHover={!(loading || isFull) ? { scale: 1.01 } : {}}
            whileTap={!(loading || isFull) ? { scale: 0.98 } : {}}
            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            className={`px-6 py-2.5 text-white text-[14px] font-medium rounded-xl btn-ripple ${
              loading || isFull
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
                : 'bg-blue-600 hover:bg-blue-700 btn-glow'
            }`}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Booking...
              </span>
            ) : 'Book Now'}
          </motion.button>
        </div>
      </div>

      {createPortal(
        <AnimatePresence>
          {showConfirmModal && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-[100]"
              onClick={(e) => {
                e.stopPropagation();
                if (!loading && !successFeedback) setShowConfirmModal(false);
              }}
            >
              <motion.div 
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="bg-white rounded-[1.25rem] p-6 w-[400px] shadow-xl border border-gray-200 mx-4 overflow-hidden relative"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Subtle top highlight */}
                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-blue-400 to-gray-200 opacity-60" />

                <div className="flex items-center gap-2 mb-4 mt-1">
                  <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                  </svg>
                  <h2 className="text-lg font-bold text-gray-900">Confirm Booking</h2>
                </div>
                
                <div className="bg-gray-50/80 rounded-xl p-4 border border-gray-100 mb-5">
                  <p className="font-semibold text-gray-900 mb-1">
                    {title}
                  </p>
                  <p className="text-sm text-gray-500 mb-3 flex items-center gap-1.5">
                    <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    {location}
                  </p>
                  <div className="flex justify-between border-t border-black/[0.04] mt-2 pt-3">
                    <span className="text-sm text-gray-500">Rate:</span>
                    <span className="text-sm font-semibold text-gray-900">₹{price} / hr</span>
                  </div>
                </div>

                <div className="flex justify-end gap-3 border-t border-black/[0.04] pt-4 mt-2">
                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
                    onClick={(e) => { e.stopPropagation(); setShowConfirmModal(false); }}
                    disabled={loading || successFeedback}
                    className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50 hover:text-gray-900 transition-colors cursor-pointer focus:outline-none"
                  >
                    Cancel
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
                    onClick={handleConfirmBooking}
                    disabled={loading || successFeedback}
                    className={`px-6 py-2.5 rounded-xl text-white text-sm font-medium btn-glow focus:outline-none ${
                      loading || successFeedback
                      ? 'bg-blue-400 cursor-not-allowed shadow-none' 
                      : 'bg-blue-600 hover:bg-blue-700'
                    }`}
                  >
                    {successFeedback ? (
                      <span className="flex items-center gap-2 text-white">
                        <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                        Booking Confirmed
                      </span>
                    ) : loading ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Booking...
                      </span>
                    ) : 'Confirm Booking'}
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}

    </motion.div>
  );
});

ParkingCard.displayName = 'ParkingCard';
export default ParkingCard;
