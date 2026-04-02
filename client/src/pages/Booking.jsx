import { useState, useMemo, useRef } from 'react';
import { useLocation, Navigate, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { createBooking } from '../services/api';
import { motion, AnimatePresence, useInView } from 'framer-motion';

// Viewport fade-in wrapper
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
  const [successMsg, setSuccessMsg] = useState(false);
  const [showModal, setShowModal] = useState(false);

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

  const handleBookingSubmit = (e) => {
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
    setShowModal(true);
  };

  const confirmBooking = async () => {
    setShowModal(false);
    setLoading(true);

    try {
      const formattedStartTime = new Date(`${startDate}T${startTime}`).toISOString();
      const formattedEndTime = new Date(`${endDate}T${endTime}`).toISOString();

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

      setSuccessMsg(true);
      setTimeout(() => {
        navigate('/dashboard', { state: { newBooking: true, bookingId: demoBooking._id } });
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to complete booking. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-12 px-4 sm:px-6 lg:px-8 text-gray-900">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10 pt-16"
        >
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight sm:text-4xl">
            Complete Your Booking
          </h1>
          <p className="mt-4 text-lg text-gray-500">
            Review your parking details and select your timeframe.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Left: Parking details */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white rounded-[1.5rem] shadow-xl shadow-blue-500/5 border border-gray-200 overflow-hidden flex flex-col"
          >
            <div className="relative h-64 w-full overflow-hidden group">
              <img
                src={image || "https://images.unsplash.com/photo-1590674899484-d5640e854abe?auto=format&fit=crop&q=80&w=1000"}
                alt={title || "Parking Spot"}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
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
                <motion.svg
                  whileHover={{ scale: 1.2 }}
                  className="h-5 w-5 mr-2 text-blue-500 icon-hover cursor-pointer"
                  fill="none" viewBox="0 0 24 24" stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </motion.svg>
                {parkingLocation || '123 Main Street, City Center'}
              </div>
              
              <FadeInView>
                <div className="mt-auto space-y-4">
                  {[
                    { label: 'Spot Type', value: 'Covered', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
                    { label: 'Access', value: '24/7 Access', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
                    { label: 'Security', value: 'CCTV & Guards', icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' },
                  ].map((item, idx) => (
                    <div key={idx} className={`flex justify-between items-center py-3 ${idx < 2 ? 'border-b border-gray-100' : ''}`}>
                      <div className="flex items-center gap-2">
                        <motion.svg
                          whileHover={{ scale: 1.15 }}
                          className="w-4 h-4 text-blue-500 icon-hover"
                          fill="none" viewBox="0 0 24 24" stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={item.icon} />
                        </motion.svg>
                        <span className="text-gray-500">{item.label}</span>
                      </div>
                      <span className="font-medium text-gray-900">{item.value}</span>
                    </div>
                  ))}
                </div>
              </FadeInView>
            </div>
          </motion.div>

          {/* Right: Booking form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white rounded-[1.5rem] shadow-xl shadow-blue-500/5 border border-gray-200 p-8 backdrop-blur-md"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-6">Booking Details</h2>
            
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm"
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>
            
            <form onSubmit={handleBookingSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { id: 'start-date', label: 'Start Date', type: 'date', value: startDate, onChange: setStartDate },
                  { id: 'start-time', label: 'Start Time', type: 'time', value: startTime, onChange: setStartTime },
                ].map((field) => (
                  <div key={field.id}>
                    <label htmlFor={field.id} className="block text-sm font-medium text-gray-700 mb-2">
                      {field.label}
                    </label>
                    <input
                      type={field.type}
                      id={field.id}
                      value={field.value}
                      onChange={(e) => field.onChange(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-white border border-gray-300 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 input-glow"
                    />
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { id: 'end-date', label: 'End Date', type: 'date', value: endDate, onChange: setEndDate },
                  { id: 'end-time', label: 'End Time', type: 'time', value: endTime, onChange: setEndTime },
                ].map((field) => (
                  <div key={field.id}>
                    <label htmlFor={field.id} className="block text-sm font-medium text-gray-700 mb-2">
                      {field.label}
                    </label>
                    <input
                      type={field.type}
                      id={field.id}
                      value={field.value}
                      onChange={(e) => field.onChange(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-white border border-gray-300 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 input-glow"
                    />
                  </div>
                ))}
              </div>

              <hr className="border-gray-200 my-6" />

              <FadeInView>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="bg-gradient-to-br from-gray-50 to-blue-50/30 rounded-xl p-6 border border-gray-200"
                >
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Summary</h3>
                  <div className="space-y-3 mb-4 text-sm">
                    <div className="flex justify-between text-gray-500">
                      <span>Duration</span>
                      <motion.span
                        key={durationHours}
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="font-medium text-gray-900"
                      >
                        {durationHours} hours
                      </motion.span>
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
                    <motion.span
                      key={finalTotal}
                      initial={{ scale: 1.2, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="text-2xl font-bold text-gradient"
                    >
                      ₹{finalTotal.toFixed(2)}
                    </motion.span>
                  </div>
                </motion.div>
              </FadeInView>

              <motion.button
                type="submit"
                disabled={loading || successMsg}
                whileHover={!loading && !successMsg ? { scale: 1.01 } : {}}
                whileTap={!loading && !successMsg ? { scale: 0.95 } : {}}
                className={`w-full px-5 py-3.5 rounded-xl font-medium text-lg transition-all duration-200 ease-out mt-4 text-white btn-ripple
                ${loading || successMsg ? 'bg-gray-300 cursor-not-allowed text-gray-500' : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:shadow-lg hover:shadow-blue-500/20 btn-glow'}`}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Booking...
                  </span>
                ) : 'Book Now'}
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>

      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm"
              onClick={() => setShowModal(false)}
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white rounded-2xl shadow-xl z-10 w-full max-w-md overflow-hidden relative"
            >
              <div className="p-6 text-center sm:text-left">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Confirm Booking</h3>
                
                <div className="space-y-4 mb-6">
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                    <p className="font-bold text-gray-900 mb-1">{title || 'Downtown Premium Garage'}</p>
                    <p className="text-sm text-gray-500 flex items-center justify-center sm:justify-start gap-1 mb-3">
                      <svg className="w-4 h-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                      {parkingLocation || '123 Main Street, City Center'}
                    </p>
                    <div className="flex justify-between border-t border-gray-200 mt-2 pt-3">
                      <span className="text-sm text-gray-500 font-medium">Rate:</span>
                      <span className="text-sm font-bold text-gray-900">₹{parseFloat(price || 50).toFixed(2)} / hr</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center py-2 px-1">
                    <span className="text-sm font-medium text-gray-600">Estimated Total:</span>
                    <span className="text-xl font-bold text-blue-600">₹{finalTotal.toFixed(2)}</span>
                  </div>
                </div>

                <div className="flex gap-3 mt-8">
                  <button
                    onClick={() => setShowModal(false)}
                    className="flex-1 px-4 py-3 rounded-xl font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmBooking}
                    className="flex-1 px-4 py-3 rounded-xl font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-sm"
                  >
                    Confirm Booking
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {successMsg && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-10 inset-x-0 mx-auto z-50 bg-white border border-green-200 shadow-xl rounded-2xl p-4 flex items-center gap-4 w-[320px]"
          >
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <p className="font-bold text-green-700">Booking Confirmed!</p>
              <p className="text-sm text-gray-500">Redirecting to dashboard...</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Booking;
