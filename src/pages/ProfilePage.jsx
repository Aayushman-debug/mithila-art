import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { IoLogOut, IoCreate, IoCheckmarkCircle, IoAlertCircle } from 'react-icons/io5';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import GlassCard from '../components/ui/GlassCard';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
};

export default function ProfilePage() {
  const navigate = useNavigate();
  const { isAuthenticated, user, loading, logout, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ name: '', phone: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (user) {
      setEditData({
        name: user.name || '',
        phone: user.phone || '',
      });
    }
  }, [isAuthenticated, user, navigate]);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async () => {
    if (!editData.name.trim()) {
      setError('Name cannot be empty');
      return;
    }

    setIsSaving(true);
    setError('');
    setSuccess('');

    const result = await updateProfile({
      name: editData.name,
      phone: editData.phone,
    });

    setIsSaving(false);

    if (result.success) {
      setSuccess('Profile updated successfully!');
      setIsEditing(false);
      setTimeout(() => setSuccess(''), 3000);
    } else {
      setError(result.error || 'Failed to update profile');
    }
  };

  if (loading) {
    return <LoadingSpinner fullScreen text="Loading profile..." />;
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <>
      <Helmet>
        <title>My Profile - Lalita Pathak Mithila Art Studio</title>
        <meta name="description" content="Your profile and commissions" />
      </Helmet>

      <div className="min-h-screen bg-cream-50 dark:bg-warm-gray-900 pt-32 pb-20 px-4">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="font-display text-4xl font-bold text-earth-700 dark:text-cream-200 mb-2">
              My Profile
            </h1>
            <p className="text-warm-gray-600 dark:text-warm-gray-300">
              Manage your account and view your commissions
            </p>
          </motion.div>

          {/* Error & Success Messages */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 flex items-center gap-3 p-4 rounded-xl bg-mithila-red/10 border border-mithila-red/30"
            >
              <IoAlertCircle className="text-mithila-red flex-shrink-0" size={20} />
              <p className="text-mithila-red">{error}</p>
            </motion.div>
          )}

          {success && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 flex items-center gap-3 p-4 rounded-xl bg-mithila-green/10 border border-mithila-green/30"
            >
              <IoCheckmarkCircle className="text-mithila-green flex-shrink-0" size={20} />
              <p className="text-mithila-green">{success}</p>
            </motion.div>
          )}

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            {/* Profile Card */}
            <motion.div
              variants={fadeUp}
              className="bg-white/50 dark:bg-warm-gray-800/50 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-warm-gray-700/20 shadow-glass p-8"
            >
              <div className="flex items-start justify-between mb-6">
                <h2 className="font-display text-2xl font-bold text-earth-700 dark:text-cream-200">
                  Account Information
                </h2>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-earth-500/10 hover:bg-earth-500/20 text-earth-500 transition-colors"
                >
                  <IoCreate size={18} />
                  {isEditing ? 'Cancel' : 'Edit'}
                </button>
              </div>

              {isEditing ? (
                // Edit Mode
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-earth-700 dark:text-cream-200">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={editData.name}
                      onChange={handleEditChange}
                      className="w-full px-4 py-3 rounded-xl border border-cream-200 dark:border-warm-gray-600 bg-cream-50/50 dark:bg-warm-gray-700/50 text-warm-gray-900 dark:text-cream-100 focus:outline-none focus:ring-2 focus:ring-earth-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-earth-700 dark:text-cream-200">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={editData.phone}
                      onChange={handleEditChange}
                      className="w-full px-4 py-3 rounded-xl border border-cream-200 dark:border-warm-gray-600 bg-cream-50/50 dark:bg-warm-gray-700/50 text-warm-gray-900 dark:text-cream-100 focus:outline-none focus:ring-2 focus:ring-earth-500"
                    />
                  </div>

                  <button
                    onClick={handleSaveProfile}
                    disabled={isSaving}
                    className="w-full py-3 px-6 rounded-xl bg-gradient-gold text-white font-medium hover:shadow-gold transition-all disabled:opacity-50 mt-4"
                  >
                    {isSaving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              ) : (
                // View Mode
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-warm-gray-600 dark:text-warm-gray-400 mb-1">
                      Full Name
                    </p>
                    <p className="text-lg font-semibold text-warm-gray-900 dark:text-cream-100">
                      {user.name}
                    </p>
                  </div>

                  <div className="h-px bg-gradient-to-r from-earth-500/20 to-transparent"></div>

                  <div>
                    <p className="text-sm text-warm-gray-600 dark:text-warm-gray-400 mb-1">
                      Email Address
                    </p>
                    <p className="text-lg font-semibold text-warm-gray-900 dark:text-cream-100">
                      {user.email}
                    </p>
                  </div>

                  <div className="h-px bg-gradient-to-r from-earth-500/20 to-transparent"></div>

                  <div>
                    <p className="text-sm text-warm-gray-600 dark:text-warm-gray-400 mb-1">
                      Phone Number
                    </p>
                    <p className="text-lg font-semibold text-warm-gray-900 dark:text-cream-100">
                      {user.phone || 'Not provided'}
                    </p>
                  </div>

                  <div className="h-px bg-gradient-to-r from-earth-500/20 to-transparent"></div>

                  <div>
                    <p className="text-sm text-warm-gray-600 dark:text-warm-gray-400 mb-1">
                      Member Since
                    </p>
                    <p className="text-lg font-semibold text-warm-gray-900 dark:text-cream-100">
                      {new Date(user.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                </div>
              )}
            </motion.div>

            {/* Commission History Card */}
            <motion.div
              variants={fadeUp}
              className="bg-white/50 dark:bg-warm-gray-800/50 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-warm-gray-700/20 shadow-glass p-8"
            >
              <h2 className="font-display text-2xl font-bold text-earth-700 dark:text-cream-200 mb-6">
                Commission Requests
              </h2>
              <div className="text-center py-12">
                <p className="text-warm-gray-600 dark:text-warm-gray-300 mb-4">
                  {user?.commissions?.length > 0
                    ? `You have ${user.commissions.length} commission request${user.commissions.length > 1 ? 's' : ''}.`
                    : 'No commission requests yet.'}
                </p>
                <p className="text-sm text-warm-gray-500 dark:text-warm-gray-400 mb-6">
                  {user?.commissions?.length > 0
                    ? 'Track your commissioning progress and approvals in one place.'
                    : 'Start by creating a custom commission request.'}
                </p>
                <button
                  onClick={() => navigate('/commission-tracking')}
                  className="px-6 py-3 rounded-xl bg-gradient-gold text-white font-medium hover:shadow-gold transition-all"
                >
                  {user?.commissions?.length > 0 ? 'Track Commissions' : 'Create Commission'}
                </button>
              </div>
            </motion.div>

            {/* Order History Card */}
            <motion.div
              variants={fadeUp}
              className="bg-white/50 dark:bg-warm-gray-800/50 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-warm-gray-700/20 shadow-glass p-8"
            >
              <h2 className="font-display text-2xl font-bold text-earth-700 dark:text-cream-200 mb-6">
                Order History
              </h2>
              <div className="text-center py-12">
                <p className="text-warm-gray-600 dark:text-warm-gray-300 mb-4">
                  {user?.orders?.length > 0
                    ? `You have ${user.orders.length} completed order${user.orders.length > 1 ? 's' : ''}.`
                    : 'No orders yet.'}
                </p>
                <p className="text-sm text-warm-gray-500 dark:text-warm-gray-400 mb-6">
                  {user?.orders?.length > 0
                    ? 'Review your order history and payment status.'
                    : 'Browse our gallery and shop to make your first purchase.'}
                </p>
                <button
                  onClick={() => navigate(user?.orders?.length > 0 ? '/orders' : '/shop')}
                  className="px-6 py-3 rounded-xl bg-gradient-gold text-white font-medium hover:shadow-gold transition-all"
                >
                  {user?.orders?.length > 0 ? 'View Orders' : 'Explore Shop'}
                </button>
              </div>
            </motion.div>

            {/* Logout Button */}
            <motion.button
              variants={fadeUp}
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-mithila-red/10 hover:bg-mithila-red/20 text-mithila-red font-medium transition-colors"
            >
              <IoLogOut size={20} />
              Sign Out
            </motion.button>
          </motion.div>
        </div>
      </div>
    </>
  );
}
