import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { IoStarSharp, IoStarOutline } from 'react-icons/io5';
import { FaQuoteLeft } from 'react-icons/fa';
import { testimonials } from '../data/testimonials';
import SectionHeading from '../components/ui/SectionHeading';

function StarRating({ rating }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        star <= rating
          ? <IoStarSharp key={star} className="text-mithila-yellow" size={16} />
          : <IoStarOutline key={star} className="text-cream-300" size={16} />
      ))}
    </div>
  );
}

const stats = [
  { value: '200+', label: 'Happy Collectors' },
  { value: '4.9', label: 'Average Rating' },
  { value: '20+', label: 'Countries' },
  { value: '100%', label: 'Satisfaction' },
];

export default function TestimonialsPage() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }} className="min-h-screen bg-cream-50 pt-24">
      <Helmet>
        <title>Testimonials — Lalita Pathak Mithila Art</title>
        <meta name="description" content="Read what art collectors and patrons say about Lalita Pathak's authentic Mithila paintings." />
      </Helmet>

      {/* Hero */}
      <div className="relative bg-warm-black py-20 overflow-hidden">
        <div className="absolute inset-0 mithila-pattern opacity-5" />
        <div className="container-custom text-center relative z-10">
          <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-earth-400 font-body text-sm tracking-[0.3em] uppercase mb-3">
            Client Stories
          </motion.p>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="heading-xl text-cream-50 mb-4">
            What Our <span className="text-gradient-gold">Collectors Say</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-cream-300/80 font-body text-lg max-w-2xl mx-auto">
            Every painting carries a story, and every collector becomes part of the Mithila art legacy.
          </motion.p>
        </div>
      </div>

      {/* Stats */}
      <div className="container-custom -mt-8 relative z-10 px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.1 }}
              className="bg-white rounded-2xl p-6 shadow-card text-center"
            >
              <p className="font-display font-bold text-3xl text-earth-700 mb-1">{stat.value}</p>
              <p className="text-body-sm text-warm-gray-500">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Testimonials Grid */}
      <div className="container-custom section-padding">
        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
          {testimonials.map((testimonial, i) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ delay: (i % 3) * 0.1 }}
              className="break-inside-avoid bg-white rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-shadow duration-500"
            >
              <FaQuoteLeft className="text-earth-500/20 mb-4" size={28} />
              <p className="font-body text-warm-gray-600 leading-relaxed mb-4">
                "{testimonial.text}"
              </p>
              <StarRating rating={testimonial.rating} />
              <div className="flex items-center gap-3 mt-4 pt-4 border-t border-cream-100">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-cream-200"
                />
                <div>
                  <p className="font-display font-semibold text-charcoal">{testimonial.name}</p>
                  <p className="text-body-sm text-warm-gray-400">{testimonial.location}</p>
                </div>
              </div>
              <p className="text-xs text-warm-gray-300 mt-3 font-body">{testimonial.date}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-dark py-20 border-mithila-top">
        <div className="container-custom text-center">
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="heading-lg text-cream-50 mb-4">
            Ready to Own a Masterpiece?
          </motion.h2>
          <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="text-cream-300/70 font-body text-lg mb-8 max-w-lg mx-auto">
            Join our growing family of art collectors from around the world.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="flex gap-4 justify-center flex-wrap">
            <a href="/shop" className="btn-primary">Browse Collection</a>
            <a href="/commission" className="btn-ghost">Commission Art</a>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
