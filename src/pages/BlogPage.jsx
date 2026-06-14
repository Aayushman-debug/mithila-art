import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { IoTimeOutline } from 'react-icons/io5';
import { Link } from 'react-router-dom';
import { blogPosts } from '../data/blogPosts';

const blogCategories = ['All', ...new Set(blogPosts.map((p) => p.category))];

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredPosts = selectedCategory === 'All'
    ? blogPosts
    : blogPosts.filter((p) => p.category === selectedCategory);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }} className="min-h-screen bg-cream-50 pt-24">
      <Helmet>
        <title>Blog — Lalita Pathak Mithila Art</title>
        <meta name="description" content="Explore articles about Mithila art history, techniques, cultural significance, and the stories behind each painting." />
      </Helmet>

      {/* Hero */}
      <div className="relative bg-warm-black py-20 overflow-hidden">
        <div className="absolute inset-0 mithila-pattern opacity-5" />
        <div className="container-custom text-center relative z-10">
          <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-earth-400 font-body text-sm tracking-[0.3em] uppercase mb-3">
            Stories & Insights
          </motion.p>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="heading-xl text-cream-50 mb-4">
            The Mithila <span className="text-gradient-gold">Art Journal</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-cream-300/80 font-body text-lg max-w-2xl mx-auto">
            Discover the rich history, techniques, and stories behind the sacred art of Mithila.
          </motion.p>
        </div>
      </div>

      <div className="container-custom section-padding">
        {/* Category Filters */}
        <div className="flex flex-wrap gap-2 mb-10 justify-center">
          {blogCategories.map((cat) => (
            <motion.button key={cat} whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-2 rounded-full font-body text-sm font-medium transition-all duration-300 ${
                selectedCategory === cat
                  ? 'bg-earth-500 text-white shadow-gold'
                  : 'bg-cream-100 text-warm-gray-600 hover:bg-cream-200'
              }`}
            >
              {cat}
            </motion.button>
          ))}
        </div>

        {/* Featured Post */}
        {filteredPosts.length > 0 && (
          <Link to={`/blog/${filteredPosts[0].slug}`} className="block mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 group"
            >
              <div className="grid grid-cols-1 md:grid-cols-2">
                <div className="h-72 md:h-full min-h-[300px] overflow-hidden">
                  <img src={filteredPosts[0].image} alt={filteredPosts[0].title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <div className="p-8 md:p-12 flex flex-col justify-center">
                  <span className="px-3 py-1 bg-earth-500/10 text-earth-600 text-xs font-bold rounded-full uppercase tracking-wider w-fit">
                    {filteredPosts[0].category}
                  </span>
                  <h2 className="font-display font-bold text-3xl md:text-4xl text-charcoal mt-4 mb-4 group-hover:text-earth-700 transition-colors leading-tight">
                    {filteredPosts[0].title}
                  </h2>
                  <p className="text-warm-gray-600 font-body text-lg line-clamp-3 mb-6 leading-relaxed">{filteredPosts[0].excerpt}</p>
                  <div className="flex items-center gap-4 text-sm font-body text-warm-gray-500 mt-auto">
                    <span>{filteredPosts[0].author}</span>
                    <span>•</span>
                    <span>{filteredPosts[0].date}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1"><IoTimeOutline size={14} /> {filteredPosts[0].readTime}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </Link>
        )}

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence>
            {filteredPosts.slice(1).map((post, i) => (
              <motion.div
                key={post.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
              >
                <Link to={`/blog/${post.slug}`} className="block h-full">
                  <div className="bg-white rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 group h-full flex flex-col">
                    <div className="h-56 overflow-hidden">
                      <img src={post.image} alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                    </div>
                    <div className="p-6 flex flex-col flex-grow">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-earth-500 text-xs font-bold uppercase tracking-wider">{post.category}</span>
                        <span className="text-warm-gray-500 text-xs font-body">{post.date}</span>
                      </div>
                      <h3 className="font-display font-bold text-xl text-charcoal leading-snug line-clamp-2 mb-3 group-hover:text-earth-700 transition-colors">
                        {post.title}
                      </h3>
                      <p className="text-warm-gray-600 font-body text-sm line-clamp-3 mb-6 flex-grow">{post.excerpt}</p>
                      <div className="flex items-center justify-between text-xs text-warm-gray-500 font-body mt-auto pt-4 border-t border-cream-100">
                        <span>{post.author}</span>
                        <span className="flex items-center gap-1"><IoTimeOutline size={14} /> {post.readTime}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
