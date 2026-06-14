import React, { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useMotionValue, useSpring, useInView as useMotionInView } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { useInView } from 'react-intersection-observer';
import {
  FaPaintBrush,
  FaGraduationCap,
  FaAward,
  FaGlobe,
  FaStar,
  FaHeart,
  FaQuoteLeft,
  FaMedal,
  FaCertificate,
  FaHandsHelping,
} from 'react-icons/fa';
import { IoSparkles, IoFlower } from 'react-icons/io5';

import SectionHeading from '../components/ui/SectionHeading';
import GlassCard from '../components/ui/GlassCard';
import { formatPrice, generateWhatsAppLink } from '../utils/helpers';

/* ───────── Animation Variants ───────── */
const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.2 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } },
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.6 } },
};

const slideInLeft = {
  hidden: { opacity: 0, x: -60 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } },
};

const slideInRight = {
  hidden: { opacity: 0, x: 60 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } },
};

const scaleUp = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: 'easeOut' } },
};

/* ───────── Animated Counter Component ───────── */
function AnimatedCounter({ target, suffix = '', duration = 2 }) {
  const nodeRef = useRef(null);
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.5 });
  const motionVal = useMotionValue(0);
  const springVal = useSpring(motionVal, { duration: duration * 1000, bounce: 0 });

  useEffect(() => {
    if (inView) {
      motionVal.set(target);
    }
  }, [inView, motionVal, target]);

  useEffect(() => {
    const unsubscribe = springVal.on('change', (latest) => {
      if (nodeRef.current) {
        nodeRef.current.textContent = Math.floor(latest) + suffix;
      }
    });
    return unsubscribe;
  }, [springVal, suffix]);

  return <span ref={(el) => { nodeRef.current = el; ref(el); }}>0{suffix}</span>;
}

/* ═══════════════════════════════════════════════
   1. HERO
   ═══════════════════════════════════════════════ */
function AboutHero() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '35%']);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);

  return (
    <section ref={heroRef} className="relative h-[75vh] min-h-[550px] overflow-hidden flex items-center justify-center">
      {/* Parallax BG */}
      <motion.div className="absolute inset-0" style={{ y, scale }}>
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1582738411706-bfc8e691d1c2?w=1920&q=80')] bg-cover bg-center" />
        <div className="absolute inset-0 bg-gradient-to-b from-warm-black/80 via-warm-black/50 to-warm-black/90" />
      </motion.div>

      {/* Decorative rings */}
      <div className="absolute inset-0 pointer-events-none z-[1]">
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full border border-earth-500/10"
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] rounded-full border border-dashed border-cream-300/5"
          animate={{ rotate: -360 }}
          transition={{ duration: 80, repeat: Infinity, ease: 'linear' }}
        />
      </div>

      {/* Content */}
      <motion.div className="relative z-10 text-center px-4" style={{ opacity }}>
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="space-y-5"
        >
          <motion.p variants={fadeUp} className="font-accent text-earth-400 tracking-[0.3em] text-sm uppercase">
            कलाकार की कहानी
          </motion.p>

          <motion.div variants={fadeIn} className="flex items-center justify-center gap-4">
            <span className="h-px w-16 bg-gradient-to-r from-transparent to-earth-500" />
            <IoFlower className="text-earth-500" />
            <span className="h-px w-16 bg-gradient-to-l from-transparent to-earth-500" />
          </motion.div>

          <motion.h1 variants={fadeUp} className="heading-xl text-white">
            Lalita <span className="text-gradient-gold">Pathak</span>
          </motion.h1>

          <motion.p variants={fadeUp} className="text-warm-gray-200/80 font-body text-lg md:text-xl max-w-xl mx-auto">
            Master Mithila artist with over 25 years of experience, preserving and evolving the sacred painting traditions of Madhubani, Bihar
          </motion.p>
        </motion.div>
      </motion.div>
    </section>
  );
}

/* ═══════════════════════════════════════════════
   2. ARTIST STORY & TIMELINE
   ═══════════════════════════════════════════════ */
