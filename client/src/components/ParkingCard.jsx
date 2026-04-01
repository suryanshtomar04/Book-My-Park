import React, { useState, forwardRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

const ParkingCard = forwardRef(({ 
  id = 'preview', 
  image = 'https://images.unsplash.com/photo-1590674899484-ac33d3c80cd8?q=80&w=800&auto=format&fit=crop', 
  title = 'Premium Parking Space',
  location = '123 Main St, City Center',
  price = 50,
  availability = 'Available',
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

  const handleBookNow = async (e) => {
    e.stopPropagation();
    
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

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

      navigate('/dashboard');
    } catch (err) {
      console.error("Booking error:", err);
      alert(err.response?.data?.message || 'Failed to complete booking.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      ref={ref}
      onClick={onClick}
      onHoverStart={onHoverStart}
      onHoverEnd={onHoverEnd}
      whileHover={{ scale: 1.015, y: -4 }}
      whileTap={{ scale: 0.99 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      className={`bg-white rounded-[1.25rem] border overflow-hidden flex flex-col sm:flex-row group w-full p-2.5 sm:p-3.5 gap-4 sm:gap-6 h-auto sm:h-[220px] cursor-pointer card-glow
        ${isActive 
          ? 'border-blue-500/50 shadow-lg shadow-blue-500/10 bg-blue-50/30 ring-1 ring-blue-400/20' 
          : isHovered
            ? 'border-blue-300/40 shadow-xl shadow-blue-500/8'
            : 'border-gray-200'
        }`}
      style={{
        transition: 'border-color 0.35s ease, box-shadow 0.35s ease, background-color 0.35s ease',
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
        <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-full shadow-md flex items-center gap-1.5 border border-gray-100">
          <span className={`w-2 h-2 rounded-full ${availability.toLowerCase() === 'available' ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></span>
          <span className="text-[10px] font-bold text-gray-800 tracking-wider uppercase">
            {availability}
          </span>
        </div>
      </div>

      {/* Content Body */}
      <div className="py-2 pr-2 sm:pr-4 flex flex-col flex-1 min-w-0">
        
        {/* Top Header Section */}
        <div className="mb-2">
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className="text-gray-500 text-[13px] font-medium tracking-wide truncate max-w-[150px]">{location}</span>
            {distance !== null && distance < 2.0 && (
              <span className="px-2.5 py-1 bg-gradient-to-r from-blue-50 to-purple-50 text-blue-600 rounded-full text-[10px] font-bold uppercase tracking-wider whitespace-nowrap border border-blue-100/50">
                Near you
              </span>
            )}
            {distance !== null && (
              <span className="text-gray-400 text-[12px] font-medium ml-auto">
                {distance.toFixed(1)} km away
              </span>
            )}
          </div>
          <h3 className="text-[18px] sm:text-[20px] font-semibold text-gray-900 leading-snug line-clamp-2 pr-2">{title}</h3>
          
          <div className="w-8 h-[1px] bg-gradient-to-r from-blue-200 to-purple-200 my-3.5"></div>
          
          <p className="text-[14px] text-gray-500 line-clamp-1">
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
            disabled={loading || availability?.toLowerCase() === 'full'}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.92 }}
            className={`px-5 py-2.5 text-white text-[14px] font-medium rounded-xl transition-all duration-150 ease-out focus:outline-none btn-ripple ${
              loading || availability?.toLowerCase() === 'full'
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed border border-gray-200'
                : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:shadow-lg hover:shadow-blue-500/20 btn-glow'
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

    </motion.div>
  );
});

ParkingCard.displayName = 'ParkingCard';
export default ParkingCard;
