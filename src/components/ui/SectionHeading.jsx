import { motion } from 'framer-motion';

export default function SectionHeading({ title, subtitle, accent, centered = true, light = false }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6 }}
      className={`mb-12 md:mb-16 ${centered ? 'text-center' : ''}`}
    >
      {accent && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className={`font-body text-sm tracking-[0.3em] uppercase mb-3 ${
            light ? 'text-cream-300' : 'text-earth-500'
          }`}
        >
          {accent}
        </motion.p>
      )}
      <h2 className={`heading-lg ${light ? 'text-cream-50' : 'text-charcoal'}`}>
        {title}
      </h2>
      {subtitle && (
        <p className={`text-body mt-4 max-w-2xl ${centered ? 'mx-auto' : ''} ${
          light ? 'text-cream-300/80' : ''
        }`}>
          {subtitle}
        </p>
      )}
      <div className={`flex items-center gap-2 mt-6 ${centered ? 'justify-center' : ''}`}>
        <div className={`w-12 h-0.5 ${light ? 'bg-cream-300/30' : 'bg-cream-300'}`} />
        <div className="w-2 h-2 rounded-full bg-earth-500" />
        <div className={`w-12 h-0.5 ${light ? 'bg-cream-300/30' : 'bg-cream-300'}`} />
      </div>
    </motion.div>
  );
}
