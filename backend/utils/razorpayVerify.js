const crypto = require('crypto');

/**
 * Verifies a Razorpay payment signature using HMAC-SHA256.
 *
 * Call this BEFORE marking any order as paid.
 * Razorpay signs: orderId + '|' + paymentId with your key secret.
 *
 * @param {string} orderId    - Razorpay order_id returned at order creation
 * @param {string} paymentId  - razorpay_payment_id from the client callback
 * @param {string} signature  - razorpay_signature from the client callback
 * @returns {boolean}         - true only if the signature is cryptographically valid
 *
 * Usage:
 *   const { verifyRazorpaySignature } = require('../utils/razorpayVerify');
 *   if (!verifyRazorpaySignature(orderId, paymentId, signature)) {
 *     return res.status(400).json({ success: false, message: 'Payment verification failed' });
 *   }
 */
const verifyRazorpaySignature = (orderId, paymentId, signature) => {
  if (!orderId || !paymentId || !signature) return false;

  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keySecret) {
    throw new Error('RAZORPAY_KEY_SECRET is not set in environment variables');
  }

  const body = `${orderId}|${paymentId}`;
  const expectedSignature = crypto
    .createHmac('sha256', keySecret)
    .update(body)
    .digest('hex');

  // Use timingSafeEqual to prevent timing-based side-channel attacks
  const expectedBuffer = Buffer.from(expectedSignature, 'hex');
  const receivedBuffer = Buffer.from(signature, 'hex');

  if (expectedBuffer.length !== receivedBuffer.length) return false;

  return crypto.timingSafeEqual(expectedBuffer, receivedBuffer);
};

module.exports = { verifyRazorpaySignature };
