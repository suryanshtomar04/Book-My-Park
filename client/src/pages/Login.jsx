import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { loginUser } from '../services/api';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Check if they were redirected here from a protected route
  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Please fill in both email and password.');
      return;
    }

    setLoading(true);

    try {
      const response = await loginUser({ email, password });
      
      // Log the full response so we can inspect it in the browser console
      console.log('Login API Response:', response);
      
      // The backend returns { data: { token: '...', user: {...} } } inside the axios data wrapper
      const authToken = response.data?.token;
      const userData = response.data?.user;

      if (!authToken || !userData) {
        throw new Error('Invalid response structure received from server.');
      }

      // Store in Context & LocalStorage via the login function handle
      login(userData, authToken);

      // Successfully logged in! Send them where they meant to go (or dashboard by default)
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
      <div className="bg-white p-8 sm:p-12 rounded-[1.5rem] shadow-lg border border-gray-200 text-center w-full max-w-md backdrop-blur-md">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-2 tracking-tight">Welcome Back</h1>
        <p className="text-gray-500 mb-8">Please enter your details to sign in.</p>
        
        {error && (
          <div className="mb-6 px-4 py-3 rounded-lg bg-red-50 border border-red-100 text-red-600 text-sm text-left">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 text-left">
          
          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1.5">
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
              className="w-full px-4 py-3 rounded-xl bg-white border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors text-gray-900"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-1.5">
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
              className="w-full px-4 py-3 rounded-xl bg-white border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors text-gray-900"
            />
          </div>

          <div className="flex items-center justify-between mt-2">
            <div className="text-sm">
              <Link to="#" className="font-semibold text-blue-600 hover:text-blue-700">
                Forgot your password?
              </Link>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full px-5 py-2.5 text-white text-lg font-medium rounded-xl transition-all duration-150 ease-out
              ${loading ? 'bg-gray-300 text-gray-500 cursor-not-allowed shadow-none' : 'bg-blue-600 hover:brightness-95 hover:shadow-md'}`}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="mt-8 text-sm text-gray-500 text-center">
          Don't have an account?{' '}
          <Link to="/register" className="font-semibold text-blue-600 hover:text-blue-700">
            Sign up now
          </Link>
        </p>
      </div>
    </div>
  );
}
