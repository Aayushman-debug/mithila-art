import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { IoEye, IoEyeOff, IoAlertCircle, IoCheckmarkCircle } from 'react-icons/io5';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { useToast } from '../context/ToastContext';
import { validateEmail, validateIndianPhone } from '../utils/helpers';
import SocialLoginButtons from '../components/auth/SocialLoginButtons';

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const slideUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } },
};


export default function SignupPage() {
  const navigate = useNavigate();
  const { register, loading } = useAuth();
  const showToast = useToast();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState({});
  const [globalError, setGlobalError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
    setGlobalError('');
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required';
    }

    if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!validateIndianPhone(formData.phone)) {
      newErrors.phone = 'Please enter a valid 10-digit Indian mobile number';
    }

    if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGlobalError('');
    setSuccess('');

    if (!validateForm()) {
      return;
    }

    const result = await register(
      formData.name,
      formData.email,
      formData.phone,
      formData.password,
      formData.confirmPassword
    );

    if (result.success) {
      if (result.requiresVerification) {
        if (result.emailSent === false) {
          setSuccess('Account created. Could not send verification email. Please resend.');
          showToast('Could not send verification email. Use resend.', 'error');
        } else {
          setSuccess('Account created. Please check your email to verify your account.');
          showToast('Verification email sent. Check your inbox.', 'success');
        }
      } else {
        showToast('Account created. Welcome!', 'success');
        navigate('/profile');
      }
    } else {
      setGlobalError(result.error || 'Registration failed');
      showToast(result.error || 'Registration failed', 'error');
    }
  };

  // Don't show a fullscreen spinner — let the form stay visible
  // The submit button will show its own loading state

  return (
    <>
      <Helmet>
        <title>Sign Up - Lalita Pathak Mithila Art Studio</title>
        <meta name="description" content="Create your account" />
      </Helmet>

      <div className="min-h-screen bg-cream-50 dark:bg-warm-gray-900 pt-32 pb-12 px-4">
        <div className="max-w-lg mx-auto">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={slideUp}
            className="text-center mb-8"
          >
            <h1 className="font-display text-4xl font-bold text-earth-700 dark:text-cream-200 mb-2">
              Join Our Studio
            </h1>
            <p className="text-warm-gray-600 dark:text-warm-gray-300">
              Create your account to explore and commission artwork
            </p>
          </motion.div>

          {/* Glass Card */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            className="bg-white/50 dark:bg-warm-gray-800/50 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-warm-gray-700/20 shadow-glass p-8 mb-6"
          >
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Full Name */}
              <motion.div variants={fadeIn} className="space-y-2">
                <label className="block text-sm font-medium text-earth-700 dark:text-cream-200">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your full name"
                  className={`w-full px-4 py-3 rounded-xl border bg-cream-50/50 dark:bg-warm-gray-700/50 text-warm-gray-900 dark:text-cream-100 placeholder-warm-gray-400 dark:placeholder-warm-gray-500 focus:outline-none focus:ring-2 focus:ring-earth-500 transition-all ${
                    errors.name
                      ? 'border-mithila-red/50'
                      : 'border-cream-200 dark:border-warm-gray-600'
                  }`}
                />
                {errors.name && (
                  <p className="text-mithila-red text-xs flex items-center gap-1">
                    <IoAlertCircle size={14} /> {errors.name}
                  </p>
                )}
              </motion.div>

              {/* Email */}
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
                  className={`w-full px-4 py-3 rounded-xl border bg-cream-50/50 dark:bg-warm-gray-700/50 text-warm-gray-900 dark:text-cream-100 placeholder-warm-gray-400 dark:placeholder-warm-gray-500 focus:outline-none focus:ring-2 focus:ring-earth-500 transition-all ${
                    errors.email
                      ? 'border-mithila-red/50'
                      : 'border-cream-200 dark:border-warm-gray-600'
                  }`}
                />
                {errors.email && (
                  <p className="text-mithila-red text-xs flex items-center gap-1">
                    <IoAlertCircle size={14} /> {errors.email}
                  </p>
                )}
              </motion.div>

              {/* Phone */}
              <motion.div variants={fadeIn} className="space-y-2">
                <label className="block text-sm font-medium text-earth-700 dark:text-cream-200">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="9876543210"
                  inputMode="numeric"
                  autoComplete="off"
                  pattern="[6-9][0-9]{9}"
                  className={`w-full px-4 py-3 rounded-xl border bg-cream-50/50 dark:bg-warm-gray-700/50 text-warm-gray-900 dark:text-cream-100 placeholder-warm-gray-400 dark:placeholder-warm-gray-500 focus:outline-none focus:ring-2 focus:ring-earth-500 transition-all ${
                    errors.phone
                      ? 'border-mithila-red/50'
                      : 'border-cream-200 dark:border-warm-gray-600'
                  }`}
                />
                {errors.phone && (
                  <p className="text-mithila-red text-xs flex items-center gap-1">
                    <IoAlertCircle size={14} /> {errors.phone}
                  </p>
                )}
              </motion.div>

              {/* Password */}
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
                    placeholder="Minimum 8 characters"
                    className={`w-full px-4 py-3 pr-12 rounded-xl border bg-cream-50/50 dark:bg-warm-gray-700/50 text-warm-gray-900 dark:text-cream-100 placeholder-warm-gray-400 dark:placeholder-warm-gray-500 focus:outline-none focus:ring-2 focus:ring-earth-500 transition-all ${
                      errors.password
                        ? 'border-mithila-red/50'
                        : 'border-cream-200 dark:border-warm-gray-600'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-warm-gray-400 hover:text-earth-500 transition-colors"
                  >
                    {showPassword ? <IoEyeOff size={20} /> : <IoEye size={20} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-mithila-red text-xs flex items-center gap-1">
                    <IoAlertCircle size={14} /> {errors.password}
                  </p>
                )}
              </motion.div>

              {/* Confirm Password */}
              <motion.div variants={fadeIn} className="space-y-2">
                <label className="block text-sm font-medium text-earth-700 dark:text-cream-200">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Re-enter your password"
                    className={`w-full px-4 py-3 pr-12 rounded-xl border bg-cream-50/50 dark:bg-warm-gray-700/50 text-warm-gray-900 dark:text-cream-100 placeholder-warm-gray-400 dark:placeholder-warm-gray-500 focus:outline-none focus:ring-2 focus:ring-earth-500 transition-all ${
                      errors.confirmPassword
                        ? 'border-mithila-red/50'
                        : 'border-cream-200 dark:border-warm-gray-600'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-warm-gray-400 hover:text-earth-500 transition-colors"
                  >
                    {showConfirm ? <IoEyeOff size={20} /> : <IoEye size={20} />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-mithila-red text-xs flex items-center gap-1">
                    <IoAlertCircle size={14} /> {errors.confirmPassword}
                  </p>
                )}
              </motion.div>

              {/* Global Error */}
              {globalError && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-3 p-4 rounded-xl bg-mithila-red/10 border border-mithila-red/30"
                >
                  <IoAlertCircle className="text-mithila-red flex-shrink-0" size={20} />
                  <p className="text-mithila-red text-sm">{globalError}</p>
                </motion.div>
              )}

              {/* Success */}
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
                {loading ? 'Creating account...' : 'Create Account'}
              </motion.button>
            </form>

            <SocialLoginButtons onError={(msg) => {
              setGlobalError(msg);
              showToast(msg, 'error');
            }} />
          </motion.div>

          {/* Login Link */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center text-warm-gray-600 dark:text-warm-gray-300"
          >
            Already have an account?{' '}
            <Link
              to="/login"
              className="text-earth-500 hover:text-earth-600 font-medium transition-colors"
            >
              Sign in here
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
