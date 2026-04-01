import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { getUserBookings } from '../services/api';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useInView } from 'framer-motion';

// Viewport fade-in wrapper — elements animate as they scroll into view
const FadeInView = ({ children, className = '', delay = 0 }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-40px' });
  
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.5, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

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

const cardVariants = {
  hidden: { opacity: 0, y: 25, filter: 'blur(4px)' },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      delay: i * 0.08,
      duration: 0.45,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  }),
};

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

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { replace: true });
    }
  }, [isAuthenticated, navigate]);

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
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight sm:text-4xl">
            My Bookings
          </h1>
          <p className="mt-2 text-lg text-gray-500">
            Welcome back, {user?.name || 'User'}! Here is your parking history.
          </p>
        </motion.div>

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
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="bg-white rounded-2xl shadow-xl shadow-blue-500/5 border border-gray-200 p-12 text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
              className="w-20 h-20 bg-gradient-to-br from-blue-50 to-purple-50 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <svg className="w-10 h-10 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </motion.div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No bookings yet</h3>
            <p className="text-gray-500 mb-6">You haven't reserved any parking spots so far.</p>
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
              <Link 
                to="/explore"
                className="inline-block bg-gradient-to-r from-blue-600 to-blue-700 text-white px-5 py-2.5 rounded-xl font-medium transition-all duration-150 ease-out btn-glow btn-ripple"
              >
                Explore Parking Spots
              </Link>
            </motion.div>
          </motion.div>
        ) : (
          <div className="space-y-6">
            <AnimatePresence>
              {bookings.map((booking, i) => {
                const status = getBookingStatus(booking.endTime);
                const isActive = status === 'Active';
                const parkingName = booking.parkingId?.description?.substring(0, 40) || 'Premium Parking Spot';
                const location = booking.parkingId?.location?.address || '123 Main Street, City Center';

                return (
                  <FadeInView key={booking._id || booking.id || i} delay={i * 0.06}>
                  <motion.div
                    custom={i}
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    whileHover={{ y: -3, scale: 1.005 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                    className="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden flex flex-col md:flex-row card-glow"
                  >
                    {/* Left edge color bar */}
                    <div className={`w-2 hidden md:block ${isActive ? 'bg-gradient-to-b from-blue-500 to-purple-500' : 'bg-gray-200'}`}></div>
                    
                    <div className="p-6 flex-grow flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <span className={`px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wide
                            ${isActive ? 'bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 border border-blue-200' : 'bg-gray-100 text-gray-500 border border-gray-200'}`}
                          >
                            {isActive && <span className="inline-block w-1.5 h-1.5 bg-blue-500 rounded-full mr-1.5 animate-pulse"></span>}
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

                      <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t sm:border-t-0 border-gray-100 pt-4 sm:pt-0">
                        <div className="text-left sm:text-right mb-0 sm:mb-4">
                          <span className="block text-gray-400 text-[10px] font-semibold uppercase tracking-wider mb-1">Total Paid</span>
                          <span className="text-xl font-bold text-gray-900 tracking-tight">
                            ₹{booking.totalPrice?.toFixed(2) || '150.00'}
                          </span>
                        </div>
                        
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                          {isActive ? (
                            <Link to="/explore" className="text-blue-600 font-medium text-sm hover:text-blue-700 bg-gradient-to-r from-blue-50 to-purple-50 px-5 py-2.5 rounded-xl transition-all duration-150 ease-out hover:shadow-md border border-blue-100">
                              Extend Time
                            </Link>
                          ) : (
                            <Link to="/explore" className="text-gray-600 font-medium text-sm hover:text-gray-900 bg-gray-50 px-5 py-2.5 rounded-xl transition-all duration-150 ease-out hover:shadow-md border border-gray-200">
                              Book Again
                            </Link>
                          )}
                        </motion.div>
                      </div>
                    </div>
                  </motion.div>
                  </FadeInView>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
