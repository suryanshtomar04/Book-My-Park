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
      const authToken = response.data?.token;
      const userData = response.data?.user;
      if (!authToken || !userData) {
        throw new Error('Invalid response structure received from server.');
      }
      const user = userData;
      localStorage.setItem("user", JSON.stringify(user));
      login(user, authToken);
      navigate(from, { replace: true });
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || err.message || 'Failed to login. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">

      {/* Full-width seamless gradient background */}
      <div className="absolute inset-0" style={{
        background: 'linear-gradient(to right, #4338ca 0%, #4f46e5 20%, #6366f1 35%, rgba(224,231,255,0.85) 58%, rgba(238,242,255,0.5) 72%, rgba(248,250,255,1) 88%, #f8faff 100%)'
      }} />

      {/* Radial glow on left */}
      <div className="absolute inset-0" style={{
        background: 'radial-gradient(ellipse at 20% 40%, rgba(255,255,255,0.12), transparent 50%)'
      }} />

      {/* Noise texture */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
      }} />

      {/* Soft floating blurs */}
      <div className="absolute top-[10%] left-[5%] w-80 h-80 bg-white/[0.06] rounded-full blur-3xl" />
      <div className="absolute bottom-[15%] left-[20%] w-96 h-96 bg-purple-400/[0.08] rounded-full blur-3xl" />
      <div className="absolute top-[50%] left-[30%] w-64 h-64 bg-blue-300/[0.06] rounded-full blur-3xl" />

      {/* Glow bridge — soft light where sections merge */}
      <div className="hidden lg:block absolute left-[42%] top-0 h-full w-[280px] bg-gradient-to-r from-transparent via-white/30 to-transparent blur-2xl pointer-events-none z-[1]" />

      {/* Grid pattern on left half */}
      <div className="absolute top-0 left-0 w-[55%] h-full opacity-[0.02]" style={{
        backgroundImage: 'linear-gradient(rgba(255,255,255,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.2) 1px, transparent 1px)',
        backgroundSize: '64px 64px'
      }} />

      {/* Content layer */}
      <div className="relative z-10 min-h-screen flex">
        
        {/* LEFT — Branding (sits on gradient) */}
        <div className="hidden lg:flex lg:w-[46%] xl:w-[47%] relative flex-col justify-center items-center px-12 xl:px-16">
          <div className="max-w-md">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <div className="flex items-center gap-2.5 mb-10">
                <div className="w-10 h-10 bg-white/[0.1] backdrop-blur-md rounded-xl flex items-center justify-center border border-white/[0.08] shadow-lg shadow-black/5">
                  <svg className="w-5 h-5 text-white/90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <span className="text-white/60 text-sm font-semibold tracking-wide">BookMySpace</span>
              </div>

              <h1 className="text-4xl xl:text-[2.75rem] font-semibold text-white tracking-tight leading-[1.15] mb-5">
                Park smarter.<br />
                <span className="text-white/50">Not harder.</span>
              </h1>
              <p className="text-white/40 text-[17px] leading-relaxed max-w-sm">
                Find, reserve, and manage parking in seconds. No stress, no waiting.
              </p>
            </motion.div>

            {/* Floating mock card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="mt-14"
            >
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                className="bg-white/[0.07] backdrop-blur-xl rounded-2xl border border-white/[0.08] p-5 max-w-[270px] shadow-2xl shadow-black/15"
                style={{ transform: 'rotate(-2deg)' }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-white/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-white/85 text-sm font-semibold">Sector 62 Garage</p>
                    <p className="text-white/35 text-[11px]">City Center · 0.3 km</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                    <span className="text-emerald-400/80 text-[11px] font-medium">3 spots left</span>
                  </div>
                  <span className="text-white/75 text-sm font-bold">₹50<span className="text-white/35 text-[11px] font-normal">/hr</span></span>
                </div>
              </motion.div>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-14 flex gap-10"
            >
              {[
                { value: '1,200+', label: 'Drivers' },
                { value: '500+', label: 'Spots' },
                { value: '99.9%', label: 'Uptime' },
              ].map((stat, i) => (
                <div key={i}>
                  <p className="text-xl font-bold text-white/85">{stat.value}</p>
                  <p className="text-white/25 text-[13px] mt-0.5">{stat.label}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* RIGHT — Form Panel (overlaps into gradient via negative margin) */}
        <div className="flex-1 flex items-center justify-center px-6 sm:px-10 lg:-ml-10 py-12 pt-28 lg:pt-12">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="w-full max-w-[420px]"
          >
            {/* Header */}
            <div className="mb-8">
              <h2 className="text-[1.75rem] font-semibold text-gray-900 tracking-tight">
                Welcome back
              </h2>
              <p className="text-gray-500 mt-1.5 text-[15px]">Enter your credentials to continue.</p>
            </div>

            {/* Card */}
            <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/60 p-7 sm:p-8 transition-all duration-300 hover:-translate-y-0.5"
              style={{ boxShadow: '0 10px 40px rgba(0,0,0,0.06), 0 2px 8px rgba(0,0,0,0.03), 0 0 0 1px rgba(0,0,0,0.02)' }}
            >

              {/* Toggle */}
              <div className="flex bg-gray-100/60 p-1 rounded-xl mb-7 relative">
                <button
                  type="button"
                  onClick={() => setMode('user')}
                  className={`flex-1 py-2.5 text-[13px] font-medium rounded-[10px] transition-all duration-200 relative z-10 ${mode === 'user' ? 'text-white' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  User
                </button>
                <button
                  type="button"
                  onClick={() => setMode('admin')}
                  className={`flex-1 py-2.5 text-[13px] font-medium rounded-[10px] transition-all duration-200 relative z-10 ${mode === 'admin' ? 'text-white' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  Admin
                </button>
                <motion.div
                  layout
                  className="absolute top-1 bottom-1 w-[calc(50%-4px)] bg-gradient-to-r from-blue-600 to-indigo-600 rounded-[10px] z-0"
                  style={{ left: mode === 'user' ? '4px' : 'calc(50%)' }}
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              </div>

              {/* Error */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-5 px-4 py-3 rounded-xl bg-red-50/80 border border-red-100 text-red-600 text-[13px] text-left flex items-start gap-2"
                >
                  <svg className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {error}
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-[13px] font-medium text-gray-600 mb-2">
                    Email Address
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <svg className="w-[18px] h-[18px] text-gray-400 group-focus-within:text-blue-500 transition-colors duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      autoComplete="email"
                      required
                      className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/60 border border-gray-200/70 text-gray-900 placeholder:text-gray-400 outline-none transition-all duration-200 shadow-[inset_0_1px_2px_rgba(0,0,0,0.03)] focus:border-blue-500 focus:bg-white focus:shadow-[0_0_0_4px_rgba(59,130,246,0.08)]"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label htmlFor="password" className="block text-[13px] font-medium text-gray-600 mb-2">
                    Password
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <svg className="w-[18px] h-[18px] text-gray-400 group-focus-within:text-blue-500 transition-colors duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <input
                      type="password"
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      autoComplete="current-password"
                      required
                      className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/60 border border-gray-200/70 text-gray-900 placeholder:text-gray-400 outline-none transition-all duration-200 shadow-[inset_0_1px_2px_rgba(0,0,0,0.03)] focus:border-blue-500 focus:bg-white focus:shadow-[0_0_0_4px_rgba(59,130,246,0.08)]"
                    />
                  </div>
                </div>

                {/* Forgot */}
                <div className="flex justify-end -mt-1">
                  <Link to="#" className="text-[13px] font-medium text-blue-600 hover:text-blue-700 transition-colors">
                    Forgot password?
                  </Link>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full px-5 py-3 text-white text-[15px] font-medium rounded-xl focus:outline-none transition-all duration-200 active:scale-[0.98]
                    ${loading
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'
                      : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:brightness-110 cursor-pointer'
                    }`}
                  style={!loading ? { boxShadow: '0 8px 20px rgba(79,70,229,0.28)' } : {}}
                  onMouseEnter={(e) => { if (!loading) e.currentTarget.style.boxShadow = '0 10px 28px rgba(79,70,229,0.38)'; }}
                  onMouseLeave={(e) => { if (!loading) e.currentTarget.style.boxShadow = '0 8px 20px rgba(79,70,229,0.28)'; }}
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Signing in...
                    </span>
                  ) : 'Sign In'}
                </button>
              </form>

              {/* Divider */}
              <div className="flex items-center gap-4 my-6">
                <div className="flex-1 h-px bg-gray-200/50" />
                <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest">or</span>
                <div className="flex-1 h-px bg-gray-200/50" />
              </div>

              {/* Register link */}
              <p className="text-[14px] text-gray-500 text-center">
                New to BookMySpace?{' '}
                <Link to="/register" className="font-semibold text-blue-600 hover:text-blue-700 transition-colors">
                  Create an account
                </Link>
              </p>
            </div>

            {/* Trust badges */}
            <div className="mt-7 flex items-center justify-center gap-6 text-[12px] text-gray-400 font-medium">
              {[
                { icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z', label: 'Secure login' },
                { icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z', label: 'Encrypted' },
                { icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z', label: '1,200+ drivers' },
              ].map((badge, i) => (
                <div key={i} className="flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5 text-blue-400/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={badge.icon} />
                  </svg>
                  {badge.label}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
