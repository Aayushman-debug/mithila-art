import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IoCartOutline, IoEyeOutline, IoHeartOutline, IoHeart, IoChevronBackOutline, IoChevronForwardOutline, IoImagesOutline } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';

export default function PaintingCard({ painting, onAddToCart, onToggleWishlist, isWishlisted }) {
  const navigate = useNavigate();
  const { id, title, artist, price, originalPrice, category, size, inStock } = painting;
  const images = painting.images && painting.images.length > 0 ? painting.images : [painting.image];
  const [currentImg, setCurrentImg] = useState(0);

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

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.4 }}
      className="group relative bg-white dark:bg-warm-gray-800 rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover dark:shadow-none dark:hover:shadow-[0_10px_30px_-5px_rgba(139,105,20,0.15)] transition-all duration-500 border border-transparent dark:border-warm-gray-700/50"
    >
      {/* Image */}
      <div className="relative aspect-[4/5] overflow-hidden">
        <AnimatePresence mode="wait" initial={false}>
          <motion.img
            key={currentImg}
            src={images[currentImg]}
            alt={`${title} - Image ${currentImg + 1}`}
            loading="lazy"
            className="w-full h-full object-cover"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          />
        </AnimatePresence>

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
            <div className="absolute bottom-14 left-1/2 -translate-x-1/2 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
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
        <div className="absolute bottom-4 left-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500 z-10">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => onAddToCart?.(painting)}
            disabled={!inStock}
            className="flex-1 py-2.5 bg-white/90 backdrop-blur-sm text-charcoal font-body font-semibold text-sm rounded-xl flex items-center justify-center gap-2 hover:bg-white transition-colors disabled:opacity-50"
          >
            <IoCartOutline size={18} />
            {inStock ? 'Add to Cart' : 'Sold Out'}
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate(`/painting/${painting.id}`)}
            className="w-11 h-11 bg-white/90 backdrop-blur-sm rounded-xl flex items-center justify-center hover:bg-white transition-colors"
          >
            <IoEyeOutline size={18} className="text-charcoal" />
          </motion.button>
        </div>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
          {painting.isNew && (
            <span className="px-3 py-1 bg-mithila-green text-white text-xs font-bold rounded-full uppercase tracking-wider">
              New
            </span>
          )}
          {originalPrice && (
            <span className="px-3 py-1 bg-mithila-red text-white text-xs font-bold rounded-full">
              {Math.round((1 - price / originalPrice) * 100)}% Off
            </span>
          )}
          {!inStock && (
            <span className="px-3 py-1 bg-warm-gray-700 text-white text-xs font-bold rounded-full uppercase tracking-wider">
              Sold
            </span>
          )}
          {images.length > 1 && (
            <span className="px-2.5 py-1 bg-black/50 backdrop-blur-sm text-white text-xs font-medium rounded-full flex items-center gap-1">
              <IoImagesOutline size={12} />
              {images.length}
            </span>
          )}
        </div>

        {/* Wishlist */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist?.(painting);
          }}
          className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white hover:text-mithila-red z-10"
        >
          {isWishlisted ? <IoHeart size={18} className="text-mithila-red" /> : <IoHeartOutline size={18} />}
        </button>
      </div>

      {/* Info */}
      <div className="p-5">
        <p className="text-earth-500 dark:text-earth-400 text-xs font-body font-semibold tracking-widest uppercase mb-1.5">
          {category}
        </p>
        <h3 className="font-display font-semibold text-lg text-charcoal dark:text-cream-100 leading-snug line-clamp-2 mb-1.5">
          {title}
        </h3>
        <p className="text-warm-gray-400 dark:text-warm-gray-500 text-sm font-body mb-3">{size}</p>
        <div className="flex items-center gap-2">
          <span className="font-display font-bold text-xl text-earth-700 dark:text-earth-400">
            {formatPrice(price)}
          </span>
          {originalPrice && (
            <span className="text-warm-gray-400 dark:text-warm-gray-500 line-through text-sm">
              {formatPrice(originalPrice)}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}
