const mongoose = require('mongoose');

const CartOrderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  pincode: { type: String, required: true },
  items: [
    {
      productId: String,
      title: String,
      quantity: Number,
      price: Number,
      image: String,
    },
  ],
  totalAmount: { type: Number, required: true },
  shipping: { type: Number, required: true },
  grandTotal: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  couponCode: { type: String },
  orderId: String,
  paymentId: String,
  transactionId: String,
  paymentMethod: { type: String, enum: ['razorpay', 'upi'], default: 'razorpay' },
  paymentScreenshot: { type: String },
  paymentVerification: { type: String, enum: ['pending', 'verified', 'rejected'], default: 'pending' },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'awaiting_verification'],
    default: 'pending',
  },
  status: {
    type: String,
    enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Pending Payment Verification'],
    default: 'Pending',
  },
  createdAt: { type: Date, default: Date.now },
  paidAt: Date,
});

module.exports = mongoose.model('CartOrder', CartOrderSchema);
