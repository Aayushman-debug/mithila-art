import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IoCloseOutline } from 'react-icons/io5';
import { useMediaQuery } from '../../hooks/useMediaQuery';

export default function FloatingWindow({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  size = 'md', // sm, md, lg, xl, full
  className = '' 
}) {
  const isMobile = useMediaQuery('(max-width: 768px)');

  // Focus trap and ESC to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl',
    full: 'max-w-[95vw] h-[95vh]'
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-end md:items-center justify-center p-0 md:p-4">
          {/* Backdrop with Glassmorphism 10-20px blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            onClick={onClose}
            className="absolute inset-0 bg-earth-900/40 backdrop-blur-md"
          />

          {/* Floating Container */}
          {isMobile ? (
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 22, stiffness: 150 }}
              className={`relative w-full max-h-[90vh] bg-white/90 dark:bg-warm-gray-900/90 backdrop-blur-xl border border-white/20 dark:border-warm-gray-700/30 rounded-t-3xl shadow-2xl flex flex-col overflow-hidden ${className}`}
            >
              {title && (
                <div className="px-4 py-4 flex justify-between items-center shrink-0 border-b border-cream-200/50 dark:border-warm-gray-700/50">
                  <h3 className="font-display font-bold text-xl text-charcoal dark:text-cream-50">{title}</h3>
                  <button
                    onClick={onClose}
                    aria-label="Close"
                    className="p-2 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full text-warm-gray-500 hover:bg-warm-gray-100 dark:hover:bg-warm-gray-800 transition-colors"
                  >
                    <IoCloseOutline size={24} />
                  </button>
                </div>
              )}
              {!title && (
                <button
                  onClick={onClose}
                  aria-label="Close"
                  className="absolute top-4 right-4 z-10 p-2 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full bg-white/50 dark:bg-warm-gray-800/50 backdrop-blur-sm text-warm-gray-700 dark:text-cream-50 hover:bg-white dark:hover:bg-warm-gray-700 transition-colors shadow-sm"
                >
                  <IoCloseOutline size={24} />
                </button>
              )}

              <div className="flex-1 overflow-y-auto p-4 pb-8 custom-scrollbar">
                {children}
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              transition={{ type: 'spring', damping: 20, stiffness: 120 }}
              className={`relative w-full ${sizeClasses[size]} max-h-[90vh] bg-white/90 dark:bg-warm-gray-900/90 backdrop-blur-2xl border border-white/40 dark:border-warm-gray-700/50 rounded-2xl shadow-2xl flex flex-col overflow-hidden ${className}`}
            >
              {title && (
                <div className="px-6 py-4 flex justify-between items-center border-b border-cream-200/50 dark:border-warm-gray-700/50 shrink-0">
                  <h3 className="font-display font-bold text-xl text-charcoal dark:text-cream-50">{title}</h3>
                  <button
                    onClick={onClose}
                    aria-label="Close"
                    className="p-2 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full text-warm-gray-500 hover:bg-warm-gray-100/50 dark:hover:bg-warm-gray-800/50 transition-colors"
                  >
                    <IoCloseOutline size={24} />
                  </button>
                </div>
              )}
              {!title && (
                <button
                  onClick={onClose}
                  aria-label="Close"
                  className="absolute top-4 right-4 z-10 p-2 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full bg-white/50 dark:bg-warm-gray-800/50 backdrop-blur-sm text-warm-gray-700 dark:text-cream-50 hover:bg-white dark:hover:bg-warm-gray-700 transition-colors shadow-sm"
                >
                  <IoCloseOutline size={24} />
                </button>
              )}

              <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
                {children}
              </div>
            </motion.div>
          )}
        </div>
      )}
    </AnimatePresence>
  );
}
