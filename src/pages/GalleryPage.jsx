import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { useInView } from 'react-intersection-observer';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import {
  FaSearch,
  FaTimes,
  FaExpand,
  FaFilter,
  FaThLarge,
  FaEye,
  FaHeart,
  FaShoppingBag,
  FaArrowRight,
} from 'react-icons/fa';
import { IoSparkles, IoGridOutline } from 'react-icons/io5';

import SectionHeading from '../components/ui/SectionHeading';

import { paintings, categories } from '../data/paintings';
import { formatPrice, generateWhatsAppLink } from '../utils/helpers';
import { productAPI } from '../api';

/* ───────── Animation Variants ───────── */
const staggerGrid = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

/* ───────── Lazy Image Component ───────── */
function LazyImage({ src, alt, className, onClick }) {
  const [loaded, setLoaded] = useState(false);
  const [ref, inView] = useInView({ triggerOnce: true, rootMargin: '200px 0px' });

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      {/* Shimmer placeholder */}
      {!loaded && (
        <div className="absolute inset-0 shimmer rounded-2xl" />
      )}
      {inView && (
        <motion.img
          src={src}
          alt={alt}
          className={`w-full h-full object-cover transition-opacity duration-700 cursor-pointer ${
            loaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={() => setLoaded(true)}
          onClick={onClick}
          loading="lazy"
          initial={{ scale: 1.1 }}
          animate={{ scale: loaded ? 1 : 1.1 }}
          transition={{ duration: 0.8 }}
        />
      )}
    </div>
  );
}

/* ───────── Gallery Item Component ───────── */
function GalleryItem({ item, index }) {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(false);

  // Create masonry heights: cycle through sizes
  const heights = ['h-64', 'h-80', 'h-72', 'h-96', 'h-64', 'h-80'];
  const heightClass = heights[index % heights.length];

  return (
    <motion.div
      layout
      layoutId={`gallery-item-${item.id}`}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={`relative group rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-shadow duration-500 cursor-pointer ${heightClass}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => navigate(`/painting/${item.id}`)}
    >
      <LazyImage
        src={item.images?.[0] || item.image}
        alt={item.title}
        className="absolute inset-0"
        onClick={() => navigate(`/painting/${item.id}`)}
      />

      {/* Hover overlay */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-t from-charcoal/90 via-charcoal/30 to-transparent flex flex-col justify-end p-5"
        initial={{ opacity: 0 }}
        animate={{ opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Category pill */}
        <motion.span
          className="inline-block self-start px-3 py-1 rounded-full bg-earth-500/20 backdrop-blur-sm text-earth-400 text-xs font-body font-medium mb-3 border border-earth-500/20"
          initial={{ y: 10, opacity: 0 }}
          animate={hovered ? { y: 0, opacity: 1 } : { y: 10, opacity: 0 }}
          transition={{ delay: 0.1 }}
        >
          {item.category}
        </motion.span>

        {/* Title */}
        <motion.h3
          className="font-display text-white text-lg font-bold leading-tight mb-1"
          initial={{ y: 10, opacity: 0 }}
          animate={hovered ? { y: 0, opacity: 1 } : { y: 10, opacity: 0 }}
          transition={{ delay: 0.15 }}
        >
          {item.title}
          {(item.images?.length > 1) && (
            <span className="text-earth-400 text-sm font-body font-normal ml-2">
              (1/{item.images.length})
            </span>
          )}
        </motion.h3>

        {/* Details */}
        <motion.div
          className="flex items-center gap-4 text-cream-200/60 text-sm font-body"
          initial={{ y: 10, opacity: 0 }}
          animate={hovered ? { y: 0, opacity: 1 } : { y: 10, opacity: 0 }}
          transition={{ delay: 0.2 }}
        >
          <span>{item.medium}</span>
          {item.size && <span>·</span>}
          {item.size && <span>{item.size}</span>}
        </motion.div>

        {/* Action buttons */}
        <motion.div
          className="flex items-center gap-3 mt-4"
          initial={{ y: 10, opacity: 0 }}
          animate={hovered ? { y: 0, opacity: 1 } : { y: 10, opacity: 0 }}
          transition={{ delay: 0.25 }}
        >
          <motion.button
            onClick={() => navigate(`/painting/${item.id}`)}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/15 backdrop-blur-sm border border-white/20 text-white text-sm hover:bg-white/25 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaExpand className="text-xs" />
            View Full
          </motion.button>
          <motion.button
            className="w-9 h-9 rounded-full bg-white/15 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-mithila-red/50 hover:border-mithila-red/30 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <FaHeart className="text-xs" />
          </motion.button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════
   MAIN GALLERY PAGE
   ═══════════════════════════════════════════════ */
export default function GalleryPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'all';

  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState('');

  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [showWakingUpMsg, setShowWakingUpMsg] = useState(false);

  useEffect(() => {
    let timeoutId;
    const loadProducts = async () => {
      setProductsLoading(true);
      setShowWakingUpMsg(false);
      
      timeoutId = setTimeout(() => {
        setShowWakingUpMsg(true);
      }, 3000);

      try {
        const response = await productAPI.getProducts();
        if (response.data.success && response.data.products) {
          const mappedProducts = response.data.products.map(p => ({
            ...p,
            id: p.productId || p._id,
            images: p.gallery && p.gallery.length > 0 ? p.gallery : (p.image ? [p.image] : []),
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

  // All unique categories
  const allCategories = useMemo(() => {
    return ['all', 'kohbar', 'bharni', 'kachni', 'godhana', 'religious'];
  }, []);

  // Filtered paintings
  const filteredPaintings = useMemo(() => {
    let results = products;
    if (activeCategory !== 'all') {
      results = results.filter(
        (p) => p.category.toLowerCase() === activeCategory.toLowerCase()
      );
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      results = results.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          (p.medium && p.medium.toLowerCase().includes(q)) ||
          (p.artist && p.artist.toLowerCase().includes(q))
      );
    }
    return results;
  }, [activeCategory, searchQuery, products]);



  const handleCategoryChange = useCallback(
    (cat) => {
      setActiveCategory(cat);
      if (cat === 'all') {
        searchParams.delete('category');
      } else {
        searchParams.set('category', cat);
      }
      setSearchParams(searchParams);
    },
    [searchParams, setSearchParams]
  );




  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Helmet>
        <title>Art Gallery — Lalita Pathak Mithila Art Studio | Madhubani Paintings Collection</title>
        <meta
          name="description"
          content="Browse our complete gallery of authentic Mithila (Madhubani) paintings. Filter by category — Kohbar, Godna, Tattoo, Nature, and Mythology. Each piece is hand-painted with natural pigments."
        />
        <meta name="keywords" content="Mithila painting gallery, Madhubani art collection, Indian folk art gallery, Bihar paintings" />
        <link rel="canonical" href="https://lalitapathakart.com/gallery" />
      </Helmet>
        {/* ─── Hero Banner ─── */}
        <section className="relative pt-32 pb-16 bg-charcoal overflow-hidden">
          <div className="absolute inset-0 bg-gradient-dark" />
          <div className="absolute inset-0 bg-dots opacity-5" />

          <motion.div
            className="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-earth-500/5 blur-3xl"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 12, repeat: Infinity }}
          />

          <div className="container-custom relative z-10 text-center px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-4"
            >
              <p className="font-accent text-earth-400 tracking-[0.3em] text-sm">कला दर्शनी</p>
              <h1 className="heading-xl text-white">
                The <span className="text-gradient-gold">Gallery</span>
              </h1>
              <p className="text-cream-200/60 font-body text-lg max-w-xl mx-auto">
                Explore the complete collection of hand-painted Mithila masterpieces
              </p>
            </motion.div>
          </div>
        </section>

        {/* ─── Filters & Search ─── */}
        <section className="sticky top-0 z-40 bg-cream-50/95 dark:bg-warm-gray-900/95 backdrop-blur-lg border-b border-cream-200/50 dark:border-warm-gray-700/50 py-4">
          <div className="container-custom px-4">
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              {/* Category pills */}
              <div className="w-full md:w-auto flex-1 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
                <FaFilter className="text-warm-gray-400 text-sm flex-shrink-0 mr-1" />
                {allCategories.map((cat) => (
                  <motion.button
                    key={cat}
                    onClick={() => handleCategoryChange(cat)}
                    className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-body font-medium transition-all duration-300 ${
                      activeCategory === cat
                        ? 'bg-gradient-gold text-white shadow-gold'
                        : 'bg-white dark:bg-warm-gray-800 text-warm-gray-600 dark:text-warm-gray-300 border border-cream-200 dark:border-warm-gray-700 hover:border-earth-500 hover:text-earth-500'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    layout
                  >
                    {cat === 'all' ? 'All Works' : cat}
                  </motion.button>
                ))}
              </div>

              {/* Search */}
              <div className="relative w-full md:w-72">
                <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-warm-gray-400 text-sm" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search paintings..."
                  className="w-full pl-10 pr-10 py-2.5 rounded-full bg-white border border-cream-200 text-charcoal font-body text-sm focus:outline-none focus:ring-2 focus:ring-earth-500/30 focus:border-earth-500 transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-warm-gray-400 hover:text-charcoal"
                  >
                    <FaTimes className="text-sm" />
                  </button>
                )}
              </div>
            </div>

            {/* Results count */}
            <motion.p
              className="text-warm-gray-400 text-sm font-body mt-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              key={filteredPaintings.length}
            >
              Showing <span className="text-earth-500 font-medium">{filteredPaintings.length}</span>{' '}
              {filteredPaintings.length === 1 ? 'artwork' : 'artworks'}
              {activeCategory !== 'all' && (
                <span>
                  {' '}in <span className="text-earth-500 font-medium">{activeCategory}</span>
                </span>
              )}
            </motion.p>
          </div>
        </section>

        {/* ─── Masonry Grid ─── */}
        <section className="section-padding bg-cream-50 dark:bg-warm-gray-900 relative">
          <div className="absolute inset-0 mithila-pattern opacity-10" />

          <div className="container-custom relative z-10">
            <LayoutGroup>
              <AnimatePresence mode="popLayout">
                {productsLoading ? (
                  <motion.div layout className="space-y-6">
                    {showWakingUpMsg && (
                      <div className="bg-earth-500/10 border border-earth-500/20 text-earth-700 p-4 rounded-xl flex flex-col items-center justify-center text-center animate-pulse">
                        <span className="font-display font-semibold mb-1 text-charcoal">Connecting to server...</span>
                        <span className="text-sm font-body text-warm-gray-600">The server is waking up from standby. This usually takes around 30 seconds, please wait...</span>
                      </div>
                    )}
                    <div className="columns-1 sm:columns-2 lg:columns-3 gap-5 space-y-5">
                      {[...Array(6)].map((_, index) => {
                        const heights = ['h-64', 'h-80', 'h-72', 'h-96', 'h-64', 'h-80'];
                        const heightClass = heights[index % heights.length];
                        return (
                          <div key={index} className={`w-full bg-warm-gray-200/60 rounded-2xl animate-pulse ${heightClass} break-inside-avoid inline-block`} />
                        );
                      })}
                    </div>
                  </motion.div>
                ) : filteredPaintings.length > 0 ? (
                  <motion.div
                    layout
                    className="columns-1 sm:columns-2 lg:columns-3 gap-5 space-y-5"
                  >
                    {filteredPaintings.map((item, index) => (
                      <GalleryItem
                        key={item.id}
                        item={item}
                        index={index}
                      />
                    ))}
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center py-20"
                  >
                    <IoGridOutline className="text-6xl text-warm-gray-300 mx-auto mb-4" />
                    <h3 className="font-display text-2xl text-charcoal mb-2">No artworks found</h3>
                    <p className="text-warm-gray-400 font-body">
                      Try adjusting your filters or search query
                    </p>
                    <motion.button
                      onClick={() => {
                        setActiveCategory('all');
                        setSearchQuery('');
                      }}
                      className="mt-6 btn-secondary text-base"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Reset Filters
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
            </LayoutGroup>
          </div>
        </section>

        {/* ─── Explore Shop CTA ─── */}
        <section className="py-16 bg-gradient-dark relative overflow-hidden">
          <div className="absolute inset-0 mithila-pattern opacity-5" />
          <motion.div
            className="absolute -top-10 -right-10 w-64 h-64 rounded-full bg-earth-500/5 blur-3xl"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 10, repeat: Infinity }}
          />
          <div className="container-custom relative z-10 text-center px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="max-w-2xl mx-auto space-y-4"
            >
              <p className="font-accent text-earth-400 tracking-widest text-xs uppercase">
                Ready to own a piece?
              </p>
              <h2 className="font-display text-3xl font-bold text-white">
                Love what you see?{' '}
                <span className="text-gradient-gold">Shop the Collection</span>
              </h2>
              <p className="text-cream-200/60 font-body text-base">
                Browse our curated store to find pricing, availability, and purchase your
                favourite Mithila masterpiece — each comes with a certificate of authenticity.
              </p>
              <div className="pt-4 flex items-center justify-center gap-4 flex-wrap">
                <Link to="/shop">
                  <motion.button
                    className="btn-primary flex items-center gap-2 group"
                    whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(139,105,20,0.3)' }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FaShoppingBag />
                    Explore Shop
                    <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                  </motion.button>
                </Link>
                <Link to="/commission">
                  <motion.button
                    className="btn-ghost flex items-center gap-2"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Request a Commission
                  </motion.button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
    </motion.div>
  );
}
