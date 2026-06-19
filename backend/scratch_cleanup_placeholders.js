const mongoose = require('mongoose');
const Product = require('./models/Product');
(async () => {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/mithilaReviews');
    const products = await Product.find({});
    let updatedCount = 0;
    for (const p of products) {
      const cleanGallery = (p.gallery || []).filter(url => !url.includes('picsum.photos'));
      const cleanImages = (p.images || []).filter(img => !img.url || !img.url.includes('picsum.photos'));
      if (cleanGallery.length !== p.gallery.length || cleanImages.length !== p.images.length) {
        p.gallery = cleanGallery;
        p.images = cleanImages;
        await p.save();
        updatedCount++;
      }
    }
    console.log('Phase 4 cleanup done:', updatedCount, 'products updated');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
