import React, { useRef, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { useInView } from 'react-intersection-observer';
import {
  FaPaintBrush,
  FaFeatherAlt,
  FaOm,
  FaPalette,
  FaLeaf,
  FaMosque,
  FaStar,
  FaArrowRight,
  FaScroll,
  FaMountain,
  FaGlobe,
  FaHandsHelping,
  FaUniversity,
} from 'react-icons/fa';
import {
  IoSparkles,
  IoFlower,
  IoColorPalette,
  IoWater,
  IoFlame,
} from 'react-icons/io5';

import SectionHeading from '../components/ui/SectionHeading';
import GlassCard from '../components/ui/GlassCard';

/* ───────────────────── animation variants ───────────────────── */
const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15, delayChildren: 0.3 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } },
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.6 } },
};

const scaleUp = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: 'easeOut' } },
};

const slideInLeft = {
  hidden: { opacity: 0, x: -60 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } },
};

const slideInRight = {
  hidden: { opacity: 0, x: 60 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } },
};

/* ───────────────────── timeline data ───────────────────── */
const timelineEvents = [
  {
    era: 'Ancient Period',
    year: '3rd Century BCE',
    title: 'Birth of a Sacred Tradition',
    description:
      'The earliest known Mithila paintings appear as cave art and wall decorations in the ancient kingdom of Videha. According to legend, King Janaka of Mithila commissioned artists to decorate the city of Janakpur for the wedding of his daughter Sita to Lord Ram. This mythological origin connects Mithila art directly to the Ramayana, making it one of the oldest living art traditions rooted in Hindu scripture.',
    icon: FaScroll,
    color: 'from-amber-700 to-amber-500',
  },
  {
    era: 'Medieval Period',
    year: '14th – 16th Century',
    title: 'Flourishing Under Royal Patronage',
    description:
      'Under the Oinwar and Khandwala dynasties, Mithila painting reached new heights of sophistication. Queens and noblewomen refined the Kohbar tradition — creating elaborate bridal chamber murals that encoded fertility symbols, cosmological diagrams, and family lineage. The Bharni and Kachni styles crystallised during this period, each becoming associated with distinct social communities.',
    icon: FaMosque,
    color: 'from-earth-600 to-earth-400',
  },
  {
    era: 'Colonial Era',
    year: '1934',
    title: 'Discovery After the Great Earthquake',
    description:
      'A devastating earthquake struck Bihar on 15 January 1934, killing over 7,000 people. British colonial officer William G. Archer, inspecting the damage in the Madhubani district, noticed extraordinary paintings on the crumbling mud walls of village homes. He photographed them extensively, and his documentation — later published in the journal Marg — brought Mithila art to the attention of the wider world for the first time.',
    icon: FaMountain,
    color: 'from-warm-gray-600 to-warm-gray-400',
  },
  {
    era: 'Modern Revival',
    year: '1960s – 1980s',
    title: 'From Walls to Paper',
    description:
      'In the aftermath of a severe drought, the All India Handicrafts Board — guided by artist Bhaskar Kulkarni — encouraged Mithila women to transfer their wall paintings onto paper for commercial sale. Artists like Sita Devi, Jagdamba Devi, and Mahasundari Devi became the first to exhibit Mithila art in Delhi galleries. By 1970, Mithila painting had received a GI (Geographical Indication) tag, and Sita Devi was awarded the Padma Shri in 1981.',
    icon: FaPaintBrush,
    color: 'from-mithila-red to-mithila-orange',
  },
  {
    era: 'Contemporary',
    year: '2000s – Present',
    title: 'Global Recognition & UNESCO Heritage',
    description:
      'Mithila art has been exhibited at the Smithsonian, Musée du Quai Branly, and the Mithila Museum in Japan. In 2012, India nominated Mithila painting for the UNESCO Representative List of the Intangible Cultural Heritage of Humanity. Contemporary artists like Bharti Dayal and Ranjit Jha are pushing the tradition into new territory — addressing climate change, digital culture, and gender justice through the visual grammar of this ancient art form.',
    icon: FaGlobe,
    color: 'from-mithila-blue to-mithila-purple',
  },
];

