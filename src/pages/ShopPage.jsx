import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { requireAuth } from '../context/AuthContext';
import { useInView } from 'react-intersection-observer';
import {
  FaSearch,
  FaTh,
  FaThList,
  FaTimes,
  FaSlidersH,
  FaChevronDown,
  FaChevronUp,
  FaArrowRight,
  FaStar,
} from 'react-icons/fa';
import {
  IoFilterOutline,
  IoCloseOutline,
  IoGridOutline,
  IoListOutline,
  IoSparkles,
  IoCartOutline,
} from 'react-icons/io5';

import SectionHeading from '../components/ui/SectionHeading';
import PaintingCard from '../components/ui/PaintingCard';
import PaintingCardSkeleton from '../components/ui/PaintingCardSkeleton';

import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { paintings, categories } from '../data/paintings';
import { productAPI, userAPI } from '../api';
import { formatPrice, scrollToTop } from '../utils/helpers';

/* ───────────────── animation variants ───────────────── */
const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5 } },
};

const slideIn = {
  hidden: { x: -300, opacity: 0 },
  visible: { x: 0, opacity: 1, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
  exit: { x: -300, opacity: 0, transition: { duration: 0.3 } },
};

/* ───────────────── size options ───────────────── */
const sizeOptions = [
  { label: 'Small (up to 18")', value: 'small' },
  { label: 'Medium (18–30")', value: 'medium' },
  { label: 'Large (30"+)', value: 'large' },
];

/* ───────────────── sort options ───────────────── */
const sortOptions = [
  { label: 'Popular', value: 'popular' },
  { label: 'Newest', value: 'newest' },
  { label: 'Price: Low → High', value: 'price-asc' },
  { label: 'Price: High → Low', value: 'price-desc' },
];

/* ───────────────── helper: parse size string to category ───────────────── */
function getSizeCategory(sizeStr) {
  if (!sizeStr) return 'medium';
  const match = sizeStr.match(/(\d+)\s*×\s*(\d+)/);
  if (!match) return 'medium';
  const maxDim = Math.max(parseInt(match[1]), parseInt(match[2]));
  if (maxDim <= 18) return 'small';
  if (maxDim <= 30) return 'medium';
  return 'large';
}

/* ════════════════════════════════════════════════════════════════
   FILTER SIDEBAR COMPONENT
   ════════════════════════════════════════════════════════════════ */
function FilterSidebar({
  selectedCategories,
  onCategoryToggle,
  priceRange,
  onPriceChange,
  selectedSizes,
  onSizeToggle,
  onClearAll,
  activeFilterCount,
}) {
  const [openSections, setOpenSections] = useState({
    category: true,
    price: true,
    size: true,
  });

  const toggleSection = (section) =>
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="font-display font-semibold text-lg text-charcoal dark:text-cream-200 flex items-center gap-2">
          <IoFilterOutline className="text-earth-500" />
          Filters
          {activeFilterCount > 0 && (
            <span className="ml-2 w-6 h-6 rounded-full bg-mithila-red text-white text-xs flex items-center justify-center font-body font-bold">
              {activeFilterCount}
            </span>
          )}
        </h3>
        {activeFilterCount > 0 && (
          <motion.button
            onClick={onClearAll}
            className="text-sm text-mithila-red font-body font-medium hover:underline"
            whileTap={{ scale: 0.95 }}
          >
            Clear All
          </motion.button>
        )}
      </div>

      {/* ── Category Filter ── */}
      <div className="border-t border-cream-200/60 dark:border-warm-gray-700/60 pt-4">
        <button
          onClick={() => toggleSection('category')}
          className="flex items-center justify-between w-full text-left group"
        >
          <span className="font-display font-semibold text-charcoal dark:text-cream-200">Category</span>
          {openSections.category ? (
            <FaChevronUp className="text-warm-gray-500 text-xs" />
          ) : (
            <FaChevronDown className="text-warm-gray-500 text-xs" />
          )}
        </button>
        <AnimatePresence>
          {openSections.category && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="mt-3 space-y-2">
                {categories.map((cat) => (
                  <label
                    key={cat.id}
                    className="flex items-center gap-3 cursor-pointer group py-1"
                  >
                    <div
                      className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all duration-300 ${
                        selectedCategories.includes(cat.id)
                          ? 'bg-earth-500 border-earth-500'
                          : 'border-warm-gray-300 dark:border-warm-gray-600 group-hover:border-earth-400'
                      }`}
                    >
                      {selectedCategories.includes(cat.id) && (
                        <motion.svg
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="w-3 h-3 text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={3}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </motion.svg>
                      )}
                    </div>
                    <span className="font-body text-sm text-warm-gray-600 dark:text-warm-gray-300 group-hover:text-charcoal dark:group-hover:text-cream-100 transition-colors">
                      {cat.name}
                    </span>
                    <span className="ml-auto font-accent text-xs text-warm-gray-500 dark:text-warm-gray-300">
                      {cat.nameHindi}
                    </span>
                    <input
                      type="checkbox"
                      className="sr-only"
                      checked={selectedCategories.includes(cat.id)}
                      onChange={() => onCategoryToggle(cat.id)}
                    />
                  </label>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Price Range ── */}
      <div className="border-t border-cream-200/60 dark:border-warm-gray-700/60 pt-4">
        <button
          onClick={() => toggleSection('price')}
          className="flex items-center justify-between w-full text-left"
        >
          <span className="font-display font-semibold text-charcoal dark:text-cream-200">Price Range</span>
          {openSections.price ? (
            <FaChevronUp className="text-warm-gray-500 text-xs" />
          ) : (
            <FaChevronDown className="text-warm-gray-500 text-xs" />
          )}
        </button>
        <AnimatePresence>
          {openSections.price && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="mt-3 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <label className="text-xs text-warm-gray-500 dark:text-warm-gray-300 font-body mb-1 block">Min (₹)</label>
                    <input
                      type="number"
                      value={priceRange[0]}
                      onChange={(e) => onPriceChange([parseInt(e.target.value) || 0, priceRange[1]])}
                      className="w-full px-3 py-2 rounded-lg border border-cream-200 dark:border-warm-gray-700 bg-cream-50 dark:bg-warm-gray-800 font-body text-sm text-charcoal dark:text-cream-200 placeholder-warm-gray-400 dark:placeholder-warm-gray-500 focus:outline-none focus:ring-2 focus:ring-earth-500/30 focus:border-earth-500 transition-all"
                      placeholder="0"
                    />
                  </div>
                  <span className="text-warm-gray-300 mt-5">—</span>
                  <div className="flex-1">
                    <label className="text-xs text-warm-gray-500 dark:text-warm-gray-300 font-body mb-1 block">Max (₹)</label>
                    <input
                      type="number"
                      value={priceRange[1]}
                      onChange={(e) => onPriceChange([priceRange[0], parseInt(e.target.value) || 100000])}
                      className="w-full px-3 py-2 rounded-lg border border-cream-200 dark:border-warm-gray-700 bg-cream-50 dark:bg-warm-gray-800 font-body text-sm text-charcoal dark:text-cream-200 placeholder-warm-gray-400 dark:placeholder-warm-gray-500 focus:outline-none focus:ring-2 focus:ring-earth-500/30 focus:border-earth-500 transition-all"
                      placeholder="100000"
                    />
                  </div>
                </div>
                {/* Range visual */}
                <div className="relative h-1.5 bg-cream-200 dark:bg-warm-gray-700 rounded-full overflow-hidden">
                  <motion.div
                    className="absolute h-full bg-gradient-gold rounded-full"
                    style={{
                      left: `${(priceRange[0] / 100000) * 100}%`,
                      right: `${100 - (priceRange[1] / 100000) * 100}%`,
                    }}
                    layout
                    transition={{ duration: 0.3 }}
                  />
                </div>
                <div className="flex justify-between text-xs text-warm-gray-500 font-body">
                  <span>{formatPrice(priceRange[0])}</span>
                  <span>{formatPrice(priceRange[1])}</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Size Filter ── */}
      <div className="border-t border-cream-200/60 dark:border-warm-gray-700/60 pt-4">
        <button
          onClick={() => toggleSection('size')}
          className="flex items-center justify-between w-full text-left"
        >
          <span className="font-display font-semibold text-charcoal dark:text-cream-200">Size</span>
          {openSections.size ? (
            <FaChevronUp className="text-warm-gray-500 text-xs" />
          ) : (
            <FaChevronDown className="text-warm-gray-500 text-xs" />
          )}
        </button>
        <AnimatePresence>
          {openSections.size && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="mt-3 space-y-2">
                {sizeOptions.map((size) => (
                  <label
                    key={size.value}
                    className="flex items-center gap-3 cursor-pointer group py-1"
                  >
                    <div
                      className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all duration-300 ${
                        selectedSizes.includes(size.value)
                          ? 'bg-earth-500 border-earth-500'
                          : 'border-warm-gray-300 dark:border-warm-gray-600 group-hover:border-earth-400'
                      }`}
                    >
                      {selectedSizes.includes(size.value) && (
                        <motion.svg
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="w-3 h-3 text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={3}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </motion.svg>
                      )}
                    </div>
                    <span className="font-body text-sm text-warm-gray-600 dark:text-warm-gray-300 group-hover:text-charcoal dark:group-hover:text-cream-100 transition-colors">
                      {size.label}
                    </span>
                    <input
                      type="checkbox"
                      className="sr-only"
                      checked={selectedSizes.includes(size.value)}
                      onChange={() => onSizeToggle(size.value)}
                    />
                  </label>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════
   SHOP PAGE
   ════════════════════════════════════════════════════════════════ */
export default function ShopPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { addItem } = useCart();
  const { isAuthenticated, user } = useAuth();

  const [products, setProducts] = useState(paintings);
  const [productsLoading, setProductsLoading] = useState(true);
  const [productsError, setProductsError] = useState(null);
  const [showWakingUpMsg, setShowWakingUpMsg] = useState(false);
  const [wishlistIds, setWishlistIds] = useState(user?.wishlist?.map((item) => item.productId) || []);

  /* ─── filter state ──────────────────────────────────────── */
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [sortBy, setSortBy] = useState('popular');
  const [viewMode, setViewMode] = useState('grid');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);

  const sortRef = useRef(null);

  /* ─── scroll to top on mount ────────────────────────────── */
  /* ─── filter handlers ───────────────────────────────────── */
  const handleCategoryToggle = useCallback((catId) => {
    setSelectedCategories((prev) =>
      prev.includes(catId) ? prev.filter((c) => c !== catId) : [...prev, catId]
    );
  }, []);

  const handleSizeToggle = useCallback((sizeVal) => {
    setSelectedSizes((prev) =>
      prev.includes(sizeVal) ? prev.filter((s) => s !== sizeVal) : [...prev, sizeVal]
    );
  }, []);

  const handleClearAll = useCallback(() => {
    setSelectedCategories([]);
    setPriceRange([0, 100000]);
    setSelectedSizes([]);
    setSearchTerm('');
  }, []);

  const handleAddToCart = (painting) => {
    if (!isAuthenticated) {
      requireAuth(
        navigate,
        location,
        { type: 'addToCart', paintingId: painting.id },
        'Please log in to add items to your cart.'
      );
      return;
    }
    const firstImg = painting.images?.[0];
    const imageToUse = (typeof firstImg === 'object' ? firstImg?.url : firstImg) || painting.image;
    
    addItem({
      id: painting.id,
      title: painting.title,
      price: painting.price,
      image: imageToUse,
      size: painting.size,
      category: painting.category,
      quantity: 1,
    });
  };

  const handleToggleWishlist = async (painting) => {
    if (!isAuthenticated) {
      return navigate('/login', {
        state: { from: { pathname: '/shop' }, message: 'Login to manage your wishlist.' },
      });
    }

    const firstImg = painting.images?.[0];
    const imageToUse = (typeof firstImg === 'object' ? firstImg?.url : firstImg) || painting.image;

    try {
      await userAPI.toggleWishlist({
        productId: painting.id,
        title: painting.title,
        price: painting.price,
        image: imageToUse,
        size: painting.size,
        category: painting.category,
      });
      setWishlistIds((prev) => {
        const exists = prev.includes(painting.id);
        return exists ? prev.filter((id) => id !== painting.id) : [...prev, painting.id];
      });
    } catch (err) {
      console.error(err);
    }
  };

  const activeFilterCount =
    selectedCategories.length +
    selectedSizes.length +
    (priceRange[0] > 0 || priceRange[1] < 100000 ? 1 : 0);

  useEffect(() => {
    setWishlistIds(user?.wishlist?.map((item) => item.productId) || []);
  }, [user]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (sortRef.current && !sortRef.current.contains(event.target)) {
        setSortDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    let timeoutId;
    const loadProducts = async () => {
      setProductsLoading(true);
      setProductsError(null);
      setShowWakingUpMsg(false);
      
      timeoutId = setTimeout(() => {
        setShowWakingUpMsg(true);
      }, 5000);

      try {
        const response = await productAPI.getProducts();
        if (response.data.success && response.data.products) {
          const mappedProducts = response.data.products.map(p => ({
            ...p,
            id: p.productId || p._id,
            images: (p.images && p.images.length > 0) ? p.images : (p.gallery && p.gallery.length > 0 ? p.gallery : (p.image ? [p.image] : [])),
            inStock: p.stock > 0 && p.available !== false,
            artist: p.artist || 'Mithila Artist',
          }));
          const mergedProducts = [...paintings];
          mappedProducts.forEach(mp => {
            const index = mergedProducts.findIndex(p => p.id === mp.id);
            if (index !== -1) mergedProducts[index] = mp;
            else mergedProducts.push(mp);
          });
          setProducts(mergedProducts);
        } else {
          setProducts(paintings);
        }
      } catch (err) {
        setProductsError(err.response?.data?.message || 'Unable to load products');
        setProducts(paintings);
      } finally {
        clearTimeout(timeoutId);
        setProductsLoading(false);
        setShowWakingUpMsg(false);
      }
    };

    loadProducts();
    
    return () => clearTimeout(timeoutId);
  }, []);

  /* ─── filtered + sorted paintings ───────────────────────── */
  const filteredPaintings = useMemo(() => {
    let result = [...products];

    // Search
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(term) ||
          p.artist.toLowerCase().includes(term) ||
          p.category.toLowerCase().includes(term) ||
          (p.description && p.description.toLowerCase().includes(term))
      );
    }

    // Category
    if (selectedCategories.length > 0) {
      result = result.filter((p) => selectedCategories.includes(p.category));
    }

    // Price
    result = result.filter((p) => p.price >= priceRange[0] && p.price <= priceRange[1]);

    // Size
    if (selectedSizes.length > 0) {
      result = result.filter((p) => selectedSizes.includes(getSizeCategory(p.size)));
    }

    // Sort
    switch (sortBy) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        result.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
        break;
      case 'popular':
      default:
        result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
        break;
    }

    return result;
  }, [products, searchTerm, selectedCategories, priceRange, selectedSizes, sortBy]);


  const [heroRef, heroInView] = useInView({ triggerOnce: true, threshold: 0.2 });

  return (
    <>
      <Helmet>
        <title>Shop Collection — Mithila Art | Authentic Madhubani Paintings</title>
        <meta
          name="description"
          content="Browse and purchase authentic Mithila Madhubani paintings. Explore Kohbar, Bharni, Kachni, Godhana, Tantric, and Contemporary styles by master artists."
        />
        <meta property="og:title" content="Shop Mithila Art Collection" />
        <meta
          property="og:description"
          content="Discover handcrafted Madhubani paintings from Bihar. Each artwork comes with a certificate of authenticity."
        />
      </Helmet>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* ═══════ HERO BANNER ═══════ */}
        <section className="relative pt-24 pb-16 md:pt-32 md:pb-20 overflow-hidden bg-gradient-dark">
          {/* Background decor */}
          <div className="absolute inset-0 mithila-pattern opacity-10" />
          <motion.div
            className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-earth-500/10 blur-3xl"
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ duration: 12, repeat: Infinity }}
          />
          <motion.div
            className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-mithila-red/5 blur-3xl"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 10, repeat: Infinity, delay: 2 }}
          />

          <div className="container-custom relative z-10" ref={heroRef}>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              {/* Store badge */}
              <motion.div
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-earth-500/20 border border-earth-500/30 text-earth-400 text-xs font-body font-semibold tracking-widest uppercase mb-4 backdrop-blur-sm"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
              >
                <IoCartOutline size={14} />
                Official Store — Browse &amp; Purchase
              </motion.div>

              <motion.p
                className="font-accent text-earth-400 tracking-widest text-sm uppercase mb-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                कला संग्रह
              </motion.p>
              <h1 className="heading-xl text-white mb-4">
                Shop <span className="text-gradient-gold">Collection</span>
              </h1>
              <p className="text-cream-200/70 font-body text-lg max-w-2xl mx-auto">
                Each painting is a hand-crafted original, created using traditional techniques passed
                down through generations of Mithila women artisans. Add to cart and own a piece of
                living heritage.
              </p>

              {/* Breadcrumb + Gallery link */}
              <div className="flex items-center justify-center gap-2 mt-6 text-sm font-body flex-wrap">
                <Link to="/" className="text-cream-300/50 hover:text-earth-400 transition-colors">
                  Home
                </Link>
                <span className="text-cream-300/30">/</span>
                <span className="text-earth-400">Shop</span>
                <span className="text-cream-300/20 mx-2">·</span>
                <Link to="/gallery" className="text-cream-300/40 hover:text-earth-300 transition-colors flex items-center gap-1">
                  <FaArrowRight className="text-[10px]" />
                  View Gallery (browse only)
                </Link>
              </div>
            </motion.div>
          </div>

          {/* Bottom border */}
          <div className="absolute bottom-0 left-0 right-0 h-1 border-mithila-bottom" />
        </section>

        {/* ═══════ MAIN SHOP CONTENT ═══════ */}
        <section className="section-padding bg-cream-50 dark:bg-warm-gray-900 relative">
          <div className="absolute inset-0 mithila-pattern opacity-20" />

          <div className="container-custom relative z-10">
            {/* ── Top Bar: Search + Sort + View ── */}
            <motion.div
              className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {/* Search */}
              <div className="relative flex-1 w-full md:max-w-md">
                <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-warm-gray-500 text-sm" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search paintings, artists, styles..."
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-cream-200 dark:border-warm-gray-700 bg-white dark:bg-warm-gray-800 font-body text-sm text-charcoal dark:text-cream-200 placeholder-warm-gray-400 dark:placeholder-warm-gray-500 focus:outline-none focus:ring-2 focus:ring-earth-500/30 focus:border-earth-500 transition-all shadow-sm"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-warm-gray-500 hover:text-charcoal dark:hover:text-cream-200 transition-colors"
                  >
                    <IoCloseOutline size={18} />
                  </button>
                )}
              </div>

              <div className="flex items-center gap-3 w-full md:w-auto">
                {/* Mobile filter button */}
                <motion.button
                  onClick={() => setMobileFiltersOpen(true)}
                  className="xl:hidden flex items-center gap-2 px-4 py-3 bg-white dark:bg-warm-gray-800 border border-cream-200 dark:border-warm-gray-700 rounded-xl font-body text-sm text-charcoal dark:text-cream-200 shadow-sm hover:shadow-card transition-all"
                  whileTap={{ scale: 0.95 }}
                >
                  <FaSlidersH className="text-earth-500" />
                  Filters
                  {activeFilterCount > 0 && (
                    <span className="w-5 h-5 rounded-full bg-mithila-red text-white text-xs flex items-center justify-center font-bold">
                      {activeFilterCount}
                    </span>
                  )}
                </motion.button>

                {/* Sort dropdown */}
                <div className="relative" ref={sortRef}>
                  <motion.button
                    onClick={() => setSortDropdownOpen(!sortDropdownOpen)}
                    className="flex items-center gap-2 px-4 py-3 bg-white dark:bg-warm-gray-800 border border-cream-200 dark:border-warm-gray-700 rounded-xl font-body text-sm text-charcoal dark:text-cream-200 shadow-sm hover:shadow-card transition-all"
                    whileTap={{ scale: 0.95 }}
                  >
                    Sort: {sortOptions.find((s) => s.value === sortBy)?.label}
                    <FaChevronDown
                      className={`text-xs text-warm-gray-500 transition-transform ${
                        sortDropdownOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </motion.button>
                  <AnimatePresence>
                    {sortDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute right-0 top-full mt-2 w-52 bg-white dark:bg-warm-gray-800 rounded-xl shadow-card-hover dark:shadow-none border border-cream-200 dark:border-warm-gray-700 overflow-hidden z-30"
                      >
                        {sortOptions.map((opt) => (
                          <button
                            key={opt.value}
                            onClick={() => {
                              setSortBy(opt.value);
                              setSortDropdownOpen(false);
                            }}
                            className={`w-full text-left px-4 py-3 text-sm font-body hover:bg-cream-50 dark:hover:bg-warm-gray-700 transition-colors ${
                              sortBy === opt.value
                                ? 'text-earth-500 font-semibold bg-cream-50 dark:bg-warm-gray-700'
                                : 'text-warm-gray-600 dark:text-warm-gray-300'
                            }`}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* View mode */}
                <div className="hidden sm:flex items-center bg-white dark:bg-warm-gray-800 border border-cream-200 dark:border-warm-gray-700 rounded-xl overflow-hidden shadow-sm">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-3 transition-all ${
                      viewMode === 'grid'
                        ? 'bg-earth-500 text-white'
                        : 'text-warm-gray-500 hover:text-charcoal dark:hover:text-cream-200'
                    }`}
                  >
                    <IoGridOutline size={18} />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-3 transition-all ${
                      viewMode === 'list'
                        ? 'bg-earth-500 text-white'
                        : 'text-warm-gray-500 hover:text-charcoal dark:hover:text-cream-200'
                    }`}
                  >
                    <IoListOutline size={18} />
                  </button>
                </div>

                {/* Results count */}
                <div className="hidden md:block ml-2">
                  <p className="text-sm text-warm-gray-500 dark:text-warm-gray-300 font-body">
                    <span className="font-semibold text-charcoal dark:text-cream-200">{filteredPaintings.length}</span>{' '}
                    {filteredPaintings.length === 1 ? 'painting' : 'paintings'}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* ── Layout: Sidebar + Grid ── */}
            <div className="flex gap-8">
              {/* Desktop sidebar */}
              <motion.aside
                className="hidden lg:block w-72 flex-shrink-0"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
              >
                <div className="sticky top-28 glass-card p-6 rounded-2xl dark:bg-warm-gray-800 dark:border-warm-gray-700">
                  <FilterSidebar
                    selectedCategories={selectedCategories}
                    onCategoryToggle={handleCategoryToggle}
                    priceRange={priceRange}
                    onPriceChange={setPriceRange}
                    selectedSizes={selectedSizes}
                    onSizeToggle={handleSizeToggle}
                    onClearAll={handleClearAll}
                    activeFilterCount={activeFilterCount}
                  />
                </div>
              </motion.aside>

              {/* Products area */}
              <div className="flex-1 min-w-0">
                {/* Mobile results count */}
                <div className="md:hidden mb-4">
                  <p className="text-sm text-warm-gray-500 dark:text-warm-gray-300 font-body">
                    Showing <span className="font-semibold text-charcoal dark:text-cream-200">{filteredPaintings.length}</span>{' '}
                    {filteredPaintings.length === 1 ? 'painting' : 'paintings'}
                  </p>
                </div>

                {/* Active filter pills */}
                {activeFilterCount > 0 && (
                  <motion.div
                    className="flex flex-wrap gap-2 mb-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    {selectedCategories.map((catId) => {
                      const cat = categories.find((c) => c.id === catId);
                      return (
                        <motion.button
                          key={catId}
                          onClick={() => handleCategoryToggle(catId)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-earth-500/10 text-earth-600 text-xs font-body font-medium hover:bg-earth-500/20 transition-colors"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          exit={{ scale: 0 }}
                          layout
                        >
                          {cat?.name}
                          <IoCloseOutline size={14} />
                        </motion.button>
                      );
                    })}
                    {selectedSizes.map((s) => (
                      <motion.button
                        key={s}
                        onClick={() => handleSizeToggle(s)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-mithila-blue/10 text-mithila-blue text-xs font-body font-medium hover:bg-mithila-blue/20 transition-colors"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        layout
                      >
                        {sizeOptions.find((so) => so.value === s)?.label}
                        <IoCloseOutline size={14} />
                      </motion.button>
                    ))}
                    {(priceRange[0] > 0 || priceRange[1] < 100000) && (
                      <motion.button
                        onClick={() => setPriceRange([0, 100000])}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-mithila-green/10 text-mithila-green text-xs font-body font-medium hover:bg-mithila-green/20 transition-colors"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        layout
                      >
                        {formatPrice(priceRange[0])} — {formatPrice(priceRange[1])}
                        <IoCloseOutline size={14} />
                      </motion.button>
                    )}
                  </motion.div>
                )}

                {/* ── Product Grid/List ── */}
                {/* Waking-up banner — above the grid, not instead of it */}
                {productsLoading && showWakingUpMsg && (
                  <div className="bg-earth-500/10 dark:bg-earth-500/5 border border-earth-500/20 text-earth-700 dark:text-earth-400 p-4 rounded-xl flex flex-col items-center justify-center text-center animate-pulse mb-6">
                    <span className="font-display font-semibold mb-1 text-charcoal dark:text-cream-200">Connecting to server...</span>
                    <span className="text-sm font-body text-warm-gray-600 dark:text-warm-gray-300">The server is waking up from standby. This usually takes around 30 seconds, please wait...</span>
                  </div>
                )}

                {filteredPaintings.length > 0 ? (
                  <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    animate="visible"
                    className={
                      viewMode === 'grid'
                        ? 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6'
                        : 'flex flex-col gap-4'
                    }
                  >
                    <AnimatePresence mode="popLayout">
                      {filteredPaintings.map((painting) =>
                        viewMode === 'grid' ? (
                          <motion.div
                            key={painting.id}
                            variants={fadeUp}
                            layout
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.4 }}
                          >
                            <PaintingCard
                              painting={painting}
                              onAddToCart={handleAddToCart}
                              onToggleWishlist={handleToggleWishlist}
                              isWishlisted={wishlistIds.includes(painting.id)}
                            />
                          </motion.div>
                        ) : (
                          /* ── List View Card ── */
                          <motion.div
                            key={painting.id}
                            layout
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            whileHover={{ y: -2 }}
                            onClick={() => navigate(`/artwork/${painting._id || painting.id}`)}
                            className="flex gap-5 bg-white dark:bg-warm-gray-800 rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover dark:shadow-none dark:border dark:border-warm-gray-700/50 transition-all duration-500 group cursor-pointer"
                          >
                            <div className="relative w-40 md:w-52 flex-shrink-0 overflow-hidden">
                              <img
                                src={painting.images?.[0] || painting.image}
                                alt={painting.title}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                loading="lazy"
                              />
                              {painting.isNew && (
                                <span className="absolute top-2 left-2 px-2 py-0.5 bg-mithila-green text-white text-xs font-bold rounded-full">
                                  New
                                </span>
                              )}
                            </div>
                            <div className="flex-1 p-4 md:p-5 flex flex-col justify-between">
                              <div>
                                <p className="text-earth-500 text-xs font-body font-semibold tracking-wider uppercase mb-1">
                                  {painting.category}
                                </p>
                                <h3 className="font-display font-semibold text-lg text-charcoal dark:text-cream-100 mb-1">
                                  {painting.title}
                                </h3>
                                <p className="text-warm-gray-500 text-sm font-body mb-1">
                                  by {painting.artist} • {painting.size}
                                </p>
                                <p className="text-warm-gray-500 text-sm font-body line-clamp-2 hidden md:block">
                                  {painting.description}
                                </p>
                              </div>
                              <div className="flex items-center justify-between mt-3">
                                <div className="flex items-center gap-2">
                                  <span className="font-display font-bold text-xl text-earth-700 dark:text-earth-400">
                                    {formatPrice(painting.price)}
                                  </span>
                                  {painting.originalPrice && (
                                    <span className="text-warm-gray-500 line-through text-sm">
                                      {formatPrice(painting.originalPrice)}
                                    </span>
                                  )}
                                </div>
                                <div className="flex gap-2">
                                  <motion.button
                                    whileTap={{ scale: 0.9 }}
                                    onClick={(e) => { e.stopPropagation(); navigate(`/artwork/${painting._id || painting.id}`); }}
                                    className="px-3 py-2 text-sm font-body font-medium rounded-lg border border-cream-200 text-charcoal hover:bg-cream-50 transition-colors"
                                  >
                                    Quick View
                                  </motion.button>
                                  <motion.button
                                    whileTap={{ scale: 0.9 }}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleAddToCart(painting);
                                    }}
                                    disabled={!painting.inStock}
                                    className="px-4 py-2 text-sm font-body font-medium rounded-lg bg-earth-500 text-white hover:bg-earth-600 transition-colors disabled:opacity-50 flex items-center gap-1.5"
                                  >
                                    <IoCartOutline size={16} />
                                    {painting.inStock ? 'Add' : 'Sold'}
                                  </motion.button>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )
                      )}
                    </AnimatePresence>
                  </motion.div>
                ) : (
                  /* ── Empty State ── */
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center py-20"
                  >
                    <motion.div
                      className="w-24 h-24 mx-auto rounded-full bg-cream-100 flex items-center justify-center mb-6"
                      animate={{ y: [0, -8, 0] }}
                      transition={{ duration: 3, repeat: Infinity }}
                    >
                      <FaSearch className="text-3xl text-warm-gray-300" />
                    </motion.div>
                    <h3 className="heading-sm text-charcoal mb-2">No paintings found</h3>
                    <p className="text-body-sm mb-6 max-w-md mx-auto">
                      Try adjusting your filters or search term to discover more artworks from our
                      collection.
                    </p>
                    <motion.button
                      onClick={handleClearAll}
                      className="btn-secondary text-base"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Clear All Filters
                    </motion.button>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ═══════ MOBILE FILTER DRAWER ═══════ */}
        <AnimatePresence>
          {mobileFiltersOpen && (
            <>
              {/* Overlay */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-charcoal/60 backdrop-blur-sm z-50 xl:hidden"
                onClick={() => setMobileFiltersOpen(false)}
              />
              {/* Drawer */}
              <motion.div
                variants={slideIn}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="fixed left-0 top-0 bottom-0 w-80 max-w-[85vw] bg-white dark:bg-warm-gray-800 z-50 xl:hidden overflow-y-auto shadow-2xl border-r border-cream-200/50 dark:border-warm-gray-700/50"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-display font-bold text-xl text-charcoal dark:text-cream-100">Filters</h3>
                    <motion.button
                      onClick={() => setMobileFiltersOpen(false)}
                      className="w-10 h-10 rounded-full bg-cream-50 dark:bg-warm-gray-700 flex items-center justify-center hover:bg-cream-100 dark:hover:bg-warm-gray-600 transition-colors"
                      whileTap={{ scale: 0.9 }}
                    >
                      <IoCloseOutline size={22} className="text-charcoal dark:text-cream-200" />
                    </motion.button>
                  </div>
                  <FilterSidebar
                    selectedCategories={selectedCategories}
                    onCategoryToggle={handleCategoryToggle}
                    priceRange={priceRange}
                    onPriceChange={setPriceRange}
                    selectedSizes={selectedSizes}
                    onSizeToggle={handleSizeToggle}
                    onClearAll={handleClearAll}
                    activeFilterCount={activeFilterCount}
                  />
                  <motion.button
                    onClick={() => setMobileFiltersOpen(false)}
                    className="btn-primary w-full mt-8"
                    whileTap={{ scale: 0.95 }}
                  >
                    Show {filteredPaintings.length} Results
                  </motion.button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

    </motion.div>
    </>
  );
}
