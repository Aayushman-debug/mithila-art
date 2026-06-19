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
  medium: String,
  style: String,
  price: {
    type: Number,
    required: true,
    index: true,
  },
  originalPrice: Number,
  image: String, // Kept for backward compatibility during transition
  gallery: [String], // Kept for backward compatibility
  images: [{
    url: String,
    public_id: String
  }],
  featured: {
    type: Boolean,
    default: false,
    index: true,
  },
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
  variants: [{
    variantId: { type: String, required: true },
    variantName: String,
    image: { url: String, public_id: String },
    size: String,
    medium: String,
    price: Number,
    stock: { type: Number, default: 1 },
    availabilityStatus: {
      type: String,
      enum: ['available', 'only_1_left', 'out_of_stock', 'coming_soon', 'commission_available'],
      default: 'available',
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Product', ProductSchema);
