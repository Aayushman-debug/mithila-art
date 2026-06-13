const mongoose = require('mongoose');
require('dotenv').config({ path: '../.env' });
const Product = require('../models/Product');
const Collection = require('../models/Collection');

async function migrate() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/mithilaReviews");
    console.log("Connected to MongoDB for migration.");

    const products = await Product.find({ collectionId: { $exists: false } });
    console.log(`Found ${products.length} products to migrate.`);

    const titleGroups = {};
    for (const product of products) {
      if (!titleGroups[product.title]) {
        titleGroups[product.title] = [];
      }
      titleGroups[product.title].push(product);
    }

    let orderIndex = 0;
    for (const title in titleGroups) {
      const group = titleGroups[title];
      const firstProduct = group[0];

      // Create a collection
      const collection = new Collection({
        collectionId: `c_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
        title: title,
        titleHindi: firstProduct.titleHindi || '',
        description: firstProduct.description,
        coverImage: firstProduct.image || (firstProduct.gallery && firstProduct.gallery[0]) || '',
        category: firstProduct.category,
        orderIndex: orderIndex++,
        isFeatured: firstProduct.featured || false,
      });

      const savedCollection = await collection.save();
      console.log(`Created Collection: ${title}`);

      // Update products in this group
      for (const product of group) {
        product.collectionId = savedCollection._id;
        
        // Ensure image structure is somewhat compliant if they just had image strings
        if (product.image && (!product.images || product.images.length === 0)) {
          product.images = [{ url: product.image, public_id: '' }];
        } else if (product.gallery && product.gallery.length > 0 && (!product.images || product.images.length === 0)) {
          product.images = product.gallery.map(img => ({ url: img, public_id: '' }));
        }

        await product.save();
      }
    }

    console.log("Migration complete!");
    process.exit(0);
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  }
}

migrate();
