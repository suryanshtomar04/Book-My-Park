import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { loginUser } from '../services/api';
import { motion } from 'framer-motion';

export default function Login() {
  const [mode, setMode] = useState('user');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login, setUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Please fill in both email and password.');
      return;
    }

    // Dev-only default admin login bypass
    if (email === "admin@bookmyspace.com" && password === "admin123") {
      setMode("admin");
      
      const adminUser = {
        id: "dev-admin",
        name: "Admin",
        email: "admin@bookmyspace.com",
        role: "admin",
        token: "dev-admin-token"
      };

      localStorage.setItem("user", JSON.stringify(adminUser));
      setUser(adminUser);
      navigate("/add-parking", { replace: true });
      return;
    }

    setLoading(true);

    try {
      const response = await loginUser({ email, password });
      console.log('Login API Response:', response);
      
      const authToken = response.data?.token;
      const userData = response.data?.user;

      if (!authToken || !userData) {
        throw new Error('Invalid response structure received from server.');
      }

      const user = userData;
      localStorage.setItem("user", JSON.stringify(user));
      login(user, authToken);
      console.log(user);
      navigate(from, { replace: true });
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message || err.message || 'Failed to login. Please check your credentials.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-12 px-4 sm:px-6 lg:px-8 pt-32 flex flex-col items-center text-gray-900">
      <motion.div
        initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="bg-white p-8 sm:p-12 rounded-[1.5rem] shadow-xl shadow-blue-500/5 border border-gray-200 text-center w-full max-w-md backdrop-blur-md"
      >
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.4 }}
          className="text-3xl font-extrabold text-gray-900 mb-2 tracking-tight"
        >
          Welcome Back
        </motion.h1>
        <p className="text-gray-500 mb-6">Please enter your details to sign in.</p>
        
        <div className="flex bg-gray-100 p-1 rounded-full mb-8 relative">
          <button
            type="button"
            onClick={() => setMode('user')}
            className={`flex-1 py-2.5 text-sm font-medium rounded-full transition-all duration-300 ease-in-out relative z-10 ${mode === 'user' ? 'text-white' : 'text-gray-600 hover:text-gray-900'}`}
          >
            User Login
          </button>
          <button
            type="button"
            onClick={() => setMode('admin')}
            className={`flex-1 py-2.5 text-sm font-medium rounded-full transition-all duration-300 ease-in-out relative z-10 ${mode === 'admin' ? 'text-white' : 'text-gray-600 hover:text-gray-900'}`}
          >
            Admin Login
          </button>
          {/* Animated pill background */}
          <motion.div
            layout
            className="absolute top-1 bottom-1 w-[calc(50%-4px)] bg-gradient-to-r from-blue-600 to-blue-700 rounded-full shadow-md z-0"
            style={{ left: mode === 'user' ? '4px' : 'calc(50% + 0px)' }}
            transition={{ type: 'spring', stiffness: 350, damping: 30 }}
          />
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 px-4 py-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm text-left"
          >
            {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 text-left">
          
          <div>
            <label htmlFor="email" className="block text-[13px] font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
              required
              className="w-full px-4 py-3 rounded-xl bg-white border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 text-gray-900 input-glow"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-[13px] font-semibold text-gray-500 uppercase tracking-wide mb-1.5 mt-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
              required
              className="w-full px-4 py-3 rounded-xl bg-white border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 text-gray-900 input-glow"
            />
          </div>

          <div className="flex items-center justify-between mt-2">
            <div className="text-sm">
              <Link to="#" className="font-semibold text-blue-600 hover:text-blue-700 transition-colors">
                Forgot your password?
              </Link>
            </div>
          </div>

          <motion.button
            type="submit"
            disabled={loading}
            whileHover={!loading ? { scale: 1.01 } : {}}
            whileTap={!loading ? { scale: 0.98 } : {}}
            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            className={`w-full px-5 py-3 text-white text-lg font-medium rounded-xl focus:outline-none btn-ripple
              ${loading ? 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-none' : 'bg-blue-600 hover:bg-blue-700 btn-glow'}`}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Signing in...
              </span>
            ) : 'Sign In'}
          </motion.button>
        </form>

        <p className="mt-8 text-sm text-gray-500 text-center">
          Don't have an account?{' '}
          <Link to="/register" className="font-semibold text-blue-600 hover:text-blue-700 transition-colors">
            Sign up now
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
