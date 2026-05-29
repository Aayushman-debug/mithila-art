import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import SectionHeading from '../components/ui/SectionHeading';
import { IoFlowerOutline, IoMusicalNotesOutline, IoRestaurantOutline, IoPeopleOutline } from 'react-icons/io5';

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } },
};

export default function CulturePage() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
      <Helmet>
        <title>Mithila Culture — Lalita Pathak Mithila Art Studio</title>
        <meta name="description" content="Discover the rich culture, traditions, festivals, and lifestyle of the Mithila region." />
      </Helmet>

      {/* Hero Section */}
      <section ref={heroRef} className="relative h-[70vh] min-h-[500px] flex items-center justify-center overflow-hidden">
        <motion.div className="absolute inset-0 z-0" style={{ y }}>
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1512402120011-e12918bb1b80?w=1920&q=80')] bg-cover bg-center" />
          <div className="absolute inset-0 bg-gradient-to-b from-warm-black/80 via-warm-black/60 to-cream-50" />
        </motion.div>
        
        <motion.div className="relative z-10 text-center px-4 max-w-4xl mx-auto mt-20" style={{ opacity }}>
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="font-display text-5xl md:text-7xl font-bold text-white mb-6">
            The Heart of <span className="text-mithila-red">Mithila</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="text-xl text-cream-200 font-body leading-relaxed">
            A journey into the traditions, festivals, cuisine, and lifestyle of one of India's most vibrant cultural landscapes.
          </motion.p>
        </motion.div>
      </section>

      {/* Traditions Section */}
      <section className="py-20 bg-cream-50">
        <div className="container-custom">
          <SectionHeading title="Festivals & Traditions" subtitle="Celebrations that bring the community together and keep the art alive" centered accent />
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mt-16">
            {[
              { title: 'Chhath Puja', desc: 'The most revered festival, dedicated to the Sun God, featuring elaborate offerings and riverside rituals.', icon: IoFlowerOutline, color: 'text-mithila-orange' },
              { title: 'Sama Chakeva', desc: 'A festival celebrating the bond between brothers and sisters through clay idols and folk songs.', icon: IoPeopleOutline, color: 'text-mithila-blue' },
              { title: 'Vivah Panchami', desc: 'Celebrating the divine marriage of Lord Rama and Goddess Sita in Janakpur.', icon: IoMusicalNotesOutline, color: 'text-mithila-red' },
              { title: 'Mithila Cuisine', desc: 'Known for its unique flavors, featuring Machh (Fish), Makhan (Fox Nut), and Paan (Betel Leaf).', icon: IoRestaurantOutline, color: 'text-earth-500' },
            ].map((item, i) => (
              <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="bg-white p-8 rounded-2xl shadow-card hover:shadow-card-hover transition-all duration-300">
                <item.icon className={`text-4xl ${item.color} mb-6`} />
                <h3 className="font-display text-xl font-bold text-charcoal mb-4">{item.title}</h3>
                <p className="text-warm-gray-600 font-body leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="absolute inset-0 mithila-pattern opacity-5" />
        <div className="container-custom relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
              <img src="https://picsum.photos/seed/mithila-culture/800/1000" alt="Mithila Culture" className="rounded-2xl shadow-xl w-full" />
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="space-y-6">
              <h2 className="font-display text-4xl font-bold text-charcoal">A Way of Life</h2>
              <p className="text-warm-gray-600 font-body text-lg leading-relaxed">
                In Mithila, art is not just an aesthetic pursuit; it is woven into the very fabric of daily existence. The women who paint the mud walls of their homes are not considered professional artists in the Western sense, but rather custodians of a sacred lineage.
              </p>
              <p className="text-warm-gray-600 font-body text-lg leading-relaxed">
                Every symbol carries meaning: the lotus for purity, the fish for fertility, the turtle for stability. Through these paintings, the people of Mithila communicate with the divine, document their history, and pass down their values to the next generation.
              </p>
            </motion.div>
          </div>
        </div>
      </section>
    </motion.div>
  );
}
