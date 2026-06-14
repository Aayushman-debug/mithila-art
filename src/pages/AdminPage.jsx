import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { IoGridOutline, IoCubeOutline, IoReceiptOutline, IoDocumentTextOutline, IoBrushOutline, IoLogOutOutline, IoAddOutline, IoTrashOutline, IoPencilOutline, IoEyeOutline, IoLockClosedOutline, IoCheckmarkOutline, IoCloseOutline, IoImageOutline } from 'react-icons/io5';
import { useAuth } from '../context/AuthContext';
import { paintings } from '../data/paintings';
import { formatPrice } from '../utils/helpers';
import ProductModal from '../components/admin/ProductModal';
import FallbackImage from '../components/ui/FallbackImage';

const AVAILABILITY_OPTIONS = [
  { value: 'available',           label: 'Available' },
  { value: 'only_1_left',         label: 'Only 1 Left' },
  { value: 'out_of_stock',        label: 'Out of Stock' },
  { value: 'coming_soon',         label: 'Coming Soon' },
  { value: 'commission_available',label: 'Commission Available' },
];

const availabilityColors = {
  available:            'bg-mithila-green/10 text-mithila-green',
  only_1_left:          'bg-mithila-orange/10 text-mithila-orange',
  out_of_stock:         'bg-warm-gray-100 text-warm-gray-500',
  coming_soon:          'bg-mithila-blue/10 text-mithila-blue',
  commission_available: 'bg-purple-100 text-purple-700',
};

function Toast({ message, type, onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 3000); return () => clearTimeout(t); }, [onClose]);
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 40 }}
      className={`fixed bottom-6 right-6 z-[200] flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg font-body text-sm font-medium ${
        type === 'success' ? 'bg-mithila-green text-white' : 'bg-mithila-red text-white'
      }`}
    >
      {type === 'success' ? <IoCheckmarkOutline size={18} /> : <IoCloseOutline size={18} />}
      {message}
    </motion.div>
  );
}

const tabs = [
  { id: 'dashboard', label: 'Dashboard', icon: IoGridOutline },
  { id: 'products', label: 'Artworks', icon: IoImageOutline },
  { id: 'orders', label: 'Orders', icon: IoReceiptOutline },
  { id: 'blog', label: 'Blog', icon: IoDocumentTextOutline },
  { id: 'commissions', label: 'Commissions', icon: IoBrushOutline },
];

function StatCard({ label, value, icon: Icon, color }) {
  const [count, setCount] = useState(0);
  const numValue = parseInt(String(value).replace(/[^0-9]/g, '')) || 0;

  useEffect(() => {
    let start = 0;
    const end = numValue;
    if (end === 0) {
      setCount(0);
      return;
    }
    const duration = 1500;
    const step = Math.max(1, Math.ceil(end / (duration / 16)));
    const timer = setInterval(() => {
      start += step;
      if (start >= end) { setCount(end); clearInterval(timer); }
      else setCount(start);
    }, 16);
    return () => clearInterval(timer);
  }, [numValue]);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl p-6 shadow-card">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
          <Icon size={24} className="text-white" />
        </div>
      </div>
      <p className="font-display font-bold text-3xl text-charcoal">{String(value).includes('₹') ? formatPrice(count) : count}</p>
      <p className="text-body-sm text-warm-gray-400 mt-1">{label}</p>
    </motion.div>
  );
}

