import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import { AnimatePresence, motion } from 'framer-motion';

const pageVariants = {
  initial: { 
    opacity: 0, 
    y: 12,
    filter: 'blur(6px)',
  },
  animate: { 
    opacity: 1, 
    y: 0,
    filter: 'blur(0px)',
  },
  exit: { 
    opacity: 0, 
    y: -8,
    filter: 'blur(4px)',
  },
};

const pageTransition = {
  duration: 0.4,
  ease: [0.4, 0, 0.2, 1], // ease out cubic
};

export default function Layout() {
  const location = useLocation();

  return (
    <div className="bg-white min-h-screen text-gray-900">
      <Navbar />
      <AnimatePresence mode="wait">
        <motion.main
          key={location.pathname}
          variants={pageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={pageTransition}
          className="min-h-screen flex flex-col"
        >
          <Outlet />
        </motion.main>
      </AnimatePresence>
    </div>
  );
}
