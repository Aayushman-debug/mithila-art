import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { IoSearchOutline, IoCloseOutline, IoImageOutline, IoDocumentTextOutline, IoBrushOutline } from 'react-icons/io5';
import { productAPI } from '../../api';
import { blogPosts } from '../../data/blogPosts';
import { artists } from '../../data/artists';
import FallbackImage from './FallbackImage';

export default function CommandPalette({ isOpen, onClose }) {
  const [query, setQuery] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const inputRef = useRef(null);

  // Fetch products once when palette is opened first time
  useEffect(() => {
    if (isOpen && products.length === 0) {
      setLoading(true);
      productAPI.getProducts().then(res => {
        if (res.data?.success) {
          setProducts(res.data.products || []);
        }
      }).catch(err => console.error("Search failed to fetch products:", err))
      .finally(() => setLoading(false));
    }
  }, [isOpen, products.length]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current.focus(), 100);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
      setQuery(''); // Reset query on close
    }
    return () => { document.body.style.overflow = 'unset'; }
  }, [isOpen]);

  // Global Ctrl+K listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          // Open triggered by parent state usually, but if we handle it via event:
          // We dispatch a custom event that App/Navbar can listen to
          window.dispatchEvent(new CustomEvent('toggle-command-palette'));
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const searchQuery = query.toLowerCase().trim();

  // Filter products
  const matchedProducts = searchQuery ? products.filter(p => 
    p.title?.toLowerCase().includes(searchQuery) ||
    p.category?.toLowerCase().includes(searchQuery) ||
    p.description?.toLowerCase().includes(searchQuery)
  ).slice(0, 5) : [];

  // Filter blogs
  const matchedBlogs = searchQuery ? blogPosts.filter(b =>
    b.title?.toLowerCase().includes(searchQuery) ||
    b.excerpt?.toLowerCase().includes(searchQuery)
  ).slice(0, 3) : [];

  // Filter artists
  const matchedArtists = searchQuery ? artists.filter(a =>
    a.name?.toLowerCase().includes(searchQuery) ||
    a.specialty?.toLowerCase().includes(searchQuery)
  ).slice(0, 2) : [];

  const hasResults = matchedProducts.length > 0 || matchedBlogs.length > 0 || matchedArtists.length > 0;
  const isSearching = searchQuery.length > 0;

  const handleNavigate = (path) => {
    onClose();
    navigate(path);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[300] flex items-start justify-center pt-[10vh] sm:pt-[15vh] px-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-earth-900/60 backdrop-blur-md"
        />

        {/* Command Palette */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-2xl bg-white/95 dark:bg-warm-gray-900/95 backdrop-blur-2xl border border-white/20 dark:border-warm-gray-700/30 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
        >
          {/* Search Input */}
          <div className="flex items-center px-4 border-b border-cream-200/50 dark:border-warm-gray-700/50 shrink-0">
            <IoSearchOutline size={24} className="text-warm-gray-400" />
            <input
              ref={inputRef}
              type="text"
              placeholder="Search artworks, artists, culture..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-transparent border-none outline-none py-5 px-4 text-lg text-charcoal dark:text-cream-50 placeholder:text-warm-gray-400"
            />
            {loading && <span className="text-xs text-warm-gray-400 font-medium animate-pulse">Loading...</span>}
            <div className="hidden sm:flex items-center gap-1 bg-warm-gray-100 dark:bg-warm-gray-800 px-2 py-1 rounded text-xs font-medium text-warm-gray-500 mr-2">
              ESC
            </div>
            <button onClick={onClose} className="p-2 sm:hidden text-warm-gray-500">
              <IoCloseOutline size={24} />
            </button>
          </div>

          {/* Results Area */}
          <div className="overflow-y-auto custom-scrollbar flex-1 p-2">
            {!isSearching ? (
              <div className="px-4 py-8 text-center text-warm-gray-500 dark:text-warm-gray-400">
                <IoSearchOutline size={48} className="mx-auto mb-4 opacity-20" />
                <p>Start typing to search across the entire studio.</p>
              </div>
            ) : !hasResults ? (
              <div className="px-4 py-8 text-center text-warm-gray-500 dark:text-warm-gray-400">
                <p>No results found for "{query}"</p>
              </div>
            ) : (
              <div className="space-y-4 pb-4">
                
                {/* Artworks */}
                {matchedProducts.length > 0 && (
                  <div>
                    <h4 className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-warm-gray-400">Artworks</h4>
                    {matchedProducts.map(product => (
                      <button
                        key={product._id || product.id}
                        onClick={() => handleNavigate(`/artwork/${product._id || product.id}`)}
                        className="w-full flex items-center gap-4 px-4 py-3 hover:bg-cream-100/50 dark:hover:bg-warm-gray-800/50 rounded-xl transition-colors text-left"
                      >
                        <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0 bg-cream-100 dark:bg-warm-gray-800">
                          <FallbackImage src={product.images?.[0]?.url || product.image || product.images?.[0]} alt={product.title} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h5 className="font-semibold text-charcoal dark:text-cream-50 truncate">{product.title}</h5>
                          <p className="text-xs text-warm-gray-500 dark:text-warm-gray-400 truncate">{product.category} • ₹{product.price}</p>
                        </div>
                        <IoImageOutline className="text-warm-gray-400" />
                      </button>
                    ))}
                  </div>
                )}

                {/* Artists */}
                {matchedArtists.length > 0 && (
                  <div>
                    <h4 className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-warm-gray-400 border-t border-cream-100/50 dark:border-warm-gray-700/50">Artists</h4>
                    {matchedArtists.map(artist => (
                      <button
                        key={artist.id}
                        onClick={() => handleNavigate('/artists')}
                        className="w-full flex items-center gap-4 px-4 py-3 hover:bg-cream-100/50 dark:hover:bg-warm-gray-800/50 rounded-xl transition-colors text-left"
                      >
                        <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 bg-cream-100 dark:bg-warm-gray-800">
                          <FallbackImage src={artist.image} alt={artist.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h5 className="font-semibold text-charcoal dark:text-cream-50 truncate">{artist.name}</h5>
                          <p className="text-xs text-warm-gray-500 dark:text-warm-gray-400 truncate">{artist.specialty}</p>
                        </div>
                        <IoBrushOutline className="text-warm-gray-400" />
                      </button>
                    ))}
                  </div>
                )}

                {/* Blog Posts */}
                {matchedBlogs.length > 0 && (
                  <div>
                    <h4 className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-warm-gray-400 border-t border-cream-100/50 dark:border-warm-gray-700/50">Culture & Blog</h4>
                    {matchedBlogs.map(blog => (
                      <button
                        key={blog.id}
                        onClick={() => handleNavigate(`/blog/${blog.slug}`)}
                        className="w-full flex items-center gap-4 px-4 py-3 hover:bg-cream-100/50 dark:hover:bg-warm-gray-800/50 rounded-xl transition-colors text-left"
                      >
                        <div className="flex-1 min-w-0">
                          <h5 className="font-semibold text-charcoal dark:text-cream-50 truncate">{blog.title}</h5>
                          <p className="text-xs text-warm-gray-500 dark:text-warm-gray-400 truncate">{blog.excerpt}</p>
                        </div>
                        <IoDocumentTextOutline className="text-warm-gray-400" />
                      </button>
                    ))}
                  </div>
                )}

              </div>
            )}
          </div>
          
          {/* Footer */}
          <div className="px-4 py-2 border-t border-cream-200/50 dark:border-warm-gray-700/50 flex justify-between items-center bg-cream-50/50 dark:bg-warm-gray-900/50">
            <span className="text-xs font-medium text-warm-gray-500">Mithila Art Studio</span>
            <div className="flex gap-2 text-xs text-warm-gray-400">
              <span className="hidden sm:inline">Navigate: <kbd className="font-sans">↑</kbd> <kbd className="font-sans">↓</kbd></span>
              <span className="hidden sm:inline">Select: <kbd className="font-sans">↵</kbd></span>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
