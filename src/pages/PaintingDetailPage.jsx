import { useState, useMemo, useCallback, useEffect } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import {
  IoArrowBackOutline,
  IoChevronBackOutline,
  IoChevronForwardOutline,
  IoCartOutline,
  IoLogoInstagram,
  IoLogoWhatsapp,
  IoLogoFacebook,
  IoCopyOutline,
  IoCheckmarkOutline,
  IoShareSocialOutline,
  IoMailOutline,
  IoTimeOutline,
  IoAlertCircleOutline,
  IoFlameOutline,
  IoBrushOutline,
} from 'react-icons/io5';
import { paintings } from '../data/paintings';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/helpers';
import { useAuth } from '../context/AuthContext';
import ShareModal from '../components/ui/ShareModal';
import { productAPI } from '../api';

// ── Availability helpers ─────────────────────────────────────────────────────

function resolveStatus(painting) {
  if (!painting) return 'available';
  if (painting.availabilityStatus) return painting.availabilityStatus;
  if (painting.inStock === false) return 'out_of_stock';
  return 'available';
}

const STATUS_BADGE = {
  available: {
    label: 'In Stock',
    icon: IoCheckmarkOutline,
    className: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30',
    dot: 'bg-emerald-500',
  },
  only_1_left: {
    label: 'Only 1 Left — Act Fast!',
    icon: IoFlameOutline,
    className: 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/30',
    dot: 'bg-orange-500',
  },
  out_of_stock: {
    label: 'Currently Unavailable',
    icon: IoAlertCircleOutline,
    className: 'bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/30',
    dot: 'bg-red-500',
  },
  coming_soon: {
    label: 'Coming Soon',
    icon: IoTimeOutline,
    className: 'bg-warm-gray-200 dark:bg-warm-gray-700 text-warm-gray-600 dark:text-warm-gray-300 border border-warm-gray-300 dark:border-warm-gray-600',
    dot: 'bg-warm-gray-400',
  },
  commission_available: {
    label: 'Original Sold — Commission Available',
    icon: IoBrushOutline,
    className: 'bg-purple-500/10 text-purple-700 dark:text-purple-300 border border-purple-500/30',
    dot: 'bg-purple-500',
  },
};

// ── Component ────────────────────────────────────────────────────────────────

