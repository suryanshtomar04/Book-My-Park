import React, { useState, forwardRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';

const ParkingCard = forwardRef(({ 
  id = 'preview', 
  image = '/images/parking.jpg', 
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
          location: { address: location },
          images: image ? [image.replace('http://localhost:5000', '')] : []
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

  const isFull = availableSlots !== undefined ? availableSlots === 0 : availability?.toLowerCase() === 'full';

  let smartStatusText = "";
  let smartStatusColor = "";
  if (isFull) {
    smartStatusText = "Full";
    smartStatusColor = "text-red-600";
  } else if (availableSlots <= 5) {
    smartStatusText = "Almost Full";
    smartStatusColor = "text-yellow-600";
  } else {
    smartStatusText = "Available";
    smartStatusColor = "text-green-600";
  }

  const getParkingImage = (title) => {
    const t = title?.toLowerCase() || "";

    if (t.includes("highway")) return "/images/parking1.jpg";
    if (t.includes("modinagar")) return "/images/parking2.jpg";
    if (t.includes("city")) return "/images/parking3.jpg";

    return "/images/parking1.jpg";
  };

  console.log("TITLE:", title);
  console.log("IMG:", getParkingImage(title));

  const finalImage = image || getParkingImage(title);

  return (
    <motion.div
      ref={ref}
      onClick={onClick}
      onHoverStart={onHoverStart}
      onHoverEnd={onHoverEnd}
      whileHover={{ y: -1, scale: 1.0 }}
      className={`flex gap-5 p-5 rounded-2xl bg-white/80 backdrop-blur-md border border-gray-200/60 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ease-out hover:border-blue-200 group cursor-pointer overflow-hidden w-full
        ${isActive 
          ? 'border-blue-400 shadow-[0_4px_16px_rgba(59,130,246,0.12)] bg-blue-50/10' 
          : isHovered
            ? 'border-gray-300'
            : ''
        }`}
      style={{
        transition: 'border-color 0.3s ease, box-shadow 0.3s ease, transform 0.3s ease',
      }}
    >
      
      {/* Image Container */}
      <div className="relative w-[180px] h-[110px] rounded-xl overflow-hidden flex-shrink-0 group">
        <img 
          src={finalImage} 
          alt={title} 
          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />
        {/* Availability Badge */}
        <div className="absolute top-2 left-2 flex flex-col gap-2">
          {(availableSlots !== undefined || availability) && (
            <span className={`text-xs px-3 py-1 rounded-full bg-white/90 backdrop-blur shadow-sm font-medium ${smartStatusColor}`}>
              {smartStatusText}
            </span>
          )}
        </div>
      </div>

      {/* Content Body */}
      <div className="flex flex-col flex-1 min-w-0 justify-between py-1">
        
        {/* Top Header Section */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 truncate">{title}</h3>
          <p className="text-sm text-gray-500 mt-1 truncate">{location}</p>
          
          <div className="flex items-center gap-2 mt-2 text-sm text-gray-700">
            <span className="flex items-center font-semibold text-gray-900">
              <svg className="w-3 h-3 text-amber-400 mr-0.5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
              {title.length % 2 === 0 ? "4.8" : "4.9"}
            </span>
            {totalSlots !== undefined && (
              <>
                <span className="text-gray-300">•</span>
                <span className="text-sm text-gray-400">Cap: {totalSlots}</span>
              </>
            )}
          </div>
        </div>

        <div className="h-px bg-gray-100 my-2" />

        {/* Bottom Footer: Price & Action */}
        <div className="flex justify-between items-center mt-1">
          <p className="text-xl font-bold text-gray-900 whitespace-nowrap">
            ₹{price} <span className="text-sm text-gray-500 ml-1 font-normal">/ hour</span>
          </p>
          
          <motion.button
            onClick={handleBookNow}
            disabled={loading || isFull}
            whileHover={!(loading || isFull) ? { scale: 1.03 } : {}}
            whileTap={!(loading || isFull) ? { scale: 0.95 } : {}}
            transition={{ duration: 0.2 }}
            className={`px-5 py-2 text-sm whitespace-nowrap rounded-lg transition-all duration-200 ${
              loading 
                ? 'bg-gradient-to-r from-blue-400 to-blue-400 cursor-wait shadow-none text-white'
                : isFull
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200 shadow-none'
                  : 'bg-gradient-to-r from-blue-600 to-blue-500 hover:shadow-lg text-white font-medium shadow-md'
            }`}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-3 w-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Booking...
              </span>
            ) : isFull ? (
              'Full'
            ) : (
              'Book Now'
            )}
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
