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
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Product', ProductSchema);
