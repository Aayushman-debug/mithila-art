import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { IoCheckmarkCircle, IoArrowForwardOutline, IoArrowBackOutline, IoTimeOutline } from 'react-icons/io5';
import SectionHeading from '../components/ui/SectionHeading';
import { commissionAPI } from '../api';
import { useAuth } from '../context/AuthContext';
import { categories, paintings } from '../data/paintings';
import { useToast } from '../context/ToastContext';
import { validateEmail, validateIndianPhone } from '../utils/helpers';

const steps = ['Your Details', 'Artwork Preferences', 'Review & Submit'];

const budgetRanges = [
  '₹2,000 - ₹5,000',
  '₹5,000 - ₹10,000',
  '₹10,000 - ₹25,000',
  '₹25,000 - ₹50,000',
  '₹50,000+',
];

const sizeOptions = ['12×16 inches', '18×24 inches', '24×36 inches', '30×40 inches', '36×48 inches', 'Custom Size'];

export default function CommissionPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [submittedData, setSubmittedData] = useState(null);
  const [commissionId, setCommissionId] = useState(null);
  const [commissionStatus, setCommissionStatus] = useState(null);

  const { isAuthenticated, user } = useAuth();
  const showToast = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const paintingId = searchParams.get('painting');
  const paintingTitle = searchParams.get('title');

  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', location: '',
    style: '', size: '', colors: '', description: '', budget: '', timeline: '',
  });
  const [errors, setErrors] = useState({});
  const [submissionError, setSubmissionError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Poll for commission status updates every 5 seconds
  useEffect(() => {
    if (!commissionId) return;

    const checkStatus = async () => {
      try {
        const response = await commissionAPI.getCommission(commissionId);
        const data = response.data;
        if (data.success) {
          setCommissionStatus(data.commission);
        }
      } catch (error) {
        console.error('Status check error:', error);
      }
    };

    const interval = setInterval(checkStatus, 5000);
    return () => clearInterval(interval);
  }, [commissionId]);

  // Prefill from authenticated user
  useEffect(() => {
    if (isAuthenticated && user) {
      setFormData((prev) => ({
        ...prev,
        name: user.name || prev.name,
        email: user.email || prev.email,
        phone: user.phone || prev.phone,
      }));
    }
  }, [isAuthenticated, user]);

  // Prefill search params if any
  useEffect(() => {
    if (paintingId && paintingTitle) {
      const paintingObj = paintings.find(p => p.id === paintingId);
      const styleName = paintingObj 
        ? (categories.find(c => c.id === paintingObj.category)?.name || '') 
        : '';
      
      setFormData(prev => ({
        ...prev,
        style: styleName || prev.style,
        description: `I am interested in commissioning a custom artwork inspired by the painting "${paintingTitle}" (ID: ${paintingId}).\n\n` + prev.description,
      }));
    }
  }, [paintingId, paintingTitle]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: '' });
  };

  const validateStep = (step) => {
    const newErrors = {};
    if (step === 0) {
      if (!formData.name.trim()) newErrors.name = 'Name is required';
      if (!formData.email.trim()) newErrors.email = 'Email is required';
      else if (!validateEmail(formData.email)) newErrors.email = 'Enter a valid email address';
      if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
      else if (!validateIndianPhone(formData.phone)) newErrors.phone = 'Enter a valid 10-digit Indian mobile number';
    }
    if (step === 1) {
      if (!formData.style) newErrors.style = 'Please select a style';
      if (!formData.description.trim()) newErrors.description = 'Please describe your vision';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) setCurrentStep((s) => Math.min(s + 1, 2));
  };

  const prevStep = () => setCurrentStep((s) => Math.max(s - 1, 0));

  const handleSubmit = async () => {
    setSubmissionError('');
    // Prevent double submissions
    if (submitting || commissionId) return;
    setSubmitting(true);
    try {
      const response = await commissionAPI.submitCommission(formData);
      const data = response.data;
      if (data.success) {
        setSubmittedData(formData);
        setCommissionId(data.commissionId);
        showToast('Commission submitted successfully', 'success');
      } else {
        setSubmissionError(data.message || data.error || 'Submission failed');
        showToast(data.message || data.error || 'Submission failed', 'error');
      }
    } catch (error) {
      console.error('Commission submit error:', error);
      const msg = error.response?.data?.message || error.response?.data?.error || error.message || 'Submission failed';
      setSubmissionError(msg);
      showToast(msg, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const inputClasses = "w-full px-4 py-3 bg-cream-50/50 dark:bg-warm-gray-700/50 border border-cream-200 dark:border-warm-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-earth-500/30 focus:border-earth-500 text-warm-gray-900 dark:text-cream-100 placeholder-warm-gray-400 dark:placeholder-warm-gray-500 font-body transition-all";

  // After submission - waiting for admin approval
  if (submittedData && (!commissionStatus || commissionStatus.status === "submitted")) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-cream-50 dark:bg-warm-gray-900 pt-24">
        <Helmet><title>Commission Submitted — Lalita Pathak Mithila Art</title></Helmet>
        <div className="container-custom section-padding text-center max-w-2xl mx-auto">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200 }}>
            <IoTimeOutline className="text-earth-500 mx-auto mb-6" size={80} />
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="heading-lg text-warm-gray-900 dark:text-cream-100 mb-4">
            Commission Request Received! 🎨
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="text-body max-w-lg mx-auto mb-8">
            Thank you, {submittedData.name}! Your commission request has been received and is under review by Lalita Pathak.
          </motion.p>
          
          <div className="bg-white/95 dark:bg-warm-gray-800/95 rounded-2xl p-6 mb-8 border border-cream-200 dark:border-warm-gray-700">
            <p className="text-earth-500 font-display font-bold text-lg mb-2">Reference: #{commissionStatus?.referenceId || 'Loading...'}</p>
            <p className="text-warm-gray-600 font-body text-sm mb-4">We'll review your vision and send you a detailed quote and timeline within 2-3 business days.</p>
            
            <div className="flex items-center justify-center gap-2 text-earth-500">
              <div className="w-2 h-2 bg-earth-500 rounded-full animate-pulse"></div>
              <span className="text-sm">Waiting for approval and quote...</span>
            </div>
          </div>

          <p className="text-warm-gray-500 font-body text-xs">
            Check your email ({submittedData.email}) for updates
          </p>
        </div>
      </motion.div>
    );
  }

  // After approval - ready for payment
  if (submittedData && commissionStatus?.status === "approved") {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-cream-50 dark:bg-warm-gray-900 pt-24">
        <Helmet><title>Payment — Lalita Pathak Mithila Art</title></Helmet>
        <div className="container-custom section-padding text-center max-w-2xl mx-auto">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200 }}>
            <IoCheckmarkCircle className="text-mithila-green mx-auto mb-6" size={80} />
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="heading-lg text-warm-gray-900 dark:text-cream-100 mb-4">
            Commission Approved! 🎉
          </motion.h1>
          
          <div className="bg-gradient-to-br from-earth-50 to-cream-50 dark:from-warm-gray-800 dark:to-warm-gray-900 rounded-2xl p-8 mb-8 border-2 border-earth-300 dark:border-earth-700">
            <p className="text-warm-gray-600 font-body mb-6">{commissionStatus?.approvalMessage}</p>
            
            <div className="mb-8">
              <p className="text-warm-gray-500 text-sm mb-2">Quoted Price:</p>
              <p className="text-earth-700 font-display text-4xl font-bold mb-1">₹{commissionStatus?.quotedBudget}</p>
              <p className="text-warm-gray-500 text-xs">Payment required to start work</p>
            </div>

            <a
              href={`/payment?commissionId=${commissionId}`}
              className="inline-block w-full px-6 py-3 bg-gradient-to-r from-earth-500 to-earth-600 text-white rounded-xl hover:shadow-gold transition-all font-semibold"
            >
              Proceed to Payment →
            </a>
          </div>

          <p className="text-warm-gray-500 font-body text-xs">
            Reference: #{commissionStatus?.referenceId}
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }} className="min-h-screen bg-cream-50 dark:bg-warm-gray-900 pt-24">
      <Helmet>
        <title>Commission a Painting — Lalita Pathak Mithila Art</title>
        <meta name="description" content="Commission a custom Mithila painting. Share your vision and Lalita Pathak will create a unique handcrafted masterpiece." />
      </Helmet>

      {/* Hero */}
      <div className="relative bg-warm-black py-20 overflow-hidden">
        <div className="absolute inset-0 mithila-pattern opacity-5" />
        <div className="container-custom text-center relative z-10">
          <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-earth-400 font-body text-sm tracking-[0.3em] uppercase mb-3">
            Custom Artwork
          </motion.p>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="heading-xl text-cream-50 mb-4">
            Commission a <span className="text-gradient-gold">Masterpiece</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-cream-300/80 font-body text-lg max-w-2xl mx-auto">
            Share your vision and let Lalita Pathak bring it to life with the sacred art of Mithila painting.
          </motion.p>
        </div>
      </div>

      <div className="container-custom section-padding max-w-3xl mx-auto">
        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-2 sm:gap-4 mb-12">
          {steps.map((s, i) => (
            <div key={s} className="flex items-center gap-2 sm:gap-3">
              <div className="flex flex-col items-center gap-1">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-display font-bold text-sm transition-all duration-500 ${
                  i < currentStep ? 'bg-mithila-green text-white' : i === currentStep ? 'bg-earth-500 text-white shadow-gold' : 'bg-cream-200 dark:bg-warm-gray-700 text-warm-gray-400 dark:text-warm-gray-500'
                }`}>
                  {i < currentStep ? <IoCheckmarkCircle size={20} /> : i + 1}
                </div>
                <span className={`hidden sm:block text-xs font-body ${i <= currentStep ? 'text-earth-700 dark:text-cream-200 font-semibold' : 'text-warm-gray-400 dark:text-warm-gray-500'}`}>
                  {s}
                </span>
              </div>
              {i < 2 && <div className={`w-8 sm:w-16 h-0.5 mb-4 sm:mb-0 ${i < currentStep ? 'bg-mithila-green' : 'bg-cream-200 dark:bg-warm-gray-700'}`} />}
            </div>
          ))}
        </div>

        {/* Form Steps */}
        <AnimatePresence mode="wait">
          {currentStep === 0 && (
            <motion.div key="step0" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="bg-white/90 dark:bg-warm-gray-800/90 rounded-2xl p-6 sm:p-8 shadow-card border border-cream-200/50 dark:border-warm-gray-700/50">
              {!isAuthenticated && (
                <div className="mb-6 p-4 bg-earth-50/50 dark:bg-earth-900/20 border border-earth-200/40 dark:border-earth-700/40 rounded-xl text-center">
                  <p className="text-sm text-earth-800 dark:text-cream-200 font-body">
                    Have an account?{' '}
                    <Link to="/login" className="text-earth-500 dark:text-earth-400 font-bold hover:text-earth-700 dark:hover:text-earth-300 transition-colors underline decoration-2 underline-offset-4">
                      Log in
                    </Link>{' '}
                    to save and track your custom commission requests in your dashboard.
                  </p>
                </div>
              )}
              <h2 className="heading-sm text-warm-gray-900 dark:text-cream-100 mb-6">Personal Details</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-body font-medium text-warm-gray-700 dark:text-warm-gray-300 mb-1">Full Name *</label>
                  <input type="text" name="name" value={formData.name} onChange={handleChange} className={inputClasses} placeholder="Your name" />
                  {errors.name && <p className="text-mithila-red text-xs mt-1">{errors.name}</p>}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-body font-medium text-warm-gray-700 dark:text-warm-gray-300 mb-1">Email *</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} className={inputClasses} placeholder="email@example.com" />
                    {errors.email && <p className="text-mithila-red text-xs mt-1">{errors.email}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-body font-medium text-warm-gray-700 dark:text-warm-gray-300 mb-1">Phone *</label>
                    <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className={inputClasses} placeholder="9876543210" inputMode="numeric" autoComplete="off" pattern="[6-9][0-9]{9}" />
                    {errors.phone && <p className="text-mithila-red text-xs mt-1">{errors.phone}</p>}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-body font-medium text-warm-gray-700 dark:text-warm-gray-300 mb-1">Location</label>
                  <input type="text" name="location" value={formData.location} onChange={handleChange} className={inputClasses} placeholder="City, Country" />
                </div>
              </div>
            </motion.div>
          )}

          {currentStep === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="bg-white/90 dark:bg-warm-gray-800/90 rounded-2xl p-6 sm:p-8 shadow-card border border-cream-200/50 dark:border-warm-gray-700/50">
              <h2 className="heading-sm text-warm-gray-900 dark:text-cream-100 mb-6">Artwork Preferences</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-body font-medium text-warm-gray-700 dark:text-warm-gray-300 mb-1">Painting Style *</label>
                  <select name="style" value={formData.style} onChange={handleChange} className={inputClasses}>
                    <option value="" className="dark:bg-warm-gray-800 dark:text-cream-100">Select a style...</option>
                    {categories.map((c) => <option key={c.id} value={c.name} className="dark:bg-warm-gray-800 dark:text-cream-100">{c.name}</option>)}
                  </select>
                  {errors.style && <p className="text-mithila-red text-xs mt-1">{errors.style}</p>}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-body font-medium text-warm-gray-700 dark:text-warm-gray-300 mb-1">Preferred Size</label>
                    <select name="size" value={formData.size} onChange={handleChange} className={inputClasses}>
                      <option value="" className="dark:bg-warm-gray-800 dark:text-cream-100">Select size...</option>
                      {sizeOptions.map((s) => <option key={s} value={s} className="dark:bg-warm-gray-800 dark:text-cream-100">{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-body font-medium text-warm-gray-700 dark:text-warm-gray-300 mb-1">Budget Range</label>
                    <select name="budget" value={formData.budget} onChange={handleChange} className={inputClasses}>
                      <option value="" className="dark:bg-warm-gray-800 dark:text-cream-100">Select budget...</option>
                      {budgetRanges.map((b) => <option key={b} value={b} className="dark:bg-warm-gray-800 dark:text-cream-100">{b}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-body font-medium text-warm-gray-700 dark:text-warm-gray-300 mb-1">Color Preferences</label>
                  <input type="text" name="colors" value={formData.colors} onChange={handleChange} className={inputClasses} placeholder="e.g., warm tones, traditional red and black..." />
                </div>
                <div>
                  <label className="block text-sm font-body font-medium text-warm-gray-700 dark:text-warm-gray-300 mb-1">Describe Your Vision *</label>
                  <textarea name="description" value={formData.description} onChange={handleChange} rows={4} className={`${inputClasses} resize-none`} placeholder="Tell us about the artwork you envision. Include themes, subjects, motifs, or any reference images you'd like to share..." />
                  {errors.description && <p className="text-mithila-red text-xs mt-1">{errors.description}</p>}
                </div>
              </div>
            </motion.div>
          )}

          {currentStep === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="bg-white/90 dark:bg-warm-gray-800/90 rounded-2xl p-6 sm:p-8 shadow-card border border-cream-200/50 dark:border-warm-gray-700/50">
              <h2 className="heading-sm text-warm-gray-900 dark:text-cream-100 mb-6">Review Your Request</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { label: 'Name', value: formData.name },
                    { label: 'Email', value: formData.email },
                    { label: 'Phone', value: formData.phone },
                    { label: 'Location', value: formData.location || 'Not specified' },
                    { label: 'Style', value: formData.style },
                    { label: 'Size', value: formData.size || 'Not specified' },
                    { label: 'Budget', value: formData.budget || 'Not specified' },
                    { label: 'Colors', value: formData.colors || 'Not specified' },
                  ].map((item) => (
                    <div key={item.label} className="bg-cream-50/50 dark:bg-warm-gray-700/50 p-4 rounded-xl border border-cream-200/30 dark:border-warm-gray-600/30">
                      <p className="text-xs font-body font-semibold text-earth-500 uppercase tracking-wider mb-1">{item.label}</p>
                      <p className="font-body text-warm-gray-900 dark:text-cream-100">{item.value}</p>
                    </div>
                  ))}
                </div>
                <div className="bg-cream-50/50 dark:bg-warm-gray-700/50 p-4 rounded-xl border border-cream-200/30 dark:border-warm-gray-600/30">
                  <p className="text-xs font-body font-semibold text-earth-500 uppercase tracking-wider mb-1">Description</p>
                  <p className="font-body text-warm-gray-900 dark:text-cream-100 whitespace-pre-wrap">{formData.description}</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation Buttons */}
          {submissionError && (
          <div className="mt-6">
            <div className="flex items-center gap-3 p-4 rounded-xl bg-mithila-red/10 border border-mithila-red/30">
              <p className="text-mithila-red text-sm">{submissionError}</p>
            </div>
          </div>
        )}
        <div className="flex justify-between mt-8">
          <button onClick={prevStep} className={`btn-secondary flex items-center gap-2 ${currentStep === 0 ? 'invisible' : ''}`}>
            <IoArrowBackOutline size={18} /> Back
          </button>
          {currentStep < 2 ? (
            <button onClick={nextStep} className="btn-primary flex items-center gap-2">
              Next <IoArrowForwardOutline size={18} />
            </button>
          ) : (
            <button onClick={handleSubmit} disabled={submitting || !!commissionId} className="btn-primary flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed">
              {submitting ? 'Submitting...' : 'Submit Request'} <IoCheckmarkCircle size={18} />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
