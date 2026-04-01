import React, { useState, useEffect, useRef } from 'react';
import Hero from '../components/Hero';
import { Link } from 'react-router-dom';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';

// Viewport fade-in wrapper
const FadeInView = ({ children, className = '', delay = 0 }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });
  
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.6, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Animated connecting line that draws on scroll
const ScrollDrawLine = () => {
  const lineRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: lineRef,
    offset: ['start 0.8', 'end 0.4'],
  });
  const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.1], [0, 1]);

  return (
    <div
      ref={lineRef}
      className="hidden md:block absolute top-[5.5rem] left-[15%] right-[15%] h-[2.5px]"
      aria-hidden="true"
    >
      {/* Static faint track */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-100/40 via-purple-100/40 to-blue-100/40" />
      {/* Animated drawn line */}
      <motion.div
        style={{ scaleX, opacity, transformOrigin: 'left' }}
        className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400"
      />
      {/* Glowing tip that follows the line */}
      <motion.div
        style={{
          left: useTransform(scaleX, v => `${v * 100}%`),
          opacity: useTransform(scrollYProgress, [0, 0.05, 0.95, 1], [0, 1, 1, 0]),
        }}
        className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-purple-400 shadow-[0_0_12px_4px_rgba(139,92,246,0.5)]"
      />
    </div>
  );
};

// Step card variants for stagger animation
const stepContainerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.18 },
  },
};

const stepCardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

const StatCounter = ({ end, duration = 2000, suffix = "+" }) => {
  const [count, setCount] = useState(0);
  const counterRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          let startTimestamp = null;
          const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const easeProgress = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(easeProgress * end));
            if (progress < 1) {
              window.requestAnimationFrame(step);
            }
          };
          window.requestAnimationFrame(step);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (counterRef.current) observer.observe(counterRef.current);
    return () => observer.disconnect();
  }, [end, duration]);

  return <span ref={counterRef}>{count}{count === end ? suffix : ''}</span>;
};

