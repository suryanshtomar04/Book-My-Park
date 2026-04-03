import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { getUserBookings } from '../services/api';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import AnimatedCounter from '../components/AnimatedCounter';
import FadeIn from '../components/FadeIn';

// Skeleton row for booking loading state
const BookingSkeleton = ({ index = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay: index * 0.1 }}
    className="bg-white rounded-2xl border border-gray-200 overflow-hidden flex flex-col md:flex-row h-auto md:h-[160px]"
  >
    <div className="w-2 hidden md:block shimmer"></div>
    <div className="p-6 flex-grow flex flex-col sm:flex-row sm:items-center justify-between gap-6">
      <div className="space-y-3 flex-1">
        <div className="flex items-center gap-3">
          <div className="h-6 w-16 shimmer rounded-md"></div>
          <div className="h-4 w-20 shimmer rounded-full"></div>
        </div>
        <div className="h-5 w-2/3 shimmer rounded-lg"></div>
        <div className="h-4 w-1/3 shimmer rounded-full"></div>
        <div className="flex gap-8 mt-2">
          <div className="space-y-1">
            <div className="h-3 w-12 shimmer rounded"></div>
            <div className="h-4 w-28 shimmer rounded"></div>
          </div>
          <div className="space-y-1">
            <div className="h-3 w-12 shimmer rounded"></div>
            <div className="h-4 w-28 shimmer rounded"></div>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-end gap-3">
        <div className="h-8 w-20 shimmer rounded-lg"></div>
        <div className="h-10 w-28 shimmer rounded-xl"></div>
      </div>
    </div>
  </motion.div>
);


