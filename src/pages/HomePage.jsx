import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { useInView } from 'react-intersection-observer';
import Cardone from '../assets/home/Cardone.png';
import Cardtwo from "../assets/home/cardtwo.jpeg";
import Cardthree from "../assets/home/cardthree.png";
import Cardfour from "../assets/home/cardfour.jpeg";
import Cardfive from "../assets/home/cardfive.jpeg";
import Cardsix from "../assets/home/cardsix.png";
import {
  FaPaintBrush,
  FaFeatherAlt,
  FaLeaf,
  FaPalette,
  FaOm,
  FaArrowRight,
  FaChevronLeft,
  FaChevronRight,
  FaInstagram,
  FaHeart,
  FaComment,
  FaStar,
  FaQuoteLeft,
  FaPaperPlane,
} from 'react-icons/fa';
import { IoSparkles } from 'react-icons/io5';

import SectionHeading from '../components/ui/SectionHeading';
import GlassCard from '../components/ui/GlassCard';
import PaintingCard from '../components/ui/PaintingCard';
import { useCart } from '../context/CartContext';
import { paintings, categories } from '../data/paintings';
import { testimonials } from '../data/testimonials';
import { formatPrice, scrollToTop, generateWhatsAppLink } from '../utils/helpers';
import mummyPainting from '../assets/home/Mummy.jpeg';

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

/* ───────────────────── category data ───────────────────── */
const featuredCategories = [
  { name: 'Kohbar', icon: FaOm, description: 'Sacred wedding art', color: 'from-mithila-red to-mithila-orange' },
  { name: 'Tattoo', icon: FaPaintBrush, description: 'Traditional body art', color: 'from-mithila-blue to-mithila-purple' },
  { name: 'Godna', icon: FaFeatherAlt, description: 'Line art traditions', color: 'from-mithila-green to-mithila-blue' },
  { name: 'Nature', icon: FaLeaf, description: 'Flora & fauna motifs', color: 'from-mithila-orange to-mithila-yellow' },
  { name: 'Mythology', icon: FaPalette, description: 'Divine narratives', color: 'from-mithila-pink to-mithila-red' },
];

/* ───────────────────── instagram mock data ───────────────────── */
const instagramPosts = [
  { id: 1, likes: 342, comments: 28, alt: 'Mithila fish motif painting' },
  { id: 2, likes: 518, comments: 45, alt: 'Krishna Leela Madhubani art' },
  { id: 3, likes: 276, comments: 19, alt: 'Peacock traditional painting' },
  { id: 4, likes: 491, comments: 37, alt: 'Tree of Life Mithila art' },
  { id: 5, likes: 389, comments: 31, alt: 'Wedding Kohbar design' },
  { id: 6, likes: 445, comments: 42, alt: 'Durga Mithila painting' },
];

/* ════════════════════════════════════════════════════════════════
   1. HERO SECTION
   ════════════════════════════════════════════════════════════════ */