export default function PaintingDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { addItem } = useCart();
  const { isAuthenticated } = useAuth();

  const [painting, setPainting] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);

    async function loadProduct() {
      try {
        const response = await productAPI.getProductById(id);
        if (active) {
          if (response.data && response.data.success && response.data.product) {
            const p = response.data.product;
            setPainting({
              ...p,
              id: p.productId || p._id,
              images: p.gallery && p.gallery.length > 0 ? p.gallery : (p.image ? [p.image] : []),
              inStock: p.stock > 0 && p.available !== false,
              artist: p.artist || 'Mithila Artist',
            });
          } else {
            throw new Error('Product not found in API response');
          }
        }
      } catch (err) {
        console.warn('API error, falling back to local paintings database:', err);
        if (active) {
          const localMatch = paintings.find((p) => p.id === id);
          if (localMatch) {
            setPainting(localMatch);
          } else {
            setError('Artwork not found');
          }
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadProduct();
    return () => {
      active = false;
    };
  }, [id]);

  const images = useMemo(() => {
    if (!painting) return [];
    if (painting.images && painting.images.length > 0) return painting.images;
    if (painting.gallery && painting.gallery.length > 0) return painting.gallery;
    if (painting.image) return [painting.image];
    return [];
  }, [painting]);

  const [activeIndex, setActiveIndex] = useState(0);
  const [addedToCart, setAddedToCart] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  // Reset activeIndex when the painting/images change
  useEffect(() => {
    setActiveIndex(0);
  }, [images]);

  const status = resolveStatus(painting);
  const badgeCfg = STATUS_BADGE[status] ?? STATUS_BADGE.available;
  const BadgeIcon = badgeCfg.icon;

  // Derived flags
  const isCartDisabled = status === 'out_of_stock' || status === 'coming_soon';
  const isCommission = status === 'commission_available';

  const relatedPaintings = useMemo(() => {
    if (!painting) return [];
    return paintings
      .filter((p) => p.category === painting.category && p.id !== painting.id)
      .slice(0, 4);
  }, [painting]);

  const handlePrev = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  const handleNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const handleAddToCart = useCallback(() => {
    if (painting && !isCartDisabled && !isCommission) {
      addItem(painting);
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 2000);
    }
  }, [painting, addItem, isCartDisabled, isCommission]);

  const handleBuyNow = useCallback(() => {
    if (painting && !isCartDisabled && !isCommission) {
      if (!isAuthenticated) {
        navigate('/login', { state: { from: '/cart' } });
        return;
      }
      addItem(painting);
      navigate('/cart');
    }
  }, [painting, addItem, navigate, isAuthenticated, isCartDisabled, isCommission]);

  const handleRequestCommission = useCallback(() => {
    if (painting) {
      navigate(`/commission?painting=${painting.id}&title=${encodeURIComponent(painting.title)}`);
    }
  }, [painting, navigate]);

  /* ── Loading ── */
  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="min-h-screen bg-cream-50 dark:bg-warm-gray-900 pt-28 pb-20 flex items-center justify-center"
      >
        <div className="text-center py-20">
          <div className="inline-block w-12 h-12 border-4 border-earth-500/20 border-t-earth-500 rounded-full animate-spin mb-4"></div>
          <p className="text-body text-warm-gray-600 dark:text-warm-gray-400 font-body">Loading artwork details...</p>
        </div>
      </motion.div>
    );
  }

  /* ── Error / Not Found ── */
  if (error || !painting) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="min-h-screen bg-cream-50 dark:bg-warm-gray-900 pt-28 pb-20"
      >
        <div className="container-custom text-center py-20">
          <h1 className="heading-lg text-charcoal dark:text-cream-100 mb-4">Artwork Not Found</h1>
          <p className="text-body mb-8">{error || "The artwork you're looking for doesn't exist or has been removed."}</p>
          <Link to="/gallery" className="btn-primary">Back to Gallery</Link>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-cream-50 dark:bg-warm-gray-900"
    >
      <Helmet>
        <title>{painting.title} — Lalita Pathak Mithila Art</title>
        <meta name="description" content={painting.description || `${painting.title} — authentic Mithila painting by ${painting.artist}`} />
      </Helmet>

      {/* ── Back Navigation ── */}
      <div className="pt-24 pb-4 bg-cream-50 dark:bg-warm-gray-900 border-b border-cream-200/50 dark:border-warm-gray-700/50">
        <div className="container-custom px-4">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-warm-gray-500 hover:text-earth-500 font-body text-sm transition-colors"
          >
            <IoArrowBackOutline size={18} />
            Back to Gallery
          </button>
        </div>
      </div>

      {/* ── Main Content ── */}
      <section className="container-custom px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14 items-start">

          {/* ─── Left: Image Gallery ─── */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative bg-warm-gray-100 dark:bg-warm-gray-800 rounded-2xl overflow-hidden">
              <AnimatePresence mode="wait" initial={false}>
                <motion.img
                  key={activeIndex}
                  src={images[activeIndex]}
                  alt={`${painting.title} — Image ${activeIndex + 1}`}
                  className={`w-full h-auto max-h-[75vh] object-contain mx-auto transition-all duration-300 ${
                    isCartDisabled ? 'brightness-75 grayscale-[30%]' : ''
                  }`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                />
              </AnimatePresence>

              {/* Nav arrows */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={handlePrev}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm text-white flex items-center justify-center hover:bg-black/60 transition-colors z-10"
                  >
                    <IoChevronBackOutline size={20} />
                  </button>
                  <button
                    onClick={handleNext}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm text-white flex items-center justify-center hover:bg-black/60 transition-colors z-10"
                  >
                    <IoChevronForwardOutline size={20} />
                  </button>
                  {/* Counter badge */}
                  <div className="absolute bottom-3 right-3 px-3 py-1 rounded-full bg-black/50 backdrop-blur-sm text-white text-xs font-body">
                    {activeIndex + 1} / {images.length}
                  </div>
                </>
              )}
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveIndex(i)}
                    className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all duration-300 ${
                      i === activeIndex
                        ? 'border-earth-500 shadow-gold ring-2 ring-earth-500/30'
                        : 'border-cream-200 dark:border-warm-gray-700 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`Thumbnail ${i + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ─── Right: Details ─── */}
          <div className="space-y-6">
            {/* Category */}
            <span className="inline-block px-4 py-1.5 rounded-full bg-earth-500/10 text-earth-600 dark:text-earth-400 text-xs font-body font-semibold tracking-widest uppercase border border-earth-500/20">
              {painting.category}
            </span>

            {/* Title */}
            <h1 className="font-display text-3xl md:text-4xl font-bold text-charcoal dark:text-cream-100 leading-tight">
              {painting.title}
            </h1>
            {painting.titleHindi && (
              <p className="font-accent text-earth-500 text-lg -mt-3">{painting.titleHindi}</p>
            )}

            {/* Artist */}
            <p className="text-warm-gray-500 dark:text-warm-gray-400 font-body text-base">
              by <span className="text-charcoal dark:text-cream-200 font-semibold">{painting.artist}</span>
            </p>

            {/* ── Prominent Availability Badge ── */}
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-body font-semibold text-sm ${badgeCfg.className}`}
            >
              <span className={`w-2 h-2 rounded-full flex-shrink-0 ${badgeCfg.dot}`} />
              <BadgeIcon size={16} className="flex-shrink-0" />
              {badgeCfg.label}
            </motion.div>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="font-display text-3xl font-bold text-earth-700 dark:text-earth-400">
                {formatPrice(painting.price)}
              </span>
              {painting.originalPrice && (
                <>
                  <span className="text-warm-gray-400 line-through text-lg font-body">
                    {formatPrice(painting.originalPrice)}
                  </span>
                  <span className="px-2 py-0.5 bg-mithila-red/10 text-mithila-red text-xs font-bold rounded-full">
                    {Math.round((1 - painting.price / painting.originalPrice) * 100)}% OFF
                  </span>
                </>
              )}
            </div>

            {/* Description */}
            {painting.description && (
              <p className="text-warm-gray-600 dark:text-warm-gray-400 font-body leading-relaxed text-base">
                {painting.description}
              </p>
            )}

            {/* Details Grid */}
            <div className="grid grid-cols-2 gap-4 pt-2">
              {painting.style && (
                <div className="bg-white dark:bg-warm-gray-800 rounded-xl p-4 border border-cream-200/60 dark:border-warm-gray-700/50">
                  <p className="text-xs text-warm-gray-400 uppercase tracking-wider font-body mb-1">Style</p>
                  <p className="font-display font-semibold text-charcoal dark:text-cream-100">{painting.style}</p>
                </div>
              )}
              {painting.size && (
                <div className="bg-white dark:bg-warm-gray-800 rounded-xl p-4 border border-cream-200/60 dark:border-warm-gray-700/50">
                  <p className="text-xs text-warm-gray-400 uppercase tracking-wider font-body mb-1">Size</p>
                  <p className="font-display font-semibold text-charcoal dark:text-cream-100">{painting.size}</p>
                </div>
              )}
              {painting.medium && (
                <div className="bg-white dark:bg-warm-gray-800 rounded-xl p-4 border border-cream-200/60 dark:border-warm-gray-700/50 col-span-2">
                  <p className="text-xs text-warm-gray-400 uppercase tracking-wider font-body mb-1">Medium</p>
                  <p className="font-display font-semibold text-charcoal dark:text-cream-100">{painting.medium}</p>
                </div>
              )}
            </div>

            {/* ── CTA Buttons based on status ── */}

            {/* COMMISSION AVAILABLE — hide buy/cart, show commission CTA */}
            {isCommission ? (
              <div className="space-y-3">
                <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-700 dark:text-purple-300 font-body text-sm leading-relaxed">
                  The original painting has been sold. You can request a custom commission based on this design.
                </div>
                <motion.button
                  onClick={handleRequestCommission}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-display font-semibold text-lg flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transition-all duration-300"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <IoBrushOutline size={22} />
                  Original Sold — Request Commission
                </motion.button>
              </div>
            ) : (
              <>
                {/* OUT OF STOCK / COMING SOON — disabled with message */}
                {isCartDisabled && (
                  <div className={`p-4 rounded-xl font-body text-sm leading-relaxed ${
                    status === 'out_of_stock'
                      ? 'bg-red-500/10 border border-red-500/30 text-red-700 dark:text-red-300'
                      : 'bg-warm-gray-200/60 dark:bg-warm-gray-700/60 border border-warm-gray-300 dark:border-warm-gray-600 text-warm-gray-600 dark:text-warm-gray-300'
                   }`}>
                    {status === 'out_of_stock'
                      ? 'This artwork is currently unavailable. Please check back later or contact us for a commission.'
                      : <>This artwork is coming soon. Stay tuned or reach out to be notified when it&apos;s available.</>}
                  </div>
                )}

                {/* ONLY 1 LEFT — urgency message */}
                {status === 'only_1_left' && (
                  <div className="p-3 rounded-xl bg-orange-500/10 border border-orange-500/30 text-orange-700 dark:text-orange-300 font-body text-sm flex items-center gap-2">
                    <IoFlameOutline size={18} className="flex-shrink-0" />
                    This is the last original available. Don't miss out!
                  </div>
                )}

                {/* Add to Cart */}
                <motion.button
                  onClick={handleAddToCart}
                  disabled={isCartDisabled}
                  className="w-full py-4 rounded-xl bg-gradient-gold text-white font-display font-semibold text-lg flex items-center justify-center gap-3 shadow-gold hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  whileHover={!isCartDisabled ? { scale: 1.02 } : {}}
                  whileTap={!isCartDisabled ? { scale: 0.98 } : {}}
                >
                  {addedToCart ? (
                    <><IoCheckmarkOutline size={22} /> Added to Cart!</>
                  ) : isCartDisabled ? (
                    status === 'out_of_stock' ? 'Currently Unavailable' : 'Coming Soon'
                  ) : (
                    <><IoCartOutline size={22} /> Add to Cart — {formatPrice(painting.price)}</>
                  )}
                </motion.button>

                {/* Buy Now */}
                <motion.button
                  onClick={handleBuyNow}
                  disabled={isCartDisabled}
                  className="w-full py-4 rounded-xl bg-charcoal text-white font-display font-semibold text-lg flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed mt-3"
                  whileHover={!isCartDisabled ? { scale: 1.02 } : {}}
                  whileTap={!isCartDisabled ? { scale: 0.98 } : {}}
                >
                  Buy Now
                </motion.button>
              </>
            )}

            {/* ── Secondary Actions ── */}
            <div className="mt-3">
              <button
                onClick={() => setIsShareModalOpen(true)}
                className="w-full py-3 rounded-xl border border-cream-200 dark:border-warm-gray-700 bg-white dark:bg-warm-gray-800 flex items-center justify-center gap-2 font-body font-semibold text-sm text-charcoal dark:text-cream-100 hover:border-earth-500 hover:text-earth-500 transition-colors"
              >
                <IoShareSocialOutline size={18} />
                Share Artwork
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Related Artworks ── */}
      {relatedPaintings.length > 0 && (
        <section className="container-custom px-4 pb-16">
          <h2 className="font-display text-2xl font-bold text-charcoal dark:text-cream-100 mb-8">
            Related Artworks
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {relatedPaintings.map((rp) => (
              <Link
                key={rp.id}
                to={`/painting/${rp.id}`}
                className="group block rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-500 bg-white dark:bg-warm-gray-800"
              >
                <div className="aspect-[4/5] overflow-hidden">
                  <img
                    src={rp.images?.[0] || rp.image}
                    alt={rp.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    loading="lazy"
                  />
                </div>
                <div className="p-4">
                  <p className="text-earth-500 dark:text-earth-400 text-xs font-body font-semibold tracking-widest uppercase mb-1">{rp.category}</p>
                  <h3 className="font-display font-semibold text-sm text-charcoal dark:text-cream-100 leading-snug line-clamp-2 mb-1">{rp.title}</h3>
                  <p className="font-display font-bold text-earth-700 dark:text-earth-400">{formatPrice(rp.price)}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Render Share Modal */}
      <AnimatePresence>
        {isShareModalOpen && (
          <ShareModal
            isOpen={isShareModalOpen}
            onClose={() => setIsShareModalOpen(false)}
            painting={painting}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
