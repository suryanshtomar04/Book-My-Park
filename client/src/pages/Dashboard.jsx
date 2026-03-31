import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getUserBookings } from '../services/api';
import { Link, useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        // Assuming the backend returns an array of bookings or { data: [...] }
        const res = await getUserBookings();
        // Adjust depending on how backend wraps response 
        const data = Array.isArray(res) ? res : res.data || [];
        
        // Load demo bookings from local storage
        const demoBookings = JSON.parse(localStorage.getItem('demoBookings') || '[]');
        
        setBookings([...demoBookings, ...data]);
        setError(null);
      } catch (err) {
        if (err.response?.status === 401) {
          logout();
          navigate('/login', { replace: true });
          return;
        }
        console.error("Failed to fetch backend bookings:", err);
        
        // Fallback to local storage on backend error
        const demoBookings = JSON.parse(localStorage.getItem('demoBookings') || '[]');
        if (demoBookings.length > 0) {
          setBookings(demoBookings);
        } else {
          setError("Failed to load your bookings. Please try again later.");
        }
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchBookings();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated, logout, navigate]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // Helper to determine status based on end time vs now
  const getBookingStatus = (endTime) => {
    if (!endTime) return 'Active';
    const now = new Date();
    const end = new Date(endTime);
    return now > end ? 'Completed' : 'Active';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const options = { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-12 px-4 sm:px-6 lg:px-8 pt-32 text-gray-900">
      <div className="max-w-5xl mx-auto">
        <div className="mb-10">
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight sm:text-4xl">
            My Bookings
          </h1>
          <p className="mt-2 text-lg text-gray-500">
            Welcome back, {user?.name || 'User'}! Here is your parking history.
          </p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 mb-8">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : bookings.length === 0 && !error ? (
          <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-12 text-center backdrop-blur-sm">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No bookings yet</h3>
            <p className="text-gray-500 mb-6">You haven't reserved any parking spots so far.</p>
            <Link 
              to="/explore"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white py-3 px-8 rounded-xl font-semibold transition-colors shadow-sm"
            >
              Explore Parking Spots
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {bookings.map((booking) => {
              const status = getBookingStatus(booking.endTime);
              const isActive = status === 'Active';
              const parkingName = booking.parkingId?.description?.substring(0, 40) || 'Premium Parking Spot';
              const location = booking.parkingId?.location?.address || '123 Main Street, City Center';

              return (
                <div 
                  key={booking._id || booking.id || Math.random()} 
                  className="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden flex flex-col md:flex-row transition-all hover:shadow-lg hover:-translate-y-0.5"
                >
                  {/* Left edge color bar indicating status */}
                  <div className={`w-2 hidden md:block ${isActive ? 'bg-blue-500' : 'bg-gray-200'}`}></div>
                  
                  <div className="p-6 flex-grow flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                    {/* Booking Info */}
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <span className={`px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wide
                          ${isActive ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'bg-gray-100 text-gray-500 border border-gray-200'}`}
                        >
                          {status}
                        </span>
                        <span className="text-sm font-medium text-gray-400">
                          ID: {booking._id?.slice(-6).toUpperCase() || 'P-102'}
                        </span>
                      </div>
                      
                      <h3 className="text-lg font-bold text-gray-900 mb-1">
                        {parkingName}
                      </h3>
                      <p className="text-sm text-gray-500 mb-4">
                        {location}
                      </p>
                      
                      <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 text-sm text-gray-700">
                        <div>
                          <span className="block text-gray-400 text-[10px] font-semibold uppercase tracking-wider mb-1">Arrive</span>
                          <span className="font-medium text-gray-900">{formatDate(booking.startTime)}</span>
                        </div>
                        <div>
                          <span className="block text-gray-400 text-[10px] font-semibold uppercase tracking-wider mb-1">Exit</span>
                          <span className="font-medium text-gray-900">{formatDate(booking.endTime)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Action / Price */}
                    <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t sm:border-t-0 border-gray-100 pt-4 sm:pt-0">
                      <div className="text-left sm:text-right mb-0 sm:mb-4">
                        <span className="block text-gray-400 text-[10px] font-semibold uppercase tracking-wider mb-1">Total Paid</span>
                        <span className="text-xl font-bold text-gray-900 tracking-tight">
                          ₹{booking.totalPrice?.toFixed(2) || '150.00'}
                        </span>
                      </div>
                      
                      {isActive ? (
                        <Link to="/explore" className="text-blue-600 font-semibold text-sm hover:text-blue-700 bg-blue-50 px-4 py-2 rounded-lg transition-colors border border-blue-100">
                          Extend Time
                        </Link>
                      ) : (
                        <Link to="/explore" className="text-gray-600 font-semibold text-sm hover:text-gray-900 bg-gray-50 px-4 py-2 rounded-lg transition-colors border border-gray-200">
                          Book Again
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
