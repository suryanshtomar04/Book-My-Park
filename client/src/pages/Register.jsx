import React, { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../services/api';
import { motion } from 'framer-motion';

function getPasswordStrength(password) {
  if (!password) return { level: 0, label: '', color: '' };
  let score = 0;
  if (password.length >= 6) score++;
  if (password.length >= 10) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  if (score <= 1) return { level: 1, label: 'Weak', color: 'bg-red-400' };
  if (score <= 3) return { level: 2, label: 'Medium', color: 'bg-amber-400' };
  return { level: 3, label: 'Strong', color: 'bg-emerald-500' };
}

const FIELD_ICONS = {
  name: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
  email: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
  password: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z',
  confirmPassword: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
};

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
  const passwordStrength = useMemo(() => getPasswordStrength(formData.password), [formData.password]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
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
      const { confirmPassword, ...submitData } = formData;
      await registerUser(submitData);
      navigate('/login');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || err.message || 'Failed to create an account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { id: 'name', label: 'Full Name', type: 'text', placeholder: 'John Doe', autoComplete: 'name' },
    { id: 'email', label: 'Email Address', type: 'email', placeholder: 'you@example.com', autoComplete: 'email' },
    { id: 'password', label: 'Password', type: 'password', placeholder: '••••••••', autoComplete: 'new-password' },
    { id: 'confirmPassword', label: 'Confirm Password', type: 'password', placeholder: '••••••••', autoComplete: 'new-password' },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">

      {/* Full-width seamless gradient background */}
      <div className="absolute inset-0" style={{
        background: 'linear-gradient(to right, #4338ca 0%, #4f46e5 20%, #6366f1 35%, rgba(224,231,255,0.85) 58%, rgba(238,242,255,0.5) 72%, rgba(248,250,255,1) 88%, #f8faff 100%)'
      }} />

      {/* Radial glow on left */}
      <div className="absolute inset-0" style={{
        background: 'radial-gradient(ellipse at 22% 38%, rgba(255,255,255,0.12), transparent 50%)'
      }} />

      {/* Noise texture */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
      }} />

      {/* Floating blurs */}
      <div className="absolute top-[8%] left-[8%] w-80 h-80 bg-white/[0.06] rounded-full blur-3xl" />
      <div className="absolute bottom-[12%] left-[18%] w-96 h-96 bg-purple-400/[0.08] rounded-full blur-3xl" />
      <div className="absolute top-[45%] left-[28%] w-60 h-60 bg-blue-300/[0.06] rounded-full blur-3xl" />

      {/* Glow bridge */}
      <div className="hidden lg:block absolute left-[42%] top-0 h-full w-[280px] bg-gradient-to-r from-transparent via-white/30 to-transparent blur-2xl pointer-events-none z-[1]" />

      {/* Grid pattern on left half */}
      <div className="absolute top-0 left-0 w-[55%] h-full opacity-[0.02]" style={{
        backgroundImage: 'linear-gradient(rgba(255,255,255,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.2) 1px, transparent 1px)',
        backgroundSize: '64px 64px'
      }} />

      {/* Content layer */}
      <div className="relative z-10 min-h-screen flex">

        {/* LEFT — Branding */}
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
                Join thousands<br />
                <span className="text-white/50">of smart parkers.</span>
              </h1>
              <p className="text-white/40 text-[17px] leading-relaxed max-w-sm">
                Create your account and start reserving premium spots in under a minute.
              </p>
            </motion.div>

            {/* Floating mock card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="mt-14"
            >
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
                className="bg-white/[0.07] backdrop-blur-xl rounded-2xl border border-white/[0.08] p-5 max-w-[260px] shadow-2xl shadow-black/15"
                style={{ transform: 'rotate(2deg)' }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-emerald-400/20 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-white/85 text-sm font-semibold">Account Created!</p>
                    <p className="text-white/35 text-[11px]">Welcome to BookMySpace</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  {['Instant Booking', 'Secure'].map((tag, i) => (
                    <span key={i} className="px-2.5 py-1 bg-white/[0.05] border border-white/[0.06] rounded-md text-white/45 text-[10px] font-medium">{tag}</span>
                  ))}
                </div>
              </motion.div>
            </motion.div>

            {/* Feature list */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.35 }}
              className="mt-14 space-y-3.5"
            >
              {[
                'Instant spot reservation',
                'Real-time availability',
                'Secure digital payments',
              ].map((feature, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-white/[0.07] rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-3 h-3 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-white/40 text-[13px] font-medium">{feature}</span>
                </div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* RIGHT — Form Panel */}
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
                Create account
              </h2>
              <p className="text-gray-500 mt-1.5 text-[15px]">Get started with your free account.</p>
            </div>

            {/* Card */}
            <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/60 p-7 sm:p-8 transition-all duration-300 hover:-translate-y-0.5"
              style={{ boxShadow: '0 10px 40px rgba(0,0,0,0.06), 0 2px 8px rgba(0,0,0,0.03), 0 0 0 1px rgba(0,0,0,0.02)' }}
            >

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

              <form onSubmit={handleSubmit} className="space-y-4">
                {fields.map((field) => (
                  <div key={field.id}>
                    <label htmlFor={field.id} className="block text-[13px] font-medium text-gray-600 mb-2">
                      {field.label}
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                        <svg className="w-[18px] h-[18px] text-gray-400 group-focus-within:text-blue-500 transition-colors duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={FIELD_ICONS[field.id]} />
                        </svg>
                      </div>
                      <input
                        type={field.type}
                        id={field.id}
                        name={field.id}
                        value={formData[field.id]}
                        onChange={handleChange}
                        placeholder={field.placeholder}
                        autoComplete={field.autoComplete}
                        required
                        className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/60 border border-gray-200/70 text-gray-900 placeholder:text-gray-400 outline-none transition-all duration-200 shadow-[inset_0_1px_2px_rgba(0,0,0,0.03)] focus:border-blue-500 focus:bg-white focus:shadow-[0_0_0_4px_rgba(59,130,246,0.08)]"
                      />
                    </div>

                    {/* Password strength */}
                    {field.id === 'password' && formData.password && (
                      <div className="mt-2.5">
                        <div className="flex gap-1.5">
                          {[1, 2, 3].map((i) => (
                            <div
                              key={i}
                              className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                                i <= passwordStrength.level ? passwordStrength.color : 'bg-gray-200/60'
                              }`}
                            />
                          ))}
                        </div>
                        <p className={`text-[11px] font-medium mt-1 ${
                          passwordStrength.level === 1 ? 'text-red-500' :
                          passwordStrength.level === 2 ? 'text-amber-500' : 'text-emerald-600'
                        }`}>
                          {passwordStrength.label} password
                        </p>
                      </div>
                    )}
                  </div>
                ))}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full px-5 py-3 mt-1 text-white text-[15px] font-medium rounded-xl focus:outline-none transition-all duration-200 active:scale-[0.98]
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
                      Creating account...
                    </span>
                  ) : 'Create Account'}
                </button>
              </form>

              {/* Divider */}
              <div className="flex items-center gap-4 my-6">
                <div className="flex-1 h-px bg-gray-200/50" />
                <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest">or</span>
                <div className="flex-1 h-px bg-gray-200/50" />
              </div>

              {/* Login link */}
              <p className="text-[14px] text-gray-500 text-center">
                Already have an account?{' '}
                <Link to="/login" className="font-semibold text-blue-600 hover:text-blue-700 transition-colors">
                  Sign in
                </Link>
              </p>
            </div>

            {/* Trust badges */}
            <div className="mt-7 flex items-center justify-center gap-6 text-[12px] text-gray-400 font-medium">
              {[
                { icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z', label: 'Secure' },
                { icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z', label: 'Encrypted' },
                { icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z', label: 'No spam. Ever.' },
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
