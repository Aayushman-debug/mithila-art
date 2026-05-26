import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { IoArrowBackOutline, IoTimeOutline, IoPersonOutline } from 'react-icons/io5';
import { blogPosts } from '../data/blogPosts';
import SectionHeading from '../components/ui/SectionHeading';

const blogCategories = ['All', ...new Set(blogPosts.map((p) => p.category))];

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedPost, setSelectedPost] = useState(null);

  const filteredPosts = selectedCategory === 'All'
    ? blogPosts
    : blogPosts.filter((p) => p.category === selectedCategory);

  if (selectedPost) {
    const related = blogPosts.filter((p) => p.id !== selectedPost.id && p.category === selectedPost.category).slice(0, 2);
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="min-h-screen bg-cream-50 pt-24">
        <Helmet>
          <title>{selectedPost.title} — Mithila Art Blog</title>
          <meta name="description" content={selectedPost.excerpt} />
        </Helmet>

        <article className="container-custom section-padding max-w-4xl mx-auto">
          <button onClick={() => setSelectedPost(null)} className="flex items-center gap-2 text-earth-500 hover:text-earth-700 font-body font-medium mb-8 group">
            <IoArrowBackOutline className="group-hover:-translate-x-1 transition-transform" /> Back to Blog
          </button>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="px-3 py-1 bg-earth-500/10 text-earth-500 text-xs font-bold rounded-full uppercase tracking-wider">
              {selectedPost.category}
            </span>
            <h1 className="heading-lg text-charcoal mt-4 mb-4">{selectedPost.title}</h1>
            <div className="flex items-center gap-4 text-body-sm text-warm-gray-400 mb-8">
              <span className="flex items-center gap-1"><IoPersonOutline size={16} /> {selectedPost.author}</span>
              <span>{selectedPost.date}</span>
              <span className="flex items-center gap-1"><IoTimeOutline size={16} /> {selectedPost.readTime}</span>
            </div>

            <img src={selectedPost.image} alt={selectedPost.title} className="w-full h-64 sm:h-96 object-cover rounded-2xl mb-8 shadow-card" />

            <div className="prose max-w-none font-body text-warm-gray-600 leading-relaxed text-lg space-y-4" dangerouslySetInnerHTML={{ __html: selectedPost.content }} />

            {selectedPost.tags && (
              <div className="flex flex-wrap gap-2 mt-8 pt-8 border-t border-cream-200">
                {selectedPost.tags.map((tag) => (
                  <span key={tag} className="px-3 py-1 bg-cream-100 text-warm-gray-500 text-xs rounded-full font-body">
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </motion.div>

          {related.length > 0 && (
            <div className="mt-16">
              <h3 className="heading-sm text-charcoal mb-6">Related Articles</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {related.map((post) => (
                  <motion.div key={post.id} whileHover={{ y: -4 }} onClick={() => { setSelectedPost(post); window.scrollTo(0, 0); }}
                    className="bg-white rounded-2xl overflow-hidden shadow-card cursor-pointer hover:shadow-card-hover transition-shadow"
                  >
                    <img src={post.image} alt={post.title} className="w-full h-40 object-cover" />
                    <div className="p-4">
                      <span className="text-earth-500 text-xs font-bold uppercase tracking-wider">{post.category}</span>
                      <h4 className="font-display font-semibold text-lg text-charcoal mt-1 line-clamp-2">{post.title}</h4>
                      <p className="text-body-sm mt-2 line-clamp-2">{post.excerpt}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </article>
      </motion.div>
    );
  }

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
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={() => setSelectedPost(filteredPosts[0])}
            className="bg-white rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-shadow cursor-pointer mb-10 group"
          >
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="h-64 md:h-auto overflow-hidden">
                <img src={filteredPosts[0].image} alt={filteredPosts[0].title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="p-6 md:p-8 flex flex-col justify-center">
                <span className="px-3 py-1 bg-earth-500/10 text-earth-500 text-xs font-bold rounded-full uppercase tracking-wider w-fit">
                  {filteredPosts[0].category}
                </span>
                <h2 className="font-display font-bold text-2xl md:text-3xl text-charcoal mt-3 mb-3 group-hover:text-earth-700 transition-colors">
                  {filteredPosts[0].title}
                </h2>
                <p className="text-body line-clamp-3 mb-4">{filteredPosts[0].excerpt}</p>
                <div className="flex items-center gap-4 text-body-sm text-warm-gray-400">
                  <span>{filteredPosts[0].author}</span>
                  <span>{filteredPosts[0].date}</span>
                  <span className="flex items-center gap-1"><IoTimeOutline size={14} /> {filteredPosts[0].readTime}</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Blog Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredPosts.slice(1).map((post, i) => (
              <motion.div
                key={post.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ y: -4 }}
                onClick={() => setSelectedPost(post)}
                className="bg-white rounded-2xl overflow-hidden shadow-card cursor-pointer hover:shadow-card-hover transition-shadow group"
              >
                <div className="h-48 overflow-hidden">
                  <img src={post.image} alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-earth-500 text-xs font-bold uppercase tracking-wider">{post.category}</span>
                    <span className="text-warm-gray-300 text-xs">{post.date}</span>
                  </div>
                  <h3 className="font-display font-semibold text-lg text-charcoal leading-snug line-clamp-2 mb-2 group-hover:text-earth-700 transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-body-sm line-clamp-2 mb-3">{post.excerpt}</p>
                  <div className="flex items-center justify-between text-xs text-warm-gray-400 font-body">
                    <span>{post.author}</span>
                    <span className="flex items-center gap-1"><IoTimeOutline size={12} /> {post.readTime}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
