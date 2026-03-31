import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import { AnimatePresence, motion } from 'framer-motion';

export default function Layout() {
  const location = useLocation();

  return (
    <div className="bg-[#0B0F19] min-h-screen text-white/90">
      <Navbar />
      <AnimatePresence mode="wait">
        <motion.main
          key={location.pathname}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="min-h-screen flex flex-col"
        >
          <Outlet />
        </motion.main>
      </AnimatePresence>
    </div>
  );
}
