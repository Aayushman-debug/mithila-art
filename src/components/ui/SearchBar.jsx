import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { IoSearchOutline, IoCloseOutline } from 'react-icons/io5';
import { paintings } from '../../data/paintings';

export default function SearchBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const navigate = useNavigate();
  const searchRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (query.trim().length > 1) {
      const lowerQuery = query.toLowerCase();
      const filtered = paintings.filter(
        (p) =>
          p.title.toLowerCase().includes(lowerQuery) ||
          p.category.toLowerCase().includes(lowerQuery) ||
          (p.description && p.description.toLowerCase().includes(lowerQuery))
      );
      setResults(filtered.slice(0, 5)); // show top 5 results
    } else {
      setResults([]);
    }
  }, [query]);

  const handleResultClick = (id) => {
    setIsOpen(false);
    setQuery('');
    navigate(`/artwork/${id}`);
  };

  return (
    <div ref={searchRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`p-2 rounded-full transition-all duration-300 hover:bg-earth-500/10 ${isOpen ? 'text-earth-500' : 'text-cream-200 hover:text-white dark:text-cream-300 dark:hover:text-white'}`}
        aria-label="Search"
      >
        <IoSearchOutline size={22} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white dark:bg-warm-gray-800 rounded-2xl shadow-xl border border-cream-200 dark:border-warm-gray-700 overflow-hidden z-50"
          >
            <div className="flex items-center p-3 border-b border-cream-100 dark:border-warm-gray-700">
              <IoSearchOutline className="text-warm-gray-500 ml-2" size={20} />
              <input
                autoFocus
                type="text"
                placeholder="Search paintings, categories..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full bg-transparent border-none outline-none px-3 py-2 text-charcoal dark:text-cream-100 placeholder-warm-gray-400 font-body"
              />
              {query && (
                <button onClick={() => setQuery('')} className="p-1 hover:bg-cream-100 dark:hover:bg-warm-gray-700 rounded-full transition-colors">
                  <IoCloseOutline size={18} className="text-warm-gray-500" />
                </button>
              )}
            </div>

            <div className="max-h-80 overflow-y-auto">
              {query.trim().length > 1 && results.length === 0 ? (
                <div className="p-6 text-center text-warm-gray-500 dark:text-warm-gray-300 font-body text-sm">
                  No artworks found matching "{query}"
                </div>
              ) : (
                results.map((painting) => (
                  <div
                    key={painting.id}
                    onClick={() => handleResultClick(painting.id)}
                    className="flex items-center gap-4 p-3 hover:bg-cream-50 dark:hover:bg-warm-gray-700 cursor-pointer transition-colors border-b border-cream-50 dark:border-warm-gray-700/50 last:border-0"
                  >
                    <img
                      src={painting.images?.[0] || painting.image}
                      alt={painting.title}
                      className="w-12 h-12 object-cover rounded-lg"
                    />
                    <div>
                      <h4 className="font-display font-semibold text-charcoal dark:text-cream-100 text-sm">{painting.title}</h4>
                      <p className="font-body text-xs text-warm-gray-500 dark:text-warm-gray-300 capitalize">{painting.category}</p>
                    </div>
                  </div>
                ))
              )}
              {query.trim().length <= 1 && (
                <div className="p-4 text-center text-warm-gray-500 dark:text-warm-gray-300 text-xs font-body">
                  Type at least 2 characters to search
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
