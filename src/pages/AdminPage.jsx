import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { IoGridOutline, IoCubeOutline, IoReceiptOutline, IoDocumentTextOutline, IoBrushOutline, IoLogOutOutline, IoAddOutline, IoTrashOutline, IoPencilOutline, IoEyeOutline, IoLockClosedOutline } from 'react-icons/io5';
import { useAuth } from '../context/AuthContext';
import { paintings } from '../data/paintings';
import { formatPrice } from '../utils/helpers';

const tabs = [
  { id: 'dashboard', label: 'Dashboard', icon: IoGridOutline },
  { id: 'products', label: 'Products', icon: IoCubeOutline },
  { id: 'orders', label: 'Orders', icon: IoReceiptOutline },
  { id: 'blog', label: 'Blog', icon: IoDocumentTextOutline },
  { id: 'commissions', label: 'Commissions', icon: IoBrushOutline },
];

const mockOrders = [
  { id: 'MTA001247', customer: 'Rajesh Kumar', email: 'rajesh@email.com', total: 18500, status: 'Delivered', date: '2025-12-15', items: 2 },
  { id: 'MTA001248', customer: 'Ananya Singh', email: 'ananya@email.com', total: 8500, status: 'Shipped', date: '2025-12-18', items: 1 },
  { id: 'MTA001249', customer: 'David Chen', email: 'david@email.com', total: 35000, status: 'Processing', date: '2025-12-20', items: 3 },
  { id: 'MTA001250', customer: 'Deepa Sharma', email: 'deepa@email.com', total: 12000, status: 'Pending', date: '2025-12-22', items: 1 },
  { id: 'MTA001251', customer: 'Michael Brown', email: 'michael@email.com', total: 25000, status: 'Delivered', date: '2025-12-10', items: 2 },
];

const mockCommissions = [
  { id: 'COM001', name: 'Sunita Rao', style: 'Kohbar', budget: '₹10,000 - ₹25,000', status: 'New', date: '2025-12-22' },
  { id: 'COM002', name: 'James Wilson', style: 'Bharni', budget: '₹25,000 - ₹50,000', status: 'In Progress', date: '2025-12-18' },
  { id: 'COM003', name: 'Meera Joshi', style: 'Kachni', budget: '₹5,000 - ₹10,000', status: 'Completed', date: '2025-12-05' },
];

