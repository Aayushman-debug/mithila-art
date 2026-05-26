import { motion } from 'framer-motion';

export default function LoadingSpinner({ fullScreen = false, text = 'Loading...' }) {
  const content = (
    <div className="flex flex-col items-center gap-4">
      {/* Mithila Lotus Spinner */}
      <div className="relative w-16 h-16">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-0"
        >
          <svg viewBox="0 0 64 64" className="w-full h-full">
            <circle cx="32" cy="32" r="28" fill="none" stroke="#E8D5B5" strokeWidth="3" />
            <path
              d="M32 4 C36 18, 44 22, 32 32 C20 22, 28 18, 32 4Z"
              fill="#C62828"
              opacity="0.8"
            />
            <path
              d="M60 32 C46 36, 42 44, 32 32 C42 20, 46 28, 60 32Z"
              fill="#E65100"
              opacity="0.8"
            />
            <path
              d="M32 60 C28 46, 20 42, 32 32 C44 42, 36 46, 32 60Z"
              fill="#2E7D32"
              opacity="0.8"
            />
            <path
              d="M4 32 C18 28, 22 20, 32 32 C22 44, 18 36, 4 32Z"
              fill="#1565C0"
              opacity="0.8"
            />
          </svg>
        </motion.div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-4 h-4 rounded-full bg-gradient-gold" />
        </div>
      </div>
      <p className="text-earth-500 font-body text-sm animate-pulse-soft">{text}</p>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-cream-50/90 backdrop-blur-sm flex items-center justify-center z-[200]">
        {content}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-20">
      {content}
    </div>
  );
}
