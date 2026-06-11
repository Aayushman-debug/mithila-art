import { useState } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { IoCheckmarkCircle, IoAlertCircle } from 'react-icons/io5';
import { authAPI } from '../api';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { validateEmail } from '../utils/helpers';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [resetUrl, setResetUrl] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setResetUrl(null);

    if (!email) {
      setError('Please enter your email');
      return;
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);
    try {
      console.log('Sending forgot password request for:', email);
      const res = await authAPI.forgotPassword(email);
      const data = res.data;
      
      if (data.success) {
        setMessage('If that email exists in our system, a reset link has been sent to it. Please check your email and follow the link to reset your password.');
        // For dev/testing, show the reset URL if available
        if (data.resetUrl) {
          setResetUrl(data.resetUrl);
        }
        // Clear email for UX
        setEmail('');
      } else {
        setError(data.message || 'Could not process request');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Request failed';
      console.error('Forgot password error:', errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner fullScreen text="Processing..." />;

  return (
    <div className="min-h-screen bg-cream-50 dark:bg-warm-gray-900 pt-32 pb-12 px-4">
      <Helmet>
        <title>Forgot Password - Lalita Pathak Mithila Art Studio</title>
      </Helmet>

      <div className="max-w-md mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <h1 className="font-display text-3xl font-bold text-earth-700 dark:text-cream-200 mb-2">Forgot Password</h1>
          <p className="text-warm-gray-600 dark:text-warm-gray-300">Enter your email to receive a password reset link.</p>
        </motion.div>

        <motion.div className="bg-white/50 dark:bg-warm-gray-800/50 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-warm-gray-700/20 shadow-glass p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-earth-700 dark:text-cream-200 mb-2">Email Address</label>
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                placeholder="your@email.com" 
                disabled={!!message}
                className="w-full px-4 py-3 rounded-xl border border-cream-200 dark:border-warm-gray-600 bg-cream-50/50 dark:bg-warm-gray-700/50 text-warm-gray-900 dark:text-cream-100 placeholder-warm-gray-400 dark:placeholder-warm-gray-500 focus:outline-none focus:ring-2 focus:ring-earth-500 disabled:opacity-60 disabled:cursor-not-allowed transition-all" 
              />
            </div>

            {error && (
              <div className="flex items-start gap-3 p-4 rounded-xl bg-mithila-red/10 border border-mithila-red/30">
                <IoAlertCircle className="text-mithila-red flex-shrink-0 mt-0.5" size={20} />
                <p className="text-mithila-red text-sm">{error}</p>
              </div>
            )}

            {message && (
              <div className="flex items-start gap-3 p-4 rounded-xl bg-mithila-green/10 border border-mithila-green/30">
                <IoCheckmarkCircle className="text-mithila-green flex-shrink-0 mt-0.5" size={20} />
                <p className="text-mithila-green text-sm">{message}</p>
              </div>
            )}

            <button 
              type="submit" 
              disabled={loading || !!message}
              className="w-full py-3 rounded-xl bg-gradient-gold text-white font-medium hover:shadow-lg transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Send Reset Link
            </button>

            {resetUrl && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700"
              >
                <p className="text-xs font-medium text-amber-900 dark:text-amber-200 mb-2">🧪 DEV: Test Reset Link</p>
                <a 
                  className="text-earth-500 dark:text-earth-300 break-all text-xs hover:underline" 
                  href={resetUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {resetUrl}
                </a>
              </motion.div>
            )}

            <div className="text-center">
              <a href="/login" className="text-sm text-earth-500 hover:text-earth-700 dark:text-earth-300 dark:hover:text-earth-200">
                Back to login
              </a>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