function LoginScreen({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login(username, password);
    if (result.success) {
      onLogin();
    } else {
      setError(result.error || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-dark flex items-center justify-center px-4">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 shadow-glass-lg"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-gradient-gold flex items-center justify-center mx-auto mb-4 shadow-gold">
            <IoLockClosedOutline size={28} className="text-white" />
          </div>
          <h1 className="font-display font-bold text-2xl text-cream-50">Admin Dashboard</h1>
          <p className="text-cream-300/60 text-sm mt-2 font-body">Sign in to manage your store</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-cream-300 text-sm font-body mb-1">Username</label>
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-cream-50 font-body focus:outline-none focus:ring-2 focus:ring-earth-500/50 focus:border-earth-500 placeholder-cream-300/30"
              placeholder="Enter username"
            />
          </div>
          <div>
            <label className="block text-cream-300 text-sm font-body mb-1">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-cream-50 font-body focus:outline-none focus:ring-2 focus:ring-earth-500/50 focus:border-earth-500 placeholder-cream-300/30"
              placeholder="Enter password"
            />
          </div>

          {error && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-mithila-red text-sm font-body text-center bg-mithila-red/10 p-2 rounded-lg">
              {error}
            </motion.p>
          )}

          <button type="submit" className="btn-primary w-full">Sign In</button>
        </form>

        <div className="mt-6 p-3 bg-white/5 rounded-xl border border-white/10">
          <p className="text-cream-300/50 text-xs font-body text-center">
            Demo: <span className="text-earth-400">admin@mithila.com</span> / <span className="text-earth-400">mithila2024</span>
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export default function AdminPage() {
  const { user, logout, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loggedIn, setLoggedIn] = useState(isAuthenticated);
  const [realOrders, setRealOrders] = useState([]);
  const [realCommissions, setRealCommissions] = useState([]);
  const [realProducts, setRealProducts] = useState([]);
  const [showScreenshotModal, setShowScreenshotModal] = useState(false);
  const [selectedScreenshot, setSelectedScreenshot] = useState('');
  const [toast, setToast] = useState(null); // { message, type }
  
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState(null);
  
  useEffect(() => {
    setLoggedIn(isAuthenticated);
  }, [isAuthenticated]);

  const statusColors = {
    Delivered: 'bg-mithila-green/10 text-mithila-green',
    Shipped: 'bg-mithila-blue/10 text-mithila-blue',
    Processing: 'bg-mithila-orange/10 text-mithila-orange',
    Pending: 'bg-warm-gray-100 text-warm-gray-600',
    New: 'bg-mithila-blue/10 text-mithila-blue',
    'in-progress': 'bg-mithila-orange/10 text-mithila-orange',
    'In Progress': 'bg-mithila-orange/10 text-mithila-orange',
    Completed: 'bg-mithila-green/10 text-mithila-green',
    approved: 'bg-mithila-green/10 text-mithila-green',
    submitted: 'bg-warm-gray-100 text-warm-gray-600',
    'Pending Payment Verification': 'bg-mithila-orange/10 text-mithila-orange',
  };

  useEffect(() => {
    if (loggedIn) {
      import('../api').then(({ adminAPI }) => {
        adminAPI.getOrders().then(res => {
          if (res.data.success) setRealOrders(res.data.orders);
        }).catch(err => console.error('Failed to fetch admin orders', err));

        adminAPI.getCommissions().then(res => {
          if (res.data.success) setRealCommissions(res.data.commissions);
        }).catch(err => console.error('Failed to fetch admin commissions', err));

        adminAPI.getProducts().then(res => {
          if (res.data.success && res.data.products.length > 0) {
            setRealProducts(res.data.products);
          } else {
            // Fallback: enrich local paintings with default availabilityStatus
            setRealProducts(paintings.map(p => ({ ...p, _id: p.id, availabilityStatus: p.inStock ? 'available' : 'out_of_stock' })));
          }
        }).catch(() => {
          // API unavailable — fall back to local data
          setRealProducts(paintings.map(p => ({ ...p, _id: p.id, availabilityStatus: p.inStock ? 'available' : 'out_of_stock' })));
        });
      });
    }
  }, [loggedIn]);

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type });
  }, []);

  const fetchProducts = async () => {
    const { adminAPI } = await import('../api');
    try {
      const res = await adminAPI.getProducts();
      if (res.data.success) setRealProducts(res.data.products);
    } catch (err) {
      console.error('Failed to fetch products', err);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Are you sure you want to delete this artwork?')) return;
    try {
      const { productAPI } = await import('../api');
      const res = await productAPI.deleteProduct(id);
      if (res.data.success) {
        showToast('Artwork deleted');
        fetchProducts();
      }
    } catch (err) {
      showToast('Failed to delete', 'error');
    }
  };

  const handleDeleteCollection = async (id) => {
    if (!window.confirm('Are you sure you want to delete this collection?')) return;
    try {
      const { collectionAPI } = await import('../api');
      const res = await collectionAPI.deleteCollection(id);
      if (res.data.success) {
        showToast('Collection deleted');
        fetchCollections();
      }
    } catch (err) {
      showToast('Failed to delete', 'error');
    }
  };

  const handleDeleteOrder = async (id) => {
    if (!window.confirm('Are you sure you want to delete this order?')) return;
    try {
      const { adminAPI } = await import('../api');
      const res = await adminAPI.deleteOrder(id);
      if (res.data.success) {
        showToast('Order deleted');
        setRealOrders(orders => orders.filter(o => o._id !== id));
      }
    } catch (err) {
      showToast('Failed to delete order', 'error');
    }
  };

  const handleCleanupBase64 = async () => {
    if (!window.confirm('Are you sure you want to clean up oversized base64 images from the database? This will permanently remove large image strings from products.')) return;
    try {
      const { adminAPI } = await import('../api');
      const res = await adminAPI.cleanupBase64Images();
      if (res.data.success) {
        showToast(res.data.message);
        fetchProducts();
      }
    } catch (err) {
      showToast('Cleanup failed', 'error');
    }
  };

  const handleAvailabilityChange = async (productId, newStatus) => {
    try {
      const { productAPI } = await import('../api');
      const res = await productAPI.updateProduct(productId, { availabilityStatus: newStatus });
      if (res.data.success) {
        setRealProducts(prev => prev.map(p => (p._id === productId ? { ...p, availabilityStatus: newStatus } : p)));
        showToast('Availability updated successfully');
      } else {
        showToast('Update failed: ' + (res.data.message || 'Unknown error'), 'error');
      }
    } catch (err) {
      console.error('Failed to update availability', err);
      showToast('Failed to update availability', 'error');
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const { adminAPI } = await import('../api');
      const res = await adminAPI.updateOrderStatus(orderId, newStatus);
      if (res.data.success) {
        setRealOrders(orders => orders.map(o => o._id === orderId ? { ...o, status: newStatus } : o));
      }
    } catch (err) {
      console.error("Failed to update status", err);
      alert("Failed to update status");
    }
  };

  const handleVerifyPayment = async (orderId) => {
    try {
      const { adminAPI } = await import('../api');
      const res = await adminAPI.verifyPayment(orderId);
      if (res.data.success) {
        setRealOrders(orders => orders.map(o => o._id === orderId ? { ...o, status: 'Processing', paymentStatus: 'paid', paymentVerification: 'verified' } : o));
      }
    } catch (err) {
      console.error("Failed to verify payment", err);
      alert("Failed to verify payment");
    }
  };

  const handleRejectPayment = async (orderId) => {
    try {
      const { adminAPI } = await import('../api');
      const res = await adminAPI.rejectPayment(orderId);
      if (res.data.success) {
        setRealOrders(orders => orders.map(o => o._id === orderId ? { ...o, status: 'Pending', paymentStatus: 'failed', paymentVerification: 'rejected' } : o));
      }
    } catch (err) {
      console.error("Failed to reject payment", err);
      alert("Failed to reject payment");
    }
  };

  if (!loggedIn) {
    return (
      <>
        <Helmet><title>Admin Login — Lalita Pathak Mithila Art</title></Helmet>
        <LoginScreen onLogin={() => setLoggedIn(true)} />
      </>
    );
  }

  const totalRevenue = realOrders.reduce((sum, order) => sum + (order.grandTotal || 0), 0);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="min-h-screen bg-cream-50">
      <Helmet><title>Admin Dashboard — Lalita Pathak Mithila Art</title></Helmet>

      <div className="flex">
        {/* Sidebar */}
        <div className="hidden md:flex w-64 min-h-screen bg-earth-900 text-cream-200 flex-col fixed left-0 top-0 z-10">
          <div className="p-6 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-gold flex items-center justify-center">
                <span className="text-white font-display font-bold">म</span>
              </div>
              <div>
                <p className="font-display font-bold text-cream-100 text-sm">Mithila Art</p>
                <p className="text-xs text-earth-400">Admin Panel</p>
              </div>
            </div>
          </div>

          <nav className="flex-1 p-4 space-y-1">
            {tabs.map(({ id, label, icon: Icon }) => (
              <button key={id} onClick={() => setActiveTab(id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-body text-sm font-medium transition-all duration-300 ${
                  activeTab === id ? 'bg-earth-500/20 text-earth-400' : 'text-cream-300/60 hover:bg-white/5 hover:text-cream-200'
                }`}
              >
                <Icon size={20} /> {label}
              </button>
            ))}
          </nav>

          <div className="p-4 border-t border-white/10">
            <button onClick={() => { logout(); setLoggedIn(false); }} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-cream-300/60 hover:bg-mithila-red/10 hover:text-mithila-red font-body text-sm transition-all">
              <IoLogOutOutline size={20} /> Sign Out
            </button>
          </div>
        </div>

        {/* Mobile Tab Bar */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-cream-200 z-50 flex">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => setActiveTab(id)}
              className={`flex-1 py-3 flex flex-col items-center gap-1 text-xs font-body ${
                activeTab === id ? 'text-earth-500' : 'text-warm-gray-400'
              }`}
            >
              <Icon size={20} /> {label}
            </button>
          ))}
        </div>

        {/* Main Content */}
        <div className="flex-1 md:ml-64 p-4 md:p-8 pb-20 md:pb-8">
          {/* Top Bar */}
          <div className="flex items-center justify-between mb-8 bg-white rounded-2xl p-4 shadow-card">
            <div>
              <h1 className="font-display font-bold text-xl text-charcoal">
                {tabs.find((t) => t.id === activeTab)?.label}
              </h1>
              <p className="text-body-sm text-warm-gray-400">Welcome back, {user?.name || 'Admin'}</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-earth-500/10 flex items-center justify-center">
                <span className="text-earth-500 font-display font-bold text-sm">A</span>
              </div>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {/* Dashboard */}
            {activeTab === 'dashboard' && (
              <motion.div key="dashboard" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                  <StatCard label="Total Paintings" value={paintings.length.toString()} icon={IoCubeOutline} color="bg-mithila-blue" />
                  <StatCard label="Total Orders" value={realOrders.length.toString()} icon={IoReceiptOutline} color="bg-mithila-green" />
                  <StatCard label="Revenue" value={`₹${totalRevenue}`} icon={IoGridOutline} color="bg-earth-500" />
                  <StatCard label="Commissions" value={realCommissions.length.toString()} icon={IoBrushOutline} color="bg-mithila-orange" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-white rounded-2xl p-6 shadow-card">
                    <h3 className="font-display font-semibold text-lg text-charcoal mb-4">Recent Orders</h3>
                    <div className="space-y-3">
                      {realOrders.length > 0 ? realOrders.slice(0, 4).map((order) => (
                        <div key={order._id} className="flex items-center justify-between p-3 bg-cream-50 rounded-xl border border-cream-100">
                          <div>
                            <p className="font-body font-medium text-sm text-charcoal">{order.name}</p>
                            <p className="text-xs text-warm-gray-400">#{order.orderId || order._id.slice(-8)}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-display font-semibold text-earth-700">{formatPrice(order.grandTotal)}</p>
                            <span className={`text-xs px-2 py-0.5 rounded-full font-body font-medium ${statusColors[order.status || 'Pending'] || 'bg-warm-gray-100'}`}>{order.status || 'Pending'}</span>
                          </div>
                        </div>
                      )) : (
                        <p className="text-sm text-warm-gray-500 py-4">No recent orders found.</p>
                      )}
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl p-6 shadow-card">
                    <h3 className="font-display font-semibold text-lg text-charcoal mb-4">Commission Requests</h3>
                    <div className="space-y-3">
                      {realCommissions.length > 0 ? realCommissions.slice(0, 4).map((com) => (
                        <div key={com._id} className="flex items-center justify-between p-3 bg-cream-50 rounded-xl border border-cream-100">
                          <div>
                            <p className="font-body font-medium text-sm text-charcoal">{com.name}</p>
                            <p className="text-xs text-warm-gray-400">{com.style || 'Custom'} • {com.size || 'Standard'}</p>
                          </div>
                          <span className={`text-xs px-2 py-0.5 rounded-full font-body font-medium ${statusColors[com.status] || 'bg-warm-gray-100'}`}>{com.status}</span>
                        </div>
                      )) : (
                        <p className="text-sm text-warm-gray-500 py-4">No recent commission requests found.</p>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Products */}
            {activeTab === 'products' && (
              <motion.div key="products" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div className="bg-white rounded-2xl shadow-card overflow-hidden">
                  <div className="p-4 flex flex-col md:flex-row items-start md:items-center justify-between border-b border-cream-100 gap-4">
                    <p className="font-body text-sm text-warm-gray-500">{realProducts.length} paintings</p>
                    <div className="flex flex-wrap gap-2">
                      <button onClick={handleCleanupBase64} className="flex items-center gap-2 px-4 py-2 bg-warm-gray-100 text-warm-gray-600 rounded-xl text-sm font-body font-medium hover:bg-warm-gray-200 transition-colors">
                        <IoTrashOutline size={18} /> Clean Database
                      </button>
                      <button onClick={() => { setProductToEdit(null); setIsProductModalOpen(true); }} className="flex items-center gap-2 px-4 py-2 bg-earth-500 text-white rounded-xl text-sm font-body font-medium hover:bg-earth-600 transition-colors">
                        <IoAddOutline size={18} /> Add Variant
                      </button>
                    </div>
                  </div>
                  <div className="hidden md:block overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="text-left text-xs font-body font-semibold text-warm-gray-400 uppercase tracking-wider border-b border-cream-100">
                          <th className="px-4 py-3">Painting</th>
                          <th className="px-4 py-3">Category</th>
                          <th className="px-4 py-3">Price</th>
                          <th className="px-4 py-3">Availability</th>
                          <th className="px-4 py-3">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {realProducts.slice(0, 20).map((p) => (
                          <tr key={p._id || p.id} className="border-b border-cream-50 hover:bg-cream-50/50 transition-colors">
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-3">
                                <FallbackImage src={p.images?.[0]?.url || p.images?.[0] || p.image} alt={p.title} className="w-10 h-10 rounded-lg object-cover" />
                                <div>
                                  <p className="font-body font-medium text-sm text-charcoal">{p.title}</p>
                                  <p className="text-xs text-warm-gray-400">{p.size}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <span className="text-xs px-2 py-1 bg-earth-500/10 text-earth-500 rounded-full font-body font-medium">{p.category}</span>
                            </td>
                            <td className="px-4 py-3 font-display font-semibold text-earth-700">{formatPrice(p.price)}</td>
                            <td className="px-4 py-3">
                              <select
                                value={p.availabilityStatus || 'available'}
                                onChange={(e) => handleAvailabilityChange(p._id || p.id, e.target.value)}
                                className={`text-xs px-2 py-1 rounded-full font-body font-medium cursor-pointer border border-transparent hover:border-earth-200 outline-none ${
                                  availabilityColors[p.availabilityStatus || 'available']
                                }`}
                              >
                                {AVAILABILITY_OPTIONS.map(opt => (
                                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                                ))}
                              </select>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex gap-2">
                                <button onClick={() => { setProductToEdit(p); setIsProductModalOpen(true); }} className="p-1.5 rounded-lg hover:bg-cream-100 text-warm-gray-400 hover:text-earth-500 transition-colors"><IoPencilOutline size={16} /></button>
                                <button onClick={() => handleDeleteProduct(p._id || p.id)} className="p-1.5 rounded-lg hover:bg-cream-100 text-warm-gray-400 hover:text-mithila-red transition-colors"><IoTrashOutline size={16} /></button>
                              </div>
                            </td>
                          </tr>
                        ))}
                        {realProducts.length === 0 && (
                          <tr>
                            <td colSpan="5" className="px-4 py-8 text-center text-warm-gray-500 font-body">No products found.</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile Card View */}
                  <div className="md:hidden flex flex-col gap-4 p-4">
                    {realProducts.slice(0, 20).map((p) => (
                      <div key={p._id || p.id} className="bg-cream-50 p-4 rounded-xl border border-cream-100 flex flex-col gap-3">
                        <div className="flex gap-4 items-center">
                          <FallbackImage src={p.images?.[0]?.url || p.images?.[0] || p.image} alt={p.title} className="w-16 h-16 rounded-xl object-cover" />
                          <div className="flex-1">
                            <h4 className="font-display font-bold text-charcoal">{p.title}</h4>
                            <p className="text-sm text-warm-gray-500">{p.size} • {p.category}</p>
                            <p className="font-display font-semibold text-earth-700">{formatPrice(p.price)}</p>
                          </div>
                        </div>
                        <div className="flex justify-between items-center mt-2">
                          <select
                            value={p.availabilityStatus || 'available'}
                            onChange={(e) => handleAvailabilityChange(p._id || p.id, e.target.value)}
                            className={`text-xs px-2 py-1 rounded-full font-body font-medium outline-none ${availabilityColors[p.availabilityStatus || 'available']}`}
                          >
                            {AVAILABILITY_OPTIONS.map(opt => (
                              <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                          </select>
                          <div className="flex gap-2">
                            <button onClick={() => { setProductToEdit(p); setIsProductModalOpen(true); }} className="p-2 rounded-lg bg-white border border-cream-200 text-warm-gray-400 hover:text-earth-500"><IoPencilOutline size={16} /></button>
                            <button onClick={() => handleDeleteProduct(p._id || p.id)} className="p-2 rounded-lg bg-white border border-cream-200 text-warm-gray-400 hover:text-mithila-red"><IoTrashOutline size={16} /></button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}



            {/* Orders */}
            {activeTab === 'orders' && (
              <motion.div key="orders" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div className="bg-white rounded-2xl shadow-card overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="text-left text-xs font-body font-semibold text-warm-gray-400 uppercase tracking-wider border-b border-cream-100">
                          <th className="px-4 py-3">Order ID</th>
                          <th className="px-4 py-3">Customer</th>
                          <th className="px-4 py-3">Total</th>
                          <th className="px-4 py-3">Method</th>
                          <th className="px-4 py-3">Payment</th>
                          <th className="px-4 py-3">Status</th>
                          <th className="px-4 py-3">Date</th>
                          <th className="px-4 py-3">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {realOrders.map((order) => (
                          <tr key={order._id} className="border-b border-cream-50 hover:bg-cream-50/50 transition-colors">
                            <td className="px-4 py-3 font-mono text-sm text-earth-700 font-medium">#{order.orderId || order._id.slice(-8)}</td>
                            <td className="px-4 py-3">
                              <p className="font-body font-medium text-sm text-charcoal">{order.name}</p>
                              <p className="text-xs text-warm-gray-400">{order.email}</p>
                            </td>
                            <td className="px-4 py-3 font-display font-semibold text-earth-700">{formatPrice(order.grandTotal)}</td>
                            <td className="px-4 py-3">
                              <span className={`text-xs px-2 py-1 rounded-full font-body font-medium ${order.paymentMethod === 'upi' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                                {order.paymentMethod === 'upi' ? 'UPI' : 'Razorpay'}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              {order.paymentMethod === 'upi' ? (
                                <span className={`text-xs px-2 py-1 rounded-full font-body font-medium ${order.paymentVerification === 'verified' ? 'bg-mithila-green/10 text-mithila-green' : order.paymentVerification === 'rejected' ? 'bg-mithila-red/10 text-mithila-red' : 'bg-mithila-orange/10 text-mithila-orange'}`}>
                                  {order.paymentVerification || 'pending'}
                                </span>
                              ) : (
                                <span className={`text-xs px-2 py-1 rounded-full font-body font-medium ${order.paymentStatus === 'paid' ? 'bg-mithila-green/10 text-mithila-green' : 'bg-warm-gray-100 text-warm-gray-600'}`}>
                                  {order.paymentStatus || 'pending'}
                                </span>
                              )}
                            </td>
                            <td className="px-4 py-3">
                              <select 
                                value={order.status || 'Pending'} 
                                onChange={(e) => handleStatusChange(order._id, e.target.value)}
                                className={`text-xs px-2 py-1 rounded-full font-body font-medium cursor-pointer border border-transparent hover:border-earth-200 outline-none ${statusColors[order.status || 'Pending']}`}
                              >
                                <option value="Pending">Pending</option>
                                <option value="Processing">Processing</option>
                                <option value="Shipped">Shipped</option>
                                <option value="Delivered">Delivered</option>
                                <option value="Pending Payment Verification">Pending Payment Verification</option>
                              </select>
                            </td>
                            <td className="px-4 py-3 text-sm text-warm-gray-500 font-body">{new Date(order.createdAt).toLocaleDateString()}</td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                <button className="p-1.5 rounded-lg hover:bg-cream-100 text-warm-gray-400 hover:text-earth-500 transition-colors" title="View Order"><IoEyeOutline size={16} /></button>
                                {order.paymentMethod === 'upi' && order.paymentScreenshot && (
                                  <button onClick={() => { setSelectedScreenshot(order.paymentScreenshot); setShowScreenshotModal(true); }} className="p-1.5 rounded-lg hover:bg-cream-100 text-warm-gray-400 hover:text-earth-500 transition-colors" title="View Screenshot">
                                    <IoImageOutline size={16} />
                                  </button>
                                )}
                                <button onClick={() => handleDeleteOrder(order._id)} className="p-1.5 rounded-lg hover:bg-cream-100 text-warm-gray-400 hover:text-mithila-red transition-colors" title="Delete Order">
                                  <IoTrashOutline size={16} />
                                </button>
                                {order.paymentMethod === 'upi' && order.paymentVerification === 'pending' && (
                                  <>
                                    <button onClick={() => handleVerifyPayment(order._id)} className="p-1.5 rounded-lg hover:bg-mithila-green/20 text-mithila-green transition-colors" title="Verify Payment">
                                      <IoCheckmarkOutline size={16} />
                                    </button>
                                    <button onClick={() => handleRejectPayment(order._id)} className="p-1.5 rounded-lg hover:bg-mithila-red/20 text-mithila-red transition-colors" title="Reject Payment">
                                      <IoCloseOutline size={16} />
                                    </button>
                                  </>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                        {realOrders.length === 0 && (
                          <tr>
                            <td colSpan="7" className="px-4 py-8 text-center text-warm-gray-500 font-body">
                              No orders found.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Blog */}
            {activeTab === 'blog' && (
              <motion.div key="blog" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div className="bg-white rounded-2xl p-6 shadow-card text-center py-16">
                  <IoDocumentTextOutline className="text-cream-300 mx-auto mb-4" size={48} />
                  <h3 className="heading-sm text-charcoal mb-2">Blog Management</h3>
                  <p className="text-body-sm max-w-md mx-auto mb-6">Create, edit, and manage your blog posts. Share stories about Mithila art and engage with your audience.</p>
                  <button className="btn-primary">Create New Post</button>
                </div>
              </motion.div>
            )}

            {/* Commissions */}
            {activeTab === 'commissions' && (
              <motion.div key="commissions" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div className="bg-white rounded-2xl shadow-card overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="text-left text-xs font-body font-semibold text-warm-gray-400 uppercase tracking-wider border-b border-cream-100">
                          <th className="px-4 py-3">ID</th>
                          <th className="px-4 py-3">Client</th>
                          <th className="px-4 py-3">Style</th>
                          <th className="px-4 py-3">Location</th>
                          <th className="px-4 py-3">Status</th>
                          <th className="px-4 py-3">Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {realCommissions.map((com) => (
                          <tr key={com._id} className="border-b border-cream-50 hover:bg-cream-50/50 transition-colors">
                            <td className="px-4 py-3 font-mono text-sm text-earth-700">#{com.referenceId || com._id.slice(-6)}</td>
                            <td className="px-4 py-3">
                              <p className="font-body font-medium text-sm text-charcoal">{com.name}</p>
                              <p className="text-xs text-warm-gray-400">{com.email}</p>
                            </td>
                            <td className="px-4 py-3"><span className="text-xs px-2 py-1 bg-earth-500/10 text-earth-500 rounded-full font-body font-medium">{com.style || 'Custom'}</span></td>
                            <td className="px-4 py-3 text-sm text-warm-gray-600 font-body">{com.location}</td>
                            <td className="px-4 py-3"><span className={`text-xs px-2 py-1 rounded-full font-body font-medium ${statusColors[com.status] || 'bg-warm-gray-100'}`}>{com.status}</span></td>
                            <td className="px-4 py-3 text-sm text-warm-gray-500 font-body">{new Date(com.submittedAt).toLocaleDateString()}</td>
                          </tr>
                        ))}
                        {realCommissions.length === 0 && (
                          <tr>
                            <td colSpan="6" className="px-4 py-8 text-center text-warm-gray-500 font-body">
                              No commission requests found.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Modals */}
      <ProductModal 
        isOpen={isProductModalOpen} 
        onClose={() => setIsProductModalOpen(false)} 
        productToEdit={productToEdit} 
        onSave={() => { showToast('Variant saved successfully'); fetchProducts(); }} 
      />
      


      {/* Screenshot Modal */}
      <AnimatePresence>
        {showScreenshotModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center bg-earth-900/90 p-4">
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="relative bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
              <div className="p-4 border-b border-cream-200 flex justify-between items-center bg-cream-50">
                <h3 className="font-display font-bold text-lg text-charcoal">Payment Screenshot</h3>
                <button onClick={() => setShowScreenshotModal(false)} className="p-2 text-warm-gray-400 hover:text-mithila-red transition-colors bg-white rounded-full shadow-sm">
                  <IoCloseOutline size={24} />
                </button>
              </div>
              <div className="p-6 overflow-auto bg-cream-50/50 flex items-center justify-center flex-1">
                <img src={selectedScreenshot} alt="Payment Screenshot" className="max-w-full max-h-full object-contain rounded-xl shadow-md border border-cream-200" />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Availability Toast */}
      <AnimatePresence>
        {toast && (
          <Toast key={toast.message + Date.now()} message={toast.message} type={toast.type} onClose={() => setToast(null)} />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
