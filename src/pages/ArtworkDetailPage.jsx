import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { 
  IoChevronBackOutline, 
  IoHeartOutline, 
  IoHeart, 
  IoCartOutline, 
  IoFlashOutline, 
  IoShieldCheckmarkOutline, 
  IoRefreshOutline,
  IoShareSocialOutline
} from 'react-icons/io5';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { productAPI, userAPI } from '../api';
import FallbackImage from '../components/ui/FallbackImage';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { formatPrice } from '../utils/helpers';

export default function ArtworkDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { user, isAuthenticated } = useAuth();

  const [artwork, setArtwork] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    const fetchArtwork = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await productAPI.getProductById(id);
        if (res.data.success) {
          setArtwork(res.data.product);
        } else {
          setError('Artwork not found.');
        }
      } catch (err) {
        console.error('Failed to fetch artwork:', err);
        setError('Failed to fetch artwork details.');
      } finally {
        setLoading(false);
      }
    };
    fetchArtwork();
  }, [id]);

  useEffect(() => {
    if (isAuthenticated && artwork) {
      userAPI.getWishlist().then(res => {
        if (res.data.success) {
          const inWishlist = res.data.wishlist.some(item => 
            (item.productId === artwork._id || item.productId === artwork.productId)
          );
          setIsWishlisted(inWishlist);
        }
      }).catch(err => console.error('Wishlist error:', err));
    }
  }, [isAuthenticated, artwork]);

  const handleToggleWishlist = async () => {
    if (!isAuthenticated) {
      alert("Please log in to add to wishlist.");
      return;
    }
    const previousState = isWishlisted;
    setIsWishlisted(!isWishlisted);
    try {
      await userAPI.toggleWishlist({ productId: artwork._id });
    } catch (err) {
      console.error('Toggle wishlist failed:', err);
      setIsWishlisted(previousState);
    }
  };

  const handleAddToCart = () => {
    setAddingToCart(true);
    addItem(artwork);
    setTimeout(() => {
      setAddingToCart(false);
      navigate('/cart');
    }, 400);
  };

  const handleBuyNow = () => {
    addItem(artwork);
    navigate('/cart');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-cream-50 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !artwork) {
    return (
      <div className="min-h-screen bg-cream-50 pt-32 px-4 text-center">
        <h2 className="text-2xl font-display text-charcoal mb-4">Artwork Not Found</h2>
        <p className="text-warm-gray-500 mb-8">{error}</p>
        <button onClick={() => navigate('/gallery')} className="btn-primary">Return to Gallery</button>
      </div>
    );
  }

  const images = artwork.images?.length > 0 ? artwork.images : [{ url: artwork.image }];
  const mainImage = images[activeImageIndex]?.url || images[activeImageIndex] || artwork.image;
  
  const isAvailable = artwork.availabilityStatus !== 'out_of_stock' && artwork.inStock !== false;

  return (
    <div className="min-h-screen bg-cream-50 pt-24 pb-20">
      <Helmet>
        <title>{artwork.title} | Lalita Pathak Mithila Art</title>
        <meta name="description" content={artwork.description || `Buy ${artwork.title} - Authentic Mithila Painting`} />
      </Helmet>

      <div className="container-custom px-4 md:px-8">
        {/* Back Navigation */}
        <button onClick={() => navigate(-1)} className="group flex items-center gap-2 text-warm-gray-500 hover:text-charcoal mb-8 transition-colors">
          <div className="w-8 h-8 rounded-full bg-white border border-cream-200 flex items-center justify-center group-hover:border-earth-300 transition-colors">
            <IoChevronBackOutline />
          </div>
          <span className="font-body text-sm font-medium">Back to Gallery</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          
          {/* Left Column: Image Gallery */}
          <div className="lg:col-span-7 flex flex-col-reverse md:flex-row gap-4">
            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-visible md:w-24 shrink-0 pb-2 md:pb-0 scrollbar-hide">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative w-20 h-24 md:w-24 md:h-28 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                      activeImageIndex === idx ? 'border-earth-500 opacity-100' : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <FallbackImage src={img.url || img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Main Image */}
            <div className="flex-1 w-full bg-white rounded-3xl p-4 shadow-card border border-cream-100 relative group overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeImageIndex}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="w-full h-[50vh] md:h-[70vh] rounded-2xl overflow-hidden relative bg-cream-50"
                >
                  <FallbackImage src={mainImage} alt={artwork.title} className="absolute inset-0 w-full h-full object-contain mix-blend-multiply" />
                </motion.div>
              </AnimatePresence>
              
              {/* Category Pill Overlaid */}
              <div className="absolute top-8 left-8">
                <span className="px-4 py-1.5 rounded-full bg-white/80 backdrop-blur-md border border-white/40 text-charcoal font-body text-xs font-bold uppercase tracking-wider shadow-sm">
                  {artwork.category}
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Product Details */}
          <div className="lg:col-span-5 flex flex-col justify-start">
            <div className="sticky top-32 space-y-8">
              
              {/* Header Info */}
              <div className="space-y-4">
                <h1 className="font-display text-4xl lg:text-5xl font-bold text-charcoal leading-tight">
                  {artwork.title}
                </h1>
                <p className="text-xl font-display text-earth-700 font-semibold">
                  {formatPrice(artwork.price)}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="space-y-4 pt-4 border-t border-cream-200">
                <div className="flex items-center gap-4">
                  <button 
                    onClick={handleAddToCart}
                    disabled={!isAvailable || addingToCart}
                    className={`flex-1 h-14 rounded-full flex items-center justify-center gap-2 font-body font-semibold text-sm transition-all ${
                      isAvailable 
                        ? 'bg-charcoal text-white hover:bg-earth-900 shadow-xl shadow-charcoal/20 hover:-translate-y-1' 
                        : 'bg-warm-gray-200 text-warm-gray-500 cursor-not-allowed'
                    }`}
                  >
                    {addingToCart ? (
                      <LoadingSpinner size="sm" color="white" />
                    ) : (
                      <>
                        <IoCartOutline size={20} />
                        {isAvailable ? 'Add to Cart' : 'Out of Stock'}
                      </>
                    )}
                  </button>

                  <button 
                    onClick={handleToggleWishlist}
                    className={`w-14 h-14 rounded-full border flex items-center justify-center transition-all ${
                      isWishlisted 
                        ? 'bg-mithila-red/10 border-mithila-red text-mithila-red' 
                        : 'bg-white border-cream-200 text-warm-gray-500 hover:border-mithila-red hover:text-mithila-red shadow-sm'
                    }`}
                  >
                    {isWishlisted ? <IoHeart size={24} /> : <IoHeartOutline size={24} />}
                  </button>
                </div>

                {isAvailable && (
                  <button 
                    onClick={handleBuyNow}
                    className="w-full h-14 rounded-full bg-gradient-gold text-white font-body font-semibold text-sm shadow-gold hover:-translate-y-1 transition-all flex items-center justify-center gap-2"
                  >
                    <IoFlashOutline size={20} />
                    Buy it Now
                  </button>
                )}
              </div>

              {/* Guarantees */}
              <div className="grid grid-cols-2 gap-4 pt-6">
                <div className="flex items-center gap-3 p-4 rounded-2xl bg-white border border-cream-100 shadow-sm">
                  <div className="text-earth-500 bg-earth-500/10 p-2 rounded-lg"><IoShieldCheckmarkOutline size={20} /></div>
                  <span className="text-xs font-body font-medium text-charcoal leading-tight">Certificate of Authenticity</span>
                </div>
                <div className="flex items-center gap-3 p-4 rounded-2xl bg-white border border-cream-100 shadow-sm">
                  <div className="text-earth-500 bg-earth-500/10 p-2 rounded-lg"><IoRefreshOutline size={20} /></div>
                  <span className="text-xs font-body font-medium text-charcoal leading-tight">Secure & Safe Packaging</span>
                </div>
              </div>

              {/* Description & Details */}
              <div className="pt-6 border-t border-cream-200 space-y-6">
                {artwork.description && (
                  <div>
                    <h3 className="font-display font-semibold text-lg text-charcoal mb-2">The Story</h3>
                    <p className="text-warm-gray-600 font-body leading-relaxed whitespace-pre-wrap text-sm">
                      {artwork.description}
                    </p>
                  </div>
                )}
                
                <div>
                  <h3 className="font-display font-semibold text-lg text-charcoal mb-4">Artwork Details</h3>
                  <div className="grid grid-cols-2 gap-y-4 text-sm font-body">
                    <div>
                      <span className="text-warm-gray-500 block mb-1">Medium</span>
                      <span className="font-medium text-charcoal">{artwork.medium || 'Natural Pigments on Handmade Paper'}</span>
                    </div>
                    {artwork.size && (
                      <div>
                        <span className="text-warm-gray-500 block mb-1">Dimensions</span>
                        <span className="font-medium text-charcoal">{artwork.size}</span>
                      </div>
                    )}
                    <div>
                      <span className="text-warm-gray-500 block mb-1">Style / Category</span>
                      <span className="font-medium text-charcoal">{artwork.category || 'Mithila Art'}</span>
                    </div>
                    {artwork.style && (
                      <div>
                        <span className="text-warm-gray-500 block mb-1">Specific Style</span>
                        <span className="font-medium text-charcoal">{artwork.style}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
