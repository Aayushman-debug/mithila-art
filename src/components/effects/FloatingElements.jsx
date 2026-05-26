import { motion } from 'framer-motion';

const elements = [
  // Lotus petals
  { type: 'lotus', color: '#C62828', size: 40, x: '10%', y: '20%', delay: 0 },
  { type: 'lotus', color: '#E65100', size: 35, x: '85%', y: '30%', delay: 1 },
  { type: 'lotus', color: '#2E7D32', size: 30, x: '15%', y: '70%', delay: 2 },
  // Fish
  { type: 'fish', color: '#1565C0', size: 45, x: '80%', y: '75%', delay: 0.5 },
  { type: 'fish', color: '#8B6914', size: 35, x: '5%', y: '45%', delay: 1.5 },
  // Peacock feather
  { type: 'peacock', color: '#2E7D32', size: 50, x: '90%', y: '15%', delay: 0.8 },
  // Stars
  { type: 'star', color: '#F9A825', size: 20, x: '30%', y: '10%', delay: 1.2 },
  { type: 'star', color: '#F9A825', size: 15, x: '70%', y: '50%', delay: 0.3 },
  { type: 'star', color: '#8B6914', size: 18, x: '50%', y: '85%', delay: 2.5 },
  // Dots
  { type: 'dot', color: '#D81B60', size: 8, x: '25%', y: '35%', delay: 0.7 },
  { type: 'dot', color: '#C62828', size: 6, x: '65%', y: '65%', delay: 1.8 },
  { type: 'dot', color: '#E65100', size: 10, x: '45%', y: '15%', delay: 2.2 },
];

function MithilaShape({ type, color, size }) {
  switch (type) {
    case 'lotus':
      return (
        <svg width={size} height={size} viewBox="0 0 40 40">
          <path
            d="M20 2 C23 12, 30 15, 20 20 C10 15, 17 12, 20 2Z"
            fill={color}
            opacity="0.6"
          />
          <path
            d="M38 20 C28 23, 25 30, 20 20 C25 10, 28 17, 38 20Z"
            fill={color}
            opacity="0.5"
          />
          <path
            d="M20 38 C17 28, 10 25, 20 20 C30 25, 23 28, 20 38Z"
            fill={color}
            opacity="0.4"
          />
          <circle cx="20" cy="20" r="3" fill={color} opacity="0.7" />
        </svg>
      );
    case 'fish':
      return (
        <svg width={size} height={size * 0.6} viewBox="0 0 45 27">
          <path
            d="M5 13.5 Q15 0, 30 8 Q35 10, 40 6 Q38 13.5, 40 21 Q35 17, 30 19 Q15 27, 5 13.5Z"
            fill={color}
            opacity="0.5"
          />
          <circle cx="28" cy="12" r="2" fill="white" opacity="0.8" />
        </svg>
      );
    case 'peacock':
      return (
        <svg width={size} height={size} viewBox="0 0 50 50">
          <ellipse cx="25" cy="20" rx="12" ry="18" fill={color} opacity="0.3" />
          <ellipse cx="25" cy="20" rx="8" ry="12" fill="#1565C0" opacity="0.3" />
          <ellipse cx="25" cy="18" rx="4" ry="6" fill="#F9A825" opacity="0.4" />
          <circle cx="25" cy="16" r="2" fill={color} opacity="0.6" />
        </svg>
      );
    case 'star':
      return (
        <svg width={size} height={size} viewBox="0 0 20 20">
          <polygon
            points="10,0 12,7 20,7 14,12 16,20 10,15 4,20 6,12 0,7 8,7"
            fill={color}
            opacity="0.4"
          />
        </svg>
      );
    case 'dot':
      return (
        <div
          className="rounded-full"
          style={{ width: size, height: size, backgroundColor: color, opacity: 0.3 }}
        />
      );
    default:
      return null;
  }
}

export default function FloatingElements({ className = '' }) {
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {elements.map((el, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{ left: el.x, top: el.y }}
          animate={{
            y: [0, -20, -8, -20, 0],
            x: [0, 5, -3, 5, 0],
            rotate: [0, 3, -2, 3, 0],
          }}
          transition={{
            duration: 8 + Math.random() * 4,
            repeat: Infinity,
            delay: el.delay,
            ease: 'easeInOut',
          }}
        >
          <MithilaShape type={el.type} color={el.color} size={el.size} />
        </motion.div>
      ))}
    </div>
  );
}
