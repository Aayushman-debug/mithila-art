import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { useInView } from 'react-intersection-observer';
import {
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaPaperPlane,
  FaInstagram,
  FaFacebookF,
  FaTwitter,
  FaPinterestP,
  FaYoutube,
  FaWhatsapp,
  FaClock,
  FaCheckCircle,
  FaExclamationCircle,
} from 'react-icons/fa';
import { IoSparkles, IoFlower } from 'react-icons/io5';

import SectionHeading from '../components/ui/SectionHeading';
import GlassCard from '../components/ui/GlassCard';
import { scrollToTop, generateWhatsAppLink } from '../utils/helpers';
import { useAuth } from '../context/AuthContext';

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
  hidden: { opacity: 0, x: -50 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } },
};

const slideInRight = {
  hidden: { opacity: 0, x: 50 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } },
};

const scaleUp = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
};

/* ───────── Validation helpers ───────── */
const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const validatePhone = (phone) => !phone || /^[\d\s+\-()]{7,15}$/.test(phone);

/* ───────── Contact Info Data ───────── */
const contactCards = [
  {
    icon: FaPhone,
    title: 'Phone',
    primary: '+91 91421 68466',
    secondary: 'Call or WhatsApp',
    link: 'tel:+919142168466',
    color: 'bg-mithila-green',
  },
  {
    icon: FaEnvelope,
    title: 'Email',
    primary: 'pathaklalita129@gmail.com',
    secondary: 'We reply within 24 hours',
    link: 'mailto:pathaklalita129@gmail.com',
    color: 'bg-mithila-blue',
  },
  {
    icon: FaMapMarkerAlt,
    title: 'Studio Address',
    primary: 'Satlakha Pathak Tola, Rahika',
    secondary: 'Madhubani, Bihar 847238, India',
    link: 'https://maps.google.com/?q=Rahika,Madhubani,Bihar,India',
    color: 'bg-mithila-red',
  },
];

const socialLinks = [
  { icon: FaInstagram, href: 'https://instagram.com/lalita.pathak.7771', label: 'Instagram', color: 'hover:bg-pink-500' },
  { icon: FaFacebookF, href: 'https://facebook.com/lalita.pathak.7771', label: 'Facebook', color: 'hover:bg-blue-600' },
  { icon: FaTwitter, href: 'https://twitter.com', label: 'Twitter', color: 'hover:bg-sky-500' },
  { icon: FaPinterestP, href: 'https://pinterest.com', label: 'Pinterest', color: 'hover:bg-red-600' },
  { icon: FaYoutube, href: 'https://youtube.com', label: 'YouTube', color: 'hover:bg-red-500' },
  { icon: FaWhatsapp, href: 'https://wa.me/919142168466', label: 'WhatsApp', color: 'hover:bg-green-500' },
];

const workingHours = [
  { day: 'Monday – Friday', hours: '9:00 AM – 6:00 PM', active: true },
  { day: 'Saturday', hours: '10:00 AM – 4:00 PM', active: true },
  { day: 'Sunday', hours: 'Closed (Studio visits by appointment)', active: false },
];

/* ═══════════════════════════════════════════════
   CONTACT FORM COMPONENT
   ═══════════════════════════════════════════════ */
