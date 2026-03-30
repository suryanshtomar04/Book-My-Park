import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { createBooking } from '../services/api';

export default function ParkingCard({ 
  id = 'preview', 
  image = 'https://images.unsplash.com/photo-1590674899484-ac33d3c80cd8?q=80&w=800&auto=format&fit=crop', 
  title = 'Premium Parking Space',
  location = '123 Main St, City Center',
  price = 5,
  availability = 'Available',
  isActive = false,
  onClick
}) {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleBookNow = async (e) => {
    e.stopPropagation();
    
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    console.log("parkingId before booking:", id);

    setLoading(true);
    try {
      const now = new Date();
      const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);
      
      await createBooking({
        parkingId: id,
        startTime: now.toISOString(),
        endTime: oneHourLater.toISOString(),
      });

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
      className={`bg-white rounded-[1.5rem] border overflow-hidden transition-all duration-300 flex flex-col sm:flex-row group w-full p-2.5 sm:p-3.5 gap-4 sm:gap-6 h-auto sm:h-[220px] cursor-pointer
        ${isActive 
          ? 'border-[#3b5cf2] shadow-[0_20px_40px_rgba(59,92,242,0.15)] -translate-y-1' 
          : 'border-gray-100/80 hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)] hover:-translate-y-1 hover:border-gray-200'}`}
    >
      
      {/* Image Container - Inset layout with distinct rounded corners */}
      <div className="relative w-full sm:w-[280px] xl:w-[320px] h-[200px] sm:h-full overflow-hidden rounded-[1.125rem] bg-gray-100 flex-shrink-0">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-700 ease-out"
        />
        {/* Availability Badge */}
        <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-full shadow-sm flex items-center gap-1.5">
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
          {/* Subtle Location Above Title */}
          <div className="flex items-center text-gray-500 text-[13px] mb-1.5 font-medium tracking-wide">
            <span className="truncate">{location}</span>
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
            <span className="text-[22px] sm:text-[26px] font-bold text-gray-900 tracking-tight">${price}</span>
            <span className="text-[14px] text-gray-500 font-medium">/ hour</span>
          </div>
          
          <button 
            onClick={handleBookNow}
            disabled={loading || availability?.toLowerCase() !== 'available'}
            className={`px-6 py-2.5 text-white text-[14px] font-semibold rounded-[0.5rem] shadow-sm transition-all duration-300 focus:outline-none ${
              loading || availability?.toLowerCase() !== 'available'
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-[#3b5cf2] hover:bg-[#2e47c7] hover:shadow-md'
            }`}
          >
            {loading ? 'Booking...' : 'Book Now'}
          </button>
        </div>
      </div>

    </div>
  );
}
