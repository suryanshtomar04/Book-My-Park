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
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
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
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) { setError('Please fill out all fields.'); return; }
    if (formData.password !== formData.confirmPassword) { setError('Passwords do not match.'); return; }
    if (formData.password.length < 6) { setError('Password must be at least 6 characters long.'); return; }

    setLoading(true);
    try {
      const { confirmPassword, ...submitData } = formData;
      await registerUser(submitData);
      navigate('/login');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || err.message || 'Failed to create an account. Please try again.');
    } finally { setLoading(false); }
  };

  const fields = [
    { id: 'name', label: 'Full Name', type: 'text', placeholder: 'John Doe', autoComplete: 'name' },
    { id: 'email', label: 'Email Address', type: 'email', placeholder: 'you@example.com', autoComplete: 'email' },
    { id: 'password', label: 'Password', type: 'password', placeholder: '••••••••', autoComplete: 'new-password' },
    { id: 'confirmPassword', label: 'Confirm Password', type: 'password', placeholder: '••••••••', autoComplete: 'new-password' },
  ];

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
            <h1 className="text-5xl xl:text-[3.25rem] font-semibold tracking-tight leading-[1.05] mb-6">
              <motion.span 
                initial={{ opacity: 0, y: 15 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ duration: 0.4, ease: 'easeOut' }} 
                className="text-gray-900 block pb-1.5"
              >
                Join thousands
              </motion.span>
              <motion.span 
                initial={{ opacity: 0, y: 15 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ duration: 0.4, delay: 0.1, ease: 'easeOut' }} 
                className="text-blue-600 block"
              >
                of smart parkers.
              </motion.span>
            </h1>
            
            {/* Subtext */}
            <motion.p 
              initial={{ opacity: 0, y: 15 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.4, delay: 0.2, ease: 'easeOut' }}
              className="text-gray-500 text-lg leading-relaxed max-w-md"
            >
              Create your account and start reserving premium spots in under a minute.
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
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center border border-emerald-100/50">
                      <svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-gray-900 text-[15px] font-semibold tracking-tight">Account Created!</p>
                      <p className="text-gray-500 text-[12px] mt-0.5">Welcome to BookMySpace</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {['Instant Booking', 'Secure'].map((tag, i) => (
                      <span key={i} className="px-2.5 py-1 bg-gray-50 border border-gray-200 rounded-md text-gray-600 text-[11px] font-medium tracking-wide">
                        {tag}
                      </span>
                    ))}
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>

            {/* Features */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.4 }}
              className="mt-16 space-y-4"
            >
              {[
                'Instant spot reservation',
                'Real-time availability',
                'Secure digital payments',
              ].map((feature, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-blue-50 border border-blue-100/50 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-3.5 h-3.5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-gray-700 text-[14.5px] font-medium tracking-wide">{feature}</span>
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
                Create account
              </h2>
              <p className="text-gray-500 mt-2 text-[15px] leading-relaxed">Get started with your free account.</p>
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
              {fields.map((field) => (
                <div key={field.id}>
                  <label htmlFor={field.id} className="block text-[13px] font-semibold text-gray-700 mb-2">{field.label}</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <svg className="w-[18px] h-[18px] text-gray-400 group-focus-within:text-blue-600 transition-colors duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={FIELD_ICONS[field.id]} />
                      </svg>
                    </div>
                    <input type={field.type} id={field.id} name={field.id} value={formData[field.id]} onChange={handleChange}
                      placeholder={field.placeholder} autoComplete={field.autoComplete} required
                      className="w-full pl-11 pr-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 placeholder:text-gray-400 focus:placeholder-gray-300 outline-none transition-all duration-200 focus:bg-white focus:border-blue-500 focus:shadow-[0_0_0_3px_rgba(37,99,235,0.1)]"
                    />
                  </div>
                  {field.id === 'password' && formData.password && (
                    <div className="mt-2.5">
                      <div className="flex gap-1.5">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${i <= passwordStrength.level ? passwordStrength.color : 'bg-gray-100'}`} />
                        ))}
                      </div>
                      <p className={`text-[11px] font-semibold mt-1.5 ${passwordStrength.level === 1 ? 'text-red-500' : passwordStrength.level === 2 ? 'text-amber-500' : 'text-emerald-600'}`}>
                        {passwordStrength.label} password
                      </p>
                    </div>
                  )}
                </div>
              ))}

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
                    Creating account...
                  </span>
                ) : 'Create Account'}
              </motion.button>
            </form>

            <div className="flex items-center gap-4 my-7">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest">or</span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            <p className="text-[14px] text-gray-600 text-center">
              Already have an account?{' '}
              <Link to="/login" className="font-semibold text-blue-600 hover:text-blue-700 transition-colors">Sign in</Link>
            </p>

            {/* Trust */}
            <div className="mt-8 flex items-center justify-center gap-7 text-[12px] text-gray-400 font-medium">
              {[
                { icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z', label: 'Secure' },
                { icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z', label: 'Encrypted' },
                { icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z', label: 'No spam. Ever.' },
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
