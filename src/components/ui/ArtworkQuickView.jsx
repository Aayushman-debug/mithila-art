import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  IoHeartOutline, 
  IoHeart, 
  IoCartOutline, 
  IoFlashOutline, 
  IoShareSocialOutline,
  IoChevronBackOutline,
  IoChevronForwardOutline
} from 'react-icons/io5';
import FloatingWindow from './FloatingWindow';
import FallbackImage from './FallbackImage';
import LoadingSpinner from './LoadingSpinner';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { userAPI } from '../../api';
import { formatPrice } from '../../utils/helpers';


export default function ArtworkQuickView({ artwork, isOpen, onClose, allArtworks = [] }) {
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { user, isAuthenticated } = useAuth();
  
  const [currentArtwork, setCurrentArtwork] = useState(artwork);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setCurrentArtwork(artwork);
      setActiveImageIndex(0); // Reset on open
      if (artwork?.variants && artwork.variants.length > 0) {
        setSelectedVariant(artwork.variants[0]);
      } else {
        setSelectedVariant(null);
      }
    }
  }, [isOpen, artwork]);

  useEffect(() => {
    if (isAuthenticated && currentArtwork && isOpen) {
      userAPI.getWishlist().then(res => {
        if (res.data.success) {
          const inWishlist = res.data.wishlist.some(item => 
            (item.productId === currentArtwork._id || item.productId === currentArtwork.productId)
          );
          setIsWishlisted(inWishlist);
        }
      }).catch(err => console.error('Wishlist error:', err));
    }
  }, [isAuthenticated, currentArtwork, isOpen]);

  const handleToggleWishlist = async () => {
    if (!isAuthenticated) {
      alert("Please log in to add to wishlist.");
      return;
    }
    const previousState = isWishlisted;
    setIsWishlisted(!isWishlisted);
    try {
      await userAPI.toggleWishlist({ productId: currentArtwork._id || currentArtwork.id });
    } catch (err) {
      console.error('Toggle wishlist failed:', err);
      setIsWishlisted(previousState);
    }
  };

  const getCartItem = () => ({
    ...currentArtwork,
    variantId: selectedVariant?.variantId,
    variantName: selectedVariant?.variantName,
    price: selectedVariant ? selectedVariant.price : currentArtwork.price,
    image: selectedVariant?.image?.url || (currentArtwork.images?.length > 0 ? (currentArtwork.images[activeImageIndex]?.url || currentArtwork.images[activeImageIndex]) : currentArtwork.image),
    size: selectedVariant ? selectedVariant.size : currentArtwork.size,
    medium: selectedVariant ? selectedVariant.medium : currentArtwork.medium,
  });

  const handleAddToCart = () => {
    setAddingToCart(true);
    addItem(getCartItem());
    setTimeout(() => {
      setAddingToCart(false);
      onClose();
    }, 400);
  };

  const handleBuyNow = () => {
    addItem(getCartItem());
    onClose();
    navigate('/cart');
  };

  if (!currentArtwork) return null;

  const hasVariants = currentArtwork.variants && currentArtwork.variants.length > 0;
  const images = currentArtwork.images?.length > 0 ? currentArtwork.images : [{ url: currentArtwork.image }];
  const mainImage = selectedVariant?.image?.url || (images[activeImageIndex]?.url || images[activeImageIndex] || currentArtwork.image);
  
  const activePrice = selectedVariant ? selectedVariant.price : currentArtwork.price;
  const activeStatus = selectedVariant ? selectedVariant.availabilityStatus : currentArtwork.availabilityStatus;
  const activeStock = selectedVariant ? selectedVariant.stock : currentArtwork.stock;
  
  const isAvailable = activeStatus !== 'out_of_stock' && activeStock !== 0 && activeStock !== false && currentArtwork.inStock !== false;

  const currentIndex = allArtworks.findIndex(p => p.id === currentArtwork?.id || p.productId === currentArtwork?.id || p._id === currentArtwork?._id);
  
  const handlePrev = () => {
    if (currentIndex > 0) {
      const nextArt = allArtworks[currentIndex - 1];
      setCurrentArtwork(nextArt);
      setActiveImageIndex(0);
      setSelectedVariant(nextArt.variants?.[0] || null);
    }
  };

  const handleNext = () => {
    if (currentIndex !== -1 && currentIndex < allArtworks.length - 1) {
      const nextArt = allArtworks[currentIndex + 1];
      setCurrentArtwork(nextArt);
      setActiveImageIndex(0);
      setSelectedVariant(nextArt.variants?.[0] || null);
    }
  };

  return (
    <FloatingWindow isOpen={isOpen} onClose={onClose} size="xl" title={currentArtwork.title}>
      {/* Quick View Navigation */}
      <div className="flex items-center justify-between mb-6 pb-2 border-b border-cream-200/50 dark:border-warm-gray-700/50">
        <div className="flex items-center gap-2">
          <button 
            onClick={onClose} 
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-warm-gray-600 dark:text-warm-gray-300 hover:bg-warm-gray-100 dark:hover:bg-warm-gray-800 hover:text-charcoal dark:hover:text-cream-50 transition-colors"
          >
            <IoChevronBackOutline />
            Back
          </button>
          <button 
            onClick={onClose} 
            className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium text-mithila-red hover:bg-mithila-red/10 transition-colors"
            title="Close Quick View"
          >
            Close ✕
          </button>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={handlePrev} 
            disabled={currentIndex <= 0} 
            className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium text-warm-gray-600 dark:text-warm-gray-300 hover:bg-warm-gray-100 dark:hover:bg-warm-gray-800 hover:text-charcoal dark:hover:text-cream-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <IoChevronBackOutline /> Prev Artwork
          </button>
          <button 
            onClick={handleNext} 
            disabled={currentIndex === -1 || currentIndex >= allArtworks.length - 1} 
            className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium text-warm-gray-600 dark:text-warm-gray-300 hover:bg-warm-gray-100 dark:hover:bg-warm-gray-800 hover:text-charcoal dark:hover:text-cream-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Next Artwork <IoChevronForwardOutline />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 h-full pb-4">
        
        {/* Left Column: Image Gallery */}
        <div className="md:col-span-7 flex flex-col md:flex-row gap-4 h-[50vh] md:h-[70vh]">
          {/* Thumbnails / Variant Selector */}
          {hasVariants ? (
            <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto md:w-20 shrink-0 pb-2 md:pb-0 custom-scrollbar">
              {currentArtwork.variants.map((v, idx) => (
                <button
                  key={v.variantId || idx}
                  onClick={() => setSelectedVariant(v)}
                  title={v.variantName}
                  className={`relative w-20 h-24 md:w-full md:h-24 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                    selectedVariant?.variantId === v.variantId ? 'border-earth-500 opacity-100' : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <FallbackImage src={v.image?.url || currentArtwork.image} alt={v.variantName} className="w-full h-full object-cover" />
                  <div className="absolute bottom-0 inset-x-0 bg-black/60 text-white text-[10px] py-1 text-center truncate px-1">
                    {v.variantName || `Var ${idx + 1}`}
                  </div>
                </button>
              ))}
            </div>
          ) : (
            images.length > 1 && (
              <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto md:w-20 shrink-0 pb-2 md:pb-0 custom-scrollbar">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative w-20 h-24 md:w-full md:h-24 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                      activeImageIndex === idx ? 'border-earth-500 opacity-100' : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <FallbackImage src={img.url || img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )
          )}

          {/* Main Image */}
          <div className="flex-1 w-full bg-cream-50/50 dark:bg-warm-gray-800/50 rounded-2xl p-4 border border-cream-200/50 dark:border-warm-gray-700/50 relative group overflow-hidden flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedVariant ? selectedVariant.variantId : activeImageIndex}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="w-full h-full relative flex justify-center"
              >
                <FallbackImage src={mainImage} alt={currentArtwork.title} className="w-full h-full object-contain drop-shadow-2xl mix-blend-multiply dark:mix-blend-normal" />
              </motion.div>
            </AnimatePresence>
            
            <div className="absolute top-4 left-4">
              <span className="px-3 py-1 rounded-full bg-white/80 dark:bg-warm-gray-800/80 backdrop-blur-md border border-white/40 dark:border-warm-gray-600/40 text-charcoal dark:text-cream-50 font-body text-[10px] font-bold uppercase tracking-wider shadow-sm">
                {currentArtwork.category || 'Mithila Art'}
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Details */}
        <div className="md:col-span-5 flex flex-col justify-start md:overflow-y-auto custom-scrollbar md:pr-4 pb-20 md:pb-0">
          <div className="space-y-6">
            <div className="space-y-2">
              <p className="text-2xl font-display text-earth-600 dark:text-earth-400 font-semibold">
                {formatPrice(activePrice)}
              </p>
              {!isAvailable && (
                <span className="inline-block px-3 py-1 bg-mithila-red/10 text-mithila-red rounded-full text-xs font-bold">
                  Out of Stock
                </span>
              )}
            </div>

            <div className="flex flex-col gap-3 pt-4 border-t border-cream-200 dark:border-warm-gray-700/50">
              <div className="flex gap-3">
                <button 
                  onClick={handleAddToCart}
                  disabled={!isAvailable || addingToCart}
                  className={`flex-1 h-12 md:h-14 rounded-full flex items-center justify-center gap-2 font-body font-semibold text-sm transition-all ${
                    isAvailable 
                      ? 'bg-charcoal text-white hover:bg-earth-900 shadow-xl shadow-charcoal/20 hover:-translate-y-0.5' 
                      : 'bg-warm-gray-200 text-warm-gray-500 cursor-not-allowed dark:bg-warm-gray-700 dark:text-warm-gray-400'
                  }`}
                >
                  {addingToCart ? (
                    <LoadingSpinner size="sm" color={isAvailable ? "white" : "gray"} />
                  ) : (
                    <>
                      <IoCartOutline size={20} />
                      {isAvailable ? 'Add to Cart' : 'Out of Stock'}
                    </>
                  )}
                </button>

                <button 
                  onClick={handleToggleWishlist}
                  aria-label="Wishlist"
                  className={`w-12 h-12 md:w-14 md:h-14 shrink-0 rounded-full border flex items-center justify-center transition-all ${
                    isWishlisted 
                      ? 'bg-mithila-red/10 border-mithila-red text-mithila-red' 
                      : 'bg-white dark:bg-warm-gray-800 border-cream-200 dark:border-warm-gray-700 text-warm-gray-500 hover:border-mithila-red hover:text-mithila-red shadow-sm'
                  }`}
                >
                  {isWishlisted ? <IoHeart size={24} /> : <IoHeartOutline size={24} />}
                </button>
              </div>

              {isAvailable && (
                <button 
                  onClick={handleBuyNow}
                  className="w-full h-12 md:h-14 rounded-full bg-gradient-gold text-white font-body font-semibold text-sm shadow-gold hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
                >
                  <IoFlashOutline size={20} />
                  Buy it Now
                </button>
              )}
            </div>

            <div className="pt-6 border-t border-cream-200 dark:border-warm-gray-700/50 space-y-4">
              <div>
                <h4 className="font-display font-semibold text-sm text-charcoal dark:text-cream-50 mb-3 uppercase tracking-wider">Artwork Details</h4>
                <div className="grid grid-cols-2 gap-y-3 text-sm font-body">
                  <div>
                    <span className="text-warm-gray-500 dark:text-warm-gray-400 block mb-0.5 text-xs">Medium</span>
                    <span className="font-medium text-charcoal dark:text-cream-100">{selectedVariant ? selectedVariant.medium : (currentArtwork.medium || 'Natural Pigments on Handmade Paper')}</span>
                  </div>
                  {(selectedVariant?.size || currentArtwork.size) && (
                    <div>
                      <span className="text-warm-gray-500 dark:text-warm-gray-400 block mb-0.5 text-xs">Dimensions</span>
                      <span className="font-medium text-charcoal dark:text-cream-100">{selectedVariant ? selectedVariant.size : currentArtwork.size}</span>
                    </div>
                  )}
                </div>
              </div>
              
              {currentArtwork.description && (
                <div className="pt-2">
                  <span className="text-warm-gray-500 dark:text-warm-gray-400 block mb-1.5 text-xs uppercase tracking-wider font-semibold">The Story</span>
                  <p className="text-warm-gray-600 dark:text-warm-gray-300 font-body leading-relaxed text-sm line-clamp-4">
                    {currentArtwork.description}
                  </p>
                  <button onClick={() => navigate(`/artwork/${currentArtwork._id || currentArtwork.productId || currentArtwork.id}`)} className="text-earth-600 dark:text-earth-400 text-xs font-bold uppercase mt-2 hover:underline">
                    View Full Details
                  </button>
                </div>
              )}
            </div>

          </div>
        </div>

      </div>
    </FloatingWindow>
  );
}
