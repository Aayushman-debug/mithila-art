import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { IoCubeOutline, IoTimeOutline, IoCheckmarkCircleOutline, IoRocketOutline } from 'react-icons/io5';
import { userAPI } from '../api';
import { formatPrice } from '../utils/helpers';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const getStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'processing': return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'shipped': return 'bg-purple-100 text-purple-800 border-purple-200';
    case 'delivered': return 'bg-green-100 text-green-800 border-green-200';
    default: return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const getStatusIcon = (status) => {
  switch (status?.toLowerCase()) {
    case 'pending': return <IoTimeOutline size={16} />;
    case 'processing': return <IoCubeOutline size={16} />;
    case 'shipped': return <IoRocketOutline size={16} />;
    case 'delivered': return <IoCheckmarkCircleOutline size={16} />;
    default: return null;
  }
};

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await userAPI.getOrders();
        if (response.data && response.data.success) {
          setOrders(response.data.orders);
        } else {
          setError(response.data?.message || 'Failed to fetch orders');
        }
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Failed to fetch orders');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) return <LoadingSpinner fullScreen text="Loading your orders..." />;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-cream-50 dark:bg-warm-gray-900 pt-28 pb-20"
    >
      <Helmet>
        <title>My Orders — Lalita Pathak Mithila Art</title>
        <meta name="description" content="View your order history." />
      </Helmet>

      <div className="container-custom px-4">
        <h1 className="font-display text-4xl font-bold text-charcoal dark:text-cream-100 mb-8">My Orders</h1>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-8 border border-red-100">
            {error}
          </div>
        )}

        {orders.length === 0 && !error ? (
          <div className="text-center py-20 bg-white dark:bg-warm-gray-800 rounded-3xl shadow-sm border border-cream-200 dark:border-warm-gray-700">
            <IoCubeOutline className="mx-auto text-warm-gray-300 dark:text-warm-gray-600 mb-4" size={64} />
            <h2 className="font-display text-2xl font-bold text-charcoal dark:text-cream-100 mb-2">No Orders Yet</h2>
            <p className="text-warm-gray-500 mb-6">Looks like you haven't made any purchases yet.</p>
            <a href="/shop" className="btn-primary inline-flex">Explore Artworks</a>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <motion.div
                key={order._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-warm-gray-800 rounded-2xl shadow-sm border border-cream-200 dark:border-warm-gray-700 overflow-hidden"
              >
                {/* Order Header */}
                <div className="bg-cream-100/50 dark:bg-warm-gray-700/50 p-4 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-cream-200 dark:border-warm-gray-700">
                  <div className="flex flex-wrap gap-x-8 gap-y-2">
                    <div>
                      <p className="text-xs text-warm-gray-500 uppercase tracking-wider font-semibold mb-1">Order Date</p>
                      <p className="font-body text-charcoal dark:text-cream-100">
                        {new Date(order.createdAt).toLocaleDateString('en-IN', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-warm-gray-500 uppercase tracking-wider font-semibold mb-1">Total Amount</p>
                      <p className="font-body font-bold text-earth-700 dark:text-earth-400">
                        {formatPrice(order.grandTotal)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-warm-gray-500 uppercase tracking-wider font-semibold mb-1">Order ID</p>
                      <p className="font-mono text-sm text-charcoal dark:text-cream-100">{order.orderId || order._id}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border ${getStatusColor(order.status || 'Pending')}`}>
                      {getStatusIcon(order.status || 'Pending')}
                      {order.status || 'Pending'}
                    </span>
                  </div>
                </div>

                {/* Order Items */}
                <div className="p-4 md:p-6 space-y-6">
                  {order.items?.map((item, index) => (
                    <div key={index} className="flex gap-4 md:gap-6">
                      <div className="w-20 h-24 md:w-24 md:h-32 flex-shrink-0 bg-warm-gray-100 dark:bg-warm-gray-900 rounded-xl overflow-hidden">
                        <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 flex flex-col justify-center">
                        <h3 className="font-display font-semibold text-lg text-charcoal dark:text-cream-100 leading-snug mb-1">
                          {item.title}
                        </h3>
                        {item.variantName && (
                          <p className="text-earth-500 font-body text-sm font-medium mb-1">{item.variantName}</p>
                        )}
                        <p className="text-warm-gray-500 font-body text-sm mb-2">Qty: {item.quantity}</p>
                        <p className="font-display font-bold text-earth-700 dark:text-earth-400">
                          {formatPrice(item.price)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
