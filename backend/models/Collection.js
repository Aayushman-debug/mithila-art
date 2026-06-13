const mongoose = require('mongoose');

const CollectionSchema = new mongoose.Schema({
  collectionId: {
    type: String,
    required: true,
    unique: true,
  },
  title: {
    type: String,
    required: true,
  },
  titleHindi: {
    type: String,
    default: '',
  },
  description: {
    type: String,
    default: '',
  },
  coverImage: {
    type: String,
    default: '',
  },
  category: {
    type: String,
    index: true,
  },
  orderIndex: {
    type: Number,
    default: 0,
  },
  isFeatured: {
    type: Boolean,
    default: false,
    index: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Collection', CollectionSchema);