function ContactForm() {
  const { isAuthenticated, user } = useAuth();

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);

  // Prefill from authenticated user
  useEffect(() => {
    if (isAuthenticated && user) {
      setForm((prev) => ({
        ...prev,
        name: user.name || prev.name,
        email: user.email || prev.email,
        phone: user.phone || prev.phone,
      }));
    }
  }, [isAuthenticated, user]);

  const subjects = [
    'General Inquiry',
    'Custom Commission',
    'Bulk / Corporate Order',
    'Exhibition Collaboration',
    'Workshop Booking',
    'Press & Media',
    'Other',
  ];

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Please enter your name';
    if (!form.email.trim()) errs.email = 'Please enter your email';
    else if (!validateEmail(form.email)) errs.email = 'Please enter a valid email';
    if (form.phone && !validatePhone(form.phone)) errs.phone = 'Please enter a valid phone number';
    if (!form.subject) errs.subject = 'Please select a subject';
    if (!form.message.trim()) errs.message = 'Please enter your message';
    else if (form.message.trim().length < 10) errs.message = 'Message must be at least 10 characters';
    return errs;
  };

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (touched[field]) {
      const errs = validate();
      setErrors((prev) => ({ ...prev, [field]: errs[field] }));
    }
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const errs = validate();
    setErrors((prev) => ({ ...prev, [field]: errs[field] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    setTouched({ name: true, email: true, phone: true, subject: true, message: true });
    setErrors(errs);

    if (Object.keys(errs).length === 0) {
      setSending(true);
      // Simulate API call
      await new Promise((r) => setTimeout(r, 1500));
      setSending(false);
      setSubmitted(true);
      setForm({ name: '', email: '', phone: '', subject: '', message: '' });
      setTouched({});
    }
  };

  const inputClasses = (field) =>
    `w-full px-5 py-3.5 rounded-xl bg-cream-50/50 dark:bg-warm-gray-700/50 border font-body text-warm-gray-900 dark:text-cream-100 placeholder-warm-gray-400 dark:placeholder-warm-gray-500 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-earth-500/30 ${
      errors[field] && touched[field]
        ? 'border-mithila-red/50 focus:border-mithila-red'
        : 'border-cream-200 dark:border-warm-gray-600 focus:border-earth-500'
    }`;

  return (
    <AnimatePresence mode="wait">
      {submitted ? (
        <motion.div
          key="success"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="text-center py-16"
        >
          <motion.div
            className="w-20 h-20 rounded-full bg-mithila-green/10 flex items-center justify-center mx-auto mb-6"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', bounce: 0.5, delay: 0.2 }}
          >
            <FaCheckCircle className="text-mithila-green text-4xl" />
          </motion.div>
          <h3 className="font-display text-2xl font-bold text-warm-gray-900 dark:text-cream-100 mb-3">Message Sent!</h3>
          <p className="text-warm-gray-500 font-body max-w-sm mx-auto mb-8">
            Thank you for reaching out. We typically respond within 24 hours.
            Namaste! 🙏
          </p>
          <motion.button
            onClick={() => setSubmitted(false)}
            className="btn-secondary text-base"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Send Another Message
          </motion.button>
        </motion.div>
      ) : (
        <motion.form
          key="form"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          {/* Name & Email */}
          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-body font-medium text-warm-gray-700 dark:text-cream-200 mb-1.5">
                Full Name <span className="text-mithila-red">*</span>
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => handleChange('name', e.target.value)}
                onBlur={() => handleBlur('name')}
                placeholder="Your full name"
                className={inputClasses('name')}
              />
              {errors.name && touched.name && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-mithila-red text-xs mt-1 flex items-center gap-1"
                >
                  <FaExclamationCircle /> {errors.name}
                </motion.p>
              )}
            </div>
            <div>
              <label className="block text-sm font-body font-medium text-warm-gray-700 dark:text-cream-200 mb-1.5">
                Email Address <span className="text-mithila-red">*</span>
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => handleChange('email', e.target.value)}
                onBlur={() => handleBlur('email')}
                placeholder="your@email.com"
                className={inputClasses('email')}
              />
              {errors.email && touched.email && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-mithila-red text-xs mt-1 flex items-center gap-1"
                >
                  <FaExclamationCircle /> {errors.email}
                </motion.p>
              )}
            </div>
          </div>

          {/* Phone & Subject */}
          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-body font-medium text-warm-gray-700 dark:text-cream-200 mb-1.5">
                Phone Number
              </label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                onBlur={() => handleBlur('phone')}
                placeholder="+91 91421 68466"
                className={inputClasses('phone')}
              />
              {errors.phone && touched.phone && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-mithila-red text-xs mt-1 flex items-center gap-1"
                >
                  <FaExclamationCircle /> {errors.phone}
                </motion.p>
              )}
            </div>
            <div>
              <label className="block text-sm font-body font-medium text-warm-gray-700 dark:text-cream-200 mb-1.5">
                Subject <span className="text-mithila-red">*</span>
              </label>
              <select
                value={form.subject}
                onChange={(e) => handleChange('subject', e.target.value)}
                onBlur={() => handleBlur('subject')}
                className={`${inputClasses('subject')} appearance-none cursor-pointer`}
              >
                <option value="" className="dark:bg-warm-gray-800 dark:text-cream-100">Select a subject</option>
                {subjects.map((s) => (
                  <option key={s} value={s} className="dark:bg-warm-gray-800 dark:text-cream-100">{s}</option>
                ))}
              </select>
              {errors.subject && touched.subject && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-mithila-red text-xs mt-1 flex items-center gap-1"
                >
                  <FaExclamationCircle /> {errors.subject}
                </motion.p>
              )}
            </div>
          </div>

          {/* Message */}
          <div>
            <label className="block text-sm font-body font-medium text-warm-gray-700 dark:text-cream-200 mb-1.5">
              Message <span className="text-mithila-red">*</span>
            </label>
            <textarea
              value={form.message}
              onChange={(e) => handleChange('message', e.target.value)}
              onBlur={() => handleBlur('message')}
              placeholder="Tell us about your requirements, the painting style you're interested in, or any questions you may have..."
              rows={5}
              className={`${inputClasses('message')} resize-none`}
            />
            {errors.message && touched.message && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-mithila-red text-xs mt-1 flex items-center gap-1"
              >
                <FaExclamationCircle /> {errors.message}
              </motion.p>
            )}
            <p className="text-warm-gray-300 text-xs mt-1 text-right">
              {form.message.length}/500
            </p>
          </div>

          {/* Submit */}
          <motion.button
            type="submit"
            disabled={sending}
            className="btn-primary w-full flex items-center justify-center gap-2 !py-4 disabled:opacity-70 disabled:cursor-not-allowed"
            whileHover={!sending ? { scale: 1.02, boxShadow: '0 0 40px rgba(139,105,20,0.3)' } : {}}
            whileTap={!sending ? { scale: 0.98 } : {}}
          >
            {sending ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <FaPaperPlane />
                Send Message
              </>
            )}
          </motion.button>
        </motion.form>
      )}
    </AnimatePresence>
  );
}