/* ───────────────────── art styles data ───────────────────── */
const artStyles = [
  {
    name: 'Bharni',
    nameHindi: 'भरनी',
    subtitle: 'The Filled Style',
    description:
      'Characterised by bold outlines filled with vibrant, solid colours. Traditionally practised by Brahmin women, Bharni paintings depict Hindu deities, mythological narratives, and cosmic symbols. The palette — red from kumkum, yellow from turmeric, green from neem — is drawn entirely from nature.',
    icon: FaPalette,
    color: 'bg-mithila-red',
    gradient: 'from-mithila-red/10 to-mithila-orange/10',
    image: 'https://picsum.photos/seed/bharni-style/400/300',
  },
  {
    name: 'Kachni',
    nameHindi: 'कचनी',
    subtitle: 'The Line Drawing Style',
    description:
      'A monochromatic technique relying on intricate hatching and cross-hatching, typically in black or red ink applied with a bamboo nib. Where Bharni overwhelms with colour, Kachni captivates with patience. A single painting can take weeks as the artist builds form through thousands of parallel lines.',
    icon: FaFeatherAlt,
    color: 'bg-charcoal',
    gradient: 'from-warm-gray-200/50 to-warm-gray-100/50',
    image: 'https://picsum.photos/seed/kachni-style/400/300',
  },
  {
    name: 'Tantric',
    nameHindi: 'तांत्रिक',
    subtitle: 'The Mystical Geometric Style',
    description:
      'Rooted in Shakta-Tantric traditions, these paintings depict yantras, mandalas, and cosmic energy diagrams. Geometric precision merges with spiritual symbolism — interlocking triangles represent Shiva-Shakti union, concentric circles map cosmic consciousness, and petal forms echo the chakra system.',
    icon: FaOm,
    color: 'bg-mithila-purple',
    gradient: 'from-mithila-purple/10 to-mithila-blue/10',
    image: 'https://picsum.photos/seed/tantric-style/400/300',
  },
  {
    name: 'Godhana',
    nameHindi: 'गोदना',
    subtitle: "The Dalit Women's Style",
    description:
      'Inspired by traditional tattoo art (godna), this style was practised by Dalit women of the Mithila region. Featuring geometric patterns, circles, and depictions of everyday rural life, Godhana art was historically marginalised but is now celebrated as a vital part of the Mithila tradition, thanks to artists like Dulari Devi.',
    icon: IoFlower,
    color: 'bg-mithila-green',
    gradient: 'from-mithila-green/10 to-mithila-yellow/10',
    image: 'https://picsum.photos/seed/godhana-style/400/300',
  },
  {
    name: 'Kohbar',
    nameHindi: 'कोहबर',
    subtitle: 'The Wedding Chamber Art',
    description:
      'The most sacred category of Mithila painting, Kohbar adorns the bridal chamber (kohbar ghar). Central motifs include the lotus pond (representing female fertility), bamboo groves (male fertility), fish pairs (conjugal love), and the cosmic turtle (stability). Every Kohbar painting is a visual prayer for the couple\'s prosperity.',
    icon: FaStar,
    color: 'bg-earth-500',
    gradient: 'from-earth-500/10 to-cream-200/30',
    image: 'https://picsum.photos/seed/kohbar-style/400/300',
  },
];

/* ════════════════════════════════════════════════════════════════
   1. HERO SECTION
   ════════════════════════════════════════════════════════════════ */
