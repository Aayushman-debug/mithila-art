import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { IoArrowBackOutline, IoCartOutline } from 'react-icons/io5';
import { userAPI } from '../api';
import { formatPrice } from '../utils/helpers';
import LoadingSpinner from '../components/ui/LoadingSpinner';

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await userAPI.getOrders();
      if (response.data.success) {
        setOrders(response.data.orders || []);
      } else {
        setError(response.data.message || 'Could not load your orders');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Could not load your orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  if (loading) {
    return <LoadingSpinner fullScreen text="Loading your orders..." />;
  }

  return (
    <div className="min-h-screen bg-cream-50 pt-24">
      <Helmet>
        <title>Orders — Lalita Pathak Mithila Art</title>
        <meta name="description" content="Review your past orders and payment status." />
      </Helmet>

      <div className="container-custom section-padding">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-earth-500 font-semibold">Order history</p>
            <h1 className="heading-xl text-charcoal mt-3">Your Orders</h1>
          </div>
          <Link to="/shop" className="btn-secondary inline-flex items-center gap-2">
            <IoArrowBackOutline size={18} /> Continue Shopping
          </Link>
        </div>

        {error && (
          <div className="rounded-3xl bg-mithila-red/10 border border-mithila-red/20 p-6 mb-8">
            <p className="text-mithila-red">{error}</p>
          </div>
        )}

        {orders.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-card p-14 text-center">
            <IoCartOutline className="mx-auto text-earth-500 mb-6" size={64} />
            <h2 className="heading-md text-charcoal mb-3">No orders yet</h2>
            <p className="text-body text-warm-gray-500 mb-6">Place an order to see it appear here.</p>
            <Link to="/shop" className="btn-primary inline-flex items-center gap-2">
              Browse Paintings
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <motion.div
                key={order._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-3xl shadow-card p-6"
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4">
                  <div>
                    <p className="text-warm-gray-500 text-sm">Order ID</p>
                    <p className="font-semibold text-charcoal">#{order._id.slice(-8).toUpperCase()}</p>
                  </div>
                  <div>
                    <p className="text-warm-gray-500 text-sm">Payment status</p>
                    <p className="font-semibold text-earth-700">{order.paymentStatus}</p>
                  </div>
                  <div>
                    <p className="text-warm-gray-500 text-sm">Total</p>
                    <p className="font-display font-bold text-xl text-charcoal">{formatPrice(order.grandTotal)}</p>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-3xl bg-cream-50 p-4">
                    <p className="text-sm text-warm-gray-500 mb-2">Shipping</p>
                    <p className="text-charcoal text-sm">{order.address}, {order.city}, {order.state}</p>
                    <p className="text-charcoal text-sm">{order.pincode}</p>
                  </div>
                  <div className="rounded-3xl bg-cream-50 p-4">
                    <p className="text-sm text-warm-gray-500 mb-2">Items</p>
                    <ul className="space-y-2">
                      {order.items?.map((item) => (
                        <li key={item.productId} className="text-sm text-charcoal">{item.quantity} × {item.title}</li>
                      ))}
                    </ul>
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