const timelineEvents = [
  {
    year: 'Early Years',
    title: 'Roots in Satlakha Pathak Tola, Rahika',
    description:
      'Born and raised in Satlakha Pathak Tola, Rahika, in the heart of the Madhubani district, Bihar. Growing up surrounded by the vibrant wall paintings of her ancestral home, art was woven into every aspect of daily life.',
    icon: FaHeart,
    color: 'bg-mithila-red',
  },
  {
    year: 'Childhood',
    title: 'Learning the Sacred Tradition',
    description:
      'Trained under the guidance of renowned Mithila artists Hira Devi and Rani Jha, mastering the Bharni, Kachni, and Kohbar styles that have been passed down through generations in the Madhubani region.',
    icon: FaPaintBrush,
    color: 'bg-mithila-orange',
  },
  {
    year: '2000s',
    title: 'Academic Foundation & Craft',
    description:
      'Earned a Diploma in Mithila Painting, followed by an MA and B.Ed, combining formal education with deep traditional knowledge. Her mastery of natural pigments and intricate line work distinguished her as a rising talent in the Madhubani art community.',
    icon: FaStar,
    color: 'bg-earth-500',
  },
  {
    year: '2010s',
    title: 'Growing Recognition',
    description:
      'With over a decade of experience, her paintings gained recognition beyond Bihar. Collectors from across India began commissioning her work, drawn to the authenticity and spiritual depth of her traditional compositions.',
    icon: FaGlobe,
    color: 'bg-mithila-blue',
  },
  {
    year: '2020s',
    title: 'Master Artist & Teacher',
    description:
      'With more than 25 years of experience, Lalita Kumari Pathak has established herself as a master of Mithila painting. She now trains aspiring artists in the traditional techniques, ensuring this sacred art form continues to thrive for future generations.',
    icon: FaGraduationCap,
    color: 'bg-mithila-green',
  },
  {
    year: 'Today',
    title: 'Lalita Pathak Mithila Art Studio',
    description:
      'Operating from Satlakha Pathak Tola, Rahika, Madhubani, her studio is both a creative sanctuary and a bridge between ancient tradition and the modern world — offering authentic handmade Mithila paintings to collectors worldwide.',
    icon: IoSparkles,
    color: 'bg-mithila-purple',
  },
];

