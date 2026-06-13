const mongoose = require('mongoose');
const Product = require('../models/Product');
const Collection = require('../models/Collection');
require('dotenv').config();

(async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    const productCount = await Product.countDocuments();
    const collectionCount = await Collection.countDocuments();
    console.log('Products:', productCount);
    console.log('Collections:', collectionCount);

    const products = await Product.find().lean();
    let localCount = 0;
    let cloudinaryCount = 0;
    let externalCount = 0;
    let missingCount = 0;
    let totalProducts = products.length;

    for (const p of products) {
      const imageUrl = p.images?.[0]?.url || p.image || '';
      let type = 'missing';
      if (!imageUrl) {
        missingCount += 1;
      } else if (imageUrl.startsWith('/src/') || imageUrl.startsWith('./src/') || imageUrl.startsWith('src/')) {
        localCount += 1;
        type = 'local';
      } else if (imageUrl.includes('cloudinary.com')) {
        cloudinaryCount += 1;
        type = 'cloudinary';
      } else if (imageUrl.startsWith('http')) {
        externalCount += 1;
        type = 'external';
      } else {
        localCount += 1;
        type = 'local';
      }
      if (type !== 'missing') {
        console.log('---');
        console.log('productId:', p.productId, 'title:', p.title);
        console.log('resolved imageUrl:', imageUrl);
        console.log('resolved type:', type);
        console.log('images length:', Array.isArray(p.images) ? p.images.length : 'NA');
        if (Array.isArray(p.images)) {
          p.images.forEach((img, idx) => console.log(` images[${idx}]:`, typeof img === 'string' ? img : JSON.stringify(img)));
        }
      }
    }
    console.log('Product image counts:');
    console.log(' - total:', totalProducts);
    console.log(' - missing:', missingCount);
    console.log(' - local paths:', localCount);
    console.log(' - cloudinary:', cloudinaryCount);
    console.log(' - external:', externalCount);

    const collections = await Collection.find().lean();
    console.log('Collection coverage:', collections.length, 'found');
    for (const c of collections) {
      console.log('===');
      console.log('collectionId:', c.collectionId, 'title:', c.title, 'coverImage:', c.coverImage);
    }
    for (const c of collections) {
      console.log('===');
      console.log('collectionId:', c.collectionId, 'title:', c.title, 'coverImage:', c.coverImage);
    }

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Audit failed:', error);
    process.exit(1);
  }
})();
