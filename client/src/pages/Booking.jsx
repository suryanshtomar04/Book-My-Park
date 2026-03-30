import { useState, useMemo } from 'react';
import { useLocation, Navigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { createBooking } from '../services/api';

const Booking = () => {
  const routerState = useLocation().state;

  if (!routerState) {
    return <Navigate to="/explore" replace />;
  }

  const { title, price, location: parkingLocation, image, id: parkingId } = routerState;

  const { user, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

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
    const rate = parseFloat(price) || 5;
    
    return { durationHours: roundedHours, totalPrice: roundedHours * rate };
  }, [startDate, startTime, endDate, endTime, price]);

  const serviceFee = 2.00;
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

      await createBooking({
        userId: user._id || user.id,
        parkingId,
        startTime: formattedStartTime,
        endTime: formattedEndTime,
      });

      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to complete booking. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Complete Your Booking
          </h1>
          <p className="mt-4 text-lg text-gray-500">
            Review your parking details and select your timeframe.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Left: Parking details */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
            <div className="relative h-64 w-full">
              <img
                src={image || "https://images.unsplash.com/photo-1590674899484-d5640e854abe?auto=format&fit=crop&q=80&w=1000"}
                alt={title || "Parking Spot"}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur block px-3 py-1 rounded-full shadow-sm text-sm font-semibold text-teal-600">
                ${price || '5.00'} / hr
              </div>
            </div>
            
            <div className="p-8 flex flex-col flex-grow">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {title || 'Downtown Premium Garage'}
              </h2>
              <div className="flex items-center text-gray-500 mb-6 font-medium">
                <svg className="h-5 w-5 mr-2 text-coral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Booking Details</h2>
            
            {error && (
              <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-100 text-red-600 text-sm">
                {error}
              </div>
            )}

            {success ? (
              <div className="text-center py-6 px-2">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-2">Booking Confirmed!</h3>
                <p className="text-gray-500 mb-8">Your parking spot is successfully reserved.</p>

                <div className="bg-[#F8FAFC] rounded-2xl p-6 text-left mb-8 border border-gray-100 shadow-sm">
                  <h4 className="font-semibold text-gray-900 mb-4 border-b border-gray-200 pb-3">Reservation Details</h4>
                  <div className="space-y-4 text-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-500">Location</span>
                      <span className="font-medium text-gray-900 text-right">{title}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-500">Arrive</span>
                      <span className="font-medium text-gray-900">{startDate} at {startTime}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-500">Exit</span>
                      <span className="font-medium text-gray-900">{endDate} at {endTime}</span>
                    </div>
                    <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                      <span className="text-gray-500 mb-0.5">Amount Paid</span>
                      <span className="font-bold text-teal-600 text-lg">${finalTotal.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <Link to="/dashboard" className="block w-full bg-[#1A2332] hover:bg-black text-white py-4 px-8 rounded-xl font-semibold transition-colors shadow-md transition-transform hover:-translate-y-0.5">
                  Go to Dashboard
                </Link>
              </div>
            ) : (
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
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
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
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
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
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
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
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                  />
                </div>
              </div>

              <hr className="border-gray-100 my-6" />

              <div className="bg-[#F8FAFC] rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Summary</h3>
                <div className="space-y-3 mb-4 text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span>Duration</span>
                    <span className="font-medium text-gray-900">{durationHours} hours</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Price per hour</span>
                    <span className="font-medium text-gray-900">${parseFloat(price || 5).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Service fee</span>
                    <span className="font-medium text-gray-900">${serviceFee.toFixed(2)}</span>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-gray-200 flex justify-between items-center">
                  <span className="text-base font-bold text-gray-900">Total Price</span>
                  <span className="text-2xl font-bold text-teal-600">${finalTotal.toFixed(2)}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-4 rounded-xl font-semibold text-lg transition-colors shadow-sm mt-4 text-white
                ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#1A2332] hover:bg-black'}`}
              >
                {loading ? 'Processing...' : 'Confirm Booking'}
              </button>
            </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Booking;