export default function Dashboard() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const routerState = location.state;
  
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [filter, setFilter] = useState('All');
  const [showSuccessBanner, setShowSuccessBanner] = useState(routerState?.newBooking || false);
  const newBookingId = routerState?.bookingId || null;

  useEffect(() => {
    if (showSuccessBanner) {
      const timer = setTimeout(() => setShowSuccessBanner(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [showSuccessBanner]);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const res = await getUserBookings();
        const data = Array.isArray(res) ? res : res.data || [];
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



  const getBookingStatus = (endTime) => {
    if (!endTime) return 'Active';
    const now = new Date();
    const end = new Date(endTime);
    return now > end ? 'Completed' : 'Active';
  };

  const getTimeRemaining = (endTime) => {
    if (!endTime) return null;
    const now = new Date();
    const end = new Date(endTime);
    const diffMs = end - now;
    if (diffMs <= 0) return null;
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m left`;
  };

  const getStartedAgo = (startTime) => {
    if (!startTime) return null;
    const now = new Date();
    const start = new Date(startTime);
    if (now < start) {
      const diffMs = start - now;
      const hours = Math.floor(diffMs / (1000 * 60 * 60));
      const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      return `Starts in ${hours}h ${minutes}m`;
    }
    const diffMs = now - start;
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    if (hours > 24) return `${Math.floor(hours/24)}d ago`;
    if (hours > 0) return `${hours} hr ago`;
    return `${minutes} mins ago`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const options = { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const filteredBookings = bookings.filter(booking => {
    if (filter === 'All') return true;
    const status = getBookingStatus(booking.endTime);
    return status === filter;
  });

  // Summary calculations
  const activeBookingsCount = bookings.filter(b => getBookingStatus(b.endTime) === 'Active').length;
  const totalSpent = bookings.reduce((sum, b) => sum + (b.totalPrice || 0), 0);
  
  let maxTimeRemainingMs = 0;
  bookings.forEach(b => {
    if (getBookingStatus(b.endTime) === 'Active' && b.endTime) {
      const remaining = new Date(b.endTime).getTime() - new Date().getTime();
      if (remaining > maxTimeRemainingMs) {
        maxTimeRemainingMs = remaining;
      }
    }
  });
  
  let longestTimeRemainingStr = 'None';
  if (maxTimeRemainingMs > 0) {
    const hours = Math.floor(maxTimeRemainingMs / (1000 * 60 * 60));
    const minutes = Math.floor((maxTimeRemainingMs % (1000 * 60 * 60)) / (1000 * 60));
    longestTimeRemainingStr = `${hours}h ${minutes}m`;
  }

  const getParkingImage = (title) => {
    const t = title?.toLowerCase() || "";
    if (t.includes("highway")) return "/images/parking1.jpg";
    if (t.includes("modinagar")) return "/images/parking2.jpg";
    if (t.includes("city")) return "/images/parking3.jpg";
    return "/images/parking1.jpg";
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-12 px-4 sm:px-6 lg:px-8 pt-32 text-gray-900">
      <div className="max-w-5xl mx-auto">
        {/* Toast Notification */}
        <AnimatePresence>
          {showSuccessBanner && (
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed bottom-6 right-6 z-50 bg-gray-900 border border-gray-800 text-white px-5 py-3.5 rounded-xl shadow-2xl flex items-center gap-3"
            >
              <div className="w-8 h-8 bg-green-500/20 rounded-full flex flex-shrink-0 items-center justify-center text-green-400">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
              </div>
              <div className="pr-4">
                <p className="font-bold text-sm">Spot booked successfully</p>
              </div>
              <button onClick={() => setShowSuccessBanner(false)} className="text-gray-400 hover:text-white transition-colors ml-auto flex-shrink-0">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </motion.div>
          )}
        </AnimatePresence>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
            className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4"
          >
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight sm:text-4xl">
                My Bookings
              </h1>
              <p className="mt-2 text-lg text-gray-600">
              Welcome back, {user?.name || 'User'}! Here is your parking history.
            </p>
          </div>
          
          <div className="flex bg-gray-100/80 backdrop-blur-sm p-1 rounded-xl self-start md:self-auto shadow-inner">
            {['All', 'Active', 'Completed'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${filter === f ? 'bg-white shadow-sm text-gray-900 border border-gray-200' : 'text-gray-500 hover:text-gray-700'}`}
              >
                {f}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Summary Section */}
        {bookings.length > 0 && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8"
          >
            <div className="bg-white border border-black/[0.04] rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
                 <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              </div>
               <div>
                 <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Active Spots</p>
                 <p className="text-2xl font-black text-gray-900 leading-none"><AnimatedCounter end={activeBookingsCount} duration={1000} /></p>
              </div>
            </div>
            <div className="bg-white border border-black/[0.04] rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow flex items-center gap-4">
              <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center">
                 <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <div>
                 <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Total Spent</p>
                 <p className="text-2xl font-black text-gray-900 leading-none">₹<AnimatedCounter end={Math.floor(totalSpent)} duration={1200} /></p>
              </div>
            </div>
            <div className="bg-white border border-black/[0.04] rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
                 <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <div>
                 <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Time Left</p>
                 <p className="text-2xl font-black text-gray-900 leading-none">{longestTimeRemainingStr}</p>
              </div>
            </div>
          </motion.div>
        )}

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 mb-8"
          >
            {error}
          </motion.div>
        )}

        {loading ? (
          <div className="space-y-6">
            <BookingSkeleton index={0} />
            <BookingSkeleton index={1} />
            <BookingSkeleton index={2} />
          </div>
        ) : bookings.length === 0 && !error ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
            className="bg-white rounded-2xl shadow-sm border border-black/[0.04] p-12 text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
              className="w-20 h-20 bg-gradient-to-br from-blue-50 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <svg className="w-10 h-10 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </motion.div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No bookings yet</h3>
            <p className="text-gray-500 mb-6">You haven't reserved any parking spots so far.</p>
            <Link 
              to="/explore"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-medium btn-glow btn-ripple focus:outline-none transition-transform duration-200 active:scale-[0.98] hover:scale-[1.01]"
            >
              Explore Parking Spots
            </Link>
          </motion.div>
        ) : (
          <div className="space-y-6">
              {filteredBookings.map((booking, i) => {
                const status = getBookingStatus(booking.endTime);
                const isActive = status === 'Active';
                const parkingName = booking.parkingId?.description?.substring(0, 40) || 'Premium Parking Spot';
                const location = booking.parkingId?.location?.address || '123 Main Street, City Center';
                const isNew = newBookingId === (booking._id || booking.id);

                const rawImage = booking.parkingId?.images?.[0];
                const imageUrl = rawImage
                  ? rawImage.startsWith("http")
                    ? rawImage
                    : `http://localhost:5000${rawImage}`
                  : null;
                  
                const finalImage = imageUrl || getParkingImage(parkingName);

                return (
                  <motion.div
                    key={booking._id || booking.id || i}
                    whileHover={{ y: -1, scale: 1.0 }}
                    transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
                    className={`bg-white rounded-2xl border border-l-[4px] overflow-hidden flex flex-col md:flex-row card-glow group transition-all duration-300 relative ${
                      isNew 
                        ? 'border-l-blue-500 border-y-blue-100 border-r-blue-100 shadow-[0_4px_16px_rgba(59,130,246,0.12)] bg-blue-50/10 z-20' 
                        : isActive
                          ? 'border-l-blue-500 border-y-black/[0.04] border-r-black/[0.04] shadow-sm z-10'
                          : `border-l-gray-300 border-y-black/[0.04] border-r-black/[0.04] shadow-sm opacity-90`
                    }`}
                  >
                    
                    <div className="p-6 md:pl-8 flex-grow flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                      <div className="flex gap-4 flex-col sm:flex-row">
                        <div className="w-full sm:w-32 h-40 sm:h-24 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0">
                          <img
                            src={finalImage}
                            alt={parkingName}
                            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                          />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2 flex-wrap">
                          <span className={`px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wide
                            ${isActive ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'bg-gray-100 text-gray-500 border border-gray-200'}`}
                          >
                            {isActive && <span className="inline-block w-1.5 h-1.5 bg-blue-500 rounded-full mr-1.5 animate-pulse"></span>}
                            {status}
                          </span>
                          {isNew && (
                            <span className="px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wide bg-blue-600 text-white shadow-sm flex items-center gap-1">
                              <span className="w-1.5 h-1.5 bg-blue-200 rounded-full animate-pulse"></span>
                              NEW
                            </span>
                          )}
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
                            <span className="font-medium text-gray-900 block">{formatDate(booking.startTime)}</span>
                            {getStartedAgo(booking.startTime) && <span className="text-[11px] text-gray-500 mt-0.5 block">{getStartedAgo(booking.startTime)}</span>}
                          </div>
                          <div>
                            <span className="block text-gray-400 text-[10px] font-semibold uppercase tracking-wider mb-1">Exit</span>
                            <span className="font-medium text-gray-900 block">{formatDate(booking.endTime)}</span>
                            {isActive && getTimeRemaining(booking.endTime) && <span className="text-[11px] text-orange-500 font-medium mt-0.5 block">{getTimeRemaining(booking.endTime)}</span>}
                          </div>
                        </div>
                        </div>
                      </div>

                      <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t sm:border-t-0 border-gray-100 pt-4 sm:pt-0">
                        <div className="text-left sm:text-right mb-0 sm:mb-4">
                          <span className="block text-gray-400 text-[10px] font-semibold uppercase tracking-wider mb-1">Total Paid</span>
                          <span className="text-xl font-bold text-gray-900 tracking-tight">
                            ₹{booking.totalPrice?.toFixed(2) || '150.00'}
                          </span>
                        </div>
                        
                        <div className="flex flex-col gap-2 w-full sm:w-auto mt-2 sm:mt-0 min-w-[200px]">
                          {isActive ? (
                            <>
                              <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }} transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }} className="w-full text-center text-red-600 font-bold text-[13px] hover:text-red-700 bg-red-50 px-4 py-2 rounded-xl transition-all duration-300 border border-red-100 hover:border-red-200 hover:bg-red-100 flex items-center justify-center gap-1.5 focus:outline-none">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                End Booking
                              </motion.button>
                              <div className="flex gap-2">
                                <motion.a 
                                  whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }} transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
                                  href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(location)}`} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="flex-1 text-gray-700 font-semibold text-[12px] hover:text-gray-900 bg-white px-2 py-2 rounded-xl transition-all duration-300 border border-black/[0.06] hover:border-gray-300 hover:bg-gray-50 flex items-center justify-center gap-1 group focus:outline-none shadow-sm"
                                >
                                  <svg className="w-3.5 h-3.5 text-blue-500 group-hover:-translate-y-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" /></svg>
                                  Navigate
                                </motion.a>
                              <Link to="/explore" className="w-full text-blue-700 font-semibold text-[12px] hover:text-blue-800 bg-blue-50 px-2 py-2 rounded-xl transition-all duration-300 border border-blue-100 hover:border-blue-200 hover:bg-blue-100 flex items-center justify-center gap-1 group focus:outline-none flex-1 active:scale-[0.98] hover:scale-[1.01]">
                                <svg className="w-3.5 h-3.5 text-blue-500 group-hover:rotate-45 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                Extend
                              </Link>
                            </div>
                          </>
                        ) : (
                          <Link to="/explore" className="block text-center text-gray-600 font-medium text-sm hover:text-gray-900 bg-gray-50 px-5 py-2.5 rounded-xl transition-all duration-300 border border-black/[0.04] hover:bg-gray-100 focus:outline-none block active:scale-[0.98] hover:scale-[1.01]">
                            Book Again
                          </Link>
                        )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
          </div>
        )}
      </div>
    </div>
  );
}
