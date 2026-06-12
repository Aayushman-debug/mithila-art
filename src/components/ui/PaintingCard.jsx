import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IoCartOutline, IoEyeOutline, IoHeartOutline, IoHeart, IoChevronBackOutline, IoChevronForwardOutline, IoMailOutline } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';

// ── Availability helpers ─────────────────────────────────────────────────────

/**
 * Resolve availabilityStatus — local paintings.js entries may omit the field,
 * so we fall back to the legacy `inStock` boolean and default to 'available'.
 */
function resolveStatus(painting) {
  if (painting.availabilityStatus) return painting.availabilityStatus;
  if (painting.inStock === false) return 'out_of_stock';
  return 'available';
}

const STATUS_CONFIG = {
  only_1_left: {
    label: 'Only 1 Left',
    dotClass: 'bg-orange-500',
    textClass: 'text-orange-600 dark:text-orange-400',
  },
  out_of_stock: {
    label: 'Out of Stock',
    dotClass: 'bg-mithila-red',
    textClass: 'text-mithila-red dark:text-red-400',
  },
  coming_soon: {
    label: 'Coming Soon',
    dotClass: 'bg-warm-gray-400',
    textClass: 'text-warm-gray-500 dark:text-warm-gray-400',
  },
  commission_available: {
    label: 'Commission Available',
    dotClass: 'bg-purple-500',
    textClass: 'text-purple-600 dark:text-purple-400',
  },
  available: {
    label: 'Available',
    dotClass: 'bg-emerald-500',
    textClass: 'text-emerald-600 dark:text-emerald-400',
  }
};

// ── Component ────────────────────────────────────────────────────────────────

