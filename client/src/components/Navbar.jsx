import { Link, useNavigate, useLocation as useRouteLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLocation } from '../context/LocationContext';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const { address, loading, error, setManualLocation, fetchUserLocation } = useLocation();
  const navigate = useNavigate();
  const { pathname } = useRouteLocation();
  const [scrolled, setScrolled] = useState(false);

  // Scroll-aware blur effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={`fixed top-0 left-0 w-full z-50 flex items-center justify-between px-6 md:px-10 lg:px-16 xl:px-20 py-4 font-sans transition-all duration-300 ease-out bg-white/70 backdrop-blur-md border-b border-black/[0.05] shadow-[0_4px_20px_rgba(0,0,0,0.03)]
        ${scrolled
          ? 'py-3'
          : ''
        }`}
    >
      
      {/* Brand / Logo */}
      <motion.div
        initial={{ opacity: 0, x: -12 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1, duration: 0.5, ease: 'easeOut' }}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.98 }}
        className="text-xl font-semibold tracking-tight cursor-pointer"
      >
        <Link to="/" className="font-bold text-lg text-gray-900">BookMySpace</Link>
      </motion.div>

      {/* Centered Navigation Links */}
      <ul className="hidden md:flex items-center gap-1 lg:gap-1.5 text-[13px] font-medium tracking-widest relative">
        {[
          { to: '/', label: 'Home' },
          { to: '/explore', label: 'Explore' },
          { to: '/dashboard', label: 'Dashboard' },
        ].map((item, index) => {
          const isActive = item.to === '/' ? pathname === '/' : pathname.startsWith(item.to);
          return (
            <motion.li
              key={item.to}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + index * 0.08, duration: 0.4, ease: 'easeOut' }}
            >
              <Link
                to={item.to}
                className={`group relative px-4 py-2 rounded-lg inline-flex items-center justify-center transition-all duration-200 ease-out
                  ${isActive
                    ? 'text-blue-600 font-semibold'
                    : 'text-gray-600 hover:text-gray-900'
                  }`}
              >
                {/* Sliding active pill — animates between links */}
                {isActive && (
                  <motion.span
                    layoutId="navbar-active-pill"
                    className="absolute inset-0 rounded-lg bg-blue-50/70"
                    transition={{ type: 'spring', stiffness: 380, damping: 30, mass: 0.8 }}
                  />
                )}

                {/* Label — above the pill */}
                <span className="relative z-10">{item.label}</span>

                {/* Sliding active underline — animates with the pill */}
                {isActive && (
                  <motion.span
                    layoutId="navbar-active-underline"
                    className="absolute left-3 right-3 -bottom-0.5 h-[2px] rounded-full bg-blue-600"
                    transition={{ type: 'spring', stiffness: 380, damping: 30, mass: 0.8 }}
                  />
                )}

                {/* Hover underline for inactive links */}
                {!isActive && (
                  <span className="absolute left-4 right-4 -bottom-1 h-[2px] rounded-full bg-gray-900 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                )}
              </Link>
            </motion.li>
          );
        })}
      </ul>

      {/* Right Side — Control Panel */}
      <motion.div
        initial={{ opacity: 0, x: 12 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.25, duration: 0.5, ease: 'easeOut' }}
        className="flex items-center gap-3 sm:gap-4"
      >
        
        {/* Location Pill */}
        <div className="hidden lg:flex items-center gap-2">
          {loading ? (
            <span className="text-[12px] text-gray-500 animate-pulse flex items-center gap-1.5 px-4 py-2 rounded-full bg-gray-50 border border-gray-200">
              <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              Locating...
            </span>
          ) : (
            <>
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.15 }}
                onClick={() => {
                  const manual = prompt('Enter your city to view nearby parking:', address || '');
                  if (manual) setManualLocation(manual);
                }}
                className={`group flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-200 cursor-pointer text-[12px] font-medium shadow-sm border
                  ${error
                    ? 'bg-orange-50 border-orange-200 text-orange-600 hover:bg-orange-100'
                    : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300 hover:shadow-md'
                  }`}
                title="Click to edit location manually"
              >
                <span className={`flex items-center justify-center w-5 h-5 rounded-full transition-all duration-200 ${error ? 'bg-orange-100' : 'bg-blue-50 group-hover:bg-blue-100'}`}>
                  <svg className={`w-3 h-3 transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-[1px] ${error ? 'text-orange-500' : 'text-blue-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </span>
                <span className="max-w-[140px] truncate">{address || 'New Delhi, India'}</span>
                <svg className="w-3 h-3 text-gray-400 group-hover:text-gray-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </motion.button>

              {error && (
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
                  onClick={fetchUserLocation}
                  className="px-3.5 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 text-[11px] font-semibold rounded-full transition-all duration-200 whitespace-nowrap shadow-sm border border-blue-200"
                >
                  Use GPS
                </motion.button>
              )}
            </>
          )}
        </div>

        {/* Divider */}
        {isAuthenticated && <div className="hidden lg:block w-px h-5 bg-gray-200" />}

        {isAuthenticated ? (
          <>
            {/* User Avatar Pill */}
            <motion.div
              whileHover={{ scale: 1.01 }}
              className="hidden sm:flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-white border border-gray-200 hover:border-gray-300 hover:bg-gray-50/50 transition-all duration-200 cursor-default shadow-sm"
            >
              {/* Avatar Circle */}
              <span className="flex items-center justify-center w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white text-[11px] font-bold uppercase shadow-sm">
                {(user?.name?.[0] || 'U')}
              </span>
              <span className="text-[13px] font-medium text-gray-700 tracking-wide">
                {user?.name?.split(' ')[0] || 'User'}
              </span>
              {user?.role === 'admin' && (
                <span className="px-2 py-0.5 rounded-full bg-blue-50 border border-blue-100 text-[10px] font-bold text-blue-600 uppercase tracking-wider">
                  Admin
                </span>
              )}
            </motion.div>

            {/* Logout Button */}
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
              onClick={handleLogout}
              className="group flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2 bg-white text-gray-600 text-[13px] font-medium rounded-full hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all duration-200 ease-out border border-gray-200 shadow-sm"
            >
              <svg className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-[1px]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </motion.button>
          </>
        ) : (
          <>
            {/* Sign Up Link */}
            <Link 
              to="/register" 
              className="hidden sm:block text-[13px] font-medium text-gray-600 hover:text-gray-900 tracking-wide transition-all duration-200 px-4 py-2 rounded-full hover:bg-gray-100 active:scale-[0.98]"
            >
              Sign Up
            </Link>

            {/* Login Button */}
            <Link  
              to="/login" 
              className="px-6 py-2.5 bg-blue-600 text-white text-[13px] font-semibold rounded-full transition-all duration-200 ease-out shadow-[0_4px_14px_rgba(37,99,235,0.2)] hover:bg-blue-700 hover:shadow-sm hover:brightness-105 hover:-translate-y-px active:scale-[0.98] outline-none inline-block ml-2"
            >
              Login
            </Link>
          </>
        )}
      </motion.div>

    </motion.nav>
  );
}
