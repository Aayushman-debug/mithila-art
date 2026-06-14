const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const Product = require('../models/Product');

async function cleanup() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected.');

    const products = await Product.find({});
    console.log(`Found ${products.length} products total.`);

    let count = 0;
    for (const product of products) {
      let needsSave = false;
      
      if (product.images && product.images.length > 0) {
        // Filter out base64 images that are excessively large
        const initialLen = product.images.length;
        product.images = product.images.filter(img => {
          if (img.url && img.url.startsWith('data:image') && img.url.length > 100000) {
            console.log(`Removing large base64 image (${Math.round(img.url.length / 1024)} KB) from product ${product.title}`);
            return false;
          }
          return true;
        });

        if (product.images.length !== initialLen) {
          needsSave = true;
        }
      }

      if (needsSave) {
        await product.save();
        count++;
        console.log(`Updated product: ${product.title}`);
      }
    }

    console.log(`Cleanup complete. Fixed ${count} products.`);
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

cleanup();
