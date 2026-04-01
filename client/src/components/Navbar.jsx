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
      className={`navbar-glass fixed top-0 left-0 w-full z-50 flex items-center justify-between px-6 md:px-10 lg:px-16 xl:px-20 py-4 font-sans transition-all duration-300 ease-out
        ${scrolled
          ? 'navbar-scrolled py-3'
          : ''
        }`}
    >
      
      {/* Brand / Logo */}
      <motion.div
        initial={{ opacity: 0, x: -12 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1, duration: 0.5, ease: 'easeOut' }}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        className="text-xl font-semibold tracking-tight cursor-pointer"
      >
        <Link to="/" className="text-gradient font-bold text-lg">BookMySpace</Link>
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
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
            >
              <Link
                to={item.to}
                className={`group relative px-4 py-2 rounded-lg inline-flex items-center justify-center transition-all duration-200 ease-out
                  ${isActive
                    ? 'text-white font-semibold'
                    : 'text-white/50 hover:text-white/90'
                  }`}
              >
                {/* Sliding active pill — animates between links */}
                {isActive && (
                  <motion.span
                    layoutId="navbar-active-pill"
                    className="absolute inset-0 rounded-lg bg-white/[0.10] shadow-[inset_0_1px_0_rgba(255,255,255,0.08),_0_1px_3px_rgba(0,0,0,0.1)]"
                    transition={{ type: 'spring', stiffness: 380, damping: 30, mass: 0.8 }}
                  />
                )}

                {/* Label — above the pill */}
                <span className="relative z-10">{item.label}</span>

                {/* Sliding active underline — animates with the pill */}
                {isActive && (
                  <motion.span
                    layoutId="navbar-active-underline"
                    className="absolute left-3 right-3 -bottom-0.5 h-[2px] rounded-full bg-gradient-to-r from-blue-400 to-purple-400"
                    transition={{ type: 'spring', stiffness: 380, damping: 30, mass: 0.8 }}
                  />
                )}

                {/* Hover underline for inactive links */}
                {!isActive && (
                  <span className="absolute left-3 right-3 -bottom-0.5 h-[2px] rounded-full bg-gradient-to-r from-blue-400/60 to-purple-400/60 scale-x-0 opacity-0 group-hover:scale-x-100 group-hover:opacity-100 transition-all duration-300 origin-left" />
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
            <span className="text-[12px] text-white/40 animate-pulse flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/5 border border-white/8">
              <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              Locating...
            </span>
          ) : (
            <>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => {
                  const manual = prompt('Enter your city to view nearby parking:', address || '');
                  if (manual) setManualLocation(manual);
                }}
                className={`group flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-200 cursor-pointer text-[12px] font-medium shadow-sm
                  ${error
                    ? 'bg-orange-500/10 border border-orange-400/25 text-orange-400 hover:bg-orange-500/20 hover:shadow-orange-500/10'
                    : 'bg-white/[0.07] border border-white/[0.12] text-white/70 hover:bg-white/[0.12] hover:text-white hover:shadow-md hover:shadow-blue-500/10 hover:border-blue-400/20'
                  }`}
                title="Click to edit location manually"
              >
                <span className={`flex items-center justify-center w-5 h-5 rounded-full transition-all duration-200 ${error ? 'bg-orange-500/20' : 'bg-blue-500/20 group-hover:bg-blue-500/30'}`}>
                  <svg className={`w-3 h-3 transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-[1px] ${error ? 'text-orange-400' : 'text-blue-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </span>
                <span className="max-w-[140px] truncate">{address || 'New Delhi, India'}</span>
                <svg className="w-3 h-3 text-white/30 group-hover:text-white/50 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </motion.button>

              {error && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={fetchUserLocation}
                  className="px-3.5 py-2 bg-blue-500/15 hover:bg-blue-500/25 text-blue-300 text-[11px] font-semibold rounded-full transition-all duration-200 whitespace-nowrap shadow-sm border border-blue-400/20 hover:shadow-md hover:shadow-blue-500/15"
                >
                  Use GPS
                </motion.button>
              )}
            </>
          )}
        </div>

        {/* Divider */}
        {isAuthenticated && <div className="hidden lg:block w-px h-5 bg-white/10" />}

        {isAuthenticated ? (
          <>
            {/* User Avatar Pill */}
            <motion.div
              whileHover={{ scale: 1.03 }}
              className="hidden sm:flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-white/[0.06] border border-white/[0.08] hover:bg-white/[0.10] hover:border-white/[0.14] transition-all duration-200 cursor-default"
            >
              {/* Avatar Circle */}
              <span className="flex items-center justify-center w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 text-white text-[11px] font-bold uppercase shadow-sm shadow-blue-500/20">
                {(user?.name?.[0] || 'U')}
              </span>
              <span className="text-[13px] font-medium text-white/85 tracking-wide">
                {user?.name?.split(' ')[0] || 'User'}
              </span>
              {user?.role === 'admin' && (
                <span className="px-2 py-0.5 rounded-full bg-purple-500/15 border border-purple-400/20 text-[10px] font-bold text-purple-300 uppercase tracking-wider">
                  Admin
                </span>
              )}
            </motion.div>

            {/* Logout Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
              className="group flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2 bg-white/[0.06] text-white/60 text-[13px] font-medium rounded-full hover:bg-red-500/15 hover:text-red-300 hover:border-red-400/20 transition-all duration-200 ease-out border border-white/[0.08]"
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
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
              <Link 
                to="/register" 
                className="hidden sm:block text-[13px] font-medium text-white/55 hover:text-white tracking-wide transition-all duration-200 px-4 py-2 rounded-full hover:bg-white/[0.06]"
              >
                Sign Up
              </Link>
            </motion.div>

            {/* Login Button */}
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link 
                to="/login" 
                className="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-[13px] font-semibold rounded-full transition-all duration-200 ease-out shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/35 btn-glow"
              >
                Login
              </Link>
            </motion.div>
          </>
        )}
      </motion.div>

    </motion.nav>
  );
}