export default function PaintingCard({ painting, onAddToCart, onToggleWishlist, isWishlisted }) {
  const navigate = useNavigate();
  const { id, title, artist, price, originalPrice, category, size, inStock } = painting;
  const images = painting.images && painting.images.length > 0 ? painting.images : [painting.image];
  const [currentImg, setCurrentImg] = useState(0);

  const status = resolveStatus(painting);
  const statusConfig = STATUS_CONFIG[status];

  // Disable cart for these statuses
  const isCartDisabled = status === 'out_of_stock' || status === 'coming_soon';
  const isCommission = status === 'commission_available';

  const formatPrice = (num) => {
    return '₹' + num.toLocaleString('en-IN');
  };

  const nextImg = (e) => {
    e.stopPropagation();
    setCurrentImg((prev) => (prev + 1) % images.length);
  };

  const prevImg = (e) => {
    e.stopPropagation();
    setCurrentImg((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleCardAction = (e) => {
    e.stopPropagation();
    if (isCommission) {
      navigate(`/commission?painting=${painting.id}&title=${encodeURIComponent(title)}`);
    } else if (!isCartDisabled) {
      onAddToCart?.(painting);
    }
  };

  return (
    <>
      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        whileHover={{ y: -6 }}
        transition={{ duration: 0.4 }}
        onClick={() => navigate(`/painting/${painting.id}`)}
        className="group relative bg-white dark:bg-warm-gray-800 rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover dark:shadow-none dark:hover:shadow-[0_10px_30px_-5px_rgba(139,105,20,0.15)] transition-all duration-500 border border-transparent dark:border-warm-gray-700/50 flex flex-col h-full cursor-pointer"
      >
        {/* Image */}
        <div className="relative aspect-[4/5] overflow-hidden">
          <div className="w-full h-full transition-transform duration-[1.2s] ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-105">
            <AnimatePresence mode="wait" initial={false}>
              <motion.img
                key={currentImg}
                src={images[currentImg]}
                alt={`${title} - Image ${currentImg + 1}`}
                loading="lazy"
                decoding="async"
                fetchPriority="auto"
                className={`w-full h-full object-cover transition-all duration-300 ${isCartDisabled ? 'brightness-75' : ''}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              />
            </AnimatePresence>
          </div>

          {/* Interior museum-quality frame overlay */}
          <div className="absolute inset-3 border border-earth-400/0 group-hover:border-earth-500/30 rounded-lg pointer-events-none transition-all duration-500 z-10" />

          {/* Image nav arrows — only if multiple images */}
          {images.length > 1 && (
            <>
              <button
                onClick={prevImg}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 backdrop-blur-sm text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-black/60 z-10"
              >
                <IoChevronBackOutline size={16} />
              </button>
              <button
                onClick={nextImg}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 backdrop-blur-sm text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-black/60 z-10"
              >
                <IoChevronForwardOutline size={16} />
              </button>
              {/* Dots */}
              <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                {images.map((_, i) => (
                  <button
                    key={i}
                    onClick={(e) => { e.stopPropagation(); setCurrentImg(i); }}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      i === currentImg ? 'bg-white scale-125' : 'bg-white/50 hover:bg-white/80'
                    }`}
                  />
                ))}
              </div>
            </>
          )}

          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-warm-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />

          {/* Quick Actions */}
          <div className="absolute bottom-3 left-3 right-3 flex opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500 z-10">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={(e) => { e.stopPropagation(); navigate(`/painting/${painting.id}`); }}
              className="flex-1 py-2.5 bg-white/95 backdrop-blur-md text-charcoal font-display font-semibold text-sm rounded-xl flex items-center justify-center gap-2 hover:bg-white shadow-lg transition-colors whitespace-nowrap"
            >
              <IoEyeOutline size={18} />
              View Artwork
            </motion.button>
          </div>

          {/* Wishlist */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleWishlist?.(painting);
            }}
            className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-all duration-300 hover:bg-white hover:text-mithila-red z-10"
          >
            {isWishlisted ? <IoHeart size={18} className="text-mithila-red" /> : <IoHeartOutline size={18} />}
          </button>
        </div>

        {/* Info */}
        <div className="p-5 flex flex-col flex-1">
          <p className="text-earth-500 dark:text-earth-400 text-xs font-body font-semibold tracking-widest uppercase mb-1.5">
            {category}
          </p>
          <h3 className="font-display font-semibold text-lg text-charcoal dark:text-warm-gray-100 leading-snug line-clamp-2 mb-1.5">
            {title}
          </h3>
          <p className="text-warm-gray-500 dark:text-warm-gray-300 text-sm font-body mb-3">{size}</p>
          <div className="flex flex-row items-center justify-between gap-2 mt-4 pt-3.5 border-t border-cream-200/50 dark:border-warm-gray-700/50">
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-display font-bold text-lg md:text-xl text-earth-700 dark:text-earth-400">
                  {formatPrice(price)}
                </span>
                {originalPrice && (
                  <span className="text-warm-gray-400 dark:text-warm-gray-500 line-through text-xs">
                    {formatPrice(originalPrice)}
                  </span>
                )}
              </div>
              {statusConfig && (
                <div className="mt-1">
                  <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider border ${
                    status === 'available' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-800 dark:text-emerald-400' :
                    status === 'only_1_left' ? 'bg-orange-500/10 border-orange-500/20 text-orange-800 dark:text-orange-400' :
                    status === 'out_of_stock' ? 'bg-mithila-red/10 border-mithila-red/20 text-mithila-red dark:text-red-400' :
                    status === 'commission_available' ? 'bg-purple-500/10 border-purple-500/20 text-purple-800 dark:text-purple-400' :
                    'bg-warm-gray-500/10 border-warm-gray-500/20 text-warm-gray-700 dark:text-warm-gray-300'
                  }`}>
                    {statusConfig.label}
                  </span>
                </div>
              )}
            </div>

            {/* Action button — shown in card footer */}
            {isCommission ? (
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleCardAction}
                className="flex items-center gap-1 px-2.5 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-[11px] font-bold rounded-xl transition-colors whitespace-nowrap"
              >
                <IoMailOutline size={13} />
                Commission
              </motion.button>
            ) : (
              <motion.button
                whileTap={!isCartDisabled ? { scale: 0.95 } : {}}
                onClick={handleCardAction}
                disabled={isCartDisabled}
                className={`flex items-center gap-1 px-2.5 py-1.5 text-[11px] font-bold rounded-xl transition-colors whitespace-nowrap ${
                  isCartDisabled
                    ? 'bg-warm-gray-200 dark:bg-warm-gray-700 text-warm-gray-400 cursor-not-allowed'
                    : 'bg-earth-500 hover:bg-earth-600 text-white'
                }`}
              >
                <IoCartOutline size={13} />
                {isCartDisabled ? (status === 'out_of_stock' ? 'Sold Out' : 'Soon') : 'Add'}
              </motion.button>
            )}
          </div>
        </div>
      </motion.div>


    </>
  );
}
