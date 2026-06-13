import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { IoTrashOutline, IoAddOutline, IoRemoveOutline, IoCartOutline, IoArrowBackOutline, IoCheckmarkCircle, IoLogoWhatsapp, IoQrCodeOutline, IoCloudUploadOutline, IoCloseOutline } from 'react-icons/io5';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { paymentAPI, buildApiPath } from '../api';
import { formatPrice, validateIndianPhone, normalizePhone } from '../utils/helpers';
import FallbackImage from '../components/ui/FallbackImage';

export default function CartPage() {
  const { items, removeItem, clearCart, syncCart, total, itemCount } = useCart();
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  useEffect(() => {
    syncCart();
  }, [syncCart]);
  const [step, setStep] = useState('cart'); // cart, auth, checkout, payment, success
  const [checkoutError, setCheckoutError] = useState(null);
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', address: '', city: '', state: '', pincode: ''
  });
  const [cartOrderId, setCartOrderId] = useState(null);
  const [paymentError, setPaymentError] = useState(null);
  const [paymentLoading, setPaymentLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated && user) {
      setFormData((prev) => ({
        ...prev,
        name: prev.name || user.name || '',
        email: prev.email || user.email || '',
        phone: prev.phone || user.phone || '',
        address: prev.address || (user.addresses && user.addresses[0]?.line1) || '',
        city: prev.city || (user.addresses && user.addresses[0]?.city) || '',
        state: prev.state || (user.addresses && user.addresses[0]?.state) || '',
        pincode: prev.pincode || (user.addresses && user.addresses[0]?.pincode) || '',
      }));
    }
  }, [isAuthenticated, user]);

  // UPI payment state
  const [showQrModal, setShowQrModal] = useState(false);
  const [screenshotFile, setScreenshotFile] = useState(null);
  const [screenshotPreview, setScreenshotPreview] = useState(null);
  const [upiOrderId, setUpiOrderId] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('online'); // 'online' or 'upi'

  // Coupon system
  const COUPONS = {
    WELCOME10: { type: 'percent', value: 10 },
    MITHILA15: { type: 'percent', value: 15 },
    ART500: { type: 'flat', value: 500 },
    FIRSTORDER: { type: 'percent', value: 20 },
    BETA99: { type: 'percent', value: 99, freeShipping: true, singleUse: true },
    BETA999: { type: 'percent', value: 99.9, freeShipping: true, singleUse: true },
  };

  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null); // { code, desc }
  const [couponError, setCouponError] = useState(null);

  useEffect(() => {
    try {
      const saved = sessionStorage.getItem('mithila_applied_coupon');
      if (saved) setAppliedCoupon(JSON.parse(saved));
    } catch (e) {
      // ignore
    }
  }, []);

  useEffect(() => {
    try {
      if (appliedCoupon) sessionStorage.setItem('mithila_applied_coupon', JSON.stringify(appliedCoupon));
      else sessionStorage.removeItem('mithila_applied_coupon');
    } catch (e) {}
  }, [appliedCoupon]);

  const computeDiscountAmount = (coupon, subtotal) => {
    if (!coupon) return 0;
    if (coupon.type === 'percent') return Math.round((subtotal * coupon.value) / 100);
    return Math.min(coupon.value, subtotal);
  };

  const discountAmount = appliedCoupon ? computeDiscountAmount(COUPONS[appliedCoupon.code], total) : 0;
  
  const isFreeShipping = appliedCoupon && COUPONS[appliedCoupon.code]?.freeShipping;
  const shipping = total > 5000 || isFreeShipping ? 0 : 199;
  
  const finalTotal = Math.max(0, total - discountAmount + shipping);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleApplyCoupon = () => {
    setCouponError(null);
    const code = (couponInput || '').trim().toUpperCase();
    if (!code) {
      setCouponError('Please enter a coupon code.');
      return;
    }
    if (appliedCoupon && appliedCoupon.code === code) {
      setCouponError('Coupon already applied.');
      return;
    }
    const coupon = COUPONS[code];
    if (!coupon) {
      setCouponError('Invalid coupon code.');
      return;
    }
    if (items.length === 0) {
      setCouponError('Add items to cart before applying a coupon.');
      return;
    }

    const desc = coupon.type === 'percent' ? `${coupon.value}% OFF` : `₹${coupon.value} OFF`;
    const applied = { code, desc };
    setAppliedCoupon(applied);
    setCouponInput('');
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponError(null);
  };

  const handleCheckout = () => {
    setCheckoutError(null);
    if (!formData.name || !formData.email || !formData.phone || !formData.address || !formData.city || !formData.state || !formData.pincode) {
      setCheckoutError('Please fill in all shipping details before continuing.');
      return;
    }
    if (items.length === 0) {
      setCheckoutError('Your cart is empty.');
      return;
    }
    if (!validateIndianPhone(formData.phone)) {
      setCheckoutError('Please enter a valid 10-digit Indian mobile number.');
      return;
    }
    // Update formData with normalized phone number
    setFormData((prev) => ({ ...prev, phone: normalizePhone(prev.phone) }));
    setStep('payment');
  };

  // Keep existing Razorpay code
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        return resolve(true);
      }

      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    if (!formData.name || !formData.email || !formData.phone || !formData.address || !formData.city || !formData.state || !formData.pincode) {
      setPaymentError('Please complete your shipping details before payment.');
      return;
    }

    if (items.length === 0) {
      setPaymentError('Your cart is empty. Add at least one item before payment.');
      return;
    }

    setPaymentLoading(true);
    setPaymentError(null);

    const scriptLoaded = await loadRazorpayScript();
    if (!scriptLoaded) {
      setPaymentError('Unable to load Razorpay checkout. Please refresh and try again.');
      setPaymentLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
      const orderResponse = await fetch(buildApiPath('/create-cart-order'), {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
          totalAmount: total,
          shipping,
          grandTotal: finalTotal,
          discount: discountAmount,
          couponCode: appliedCoupon?.code || null,
          items: items.map((item) => ({
            productId: item.id,
            title: item.title,
            quantity: item.quantity,
            price: item.price,
            image: item.images?.[0] || item.image || ''
          }))
        })
      });

      const orderData = await orderResponse.json();
      if (!orderData.success) {
        setPaymentError(orderData.error || 'Could not create payment order.');
        setPaymentLoading(false);
        return;
      }

      setCartOrderId(orderData.cartOrderId);

      const options = {
        key: orderData.key,
        amount: orderData.amount,
        currency: orderData.currency,
        order_id: orderData.orderId,
        name: 'Lalita Pathak Mithila Art',
        description: 'Secure payment for your Mithila Art order',
        image: '/favicon.svg',
        handler: async (response) => {
          try {
            const verifyResponse = await fetch(buildApiPath('/verify-cart-payment'), {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                cartOrderId: orderData.cartOrderId,
                paymentId: response.razorpay_payment_id,
                orderId: response.razorpay_order_id,
                signature: response.razorpay_signature
              })
            });

            const verifyData = await verifyResponse.json();
            if (verifyData.success) {
              clearCart();
              setStep('success');
            } else {
              setPaymentError(verifyData.error || 'Payment verification failed.');
              setPaymentLoading(false);
            }
          } catch (err) {
            setPaymentError('Payment verification failed. Please try again.');
            setPaymentLoading(false);
            console.error(err);
          }
        },
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.phone
        },
        notes: {
          cartOrderId: orderData.cartOrderId
        },
        theme: {
          color: '#7c6f5d'
        },
        modal: {
          ondismiss: () => {
            setPaymentLoading(false);
            setPaymentError('Payment process was cancelled.');
          }
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error(error);
      setPaymentError('Payment initialization failed. Please try again.');
      setPaymentLoading(false);
    }
  };

  // UPI Deep Link handler
  const handleUpiDeepLink = () => {
    const upiUrl = `upi://pay?pa=9142168466@axl&pn=Lalita%20Pathak%20Mithila%20Art%20Studio&am=${finalTotal}&cu=INR`;
    window.location.href = upiUrl;
  };

  // Screenshot file handler
  const handleScreenshotChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setPaymentError('Please upload an image file.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setPaymentError('Image must be under 5MB.');
      return;
    }
    setScreenshotFile(file);
    setPaymentError(null);
    const reader = new FileReader();
    reader.onloadend = () => {
      setScreenshotPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  // UPI order submission
  const handleUpiOrder = async () => {
    if (!screenshotPreview) {
      setPaymentError('Please upload your payment screenshot first.');
      return;
    }
    setPaymentLoading(true);
    setPaymentError(null);

    try {
      const res = await paymentAPI.createUpiOrder({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
        totalAmount: total,
        shipping,
        grandTotal: finalTotal,
        discount: discountAmount,
        couponCode: appliedCoupon?.code || null,
        items: items.map((item) => ({
          productId: item.id,
          title: item.title,
          quantity: item.quantity,
          price: item.price,
          image: item.images?.[0] || item.image || ''
        })),
        paymentScreenshot: screenshotPreview,
      });

      if (res.data.success) {
        setUpiOrderId(res.data.orderId);
        setCartOrderId(res.data.cartOrderId);
        clearCart();
        setStep('success');
      } else {
        setPaymentError(res.data.error || 'Could not submit UPI order.');
      }
    } catch (error) {
      console.error('UPI order error:', error);
      setPaymentError(error.response?.data?.error || 'Could not submit UPI order. Please try again.');
    } finally {
      setPaymentLoading(false);
    }
  };


  if (step === 'success') {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="min-h-screen bg-cream-50 dark:bg-warm-gray-900 pt-24">
        <Helmet><title>Order Submitted — Lalita Pathak Mithila Art</title></Helmet>
        <div className="container-custom section-padding text-center">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}>
            <IoCheckmarkCircle className="text-mithila-green mx-auto mb-6" size={100} />
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="heading-lg text-charcoal dark:text-cream-200 mb-4">
            {upiOrderId ? 'Order Submitted! 🎉' : 'Order Confirmed! 🎉'}
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="text-body max-w-md mx-auto mb-4">
            {upiOrderId
              ? 'Your order has been submitted. We will verify your payment and process the order shortly.'
              : "Thank you for your order! We'll send you a confirmation email with tracking details shortly."
            }
          </motion.p>
          {upiOrderId && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.65 }}
              className="inline-block mb-4 px-4 py-2 rounded-full bg-mithila-orange/10 text-mithila-orange font-body font-medium text-sm"
            >
              Status: Pending Payment Verification
            </motion.div>
          )}
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="text-earth-500 font-display text-lg mb-8">
            Order ID: #{upiOrderId || `MTA${Date.now().toString().slice(-6)}`}
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }} className="flex gap-4 justify-center flex-wrap">
            <Link to="/shop" className="btn-primary">Continue Shopping</Link>
            <a href="https://wa.me/917488337792?text=Hi!%20I%20just%20placed%20an%20order." target="_blank" rel="noopener noreferrer" className="btn-secondary flex items-center gap-2">
              <IoLogoWhatsapp size={20} /> Track on WhatsApp
            </a>
          </motion.div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }} className="min-h-screen bg-cream-50 dark:bg-warm-gray-900 pt-24 pb-28 lg:pb-0">
      <Helmet>
        <title>Shopping Cart — Lalita Pathak Mithila Art</title>
        <meta name="description" content="Review your selected Mithila paintings and proceed to checkout." />
      </Helmet>

      {/* QR Code Modal */}
      <AnimatePresence>
        {showQrModal && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
            onClick={() => setShowQrModal(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }}
              className="bg-earth-900 rounded-2xl p-6 max-w-sm w-full text-center relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button onClick={() => setShowQrModal(false)} className="absolute top-4 right-4 text-cream-300 hover:text-white transition-colors">
                <IoCloseOutline size={24} />
              </button>
              <h3 className="font-display font-bold text-xl text-cream-50 mb-2">Scan to Pay</h3>
              <p className="text-cream-300/70 text-sm font-body mb-4">Scan with any UPI app to pay</p>
              <div className="bg-white rounded-xl p-3 mb-4 inline-block">
                <img src="/upi-qr.jpg" alt="UPI QR Code" className="w-56 h-56 object-contain" />
              </div>
              <div className="space-y-2">
                <p className="text-cream-300 text-sm font-body">
                  Amount: <span className="font-semibold text-cream-50">{formatPrice(finalTotal)}</span>
                </p>
                <p className="text-cream-300/60 text-xs font-body">
                  UPI ID: <span className="text-earth-400 font-mono select-all">9142168466@axl</span>
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="container-custom section-padding">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-8 text-body-sm">
          <Link to="/shop" className="text-earth-500 hover:underline flex items-center gap-1">
            <IoArrowBackOutline size={16} /> Back to Shop
          </Link>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-4 mb-12">
          {['Cart', 'Details', 'Payment'].map((s, i) => {
            const currentStepIndex = step === 'cart' ? 0 : step === 'auth' ? 0 : step === 'checkout' ? 1 : 2;
            const isActive = i <= currentStepIndex;
            return (
              <div key={s} className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-display font-bold text-sm transition-all duration-300 ${isActive ? 'bg-earth-500 text-white shadow-gold' : 'bg-cream-200 dark:bg-warm-gray-700 text-warm-gray-400 dark:text-warm-gray-500'}`}>
                  {i + 1}
                </div>
                <span className={`hidden sm:block font-body text-sm ${isActive ? 'text-earth-700 dark:text-earth-400 font-semibold' : 'text-warm-gray-400 dark:text-warm-gray-500'}`}>{s}</span>
                {i < 2 && <div className={`w-12 h-0.5 ${isActive ? 'bg-earth-500' : 'bg-cream-200 dark:bg-warm-gray-700'}`} />}
              </div>
            );
          })}
        </div>

        {items.length === 0 && step === 'cart' ? (
          /* Empty Cart */
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center py-20">
            <IoCartOutline className="text-cream-300 dark:text-warm-gray-600 mx-auto mb-6" size={80} />
            <h2 className="heading-md text-charcoal dark:text-cream-200 mb-4">Your Cart is Empty</h2>
            <p className="text-body mb-8 max-w-md mx-auto">Explore our collection of authentic Mithila paintings and add your favorites to cart.</p>
            <Link to="/shop" className="btn-primary">Browse Collection</Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <AnimatePresence mode="wait">
                {step === 'cart' && (
                  <motion.div key="cart" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                    <div className="flex items-center justify-between mb-6">
                      <h1 className="heading-md text-charcoal dark:text-cream-200">Your Cart ({itemCount})</h1>
                      <button onClick={clearCart} className="text-sm text-mithila-red hover:underline font-body">Clear All</button>
                    </div>

                    <div className="space-y-4">
                      {items.map((item) => (
                        <motion.div key={item.id} layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -100 }}
                          className="bg-white dark:bg-warm-gray-800 rounded-2xl p-4 shadow-card dark:shadow-none dark:border dark:border-warm-gray-700/50 flex gap-4"
                        >
                          <FallbackImage src={item.images?.[0] || item.image} alt={item.title} className="w-24 h-28 sm:w-32 sm:h-36 object-cover rounded-xl" />
                          <div className="flex-1 min-w-0">
                            <p className="text-earth-500 text-xs font-semibold tracking-wider uppercase">{item.category}</p>
                            <h3 className="font-display font-semibold text-lg text-charcoal dark:text-cream-200 leading-snug truncate">{item.title}</h3>
                            <p className="text-body-sm text-warm-gray-400 mb-3">{item.size}</p>
                            <div className="flex items-center justify-between flex-wrap gap-2">
                              <span className="font-display font-bold text-xl text-earth-700 dark:text-earth-400">{formatPrice(item.price)}</span>
                              <div className="flex items-center gap-2">
                                <div className="flex items-center bg-mithila-orange/10 rounded-xl overflow-hidden px-3 py-1.5">
                                  <span className="font-body font-semibold text-xs text-mithila-orange tracking-wider">ORIGINAL 1 OF 1</span>
                                </div>
                                <button onClick={() => removeItem(item.id)} className="p-2 text-warm-gray-400 hover:text-mithila-red transition-colors">
                                  <IoTrashOutline size={18} />
                                </button>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {step === 'auth' && (
                  <motion.div key="auth" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                    <h2 className="heading-md text-charcoal dark:text-cream-200 mb-6">Authentication Required</h2>
                    <div className="bg-white dark:bg-warm-gray-800 rounded-2xl p-8 shadow-card dark:shadow-none dark:border dark:border-warm-gray-700/50 flex flex-col md:flex-row gap-8">
                      <div className="flex-1 flex flex-col justify-center space-y-4">
                        <h3 className="font-display font-semibold text-xl text-charcoal dark:text-cream-200">Already have an account?</h3>
                        <p className="text-body-sm text-warm-gray-500 mb-4">Login to checkout, view your order history, and save artworks to your wishlist.</p>
                        <Link to="/login" state={{ from: location }} className="btn-primary w-full text-center block">Login</Link>
                      </div>
                      <div className="hidden md:block w-px bg-cream-200 dark:bg-warm-gray-700" />
                      <div className="flex-1 flex flex-col justify-center space-y-4">
                        <h3 className="font-display font-semibold text-xl text-charcoal dark:text-cream-200">New Customer?</h3>
                        <p className="text-body-sm text-warm-gray-500 mb-4">Create an account to securely purchase original Mithila artworks and manage your collection.</p>
                        <Link to="/signup" state={{ from: location }} className="btn-secondary w-full text-center block">Create Account</Link>
                      </div>
                    </div>
                  </motion.div>
                )}

                {step === 'checkout' && (
                  <motion.div key="checkout" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                    <h2 className="heading-md text-charcoal dark:text-cream-200 mb-6">Shipping Details</h2>
                    <div className="bg-white dark:bg-warm-gray-800 rounded-2xl p-6 shadow-card dark:shadow-none dark:border dark:border-warm-gray-700/50 space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-body font-medium text-warm-gray-600 dark:text-warm-gray-300 mb-1">Full Name *</label>
                          <input type="text" name="name" value={formData.name} onChange={handleInputChange} className="w-full px-4 py-3 bg-cream-50 dark:bg-warm-gray-700/50 border border-cream-200 dark:border-warm-gray-600 rounded-xl text-charcoal dark:text-cream-100 placeholder-warm-gray-400 dark:placeholder-warm-gray-500 focus:outline-none focus:ring-2 focus:ring-earth-500/30 focus:border-earth-500 font-body transition-all" placeholder="Enter your name" />
                        </div>
                        <div>
                          <label className="block text-sm font-body font-medium text-warm-gray-600 dark:text-warm-gray-300 mb-1">Email *</label>
                          <input type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full px-4 py-3 bg-cream-50 dark:bg-warm-gray-700/50 border border-cream-200 dark:border-warm-gray-600 rounded-xl text-charcoal dark:text-cream-100 placeholder-warm-gray-400 dark:placeholder-warm-gray-500 focus:outline-none focus:ring-2 focus:ring-earth-500/30 focus:border-earth-500 font-body transition-all" placeholder="email@example.com" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-body font-medium text-warm-gray-600 mb-1">Phone *</label>
                        <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} className="w-full px-4 py-3 bg-cream-50 dark:bg-warm-gray-700/50 border border-cream-200 dark:border-warm-gray-600 rounded-xl text-charcoal dark:text-cream-100 placeholder-warm-gray-400 dark:placeholder-warm-gray-500 focus:outline-none focus:ring-2 focus:ring-earth-500/30 focus:border-earth-500 font-body transition-all" placeholder="+91 74883 37792" />
                      </div>
                      <div>
                        <label className="block text-sm font-body font-medium text-warm-gray-600 mb-1">Address *</label>
                        <textarea name="address" value={formData.address} onChange={handleInputChange} rows={2} className="w-full px-4 py-3 bg-cream-50 dark:bg-warm-gray-700/50 border border-cream-200 dark:border-warm-gray-600 rounded-xl text-charcoal dark:text-cream-100 placeholder-warm-gray-400 dark:placeholder-warm-gray-500 focus:outline-none focus:ring-2 focus:ring-earth-500/30 focus:border-earth-500 font-body transition-all resize-none" placeholder="House/Flat No., Street, Landmark" />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-body font-medium text-warm-gray-600 dark:text-warm-gray-300 mb-1">City *</label>
                          <input type="text" name="city" value={formData.city} onChange={handleInputChange} className="w-full px-4 py-3 bg-cream-50 dark:bg-warm-gray-700/50 border border-cream-200 dark:border-warm-gray-600 rounded-xl text-charcoal dark:text-cream-100 placeholder-warm-gray-400 dark:placeholder-warm-gray-500 focus:outline-none focus:ring-2 focus:ring-earth-500/30 focus:border-earth-500 font-body transition-all" placeholder="City" />
                        </div>
                        <div>
                          <label className="block text-sm font-body font-medium text-warm-gray-600 dark:text-warm-gray-300 mb-1">State *</label>
                          <input type="text" name="state" value={formData.state} onChange={handleInputChange} className="w-full px-4 py-3 bg-cream-50 dark:bg-warm-gray-700/50 border border-cream-200 dark:border-warm-gray-600 rounded-xl text-charcoal dark:text-cream-100 placeholder-warm-gray-400 dark:placeholder-warm-gray-500 focus:outline-none focus:ring-2 focus:ring-earth-500/30 focus:border-earth-500 font-body transition-all" placeholder="State" />
                        </div>
                        <div>
                          <label className="block text-sm font-body font-medium text-warm-gray-600 dark:text-warm-gray-300 mb-1">Pincode *</label>
                          <input type="text" name="pincode" value={formData.pincode} onChange={handleInputChange} className="w-full px-4 py-3 bg-cream-50 dark:bg-warm-gray-700/50 border border-cream-200 dark:border-warm-gray-600 rounded-xl text-charcoal dark:text-cream-100 placeholder-warm-gray-400 dark:placeholder-warm-gray-500 focus:outline-none focus:ring-2 focus:ring-earth-500/30 focus:border-earth-500 font-body transition-all" placeholder="110001" />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {step === 'payment' && (
                  <motion.div key="payment" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                    <h2 className="heading-md text-charcoal dark:text-cream-200 mb-6">Select Payment Method</h2>
                    <div className="bg-white dark:bg-warm-gray-800 rounded-2xl p-6 shadow-card dark:shadow-none dark:border dark:border-warm-gray-700/50 space-y-6">

                      {/* Payment Method Selector */}
                      <div className="flex flex-col sm:flex-row gap-4 mb-6">
                        <button
                          type="button"
                          onClick={() => setPaymentMethod('online')}
                          className={`flex-1 py-3.5 px-4 rounded-xl border-2 font-display font-bold text-sm transition-all duration-300 ${paymentMethod === 'online' ? 'bg-earth-500 border-earth-500 text-white shadow-md' : 'bg-white dark:bg-warm-gray-800 border-cream-200 dark:border-warm-gray-700 text-charcoal dark:text-cream-200 hover:border-earth-300'}`}
                        >
                          💳 Pay Online (Cards / UPI / Netbanking)
                        </button>
                        <button
                          type="button"
                          onClick={() => setPaymentMethod('upi')}
                          className={`flex-1 py-3.5 px-4 rounded-xl border-2 font-display font-bold text-sm transition-all duration-300 ${paymentMethod === 'upi' ? 'bg-earth-500 border-earth-500 text-white shadow-md' : 'bg-white dark:bg-warm-gray-800 border-cream-200 dark:border-warm-gray-700 text-charcoal dark:text-cream-200 hover:border-earth-300'}`}
                        >
                          🏦 Direct Bank/UPI (Scan QR Code)
                        </button>
                      </div>

                      {/* Amount Display */}
                      <div className="bg-cream-50 dark:bg-warm-gray-700/50 rounded-xl p-4 border border-cream-200 dark:border-warm-gray-600">
                        <div className="flex items-center justify-between">
                          <span className="text-warm-gray-600 dark:text-warm-gray-300 font-body text-sm">Amount to pay</span>
                          <span className="font-display font-bold text-2xl text-earth-700 dark:text-earth-400">{formatPrice(finalTotal)}</span>
                        </div>
                        {discountAmount > 0 && (
                          <p className="text-mithila-green text-xs font-body mt-1">Coupon discount of {formatPrice(discountAmount)} applied!</p>
                        )}
                      </div>

                      {paymentMethod === 'online' ? (
                        /* Online payment flow */
                        <div className="space-y-6">
                          <div className="p-4 bg-earth-50/50 dark:bg-warm-gray-700/30 border border-earth-200 dark:border-warm-gray-600 rounded-xl text-sm text-warm-gray-700 dark:text-cream-200 space-y-2">
                            <p>🌟 <strong>Safe & Secured payments via Razorpay</strong></p>
                            <p>We support Credit/Debit Cards (Visa, Mastercard, RuPay), Net Banking, popular wallets, and direct UPI transfers with instant confirmation.</p>
                          </div>
                          <button
                            onClick={handlePayment}
                            disabled={paymentLoading}
                            className="w-full py-4 bg-gradient-to-r from-earth-500 to-earth-600 hover:from-earth-600 hover:to-earth-700 text-white rounded-2xl font-display font-bold text-lg transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50"
                          >
                            {paymentLoading ? "Processing..." : `Pay ${formatPrice(finalTotal)} Online`}
                          </button>
                        </div>
                      ) : (
                        /* Manual UPI flow */
                        <div className="space-y-6">
                          {/* UPI Deep Link Button */}
                          <div>
                            <button
                              onClick={handleUpiDeepLink}
                              className="w-full py-4 bg-earth-500 hover:bg-earth-600 text-white rounded-2xl font-display font-bold text-lg transition-all duration-300 shadow-md hover:shadow-lg active:scale-[0.98]"
                            >
                              Pay {formatPrice(finalTotal)} via UPI App
                            </button>
                            <p className="text-center text-xs text-warm-gray-500 font-body mt-2">
                              Opens your UPI app on mobile
                            </p>
                            {/* Supported apps badges */}
                            <div className="flex items-center justify-center gap-3 mt-3 flex-wrap">
                              {['GPay', 'PhonePe', 'Paytm', 'BHIM'].map((app) => (
                                <span key={app} className="text-xs px-3 py-1.5 bg-cream-100 dark:bg-warm-gray-700 text-earth-700 dark:text-cream-200 rounded-full font-body font-medium border border-cream-200 dark:border-warm-gray-600">
                                  {app}
                                </span>
                              ))}
                            </div>
                          </div>

                          {/* Divider */}
                          <div className="flex items-center gap-3">
                            <div className="flex-1 h-px bg-cream-200 dark:bg-warm-gray-700" />
                            <span className="text-warm-gray-400 dark:text-warm-gray-500 text-xs font-body uppercase tracking-wider">or</span>
                            <div className="flex-1 h-px bg-cream-200 dark:bg-warm-gray-700" />
                          </div>

                          {/* Show QR Code Button */}
                          <button
                            onClick={() => setShowQrModal(true)}
                            className="w-full py-3.5 bg-cream-50 dark:bg-warm-gray-700/50 hover:bg-cream-100 dark:hover:bg-warm-gray-700 text-earth-700 dark:text-cream-200 rounded-2xl font-body font-semibold text-sm transition-all duration-300 border border-cream-200 dark:border-warm-gray-600 flex items-center justify-center gap-2"
                          >
                            <IoQrCodeOutline size={20} />
                            Show QR Code to Scan
                          </button>

                          {/* Divider */}
                          <div className="flex items-center gap-3">
                            <div className="flex-1 h-px bg-cream-200 dark:bg-warm-gray-700" />
                            <span className="text-warm-gray-400 dark:text-warm-gray-500 text-xs font-body uppercase tracking-wider">after paying</span>
                            <div className="flex-1 h-px bg-cream-200 dark:bg-warm-gray-700" />
                          </div>

                          {/* Upload Screenshot Section */}
                          <div className="space-y-3">
                            <p className="font-display font-semibold text-base text-charcoal dark:text-cream-200">Already paid? Upload your payment screenshot</p>
                            <p className="text-body-sm text-warm-gray-500">Upload a screenshot of your successful UPI payment so we can verify and process your order.</p>

                            <div className="relative">
                              <input
                                type="file"
                                accept="image/*"
                                onChange={handleScreenshotChange}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                id="screenshot-upload"
                              />
                              <label
                                htmlFor="screenshot-upload"
                                className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-cream-300 dark:border-warm-gray-600 rounded-2xl bg-cream-50/50 dark:bg-warm-gray-700/30 hover:bg-cream-100/50 dark:hover:bg-warm-gray-700/50 transition-colors cursor-pointer"
                              >
                                <IoCloudUploadOutline size={32} className="text-earth-500 mb-2" />
                                <span className="text-sm font-body font-medium text-earth-700 dark:text-cream-200">
                                  {screenshotFile ? screenshotFile.name : 'Click to upload screenshot'}
                                </span>
                                <span className="text-xs text-warm-gray-400 mt-1">JPG, PNG or WEBP • Max 5MB</span>
                              </label>
                            </div>

                            {/* Screenshot Preview */}
                            {screenshotPreview && (
                              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="relative">
                                <img src={screenshotPreview} alt="Payment screenshot preview" className="w-full max-h-64 object-contain rounded-xl border border-cream-200 dark:border-warm-gray-700" />
                                <button
                                  onClick={() => { setScreenshotFile(null); setScreenshotPreview(null); }}
                                  className="absolute top-2 right-2 w-8 h-8 bg-earth-900/70 rounded-full flex items-center justify-center text-white hover:bg-earth-900 transition-colors"
                                >
                                  <IoCloseOutline size={18} />
                                </button>
                              </motion.div>
                            )}

                            {/* Confirm Order Button */}
                            <button
                              onClick={handleUpiOrder}
                              disabled={paymentLoading || !screenshotPreview}
                              className="w-full py-3.5 bg-mithila-green hover:bg-mithila-green/90 disabled:bg-warm-gray-300 disabled:cursor-not-allowed text-white rounded-2xl font-display font-bold text-base transition-all duration-300"
                            >
                              {paymentLoading ? 'Submitting order...' : 'Confirm Order'}
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Payment Error */}
                      {paymentError && (
                        <div className="rounded-2xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 p-4 text-red-700 dark:text-red-400 text-sm">
                          {paymentError}
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-warm-gray-800 rounded-2xl p-6 shadow-card dark:shadow-none dark:border dark:border-warm-gray-700/50 sticky top-28">
                <h3 className="font-display font-semibold text-lg text-charcoal dark:text-cream-200 mb-4 pb-4 border-b border-cream-200 dark:border-warm-gray-700">Order Summary</h3>
                
                {step !== 'cart' && (
                  <div className="space-y-3 mb-4 pb-4 border-b border-cream-100 dark:border-warm-gray-700 max-h-40 overflow-y-auto">
                    {items.map((item) => (
                      <div key={item.id} className="flex items-center gap-3">
                        <FallbackImage src={item.images?.[0] || item.image} alt={item.title} className="w-12 h-12 object-cover rounded-lg" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-body font-medium text-charcoal dark:text-cream-200 truncate">{item.title}</p>
                          <p className="text-xs text-warm-gray-400">Qty: {item.quantity}</p>
                        </div>
                        <p className="text-sm font-semibold text-earth-700 dark:text-earth-400">{formatPrice(item.price * item.quantity)}</p>
                      </div>
                    ))}
                  </div>
                )}

                <div className="space-y-3 mb-4">
                  {/* Coupon input */}
                  <div>
                    <label className="block text-sm font-body font-medium text-warm-gray-600 dark:text-warm-gray-300 mb-2">Coupon Code:</label>
                    <div className="flex gap-2">
                      <input value={couponInput} onChange={(e) => setCouponInput(e.target.value)} placeholder="ENTER CODE" className="flex-1 px-4 py-3 bg-cream-50 dark:bg-warm-gray-700/50 border border-cream-200 dark:border-warm-gray-600 rounded-xl text-charcoal dark:text-cream-100 placeholder-warm-gray-400 dark:placeholder-warm-gray-500 focus:outline-none focus:ring-2 focus:ring-earth-500/30 focus:border-earth-500" />
                      <button onClick={handleApplyCoupon} className="btn-primary px-4">Apply</button>
                    </div>
                    {couponError && <p className="text-xs text-red-600 mt-2">{couponError}</p>}
                    {appliedCoupon && (
                      <div className="mt-3 rounded-lg bg-cream-50 dark:bg-warm-gray-700/30 border border-cream-200 dark:border-warm-gray-600 p-3 text-sm flex items-center justify-between">
                        <div>
                          <div className="font-medium text-charcoal dark:text-cream-200">{appliedCoupon.code} • {appliedCoupon.desc}</div>
                          <div className="text-xs text-warm-gray-500">Discount applied</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="font-semibold text-earth-700 dark:text-earth-400">-{formatPrice(discountAmount)}</div>
                          <button onClick={handleRemoveCoupon} className="text-xs text-warm-gray-400 hover:text-mithila-red">Remove</button>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="flex justify-between text-body-sm">
                    <span>Subtotal ({itemCount} items)</span>
                    <span className="font-semibold">{formatPrice(total)}</span>
                  </div>
                  <div className="flex justify-between text-body-sm">
                    <span>Shipping</span>
                    <span className={`font-semibold ${shipping === 0 ? 'text-mithila-green' : ''}`}>
                      {shipping === 0 ? 'FREE' : formatPrice(shipping)}
                    </span>
                  </div>
                  {shipping > 0 && (
                    <p className="text-xs text-earth-500 font-body">Free shipping on orders above ₹5,000</p>
                  )}
                </div>

                <div className="flex justify-between pt-4 border-t border-cream-200 dark:border-warm-gray-700 mb-6">
                  <span className="font-display font-bold text-lg text-charcoal dark:text-cream-200">Total</span>
                  <span className="font-display font-bold text-xl text-earth-700 dark:text-earth-400">{formatPrice(finalTotal)}</span>
                </div>

                {step === 'cart' && (
                  <button onClick={() => isAuthenticated ? setStep('checkout') : setStep('auth')} className="btn-primary w-full text-center">
                    Proceed to Checkout
                  </button>
                )}
                {step === 'checkout' && (
                  <div className="space-y-3">
                    {checkoutError && <p className="text-sm text-mithila-red mb-2 bg-mithila-red/10 px-3 py-2 rounded-xl text-center font-body">{checkoutError}</p>}
                    <button onClick={handleCheckout} className="btn-primary w-full text-center">
                      Continue to Payment
                    </button>
                    <button onClick={() => setStep('cart')} className="btn-secondary w-full text-center text-sm">
                      Back to Cart
                    </button>
                  </div>
                )}
                {step === 'payment' && (
                  <div className="space-y-3">
                    <button
                      onClick={paymentMethod === 'online' ? handlePayment : handleUpiOrder}
                      disabled={paymentLoading || (paymentMethod === 'upi' && !screenshotPreview)}
                      className="btn-primary w-full text-center disabled:opacity-50"
                    >
                      {paymentLoading ? 'Processing...' : paymentMethod === 'online' ? 'Pay Online' : 'Confirm Order'}
                    </button>
                    <button onClick={() => setStep('checkout')} className="btn-secondary w-full text-center text-sm">
                      Back
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Mobile Sticky Bottom Action Bar */}
        {step !== 'success' && items.length > 0 && (
          <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-warm-gray-800/95 backdrop-blur-md border-t border-cream-200 dark:border-warm-gray-700 px-6 py-4 shadow-[0_-8px_30px_rgba(0,0,0,0.06)] z-40 flex items-center justify-between safe-bottom">
            <div className="flex flex-col">
              <span className="text-xs text-warm-gray-400 font-body">Total Amount</span>
              <span className="font-display font-bold text-lg text-earth-700 dark:text-earth-400">{formatPrice(finalTotal)}</span>
            </div>
            <div className="w-1/2">
              {step === 'cart' && (
                <button
                  onClick={() => isAuthenticated ? setStep('checkout') : setStep('auth')}
                  className="btn-primary w-full py-2.5 text-sm"
                >
                  Checkout
                </button>
              )}
              {step === 'checkout' && (
                <button
                  onClick={handleCheckout}
                  className="btn-primary w-full py-2.5 text-sm"
                >
                  Continue
                </button>
              )}
              {step === 'payment' && (
                <button
                  onClick={paymentMethod === 'online' ? handlePayment : handleUpiOrder}
                  disabled={paymentLoading || (paymentMethod === 'upi' && !screenshotPreview)}
                  className="btn-primary w-full py-2.5 text-sm disabled:opacity-50"
                >
                  {paymentLoading ? 'Processing...' : paymentMethod === 'online' ? 'Pay Online' : 'Confirm'}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
