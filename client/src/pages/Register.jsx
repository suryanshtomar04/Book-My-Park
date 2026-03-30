import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../services/api';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Quick validation checks
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('Please fill out all fields.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);

    try {
      // Drop confirmPassword before sending to the API
      const { confirmPassword, ...submitData } = formData;
      
      await registerUser(submitData);
      
      // Successfully registered! Send them to login
      navigate('/login');

    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message || err.message || 'Failed to create an account. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-12 px-4 sm:px-6 lg:px-8 pt-32 flex flex-col items-center">
      <div className="bg-white p-8 sm:p-12 rounded-2xl shadow-sm border border-gray-100 text-center w-full max-w-md">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Create Account</h1>
        <p className="text-gray-500 mb-8">Join us to book or list premium parking spots.</p>
        
        {error && (
          <div className="mb-6 px-4 py-3 rounded-lg bg-red-50 border border-red-100 text-red-600 text-sm text-left">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5 text-left">
          
          <div>
            <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-1.5">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="John Doe"
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-colors"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              autoComplete="email"
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-colors"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-1.5">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              autoComplete="new-password"
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-colors"
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-1.5">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="••••••••"
              autoComplete="new-password"
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-4 mt-2 text-white text-lg font-bold rounded-xl shadow-sm transition-all duration-300
              ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#1A2332] hover:bg-black hover:shadow-md'}`}
          >
            {loading ? 'Creating...' : 'Sign Up'}
          </button>
        </form>

        <p className="mt-8 text-sm text-gray-500 text-center">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-teal-600 hover:text-teal-500">
            Log in here
          </Link>
        </p>
      </div>
    </div>
  );
}
