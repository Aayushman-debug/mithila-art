const mongoose = require('mongoose');
const Product = require('./models/Product');
(async () => {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/mithilaReviews');
    const products = await Product.find({});
    
    products.forEach(p => {
        let imageCount = p.images ? p.images.length : 0;
        let galleryCount = p.gallery ? p.gallery.length : 0;
        console.log(`Product: ${p.productId} | Title: ${p.title} | Main Image: ${p.image} | Images Array: ${imageCount} | Gallery Array: ${galleryCount}`);
        if(p.images) {
            p.images.forEach((img, idx) => {
                console.log(`  img ${idx}: ${img.url}`);
            });
        }
        if(p.gallery) {
            p.gallery.forEach((g, idx) => {
                console.log(`  gallery ${idx}: ${g}`);
            });
        }
    });
    
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
