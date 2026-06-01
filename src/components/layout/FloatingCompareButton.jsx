import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCompare } from '../../context/CompareContext';
import { MdCompareArrows } from 'react-icons/md';

export default function FloatingCompareButton() {
  const { compareItems } = useCompare();

  return (
    <AnimatePresence>
      {compareItems.length > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          className="fixed bottom-24 right-6 z-40"
        >
          <Link
            to="/compare"
            className="flex items-center justify-center gap-2 bg-charcoal text-white px-5 py-3 rounded-full shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 font-display font-semibold"
          >
            <MdCompareArrows size={22} />
            Compare ({compareItems.length})
          </Link>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
