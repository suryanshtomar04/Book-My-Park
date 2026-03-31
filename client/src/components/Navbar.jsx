import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLocation } from '../context/LocationContext';

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const { address, loading, error, setManualLocation, fetchUserLocation } = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  return (
    <nav className="absolute top-0 left-0 w-full z-50 flex items-center justify-between px-8 md:px-12 py-5 bg-white/80 backdrop-blur-xl border-b border-gray-200 text-gray-900 font-sans transition-colors duration-300">
      
      {/* Brand / Logo */}
      <div className="text-xl font-semibold tracking-tight cursor-pointer">
        <Link to="/">BookMySpace</Link>
      </div>

      {/* Centered Navigation Links - Expanded Spacing & Animated Hover */}
      <ul className="hidden md:flex items-center space-x-14 lg:space-x-16 text-[13px] font-medium tracking-widest">
        <li>
          <Link to="/" className="relative text-gray-600 hover:text-gray-900 transition-colors duration-300 group py-1">
            Home
            <span className="absolute left-0 -bottom-1.5 w-0 h-[1.5px] bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
          </Link>
        </li>
        <li>
          <Link to="/explore" className="relative text-gray-600 hover:text-gray-900 transition-colors duration-300 group py-1">
            Explore
            <span className="absolute left-0 -bottom-1.5 w-0 h-[1.5px] bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
          </Link>
        </li>
        <li>
          <Link to="/dashboard" className="relative text-gray-600 hover:text-gray-900 transition-colors duration-300 group py-1">
            Dashboard
            <span className="absolute left-0 -bottom-1.5 w-0 h-[1.5px] bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
          </Link>
        </li>
      </ul>

      {/* Right Side Auth Actions & Location */}
      <div className="flex items-center space-x-6 sm:space-x-8">
        
        {/* Location Badge */}
        <div className="hidden lg:flex items-center gap-2">
          {loading ? (
            <span className="text-[12px] text-gray-500 animate-pulse flex items-center gap-1.5"><svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg> Locating...</span>
          ) : (
            <>
              <button 
                onClick={() => {
                  const manual = prompt('Enter your city to view nearby parking:', address || '');
                  if (manual) setManualLocation(manual);
                }}
                className={`group flex items-center gap-1.5 px-3.5 py-1.5 rounded-full transition-all cursor-pointer text-[12px] font-medium ${error ? 'bg-orange-50 border border-orange-200 text-orange-600 hover:bg-orange-100' : 'bg-gray-50 border border-gray-200 text-gray-700 hover:bg-gray-100 hover:text-gray-900'}`}
                title="Click to edit location manually"
              >
                <svg className={`w-3.5 h-3.5 ${error ? 'text-orange-500' : 'text-blue-500 group-hover:animate-bounce'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="max-w-[150px] truncate">{address || 'New Delhi, India'}</span>
              </button>

              {error && (
                <button 
                  onClick={fetchUserLocation}
                  className="px-3 py-1.5 bg-[#3b5cf2] hover:bg-[#2e47c7] text-white text-[11px] font-semibold rounded-full transition-colors whitespace-nowrap shadow-sm"
                >
                  Use Current Location
                </button>
              )}
            </>
          )}
        </div>
        {isAuthenticated ? (
          <>
            <span className="hidden sm:block text-[13px] font-medium text-gray-800 tracking-wide">
              Hi, {user?.name?.split(' ')[0] || 'User'}
            </span>
            <button 
              onClick={handleLogout}
              className="px-5 sm:px-6 py-2 sm:py-2.5 bg-gray-100 text-gray-700 text-[13px] font-semibold rounded-full hover:brightness-95 transition-all duration-150 ease-out border border-gray-200"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link 
              to="/register" 
              className="hidden sm:block text-[13px] font-medium text-gray-600 hover:text-gray-900 tracking-wide transition-colors duration-300"
            >
              Sign Up
            </Link>
            <Link 
              to="/login" 
              className="px-6 py-2.5 bg-blue-600 text-white text-[13px] font-semibold rounded-full hover:brightness-95 transition-all duration-150 ease-out shadow-md"
            >
              Login
            </Link>
          </>
        )}
      </div>

    </nav>
  );
}
