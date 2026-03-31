import React, { useState, useEffect, useRef } from 'react';
import Hero from '../components/Hero';
import { Link } from 'react-router-dom';

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
            const easeProgress = 1 - Math.pow(1 - progress, 3); // easeOutCubic
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
  return (
    <div className="flex flex-col min-h-screen">
      <Hero />
      
      {/* 1. How It Works Section */}
      <section className="py-24 sm:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight sm:text-4xl">How It Works</h2>
            <p className="mt-4 text-lg text-gray-500">Booking your perfect parking spot is just three steps away.</p>
          </div>
          
          <div className="relative">
            {/* Connecting Line (Desktop only) */}
            <div className="hidden md:block absolute top-[5.5rem] left-[15%] right-[15%] h-[2px] bg-gray-100" aria-hidden="true" />
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {/* Step 1 */}
              <div className="relative flex flex-col items-center text-center group hover:scale-105 transition-transform duration-300 ease-out cursor-default">
                <span className="text-blue-600 font-bold text-[17px] mb-3 z-10">1.</span>
                <div className="w-28 h-28 bg-blue-50 rounded-full flex items-center justify-center p-4 z-10 mb-6 group-hover:bg-blue-100 transition-colors duration-300 ease-out">
                  <svg className="w-12 h-12 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Search parking near you</h3>
                <p className="text-gray-500 leading-relaxed px-4">Find available spaces in real-time based on your current location or destination.</p>
              </div>
              
              {/* Step 2 */}
              <div className="relative flex flex-col items-center text-center group hover:scale-105 transition-transform duration-300 ease-out cursor-default">
                <span className="text-blue-600 font-bold text-[17px] mb-3 z-10">2.</span>
                <div className="w-28 h-28 bg-blue-50 rounded-full flex items-center justify-center p-4 z-10 mb-6 group-hover:bg-blue-100 transition-colors duration-300 ease-out">
                  <svg className="w-12 h-12 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Book instantly</h3>
                <p className="text-gray-500 leading-relaxed px-4">Reserve your spot securely via our platform. No physical cash, no waiting.</p>
              </div>

              {/* Step 3 */}
              <div className="relative flex flex-col items-center text-center group hover:scale-105 transition-transform duration-300 ease-out cursor-default">
                <span className="text-blue-600 font-bold text-[17px] mb-3 z-10">3.</span>
                <div className="w-28 h-28 bg-blue-50 rounded-full flex items-center justify-center p-4 z-10 mb-6 group-hover:bg-blue-100 transition-colors duration-300 ease-out">
                  <svg className="w-12 h-12 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Park stress-free</h3>
                <p className="text-gray-500 leading-relaxed px-4">Navigate directly to your reserved space. Your spot is guaranteed upon arrival.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Features Section */}
      <section className="py-24 sm:py-32 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight sm:text-4xl">Premium Features</h2>
            <p className="mt-4 text-lg text-gray-500">Everything you need for a seamless parking experience.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Feature 1 */}
            <div className="bg-white p-7 rounded-[1.5rem] shadow-sm border border-gray-100 hover:shadow-xl hover:border-blue-300 hover:-translate-y-1 transition-all duration-200 ease-out group">
              <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-200 ease-out">
                <svg className="w-7 h-7 currentColor" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-[17px] font-extrabold text-gray-900 mb-3">Real-time availability</h3>
              <p className="text-gray-500 text-[14px] leading-relaxed">See parking spaces as they become available. Never drive around the block looking again.</p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-7 rounded-[1.5rem] shadow-sm border border-gray-100 hover:shadow-xl hover:border-blue-300 hover:-translate-y-1 transition-all duration-200 ease-out group">
              <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-200 ease-out">
                <svg className="w-7 h-7 currentColor" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-[17px] font-extrabold text-gray-900 mb-3">Secure booking</h3>
              <p className="text-gray-500 text-[14px] leading-relaxed">All payments are encrypted and strictly protected. Your private spot is guaranteed.</p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-7 rounded-[1.5rem] shadow-sm border border-gray-100 hover:shadow-xl hover:border-blue-300 hover:-translate-y-1 transition-all duration-200 ease-out group">
              <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-200 ease-out">
                <svg className="w-7 h-7 currentColor" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-[17px] font-extrabold text-gray-900 mb-3">Affordable pricing</h3>
              <p className="text-gray-500 text-[14px] leading-relaxed">Compare prices up front and choose exactly what fits your daily parking budget.</p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white p-7 rounded-[1.5rem] shadow-sm border border-gray-100 hover:shadow-xl hover:border-blue-300 hover:-translate-y-1 transition-all duration-200 ease-out group">
              <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-200 ease-out">
                <svg className="w-7 h-7 currentColor" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0zM15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-[17px] font-extrabold text-gray-900 mb-3">Smart location detection</h3>
              <p className="text-gray-500 text-[14px] leading-relaxed">Instantly spot the perfect place nearby to minimize driving time significantly.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Why Choose Us */}
      <section className="py-24 sm:py-32 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            {/* Left Content */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 tracking-tight sm:text-4xl leading-tight mb-6">
                Why Choose<br/>BookMySpace?
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
                  <li key={idx} className="flex items-start group">
                    <div className="flex-shrink-0 w-7 h-7 rounded-full bg-blue-50/80 flex items-center justify-center mt-0.5 border border-blue-100 group-hover:bg-blue-600 transition-colors duration-300">
                      <svg className="w-4 h-4 text-blue-600 group-hover:text-white transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <h4 className="text-[17px] font-bold text-gray-900">{item.title}</h4>
                      <p className="mt-1.5 text-gray-500 text-[14px] leading-relaxed">{item.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Right Side Visual Highlight */}
            <div className="relative rounded-[2rem] overflow-hidden shadow-2xl lg:h-[540px] hidden sm:block">
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/20 to-transparent mix-blend-multiply rounded-[2rem] z-10 w-full h-full"></div>
              <img 
                src="https://images.unsplash.com/photo-1548345680-f5475ea90f46?q=80&w=1200&auto=format&fit=crop" 
                alt="Parking Experience" 
                className="w-full h-full object-cover rounded-[2rem] transform hover:scale-105 transition-transform duration-[2000ms] ease-out"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 4. Stats Section */}
      <section className="py-16 sm:py-20 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center divide-y sm:divide-y-0 sm:divide-x divide-blue-400/30">
            <div className="py-4 sm:py-0 flex flex-col items-center">
              <div className="text-4xl sm:text-[2.75rem] font-extrabold text-white mb-2 tracking-tight">
                <StatCounter end={1000} duration={2000} />
              </div>
              <div className="text-blue-100 font-medium tracking-widest uppercase text-[12px]">Parking Spaces</div>
            </div>
            <div className="py-4 sm:py-0 flex flex-col items-center">
              <div className="text-4xl sm:text-[2.75rem] font-extrabold text-white mb-2 tracking-tight">
                <StatCounter end={500} duration={2000} />
              </div>
              <div className="text-blue-100 font-medium tracking-widest uppercase text-[12px]">Happy Drivers</div>
            </div>
            <div className="py-4 sm:py-0 flex flex-col items-center">
              <div className="text-4xl sm:text-[2.75rem] font-extrabold text-white mb-2 tracking-tight">
                <StatCounter end={50} duration={2000} />
              </div>
              <div className="text-blue-100 font-medium tracking-widest uppercase text-[12px]">Active Cities</div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Call To Action */}
      <section className="py-24 sm:py-32 bg-gradient-to-r from-blue-50 to-blue-100 text-center relative overflow-hidden">
        {/* Subtle background glow effect over gradient */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-2xl h-full bg-white/30 blur-[100px] rounded-full pointer-events-none"></div>
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <h2 className="text-5xl font-black text-gray-900 tracking-tight sm:text-6xl md:text-[4rem] mb-6 leading-tight">Find parking near you now</h2>
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed font-medium">
            Join thousands of smart drivers who reserve their perfect parking spots ahead of time. Stop searching, start arriving.
          </p>
          <Link 
            to="/explore" 
            className="inline-flex items-center justify-center px-10 py-5 sm:px-12 sm:py-5 bg-blue-600 hover:brightness-95 text-white text-[20px] font-bold rounded-full transition-all duration-200 ease-out shadow-[0_10px_30px_rgb(37,99,235,0.3)] hover:shadow-[0_15px_40px_rgb(37,99,235,0.4)] group hover:-translate-y-1"
          >
            Explore Spaces
            <svg className="ml-3 w-6 h-6 group-hover:translate-x-1.5 transition-transform duration-300 text-blue-100" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
          
          {/* Trust Text */}
          <p className="mt-8 text-[13px] font-bold text-blue-800/50 uppercase tracking-[0.2em]">
            No fees • Instant booking • Secure
          </p>
        </div>
      </section>

      {/* 6. Footer */}
      <footer className="bg-white border-t border-gray-100 pt-20 pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center">
          
          <div className="text-[22px] font-bold tracking-tight text-gray-900 mb-8 cursor-pointer shadow-sm rounded-lg hover:text-blue-600 transition-colors">
            <Link to="/">BookMySpace</Link>
          </div>
          
          <ul className="flex flex-wrap justify-center gap-x-10 gap-y-4 mb-12 text-[14px] font-semibold tracking-wide text-gray-500">
            <li>
              <Link to="/" className="hover:text-blue-600 transition-colors duration-150 ease-out">Home</Link>
            </li>
            <li>
              <Link to="/explore" className="hover:text-blue-600 transition-colors duration-150 ease-out">Explore</Link>
            </li>
            <li>
              <Link to="/dashboard" className="hover:text-blue-600 transition-colors duration-150 ease-out">Dashboard</Link>
            </li>
            <li>
              <a href="#" className="hover:text-blue-600 transition-colors duration-150 ease-out">About Us</a>
            </li>
            <li>
              <a href="#" className="hover:text-blue-600 transition-colors duration-150 ease-out">Contact</a>
            </li>
          </ul>

          <div className="w-full max-w-[800px] mx-auto h-px bg-gray-200 mb-8 w-full"></div>
          
          <p className="text-[13px] font-medium text-gray-400 tracking-wide text-center">
            &copy; {new Date().getFullYear()} BookMySpace Platform. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
