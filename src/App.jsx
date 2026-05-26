import { Suspense, lazy, useEffect, useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import WhatsAppButton from './components/layout/WhatsAppButton';
import LoadingSpinner from './components/ui/LoadingSpinner';
import ScrollProgress from './components/layout/ScrollProgress';

// Lazy load pages for performance
const HomePage = lazy(() => import('./pages/HomePage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const GalleryPage = lazy(() => import('./pages/GalleryPage'));
const ShopPage = lazy(() => import('./pages/ShopPage'));
const CartPage = lazy(() => import('./pages/CartPage'));
const CommissionPage = lazy(() => import('./pages/CommissionPage'));
const PaymentPage = lazy(() => import('./pages/PaymentPage'));
const TestimonialsPage = lazy(() => import('./pages/TestimonialsPage'));
const MithilaHistoryPage = lazy(() => import('./pages/MithilaHistoryPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const BlogPage = lazy(() => import('./pages/BlogPage'));
const AdminPage = lazy(() => import('./pages/AdminPage'));
const PaintingDetailPage = lazy(() => import('./pages/PaintingDetailPage'));

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  const location = useLocation();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate initial load
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <LoadingSpinner fullScreen text="Preparing the canvas..." />;
  }

  return (
    <div className="min-h-screen bg-cream-50 dark:bg-warm-gray-900 transition-colors duration-300">
      <ScrollToTop />
      <ScrollProgress />
      <Navbar />
      
      <main>
        <Suspense fallback={<LoadingSpinner fullScreen text="Loading..." />}>
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/gallery" element={<GalleryPage />} />
              <Route path="/shop" element={<ShopPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/commission" element={<CommissionPage />} />
              <Route path="/payment" element={<PaymentPage />} />
              <Route path="/testimonials" element={<TestimonialsPage />} />
              <Route path="/mithila-history" element={<MithilaHistoryPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/blog" element={<BlogPage />} />
              <Route path="/admin" element={<AdminPage />} />
              <Route path="/painting/:id" element={<PaintingDetailPage />} />
            </Routes>
          </AnimatePresence>
        </Suspense>
      </main>

      <Footer />
      <WhatsAppButton />
    </div>
  );
}
