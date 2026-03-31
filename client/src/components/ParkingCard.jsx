import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { createBooking } from '../services/api';

export default function ParkingCard({ 
  id = 'preview', 
  image = 'https://images.unsplash.com/photo-1590674899484-ac33d3c80cd8?q=80&w=800&auto=format&fit=crop', 
  title = 'Premium Parking Space',
  location = '123 Main St, City Center',
  price = 50,
  availability = 'Available',
  isActive = false,
  distance = null,
  onClick
}) {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleBookNow = async (e) => {
    e.stopPropagation();
    console.log("Book Now button clicked! Triggering booking flow...");
    
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    console.log("parkingId before booking:", id);

    setLoading(true);
    try {
      const now = new Date();
      const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);
      
      // DEMO MODE: Store directly in localStorage
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
    <div 
      onClick={onClick}
      className={`bg-white rounded-[1.25rem] border border-gray-200 overflow-hidden transition-all duration-300 flex flex-col sm:flex-row group w-full p-2.5 sm:p-3.5 gap-4 sm:gap-6 h-auto sm:h-[220px] cursor-pointer
        ${isActive 
          ? 'border-blue-500/50 shadow-md bg-white' 
          : 'hover:border-gray-300 hover:shadow-lg hover:-translate-y-0.5'}`}
    >
      
      {/* Image Container - Inset layout with distinct rounded corners */}
      <div className="relative w-full sm:w-[280px] xl:w-[320px] h-[200px] sm:h-full overflow-hidden rounded-[1rem] bg-gray-100 flex-shrink-0">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500 ease-out"
        />
        {/* Availability Badge */}
        <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-full shadow-md flex items-center gap-1.5 border border-gray-100">
          <span className={`w-2 h-2 rounded-full ${availability.toLowerCase() === 'available' ? 'bg-green-500' : 'bg-red-500'}`}></span>
          <span className="text-[10px] font-bold text-gray-800 tracking-wider uppercase">
            {availability}
          </span>
        </div>
      </div>

      {/* Content Body */}
      <div className="py-2 pr-2 sm:pr-4 flex flex-col flex-1 min-w-0">
        
        {/* Top Header Section */}
        <div className="mb-2">
          {/* Subtle Location & Badges */}
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className="text-gray-500 text-[13px] font-medium tracking-wide truncate max-w-[150px]">{location}</span>
            {distance !== null && distance < 2.0 && (
              <span className="px-2.5 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-bold uppercase tracking-wider whitespace-nowrap">
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
          
          <div className="w-8 h-[1px] bg-gray-200 my-3.5"></div>
          
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
          
          <button 
            onClick={handleBookNow}
            disabled={loading || availability?.toLowerCase() === 'full'}
            className={`px-6 py-2.5 text-white text-[14px] font-medium rounded-lg shadow-sm transition-all duration-300 focus:outline-none ${
              loading || availability?.toLowerCase() === 'full'
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed border border-gray-200'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {loading ? 'Booking...' : 'Book Now'}
          </button>
        </div>
      </div>

    </div>
  );
}
