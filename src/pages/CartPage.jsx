import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { IoTrashOutline, IoAddOutline, IoRemoveOutline, IoCartOutline, IoArrowBackOutline, IoCheckmarkCircle, IoLogoWhatsapp } from 'react-icons/io5';
import { useCart } from '../context/CartContext';
import { buildApiPath } from '../api';
import { formatPrice } from '../utils/helpers';

export default function CartPage() {
  const { items, removeItem, updateQuantity, clearCart, total, itemCount } = useCart();
  const [step, setStep] = useState('cart'); // cart, checkout, payment, success
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', address: '', city: '', state: '', pincode: ''
  });
  const [cartOrderId, setCartOrderId] = useState(null);
  const [paymentError, setPaymentError] = useState(null);
  const [paymentLoading, setPaymentLoading] = useState(false);

  const shipping = total > 5000 ? 0 : 199;

  // Coupon system
  const COUPONS = {
    WELCOME10: { type: 'percent', value: 10 },
    MITHILA15: { type: 'percent', value: 15 },
    ART500: { type: 'flat', value: 500 },
    FIRSTORDER: { type: 'percent', value: 20 },
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
    if (!formData.name || !formData.email || !formData.phone || !formData.address || !formData.city || !formData.state || !formData.pincode) return;
    if (items.length === 0) return;
    setStep('payment');
  };

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
      const orderResponse = await fetch(buildApiPath('/create-cart-order'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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


  if (step === 'success') {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="min-h-screen bg-cream-50 pt-24">
        <Helmet><title>Order Confirmed — Lalita Pathak Mithila Art</title></Helmet>
        <div className="container-custom section-padding text-center">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}>
            <IoCheckmarkCircle className="text-mithila-green mx-auto mb-6" size={100} />
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="heading-lg text-charcoal mb-4">
            Order Confirmed! 🎉
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="text-body max-w-md mx-auto mb-4">
            Thank you for your order! We'll send you a confirmation email with tracking details shortly.
          </motion.p>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="text-earth-500 font-display text-lg mb-8">
            Order ID: #MTA{Date.now().toString().slice(-6)}
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
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }} className="min-h-screen bg-cream-50 pt-24">
      <Helmet>
        <title>Shopping Cart — Lalita Pathak Mithila Art</title>
        <meta name="description" content="Review your selected Mithila paintings and proceed to checkout." />
      </Helmet>

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
            const stepMap = { 0: 'cart', 1: 'checkout', 2: 'payment' };
            const currentStepIndex = step === 'cart' ? 0 : step === 'checkout' ? 1 : 2;
            const isActive = i <= currentStepIndex;
            return (
              <div key={s} className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-display font-bold text-sm transition-all duration-300 ${isActive ? 'bg-earth-500 text-white shadow-gold' : 'bg-cream-200 text-warm-gray-400'}`}>
                  {i + 1}
                </div>
                <span className={`hidden sm:block font-body text-sm ${isActive ? 'text-earth-700 font-semibold' : 'text-warm-gray-400'}`}>{s}</span>
                {i < 2 && <div className={`w-12 h-0.5 ${isActive ? 'bg-earth-500' : 'bg-cream-200'}`} />}
              </div>
            );
          })}
        </div>

        {items.length === 0 && step === 'cart' ? (
          /* Empty Cart */
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center py-20">
            <IoCartOutline className="text-cream-300 mx-auto mb-6" size={80} />
            <h2 className="heading-md text-charcoal mb-4">Your Cart is Empty</h2>
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
                      <h1 className="heading-md text-charcoal">Your Cart ({itemCount})</h1>
                      <button onClick={clearCart} className="text-sm text-mithila-red hover:underline font-body">Clear All</button>
                    </div>

                    <div className="space-y-4">
                      {items.map((item) => (
                        <motion.div key={item.id} layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -100 }}
                          className="bg-white rounded-2xl p-4 shadow-card flex gap-4"
                        >
                          <img src={item.images?.[0] || item.image} alt={item.title} className="w-24 h-28 sm:w-32 sm:h-36 object-cover rounded-xl" />
                          <div className="flex-1 min-w-0">
                            <p className="text-earth-500 text-xs font-semibold tracking-wider uppercase">{item.category}</p>
                            <h3 className="font-display font-semibold text-lg text-charcoal leading-snug truncate">{item.title}</h3>
                            <p className="text-body-sm text-warm-gray-400 mb-3">{item.size}</p>
                            <div className="flex items-center justify-between flex-wrap gap-2">
                              <span className="font-display font-bold text-xl text-earth-700">{formatPrice(item.price)}</span>
                              <div className="flex items-center gap-2">
                                <div className="flex items-center bg-cream-100 rounded-xl overflow-hidden">
                                  <button onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))} className="p-2 hover:bg-cream-200 transition-colors">
                                    <IoRemoveOutline size={16} />
                                  </button>
                                  <span className="px-3 font-body font-semibold text-sm">{item.quantity}</span>
                                  <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-2 hover:bg-cream-200 transition-colors">
                                    <IoAddOutline size={16} />
                                  </button>
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

                {step === 'checkout' && (
                  <motion.div key="checkout" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                    <h2 className="heading-md text-charcoal mb-6">Shipping Details</h2>
                    <div className="bg-white rounded-2xl p-6 shadow-card space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-body font-medium text-warm-gray-600 mb-1">Full Name *</label>
                          <input type="text" name="name" value={formData.name} onChange={handleInputChange} className="w-full px-4 py-3 bg-cream-50 border border-cream-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-earth-500/30 focus:border-earth-500 font-body transition-all" placeholder="Enter your name" />
                        </div>
                        <div>
                          <label className="block text-sm font-body font-medium text-warm-gray-600 mb-1">Email *</label>
                          <input type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full px-4 py-3 bg-cream-50 border border-cream-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-earth-500/30 focus:border-earth-500 font-body transition-all" placeholder="email@example.com" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-body font-medium text-warm-gray-600 mb-1">Phone *</label>
                        <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} className="w-full px-4 py-3 bg-cream-50 border border-cream-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-earth-500/30 focus:border-earth-500 font-body transition-all" placeholder="+91 74883 37792" />
                      </div>
                      <div>
                        <label className="block text-sm font-body font-medium text-warm-gray-600 mb-1">Address *</label>
                        <textarea name="address" value={formData.address} onChange={handleInputChange} rows={2} className="w-full px-4 py-3 bg-cream-50 border border-cream-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-earth-500/30 focus:border-earth-500 font-body transition-all resize-none" placeholder="House/Flat No., Street, Landmark" />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-body font-medium text-warm-gray-600 mb-1">City *</label>
                          <input type="text" name="city" value={formData.city} onChange={handleInputChange} className="w-full px-4 py-3 bg-cream-50 border border-cream-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-earth-500/30 focus:border-earth-500 font-body transition-all" placeholder="City" />
                        </div>
                        <div>
                          <label className="block text-sm font-body font-medium text-warm-gray-600 mb-1">State *</label>
                          <input type="text" name="state" value={formData.state} onChange={handleInputChange} className="w-full px-4 py-3 bg-cream-50 border border-cream-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-earth-500/30 focus:border-earth-500 font-body transition-all" placeholder="State" />
                        </div>
                        <div>
                          <label className="block text-sm font-body font-medium text-warm-gray-600 mb-1">Pincode *</label>
                          <input type="text" name="pincode" value={formData.pincode} onChange={handleInputChange} className="w-full px-4 py-3 bg-cream-50 border border-cream-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-earth-500/30 focus:border-earth-500 font-body transition-all" placeholder="110001" />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {step === 'payment' && (
                  <motion.div key="payment" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                    <h2 className="heading-md text-charcoal mb-6">Secure Checkout</h2>
                    <div className="bg-white rounded-2xl p-6 shadow-card">
                      <div className="mb-6">
                        <p className="font-display font-semibold text-lg text-charcoal mb-3">Pay Online</p>
                        <p className="text-body-sm text-warm-gray-600">
                          Tap any option below to open a secure online checkout with Google Pay, PhonePe, UPI, cards, and netbanking.
                        </p>
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2 mb-6">
                        {[
                          'Google Pay',
                          'PhonePe',
                          'UPI',
                          'Credit/Debit Cards',
                          'Netbanking'
                        ].map((method) => (
                          <button
                            key={method}
                            type="button"
                            onClick={handlePayment}
                            className="rounded-2xl border border-cream-200 p-4 text-sm text-charcoal bg-cream-50 text-left hover:border-earth-500 transition-colors"
                          >
                            {method}
                          </button>
                        ))}
                      </div>

                      <div className="border-t border-cream-200 pt-6">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-warm-gray-600 text-sm">Amount to pay</span>
                          <span className="font-semibold text-earth-700">{formatPrice(finalTotal)}</span>
                        </div>
                        <p className="text-xs text-warm-gray-500">
                          A secure checkout popup will open. Do not refresh until payment completes.
                        </p>
                      </div>

                      {paymentError && (
                        <div className="mt-6 rounded-2xl bg-red-50 border border-red-200 p-4 text-red-700 text-sm">
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
              <div className="bg-white rounded-2xl p-6 shadow-card sticky top-28">
                <h3 className="font-display font-semibold text-lg text-charcoal mb-4 pb-4 border-b border-cream-200">Order Summary</h3>
                
                {step !== 'cart' && (
                  <div className="space-y-3 mb-4 pb-4 border-b border-cream-100 max-h-40 overflow-y-auto">
                    {items.map((item) => (
                      <div key={item.id} className="flex items-center gap-3">
                        <img src={item.images?.[0] || item.image} alt={item.title} className="w-12 h-12 object-cover rounded-lg" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-body font-medium text-charcoal truncate">{item.title}</p>
                          <p className="text-xs text-warm-gray-400">Qty: {item.quantity}</p>
                        </div>
                        <p className="text-sm font-semibold text-earth-700">{formatPrice(item.price * item.quantity)}</p>
                      </div>
                    ))}
                  </div>
                )}

                <div className="space-y-3 mb-4">
                  {/* Coupon input */}
                  <div>
                    <label className="block text-sm font-body font-medium text-warm-gray-600 mb-2">Coupon Code:</label>
                    <div className="flex gap-2">
                      <input value={couponInput} onChange={(e) => setCouponInput(e.target.value)} placeholder="ENTER CODE" className="flex-1 px-4 py-3 bg-cream-50 border border-cream-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-earth-500/30 focus:border-earth-500" />
                      <button onClick={handleApplyCoupon} className="btn-primary px-4">Apply</button>
                    </div>
                    {couponError && <p className="text-xs text-red-600 mt-2">{couponError}</p>}
                    {appliedCoupon && (
                      <div className="mt-3 rounded-lg bg-cream-50 border border-cream-200 p-3 text-sm flex items-center justify-between">
                        <div>
                          <div className="font-medium text-charcoal">{appliedCoupon.code} • {appliedCoupon.desc}</div>
                          <div className="text-xs text-warm-gray-500">Discount applied</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="font-semibold text-earth-700">-{formatPrice(discountAmount)}</div>
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

                <div className="flex justify-between pt-4 border-t border-cream-200 mb-6">
                  <span className="font-display font-bold text-lg text-charcoal">Total</span>
                  <span className="font-display font-bold text-xl text-earth-700">{formatPrice(finalTotal)}</span>
                </div>

                {step === 'cart' && (
                  <button onClick={() => setStep('checkout')} className="btn-primary w-full text-center">
                    Proceed to Checkout
                  </button>
                )}
                {step === 'checkout' && (
                  <div className="space-y-3">
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
                      onClick={handlePayment}
                      disabled={paymentLoading}
                      className="btn-primary w-full text-center disabled:opacity-50"
                    >
                      {paymentLoading ? 'Opening secure checkout...' : 'Pay Online'}
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
      </div>
    </motion.div>
  );
}
