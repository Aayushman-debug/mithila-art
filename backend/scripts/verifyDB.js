const mongoose = require('mongoose');
require('dotenv').config({ path: '../.env' });
const Product = require('../models/Product');
const Collection = require('../models/Collection');

async function verify() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/mithilaReviews");
    console.log("Connected to DB.");

    const collectionsCount = await Collection.countDocuments();
    const productsCount = await Product.countDocuments();

    console.log(`Collections: ${collectionsCount}`);
    console.log(`Products: ${productsCount}`);

    const products = await Product.find().lean();
    let orphanProducts = 0;
    let missingImages = 0;

    for (const p of products) {
      if (!p.collectionId) {
        orphanProducts++;
      }
      if (!p.images || p.images.length === 0) {
        missingImages++;
      }
    }

    console.log(`Products without collectionId: ${orphanProducts}`);
    console.log(`Products with missing structured images: ${missingImages}`);

    const collections = await Collection.find().lean();
    let collectionsWithoutCover = 0;
    for (const c of collections) {
      if (!c.coverImage) {
        collectionsWithoutCover++;
      }
    }
    console.log(`Collections without cover image: ${collectionsWithoutCover}`);

    console.log("Verification done.");
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

verify();
