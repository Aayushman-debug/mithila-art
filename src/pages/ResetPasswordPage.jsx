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
  const [passwordStrength, setPasswordStrength] = useState(0);

  // Simple password strength indicator
  const checkPasswordStrength = (pwd) => {
    let strength = 0;
    if (pwd.length >= 8) strength++;
    if (/[A-Z]/.test(pwd)) strength++;
    if (/[0-9]/.test(pwd)) strength++;
    if (/[^A-Za-z0-9]/.test(pwd)) strength++;
    setPasswordStrength(strength);
  };

  const handlePasswordChange = (e) => {
    const pwd = e.target.value;
    setPassword(pwd);
    checkPasswordStrength(pwd);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    // Validation
    if (!password || !confirmPassword) {
      setError('Please fill both password fields');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!token) {
      setError('Invalid reset link - token missing');
      return;
    }

    setLoading(true);
    try {
      const res = await authAPI.resetPassword(token, password, confirmPassword);
      const data = res.data;
      
      if (data.success) {
        setMessage('Password reset successful! Redirecting to login...');
        setTimeout(() => navigate('/login'), 2000);
      } else {
        // Handle specific error messages from backend
        if (data.message.includes('expired')) {
          setError('This reset link has expired. Please request a new password reset.');
        } else if (data.message.includes('Invalid')) {
          setError('This reset link is invalid. Please request a new password reset.');
        } else {
          setError(data.message || 'Could not reset password');
        }
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Request failed';
      
      // Provide more specific error feedback
      if (errorMessage.includes('expired')) {
        setError('This reset link has expired. Please request a new password reset.');
      } else if (errorMessage.includes('Invalid')) {
        setError('This reset link is invalid. Please request a new password reset.');
      } else {
        setError(errorMessage);
      }
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
              <label className="block text-sm font-medium text-earth-700 dark:text-cream-200 mb-2">New Password</label>
              <input 
                type="password" 
                value={password} 
                onChange={handlePasswordChange}
                placeholder="New password (min 8 characters)" 
                className="w-full px-4 py-3 rounded-xl border border-cream-200 dark:border-warm-gray-600 bg-cream-50/50 dark:bg-warm-gray-700/50 text-warm-gray-900 dark:text-cream-100 placeholder-warm-gray-400 dark:placeholder-warm-gray-500 focus:outline-none focus:ring-2 focus:ring-earth-500 transition-all" 
              />
              {password && (
                <div className="mt-2 flex gap-1">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className={`h-1 flex-1 rounded-full ${i <= passwordStrength ? 'bg-earth-500' : 'bg-cream-200 dark:bg-warm-gray-700'}`}
                    />
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-earth-700 dark:text-cream-200 mb-2">Confirm Password</label>
              <input 
                type="password" 
                value={confirmPassword} 
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm password" 
                className="w-full px-4 py-3 rounded-xl border border-cream-200 dark:border-warm-gray-600 bg-cream-50/50 dark:bg-warm-gray-700/50 text-warm-gray-900 dark:text-cream-100 placeholder-warm-gray-400 dark:placeholder-warm-gray-500 focus:outline-none focus:ring-2 focus:ring-earth-500 transition-all" 
              />
            </div>

            {error && (
              <div className="flex items-center gap-3 p-4 rounded-xl bg-mithila-red/10 border border-mithila-red/30">
                <IoAlertCircle className="text-mithila-red flex-shrink-0" size={20} />
                <p className="text-mithila-red text-sm">{error}</p>
              </div>
            )}

            {message && (
              <div className="flex items-center gap-3 p-4 rounded-xl bg-mithila-green/10 border border-mithila-green/30">
                <IoCheckmarkCircle className="text-mithila-green flex-shrink-0" size={20} />
                <p className="text-mithila-green text-sm">{message}</p>
              </div>
            )}

            <button 
              type="submit" 
              disabled={loading || !password || !confirmPassword}
              className="w-full py-3 rounded-xl bg-gradient-gold text-white font-medium hover:shadow-lg transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Reset Password
            </button>

            <div className="text-center">
              <a href="/login" className="text-sm text-earth-500 hover:text-earth-700">
                Back to login
              </a>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
