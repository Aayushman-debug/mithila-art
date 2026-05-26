import { motion } from 'framer-motion';

export default function GlassCard({ children, className = '', hover = true, ...props }) {
  const Component = hover ? motion.div : 'div';
  const hoverProps = hover
    ? {
        whileHover: { y: -4, boxShadow: '0 10px 25px -3px rgba(139, 105, 20, 0.15), 0 20px 40px -5px rgba(45, 36, 22, 0.12)' },
        transition: { duration: 0.3 },
      }
    : {};

  return (
    <Component
      className={`glass-card p-6 ${className}`}
      {...hoverProps}
      {...props}
    >
      {children}
    </Component>
  );
}
