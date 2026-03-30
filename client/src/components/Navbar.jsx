import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  return (
    <nav className="absolute top-0 left-0 w-full z-50 flex items-center justify-between px-8 md:px-12 py-5 bg-black/10 backdrop-blur-md border-b border-white/10 text-white font-sans">
      
      {/* Brand / Logo */}
      <div className="text-xl font-semibold tracking-tight cursor-pointer">
        <Link to="/">BookMySpace</Link>
      </div>

      {/* Centered Navigation Links - Expanded Spacing & Animated Hover */}
      <ul className="hidden md:flex items-center space-x-14 lg:space-x-16 text-[13px] font-medium tracking-widest">
        <li>
          <Link to="/" className="relative text-white/75 hover:text-white transition-colors duration-300 group py-1">
            Home
            <span className="absolute left-0 -bottom-1.5 w-0 h-[1.5px] bg-white/80 transition-all duration-300 group-hover:w-full"></span>
          </Link>
        </li>
        <li>
          <Link to="/explore" className="relative text-white/75 hover:text-white transition-colors duration-300 group py-1">
            Explore
            <span className="absolute left-0 -bottom-1.5 w-0 h-[1.5px] bg-white/80 transition-all duration-300 group-hover:w-full"></span>
          </Link>
        </li>
        <li>
          <Link to="/dashboard" className="relative text-white/75 hover:text-white transition-colors duration-300 group py-1">
            Dashboard
            <span className="absolute left-0 -bottom-1.5 w-0 h-[1.5px] bg-white/80 transition-all duration-300 group-hover:w-full"></span>
          </Link>
        </li>
      </ul>

      {/* Right Side Auth Actions */}
      <div className="flex items-center space-x-6 sm:space-x-8">
        {isAuthenticated ? (
          <>
            <span className="hidden sm:block text-[13px] font-medium text-white/90 tracking-wide">
              Hi, {user?.name?.split(' ')[0] || 'User'}
            </span>
            <button 
              onClick={handleLogout}
              className="px-5 sm:px-6 py-2 sm:py-2.5 bg-white/10 text-white text-[13px] font-semibold rounded-full hover:bg-white/20 transition-all duration-300 border border-white/20"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link 
              to="/register" 
              className="hidden sm:block text-[13px] font-medium text-white/75 hover:text-white tracking-wide transition-colors duration-300"
            >
              Sign Up
            </Link>
            <Link 
              to="/login" 
              className="px-6 py-2.5 bg-white text-gray-900 text-[13px] font-semibold rounded-full hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-px"
            >
              Login
            </Link>
          </>
        )}
      </div>

    </nav>
  );
}