function HeroSection() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);

  return (
    <section ref={heroRef} className="relative h-[90vh] min-h-[600px] overflow-hidden flex items-center justify-center pt-24">
      {/* Parallax Background */}
      <motion.div className="absolute inset-0 z-0" style={{ y, scale }}>
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1582738411706-bfc8e691d1c2?w=1920&q=80')] bg-cover bg-center" />
        <div className="absolute inset-0 bg-gradient-to-b from-warm-black/80 via-warm-black/50 to-warm-black/90" />
        {/* Sepia overlay for ancient look */}
        <div className="absolute inset-0 bg-amber-900/20 mix-blend-multiply" />
      </motion.div>

      {/* Decorative Elements */}
      <div className="absolute inset-0 z-[1] pointer-events-none overflow-hidden">
        <motion.div
          className="absolute top-20 left-10 w-40 h-40 rounded-full border border-earth-500/15"
          animate={{ rotate: 360 }}
          transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
        />
        <motion.div
          className="absolute bottom-32 right-16 w-28 h-28 rounded-full border-2 border-dashed border-cream-300/10"
          animate={{ rotate: -360 }}
          transition={{ duration: 35, repeat: Infinity, ease: 'linear' }}
        />
        <motion.div
          className="absolute top-1/3 right-10 w-3 h-3 rounded-full bg-earth-500/30"
          animate={{ y: [-15, 15, -15], opacity: [0.3, 0.8, 0.3] }}
          transition={{ duration: 5, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-1/4 left-1/4 w-2 h-2 rounded-full bg-mithila-yellow/30"
          animate={{ y: [10, -10, 10], opacity: [0.2, 0.7, 0.2] }}
          transition={{ duration: 7, repeat: Infinity }}
        />
        {/* Ancient scroll-like border decorations */}
        <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-warm-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-cream-50 to-transparent z-20" />
      </div>

      {/* Content */}
      <motion.div className="relative z-10 text-center px-4 max-w-5xl mx-auto" style={{ opacity }}>
        <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-6">
          <motion.p variants={fadeUp} className="font-accent text-earth-400/90 text-lg md:text-xl tracking-[0.3em]">
            मिथिला कला — एक पवित्र विरासत
          </motion.p>

          <motion.div variants={fadeIn} className="flex items-center justify-center gap-4">
            <span className="h-px w-16 bg-gradient-to-r from-transparent to-earth-500" />
            <FaScroll className="text-earth-500 text-lg" />
            <span className="h-px w-16 bg-gradient-to-l from-transparent to-earth-500" />
          </motion.div>

          <motion.h1 variants={fadeUp} className="font-display text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold text-white !leading-[1.05]">
            The Sacred Legacy of{' '}
            <span className="bg-gradient-to-r from-earth-400 via-cream-300 to-earth-400 bg-clip-text text-transparent">
              Mithila Art
            </span>
          </motion.h1>

          <motion.p variants={fadeUp} className="text-lg md:text-xl text-cream-200/70 font-body max-w-3xl mx-auto leading-relaxed">
            A 2,500-year journey from the sacred walls of ancient Bihar to the galleries of the modern world — tracing the unbroken lineage of one of humanity's oldest living art traditions.
          </motion.p>

          <motion.div
            variants={fadeIn}
            className="pt-8"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2.5, repeat: Infinity }}
          >
            <div className="w-6 h-10 rounded-full border-2 border-cream-300/30 mx-auto flex justify-center">
              <motion.div
                className="w-1.5 h-3 bg-earth-500 rounded-full mt-2"
                animate={{ y: [0, 12, 0], opacity: [1, 0.3, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>
            <p className="text-cream-300/40 text-xs mt-3 font-body tracking-widest uppercase">Scroll to Explore</p>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════
   2. ORIGIN STORY
   ════════════════════════════════════════════════════════════════ */
function OriginStory() {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] });
  const imageY = useTransform(scrollYProgress, [0, 1], [80, -80]);
  const textY = useTransform(scrollYProgress, [0, 1], [40, -40]);
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.15 });

  return (
    <section ref={sectionRef} className="section-padding bg-cream-50 dark:bg-warm-gray-900 relative overflow-hidden">
      {/* Background Texture */}
      <div className="absolute inset-0 mithila-pattern opacity-20" />
      <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-cream-50 dark:from-warm-gray-900 to-transparent z-10" />

      <div className="container-custom relative z-10" ref={ref}>
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Image Side */}
          <motion.div
            variants={slideInLeft}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
            className="relative"
            style={{ y: imageY }}
          >
            <div className="relative">
              <motion.div
                className="rounded-2xl overflow-hidden shadow-glass-lg"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.5 }}
              >
                <img
                  src="https://picsum.photos/seed/mithila-origin/600/700"
                  alt="Ancient Mithila wall painting showing the wedding of Sita and Ram"
                  className="w-full h-[500px] lg:h-[600px] object-cover"
                />
              </motion.div>

              {/* Floating accent */}
              <motion.div
                className="absolute -bottom-6 -right-6 bg-white dark:bg-warm-gray-800 border border-cream-100/30 dark:border-warm-gray-700/50 rounded-xl p-5 shadow-card"
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                <p className="font-accent text-earth-500 text-sm">सीता विवाह</p>
                <p className="font-display text-3xl font-bold text-charcoal dark:text-white">2,500+</p>
                <p className="text-warm-gray-500 dark:text-warm-gray-300 text-sm font-body">Years of Tradition</p>
              </motion.div>

              {/* Decorative corner */}
              <div className="absolute -top-4 -left-4 w-24 h-24 border-l-4 border-t-4 border-earth-500/30 rounded-tl-2xl" />
            </div>
          </motion.div>

          {/* Text Side */}
          <motion.div
            variants={slideInRight}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
            className="space-y-6"
            style={{ y: textY }}
          >
            <motion.p className="font-accent text-earth-500 tracking-widest text-sm uppercase">
              Where It All Began
            </motion.p>

            <h2 className="font-display text-4xl md:text-5xl font-bold text-charcoal dark:text-white leading-tight">
              Born from the{' '}
              <span className="bg-gradient-to-r from-earth-50 to-mithila-red bg-clip-text text-transparent">
                Walls of Ancient Bihar
              </span>
            </h2>

            <div className="space-y-4">
              <p className="text-warm-gray-600 dark:text-warm-gray-200 font-body text-lg leading-relaxed">
                More than <strong className="text-charcoal dark:text-white">2,500 years ago</strong>, in the ancient kingdom of Videha — present-day{' '}
                <strong className="text-charcoal dark:text-white">Madhubani district, Bihar</strong> — women began adorning the freshly plastered mud walls and
                floors of their homes with intricate paintings using natural pigments.
              </p>
              <p className="text-warm-gray-500 dark:text-warm-gray-300 font-body leading-relaxed">
                Legend traces the art form to the <em className="text-mithila-red dark:text-red-450 font-medium">Ramayana</em> itself: when King Janaka
                commissioned the finest artists to decorate the city of Janakpur for the grand wedding of his daughter{' '}
                <strong className="text-charcoal dark:text-white">Sita</strong> to Lord <strong className="text-charcoal dark:text-white">Ram</strong>. The women of Mithila
                painted the walls with images of gods, sacred symbols, and scenes from nature — a tradition they would carry forward,
                mother to daughter, for millennia.
              </p>
              <p className="text-warm-gray-500 dark:text-warm-gray-300 font-body leading-relaxed">
                These were not merely decorative works. Each painting was a <em>prayer made visible</em> — marking weddings, births,
                festivals, and harvests. The fish symbolised fertility, the lotus purity, the bamboo grove masculine strength, and the
                peacock the promise of rain. The walls of a Maithil home were a living text, encoding an entire worldview in colour and line.
              </p>
            </div>

            {/* Key facts */}
            <div className="grid grid-cols-2 gap-4 pt-4">
              {[
                { label: 'Origin Region', value: 'Mithila, Bihar' },
                { label: 'First Medium', value: 'Mud walls & floors' },
                { label: 'Primary Artists', value: 'Women of Mithila' },
                { label: 'Sacred Connection', value: 'Ramayana legend' },
              ].map((fact) => (
                <div key={fact.label} className="bg-cream-100 dark:bg-warm-gray-800 border border-transparent dark:border-warm-gray-700/50 rounded-xl p-4">
                  <p className="text-xs text-earth-500 font-body uppercase tracking-wider">{fact.label}</p>
                  <p className="font-display font-semibold text-charcoal dark:text-white mt-1">{fact.value}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════
   3. INTERACTIVE TIMELINE
   ════════════════════════════════════════════════════════════════ */
function TimelineSection() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.05 });

  return (
    <section className="section-padding relative overflow-hidden bg-charcoal">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-dark" />
      <div className="absolute inset-0 bg-dots opacity-5" />
      <motion.div
        className="absolute top-1/4 -left-20 w-96 h-96 rounded-full bg-earth-500/5 blur-3xl"
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 12, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-1/4 -right-20 w-80 h-80 rounded-full bg-mithila-red/5 blur-3xl"
        animate={{ scale: [1.1, 1, 1.1] }}
        transition={{ duration: 15, repeat: Infinity }}
      />

      <div className="container-custom relative z-10">
        <SectionHeading
          title="A Timeline of Living Heritage"
          subtitle="From ancient wall art to UNESCO recognition — the remarkable journey of Mithila painting across two and a half millennia"
          accent
          centered
          light
        />

        <div className="mt-20 relative" ref={ref}>
          {/* Central timeline line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-earth-500/50 via-earth-500/20 to-earth-500/50 hidden lg:block" />
          {/* Mobile timeline line */}
          <div className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-earth-500/50 via-earth-500/20 to-earth-500/50 lg:hidden" />

          <div className="space-y-16 lg:space-y-24">
            {timelineEvents.map((event, index) => (
              <TimelineItem key={event.era} event={event} index={index} inView={inView} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function TimelineItem({ event, index, inView }) {
  const isLeft = index % 2 === 0;
  const [itemRef, itemInView] = useInView({ triggerOnce: true, threshold: 0.3 });

  return (
    <motion.div
      ref={itemRef}
      className={`relative flex items-start gap-8 lg:gap-0 ${isLeft ? 'lg:flex-row' : 'lg:flex-row-reverse'}`}
      initial={{ opacity: 0, y: 50 }}
      animate={itemInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Dot on timeline */}
      <div className="absolute left-8 lg:left-1/2 transform -translate-x-1/2 z-20">
        <motion.div
          className={`w-14 h-14 rounded-full bg-gradient-to-br ${event.color} flex items-center justify-center shadow-gold`}
          whileHover={{ scale: 1.2, rotate: 360 }}
          transition={{ duration: 0.5 }}
        >
          <event.icon className="text-white text-lg" />
        </motion.div>
      </div>

      {/* Content card */}
      <div className={`ml-20 lg:ml-0 lg:w-[45%] ${isLeft ? 'lg:pr-12' : 'lg:pl-12'} ${isLeft ? '' : 'lg:ml-auto'}`}>
        <motion.div
          className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 lg:p-8 hover:bg-white/10 transition-all duration-500"
          whileHover={{ y: -4, boxShadow: '0 20px 40px rgba(139, 105, 20, 0.15)' }}
        >
          {/* Era badge */}
          <div className="flex items-center gap-3 mb-4">
            <span className={`px-4 py-1.5 rounded-full bg-gradient-to-r ${event.color} text-white text-xs font-body font-medium tracking-wider uppercase`}>
              {event.era}
            </span>
            <span className="text-earth-400 font-display font-semibold text-sm">{event.year}</span>
          </div>

          <h3 className="font-display text-2xl font-bold text-white mb-3">{event.title}</h3>
          <p className="text-white/60 font-body leading-relaxed">{event.description}</p>

          {/* Decorative line */}
          <div className="mt-6 h-px bg-gradient-to-r from-earth-500/30 to-transparent" />
        </motion.div>
      </div>
    </motion.div>
  );
}

/* ════════════════════════════════════════════════════════════════
   4. ART STYLES SECTION
   ════════════════════════════════════════════════════════════════ */
function ArtStylesSection() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section className="section-padding bg-cream-50 dark:bg-warm-gray-900 relative overflow-hidden">
      <div className="absolute inset-0 mithila-pattern opacity-15" />

      <div className="container-custom relative z-10">
        <SectionHeading
          title="The Five Great Styles"
          subtitle="Each style of Mithila painting carries its own history, technique, and spiritual significance — a visual language refined over centuries"
          accent
          centered
        />

        <motion.div
          ref={ref}
          variants={staggerContainer}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="mt-16 space-y-12"
        >
          {artStyles.map((style, index) => (
            <ArtStyleCard key={style.name} style={style} index={index} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function ArtStyleCard({ style, index }) {
  const isReversed = index % 2 !== 0;
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className={`grid lg:grid-cols-2 gap-8 lg:gap-12 items-center ${isReversed ? 'lg:direction-rtl' : ''}`}
    >
      {/* Image */}
      <motion.div
        className={`relative group ${isReversed ? 'lg:order-2' : ''}`}
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.5 }}
      >
        <div className="rounded-2xl overflow-hidden shadow-card group-hover:shadow-card-hover transition-shadow duration-500">
          <img
            src={style.image}
            alt={`${style.name} style Mithila painting`}
            className="w-full h-72 lg:h-80 object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div className={`absolute inset-0 bg-gradient-to-t ${style.gradient} opacity-40`} />
        </div>

        {/* Style badge */}
        <motion.div
          className={`absolute top-4 left-4 ${style.color} text-white px-4 py-2 rounded-full text-sm font-body font-medium shadow-lg`}
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <span className="font-accent mr-2">{style.nameHindi}</span>
          {style.name}
        </motion.div>
      </motion.div>

      {/* Content */}
      <div className={`space-y-5 ${isReversed ? 'lg:order-1 lg:text-right' : ''}`}>
        <div className={`flex items-center gap-3 ${isReversed ? 'lg:justify-end' : ''}`}>
          <div className={`w-12 h-12 rounded-xl ${style.color} flex items-center justify-center`}>
            <style.icon className="text-white text-lg" />
          </div>
          <div>
            <h3 className="font-display text-2xl font-bold text-charcoal dark:text-white">{style.name}</h3>
            <p className="text-earth-500 font-body text-sm">{style.subtitle}</p>
          </div>
        </div>

        <p className="text-warm-gray-600 dark:text-warm-gray-300 font-body leading-relaxed text-lg">{style.description}</p>

        <div className={`h-1 w-16 rounded-full bg-gradient-to-r ${style.color === 'bg-charcoal' ? 'from-charcoal to-warm-gray-400' : style.color.replace('bg-', 'from-') + ' to-transparent'}`} />
      </div>
    </motion.div>
  );
}

/* ════════════════════════════════════════════════════════════════
   5. CULTURAL SIGNIFICANCE
   ════════════════════════════════════════════════════════════════ */
function CulturalSignificance() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.15 });
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] });
  const bgY = useTransform(scrollYProgress, [0, 1], [0, -100]);

  const rituals = [
    {
      title: 'Weddings (Vivah)',
      description:
        'The Kohbar ghar (bridal chamber) is lavishly painted with fertility symbols — lotus ponds, fish pairs, bamboo groves, and the cosmic turtle. These sacred paintings bless the newlywed couple with prosperity, conjugal harmony, and continuity of the family lineage.',
      icon: IoFlower,
      color: 'text-mithila-red',
      bg: 'bg-mithila-red/5',
    },
    {
      title: 'Festivals (Utsav)',
      description:
        'During Chhath Puja, Holi, Diwali, and Durga Puja, homes are freshly painted with Aripan floor designs and wall panels depicting the presiding deities. The act of painting is itself a form of worship — a meditation that sanctifies the domestic space.',
      icon: IoFlame,
      color: 'text-mithila-orange',
      bg: 'bg-mithila-orange/5',
    },
    {
      title: 'Birth & Coming of Age',
      description:
        'When a child is born, the birth room is painted with protective symbols and images of Krishna\'s childhood. As daughters come of age, they are taught the family\'s painting tradition — a rite of passage that connects each generation to the artistic lineage.',
      icon: IoSparkles,
      color: 'text-mithila-yellow',
      bg: 'bg-mithila-yellow/5',
    },
    {
      title: 'Harvest & Seasonal Rites',
      description:
        'Paintings mark the agricultural calendar: rice-planting songs are accompanied by floor art, and harvest festivals feature elaborate compositions celebrating the abundance of the land. The Tree of Life motif connects human prosperity to natural cycles.',
      icon: FaLeaf,
      color: 'text-mithila-green',
      bg: 'bg-mithila-green/5',
    },
    {
      title: 'Prayer & Devotion',
      description:
        'Every Maithil home features a puja room adorned with paintings of the family\'s chosen deities — Durga, Shiva, Krishna, or Ganesha. These devotional panels are repainted for each major prayer ceremony, ensuring the spiritual vitality of the home.',
      icon: FaOm,
      color: 'text-mithila-purple',
      bg: 'bg-mithila-purple/5',
    },
    {
      title: 'Community & Identity',
      description:
        'Mithila painting has become a powerful marker of regional identity. The Madhubani railway station, government buildings, and even the Indian Parliament feature Mithila murals — a public declaration that art and community are inseparable in this tradition.',
      icon: FaHandsHelping,
      color: 'text-mithila-blue',
      bg: 'bg-mithila-blue/5',
    },
  ];

  return (
    <section ref={sectionRef} className="section-padding relative overflow-hidden bg-white dark:bg-warm-gray-900">
      {/* Parallax pattern background */}
      <motion.div className="absolute inset-0 mithila-pattern opacity-10" style={{ y: bgY }} />

      <div className="container-custom relative z-10">
        <SectionHeading
          title="Woven into Life Itself"
          subtitle="Mithila painting is not merely decorative — it is a living ritual practice that sanctifies every milestone of human experience"
          accent
          centered
        />

        <motion.div
          ref={ref}
          variants={staggerContainer}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-16"
        >
          {rituals.map((ritual) => (
            <motion.div key={ritual.title} variants={fadeUp}>
              <motion.div
                className={`${ritual.bg} border border-warm-gray-100 dark:border-warm-gray-800 rounded-2xl p-6 h-full hover:shadow-card-hover transition-all duration-500 group`}
                whileHover={{ y: -6 }}
              >
                <div className={`w-14 h-14 rounded-xl ${ritual.bg} border border-current/10 flex items-center justify-center mb-4 ${ritual.color} group-hover:scale-110 transition-transform duration-300`}>
                  <ritual.icon className="text-2xl" />
                </div>
                <h3 className="font-display text-xl font-bold text-charcoal dark:text-white mb-3">{ritual.title}</h3>
                <p className="text-warm-gray-500 dark:text-warm-gray-300 font-body leading-relaxed text-sm">{ritual.description}</p>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════
   6. MATERIALS & TECHNIQUES
   ════════════════════════════════════════════════════════════════ */
function MaterialsSection() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.15 });
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] });
  const imageY = useTransform(scrollYProgress, [0, 1], [60, -60]);

  const pigments = [
    { name: 'Black (Kala)', source: 'Soot from kerosene lamps or burnt mustard oil, mixed with cow-dung binder', color: 'bg-charcoal' },
    { name: 'Red (Lal)', source: 'Kumkum (vermillion), sindoor, or crushed palash flower petals', color: 'bg-mithila-red' },
    { name: 'Yellow (Peela)', source: 'Turmeric powder (haldi), pollen, or bael fruit extract', color: 'bg-mithila-yellow' },
    { name: 'Green (Hara)', source: 'Bilva or neem leaf paste, or a blend of turmeric and indigo', color: 'bg-mithila-green' },
    { name: 'Blue (Neela)', source: 'Indigo (neel) extracted from the Indigofera tinctoria plant', color: 'bg-mithila-blue' },
    { name: 'White (Safed)', source: 'Rice powder paste (pithar), sometimes mixed with gum arabic', color: 'bg-cream-200 border border-warm-gray-300' },
    { name: 'Orange (Narangi)', source: 'A blend of turmeric and sindoor, or marigold petal extract', color: 'bg-mithila-orange' },
  ];

  const tools = [
    { name: 'Bamboo Nib (Kalam)', description: 'A bamboo stick sharpened to a fine point, used for the intricate line work of Kachni paintings' },
    { name: 'Cotton-Wrapped Twigs', description: 'Twigs from neem or mango trees, wrapped in raw cotton to create soft, paintbrush-like strokes' },
    { name: 'Matchsticks', description: 'Used for fine dots and tiny details — the smallest marks that build up elaborate patterns' },
    { name: 'Fingers & Cloth Strips', description: 'Direct finger painting for broad areas, and cloth strips for creating smooth, curved lines' },
  ];

  return (
    <section ref={sectionRef} className="section-padding relative overflow-hidden bg-gradient-dark">
      {/* Background */}
      <div className="absolute inset-0 bg-dots opacity-5" />
      <motion.div
        className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-earth-500/8 blur-3xl"
        animate={{ scale: [1, 1.15, 1] }}
        transition={{ duration: 10, repeat: Infinity }}
      />

      <div className="container-custom relative z-10">
        <SectionHeading
          title="Painting with the Earth"
          subtitle="For centuries, Mithila artists have extracted their entire palette from nature — turmeric yellows, soot blacks, indigo blues, and vermillion reds"
          accent
          centered
          light
        />

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start mt-16" ref={ref}>
          {/* Pigments */}
          <motion.div
            variants={slideInLeft}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
          >
            <h3 className="font-display text-2xl font-bold text-white mb-8 flex items-center gap-3">
              <IoColorPalette className="text-earth-400" />
              The Natural Palette
            </h3>

            <div className="space-y-4">
              {pigments.map((pigment, i) => (
                <motion.div
                  key={pigment.name}
                  className="flex items-start gap-4 group"
                  initial={{ opacity: 0, x: -30 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                >
                  <div className={`w-8 h-8 rounded-lg ${pigment.color} flex-shrink-0 mt-1 shadow-sm group-hover:scale-110 transition-transform`} />
                  <div>
                    <p className="text-white font-display font-semibold">{pigment.name}</p>
                    <p className="text-white/50 font-body text-sm">{pigment.source}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Tools & Techniques */}
          <motion.div
            variants={slideInRight}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
          >
            <h3 className="font-display text-2xl font-bold text-white mb-8 flex items-center gap-3">
              <FaPaintBrush className="text-earth-400" />
              Tools of the Trade
            </h3>

            <div className="space-y-6">
              {tools.map((tool, i) => (
                <motion.div
                  key={tool.name}
                  className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-5 hover:bg-white/10 transition-all duration-300"
                  initial={{ opacity: 0, x: 30 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  whileHover={{ x: 4 }}
                >
                  <p className="text-earth-400 font-display font-semibold mb-1">{tool.name}</p>
                  <p className="text-white/50 font-body text-sm leading-relaxed">{tool.description}</p>
                </motion.div>
              ))}
            </div>

            {/* Traditional surfaces */}
            <div className="mt-8 bg-earth-500/10 border border-earth-500/20 rounded-xl p-6">
              <h4 className="font-display text-lg font-bold text-earth-400 mb-3">Traditional Painting Surfaces</h4>
              <ul className="space-y-2">
                {[
                  'Freshly plastered mud walls (bhitti chitra)',
                  'Earthen floors (aripan)',
                  'Handmade paper (kagaz)',
                  'Canvas cloth (kapda)',
                  'Papier-mâché objects',
                ].map((surface) => (
                  <li key={surface} className="text-white/50 font-body text-sm flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-earth-500 flex-shrink-0" />
                    {surface}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════
   7. CLOSING CTA
   ════════════════════════════════════════════════════════════════ */
function ClosingCTA() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.3 });

  return (
    <section className="relative py-24 overflow-hidden bg-cream-50 dark:bg-warm-gray-900">
      <div className="absolute inset-0 mithila-pattern opacity-20" />

      <motion.div
        ref={ref}
        variants={staggerContainer}
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
        className="container-custom relative z-10 text-center max-w-3xl mx-auto"
      >
        <motion.p variants={fadeUp} className="font-accent text-earth-500 tracking-widest text-sm mb-4">
          कला संग्रह
        </motion.p>
        <motion.h2 variants={fadeUp} className="font-display text-4xl md:text-5xl font-bold text-charcoal dark:text-white mb-6">
          Own a Piece of{' '}
          <span className="bg-gradient-to-r from-earth-50 to-mithila-red bg-clip-text text-transparent">Living Heritage</span>
        </motion.h2>
        <motion.p variants={fadeUp} className="text-warm-gray-500 dark:text-warm-gray-300 font-body text-lg mb-10 leading-relaxed">
          Every Mithila painting in our collection is hand-created by master artists from Madhubani, Bihar — using techniques passed down through generations. When you bring one home, you become part of this 2,500-year story.
        </motion.p>
        <motion.div variants={fadeUp} className="flex flex-wrap items-center justify-center gap-4">
          <motion.a
            href="/shop"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-gradient-gold text-white font-display font-semibold shadow-gold hover:shadow-gold transition-all duration-300 group"
            whileHover={{ scale: 1.05, boxShadow: '0 0 40px rgba(139,105,20,0.4)' }}
            whileTap={{ scale: 0.95 }}
          >
            Explore the Collection
            <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
          </motion.a>
          <motion.a
            href="/commission"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full border-2 border-charcoal dark:border-white text-charcoal dark:text-white font-display font-semibold hover:bg-charcoal hover:text-white dark:hover:bg-white dark:hover:text-charcoal transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Commission Custom Art
          </motion.a>
        </motion.div>
      </motion.div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════
   MAIN PAGE
   ════════════════════════════════════════════════════════════════ */
export default function MithilaHistoryPage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Helmet>
        <title>The History of Mithila Art — 2,500 Years of Sacred Painting | Lalita Pathak Mithila Art Studio</title>
        <meta
          name="description"
          content="Explore the 2,500-year history of Mithila (Madhubani) painting — from ancient wall art in Bihar to UNESCO recognition. Learn about Bharni, Kachni, Tantric, Godhana, and Kohbar styles."
        />
      </Helmet>

      <HeroSection />
      <OriginStory />
      <TimelineSection />
      <ArtStylesSection />
      <CulturalSignificance />
      <MaterialsSection />
      <ClosingCTA />
    </motion.div>
  );
}
