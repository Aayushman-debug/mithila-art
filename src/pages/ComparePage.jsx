import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
import { IoCloseOutline, IoCartOutline, IoArrowBackOutline } from 'react-icons/io5';
import { useCompare } from '../context/CompareContext';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/helpers';

export default function ComparePage() {
  const { compareItems, removeFromCompare, clearCompare } = useCompare();
  const { addItem } = useCart();
  const navigate = useNavigate();

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }} className="min-h-screen bg-cream-50 dark:bg-warm-gray-900 pt-28 pb-20">
      <Helmet>
        <title>Compare Artworks — Lalita Pathak Mithila Art</title>
      </Helmet>

      <div className="container-custom px-4">
        <div className="flex flex-wrap gap-4 items-center justify-between mb-8">
          <div>
            <button onClick={() => navigate(-1)} className="inline-flex items-center gap-2 text-warm-gray-500 hover:text-earth-500 font-body text-sm transition-colors mb-2">
              <IoArrowBackOutline size={18} /> Back
            </button>
            <h1 className="heading-lg text-charcoal dark:text-cream-100">Compare Artworks</h1>
          </div>
          {compareItems.length > 0 && (
            <button onClick={clearCompare} className="text-mithila-red hover:text-red-700 font-body font-medium text-sm transition-colors">
              Clear All
            </button>
          )}
        </div>

        {compareItems.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-warm-gray-800 rounded-2xl shadow-card border border-cream-200/50 dark:border-warm-gray-700/50">
            <h2 className="text-xl font-display font-semibold text-charcoal dark:text-cream-100 mb-2">No artworks to compare</h2>
            <p className="text-warm-gray-500 font-body mb-6">You haven't added any artworks to the comparison list yet.</p>
            <Link to="/gallery" className="btn-primary">Browse Gallery</Link>
          </div>
        ) : (
          <div className="overflow-x-auto pb-6 scrollbar-hide">
            <div className="flex gap-6 min-w-max">
              {compareItems.map((painting) => (
                <div key={painting.id} className="w-[300px] flex flex-col bg-white dark:bg-warm-gray-800 rounded-2xl shadow-card border border-cream-200/50 dark:border-warm-gray-700/50 overflow-hidden relative group">
                  <button onClick={() => removeFromCompare(painting.id)} className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/40 backdrop-blur-sm text-white flex items-center justify-center hover:bg-mithila-red transition-colors z-10">
                    <IoCloseOutline size={20} />
                  </button>
                  <div className="aspect-[4/5] bg-warm-gray-100 dark:bg-warm-gray-800">
                    <img src={painting.images?.[0] || painting.image} alt={painting.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-5 flex-1 flex flex-col gap-3">
                    <div>
                      <p className="text-earth-500 dark:text-earth-400 text-xs font-body font-semibold tracking-widest uppercase mb-1">{painting.category}</p>
                      <h3 className="font-display font-bold text-xl text-charcoal dark:text-cream-100 leading-tight">{painting.title}</h3>
                      <p className="text-warm-gray-500 text-sm font-body mt-1">by {painting.artist}</p>
                    </div>
                    
                    <div className="py-3 border-y border-cream-100 dark:border-warm-gray-700 space-y-2">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-warm-gray-500 font-body">Price</span>
                        <span className="font-display font-bold text-earth-700 dark:text-earth-400">{formatPrice(painting.price)}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-warm-gray-500 font-body">Size</span>
                        <span className="font-body font-medium text-charcoal dark:text-cream-200 text-right">{painting.size || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-warm-gray-500 font-body">Medium</span>
                        <span className="font-body font-medium text-charcoal dark:text-cream-200 text-right">{painting.medium || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-warm-gray-500 font-body">Style</span>
                        <span className="font-body font-medium text-charcoal dark:text-cream-200 text-right">{painting.style || 'N/A'}</span>
                      </div>
                    </div>
                    
                    <p className="text-sm text-warm-gray-600 dark:text-warm-gray-400 font-body leading-relaxed flex-1 line-clamp-4">
                      {painting.description}
                    </p>

                    <button
                      onClick={() => addItem(painting)}
                      disabled={!painting.inStock}
                      className="w-full py-3 rounded-xl bg-charcoal text-white font-display font-semibold text-sm flex items-center justify-center gap-2 hover:bg-warm-black transition-colors disabled:opacity-50 mt-auto"
                    >
                      <IoCartOutline size={18} />
                      {painting.inStock ? 'Add to Cart' : 'Sold Out'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
