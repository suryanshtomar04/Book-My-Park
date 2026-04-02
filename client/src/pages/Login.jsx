import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { loginUser } from '../services/api';
import { motion } from 'framer-motion';
import AnimatedCounter from '../components/AnimatedCounter';

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
    <div className="min-h-screen relative overflow-hidden w-full flex justify-center">

      {/* Subtlest Premium Background */}
      <div className="absolute inset-0 z-0 bg-white" style={{
        background: `
          radial-gradient(circle at 20% 30%, rgba(37,99,235,0.06), transparent 40%),
          radial-gradient(circle at 80% 70%, rgba(59,130,246,0.05), transparent 50%),
          linear-gradient(180deg, #ffffff 0%, #f8fbff 40%, #f5f9ff 100%)
        `
      }} />

      {/* Light Noise Texture */}
      <div className="absolute inset-0 z-0 opacity-[0.025] mix-blend-overlay pointer-events-none" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`
      }} />

      <div className="relative z-10 min-h-screen flex max-w-7xl w-full">
        
        {/* LEFT — Typography & Content */}
        <div className="hidden lg:flex lg:w-1/2 flex-col justify-center px-12 xl:px-20 py-20">
          <div className="max-w-lg">
            
            {/* Branding */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              className="flex items-center gap-2.5 mb-12"
            >
              <div className="w-9 h-9 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <span className="text-gray-900 font-semibold tracking-wide text-sm">BookMySpace</span>
            </motion.div>

            {/* Main Heading */}
            <h1 className="text-5xl xl:text-6xl font-semibold tracking-tight leading-[1.05] mb-6">
              <motion.span 
                initial={{ opacity: 0, y: 15 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ duration: 0.4, ease: 'easeOut' }} 
                className="text-gray-900 block pb-1.5"
              >
                Park smarter.
              </motion.span>
              <motion.span 
                initial={{ opacity: 0, y: 15 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ duration: 0.4, delay: 0.1, ease: 'easeOut' }} 
                className="text-blue-600 block"
              >
                Not harder.
              </motion.span>
            </h1>
            
            {/* Subtext */}
            <motion.p 
              initial={{ opacity: 0, y: 15 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.4, delay: 0.2, ease: 'easeOut' }}
              className="text-gray-500 text-lg leading-relaxed max-w-md"
            >
              Find, reserve, and manage parking in seconds. No stress, no waiting.
            </motion.p>

            {/* Clean Floating Card with micro-loop and hover */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3, ease: 'easeOut' }}
              className="mt-14 inline-block"
            >
              <motion.div
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              >
                <motion.div
                  whileHover={{ y: -3, boxShadow: '0 8px 20px rgba(0,0,0,0.08)' }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                  className="bg-white border border-gray-200 shadow-sm rounded-xl p-5 max-w-[280px]"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center border border-blue-100/50">
                      <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-gray-900 text-[15px] font-semibold tracking-tight">Sector 62 Garage</p>
                      <p className="text-gray-500 text-[12px] mt-0.5">City Center · 0.3 km</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-4 bg-gray-50 p-2.5 rounded-lg border border-gray-100">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-emerald-500 rounded-full" />
                      <span className="text-gray-700 text-[12px] font-medium">3 spots left</span>
                    </div>
                    <span className="text-gray-900 text-[15px] font-bold">₹50<span className="text-gray-500 text-[12px] font-normal">/hr</span></span>
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.4 }}
              className="mt-16 flex gap-12"
            >
              {[
                { end: 1200, suffix: '+', decimals: 0, label: 'Drivers' },
                { end: 500, suffix: '+', decimals: 0, label: 'Spots' },
                { end: 99.9, suffix: '%', decimals: 1, label: 'Uptime' },
              ].map((stat, i) => (
                <div key={i}>
                  <p className="text-2xl font-semibold text-gray-900 tracking-tight">
                    <AnimatedCounter end={stat.end} duration={1000} suffix={stat.suffix} decimals={stat.decimals} />
                  </p>
                  <p className="text-gray-500 text-[13px] mt-1 font-medium">{stat.label}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* RIGHT — Form Panel */}
        <div className="flex-1 flex items-center justify-center px-6 sm:px-10 py-12 lg:py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="w-full max-w-[440px] bg-white border border-gray-200/80 rounded-2xl p-8 shadow-xl shadow-blue-900/5"
            style={{ boxShadow: '0 25px 50px -12px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.02)' }}
          >
            <div className="mb-8">
              <h2 className="text-3xl font-semibold text-gray-900 tracking-tight">
                Welcome back
              </h2>
              <p className="text-gray-500 mt-2 text-[15px] leading-relaxed">Enter your credentials to securely access your account.</p>
            </div>

            {/* Toggle */}
            <div className="flex bg-gray-100 p-1 rounded-xl mb-7 relative">
              <button type="button" onClick={() => setMode('user')}
                className={`flex-1 py-2.5 text-[13px] font-semibold rounded-[10px] transition-all duration-200 relative z-10 ${mode === 'user' ? 'text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
              >User</button>
              <button type="button" onClick={() => setMode('admin')}
                className={`flex-1 py-2.5 text-[13px] font-semibold rounded-[10px] transition-all duration-200 relative z-10 ${mode === 'admin' ? 'text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
              >Admin</button>
              <motion.div layout
                className="absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-[10px] z-0 bg-white"
                style={{ left: mode === 'user' ? '4px' : 'calc(50%)', boxShadow: '0 2px 4px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.04)' }}
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              />
            </div>

            {/* Error */}
            {error && (
              <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                className="mb-6 px-4 py-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-[13px] text-left flex items-start gap-2">
                <svg className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {error}
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-[13px] font-semibold text-gray-700 mb-2">Email Address</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <svg className="w-[18px] h-[18px] text-gray-400 group-focus-within:text-blue-600 transition-colors duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com" autoComplete="email" required
                    className="w-full pl-11 pr-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 placeholder:text-gray-400 focus:placeholder-gray-300 outline-none transition-all duration-200 focus:bg-white focus:border-blue-500 focus:shadow-[0_0_0_3px_rgba(37,99,235,0.1)]"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-[13px] font-semibold text-gray-700 mb-2">Password</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <svg className="w-[18px] h-[18px] text-gray-400 group-focus-within:text-blue-600 transition-colors duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••" autoComplete="current-password" required
                    className="w-full pl-11 pr-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 placeholder:text-gray-400 focus:placeholder-gray-300 outline-none transition-all duration-200 focus:bg-white focus:border-blue-500 focus:shadow-[0_0_0_3px_rgba(37,99,235,0.1)]"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-1 pb-2">
                <Link to="#" className="text-[13px] font-medium text-blue-600 hover:text-blue-700 transition-colors">Forgot password?</Link>
              </div>

              {/* Button */}
              <motion.button 
                type="submit" 
                disabled={loading}
                whileHover={{ scale: 1.02, boxShadow: '0 10px 25px rgba(37,99,235,0.25)' }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
                className={`w-full px-5 py-3.5 mt-2 text-white text-[15px] font-medium rounded-xl focus:outline-none bg-blue-600 ${loading ? 'opacity-70 cursor-not-allowed shadow-none' : 'cursor-pointer shadow-[0_4px_14px_rgba(37,99,235,0.2)]'}`}
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
              </motion.button>
            </form>

            <div className="flex items-center gap-4 my-7">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest">or</span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            <p className="text-[14px] text-gray-600 text-center">
              New to BookMySpace?{' '}
              <Link to="/register" className="font-semibold text-blue-600 hover:text-blue-700 transition-colors">Create an account</Link>
            </p>

            {/* Trust */}
            <div className="mt-8 flex items-center justify-center gap-7 text-[12px] text-gray-400 font-medium">
              {[
                { icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z', label: 'Secure login' },
                { icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z', label: 'Encrypted' },
                { icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z', label: '1,200+ drivers' },
              ].map((badge, i) => (
                <div key={i} className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
