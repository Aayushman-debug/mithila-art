const mongoose = require('mongoose');
const Product = require('./models/Product');

(async () => {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/mithilaReviews');
    const products = await Product.find({});
    console.log('MongoDB count:', products.length);
    console.log('MongoDB IDs:', products.map(p => p.productId).join(', '));
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
