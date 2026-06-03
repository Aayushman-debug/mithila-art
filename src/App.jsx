import { Suspense, lazy, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import WhatsAppButton from './components/layout/WhatsAppButton';
import FloatingCompareButton from './components/layout/FloatingCompareButton';
import LoadingSpinner from './components/ui/LoadingSpinner';
import ScrollProgress from './components/layout/ScrollProgress';
import { AdminRoute, ProtectedRoute } from './components/ui/ProtectedRoute';
import GlobalErrorBoundary from './components/ui/GlobalErrorBoundary';

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
const CulturePage = lazy(() => import('./pages/CulturePage'));
const ArtistsPage = lazy(() => import('./pages/ArtistsPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const BlogPage = lazy(() => import('./pages/BlogPage'));
const BlogPostPage = lazy(() => import('./pages/BlogPostPage'));
const AdminPage = lazy(() => import('./pages/AdminPage'));
const PaintingDetailPage = lazy(() => import('./pages/PaintingDetailPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const WishlistPage = lazy(() => import('./pages/WishlistPage'));
const OrdersPage = lazy(() => import('./pages/OrdersPage'));
const CommissionTrackingPage = lazy(() => import('./pages/CommissionTrackingPage'));
const ForgotPasswordPage = lazy(() => import('./pages/ForgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('./pages/ResetPasswordPage'));
const ComparePage = lazy(() => import('./pages/ComparePage'));

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-cream-50 dark:bg-warm-gray-900 transition-colors duration-300">
      <ScrollToTop />
      <ScrollProgress />
      <Navbar />
      
      <main>
        <GlobalErrorBoundary>
          <Suspense fallback={<LoadingSpinner fullScreen text="Loading..." />}>
            <AnimatePresence mode="wait">
              <Routes location={location} key={location.pathname}>
                <Route path="/" element={<HomePage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/gallery" element={<GalleryPage />} />
                <Route path="/shop" element={<ShopPage />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/compare" element={<ComparePage />} />
                <Route path="/commission" element={<ProtectedRoute><CommissionPage /></ProtectedRoute>} />
                <Route path="/payment" element={<PaymentPage />} />
                <Route path="/testimonials" element={<TestimonialsPage />} />
                <Route path="/mithila-history" element={<MithilaHistoryPage />} />
                <Route path="/culture" element={<CulturePage />} />
                <Route path="/artists" element={<ArtistsPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/blog" element={<BlogPage />} />
                <Route path="/blog/:slug" element={<BlogPostPage />} />
                <Route path="/admin" element={<AdminRoute><AdminPage /></AdminRoute>} />
                <Route path="/wishlist" element={<ProtectedRoute><WishlistPage /></ProtectedRoute>} />
                <Route path="/orders" element={<ProtectedRoute><OrdersPage /></ProtectedRoute>} />
                <Route path="/commission-tracking" element={<ProtectedRoute><CommissionTrackingPage /></ProtectedRoute>} />
                <Route path="/painting/:id" element={<PaintingDetailPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<RegisterPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
                <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
              </Routes>
            </AnimatePresence>
          </Suspense>
        </GlobalErrorBoundary>
      </main>

      <Footer />
      <WhatsAppButton />
      <FloatingCompareButton />
    </div>
  );
}
