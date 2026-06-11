import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { IoMenu, IoClose, IoCartOutline, IoSunnyOutline, IoMoonOutline, IoLogOut, IoPersonCircle, IoHeartOutline, IoColorPaletteOutline } from 'react-icons/io5';
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
  { name: 'History', path: '/mithila-history' },
  { name: 'Culture', path: '/culture' },
  { name: 'Artists', path: '/artists' },
  { name: 'Blog', path: '/blog' },
  { name: 'Contact', path: '/contact' },
];

const darkPalettes = [
  { id: 'gold', name: 'Classic Gold', bg: '#1F1A12', accent: '#C4A76D' },
  { id: 'purple', name: 'Royal Purple', bg: '#121212', accent: '#8B5CF6' },
  { id: 'emerald', name: 'Emerald Heritage', bg: '#121212', accent: '#10B981' },
  { id: 'sapphire', name: 'Deep Sapphire', bg: '#121212', accent: '#2563EB' },
  { id: 'ruby', name: 'Ruby Heritage', bg: '#121212', accent: '#DC2626' },
  { id: 'ivory', name: 'Ivory Gold Luxury', bg: '#161616', accent: '#FAF9F6' },
];

const lightPalettes = [
  { id: 'classic', name: 'Classic Cream', bg: '#FFF8F0', accent: '#8B6914' },
  { id: 'parchment', name: 'Terracotta Parchment', bg: '#F5EAD4', accent: '#B22222' },
  { id: 'ivory', name: 'Ivory Indigo', bg: '#FAF9F6', accent: '#1565C0' },
  { id: 'sandstone', name: 'Sandstone Green', bg: '#EAD8C0', accent: '#1E5E2F' },
];

