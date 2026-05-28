import { motion } from 'framer-motion';
import { FaWhatsapp } from 'react-icons/fa';
import { useLocation } from 'react-router-dom';

export default function WhatsAppButton() {
  const location = useLocation();
  const authRoutes = ['/login', '/signup', '/forgot-password', '/reset-password', '/verify'];
  
  // Hide WhatsApp button on auth pages
  if (authRoutes.some(route => location.pathname.includes(route))) {
    return null;
  }

  return (
    <motion.a
      href="https://wa.me/917488337792?text=Hi%20Lalita%20ji!%20I%27m%20interested%20in%20your%20Mithila%20paintings."
      target="_blank"
      rel="noopener noreferrer"
      className="whatsapp-float group"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 2, type: 'spring', stiffness: 200 }}
      whileHover={{ scale: 1.15 }}
      whileTap={{ scale: 0.9 }}
      aria-label="Chat on WhatsApp"
    >
      <FaWhatsapp size={28} className="text-white" />
      
      {/* Pulse Ring */}
      <span className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-20" />
      
      {/* Tooltip */}
      <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-warm-black text-white text-sm px-4 py-2 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none shadow-lg">
        Chat with us! 💬
        <span className="absolute left-full top-1/2 -translate-y-1/2 border-4 border-transparent border-l-warm-black" />
      </span>
    </motion.a>
  );
}
