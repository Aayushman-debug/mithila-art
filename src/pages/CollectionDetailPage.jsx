import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { collectionAPI } from '../api';
import FallbackImage from '../components/ui/FallbackImage';
import { FaArrowLeft, FaShoppingCart } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/helpers';

export default function CollectionDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [collection, setCollection] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCollection = async () => {
      try {
        const res = await collectionAPI.getCollectionById(id);
        if (res.data.success) {
          setCollection(res.data.collection);
          setProducts(res.data.products || []);
        }
      } catch (err) {
        console.error('Failed to fetch collection', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCollection();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen pt-32 pb-20 flex items-center justify-center">
        <div className="animate-pulse text-xl text-earth-500">Loading collection...</div>
      </div>
    );
  }

  if (!collection) {
    return (
      <div className="min-h-screen pt-32 pb-20 flex flex-col items-center justify-center">
        <h2 className="text-2xl mb-4">Collection not found</h2>
        <button onClick={() => navigate('/gallery')} className="btn-primary">Return to Gallery</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-20 bg-cream-50 dark:bg-warm-gray-900">
      <div className="container-custom px-4">
        <button onClick={() => navigate('/gallery')} className="flex items-center text-warm-gray-500 hover:text-earth-500 mb-8 transition-colors">
          <FaArrowLeft className="mr-2" /> Back to Gallery
        </button>

        {/* Collection Hero */}
        <div className="bg-white dark:bg-warm-gray-800 rounded-3xl p-6 md:p-10 shadow-card mb-12 flex flex-col md:flex-row gap-10">
          <div className="w-full md:w-1/2">
            <FallbackImage 
              src={collection.coverImage} 
              alt={collection.title} 
              className="w-full aspect-[4/3] rounded-2xl shadow-lg object-cover"
            />
          </div>
          <div className="w-full md:w-1/2 flex flex-col justify-center">
            <p className="text-earth-500 uppercase tracking-widest text-sm font-semibold mb-2">{collection.category}</p>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-charcoal dark:text-cream-100 mb-4">{collection.title}</h1>
            {collection.titleHindi && <h2 className="text-2xl font-display text-warm-gray-500 mb-6">{collection.titleHindi}</h2>}
            <p className="text-lg text-warm-gray-600 dark:text-warm-gray-300 leading-relaxed">
              {collection.description || 'A beautiful collection of Mithila art variants.'}
            </p>
          </div>
        </div>

        {/* Artwork Variants */}
        <h3 className="text-3xl font-display font-bold text-center mb-10 text-charcoal dark:text-cream-100">
          Available Variants in this Collection
        </h3>

        {products.length === 0 ? (
          <p className="text-center text-warm-gray-500">No artwork variants are currently available in this collection.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map(product => {
              const firstImg = product.images?.[0];
              const image = (typeof firstImg === 'object' ? firstImg?.url : firstImg) || product.image || '';
              const isAvailable = product.availabilityStatus === 'available' || product.availabilityStatus === 'only_1_left';
              
              return (
                <motion.div 
                  key={product._id}
                  whileHover={{ y: -10 }}
                  className="bg-white dark:bg-warm-gray-800 rounded-2xl overflow-hidden shadow-card hover:shadow-glass-lg transition-all border border-cream-200 dark:border-warm-gray-700 flex flex-col"
                >
                  <Link to={`/painting/${product.productId}`}>
                    <FallbackImage src={image} alt={product.title} className="w-full h-64 object-cover" />
                  </Link>
                  <div className="p-6 flex-grow flex flex-col">
                    <div className="flex justify-between items-start mb-2">
                      <Link to={`/painting/${product.productId}`}>
                        <h4 className="text-xl font-bold font-display hover:text-earth-500 transition-colors">{product.title}</h4>
                      </Link>
                      <span className={`text-xs px-2 py-1 rounded-full whitespace-nowrap ${
                        product.availabilityStatus === 'available' ? 'bg-green-100 text-green-800' :
                        product.availabilityStatus === 'only_1_left' ? 'bg-orange-100 text-orange-800' :
                        product.availabilityStatus === 'out_of_stock' ? 'bg-red-100 text-red-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {product.availabilityStatus.replace(/_/g, ' ').toUpperCase()}
                      </span>
                    </div>
                    
                    <p className="text-sm text-warm-gray-500 mb-4">{product.size} {product.medium && `• ${product.medium}`}</p>
                    
                    <div className="mt-auto flex items-center justify-between">
                      <span className="text-2xl font-bold text-charcoal dark:text-cream-100">{formatPrice(product.price)}</span>
                      <button 
                        disabled={!isAvailable}
                        onClick={() => addToCart(product)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-colors ${
                          isAvailable 
                            ? 'bg-earth-500 text-white hover:bg-earth-600 shadow-md' 
                            : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        }`}
                      >
                        <FaShoppingCart />
                        {isAvailable ? 'Add to Cart' : 'Unavailable'}
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