function HeroSection() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '40%']);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);

  return (
    <section ref={heroRef} className="relative h-screen min-h-[700px] overflow-hidden flex items-center justify-center">
      {/* Parallax Background */}
      <motion.div className="absolute inset-0 z-0" style={{ y, scale }}>
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1582738411706-bfc8e691d1c2?w=1920&q=80')] bg-cover bg-center" />
        <div className="absolute inset-0 bg-gradient-hero" />
        <div className="absolute inset-0 bg-gradient-to-b from-warm-black/70 via-warm-black/40 to-warm-black/80" />
      </motion.div>

      {/* Animated Decorative Elements (Optimized for Performance) */}
      <div className="absolute inset-0 z-[1] pointer-events-none overflow-hidden">
        {/* Floating mandalas */}
        <motion.div
          className="absolute top-20 left-10 w-32 h-32 rounded-full border border-earth-500/20"
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
          style={{ willChange: 'transform' }}
        />
        <motion.div
          className="absolute top-40 right-16 w-20 h-20 rounded-full border border-mithila-yellow/20"
          animate={{ rotate: -360 }}
          transition={{ duration: 50, repeat: Infinity, ease: 'linear' }}
          style={{ willChange: 'transform' }}
        />
        {/* Sparkles removed for CPU performance */}
      </div>

      {/* Content */}
      <motion.div className="relative z-10 text-center px-4 max-w-5xl mx-auto" style={{ opacity }}>
        <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-6">
          {/* Sanskrit tagline */}
          <motion.p
            variants={fadeUp}
            className="font-accent text-cream-300/80 text-lg md:text-xl tracking-widest"
          >
            कला ही जीवन है
          </motion.p>

          {/* Decorative line */}
          <motion.div variants={fadeIn} className="flex items-center justify-center gap-4">
            <span className="h-px w-12 bg-gradient-to-r from-transparent to-earth-500" />
            <IoSparkles className="text-earth-500 text-lg" />
            <span className="h-px w-12 bg-gradient-to-l from-transparent to-earth-500" />
          </motion.div>

          {/* Main heading */}
          <motion.h1
            variants={fadeUp}
            className="heading-xl text-white !leading-[1.1]"
          >
            Discover the{' '}
            <span className="text-gradient-gold">Sacred Art</span>
            <br />
            of Mithila
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={fadeUp}
            className="text-lg md:text-xl text-cream-200/80 font-body max-w-2xl mx-auto leading-relaxed"
          >
            Immerse yourself in centuries-old painting traditions from the heart of Bihar.
            Each piece tells a story of devotion, nature, and the eternal dance of life.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div variants={fadeUp} className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link to="/shop">
              <motion.button
                className="btn-primary flex items-center gap-2 group"
                whileHover={{ scale: 1.05, boxShadow: '0 0 40px rgba(139,105,20,0.4)' }}
                whileTap={{ scale: 0.95 }}
              >
                Shop Collection
                <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </Link>
            <Link to="/gallery">
              <motion.button
                className="btn-ghost flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                View Gallery
              </motion.button>
            </Link>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            variants={fadeIn}
            className="pt-12"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <div className="w-6 h-10 rounded-full border-2 border-cream-300/30 mx-auto flex justify-center">
              <motion.div
                className="w-1.5 h-3 bg-earth-500 rounded-full mt-2"
                animate={{ y: [0, 12, 0], opacity: [1, 0.3, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════
   2. FEATURED CATEGORIES
   ════════════════════════════════════════════════════════════════ */
function FeaturedCategories() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 });

  return (
    <section className="section-padding bg-cream-50 dark:bg-warm-gray-900 relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 mithila-pattern opacity-30" />

      <div className="container-custom relative z-10">
        <SectionHeading
          title="Explore Art Forms"
          subtitle="Journey through the diverse traditions of Mithila painting, each style carrying its own sacred significance"
          accent
          centered
        />

        <motion.div
          ref={ref}
          variants={staggerContainer}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5 mt-16"
        >
          {featuredCategories.map((cat, index) => (
            <motion.div key={cat.name} variants={fadeUp}>
              <Link to={`/gallery?category=${cat.name.toLowerCase()}`}>
                <motion.div
                  className="group relative bg-white dark:bg-warm-gray-800 rounded-2xl p-6 text-center shadow-card hover:shadow-card-hover dark:shadow-none dark:border dark:border-warm-gray-700/50 transition-all duration-500 overflow-hidden"
                  whileHover={{ y: -8, scale: 1.02 }}
                >
                  {/* Gradient overlay on hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${cat.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500 rounded-2xl`} />

                  {/* Icon */}
                  <motion.div
                    className={`w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br ${cat.color} flex items-center justify-center mb-4 shadow-lg`}
                    whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <cat.icon className="text-white text-2xl" />
                  </motion.div>

                  {/* Name */}
                  <h3 className="font-display font-semibold text-charcoal dark:text-cream-100 text-lg mb-1">{cat.name}</h3>
                  <p className="text-warm-gray-500 dark:text-warm-gray-300 text-sm font-body">{cat.description}</p>

                  {/* Arrow */}
                  <motion.div
                    className="mt-3 text-earth-500 opacity-0 group-hover:opacity-100 transition-opacity"
                    initial={{ x: -10 }}
                    whileHover={{ x: 0 }}
                  >
                    <FaArrowRight className="mx-auto text-sm" />
                  </motion.div>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════
   3. FEATURED PAINTINGS (Sticky Horizontal Scroll)
   ════════════════════════════════════════════════════════════════ */
function FeaturedPaintings() {
  const { addItem } = useCart();
  const featured = paintings.slice(0, 6);
  
  // For the desktop sticky horizontal scroll
  const targetRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
  });
  
  // Map vertical scroll progress to horizontal translation.
  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-65%"]);

  // Standard scroll for mobile fallback
  const scrollRefMobile = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = useCallback(() => {
    if (!scrollRefMobile.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRefMobile.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  }, []);

  const scroll = (direction) => {
    if (!scrollRefMobile.current) return;
    const amount = scrollRefMobile.current.clientWidth * 0.7;
    scrollRefMobile.current.scrollBy({ left: direction === 'left' ? -amount : amount, behavior: 'smooth' });
  };

  useEffect(() => {
    const el = scrollRefMobile.current;
    if (el) {
      el.addEventListener('scroll', checkScroll);
      checkScroll();
      return () => el.removeEventListener('scroll', checkScroll);
    }
  }, [checkScroll]);

  return (
    <>
      {/* ────────────────────────────────────────────────────────────────
          DESKTOP: Sticky Horizontal Scroll (Hidden on smaller screens)
          ──────────────────────────────────────────────────────────────── */}
      <section ref={targetRef} className="hidden lg:block relative h-[300vh] bg-gradient-warm">
        <div className="sticky top-0 h-screen flex flex-col justify-center overflow-hidden">
          <div className="absolute inset-0 noise pointer-events-none" />
          
          <div className="container-custom relative z-10 mb-12 mt-12">
            <SectionHeading
              title="Featured Collection"
              subtitle="Hand-picked masterpieces that embody the soul of Mithila tradition"
              accent
            />
          </div>

          <div className="relative z-10 flex">
            <motion.div style={{ x }} className="flex gap-10 px-[10vw]">
              {featured.map((painting, i) => (
                <div key={painting.id} className="w-[420px] flex-shrink-0">
                  <PaintingCard painting={painting} onAddToCart={() => addItem(painting)} />
                </div>
              ))}
              
              {/* View Full Collection Card at the end */}
              <div className="w-[320px] flex-shrink-0 flex items-center justify-center">
                <Link to="/shop" className="group flex flex-col items-center justify-center gap-6 text-earth-500 hover:text-earth-600 transition-colors bg-white/40 dark:bg-warm-gray-800/40 backdrop-blur-md border border-earth-500/20 rounded-2xl p-8 w-full h-[70%] shadow-card">
                  <span className="font-display font-semibold text-3xl text-center leading-tight">View Full<br/>Collection</span>
                  <div className="w-16 h-16 rounded-full bg-gradient-gold text-white flex items-center justify-center group-hover:scale-110 shadow-gold transition-transform">
                    <FaArrowRight className="text-2xl" />
                  </div>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────────────
          MOBILE: Native Horizontal Swipe Carousel (Visible only < lg)
          ──────────────────────────────────────────────────────────────── */}
      <section className="lg:hidden section-padding bg-gradient-warm relative overflow-hidden">
        <div className="absolute inset-0 noise pointer-events-none" />

        <div className="container-custom relative z-10">
          <div className="flex items-end justify-between mb-8">
            <SectionHeading
              title="Featured Collection"
              subtitle="Hand-picked masterpieces that embody the soul of Mithila tradition"
              accent
            />
            {/* Manual arrows on tablet/mobile */}
            <div className="hidden sm:flex gap-3">
              <button
                onClick={() => scroll('left')}
                className={`w-11 h-11 min-w-[44px] min-h-[44px] rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                  canScrollLeft
                    ? 'border-earth-500 text-earth-500 hover:bg-earth-500 hover:text-white'
                    : 'border-warm-gray-200 text-warm-gray-300 opacity-50'
                }`}
              >
                <FaChevronLeft className="text-sm" />
              </button>
              <button
                onClick={() => scroll('right')}
                className={`w-11 h-11 min-w-[44px] min-h-[44px] rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                  canScrollRight
                    ? 'border-earth-500 text-earth-500 hover:bg-earth-500 hover:text-white'
                    : 'border-warm-gray-200 text-warm-gray-300 opacity-50'
                }`}
              >
                <FaChevronRight className="text-sm" />
              </button>
            </div>
          </div>

          <div
            ref={scrollRefMobile}
            className="flex gap-4 overflow-x-auto pb-6 snap-x snap-mandatory scrollbar-hide"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {featured.map((painting, i) => (
              <div
                key={painting.id}
                className="flex-shrink-0 w-[280px] sm:w-[320px] snap-center"
              >
                <PaintingCard painting={painting} onAddToCart={() => addItem(painting)} />
              </div>
            ))}
          </div>

          <div className="text-center mt-6">
            <Link to="/shop" className="group inline-flex items-center gap-2 text-earth-500 font-display font-semibold text-lg hover:text-earth-600 transition-colors">
              View Full Collection
              <FaArrowRight className="group-hover:translate-x-2 transition-transform duration-300" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

/* ════════════════════════════════════════════════════════════════
   4. ABOUT PREVIEW
   ════════════════════════════════════════════════════════════════ */
function AboutPreview() {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] });
  const imageY = useTransform(scrollYProgress, [0, 1], [60, -60]);
  const textY = useTransform(scrollYProgress, [0, 1], [40, -40]);
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 });

  return (
    <section ref={sectionRef} className="section-padding relative overflow-hidden bg-charcoal">
      {/* Background decorations */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-dark" />
        <div className="absolute inset-0 bg-dots opacity-5" />
        <motion.div
          className="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-earth-500/5 blur-3xl"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 10, repeat: Infinity }}
        />
      </div>

      <div className="container-custom relative z-10" ref={ref}>
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Image side */}
          <motion.div
            variants={slideInLeft}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
            className="relative"
            style={{ y: imageY }}
          >
            <div className="relative">
              {/* Main image */}
              <motion.div
                className="rounded-2xl overflow-hidden shadow-glass-lg"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.5 }}
              >
                <img
                  src={mummyPainting}
                  alt="Artist Lalita Pathak painting a Mithila artwork"
                  className="w-full h-auto min-h-[300px] max-h-[500px] object-cover"
                />
              </motion.div>

              {/* Floating accent card */}
              <motion.div
                className="absolute -bottom-6 -right-6 glass-card p-4 rounded-xl"
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                <p className="font-accent text-earth-500 text-sm">५०० से अधिक पेंटिंग</p>
                <p className="font-display text-2xl font-bold text-charcoal dark:text-white">500+</p>
                <p className="text-warm-gray-500 dark:text-warm-gray-300 text-sm">Original Artworks</p>
              </motion.div>

              {/* Decorative border */}
              <div className="absolute -top-4 -left-4 w-24 h-24 border-l-4 border-t-4 border-earth-500/30 rounded-tl-2xl" />
            </div>
          </motion.div>

          {/* Text side */}
          <motion.div
            variants={slideInRight}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
            className="space-y-6"
            style={{ y: textY }}
          >
            <motion.p className="font-accent text-earth-400 tracking-widest text-sm uppercase">
              The Artist's Journey
            </motion.p>

            <h2 className="heading-lg text-white">
              Where Tradition Meets <span className="text-gradient-gold">Soul</span>
            </h2>

            <div className="space-y-4">
              <p className="text-white/80 font-body text-lg leading-relaxed">
                From Satlakha Pathak Tola, Rahika, Madhubani, artist <strong className="text-earth-400">Lalita Kumari Pathak</strong> carries
                forward a sacred tradition — trained under the guidance of Hira Devi and Rani Jha, with over 25 years of mastery.
              </p>
              <p className="text-white/60 font-body leading-relaxed">
                Each brushstroke is a prayer, each motif a meditation. From the fish of fertility to the lotus of
                creation, her paintings breathe life into walls and canvases, connecting the modern world with
                ancient Maithil wisdom.
              </p>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-6 py-6 border-t border-b border-white/10">
              {[
                { number: '25+', label: 'Years' },
                { number: '500+', label: 'Artworks' },
                { number: '12', label: 'Awards' },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="font-display text-3xl font-bold text-gradient-gold">{stat.number}</p>
                  <p className="text-white/60 text-sm font-body mt-1">{stat.label}</p>
                </div>
              ))}
            </div>

            <Link to="/about">
              <motion.button
                className="btn-primary mt-4 flex items-center gap-2 group"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Read Full Story
                <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════
   5. TESTIMONIALS CAROUSEL
   ════════════════════════════════════════════════════════════════ */
