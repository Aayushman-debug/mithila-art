const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  productId: {
    type: String,
    required: true,
    unique: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: String,
  category: { type: String, index: true },
  size: String,
  price: {
    type: Number,
    required: true,
    index: true,
  },
  image: String,
  gallery: [String],
  stock: {
    type: Number,
    default: 1,
  },
  available: {
    type: Boolean,
    default: true,
    index: true,
  },
  availabilityStatus: {
    type: String,
    enum: ['available', 'only_1_left', 'out_of_stock', 'coming_soon', 'commission_available'],
    default: 'available',
    index: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Product', ProductSchema);
