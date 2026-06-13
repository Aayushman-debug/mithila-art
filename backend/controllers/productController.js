const Product = require('../models/Product');

const getProducts = async (req, res) => {
  try {
    const { collectionId, limit, page } = req.query;
    let query = {};
    if (collectionId) {
      query.collectionId = collectionId;
    }
    
    let productsQuery = Product.find(query).sort({ createdAt: -1 });
    
    if (limit) {
      const pageNum = parseInt(page) || 1;
      const limitNum = parseInt(limit);
      productsQuery = productsQuery.skip((pageNum - 1) * limitNum).limit(limitNum);
    }
    
    const products = await productsQuery.lean();
    // Allow browser/CDN caching for 60s to reduce redundant DB queries
    res.set('Cache-Control', 'public, max-age=60, stale-while-revalidate=120');
    res.status(200).json({ success: true, products });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ success: false, message: error.message || 'Could not fetch products' });
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await Product.findOne({ productId: req.params.productId }).lean();
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    res.status(200).json({ success: true, product });
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ success: false, message: error.message || 'Could not fetch product' });
  }
};

const createProduct = async (req, res) => {
  try {
    const { productId, title, description, category, size, price, image, gallery, stock, available } = req.body;

    if (!productId || !title || !price) {
      return res.status(400).json({ success: false, message: 'Product ID, title and price are required' });
    }

    const existing = await Product.findOne({ productId });
    if (existing) {
      return res.status(409).json({ success: false, message: 'Product ID already exists' });
    }

    const product = new Product({
      productId,
      title,
      description,
      category,
      size,
      price,
      image,
      gallery,
      stock: stock || 1,
      available: available !== undefined ? available : true,
    });

    await product.save();
    res.status(201).json({ success: true, product });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ success: false, message: error.message || 'Could not create product' });
  }
};

const updateProduct = async (req, res) => {
  try {
    const updates = req.body;
    const product = await Product.findOneAndUpdate({ productId: req.params.productId }, updates, {
      new: true,
      runValidators: true,
    });

    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

    res.status(200).json({ success: true, product });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ success: false, message: error.message || 'Could not update product' });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findOneAndDelete({ productId: req.params.productId });
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    res.status(200).json({ success: true, message: 'Product deleted' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ success: false, message: error.message || 'Could not delete product' });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
