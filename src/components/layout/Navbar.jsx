import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { IoMenu, IoClose, IoCartOutline, IoSunnyOutline, IoMoonOutline, IoLogOut, IoPersonCircle, IoHeartOutline } from 'react-icons/io5';
import { useCart } from '../../context/CartContext';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import SearchBar from '../ui/SearchBar';

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'About', path: '/about' },
  { name: 'Gallery', path: '/gallery' },
  { name: 'Shop', path: '/shop' },
  { name: 'Commission', path: '/commission' },
  { name: 'Blog', path: '/blog' },
  { name: 'History', path: '/mithila-history' },
  { name: 'Contact', path: '/contact' },
];

export default function Navbar() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { itemCount } = useCart();
  const { isDark, toggleTheme } = useTheme();
  const { isAuthenticated, user, logout } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleLogout = async () => {
    await logout();
    setIsOpen(false);
    navigate('/');
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'bg-cream-50/90 dark:bg-warm-gray-900/90 backdrop-blur-xl shadow-warm dark:shadow-none border-b border-cream-200/50 dark:border-warm-gray-700/50'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-full bg-gradient-gold flex items-center justify-center shadow-gold group-hover:scale-110 transition-transform duration-300">
                <span className="text-white font-display font-bold text-lg">म</span>
              </div>
              <div className="hidden sm:block">
                <h1 className={`font-display font-bold text-lg leading-none transition-colors duration-300 ${
                  scrolled ? 'text-earth-700 dark:text-cream-200' : 'text-white'
                }`}>
                  Lalita Pathak
                </h1>
                <p className={`text-xs font-body tracking-[0.2em] uppercase transition-colors duration-300 ${
                  scrolled ? 'text-earth-500 dark:text-earth-400' : 'text-cream-200'
                }`}>
                  Lalita Pathak Mithila Art Studio
                </p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`relative px-4 py-2 font-body text-sm font-medium transition-colors duration-300 rounded-full hover:bg-earth-500/10 ${
                    location.pathname === link.path
                      ? scrolled ? 'text-earth-500' : 'text-cream-100'
                      : scrolled ? 'text-warm-gray-600 dark:text-warm-gray-300 hover:text-earth-500' : 'text-cream-200 hover:text-white'
                  }`}
                >
                  {link.name}
                  {location.pathname === link.path && (
                    <motion.div
                      layoutId="navIndicator"
                      className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-earth-500"
                      transition={{ duration: 0.3 }}
                    />
                  )}
                </Link>
              ))}
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-2">
              <SearchBar />

              {/* Theme toggle */}
              <motion.button
                onClick={toggleTheme}
                className={`p-2 rounded-full transition-all duration-300 hover:bg-earth-500/10 ${
                  scrolled ? 'text-warm-gray-600 dark:text-cream-300 hover:text-earth-500' : 'text-cream-200 hover:text-white'
                }`}
                whileTap={{ scale: 0.9, rotate: 180 }}
                aria-label="Toggle theme"
              >
                <AnimatePresence mode="wait" initial={false}>
                  {isDark ? (
                    <motion.div key="sun" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                      <IoSunnyOutline size={20} />
                    </motion.div>
                  ) : (
                    <motion.div key="moon" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
                      <IoMoonOutline size={20} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>

              {/* Cart */}
              <Link
                to="/cart"
                className={`relative p-2 rounded-full transition-all duration-300 hover:bg-earth-500/10 ${
                  scrolled ? 'text-warm-gray-600 dark:text-cream-300 hover:text-earth-500' : 'text-cream-200 hover:text-white'
                }`}
              >
                <IoCartOutline size={22} />
                {itemCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 w-5 h-5 bg-mithila-red text-white text-xs rounded-full flex items-center justify-center font-bold"
                  >
                    {itemCount}
                  </motion.span>
                )}
              </Link>

              {/* Auth Buttons (Desktop) */}
              {isAuthenticated ? (
                <div className="hidden sm:flex items-center gap-2">
                  <Link
                    to="/wishlist"
                    className={`p-2 rounded-full transition-all duration-300 hover:bg-earth-500/10 ${
                      scrolled ? 'text-warm-gray-600 dark:text-cream-300 hover:text-earth-500' : 'text-cream-200 hover:text-white'
                    }`}
                    title="Wishlist"
                  >
                    <IoHeartOutline size={22} />
                  </Link>
                  <Link
                    to="/profile"
                    className={`p-2 rounded-full transition-all duration-300 hover:bg-earth-500/10 ${
                      scrolled ? 'text-warm-gray-600 dark:text-cream-300 hover:text-earth-500' : 'text-cream-200 hover:text-white'
                    }`}
                    title="Profile"
                  >
                    <IoPersonCircle size={22} />
                  </Link>
                  {user?.role === 'admin' && (
                    <Link
                      to="/admin"
                      className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-300 ${
                        scrolled ? 'text-earth-500 hover:bg-earth-500/10' : 'text-cream-200 hover:bg-white/10'
                      }`}
                    >
                      Admin
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className={`p-2 rounded-full transition-all duration-300 hover:bg-earth-500/10 ${
                      scrolled ? 'text-warm-gray-600 dark:text-cream-300 hover:text-earth-500' : 'text-cream-200 hover:text-white'
                    }`}
                    title="Sign out"
                  >
                    <IoLogOut size={22} />
                  </button>
                </div>
              ) : (
                <div className="hidden sm:flex items-center gap-2">
                  <Link
                    to="/login"
                    className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-300 ${
                      scrolled
                        ? 'text-earth-500 hover:bg-earth-500/10'
                        : 'text-cream-200 hover:bg-white/10'
                    }`}
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="px-4 py-2 rounded-lg bg-gradient-gold text-white font-medium text-sm hover:shadow-gold transition-all duration-300"
                  >
                    Sign Up
                  </Link>
                </div>
              )}

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className={`lg:hidden p-2 rounded-full transition-all duration-300 hover:bg-earth-500/10 ${
                  scrolled ? 'text-warm-gray-600 dark:text-cream-300' : 'text-cream-200'
                }`}
                aria-label="Toggle menu"
              >
                {isOpen ? <IoClose size={24} /> : <IoMenu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-warm-black/60 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 w-80 h-full bg-cream-50 shadow-2xl z-50 lg:hidden overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="font-display font-bold text-xl text-earth-700">Menu</h2>
                    <div className="w-12 h-0.5 bg-gradient-gold mt-1"></div>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 rounded-full hover:bg-cream-200 transition-colors"
                  >
                    <IoClose size={24} className="text-warm-gray-600" />
                  </button>
                </div>

                <nav className="space-y-1">
                  {navLinks.map((link, i) => (
                    <motion.div
                      key={link.path}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <Link
                        to={link.path}
                        className={`block px-4 py-3 rounded-xl font-body font-medium transition-all duration-300 ${
                          location.pathname === link.path
                            ? 'bg-earth-500/10 text-earth-500'
                            : 'text-warm-gray-600 hover:bg-cream-100 hover:text-earth-500'
                        }`}
                      >
                        {link.name}
                      </Link>
                    </motion.div>
                  ))}
                </nav>

                {/* Auth Links (Mobile) */}
                {isAuthenticated ? (
                  <div className="mt-8 pt-8 border-t border-cream-200 space-y-3">
                    <Link
                      to="/wishlist"
                      className="flex items-center gap-2 px-4 py-3 rounded-xl bg-cream-100 text-earth-700 font-medium hover:bg-cream-200 transition-colors"
                    >
                      <IoHeartOutline size={18} />
                      Wishlist
                    </Link>
                    <Link
                      to="/profile"
                      className="flex items-center gap-2 px-4 py-3 rounded-xl bg-earth-500/10 text-earth-500 font-medium hover:bg-earth-500/20 transition-colors"
                    >
                      <IoPersonCircle size={18} />
                      My Profile
                    </Link>
                    {user?.role === 'admin' && (
                      <Link
                        to="/admin"
                        className="flex items-center gap-2 px-4 py-3 rounded-xl bg-cream-100 text-earth-700 font-medium hover:bg-cream-200 transition-colors"
                      >
                        Admin
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-mithila-red/10 text-mithila-red font-medium hover:bg-mithila-red/20 transition-colors"
                    >
                      <IoLogOut size={18} />
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <div className="mt-8 pt-8 border-t border-cream-200 space-y-3">
                    <Link
                      to="/login"
                      className="block text-center px-4 py-3 rounded-xl border-2 border-earth-500 text-earth-500 font-medium hover:bg-earth-500/10 transition-colors"
                    >
                      Login
                    </Link>
                    <Link
                      to="/signup"
                      className="block text-center px-4 py-3 rounded-xl bg-gradient-gold text-white font-medium hover:shadow-gold transition-all"
                    >
                      Sign Up
                    </Link>
                  </div>
                )}

                <div className="mt-6 pt-6 border-t border-cream-200 text-center">
                  <p className="text-body-sm">📞 +91 74883 37792</p>
                  <p className="text-body-sm mt-1">✉️ pathaklalita129@gmail.com</p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
