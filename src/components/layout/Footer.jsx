import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaInstagram, FaFacebookF, FaPinterestP, FaYoutube, FaWhatsapp } from 'react-icons/fa';
import { IoMailOutline, IoCallOutline, IoLocationOutline } from 'react-icons/io5';

const footerLinks = {
  explore: [
    { name: 'Gallery', path: '/gallery' },
    { name: 'Shop', path: '/shop' },
    { name: 'About Artist', path: '/about' },
    { name: 'Blog', path: '/blog' },
  ],
  information: [
    { name: 'Mithila History', path: '/mithila-history' },
    { name: 'Commission', path: '/commission' },
    { name: 'Testimonials', path: '/testimonials' },
    { name: 'Contact', path: '/contact' },
  ],
  categories: [
    { name: 'Kohbar Paintings', path: '/shop?category=Kohbar' },
    { name: 'Bharni Style', path: '/shop?category=Bharni' },
    { name: 'Kachni Art', path: '/shop?category=Kachni' },
    { name: 'Godhana Art', path: '/shop?category=Godhana' },
  ],
};

const socialLinks = [
  {
    icon: FaInstagram,
    href: 'https://instagram.com/lalita.pathak.7771',
    label: 'Instagram'
  },
  {
    icon: FaFacebookF,
    href: 'https://facebook.com/lalita.pathak.7771',
    label: 'Facebook'
  },
  {
    icon: IoMailOutline,
    href: 'mailto:pathaklalita129@gmail.com',
    label: 'Email'
  },
  {
    icon: FaWhatsapp,
    href: 'https://wa.me/917488337792',
    label: 'WhatsApp'
  }
];

export default function Footer() {
  return (
    <footer className="bg-warm-black text-cream-200 relative overflow-hidden">
      {/* Mithila Pattern Top Border */}
      <div className="border-mithila-top" />

      {/* Decorative Background */}
      <div className="absolute inset-0 mithila-pattern opacity-5" />

      <div className="relative container-custom section-padding">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-3 group mb-6">
              <div className="w-12 h-12 rounded-full bg-gradient-gold flex items-center justify-center shadow-gold group-hover:scale-110 transition-transform duration-300">
                <span className="text-white font-display font-bold text-xl">म</span>
              </div>
              <div>
                <h3 className="font-display font-bold text-xl text-cream-100">Lalita Pathak</h3>
                <p className="text-xs tracking-[0.2em] uppercase text-earth-400">Lalita Pathak Mithila Art Studio</p>
              </div>
            </Link>
            <p className="text-body-sm text-warm-gray-300/70 mb-6 leading-relaxed">
              Preserving the sacred 2,500-year-old tradition of Mithila painting through authentic, handcrafted masterpieces that bridge ancient wisdom and contemporary aesthetics.
            </p>

            {/* Social Links */}
            <div className="flex gap-3">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-warm-gray-300 hover:bg-earth-500 hover:text-white hover:border-earth-500 transition-all duration-300 hover:scale-110"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Explore */}
          <div>
            <h4 className="font-display font-semibold text-lg text-cream-100 mb-6">
              Explore
              <div className="w-8 h-0.5 bg-gradient-gold mt-2"></div>
            </h4>
            <ul className="space-y-3">
              {footerLinks.explore.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-warm-gray-300/70 hover:text-earth-400 transition-colors duration-300 font-body text-sm flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-earth-500/40 group-hover:bg-earth-400 transition-colors" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Information */}
          <div>
            <h4 className="font-display font-semibold text-lg text-cream-100 mb-6">
              Information
              <div className="w-8 h-0.5 bg-gradient-gold mt-2"></div>
            </h4>
            <ul className="space-y-3">
              {footerLinks.information.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-warm-gray-300/70 hover:text-earth-400 transition-colors duration-300 font-body text-sm flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-earth-500/40 group-hover:bg-earth-400 transition-colors" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display font-semibold text-lg text-cream-100 mb-6">
              Get In Touch
              <div className="w-8 h-0.5 bg-gradient-gold mt-2"></div>
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <IoLocationOutline className="text-earth-400 mt-1 flex-shrink-0" size={18} />
                <span className="text-warm-gray-300/70 text-sm">
                  Satlakha Pathak Tola, Rahika,<br />Madhubani, Bihar 847238, India
                </span>
              </li>
              <li className="flex items-center gap-3">
                <IoCallOutline className="text-earth-400 flex-shrink-0" size={18} />
                <a href="tel:+917488337792" className="text-warm-gray-300/70 hover:text-earth-400 text-sm transition-colors">
                  +91 74883 37792
                </a>
              </li>
              <li className="flex items-center gap-3">
                <IoMailOutline className="text-earth-400 flex-shrink-0" size={18} />
                <a href="mailto:pathaklalita129@gmail.com" className="text-warm-gray-300/70 hover:text-earth-400 text-sm transition-colors">
                  pathaklalita129@gmail.com
                </a>
              </li>
              <li className="flex items-center gap-3">
                <FaWhatsapp className="text-earth-400 flex-shrink-0" size={18} />
                <a href="https://wa.me/917488337792" className="text-warm-gray-300/70 hover:text-earth-400 text-sm transition-colors">
                  WhatsApp Us
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-warm-gray-300/50 text-sm font-body">
            © {new Date().getFullYear()} Lalita Pathak Mithila Art Studio. All rights reserved.
          </p>
          <div className="flex items-center gap-1 text-warm-gray-300/50 text-sm">
            <span>Crafted with</span>
            <motion.span
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="text-mithila-red"
            >
              ❤️
            </motion.span>
            <span>in Madhubani, Bihar</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
