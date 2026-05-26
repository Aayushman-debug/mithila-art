import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export default function ParallaxSection({
  children,
  className = '',
  speed = 0.3,
  bgImage,
  bgColor,
  overlay = true,
  overlayOpacity = 0.7,
}) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], ['-10%', '10%']);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1.05, 1, 1.05]);

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      {bgImage && (
        <motion.div
          className="absolute inset-0 w-full h-full"
          style={{ y, scale }}
        >
          <div
            className="absolute inset-0 w-full h-full bg-cover bg-center"
            style={{ backgroundImage: `url(${bgImage})` }}
          />
          {overlay && (
            <div
              className="absolute inset-0"
              style={{
                backgroundColor: bgColor || 'rgba(45, 36, 22, ' + overlayOpacity + ')',
              }}
            />
          )}
        </motion.div>
      )}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