function TestimonialsSection() {
  const [current, setCurrent] = useState(0);
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 });
  const displayTestimonials = testimonials.slice(0, 3);

  // Auto-advance
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % displayTestimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [displayTestimonials.length]);

  return (
    <section className="section-padding relative overflow-hidden bg-cream-50 dark:bg-warm-gray-900">
      <div className="absolute inset-0 mithila-pattern opacity-20" />
      <div className="absolute inset-0 bg-gradient-to-b from-cream-50 via-transparent to-cream-50 dark:from-warm-gray-900 dark:to-warm-gray-900" />

      <div className="container-custom relative z-10">
        <SectionHeading
          title="Words of Love"
          subtitle="Hear from collectors and art lovers who have welcomed Mithila art into their homes"
          accent
          centered
        />

        <div className="mt-16 max-w-4xl mx-auto" ref={ref}>
          <div className="relative min-h-[320px]">
            <AnimatePresence mode="wait">
              {displayTestimonials.map(
                (testimonial, index) =>
                  index === current && (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 30, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -30, scale: 0.95 }}
                      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                      className="absolute inset-0"
                    >
                      <GlassCard className="p-8 md:p-12 text-center relative overflow-hidden">
                        {/* Quote icon */}
                        <FaQuoteLeft className="text-earth-500/20 text-5xl mx-auto mb-6" />

                        {/* Stars */}
                        <div className="flex justify-center gap-1 mb-6">
                          {[...Array(5)].map((_, i) => (
                            <FaStar key={i} className="text-earth-500 text-lg" />
                          ))}
                        </div>

                        {/* Quote */}
                        <p className="text-charcoal dark:text-cream-200 font-body text-base sm:text-lg md:text-xl leading-relaxed italic mb-8 max-w-2xl mx-auto break-words whitespace-normal">
                          &ldquo;{testimonial.text}&rdquo;
                        </p>

                        {/* Author */}
                        <div className="flex items-center justify-center gap-4">
                          <div className="w-14 h-14 rounded-full bg-gradient-gold flex items-center justify-center text-white font-display font-bold text-xl shadow-gold">
                            {testimonial.name.charAt(0)}
                          </div>
                          <div className="text-left">
                            <p className="font-display font-semibold text-charcoal dark:text-cream-100 text-lg">{testimonial.name}</p>
                            <p className="text-warm-gray-500 dark:text-warm-gray-300 text-sm font-body">{testimonial.location}</p>
                          </div>
                        </div>
                      </GlassCard>
                    </motion.div>
                  )
              )}
            </AnimatePresence>
          </div>

          {/* Dots */}
          <div className="flex justify-center gap-3 mt-8">
            {displayTestimonials.map((_, index) => (
              <motion.button
                key={index}
                onClick={() => setCurrent(index)}
                className={`rounded-full transition-all duration-300 ${
                  index === current
                    ? 'w-8 h-3 bg-gradient-gold shadow-gold'
                    : 'w-3 h-3 bg-warm-gray-300 hover:bg-earth-400'
                }`}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════
   6. INSTAGRAM SECTION
   ════════════════════════════════════════════════════════════════ */
function InstagramSection() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  const mithilaColors = [
    'from-mithila-red/20 to-mithila-orange/20',
    'from-mithila-blue/20 to-mithila-purple/20',
    'from-mithila-green/20 to-mithila-yellow/20',
    'from-mithila-orange/20 to-mithila-red/20',
    'from-mithila-pink/20 to-mithila-blue/20',
    'from-mithila-yellow/20 to-mithila-green/20',
  ];

  return (
    <section className="section-padding bg-white relative overflow-hidden">
      <div className="container-custom relative z-10">
        <SectionHeading
          title="Follow the Journey"
          subtitle="@lalita.pathak.7771 — Behind the scenes, new creations, and the spirit of Madhubani"
          accent
          centered
        />

        <motion.div
          ref={ref}
          variants={staggerContainer}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-12"
        >
          {instagramPosts.map((post, index) => (
            <motion.div
              key={post.id}
              variants={scaleUp}
              className="group relative aspect-square rounded-2xl overflow-hidden cursor-pointer"
            >	
			<img
			 src={
			  index === 0
			  ? Cardone
			  : index === 1
			  ? Cardtwo
			  : index === 2
			  ? Cardthree
			  : index === 3
			  ? Cardfour
			  : index === 4
			  ? Cardfive
			  : index === 5
			  ? Cardsix
			  : post.image
			 }
			 alt=""
			 className="absolute inset-0 w-full h-full object-cover"
			/>
              {/* Hover overlay */}
              <motion.div
                className="absolute inset-0 bg-charcoal/70 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500"
              >
                <div className="text-white text-center">
                  <div className="flex items-center justify-center gap-6 mb-3">
                    <span className="flex items-center gap-2">
                      <FaHeart className="text-mithila-red" /> {post.likes}
                    </span>
                    <span className="flex items-center gap-2">
                      <FaComment /> {post.comments}
                    </span>
                  </div>
                  <p className="text-sm text-cream-200/80">{post.alt}</p>
                </div>
              </motion.div>

              {/* Scale on hover */}
              <motion.div
                className="absolute inset-0"
                whileHover={{ scale: 1.08 }}
                transition={{ duration: 0.5 }}
              />
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="text-center mt-10"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.8 }}
        >
          <a
            href="https://instagram.com/lalita.pathak.7771"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-8 py-3 rounded-full border-2 border-charcoal text-charcoal font-display font-semibold hover:bg-charcoal hover:text-white transition-all duration-300 group"
          >
            <FaInstagram className="text-xl group-hover:rotate-12 transition-transform" />
            Follow on Instagram
          </a>
        </motion.div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════
   7. NEWSLETTER
   ════════════════════════════════════════════════════════════════ */
function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.3 });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      // No email backend wired — redirect to WhatsApp so the artist can follow up
      window.open(
        `https://wa.me/919142168466?text=${encodeURIComponent(`Hi! I want updates on Mithila Art. My email: ${email}`)}`,
        '_blank'
      );
      setSubmitted(true);
      setEmail('');
      setTimeout(() => setSubmitted(false), 4000);
    }
  };

  return (
    <section className="relative py-24 overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-dark" />
      <div className="absolute inset-0 bg-dots opacity-5" />

      {/* Animated blobs */}
      <motion.div
        className="absolute top-10 left-10 w-72 h-72 rounded-full bg-earth-500/10 blur-3xl"
        animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
        transition={{ duration: 12, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-mithila-red/5 blur-3xl"
        animate={{ x: [0, -40, 0], y: [0, 30, 0] }}
        transition={{ duration: 15, repeat: Infinity }}
      />

      <div className="container-custom relative z-10 text-center" ref={ref}>
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="max-w-2xl mx-auto"
        >
          <motion.div variants={fadeUp}>
            <p className="font-accent text-earth-400 tracking-widest text-sm mb-4">समाचार पत्र</p>
          </motion.div>

          <motion.h2 variants={fadeUp} className="heading-lg text-white mb-4">
            Stay Connected with <span className="text-gradient-gold">Mithila Art</span>
          </motion.h2>

          <motion.p variants={fadeUp} className="text-white/70 font-body text-lg mb-10">
            Receive updates on new paintings, exhibition announcements, and stories from the ancient art tradition of Madhubani.
          </motion.p>

          <motion.form variants={fadeUp} onSubmit={handleSubmit} className="relative max-w-lg mx-auto">
            <AnimatePresence mode="wait">
              {!submitted ? (
                <motion.div
                  key="form"
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="flex gap-3"
                >
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    required
                    className="flex-1 px-6 py-4 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-white/30 font-body focus:outline-none focus:ring-2 focus:ring-earth-500 focus:border-transparent transition-all duration-300"
                  />
                  <motion.button
                    type="submit"
                    className="btn-primary !px-6 flex items-center gap-2"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FaPaperPlane />
                    <span className="hidden sm:inline">Subscribe</span>
                  </motion.button>
                </motion.div>
              ) : (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center justify-center gap-3 py-4 px-6 rounded-full bg-mithila-green/20 border border-mithila-green/30 text-mithila-green-light"
                >
                  <IoSparkles className="text-xl" />
                  <span className="font-body font-medium">Thanks! We’ll be in touch via WhatsApp 🙏</span>
                </motion.div>
              )}
            </AnimatePresence>

            <p className="text-white/30 text-xs mt-4 font-body">
              We respect your privacy. Unsubscribe anytime.
            </p>
          </motion.form>
        </motion.div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════
   MAIN HOME PAGE
   ════════════════════════════════════════════════════════════════ */
export default function HomePage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Helmet>
        <title>Lalita Pathak Mithila Art Studio — Authentic Madhubani Paintings by Lalita Pathak</title>
        <meta
          name="description"
          content="Discover authentic Mithila (Madhubani) paintings by award-winning artist Lalita Pathak. Hand-painted on handmade paper using natural pigments. Shop sacred art rooted in centuries of Bihar tradition."
        />
        <meta name="keywords" content="Mithila art, Madhubani painting, Indian folk art, Bihar art, traditional painting, Lalita Pathak" />
        <link rel="canonical" href="https://lalitapathakart.com" />
      </Helmet>
        <HeroSection />
        <FeaturedCategories />
        <FeaturedPaintings />
        <AboutPreview />
        <TestimonialsSection />
        <InstagramSection />
        <NewsletterSection />
    </motion.div>
  );
}
