const mongoose = require('mongoose');

const CommissionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  location: { type: String, required: true },
  style: { type: String, required: true },
  size: { type: String, required: true },
  colors: { type: String },
  description: { type: String, required: true },
  timeline: { type: String },
  status: {
    type: String,
    enum: ['submitted', 'approved', 'rejected', 'in-progress', 'completed'],
    default: 'submitted',
  },
  quotedBudget: { type: Number },
  approvalMessage: { type: String },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed'],
    default: 'pending',
  },
  orderId: { type: String },
  paymentId: { type: String },
  transactionId: { type: String },
  submittedAt: { type: Date, default: Date.now },
  approvedAt: { type: Date },
  paidAt: { type: Date },
  referenceId: {
    type: String,
    default: () => 'COM' + Date.now().toString().slice(-6),
  },
});

module.exports = mongoose.model('Commission', CommissionSchema);
