import React, { useState, useEffect, useRef } from 'react';

const AnimatedCounter = ({ end, duration = 1000, suffix = "", prefix = "", decimals = 0 }) => {
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
            // easeOut cubic
            const easeProgress = 1 - Math.pow(1 - progress, 3);
            setCount(easeProgress * end);
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

  // Format with commas for larger numbers or fixed decimals
  const formattedCount = decimals > 0 
    ? count.toFixed(decimals)
    : Math.floor(count).toLocaleString('en-US');

  return (
    <span ref={counterRef}>
      {prefix}{formattedCount}{count === end ? suffix : ''}
    </span>
  );
};

export default AnimatedCounter;