function ArtistTimeline() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.05 });

  return (
    <section className="section-padding bg-cream-50 relative overflow-hidden">
      <div className="absolute inset-0 mithila-pattern opacity-20" />

      <div className="container-custom relative z-10">
        <SectionHeading
          title="The Journey"
          subtitle="From the mud walls of Madhubani to the galleries of the world"
          accent
          centered
        />

        <div className="mt-16 relative" ref={ref}>
          {/* Central line */}
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-earth-500/40 via-earth-500/20 to-transparent md:-translate-x-px" />

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
            className="space-y-12 md:space-y-16"
          >
            {timelineEvents.map((event, index) => {
              const isLeft = index % 2 === 0;
              return (
                <motion.div
                  key={event.year}
                  variants={isLeft ? slideInLeft : slideInRight}
                  className={`relative flex flex-col md:flex-row items-start md:items-center gap-6 ${
                    isLeft ? 'md:flex-row' : 'md:flex-row-reverse'
                  }`}
                >
                  {/* Content card */}
                  <div className={`w-full md:w-5/12 pl-12 md:pl-0 ${isLeft ? 'md:text-right' : 'md:text-left'}`}>
                    <GlassCard hover className="p-6 md:p-8">
                      <span className="inline-block font-accent text-earth-500 text-sm tracking-wider mb-2">
                        {event.year}
                      </span>
                      <h3 className="font-display text-xl md:text-2xl font-bold text-charcoal dark:text-warm-gray-100 mb-3">
                        {event.title}
                      </h3>
                      <p className="text-warm-gray-500 dark:text-warm-gray-300 font-body leading-relaxed text-sm md:text-base">
                        {event.description}
                      </p>
                    </GlassCard>
                  </div>

                  {/* Center dot */}
                  <div className="absolute left-4 md:left-1/2 md:-translate-x-1/2 flex-shrink-0 z-10">
                    <motion.div
                      className={`w-10 h-10 rounded-full ${event.color} flex items-center justify-center shadow-lg`}
                      whileHover={{ scale: 1.2, rotate: 360 }}
                      transition={{ duration: 0.5 }}
                    >
                      <event.icon className="text-white text-sm" />
                    </motion.div>
                  </div>

                  {/* Spacer for opposite side */}
                  <div className="hidden md:block w-5/12" />
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════
   3. PHILOSOPHY SECTION
   ═══════════════════════════════════════════════ */
function PhilosophySection() {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] });
  const bgY = useTransform(scrollYProgress, [0, 1], [40, -40]);
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 });

  return (
    <section ref={sectionRef} className="relative py-24 overflow-hidden bg-charcoal">
      {/* Parallax decorations */}
      <motion.div className="absolute inset-0 pointer-events-none" style={{ y: bgY }}>
        <div className="absolute inset-0 bg-gradient-dark" />
        <div className="absolute inset-0 bg-dots opacity-5" />
        <motion.div
          className="absolute -top-20 right-0 w-96 h-96 rounded-full bg-earth-500/5 blur-3xl"
          animate={{ scale: [1, 1.3, 1] }}
          transition={{ duration: 12, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-0 left-0 w-72 h-72 rounded-full bg-mithila-red/5 blur-3xl"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 10, repeat: Infinity, delay: 3 }}
        />
      </motion.div>

      <div className="container-custom relative z-10 max-w-4xl mx-auto" ref={ref}>
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="space-y-10"
        >
          {/* Mithila border top */}
          <motion.div variants={fadeIn} className="border-mithila-top pt-12" />

          <motion.div variants={fadeUp} className="text-center">
            <p className="font-accent text-earth-400 tracking-[0.3em] text-sm uppercase mb-4">दर्शन</p>
            <h2 className="heading-lg text-white mb-6">
              The Philosophy of <span className="text-gradient-gold">Sacred Lines</span>
            </h2>
          </motion.div>

          <motion.div variants={fadeUp} className="relative">
            <FaQuoteLeft className="text-earth-500/15 text-6xl absolute -top-4 -left-4" />
            <blockquote className="text-warm-gray-200/90 font-body text-lg md:text-xl leading-relaxed italic pl-8 md:pl-12 space-y-6">
              <p>
                In Mithila painting, every line is a prayer, every colour is an offering. We do not merely decorate walls —
                we invoke the divine. The fish symbolises fertility, the lotus represents creation, the peacock brings beauty,
                and the bamboo grove speaks of resilience.
              </p>
              <p>
                My grandmother taught me that the act of painting is itself a meditation. When your hand moves with
                devotion, the brush becomes an extension of your soul. The patterns we create are not just aesthetic — they
                are mantras rendered visible, protecting the home and blessing all who dwell within.
              </p>
              <p>
                I believe that ancient art is not a relic of the past. It is a living, breathing tradition that must evolve
                while honouring its roots. My mission is to carry this sacred flame forward, ensuring that the daughters of
                Mithila never forget the language of their ancestors.
              </p>
            </blockquote>
          </motion.div>

          <motion.div variants={fadeUp} className="text-right">
            <p className="font-display text-earth-400 font-semibold text-lg">— Lalita Pathak</p>
            <p className="text-warm-gray-300/60 text-sm font-body">Artist & Cultural Ambassador</p>
          </motion.div>

          {/* Mithila border bottom */}
          <motion.div variants={fadeIn} className="border-mithila-bottom pb-2" />
        </motion.div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════
   4. STATS COUNTERS
   ═══════════════════════════════════════════════ */
const stats = [
  { number: 500, suffix: '+', label: 'Original Paintings', icon: FaPaintBrush, description: 'Hand-painted masterpieces on handmade paper' },
  { number: 25, suffix: '+', label: 'Years of Artistry', icon: FaStar, description: 'Dedicated to preserving Mithila tradition' },
  { number: 200, suffix: '+', label: 'Happy Collectors', icon: FaHandsHelping, description: 'Art lovers worldwide treasure her work' },
  { number: 8, suffix: '+', label: 'Painting Styles', icon: FaMedal, description: 'Mastered across traditional Mithila forms' },
];

function StatsSection() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.3 });

  return (
    <section className="section-padding bg-gradient-warm relative overflow-hidden">
      <div className="absolute inset-0 noise pointer-events-none" />

      <div className="container-custom relative z-10" ref={ref}>
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8"
        >
          {stats.map((stat) => (
            <motion.div key={stat.label} variants={scaleUp}>
              <GlassCard hover className="p-6 md:p-8 text-center group">
                {/* Icon */}
                <motion.div
                  className="w-14 h-14 mx-auto rounded-2xl bg-gradient-gold flex items-center justify-center mb-5 shadow-gold"
                  whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
                >
                  <stat.icon className="text-white text-xl" />
                </motion.div>

                {/* Number */}
                <p className="font-display text-4xl md:text-5xl font-bold text-gradient-gold mb-2">
                  <AnimatedCounter target={stat.number} suffix={stat.suffix} />
                </p>

                {/* Label */}
                <p className="font-display font-semibold text-charcoal text-lg mb-1">{stat.label}</p>
                <p className="text-warm-gray-500 text-sm font-body">{stat.description}</p>
              </GlassCard>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════
   5. AWARDS SECTION
   ═══════════════════════════════════════════════ */
const achievements = [
  {
    year: '25+',
    title: 'Years of Mastery',
    org: 'Satlakha Pathak Tola, Rahika, Madhubani',
    description: 'Over 25 years dedicated to perfecting the ancient art of Mithila painting — trained under Hira Devi and Rani Jha, with a Diploma in Mithila Painting, MA, and B.Ed.',
  },
  {
    year: '8+',
    title: 'Traditional Styles Mastered',
    org: 'Bharni, Kachni, Kohbar, Godhana, Tantric & more',
    description: 'Proficiency across all major Mithila painting styles, from the bold Bharni to the delicate line-work of Kachni.',
  },
  {
    year: '500+',
    title: 'Original Paintings Created',
    org: 'Handmade Paper & Natural Pigments',
    description: 'Each painting crafted using traditional materials — turmeric, vermillion, neem, indigo — honouring the ancestral practice.',
  },
  {
    year: '200+',
    title: 'Collectors Worldwide',
    org: 'India & International',
    description: 'Art lovers from across India and around the world have welcomed her authentic Mithila paintings into their homes.',
  },
  {
    year: 'Active',
    title: 'Teaching & Mentoring',
    org: 'Next Generation of Artists',
    description: 'Training young artists from rural Madhubani in traditional Mithila painting techniques, ensuring the art form thrives.',
  },
  {
    year: 'Today',
    title: 'Studio & Online Presence',
    org: 'Lalita Pathak Mithila Art Studio',
    description: 'Bringing authentic Madhubani paintings to a global audience through her studio in Rahika and her online collection.',
  },
];

function AwardsSection() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section className="section-padding bg-cream-50 relative overflow-hidden">
      <div className="absolute inset-0 mithila-pattern opacity-15" />

      <div className="container-custom relative z-10">
        <SectionHeading
          title="Achievements & Milestones"
          subtitle="A lifetime of dedication to preserving the sacred art of Mithila"
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
          {achievements.map((award, index) => (
            <motion.div key={award.title} variants={fadeUp}>
              <GlassCard hover className="p-6 md:p-8 h-full relative overflow-hidden group">
                {/* Year badge */}
                <div className="absolute top-4 right-4">
                  <span className="px-3 py-1 rounded-full bg-earth-500/10 text-earth-500 text-xs font-display font-semibold">
                    {award.year}
                  </span>
                </div>

                {/* Icon */}
                <motion.div
                  className="w-12 h-12 rounded-xl bg-gradient-gold flex items-center justify-center mb-5 shadow-gold"
                  whileHover={{ scale: 1.1, rotate: 10 }}
                >
                  {index % 2 === 0 ? (
                    <FaAward className="text-white text-lg" />
                  ) : (
                    <FaCertificate className="text-white text-lg" />
                  )}
                </motion.div>

                <h3 className="font-display text-lg font-bold text-charcoal mb-2 pr-16">
                  {award.title}
                </h3>
                <p className="text-earth-500 text-sm font-body font-medium mb-3">{award.org}</p>
                <p className="text-warm-gray-500 text-sm font-body leading-relaxed">{award.description}</p>

                {/* Decorative corner */}
                <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-earth-500/10 rounded-br-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
              </GlassCard>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════
   CTA SECTION
   ═══════════════════════════════════════════════ */
function CTASection() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.3 });

  return (
    <section className="py-24 relative overflow-hidden bg-charcoal">
      <div className="absolute inset-0 bg-gradient-dark" />
      <div className="absolute inset-0 bg-dots opacity-5" />

      <motion.div
        className="absolute top-0 left-1/4 w-72 h-72 rounded-full bg-earth-500/5 blur-3xl"
        animate={{ y: [0, 20, 0] }}
        transition={{ duration: 8, repeat: Infinity }}
      />

      <div className="container-custom relative z-10 text-center max-w-3xl mx-auto px-4" ref={ref}>
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="space-y-6"
        >
          <motion.h2 variants={fadeUp} className="heading-lg text-white">
            Commission a <span className="text-gradient-gold">Custom Painting</span>
          </motion.h2>
          <motion.p variants={fadeUp} className="text-warm-gray-200/80 font-body text-lg">
            Have a special vision in mind? Lalita Pathak accepts personal commissions for weddings,
            festivals, home blessings, and corporate art installations.
          </motion.p>
          <motion.div variants={fadeUp} className="flex flex-wrap justify-center gap-4 pt-4">
            <motion.a
              href="/contact"
              className="btn-primary inline-flex items-center gap-2"
              whileHover={{ scale: 1.05, boxShadow: '0 0 40px rgba(139,105,20,0.4)' }}
              whileTap={{ scale: 0.95 }}
            >
              Get in Touch
            </motion.a>
            <motion.a
              href="/gallery"
              className="btn-ghost inline-flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              View Portfolio
            </motion.a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════
   MAIN ABOUT PAGE
   ═══════════════════════════════════════════════ */
export default function AboutPage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Helmet>
        <title>About Lalita Pathak — Lalita Pathak Mithila Art Studio | Madhubani Artist</title>
        <meta
          name="description"
          content="Learn about Lalita Pathak, an award-winning Mithila (Madhubani) artist from Bihar, India. Discover her journey from learning sacred art from her grandmother to becoming a UNESCO Cultural Ambassador."
        />
        <meta name="keywords" content="Lalita Pathak, Mithila artist, Madhubani painter, Bihar folk art, Indian contemporary art" />
        <link rel="canonical" href="https://lalitapathakart.com/about" />
      </Helmet>
        <AboutHero />
        <ArtistTimeline />
        <PhilosophySection />
        <StatsSection />
        <AwardsSection />
        <CTASection />
    </motion.div>
  );
}
