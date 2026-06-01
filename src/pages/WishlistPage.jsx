import { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { IoHeartOutline, IoCartOutline, IoArrowBackOutline, IoRemoveCircleOutline } from 'react-icons/io5';
import { useAuth } from '../context/AuthContext';
import { userAPI } from '../api';
import { formatPrice } from '../utils/helpers';
import LoadingSpinner from '../components/ui/LoadingSpinner';

export default function WishlistPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated } = useAuth();
  const [wishlist, setWishlist] = useState(user?.wishlist || []);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: location }, replace: true });
    }
  }, [isAuthenticated, navigate, location]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadWishlist = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await userAPI.getWishlist();
      if (response.data.success) {
        setWishlist(response.data.wishlist || []);
      } else {
        setError(response.data.message || 'Could not load wishlist');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Could not load wishlist');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWishlist();
  }, []);

  const handleViewProduct = (id) => {
    navigate(`/painting/${id}`);
  };

  const handleRemove = async (item) => {
    setLoading(true);
    try {
      const response = await userAPI.toggleWishlist({
        productId: item.productId,
        title: item.title,
        price: item.price,
        image: item.image,
        size: item.size,
        category: item.category,
      });
      if (response.data.success) {
        setWishlist(response.data.wishlist || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner fullScreen text="Loading your wishlist..." />;
  }

  return (
    <div className="min-h-screen bg-cream-50 pt-24">
      <Helmet>
        <title>Wishlist — Lalita Pathak Mithila Art</title>
        <meta name="description" content="Your saved Mithila artwork wishlist." />
      </Helmet>

      <div className="container-custom section-padding">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-earth-500 font-semibold">Saved for later</p>
            <h1 className="heading-xl text-charcoal mt-3">Your Wishlist</h1>
          </div>
          <Link to="/shop" className="btn-secondary inline-flex items-center gap-2">
            <IoArrowBackOutline size={18} /> Continue Browsing
          </Link>
        </div>

        {error && (
          <div className="rounded-3xl bg-mithila-red/10 border border-mithila-red/20 p-6 mb-8">
            <p className="text-mithila-red">{error}</p>
          </div>
        )}

        {wishlist.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-card p-14 text-center">
            <IoHeartOutline className="mx-auto text-earth-500 mb-6" size={64} />
            <h2 className="heading-md text-charcoal mb-3">Your wishlist is empty</h2>
            <p className="text-body text-warm-gray-500 mb-6">Save your favorite paintings to revisit them later.</p>
            <Link to="/shop" className="btn-primary inline-flex items-center gap-2">
              Browse Gallery
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-2">
            {wishlist.map((item) => (
              <motion.div
                key={item.productId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-3xl shadow-card overflow-hidden"
              >
                <div className="grid grid-cols-1 sm:grid-cols-[150px_1fr] gap-4 p-5">
                  <img src={item.image} alt={item.title} className="w-full h-44 object-cover rounded-3xl" />
                  <div className="flex flex-col justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-[0.24em] text-earth-500 font-semibold mb-2">{item.category}</p>
                      <h3 className="font-display font-semibold text-xl text-charcoal mb-2">{item.title}</h3>
                      <p className="text-warm-gray-500 text-sm mb-4">{item.size}</p>
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <span className="font-display text-xl text-earth-700">{formatPrice(item.price)}</span>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleViewProduct(item.productId)}
                          className="btn-secondary"
                        >
                          View
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemove(item)}
                          className="btn-secondary inline-flex items-center gap-2"
                        >
                          <IoRemoveCircleOutline size={18} /> Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