/* ═══════════════════════════════════════════════
   MAIN CONTACT PAGE
   ═══════════════════════════════════════════════ */
export default function ContactPage() {
  const [heroRef, heroInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [cardsRef, cardsInView] = useInView({ triggerOnce: true, threshold: 0.2 });
  const [mapRef, mapInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Helmet>
        <title>Contact Us — Lalita Pathak Mithila Art Studio | Get in Touch</title>
        <meta
          name="description"
          content="Contact Lalita Pathak Mithila Art Studio for custom commissions, bulk orders, exhibition collaborations, or workshop bookings. Located in Madhubani, Bihar, India."
        />
        <meta name="keywords" content="contact Mithila art, Madhubani painting order, custom commission, Bihar art studio" />
        <link rel="canonical" href="https://lalitapathakart.com/contact" />
      </Helmet>
        {/* ─── Hero Banner ─── */}
        <section className="relative pt-32 pb-20 bg-charcoal overflow-hidden">
          <div className="absolute inset-0 bg-gradient-dark" />
          <div className="absolute inset-0 bg-dots opacity-5" />

          {/* Decorative blobs */}
          <motion.div
            className="absolute top-10 right-1/4 w-72 h-72 rounded-full bg-earth-500/5 blur-3xl"
            animate={{ x: [0, 20, 0], y: [0, -15, 0] }}
            transition={{ duration: 10, repeat: Infinity }}
          />
          <motion.div
            className="absolute bottom-0 left-10 w-48 h-48 rounded-full bg-mithila-red/5 blur-3xl"
            animate={{ y: [0, 20, 0] }}
            transition={{ duration: 8, repeat: Infinity }}
          />

          <div className="container-custom relative z-10 text-center px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-4"
            >
              <p className="font-accent text-earth-400 tracking-[0.3em] text-sm">संपर्क करें</p>
              <div className="flex items-center justify-center gap-4">
                <span className="h-px w-12 bg-gradient-to-r from-transparent to-earth-500" />
                <IoFlower className="text-earth-500" />
                <span className="h-px w-12 bg-gradient-to-l from-transparent to-earth-500" />
              </div>
              <h1 className="heading-xl text-white">
                Get in <span className="text-gradient-gold">Touch</span>
              </h1>
              <p className="text-cream-200/80 font-body text-lg max-w-xl mx-auto">
                We&rsquo;d love to hear from you. Whether it&rsquo;s a commission, collaboration, or simply a love for art — reach out.
              </p>
            </motion.div>
          </div>
        </section>

        {/* ─── Contact Info Cards ─── */}
        <section className="relative -mt-10 z-20 px-4">
          <div className="container-custom">
            <motion.div
              ref={cardsRef}
              variants={staggerContainer}
              initial="hidden"
              animate={cardsInView ? 'visible' : 'hidden'}
              className="grid md:grid-cols-3 gap-5"
            >
              {contactCards.map((card) => (
                <motion.a
                  key={card.title}
                  href={card.link}
                  target={card.title === 'Studio Address' ? '_blank' : undefined}
                  rel="noopener noreferrer"
                  variants={fadeUp}
                >
                  <GlassCard hover className="p-6 text-center group h-full">
                    <motion.div
                      className={`w-14 h-14 rounded-2xl ${card.color} flex items-center justify-center mx-auto mb-4 shadow-lg`}
                      whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
                      transition={{ duration: 0.5 }}
                    >
                      <card.icon className="text-white text-xl" />
                    </motion.div>
                    <h3 className="font-display font-semibold text-warm-gray-900 dark:text-cream-100 text-lg mb-2">{card.title}</h3>
                    <p className="text-warm-gray-700 dark:text-cream-200 font-body text-sm">{card.primary}</p>
                    <p className="text-warm-gray-500 dark:text-warm-gray-300 font-body text-sm">{card.secondary}</p>
                  </GlassCard>
                </motion.a>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ─── Form & Sidebar ─── */}
        <section className="section-padding bg-cream-50 dark:bg-warm-gray-900/40 relative overflow-hidden">
          <div className="absolute inset-0 mithila-pattern opacity-15" />

          <div className="container-custom relative z-10">
            <div className="grid lg:grid-cols-5 gap-12 items-start">
              {/* Form */}
              <motion.div
                variants={slideInLeft}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-100px' }}
                className="lg:col-span-3"
              >
                <GlassCard className="p-6 md:p-10">
                  <div className="mb-8">
                    <h2 className="heading-md text-warm-gray-900 dark:text-cream-100 mb-2">Send a Message</h2>
                    <p className="text-warm-gray-500 dark:text-warm-gray-300 font-body">
                      Fill in the details below and we&rsquo;ll get back to you within 24 hours.
                    </p>
                  </div>
                  <ContactForm />
                </GlassCard>
              </motion.div>

              {/* Sidebar */}
              <motion.div
                variants={slideInRight}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-100px' }}
                className="lg:col-span-2 space-y-6"
              >
                {/* Working Hours */}
                <GlassCard hover className="p-6">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-10 h-10 rounded-xl bg-gradient-gold flex items-center justify-center shadow-gold">
                      <FaClock className="text-white" />
                    </div>
                    <h3 className="font-display font-semibold text-warm-gray-900 dark:text-cream-200 text-lg">Working Hours</h3>
                  </div>
                  <div className="space-y-3">
                    {workingHours.map((wh) => (
                      <div
                        key={wh.day}
                        className={`flex justify-between items-center py-2 border-b border-cream-200/50 dark:border-warm-gray-700/50 last:border-0 ${
                          !wh.active ? 'opacity-50' : ''
                        }`}
                      >
                        <span className="font-body text-sm text-warm-gray-800 dark:text-cream-200 font-medium">{wh.day}</span>
                        <span className={`font-body text-sm ${wh.active ? 'text-mithila-green' : 'text-warm-gray-500 dark:text-warm-gray-300'}`}>
                          {wh.hours}
                        </span>
                      </div>
                    ))}
                  </div>
                </GlassCard>

                {/* Social Media */}
                <GlassCard hover className="p-6">
                  <h3 className="font-display font-semibold text-warm-gray-900 dark:text-cream-200 text-lg mb-5">Follow Us</h3>
                  <div className="grid grid-cols-3 gap-3">
                    {socialLinks.map((social) => (
                      <motion.a
                        key={social.label}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex flex-col items-center gap-2 p-3 rounded-xl bg-cream-50 dark:bg-warm-gray-800 border border-cream-200/50 dark:border-warm-gray-700/50 text-warm-gray-600 dark:text-cream-200 ${social.color} hover:text-white transition-all duration-300 group`}
                        whileHover={{ y: -4, scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <social.icon className="text-xl" />
                        <span className="text-xs font-body">{social.label}</span>
                      </motion.a>
                    ))}
                  </div>
                </GlassCard>

                {/* Quick WhatsApp */}
                <motion.a
                  href="https://wa.me/919142168466?text=Hello%20Lalita%20ji%2C%20I%20am%20interested%20in%20your%20Mithila%20paintings"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-5 text-white text-center shadow-lg group">
                    <FaWhatsapp className="text-3xl mx-auto mb-2 group-hover:scale-110 transition-transform" />
                    <p className="font-display font-semibold text-lg">Chat on WhatsApp</p>
                    <p className="text-green-100 text-sm font-body">Instant response during working hours</p>
                  </div>
                </motion.a>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ─── Google Maps ─── */}
        <section className="relative" ref={mapRef}>
          <div className="container-custom px-4 py-12">
            <SectionHeading
              title="Visit Our Studio"
              subtitle="Located in the heart of Madhubani, Bihar — the birthplace of Mithila painting"
              accent
              centered
            />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={mapInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            {/* Decorative top border */}
            <div className="border-mithila-top" />

            <div className="relative h-[400px] md:h-[500px] bg-cream-100">
              <iframe
                title="Lalita Pathak Mithila Art Studio Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d57367.61094702!2d86.0498!3d26.3477!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39edfc72ff5d0c57%3A0x9e1f3fd2dbd6d96c!2sMadhubani%2C%20Bihar%2C%20India!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                className="absolute inset-0 w-full h-full border-0"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />

              {/* Overlay card */}
              <motion.div
                className="absolute bottom-6 left-6 z-10"
                initial={{ opacity: 0, x: -30 }}
                animate={mapInView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.5 }}
              >
                <GlassCard className="p-5 max-w-xs backdrop-blur-xl bg-white/90 dark:bg-warm-gray-800/90">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-mithila-red flex items-center justify-center flex-shrink-0 shadow-lg">
                      <FaMapMarkerAlt className="text-white" />
                    </div>
                    <div>
                      <h4 className="font-display font-semibold text-warm-gray-900 dark:text-cream-100">Lalita Pathak Mithila Art Studio</h4>
                      <p className="text-warm-gray-500 text-sm font-body leading-relaxed">
                        Satlakha Pathak Tola, Rahika, Madhubani, Bihar 847238, India
                      </p>
                      <a
                        href="https://maps.google.com/?q=Madhubani,Bihar,India"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block mt-2 text-earth-500 text-sm font-body font-medium hover:text-earth-600 transition-colors"
                      >
                        Get Directions →
                      </a>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            </div>

            {/* Decorative bottom border */}
            <div className="border-mithila-bottom" />
          </motion.div>
        </section>
    </motion.div>
  );
}
