import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { IoCheckmarkCircle, IoAlertCircle } from 'react-icons/io5';
import { authAPI } from '../api';
import LoadingSpinner from '../components/ui/LoadingSpinner';

export default function ResetPasswordPage() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!password || !confirmPassword) {
      setError('Please fill both password fields');
      return;
    }

    setLoading(true);
    try {
      const res = await authAPI.resetPassword(token, password, confirmPassword);
      const data = res.data;
      if (data.success) {
        setMessage('Password reset successful. Redirecting to login...');
        setTimeout(() => navigate('/login'), 2000);
      } else {
        setError(data.message || 'Could not reset password');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Request failed');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner fullScreen text="Resetting password..." />;

  return (
    <div className="min-h-screen bg-cream-50 dark:bg-warm-gray-900 pt-32 pb-12 px-4">
      <Helmet>
        <title>Reset Password - Lalita Pathak Mithila Art Studio</title>
      </Helmet>

      <div className="max-w-md mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <h1 className="font-display text-3xl font-bold text-earth-700 dark:text-cream-200 mb-2">Reset Password</h1>
          <p className="text-warm-gray-600 dark:text-warm-gray-300">Set a new password for your account.</p>
        </motion.div>

        <motion.div className="bg-white/50 dark:bg-warm-gray-800/50 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-warm-gray-700/20 shadow-glass p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-earth-700 dark:text-cream-200">New Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="New password" className="w-full px-4 py-3 rounded-xl border border-cream-200 bg-cream-50/50 text-warm-gray-900 focus:outline-none focus:ring-2 focus:ring-earth-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-earth-700 dark:text-cream-200">Confirm Password</label>
              <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm password" className="w-full px-4 py-3 rounded-xl border border-cream-200 bg-cream-50/50 text-warm-gray-900 focus:outline-none focus:ring-2 focus:ring-earth-500" />
            </div>

            {error && (
              <div className="flex items-center gap-3 p-4 rounded-xl bg-mithila-red/10 border border-mithila-red/30">
                <IoAlertCircle className="text-mithila-red" size={20} />
                <p className="text-mithila-red">{error}</p>
              </div>
            )}

            {message && (
              <div className="flex items-center gap-3 p-4 rounded-xl bg-mithila-green/10 border border-mithila-green/30">
                <IoCheckmarkCircle className="text-mithila-green" size={20} />
                <p className="text-mithila-green">{message}</p>
              </div>
            )}

            <button type="submit" className="w-full py-3 rounded-xl bg-gradient-gold text-white font-medium">Set New Password</button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
