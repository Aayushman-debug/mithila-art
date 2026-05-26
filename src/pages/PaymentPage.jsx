import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { buildApiPath } from '../api';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { IoCheckmarkCircle, IoCloseCircle, IoWarning } from 'react-icons/io5';

export default function PaymentPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const commissionId = searchParams.get('commissionId');

  const [commission, setCommission] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!commissionId) {
      setError("Commission ID not found");
      setLoading(false);
      return;
    }
    fetchCommissionDetails();
  }, [commissionId]);

  const fetchCommissionDetails = async () => {
    try {
      const response = await fetch(buildApiPath(`/commission/${commissionId}`));
      const data = await response.json();

      if (data.success) {
        setCommission(data.commission);
        if (data.commission.paymentStatus === "paid") {
          setPaymentStatus("success");
        }
      } else {
        setError("Commission not found");
      }
    } catch (err) {
      setError("Failed to load commission details");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) return resolve(true);

      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    if (!commission || !commission.quotedBudget) {
      setError("Invalid commission or amount");
      return;
    }

    if (commission.status !== "approved") {
      setError("Commission must be approved before payment");
      return;
    }

    setPaymentLoading(true);
    setError(null);

    const scriptLoaded = await loadRazorpayScript();
    if (!scriptLoaded) {
      setError('Unable to load Razorpay checkout. Please refresh and try again.');
      setPaymentLoading(false);
      return;
    }

    try {
      // Step 1: Create order
      const orderResponse = await fetch(buildApiPath('/create-order'), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          commissionId: commissionId,
          amount: commission.quotedBudget
        })
      });

      const orderData = await orderResponse.json();

      if (!orderData.success) {
        setError("Failed to create payment order: " + (orderData.error || "Unknown error"));
        setPaymentLoading(false);
        return;
      }

      // Step 2: Initialize Razorpay
      const options = {
        key: orderData.key,
        amount: orderData.amount,
        currency: orderData.currency,
        order_id: orderData.orderId,
        customer_notification: 1,

        handler: async (response) => {
          // Payment successful - verify on backend
          try {
            const verifyResponse = await fetch(buildApiPath('/verify-payment'), {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                commissionId: commissionId,
                paymentId: response.razorpay_payment_id,
                orderId: response.razorpay_order_id,
                signature: response.razorpay_signature
              })
            });

            const verifyData = await verifyResponse.json();

            if (verifyData.success) {
              setPaymentStatus("success");
              setTimeout(() => {
                navigate("/", { state: { paymentSuccess: true } });
              }, 2000);
            } else {
              setPaymentStatus("failed");
              setError("Payment verification failed: " + verifyData.error);
            }
          } catch (err) {
            setPaymentStatus("failed");
            setError("Payment verification error: " + err.message);
            console.error(err);
          }
        },

        prefill: {
          name: commission.name || "",
          email: commission.email || "",
          contact: commission.phone || ""
        },

        notes: {
          commissionId: commissionId,
          referenceId: commission.referenceId
        },

        theme: {
          color: "#7c6f5d"
        },

        modal: {
          ondismiss: () => {
            setPaymentLoading(false);
            setError("Payment cancelled by user");
          }
        }
      };

      if (!window.Razorpay) {
        setError("Razorpay SDK not loaded. Please refresh the page.");
        setPaymentLoading(false);
        return;
      }

      const razorpayWindow = new window.Razorpay(options);
      razorpayWindow.open();

    } catch (err) {
      setError("Payment error: " + err.message);
      setPaymentLoading(false);
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-cream-50 flex items-center justify-center pt-24">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-earth-300 border-t-earth-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-warm-gray-600">Loading payment details...</p>
        </div>
      </div>
    );
  }

  if (paymentStatus === "success") {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-cream-50 pt-24">
        <Helmet><title>Payment Successful — Lalita Pathak Mithila Art</title></Helmet>
        <div className="container-custom section-padding text-center max-w-2xl mx-auto">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200 }}>
            <IoCheckmarkCircle className="text-mithila-green mx-auto mb-6" size={100} />
          </motion.div>
          <h1 className="heading-lg text-charcoal mb-4">Payment Successful! 🎉</h1>
          <p className="text-body max-w-lg mx-auto mb-8">
            Thank you for your payment! Lalita Pathak will now begin working on your custom Mithila masterpiece.
          </p>
          <p className="text-earth-500 font-semibold">We will keep you updated via email at {commission?.email}</p>
          <p className="text-warm-gray-500 text-sm mt-6">Redirecting to home...</p>
        </div>
      </motion.div>
    );
  }

  if (paymentStatus === "failed") {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-cream-50 pt-24">
        <Helmet><title>Payment Failed — Lalita Pathak Mithila Art</title></Helmet>
        <div className="container-custom section-padding text-center max-w-2xl mx-auto">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200 }}>
            <IoCloseCircle className="text-red-500 mx-auto mb-6" size={100} />
          </motion.div>
          <h1 className="heading-lg text-charcoal mb-4">Payment Failed</h1>
          <p className="text-body max-w-lg mx-auto mb-8">{error}</p>
          <button
            onClick={handlePayment}
            className="px-6 py-3 bg-earth-500 text-white rounded-xl hover:shadow-gold transition-all"
          >
            Try Again
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-cream-50 pt-24">
      <Helmet><title>Payment — Lalita Pathak Mithila Art</title></Helmet>
      <div className="container-custom section-padding max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl p-8 shadow-card">
          <h1 className="heading-lg text-charcoal mb-8 text-center">Complete Your Commission Payment</h1>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex gap-3">
              <IoWarning className="text-red-500 flex-shrink-0" size={24} />
              <div className="text-red-700">{error}</div>
            </div>
          )}

          {commission && (
            <div className="mb-8 p-6 bg-gradient-to-br from-earth-50 to-cream-50 rounded-xl border-2 border-earth-200">
              <div className="mb-6">
                <p className="text-warm-gray-600 text-sm mb-2">Commission Details</p>
                <p className="text-charcoal font-semibold mb-4">{commission.referenceId}</p>
                <div className="space-y-2 text-sm text-warm-gray-700">
                  <p><strong>Style:</strong> {commission.style}</p>
                  <p><strong>Size:</strong> {commission.size}</p>
                  <p><strong>Timeline:</strong> {commission.timeline || "Not specified"}</p>
                </div>
              </div>

              <div className="border-t border-earth-200 pt-6">
                <p className="text-warm-gray-600 text-sm mb-2">Amount Due</p>
                <p className="text-earth-700 font-display text-5xl font-bold">₹{commission.quotedBudget}</p>
                <p className="text-warm-gray-500 text-xs mt-2">Secured payment via Razorpay</p>
              </div>
            </div>
          )}

          <div className="mb-6">
            <h3 className="font-semibold text-charcoal mb-3">Payment Methods Available</h3>
            <div className="space-y-2 text-warm-gray-700">
              <p className="flex items-center gap-2">
                <span className="text-mithila-green">✓</span> PhonePe
              </p>
              <p className="flex items-center gap-2">
                <span className="text-mithila-green">✓</span> Google Pay
              </p>
              <p className="flex items-center gap-2">
                <span className="text-mithila-green">✓</span> Paytm
              </p>
              <p className="flex items-center gap-2">
                <span className="text-mithila-green">✓</span> UPI
              </p>
              <p className="flex items-center gap-2">
                <span className="text-mithila-green">✓</span> Credit/Debit Cards
              </p>
            </div>
          </div>

          <button
            onClick={handlePayment}
            disabled={paymentLoading}
            className="w-full px-6 py-4 bg-gradient-to-r from-earth-500 to-earth-600 text-white rounded-xl hover:shadow-gold transition-all font-semibold disabled:opacity-50"
          >
            {paymentLoading ? "Processing..." : "Proceed to Payment"}
          </button>

          <p className="text-center text-xs text-warm-gray-500 mt-6">
            Your payment is secure and encrypted. We use Razorpay, India's most trusted payment gateway.
          </p>
        </div>
      </div>
    </motion.div>
  );
}
