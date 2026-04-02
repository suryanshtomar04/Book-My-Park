import React, { useState, useEffect, useRef } from 'react';
import Hero from '../components/Hero';
import { Link } from 'react-router-dom';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import FadeIn from '../components/FadeIn';
import AnimatedCounter from '../components/AnimatedCounter';

// ── Fade animation configuration for sections ──
const sectionRevealVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.65, ease: [0.4, 0, 0.2, 1] } 
  }
};

// ── Animated connecting line that draws on scroll ──
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
      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-100/40 via-blue-200/40 to-blue-100/40" />
      {/* Animated drawn line */}
      <motion.div
        style={{ scaleX, opacity, transformOrigin: 'left' }}
        className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 via-blue-500 to-blue-400"
      />
      {/* Glowing tip that follows the line */}
      <motion.div
        style={{
          left: useTransform(scaleX, v => `${v * 100}%`),
          opacity: useTransform(scrollYProgress, [0, 0.05, 0.95, 1], [0, 1, 1, 0]),
        }}
        className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-blue-500 shadow-[0_0_12px_4px_rgba(59,130,246,0.5)]"
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
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] },
  },
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
      <div className="fixed inset-0 bg-white z-0" aria-hidden="true" />
      
      {/* Parallax gradient blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0" aria-hidden="true">
        <motion.div
          style={{ y: blobY1 }}
          className="absolute -top-[10%] -left-[5%] w-[500px] h-[500px] rounded-full bg-gradient-to-br from-blue-200/20 via-blue-300/10 to-transparent blur-[100px] blob-animate"
        />
        <motion.div
          style={{ y: blobY2 }}
          className="absolute top-[25%] -right-[8%] w-[600px] h-[600px] rounded-full bg-gradient-to-bl from-blue-200/15 via-blue-100/10 to-transparent blur-[120px] blob-animate-reverse"
        />
        <motion.div
          style={{ y: blobY3 }}
          className="absolute top-[50%] -left-[10%] w-[550px] h-[550px] rounded-full bg-gradient-to-tr from-blue-200/12 via-blue-100/8 to-transparent blur-[110px] blob-animate-slow"
        />
        <motion.div
          style={{ y: blobY4 }}
          className="absolute top-[70%] right-[5%] w-[450px] h-[450px] rounded-full bg-gradient-to-tl from-blue-200/15 via-blue-100/8 to-transparent blur-[100px] blob-animate"
        />
        <motion.div
          style={{ y: blobY5 }}
          className="absolute top-[90%] left-[30%] w-[500px] h-[500px] rounded-full bg-gradient-to-r from-blue-200/12 via-blue-100/8 to-transparent blur-[130px] blob-animate-reverse"
        />
      </div>

      {/* ══════ NOISE TEXTURE OVERLAY ══════ */}
      <div className="fixed inset-0 noise-texture pointer-events-none z-[1]" aria-hidden="true" />

      {/* ══════ PAGE CONTENT ══════ */}
      <div className="relative z-[2]">
      <Hero />
      
      {/* 1. How It Works Section */}
      <motion.section 
        variants={sectionRevealVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-10%' }}
        className="relative z-10 -mt-12 pt-28 pb-24 sm:pt-32 sm:pb-32 bg-white/80 backdrop-blur-xl rounded-t-[3rem] shadow-[0_-10px_40px_rgba(0,0,0,0.03)] border-t border-white/60"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight sm:text-4xl">How It Works</h2>
            <p className="mt-4 text-lg text-gray-500">Booking your perfect parking spot is just three steps away.</p>
          </FadeIn>
          
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
                      y: -2,
                      boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                    }}
                    transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
                    className="group relative flex flex-col items-center text-center cursor-default rounded-2xl p-8 bg-white border border-black/[0.04] hover:border-gray-200 transition-all duration-300"
                  >
                    {/* Step number badge */}
                    <span className="text-gradient font-bold text-[17px] mb-3 z-10">{item.step}.</span>
                    
                    {/* Icon container with soft gradient glow circle */}
                    <div className="relative mb-6 z-10">
                      <div className="absolute inset-0 -m-4 rounded-full bg-gradient-to-br from-blue-400/10 via-blue-300/8 to-blue-300/5 blur-xl group-hover:from-blue-400/20 group-hover:via-blue-300/15 group-hover:to-blue-300/10 transition-all duration-500" />
                      <div className="absolute inset-0 -m-2 rounded-full bg-gradient-to-tr from-blue-200/0 via-blue-200/0 to-blue-200/0 group-hover:from-blue-200/20 group-hover:via-blue-300/15 group-hover:to-blue-200/20 transition-all duration-500 scale-100 group-hover:scale-110" />
                      
                      <motion.div
                        whileHover={{ scale: 1.08 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                        className="relative w-28 h-28 bg-gradient-to-br from-blue-50 to-blue-100 rounded-full flex items-center justify-center p-4 border border-blue-100/50 group-hover:border-blue-200/80 group-hover:from-blue-100/80 group-hover:to-blue-200/80 transition-all duration-300 ease-out shadow-sm group-hover:shadow-md group-hover:shadow-blue-200/30"
                      >
                        <motion.svg
                          className="w-12 h-12 text-blue-600 group-hover:text-blue-700 transition-colors duration-300"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          whileHover={{ scale: 1.05 }}
                          transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
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
      </motion.section>

      {/* 2. Features Section */}
      <motion.section 
        variants={sectionRevealVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-10%' }}
        className="relative z-20 -mt-12 pt-28 pb-24 sm:pt-32 sm:pb-32 bg-gradient-to-b from-gray-50/90 via-white to-gray-50/60 overflow-hidden rounded-t-[3rem] shadow-[0_-10px_40px_rgba(0,0,0,0.03)] border-t border-white"
      >
        {/* ── Background depth elements ── */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          {/* Large center glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-gradient-to-br from-blue-200/25 via-blue-100/15 to-blue-50/10 rounded-full blur-[120px]" />
          {/* Left accent blob */}
          <div className="absolute top-[20%] -left-[5%] w-[350px] h-[350px] bg-gradient-to-br from-blue-100/20 to-transparent rounded-full blur-[90px]" />
          {/* Right accent blob */}
          <div className="absolute bottom-[15%] -right-[5%] w-[300px] h-[300px] bg-gradient-to-bl from-blue-100/15 to-transparent rounded-full blur-[80px]" />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <FadeIn className="text-center mb-12">
            <h2 className="text-4xl font-extrabold tracking-tight sm:text-5xl mb-1">
              <span className="text-gradient-animated">Premium</span>{' '}
              <span className="text-gray-900">Features</span>
            </h2>
            <p className="mt-4 text-[17px] text-gray-500 max-w-2xl mx-auto leading-relaxed">Everything you need for a seamless parking experience.</p>
          </FadeIn>
          
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.12 } },
            }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5"
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
                  hidden: { opacity: 0, y: 32 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.55, ease: [0.4, 0, 0.2, 1] },
                  },
                }}
              >
                {/* Outer wrapper for gradient border glow on hover */}
                <div className="group relative rounded-2xl p-[1px] transition-all duration-300 h-full">
                  {/* Gradient border glow — visible on hover */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-400/0 via-blue-300/0 to-blue-500/0 group-hover:from-blue-400/40 group-hover:via-blue-300/30 group-hover:to-blue-500/40 transition-all duration-500 opacity-0 group-hover:opacity-100 blur-[1px]" />
                  
                  {/* Card body */}
                  <motion.div
                    whileHover={{ y: -2 }}
                    transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
                    className="relative h-full bg-white/70 backdrop-blur-sm p-8 rounded-2xl border border-black/[0.04] cursor-default
                      shadow-sm
                      hover:shadow-md
                      hover:bg-white/90 hover:border-gray-200
                      transition-all duration-300 ease-out"
                  >
                    {/* Icon */}
                    <motion.div
                      whileHover={{ scale: 1.15, rotate: 6 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                      className="w-14 h-14 rounded-xl flex items-center justify-center mb-5 relative
                        bg-gradient-to-br from-blue-50 to-blue-100 text-blue-600
                        group-hover:from-blue-100 group-hover:to-blue-200
                        group-hover:shadow-lg group-hover:shadow-blue-200/40
                        transition-all duration-300 ease-out"
                    >
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-blue-400/0 to-blue-300/0 group-hover:from-blue-400/15 group-hover:to-blue-300/10 blur-md transition-all duration-500" />
                      <svg className="w-7 h-7 relative z-10 group-hover:text-blue-700 transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={feature.icon} />
                      </svg>
                    </motion.div>
                    
                    <h3 className="text-[18px] font-black text-gray-900 mb-2.5 group-hover:text-gray-800 transition-colors duration-200">{feature.title}</h3>
                    <p className="text-gray-500 text-[15px] leading-relaxed group-hover:text-gray-600 transition-colors duration-200">{feature.desc}</p>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* 3. Why Choose Us */}
      <motion.section 
        variants={sectionRevealVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-10%' }}
        className="relative z-30 -mt-12 pt-28 pb-24 sm:pt-32 sm:pb-32 bg-white/90 backdrop-blur-xl overflow-hidden rounded-t-[3rem] shadow-[0_-10px_40px_rgba(0,0,0,0.03)] border-t border-white/60"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            <FadeIn>
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
                      className="flex items-start group cursor-default"
                    >
                      <motion.div
                        whileHover={{ scale: 1.2 }}
                        className="flex-shrink-0 w-7 h-7 rounded-full bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center mt-0.5 border border-blue-100 group-hover:from-blue-600 group-hover:to-blue-700 transition-all duration-300"
                      >
                        <svg className="w-4 h-4 text-blue-600 group-hover:text-white transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                      </motion.div>
                      <div className="ml-4">
                        <h4 className="text-[17px] font-bold text-gray-900 group-hover:text-blue-700 transition-colors duration-200">{item.title}</h4>
                        <p className="mt-1.5 text-gray-500 text-[14px] leading-relaxed group-hover:text-gray-600 transition-colors duration-200">{item.desc}</p>
                      </div>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </FadeIn>
            
            <FadeIn delay={0.2}>
              <div className="relative lg:h-[540px] hidden sm:block">
                {/* Subtle blur glow behind container */}
                <div className="absolute inset-0 -z-10 blur-2xl opacity-20 bg-blue-200 rounded-2xl" />
                
                {/* Main Image Container */}
                <div className="relative h-full rounded-2xl overflow-hidden shadow-sm border border-black/[0.04] group z-10">
                  <img 
                    src="/images/parking.png"
                    alt="Smart parking overview"
                    className="w-full h-full object-cover rounded-2xl transform group-hover:scale-[1.02] transition-transform duration-300 ease-out"
                  />
                  
                  {/* Premium Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent pointer-events-none rounded-2xl" />
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </motion.section>

      {/* 4. Testimonials (Trust Element) */}
      <motion.section 
        variants={sectionRevealVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-10%' }}
        className="relative z-35 -mt-12 pt-28 pb-20 bg-gray-50/50 backdrop-blur-xl border-t border-gray-200/50 rounded-t-[3rem] shadow-[0_-10px_40px_rgba(0,0,0,0.02)]"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col gap-12">
          <FadeIn>
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Driver Testimonials</h2>
            <p className="mt-3 text-lg text-gray-500 max-w-2xl mx-auto">Don't just take our word for it—see what others are saying.</p>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { text: "I used to waste 20 minutes looking for parking every morning. Now I just book it from bed. Lifesaver.", author: "Sarah M.", role: "Daily Commuter", rating: 5 },
              { text: "The app is incredibly smooth. I drove into the city, parked directly in my spot, and saved a ton compared to garage prices.", author: "James L.", role: "Weekend Traveler", rating: 5 },
              { text: "Perfect for events. I booked a spot right next to the stadium and bypassed all the chaos.", author: "Priya K.", role: "Event Goer", rating: 4.5 },
            ].map((t, idx) => (
              <FadeIn key={idx} delay={idx * 0.1}>
                <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm text-left flex flex-col h-full hover:shadow-md transition-shadow">
                  <div className="flex gap-1 mb-4 text-amber-400">
                    {[...Array(Math.floor(t.rating))].map((_, i) => <svg key={i} className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>)}
                    {t.rating % 1 !== 0 && <svg className="w-4 h-4 opacity-50" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>}
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed mb-6 font-medium italic">"{t.text}"</p>
                  <div className="mt-auto border-t border-gray-100 pt-4 flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center font-bold text-blue-700 text-xs">
                      {t.author.charAt(0)}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-gray-900">{t.author}</div>
                      <div className="text-xs text-gray-500 font-medium">{t.role}</div>
                    </div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </motion.section>

      {/* 4. Combined Impact & CTA Section — Premium Tinted SaaS */}
      <motion.section 
        variants={sectionRevealVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-10%' }}
        className="relative z-40 py-24 bg-gradient-to-b from-white to-blue-50/40 border-t border-blue-50"
      >
        {/* Soft Ambient Overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(99,102,241,0.04)_0%,_transparent_70%)] pointer-events-none" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col gap-12 relative z-10">
          
          {/* HEADER */}
          <FadeIn className="flex flex-col gap-3">
            <p className="text-gray-500 font-semibold uppercase tracking-widest text-sm">Trusted by thousands</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">Our Impact in Numbers</h2>
            <p className="text-gray-500 text-lg max-w-xl mx-auto">Helping drivers find parking faster, smarter, and stress-free.</p>
          </FadeIn>

          {/* STATS */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.12 } },
            }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-6"
          >
            {[
              { end: 1000, label: 'Parking Spaces', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' },
              { end: 500, label: 'Happy Drivers', icon: 'M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
              { end: 50, label: 'Active Cities', icon: 'M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
            ].map((stat, idx) => (
              <motion.div
                key={idx}
                variants={{
                  hidden: { opacity: 0, y: 28 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] },
                  },
                }}
              >
                <div
                  className="bg-white rounded-2xl border border-blue-100 shadow-sm p-6 
                    hover:shadow-md hover:border-blue-200 hover:-translate-y-1 transition-all duration-200"
                >
                  <div className="w-12 h-12 mx-auto rounded-xl bg-blue-50/80 flex items-center justify-center mb-4 transition-colors duration-200">
                    <svg className="w-6 h-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={stat.icon} />
                    </svg>
                  </div>
                  <div className="text-3xl sm:text-[2rem] font-bold text-gray-900 mb-1 tracking-tight">
                    <AnimatedCounter end={stat.end} duration={2000} suffix="+" />
                  </div>
                  <div className="text-gray-500 font-medium text-[15px]">{stat.label}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* CONNECTING TEXT */}
          <FadeIn delay={0.2}>
            <p className="text-[17px] font-medium text-gray-700">
              Join thousands of drivers who trust BookMySpace daily.
            </p>
          </FadeIn>

          {/* CTA FOCAL POINT */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6, delay: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="w-full max-w-3xl mx-auto mt-4"
          >
            <div className="flex flex-col items-center gap-6 bg-white/80 backdrop-blur-sm border border-blue-100 rounded-[2.5rem] shadow-sm p-10 sm:p-14">
              <div className="flex flex-col gap-2">
                <h2 className="text-3xl sm:text-[2.5rem] font-semibold text-gray-900 tracking-tight leading-[1.15]">
                  Find parking <span className="text-blue-600">near you now</span>
                </h2>
                <p className="text-gray-500 text-lg max-w-md mx-auto mt-2">
                  Reserve your spot in seconds. No stress. No waiting.
                </p>
              </div>
              
              <Link 
                to="/explore" 
                className="inline-flex items-center justify-center px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-sm hover:shadow-md transition-all duration-200 focus:outline-none btn-glow hover:scale-[1.01] active:scale-[0.98]"
              >
                Explore Spaces
              </Link>

              {/* TRUST LINE */}
              <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 text-sm font-medium text-gray-400 mt-2">
                {[
                  { label: 'No hidden fees' },
                  { label: 'Instant booking' },
                  { label: 'Secure platform' },
                ].map((badge, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="text-blue-500 font-bold">✓</span>
                    {badge.label}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

        </div>
      </motion.section>

      {/* 6. Footer — Premium Finish */}
      <motion.footer 
        variants={sectionRevealVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-10%' }}
        className="relative z-[60] -mt-12 bg-white/95 backdrop-blur-xl pt-24 pb-12 rounded-t-[3rem] shadow-[0_-10px_40px_rgba(0,0,0,0.05)] border-t border-white/80"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center">
          
          <FadeIn>
            <motion.div 
              whileHover={{ scale: 1.02 }} 
              className="text-[22px] font-bold tracking-tight cursor-pointer mb-8"
            >
              <Link to="/" className="text-gradient">BookMySpace</Link>
            </motion.div>
          </FadeIn>

          <FadeIn delay={0.1}>
            <ul className="flex flex-wrap justify-center gap-x-10 gap-y-4 mb-12 text-[14px] font-semibold tracking-wide text-gray-400">
              {[
                { to: '/', label: 'Home' },
                { to: '/explore', label: 'Explore' },
                { to: '/dashboard', label: 'Dashboard' },
                { href: '#', label: 'About Us' },
                { href: '#', label: 'Contact' },
              ].map((link, idx) => (
                <motion.li 
                  key={idx}
                  whileHover={{ y: -2 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                >
                  {link.to ? (
                    <Link to={link.to} className="hover:text-blue-600 transition-all duration-200 ease-out link-underline hover-text-glow">{link.label}</Link>
                  ) : (
                    <a href={link.href} className="hover:text-blue-600 transition-all duration-200 ease-out link-underline hover-text-glow">{link.label}</a>
                  )}
                </motion.li>
              ))}
            </ul>
          </FadeIn>

          <FadeIn delay={0.2}>
            <div className="w-full max-w-[800px] mx-auto h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent mb-8"></div>
            
            <p className="text-[13px] font-medium text-gray-400 tracking-wide text-center">
              &copy; {new Date().getFullYear()} BookMySpace Platform. All rights reserved.
            </p>
          </FadeIn>
        </div>
      </motion.footer>
      </div> {/* end content wrapper */}
    </div>
  );
}
