import { useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IoCloseOutline, IoChevronBackOutline, IoChevronForwardOutline, IoDownloadOutline, IoShareSocialOutline } from 'react-icons/io5';

export default function ImageViewer({ images = [], currentIndex = 0, isOpen, onClose, onNext, onPrev }) {
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') onClose?.();
    if (e.key === 'ArrowRight') onNext?.();
    if (e.key === 'ArrowLeft') onPrev?.();
  }, [onClose, onNext, onPrev]);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, handleKeyDown]);

  const currentImage = images[currentIndex];

  return (
    <AnimatePresence>
      {isOpen && currentImage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-warm-black/95 backdrop-blur-xl flex items-center justify-center"
          onClick={onClose}
        >
          {/* Close Button */}
          <motion.button
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            onClick={onClose}
            className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all duration-300 z-10"
          >
            <IoCloseOutline size={24} />
          </motion.button>

          {/* Navigation Arrows */}
          {images.length > 1 && (
            <>
              <motion.button
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                onClick={(e) => { e.stopPropagation(); onPrev?.(); }}
                className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all duration-300 z-10"
              >
                <IoChevronBackOutline size={24} />
              </motion.button>
              <motion.button
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                onClick={(e) => { e.stopPropagation(); onNext?.(); }}
                className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all duration-300 z-10"
              >
                <IoChevronForwardOutline size={24} />
              </motion.button>
            </>
          )}

          {/* Image */}
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="max-w-5xl max-h-[85vh] px-4"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={currentImage.image || currentImage}
              alt={currentImage.title || `Image ${currentIndex + 1}`}
              className="max-w-full max-h-[75vh] object-contain rounded-lg shadow-2xl"
            />

            {/* Image Info */}
            {currentImage.title && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mt-4 text-center"
              >
                <h3 className="font-display text-xl text-cream-100">{currentImage.title}</h3>
                {currentImage.category && (
                  <p className="text-cream-300/60 text-sm mt-1">{currentImage.category} • {currentImage.size}</p>
                )}
              </motion.div>
            )}
          </motion.div>

          {/* Counter */}
          {images.length > 1 && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-cream-300/60 text-sm font-body">
              {currentIndex + 1} / {images.length}
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