function StatCard({ label, value, icon: Icon, color }) {
  const [count, setCount] = useState(0);
  const numValue = parseInt(value.replace(/[^0-9]/g, '')) || 0;

  useEffect(() => {
    let start = 0;
    const end = numValue;
    const duration = 1500;
    const step = Math.ceil(end / (duration / 16));
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
      <p className="font-display font-bold text-3xl text-charcoal">{value.includes('₹') ? formatPrice(count) : count}</p>
      <p className="text-body-sm text-warm-gray-400 mt-1">{label}</p>
    </motion.div>
  );
}

function LoginScreen({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    const result = login(username, password);
    if (result.success) {
      onLogin();
    } else {
      setError(result.error);
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
            Demo: <span className="text-earth-400">admin</span> / <span className="text-earth-400">mithila2024</span>
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

  if (!loggedIn) {
    return (
      <>
        <Helmet><title>Admin Login — Lalita Pathak Mithila Art</title></Helmet>
        <LoginScreen onLogin={() => setLoggedIn(true)} />
      </>
    );
  }

  const statusColors = {
    Delivered: 'bg-mithila-green/10 text-mithila-green',
    Shipped: 'bg-mithila-blue/10 text-mithila-blue',
    Processing: 'bg-mithila-orange/10 text-mithila-orange',
    Pending: 'bg-warm-gray-100 text-warm-gray-600',
    New: 'bg-mithila-blue/10 text-mithila-blue',
    'In Progress': 'bg-mithila-orange/10 text-mithila-orange',
    Completed: 'bg-mithila-green/10 text-mithila-green',
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="min-h-screen bg-cream-50">
      <Helmet><title>Admin Dashboard — Lalita Pathak Mithila Art</title></Helmet>

      <div className="flex">
        {/* Sidebar */}
        <div className="hidden md:flex w-64 min-h-screen bg-earth-900 text-cream-200 flex-col fixed left-0 top-0">
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
                  <StatCard label="Total Paintings" value="24" icon={IoCubeOutline} color="bg-mithila-blue" />
                  <StatCard label="Total Orders" value="156" icon={IoReceiptOutline} color="bg-mithila-green" />
                  <StatCard label="Revenue" value="₹487500" icon={IoGridOutline} color="bg-earth-500" />
                  <StatCard label="Commissions" value="12" icon={IoBrushOutline} color="bg-mithila-orange" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-white rounded-2xl p-6 shadow-card">
                    <h3 className="font-display font-semibold text-lg text-charcoal mb-4">Recent Orders</h3>
                    <div className="space-y-3">
                      {mockOrders.slice(0, 4).map((order) => (
                        <div key={order.id} className="flex items-center justify-between p-3 bg-cream-50 rounded-xl">
                          <div>
                            <p className="font-body font-medium text-sm text-charcoal">{order.customer}</p>
                            <p className="text-xs text-warm-gray-400">{order.id}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-display font-semibold text-earth-700">{formatPrice(order.total)}</p>
                            <span className={`text-xs px-2 py-0.5 rounded-full font-body font-medium ${statusColors[order.status]}`}>{order.status}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl p-6 shadow-card">
                    <h3 className="font-display font-semibold text-lg text-charcoal mb-4">Commission Requests</h3>
                    <div className="space-y-3">
                      {mockCommissions.map((com) => (
                        <div key={com.id} className="flex items-center justify-between p-3 bg-cream-50 rounded-xl">
                          <div>
                            <p className="font-body font-medium text-sm text-charcoal">{com.name}</p>
                            <p className="text-xs text-warm-gray-400">{com.style} • {com.budget}</p>
                          </div>
                          <span className={`text-xs px-2 py-0.5 rounded-full font-body font-medium ${statusColors[com.status]}`}>{com.status}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Products */}
            {activeTab === 'products' && (
              <motion.div key="products" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div className="bg-white rounded-2xl shadow-card overflow-hidden">
                  <div className="p-4 flex items-center justify-between border-b border-cream-100">
                    <p className="font-body text-sm text-warm-gray-500">{paintings.length} paintings</p>
                    <button className="flex items-center gap-2 px-4 py-2 bg-earth-500 text-white rounded-xl text-sm font-body font-medium hover:bg-earth-600 transition-colors">
                      <IoAddOutline size={18} /> Add Painting
                    </button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="text-left text-xs font-body font-semibold text-warm-gray-400 uppercase tracking-wider border-b border-cream-100">
                          <th className="px-4 py-3">Painting</th>
                          <th className="px-4 py-3">Category</th>
                          <th className="px-4 py-3">Price</th>
                          <th className="px-4 py-3">Status</th>
                          <th className="px-4 py-3">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {paintings.slice(0, 10).map((p) => (
                          <tr key={p.id} className="border-b border-cream-50 hover:bg-cream-50/50 transition-colors">
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-3">
                                <img src={p.images?.[0] || p.image} alt={p.title} className="w-10 h-10 rounded-lg object-cover" />
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
                              <span className={`text-xs px-2 py-1 rounded-full font-body font-medium ${p.inStock ? 'bg-mithila-green/10 text-mithila-green' : 'bg-warm-gray-100 text-warm-gray-500'}`}>
                                {p.inStock ? 'In Stock' : 'Sold'}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex gap-2">
                                <button className="p-1.5 rounded-lg hover:bg-cream-100 text-warm-gray-400 hover:text-earth-500 transition-colors"><IoPencilOutline size={16} /></button>
                                <button className="p-1.5 rounded-lg hover:bg-cream-100 text-warm-gray-400 hover:text-mithila-red transition-colors"><IoTrashOutline size={16} /></button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
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
                          <th className="px-4 py-3">Items</th>
                          <th className="px-4 py-3">Total</th>
                          <th className="px-4 py-3">Status</th>
                          <th className="px-4 py-3">Date</th>
                          <th className="px-4 py-3">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {mockOrders.map((order) => (
                          <tr key={order.id} className="border-b border-cream-50 hover:bg-cream-50/50 transition-colors">
                            <td className="px-4 py-3 font-mono text-sm text-earth-700 font-medium">#{order.id}</td>
                            <td className="px-4 py-3">
                              <p className="font-body font-medium text-sm text-charcoal">{order.customer}</p>
                              <p className="text-xs text-warm-gray-400">{order.email}</p>
                            </td>
                            <td className="px-4 py-3 text-sm text-warm-gray-600">{order.items}</td>
                            <td className="px-4 py-3 font-display font-semibold text-earth-700">{formatPrice(order.total)}</td>
                            <td className="px-4 py-3">
                              <span className={`text-xs px-2 py-1 rounded-full font-body font-medium ${statusColors[order.status]}`}>{order.status}</span>
                            </td>
                            <td className="px-4 py-3 text-sm text-warm-gray-500 font-body">{order.date}</td>
                            <td className="px-4 py-3">
                              <button className="p-1.5 rounded-lg hover:bg-cream-100 text-warm-gray-400 hover:text-earth-500 transition-colors"><IoEyeOutline size={16} /></button>
                            </td>
                          </tr>
                        ))}
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
                          <th className="px-4 py-3">Budget</th>
                          <th className="px-4 py-3">Status</th>
                          <th className="px-4 py-3">Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {mockCommissions.map((com) => (
                          <tr key={com.id} className="border-b border-cream-50 hover:bg-cream-50/50 transition-colors">
                            <td className="px-4 py-3 font-mono text-sm text-earth-700">#{com.id}</td>
                            <td className="px-4 py-3 font-body font-medium text-sm text-charcoal">{com.name}</td>
                            <td className="px-4 py-3"><span className="text-xs px-2 py-1 bg-earth-500/10 text-earth-500 rounded-full font-body font-medium">{com.style}</span></td>
                            <td className="px-4 py-3 text-sm text-warm-gray-600 font-body">{com.budget}</td>
                            <td className="px-4 py-3"><span className={`text-xs px-2 py-1 rounded-full font-body font-medium ${statusColors[com.status]}`}>{com.status}</span></td>
                            <td className="px-4 py-3 text-sm text-warm-gray-500 font-body">{com.date}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