export default function Navbar() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showPaletteMenu, setShowPaletteMenu] = useState(false);
  const { itemCount } = useCart();
  const { isDark, toggleTheme, darkPalette, setDarkPalette, lightPalette, setLightPalette } = useTheme();
  const { isAuthenticated, user, logout } = useAuth();
  const location = useLocation();
  const isHeroPage = ['/', '/about', '/culture', '/mithila-history'].includes(location.pathname);
  const isNavbarScrolled = !isHeroPage || scrolled;

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
          isNavbarScrolled
            ? 'bg-cream-50/90 dark:bg-warm-gray-900/90 backdrop-blur-xl shadow-warm dark:shadow-none border-b border-cream-200/50 dark:border-warm-gray-700/50'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group flex-shrink-0">
              <div className="w-10 h-10 rounded-full bg-gradient-gold flex items-center justify-center shadow-gold group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                <span className="text-white font-display font-bold text-lg">म</span>
              </div>
              <div className="hidden sm:block">
                <h1 className={`whitespace-nowrap font-display font-bold text-base md:text-lg leading-none transition-colors duration-300 ${
                  isNavbarScrolled ? 'text-earth-700 dark:text-cream-200' : 'text-white'
                }`}>
                  Lalita Pathak
                </h1>
                <p className={`hidden xl:block whitespace-nowrap text-[10px] xl:text-xs font-body tracking-[0.1em] xl:tracking-[0.2em] uppercase transition-colors duration-300 mt-1 ${
                  isNavbarScrolled ? 'text-earth-500 dark:text-earth-400' : 'text-cream-200'
                }`}>
                  Mithila Art Studio
                </p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden xl:flex items-center gap-0.5 xl:gap-1 flex-1 justify-center max-w-5xl">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`whitespace-nowrap relative px-2 xl:px-3 py-2 font-body text-xs xl:text-sm font-medium transition-colors duration-300 rounded-full hover:bg-earth-500/10 ${
                    location.pathname === link.path
                      ? isNavbarScrolled ? 'text-earth-500' : 'text-cream-100'
                      : isNavbarScrolled ? 'text-warm-gray-600 dark:text-warm-gray-300 hover:text-earth-500' : 'text-cream-200 hover:text-white'
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
                className={`hidden md:block p-2 rounded-full transition-all duration-300 hover:bg-earth-500/10 ${
                  isNavbarScrolled ? 'text-warm-gray-600 dark:text-cream-300 hover:text-earth-500' : 'text-cream-200 hover:text-white'
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

              {/* Palette Selector */}
              <div className="relative hidden md:block">
                <motion.button
                  onClick={() => setShowPaletteMenu(prev => !prev)}
                  className={`p-2 rounded-full transition-all duration-300 hover:bg-earth-500/10 ${
                    isNavbarScrolled ? 'text-warm-gray-600 dark:text-cream-300 hover:text-earth-500' : 'text-cream-200 hover:text-white'
                  } ${showPaletteMenu ? 'bg-earth-500/20' : ''}`}
                  whileTap={{ scale: 0.9 }}
                  aria-label="Customize theme palette"
                  title="Theme Palette"
                >
                  <IoColorPaletteOutline size={20} />
                </motion.button>

                <AnimatePresence>
                  {showPaletteMenu && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setShowPaletteMenu(false)} />
                      
                      <motion.div
                        initial={{ opacity: 0, y: 15, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-3 w-56 rounded-2xl bg-white dark:bg-warm-gray-800 border border-cream-200/60 dark:border-warm-gray-700/60 shadow-glass-lg p-3 z-20"
                      >
                        <h4 className="text-xs font-accent tracking-widest text-earth-500 uppercase px-2 mb-2">
                          {isDark ? 'Dark Palettes' : 'Light Palettes'}
                        </h4>
                        <div className="space-y-1">
                          {(isDark ? darkPalettes : lightPalettes).map((palette) => {
                            const isActive = isDark ? darkPalette === palette.id : lightPalette === palette.id;
                            return (
                              <button
                                key={palette.id}
                                onClick={() => {
                                  if (isDark) {
                                    setDarkPalette(palette.id);
                                  } else {
                                    setLightPalette(palette.id);
                                  }
                                  setShowPaletteMenu(false);
                                }}
                                className={`w-full flex items-center justify-between p-2 rounded-xl text-left font-body text-xs transition-all ${
                                  isActive
                                    ? 'bg-earth-500/10 text-earth-500 font-semibold'
                                    : 'text-warm-gray-600 dark:text-warm-gray-300 hover:bg-cream-100 dark:hover:bg-warm-gray-700/50'
                                }`}
                              >
                                <span className="truncate">{palette.name}</span>
                                <div className="flex items-center gap-1">
                                  <div
                                    className="w-4 h-4 rounded-full border border-cream-200 dark:border-warm-gray-600 flex items-center justify-center flex-shrink-0"
                                    style={{ backgroundColor: palette.bg }}
                                  >
                                    <div
                                      className="w-1.5 h-1.5 rounded-full"
                                      style={{ backgroundColor: palette.accent }}
                                    />
                                  </div>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>

              {/* Cart */}
              <Link
                to="/cart"
                className={`relative p-2 rounded-full transition-all duration-300 hover:bg-earth-500/10 ${
                  isNavbarScrolled ? 'text-warm-gray-600 dark:text-cream-300 hover:text-earth-500' : 'text-cream-200 hover:text-white'
                }`}
              >
                <IoCartOutline size={22} />
                {itemCount > 0 && (
                  <motion.span
                    key={itemCount}
                    initial={{ scale: 0.6, opacity: 0 }}
                    animate={{ scale: [0.6, 1.4, 0.9, 1.1, 1], opacity: 1 }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
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
                      isNavbarScrolled ? 'text-warm-gray-600 dark:text-cream-300 hover:text-earth-500' : 'text-cream-200 hover:text-white'
                    }`}
                    title="Wishlist"
                  >
                    <IoHeartOutline size={22} />
                  </Link>
                  <Link
                    to="/profile"
                    className={`p-2 rounded-full transition-all duration-300 hover:bg-earth-500/10 ${
                      isNavbarScrolled ? 'text-warm-gray-600 dark:text-cream-300 hover:text-earth-500' : 'text-cream-200 hover:text-white'
                    }`}
                    title="Profile"
                  >
                    <IoPersonCircle size={22} />
                  </Link>
                  {user?.role === 'admin' && (
                    <Link
                      to="/admin"
                      className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-300 ${
                        isNavbarScrolled ? 'text-earth-500 hover:bg-earth-500/10' : 'text-cream-200 hover:bg-white/10'
                      }`}
                    >
                      Admin
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className={`p-2 rounded-full transition-all duration-300 hover:bg-earth-500/10 ${
                      isNavbarScrolled ? 'text-warm-gray-600 dark:text-cream-300 hover:text-earth-500' : 'text-cream-200 hover:text-white'
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
                      isNavbarScrolled
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
                className={`xl:hidden p-2 rounded-full transition-all duration-300 hover:bg-earth-500/10 ${
                  isNavbarScrolled ? 'text-warm-gray-600 dark:text-cream-300' : 'text-cream-200'
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
              className="fixed inset-0 bg-warm-black/60 backdrop-blur-sm z-40 xl:hidden"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 w-80 h-full bg-cream-50 shadow-2xl z-50 xl:hidden overflow-y-auto"
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

                {/* Appearance section (Mobile only) */}
                <div className="mt-6 pt-6 border-t border-cream-200">
                  <h3 className="text-xs font-accent tracking-widest text-earth-500 uppercase mb-4">
                    Appearance
                  </h3>
                  
                  {/* Theme Switcher Toggle */}
                  <div className="flex items-center justify-between p-3 rounded-xl bg-cream-100/50 dark:bg-warm-gray-800/50 mb-4">
                    <span className="font-body text-sm font-medium text-warm-gray-600 dark:text-warm-gray-300">
                      {isDark ? 'Dark Mode' : 'Light Mode'}
                    </span>
                    <button
                      onClick={toggleTheme}
                      className="p-2 rounded-full bg-white dark:bg-warm-gray-700 border border-cream-200 dark:border-warm-gray-600 text-earth-500 shadow-sm"
                      aria-label="Toggle Mode"
                    >
                      {isDark ? <IoSunnyOutline size={18} /> : <IoMoonOutline size={18} />}
                    </button>
                  </div>

                  {/* Palette Selector */}
                  <div className="space-y-2">
                    <p className="font-body text-xs text-warm-gray-400 mb-2">Color Palette</p>
                    <div className="flex flex-wrap gap-2">
                      {(isDark ? darkPalettes : lightPalettes).map((palette) => {
                        const isActive = isDark ? darkPalette === palette.id : lightPalette === palette.id;
                        return (
                          <button
                            key={palette.id}
                            onClick={() => {
                              if (isDark) {
                                setDarkPalette(palette.id);
                              } else {
                                setLightPalette(palette.id);
                              }
                            }}
                            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-body transition-all border ${
                              isActive
                                ? 'bg-earth-500/10 border-earth-500 text-earth-500 font-semibold'
                                : 'bg-white dark:bg-warm-gray-700 border-cream-200 dark:border-warm-gray-600 text-warm-gray-600 dark:text-warm-gray-300'
                            }`}
                          >
                            <div
                              className="w-3.5 h-3.5 rounded-full flex items-center justify-center flex-shrink-0"
                              style={{ backgroundColor: palette.bg }}
                            >
                              <div
                                className="w-1 h-1 rounded-full"
                                style={{ backgroundColor: palette.accent }}
                              />
                            </div>
                            <span>{palette.name}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

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
