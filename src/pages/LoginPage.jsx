import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { IoEye, IoEyeOff, IoAlertCircle, IoCheckmarkCircle } from 'react-icons/io5';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../api';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { useToast } from '../context/ToastContext';
import { validateEmail } from '../utils/helpers';

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const slideUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } },
};

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, loading } = useAuth();
  const showToast = useToast();

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(location.state?.message || '');
  const [resendMsg, setResendMsg] = useState('');
  const [resendLoading, setResendLoading] = useState(false);

  // Check URL query parameters for verification redirects
  useState(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('verified') === 'true') {
      setSuccess('Email successfully verified! You can now log in.');
    } else if (params.get('verified') === 'false') {
      setError('Verification link is invalid or has expired. Please log in and request a new link.');
    }
  });


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    if (!validateEmail(formData.email)) {
      setError('Enter a valid email address');
      return;
    }

    const result = await login(formData.email, formData.password, rememberMe);

    if (result.success) {
      setSuccess('Login successful! Redirecting...');
      showToast('Logged in successfully', 'success');
      setTimeout(() => {
        const from = location.state?.from?.pathname || '/profile';
        navigate(from);
      }, 1000);
    } else {
      setError(result.error || 'Login failed');
      showToast(result.error || 'Login failed', 'error');
    }
  };

  const handleResend = async () => {
    setResendMsg('');
    setResendLoading(true);
    try {
      const res = await authAPI.resendVerification(formData.email);
      if (res.data && res.data.success) {
        setResendMsg('Verification email resent. Check your inbox.');
        showToast('Verification email resent. Check your inbox.', 'success');
      } else {
        setResendMsg(res.data?.message || 'Could not resend verification');
        showToast(res.data?.message || 'Could not resend verification', 'error');
      }
    } catch (err) {
      setResendMsg(err.response?.data?.message || err.message || 'Could not resend verification');
      showToast(err.response?.data?.message || err.message || 'Could not resend verification', 'error');
    } finally {
      setResendLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner fullScreen text="Authenticating..." />;
  }

  return (
    <>
      <Helmet>
        <title>Login - Lalita Pathak Mithila Art Studio</title>
        <meta name="description" content="Login to your account" />
      </Helmet>

      <div className="min-h-screen bg-cream-50 dark:bg-warm-gray-900 pt-32 pb-12 px-4">
        <div className="max-w-md mx-auto">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={slideUp}
            className="text-center mb-8"
          >
            <h1 className="font-display text-4xl font-bold text-earth-700 dark:text-cream-200 mb-2">
              Welcome Back
            </h1>
            <p className="text-warm-gray-600 dark:text-warm-gray-300">
              Enter your details to access your profile
            </p>
          </motion.div>

          {/* Glass Card */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            className="bg-white/50 dark:bg-warm-gray-800/50 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-warm-gray-700/20 shadow-glass p-8 mb-6"
          >
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email Field */}
              <motion.div variants={fadeIn} className="space-y-2">
                <label className="block text-sm font-medium text-earth-700 dark:text-cream-200">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your@email.com"
                  className="w-full px-4 py-3 rounded-xl border border-cream-200 dark:border-warm-gray-600 bg-cream-50/50 dark:bg-warm-gray-700/50 text-warm-gray-900 dark:text-cream-100 placeholder-warm-gray-400 dark:placeholder-warm-gray-500 focus:outline-none focus:ring-2 focus:ring-earth-500 focus:border-transparent transition-all"
                />
              </motion.div>

              {/* Password Field */}
              <motion.div variants={fadeIn} className="space-y-2">
                <label className="block text-sm font-medium text-earth-700 dark:text-cream-200">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 pr-12 rounded-xl border border-cream-200 dark:border-warm-gray-600 bg-cream-50/50 dark:bg-warm-gray-700/50 text-warm-gray-900 dark:text-cream-100 placeholder-warm-gray-400 dark:placeholder-warm-gray-500 focus:outline-none focus:ring-2 focus:ring-earth-500 focus:border-transparent transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-warm-gray-400 hover:text-earth-500 transition-colors"
                  >
                    {showPassword ? <IoEyeOff size={20} /> : <IoEye size={20} />}
                  </button>
                </div>
              </motion.div>

              {/* Remember Me & Forgot Password */}
              <motion.div
                variants={fadeIn}
                className="flex items-center justify-between text-sm"
              >
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-cream-200 dark:border-warm-gray-600 text-earth-500 focus:ring-earth-500"
                  />
                  <span className="text-warm-gray-600 dark:text-warm-gray-300">Remember me</span>
                </label>
                <Link
                  to="/forgot-password"
                  className="text-earth-500 hover:text-earth-600 transition-colors"
                >
                  Forgot password?
                </Link>
              </motion.div>

              {/* Error Message */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-3 p-4 rounded-xl bg-mithila-red/10 border border-mithila-red/30"
                >
                  <IoAlertCircle className="text-mithila-red flex-shrink-0" size={20} />
                  <p className="text-mithila-red text-sm">{error}</p>
                </motion.div>
              )}
              {/* TEMPORARILY DISABLED FOR SMTP DEBUGGING */}
              {/* {error && error.toLowerCase().includes('verify') && (
                <div className="mt-2 flex items-center gap-2">
                  <button onClick={handleResend} disabled={resendLoading} className="text-earth-500 hover:text-earth-600 font-medium">
                    {resendLoading ? 'Resending...' : 'Resend verification email'}
                  </button>
                  {resendMsg && <p className="text-sm text-warm-gray-600">{resendMsg}</p>}
                </div>
              )} */}

              {/* Success Message */}
              {success && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-3 p-4 rounded-xl bg-mithila-green/10 border border-mithila-green/30"
                >
                  <IoCheckmarkCircle className="text-mithila-green flex-shrink-0" size={20} />
                  <p className="text-mithila-green text-sm">{success}</p>
                </motion.div>
              )}

              {/* Submit Button */}
              <motion.button
                variants={fadeIn}
                type="submit"
                disabled={loading}
                className="w-full py-3 px-6 rounded-xl bg-gradient-gold text-white font-medium hover:shadow-gold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed mt-6"
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </motion.button>
            </form>
          </motion.div>

          {/* Sign Up Link */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center text-warm-gray-600 dark:text-warm-gray-300"
          >
            Don't have an account?{' '}
            <Link
              to="/signup"
              className="text-earth-500 hover:text-earth-600 font-medium transition-colors"
            >
              Create one now
            </Link>
          </motion.p>

          {/* Decorative Elements */}
          <div className="fixed -z-10 top-20 right-10 w-72 h-72 bg-earth-500/5 rounded-full blur-3xl"></div>
          <div className="fixed -z-10 bottom-20 left-10 w-72 h-72 bg-cream-500/5 rounded-full blur-3xl"></div>
        </div>
      </div>
    </>
  );
}
