import { useParams, Link, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { IoArrowBackOutline, IoTimeOutline, IoPersonOutline } from 'react-icons/io5';
import { blogPosts } from '../data/blogPosts';

export default function BlogPostPage() {
  const { slug } = useParams();
  const selectedPost = blogPosts.find((p) => p.slug === slug);

  if (!selectedPost) {
    return <Navigate to="/blog" replace />;
  }

  const related = blogPosts.filter((p) => p.id !== selectedPost.id && p.category === selectedPost.category).slice(0, 2);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="min-h-screen bg-cream-50 pt-32 pb-24">
      <Helmet>
        <title>{selectedPost.title} — Mithila Art Blog</title>
        <meta name="description" content={selectedPost.excerpt} />
      </Helmet>

      <article className="container-custom max-w-4xl mx-auto">
        <Link to="/blog" className="inline-flex items-center gap-2 text-earth-500 hover:text-earth-700 font-body font-medium mb-8 group transition-colors">
          <IoArrowBackOutline className="group-hover:-translate-x-1 transition-transform" /> Back to Blog
        </Link>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <span className="px-3 py-1 bg-earth-500/10 text-earth-600 text-xs font-bold rounded-full uppercase tracking-wider">
            {selectedPost.category}
          </span>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-charcoal mt-6 mb-6 leading-tight">
            {selectedPost.title}
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-sm font-body text-warm-gray-500 mb-10">
            <span className="flex items-center gap-1.5"><IoPersonOutline size={16} /> {selectedPost.author}</span>
            <span>•</span>
            <span>{selectedPost.date}</span>
            <span>•</span>
            <span className="flex items-center gap-1.5"><IoTimeOutline size={16} /> {selectedPost.readTime}</span>
          </div>

          <div className="rounded-2xl overflow-hidden shadow-xl mb-12">
            <img src={selectedPost.image} alt={selectedPost.title} className="w-full h-[400px] md:h-[500px] object-cover hover:scale-105 transition-transform duration-1000" />
          </div>

          <div className="prose prose-lg max-w-none font-body text-warm-gray-700 leading-relaxed space-y-6 prose-headings:font-display prose-headings:text-charcoal prose-a:text-earth-500 hover:prose-a:text-earth-600" dangerouslySetInnerHTML={{ __html: selectedPost.content }} />

          {selectedPost.tags && (
            <div className="flex flex-wrap gap-2 mt-12 pt-8 border-t border-cream-200">
              {selectedPost.tags.map((tag) => (
                <span key={tag} className="px-3 py-1 bg-white text-warm-gray-600 text-sm rounded-full font-body shadow-sm border border-cream-100">
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </motion.div>

        {related.length > 0 && (
          <div className="mt-20 pt-12 border-t border-cream-200">
            <h3 className="font-display text-3xl font-bold text-charcoal mb-8">Related Articles</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {related.map((post) => (
                <Link to={`/blog/${post.slug}`} key={post.id} onClick={() => window.scrollTo(0, 0)} className="block group">
                  <motion.div whileHover={{ y: -8 }} className="bg-white rounded-2xl overflow-hidden shadow-card group-hover:shadow-card-hover transition-all duration-300 h-full flex flex-col">
                    <div className="h-48 overflow-hidden">
                      <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    </div>
                    <div className="p-6 flex-grow flex flex-col justify-between">
                      <div>
                        <span className="text-earth-500 text-xs font-bold uppercase tracking-wider">{post.category}</span>
                        <h4 className="font-display font-bold text-xl text-charcoal mt-2 line-clamp-2 group-hover:text-earth-600 transition-colors">{post.title}</h4>
                        <p className="text-warm-gray-600 font-body mt-3 line-clamp-2">{post.excerpt}</p>
                      </div>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </article>
    </motion.div>
  );
}
