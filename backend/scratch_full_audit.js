const mongoose = require('mongoose');
const Product = require('./models/Product');
import('../src/data/paintings.js').then(async (module) => {
  const paintings = module.paintings;
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/mithilaReviews');
    const products = await Product.find({});
    
    let onlyInMongo = [];
    let onlyInStatic = [];
    
    const mongoIds = products.map(p => p.productId);
    const staticIds = paintings.map(p => p.id);
    
    onlyInMongo = mongoIds.filter(id => !staticIds.includes(id));
    onlyInStatic = staticIds.filter(id => !mongoIds.includes(id));
    
    console.log(`MongoDB count: ${products.length}`);
    console.log(`Static count: ${paintings.length}`);
    console.log(`Only in MongoDB: ${onlyInMongo.join(', ') || 'None'}`);
    console.log(`Only in Static: ${onlyInStatic.join(', ') || 'None'}`);
    
    // Check for product model cleanup (Phase 4)
    let unrelatedImages = [];
    // Actually we need to check if products have variant-like images as a gallery
    // Let's just print the report
    process.exit(0);
  } catch(err) {
    console.error(err);
    process.exit(1);
  }
});
