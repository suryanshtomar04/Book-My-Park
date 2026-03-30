import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="absolute top-0 left-0 w-full z-50 flex items-center justify-between px-8 py-4 bg-transparent text-white font-sans">
      
      {/* Brand / Logo - Strictly Neutral */}
      <div className="text-2xl font-bold tracking-tighter cursor-pointer">
        <Link to="/">BookMySpace</Link>
      </div>

      {/* Centered Navigation Links - Neutral Hovers */}
      <ul className="hidden md:flex items-center space-x-10 text-sm font-medium tracking-wide">
        <li>
          <Link to="/" className="text-white/90 hover:text-white transition-colors duration-200">Home</Link>
        </li>
        <li>
          <Link to="/explore" className="text-white/90 hover:text-white transition-colors duration-200">Explore</Link>
        </li>
        <li>
          <Link to="/dashboard" className="text-white/90 hover:text-white transition-colors duration-200">Dashboard</Link>
        </li>
      </ul>

      {/* Right Side Auth Actions - Neutral Styles */}
      <div className="flex items-center space-x-6">
        <Link 
          to="/register" 
          className="hidden sm:block text-sm font-medium text-white/90 hover:text-white transition-colors duration-200"
        >
          Sign Up
        </Link>
        <Link 
          to="/login" 
          className="px-6 py-2 bg-white text-gray-900 text-sm font-semibold rounded-full hover:bg-gray-100 transition-all duration-200 shadow hover:shadow-lg"
        >
          Login
        </Link>
      </div>

    </nav>
  );
}
