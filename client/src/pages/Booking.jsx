import { useState, useMemo } from 'react';
import { useLocation, Navigate, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { createBooking } from '../services/api';

const Booking = () => {
  const routerState = useLocation().state;
  const navigate = useNavigate();

  if (!routerState) {
    return <Navigate to="/explore" replace />;
  }

  const { title, price, location: parkingLocation, image, id: parkingId } = routerState;

  const { user, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');

  const [startDate, setStartDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endDate, setEndDate] = useState('');
  const [endTime, setEndTime] = useState('');

  const { durationHours, totalPrice } = useMemo(() => {
    if (!startDate || !startTime || !endDate || !endTime) {
      return { durationHours: 0, totalPrice: 0 };
    }

    const start = new Date(`${startDate}T${startTime}`);
    const end = new Date(`${endDate}T${endTime}`);
    
    const diffMs = end.getTime() - start.getTime();
    if (diffMs <= 0 || isNaN(diffMs)) return { durationHours: 0, totalPrice: 0 };

    const hours = diffMs / (1000 * 60 * 60);
    const roundedHours = Math.ceil(hours);
    const rate = parseFloat(price) || 50;
    
    return { durationHours: roundedHours, totalPrice: roundedHours * rate };
  }, [startDate, startTime, endDate, endTime, price]);

  const serviceFee = 20.00;
  const finalTotal = totalPrice > 0 ? totalPrice + serviceFee : 0;

  const handleBooking = async (e) => {
    e.preventDefault();
    if (!isAuthenticated || !user) {
      setError('You must be logged in to book a parking spot.');
      return;
    }
    if (!startDate || !startTime || !endDate || !endTime) {
      setError('Please fill in all date and time fields.');
      return;
    }

    if (totalPrice <= 0) {
      setError('End time must be after start time.');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const formattedStartTime = new Date(`${startDate}T${startTime}`).toISOString();
      const formattedEndTime = new Date(`${endDate}T${endTime}`).toISOString();

      // DEMO MODE: Store directly in localStorage
      const demoBooking = {
        _id: Date.now().toString(),
        parkingId: {
          description: title,
          location: { address: parkingLocation }
        },
        startTime: formattedStartTime,
        endTime: formattedEndTime,
        totalPrice: finalTotal
      };
      
      const existingBookings = JSON.parse(localStorage.getItem('demoBookings') || '[]');
      localStorage.setItem('demoBookings', JSON.stringify([demoBooking, ...existingBookings]));

      setSuccessMsg('Booking confirmed successfully! Redirecting to dashboard...');
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to complete booking. Please try again.');
    } finally {
      // If we're successful, we keep the button disabled and loading state conceptually active during redirect
      // but we still want to ensure loading spinner isn't stuck on error.
      // Easiest is to set loading false but check successMsg for button disabled state.
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-12 px-4 sm:px-6 lg:px-8 text-gray-900">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10 pt-16">
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight sm:text-4xl">
            Complete Your Booking
          </h1>
          <p className="mt-4 text-lg text-gray-500">
            Review your parking details and select your timeframe.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Left: Parking details */}
          <div className="bg-white rounded-[1.5rem] shadow-md border border-gray-200 overflow-hidden flex flex-col">
            <div className="relative h-64 w-full">
              <img
                src={image || "https://images.unsplash.com/photo-1590674899484-d5640e854abe?auto=format&fit=crop&q=80&w=1000"}
                alt={title || "Parking Spot"}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md block px-4 py-1.5 rounded-full border border-gray-200 shadow-sm text-sm font-bold text-gray-900">
                ₹{price || '50.00'} / hr
              </div>
            </div>
            
            <div className="p-8 flex flex-col flex-grow">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {title || 'Downtown Premium Garage'}
              </h2>
              <div className="flex items-center text-gray-500 mb-6 font-medium">
                <svg className="h-5 w-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {parkingLocation || '123 Main Street, City Center'}
              </div>
              
              <div className="mt-auto space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-gray-500">Spot Type</span>
                  <span className="font-medium text-gray-900">Covered</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-gray-500">Access</span>
                  <span className="font-medium text-gray-900">24/7 Access</span>
                </div>
                <div className="flex justify-between items-center py-3">
                  <span className="text-gray-500">Security</span>
                  <span className="font-medium text-gray-900">CCTV & Guards</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Booking form */}
          <div className="bg-white rounded-[1.5rem] shadow-md border border-gray-200 p-8 backdrop-blur-md">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Booking Details</h2>
            
            {error && (
              <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-100 text-red-600 text-sm">
                {error}
              </div>
            )}
            
            {successMsg && (
              <div className="mb-6 p-4 rounded-lg bg-green-50 border border-green-100 text-green-600 text-sm font-medium">
                {successMsg}
              </div>
            )}

            <form onSubmit={handleBooking} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="start-date" className="block text-sm font-medium text-gray-700 mb-2">
                    Start Date
                  </label>
                  <input
                    type="date"
                    id="start-date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-white border border-gray-300 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                </div>
                <div>
                  <label htmlFor="start-time" className="block text-sm font-medium text-gray-700 mb-2">
                    Start Time
                  </label>
                  <input
                    type="time"
                    id="start-time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-white border border-gray-300 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="end-date" className="block text-sm font-medium text-gray-700 mb-2">
                    End Date
                  </label>
                  <input
                    type="date"
                    id="end-date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-white border border-gray-300 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                </div>
                <div>
                  <label htmlFor="end-time" className="block text-sm font-medium text-gray-700 mb-2">
                    End Time
                  </label>
                  <input
                    type="time"
                    id="end-time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-white border border-gray-300 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                </div>
              </div>

              <hr className="border-gray-200 my-6" />

              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Summary</h3>
                <div className="space-y-3 mb-4 text-sm">
                  <div className="flex justify-between text-gray-500">
                    <span>Duration</span>
                    <span className="font-medium text-gray-900">{durationHours} hours</span>
                  </div>
                  <div className="flex justify-between text-gray-500">
                    <span>Price per hour</span>
                    <span className="font-medium text-gray-900">₹{parseFloat(price || 50).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-500">
                    <span>Service fee</span>
                    <span className="font-medium text-gray-900">₹{serviceFee.toFixed(2)}</span>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-gray-200 flex justify-between items-center">
                  <span className="text-base font-bold text-gray-900">Total Price</span>
                  <span className="text-2xl font-bold text-blue-600">₹{finalTotal.toFixed(2)}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || !!successMsg}
                className={`w-full px-5 py-2.5 rounded-xl font-medium text-lg transition-all duration-150 ease-out mt-4 text-white
                ${loading || successMsg ? 'bg-gray-300 cursor-not-allowed text-gray-500' : 'bg-blue-600 hover:brightness-95 hover:shadow-md'}`}
              >
                {loading ? 'Processing...' : successMsg ? 'Success!' : 'Book Now'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Booking;