export default function Home() {
  const stepsRef = useRef(null);
  const stepsInView = useInView(stepsRef, { once: true, margin: '-80px' });

  // Parallax: blobs move at ~50% of scroll speed
  const { scrollY } = useScroll();
  const blobY1 = useTransform(scrollY, [0, 3000], [0, -400]);
  const blobY2 = useTransform(scrollY, [0, 3000], [0, -300]);
  const blobY3 = useTransform(scrollY, [0, 3000], [0, -500]);
  const blobY4 = useTransform(scrollY, [0, 3000], [0, -350]);
  const blobY5 = useTransform(scrollY, [0, 3000], [0, -250]);

  return (
    <div className="flex flex-col min-h-screen relative">
      
      {/* ══════ ALIVE BACKGROUND LAYER ══════ */}
      {/* White base — prevents dark body bleed-through */}
      <div className="fixed inset-0 bg-white z-0" aria-hidden="true" />
      
      {/* Parallax gradient blobs — float on top of white base */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0" aria-hidden="true">
        {/* Blob 1 — top-left blue (behind hero) */}
        <motion.div
          style={{ y: blobY1 }}
          className="absolute -top-[10%] -left-[5%] w-[500px] h-[500px] rounded-full bg-gradient-to-br from-blue-200/20 via-blue-300/10 to-transparent blur-[100px] blob-animate"
        />
        {/* Blob 2 — right-center purple (behind How It Works) */}
        <motion.div
          style={{ y: blobY2 }}
          className="absolute top-[25%] -right-[8%] w-[600px] h-[600px] rounded-full bg-gradient-to-bl from-purple-200/15 via-indigo-200/10 to-transparent blur-[120px] blob-animate-reverse"
        />
        {/* Blob 3 — center-left indigo (behind Features) */}
        <motion.div
          style={{ y: blobY3 }}
          className="absolute top-[50%] -left-[10%] w-[550px] h-[550px] rounded-full bg-gradient-to-tr from-indigo-200/12 via-blue-100/8 to-transparent blur-[110px] blob-animate-slow"
        />
        {/* Blob 4 — bottom-right blue (behind Why Choose Us) */}
        <motion.div
          style={{ y: blobY4 }}
          className="absolute top-[70%] right-[5%] w-[450px] h-[450px] rounded-full bg-gradient-to-tl from-blue-200/15 via-purple-100/8 to-transparent blur-[100px] blob-animate"
        />
        {/* Blob 5 — bottom-center purple (behind CTA) */}
        <motion.div
          style={{ y: blobY5 }}
          className="absolute top-[90%] left-[30%] w-[500px] h-[500px] rounded-full bg-gradient-to-r from-purple-200/12 via-blue-200/8 to-transparent blur-[130px] blob-animate-reverse"
        />
      </div>

      {/* ══════ NOISE TEXTURE OVERLAY ══════ */}
      {/* Very light grain over the entire page for depth — 2.5% opacity */}
      <div className="fixed inset-0 noise-texture pointer-events-none z-[1]" aria-hidden="true" />

      {/* ══════ PAGE CONTENT ══════ */}
      <div className="relative z-[2]">
      <Hero />
      
      {/* 1. How It Works Section */}
      <section className="py-24 sm:py-32 bg-white/80 backdrop-blur-[1px]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeInView className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight sm:text-4xl">How It Works</h2>
            <p className="mt-4 text-lg text-gray-500">Booking your perfect parking spot is just three steps away.</p>
          </FadeInView>
          
          <div className="relative">
            {/* Scroll-driven animated connecting line */}
            <ScrollDrawLine />
            
            <motion.div
              ref={stepsRef}
              variants={stepContainerVariants}
              initial="hidden"
              animate={stepsInView ? 'visible' : 'hidden'}
              className="grid grid-cols-1 md:grid-cols-3 gap-10"
            >
              {[
                { step: '1', icon: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z', title: 'Search parking near you', desc: 'Find available spaces in real-time based on your current location or destination.' },
                { step: '2', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z', title: 'Book instantly', desc: 'Reserve your spot securely via our platform. No physical cash, no waiting.' },
                { step: '3', icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z', title: 'Park stress-free', desc: 'Navigate directly to your reserved space. Your spot is guaranteed upon arrival.' },
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  variants={stepCardVariants}
                >
                  <motion.div
                    whileHover={{
                      scale: 1.03,
                      y: -6,
                      boxShadow: '0 20px 50px -12px rgba(99, 102, 241, 0.15), 0 0 0 1px rgba(99, 102, 241, 0.08)',
                    }}
                    transition={{ type: 'spring', stiffness: 350, damping: 28 }}
                    className="group relative flex flex-col items-center text-center cursor-default rounded-2xl p-8 bg-white border border-transparent hover:border-blue-100/60"
                  >
                    {/* Step number badge */}
                    <span className="text-gradient font-bold text-[17px] mb-3 z-10">{item.step}.</span>
                    
                    {/* Icon container with soft gradient glow circle */}
                    <div className="relative mb-6 z-10">
                      {/* Outer glow — soft blue/purple radial gradient */}
                      <div className="absolute inset-0 -m-4 rounded-full bg-gradient-to-br from-blue-400/10 via-purple-400/8 to-blue-300/5 blur-xl group-hover:from-blue-400/20 group-hover:via-purple-400/15 group-hover:to-blue-300/10 transition-all duration-500" />
                      {/* Secondary animated glow ring */}
                      <div className="absolute inset-0 -m-2 rounded-full bg-gradient-to-tr from-blue-200/0 via-purple-200/0 to-blue-200/0 group-hover:from-blue-200/20 group-hover:via-purple-300/15 group-hover:to-blue-200/20 transition-all duration-500 scale-100 group-hover:scale-110" />
                      
                      <motion.div
                        whileHover={{ scale: 1.08 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                        className="relative w-28 h-28 bg-gradient-to-br from-blue-50 to-purple-50 rounded-full flex items-center justify-center p-4 border border-blue-100/50 group-hover:border-blue-200/80 group-hover:from-blue-100/80 group-hover:to-purple-100/80 transition-all duration-300 ease-out shadow-sm group-hover:shadow-md group-hover:shadow-blue-200/30"
                      >
                        <motion.svg
                          className="w-12 h-12 text-blue-600 group-hover:text-blue-700 transition-colors duration-300"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          whileHover={{ scale: 1.12 }}
                          transition={{ type: 'spring', stiffness: 500, damping: 15 }}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={item.icon} />
                        </motion.svg>
                      </motion.div>
                    </div>
                    
                    <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-gray-800 transition-colors duration-200">{item.title}</h3>
                    <p className="text-gray-500 leading-relaxed px-4 group-hover:text-gray-600 transition-colors duration-200">{item.desc}</p>
                  </motion.div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* 2. Features Section */}
      <section className="py-24 sm:py-32 bg-gradient-to-b from-gray-50 via-gray-50 to-white relative overflow-hidden">
        {/* Ambient background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-blue-200/20 via-purple-200/10 to-transparent rounded-full blur-[120px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <FadeInView className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight sm:text-4xl">Premium Features</h2>
            <p className="mt-4 text-lg text-gray-500">Everything you need for a seamless parking experience.</p>
          </FadeInView>
          
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.15 } },
            }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {[
              { icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z', title: 'Real-time availability', desc: 'See parking spaces as they become available. Never drive around the block looking again.' },
              { icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z', title: 'Secure booking', desc: 'All payments are encrypted and strictly protected. Your private spot is guaranteed.' },
              { icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z', title: 'Affordable pricing', desc: 'Compare prices up front and choose exactly what fits your daily parking budget.' },
              { icon: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0zM15 11a3 3 0 11-6 0 3 3 0 016 0z', title: 'Smart location detection', desc: 'Instantly spot the perfect place nearby to minimize driving time significantly.' },
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
                  },
                }}
              >
                {/* Outer wrapper for gradient border glow on hover */}
                <div className="group relative rounded-[1.5rem] p-[1px] transition-all duration-300">
                  {/* Gradient border glow — hidden by default, visible on hover */}
                  <div className="absolute inset-0 rounded-[1.5rem] bg-gradient-to-br from-blue-400/0 via-purple-400/0 to-blue-500/0 group-hover:from-blue-400/40 group-hover:via-purple-400/30 group-hover:to-blue-500/40 transition-all duration-500 opacity-0 group-hover:opacity-100 blur-[1px]" />
                  
                  {/* Card body — glass + depth */}
                  <motion.div
                    whileHover={{ y: -8 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                    className="relative bg-white/60 backdrop-blur-sm p-7 rounded-[1.5rem] border border-white/40 shadow-sm cursor-default
                      hover:shadow-[0_20px_60px_-15px_rgba(99,102,241,0.18),_0_8px_24px_-8px_rgba(0,0,0,0.06)]
                      hover:bg-white/80 hover:border-white/60
                      transition-all duration-300 ease-out"
                  >
                    {/* Icon with rotation + scale on hover */}
                    <motion.div
                      whileHover={{ scale: 1.18, rotate: 8 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                      className="w-14 h-14 rounded-xl flex items-center justify-center mb-6 relative
                        bg-gradient-to-br from-blue-50 to-purple-50 text-blue-600
                        group-hover:from-blue-100 group-hover:to-purple-100
                        group-hover:shadow-lg group-hover:shadow-blue-200/40
                        transition-all duration-300 ease-out"
                    >
                      {/* Subtle glow behind icon */}
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-blue-400/0 to-purple-400/0 group-hover:from-blue-400/15 group-hover:to-purple-400/10 blur-md transition-all duration-500" />
                      <svg className="w-7 h-7 relative z-10 group-hover:text-blue-700 transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={feature.icon} />
                      </svg>
                    </motion.div>
                    
                    <h3 className="text-[17px] font-extrabold text-gray-900 mb-3 group-hover:text-gray-800 transition-colors duration-200">{feature.title}</h3>
                    <p className="text-gray-500 text-[14px] leading-relaxed group-hover:text-gray-600 transition-colors duration-200">{feature.desc}</p>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 3. Why Choose Us */}
      <section className="py-24 sm:py-32 bg-white/80 backdrop-blur-[1px] overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            <FadeInView>
              <div>
                <h2 className="text-3xl font-bold text-gray-900 tracking-tight sm:text-4xl leading-tight mb-6">
                  Why Choose<br/><span className="text-gradient">BookMySpace</span>?
                </h2>
                <p className="text-[17px] text-gray-500 mb-10 leading-relaxed">
                  We're eliminating the headache of urban parking. Our smart platform connects drivers with premium, available spaces faster than ever before.
                </p>
                
                <ul className="space-y-6">
                  {[
                    { title: "Saves time", desc: "No more circling blocks looking for an empty space." },
                    { title: "Avoids parking hassle", desc: "Reserved spots mean guaranteed entry upon arrival." },
                    { title: "Works anywhere", desc: "Available across major cities with new hubs daily." },
                    { title: "Easy to use", desc: "Clean mobile-friendly interface designed for speed." }
                  ].map((item, idx) => (
                    <motion.li
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: idx * 0.1 }}
                      className="flex items-start group"
                    >
                      <motion.div
                        whileHover={{ scale: 1.2 }}
                        className="flex-shrink-0 w-7 h-7 rounded-full bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center mt-0.5 border border-blue-100 group-hover:from-blue-600 group-hover:to-purple-600 transition-all duration-300"
                      >
                        <svg className="w-4 h-4 text-blue-600 group-hover:text-white transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                      </motion.div>
                      <div className="ml-4">
                        <h4 className="text-[17px] font-bold text-gray-900">{item.title}</h4>
                        <p className="mt-1.5 text-gray-500 text-[14px] leading-relaxed">{item.desc}</p>
                      </div>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </FadeInView>
            
            <FadeInView delay={0.2}>
              <div className="relative rounded-[2rem] overflow-hidden shadow-2xl lg:h-[540px] hidden sm:block group">
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/20 to-purple-500/10 mix-blend-multiply rounded-[2rem] z-10 w-full h-full"></div>
                <img 
                  src="https://images.unsplash.com/photo-1548345680-f5475ea90f46?q=80&w=1200&auto=format&fit=crop" 
                  alt="Parking Experience" 
                  className="w-full h-full object-cover rounded-[2rem] transform group-hover:scale-105 transition-transform duration-[2000ms] ease-out"
                />
              </div>
            </FadeInView>
          </div>
        </div>
      </section>

      {/* 4. Stats Section */}
      <section className="py-16 sm:py-20 bg-gradient-to-r from-blue-600 via-blue-600 to-purple-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center divide-y sm:divide-y-0 sm:divide-x divide-blue-400/30">
            {[
              { end: 1000, label: 'Parking Spaces' },
              { end: 500, label: 'Happy Drivers' },
              { end: 50, label: 'Active Cities' },
            ].map((stat, idx) => (
              <FadeInView key={idx} delay={idx * 0.15}>
                <div className="py-4 sm:py-0 flex flex-col items-center">
                  <div className="text-4xl sm:text-[2.75rem] font-extrabold text-white mb-2 tracking-tight">
                    <StatCounter end={stat.end} duration={2000} />
                  </div>
                  <div className="text-blue-100 font-medium tracking-widest uppercase text-[12px]">{stat.label}</div>
                </div>
              </FadeInView>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Call To Action */}
      <section className="py-24 sm:py-32 bg-gradient-to-r from-blue-50 via-purple-50/30 to-blue-100 text-center relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-2xl h-full bg-white/30 blur-[100px] rounded-full pointer-events-none"></div>
        
        <FadeInView className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <h2 className="text-5xl font-black text-gray-900 tracking-tight sm:text-6xl md:text-[4rem] mb-6 leading-tight">Find parking near you now</h2>
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed font-medium">
            Join thousands of smart drivers who reserve their perfect parking spots ahead of time. Stop searching, start arriving.
          </p>
          <motion.div whileHover={{ scale: 1.04, y: -3 }} whileTap={{ scale: 0.97 }} className="inline-block">
            <Link 
              to="/explore" 
              className="inline-flex items-center justify-center px-10 py-5 sm:px-12 sm:py-5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-[20px] font-bold rounded-full transition-all duration-200 ease-out shadow-[0_10px_30px_rgb(37,99,235,0.3)] hover:shadow-[0_15px_40px_rgb(37,99,235,0.4)] group btn-ripple"
            >
              Explore Spaces
              <svg className="ml-3 w-6 h-6 group-hover:translate-x-1.5 transition-transform duration-300 text-blue-100" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </motion.div>
          
          <p className="mt-8 text-[13px] font-bold text-blue-800/50 uppercase tracking-[0.2em]">
            No fees • Instant booking • Secure
          </p>
        </FadeInView>
      </section>

      {/* 6. Footer */}
      <footer className="bg-white/90 backdrop-blur-[1px] border-t border-gray-100 pt-20 pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center">
          
          <motion.div whileHover={{ scale: 1.05 }} className="text-[22px] font-bold tracking-tight cursor-pointer mb-8">
            <Link to="/" className="text-gradient">BookMySpace</Link>
          </motion.div>
          
          <ul className="flex flex-wrap justify-center gap-x-10 gap-y-4 mb-12 text-[14px] font-semibold tracking-wide text-gray-500">
            {[
              { to: '/', label: 'Home' },
              { to: '/explore', label: 'Explore' },
              { to: '/dashboard', label: 'Dashboard' },
              { href: '#', label: 'About Us' },
              { href: '#', label: 'Contact' },
            ].map((link, idx) => (
              <li key={idx}>
                {link.to ? (
                  <Link to={link.to} className="hover:text-blue-600 transition-colors duration-150 ease-out">{link.label}</Link>
                ) : (
                  <a href={link.href} className="hover:text-blue-600 transition-colors duration-150 ease-out">{link.label}</a>
                )}
              </li>
            ))}
          </ul>

          <div className="w-full max-w-[800px] mx-auto h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent mb-8"></div>
          
          <p className="text-[13px] font-medium text-gray-400 tracking-wide text-center">
            &copy; {new Date().getFullYear()} BookMySpace Platform. All rights reserved.
          </p>
        </div>
      </footer>
      </div> {/* end content wrapper */}
    </div>
  );
}
