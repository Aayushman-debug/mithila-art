const User = require('../models/User');
const CartOrder = require('../models/CartOrder');
const Commission = require('../models/Commission');
const Product = require('../models/Product');
const Collection = require('../models/Collection');

const getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password -resetPasswordToken -resetPasswordExpires').lean();
    res.status(200).json({ success: true, users });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ success: false, message: error.message || 'Could not fetch users' });
  }
};

const getOrders = async (req, res) => {
  try {
    const orders = await CartOrder.find().sort({ createdAt: -1 }).lean();
    res.status(200).json({ success: true, orders });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ success: false, message: error.message || 'Could not fetch orders' });
  }
};

const getCommissions = async (req, res) => {
  try {
    const commissions = await Commission.find().sort({ submittedAt: -1 }).lean();
    res.status(200).json({ success: true, commissions });
  } catch (error) {
    console.error('Get commissions error:', error);
    res.status(500).json({ success: false, message: error.message || 'Could not fetch commissions' });
  }
};

const getProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 }).lean();
    res.status(200).json({ success: true, products });
  } catch (error) {
    console.error('Get admin products error:', error);
    res.status(500).json({ success: false, message: error.message || 'Could not fetch products' });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const allowedFields = ['availabilityStatus', 'title', 'price', 'inStock', 'category', 'description'];
    const updates = {};
    for (const key of allowedFields) {
      if (req.body[key] !== undefined) updates[key] = req.body[key];
    }
    const product = await Product.findByIdAndUpdate(productId, updates, { new: true, runValidators: true });
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.status(200).json({ success: true, product });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ success: false, message: error.message || 'Could not update product' });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!status || !['Pending', 'Processing', 'Shipped', 'Delivered', 'Pending Payment Verification'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }
    const order = await CartOrder.findByIdAndUpdate(id, { status }, { new: true });
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    res.status(200).json({ success: true, order });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ success: false, message: error.message || 'Could not update order status' });
  }
};

const verifyPayment = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await CartOrder.findById(id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    order.paymentVerification = 'verified';
    order.paymentStatus = 'paid';
    order.status = 'Processing';
    order.paidAt = new Date();
    await order.save();
    res.status(200).json({ success: true, order });
  } catch (error) {
    console.error('Verify payment error:', error);
    res.status(500).json({ success: false, message: error.message || 'Could not verify payment' });
  }
};

const rejectPayment = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await CartOrder.findById(id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    order.paymentVerification = 'rejected';
    order.paymentStatus = 'failed';
    order.status = 'Pending';
    await order.save();
    res.status(200).json({ success: true, order });
  } catch (error) {
    console.error('Reject payment error:', error);
    res.status(500).json({ success: false, message: error.message || 'Could not reject payment' });
  }
};

const migrateArtworkImages = async (req, res) => {
  try {
    console.log('[Migration] Starting artwork image migration on production database');
    
    let productUpdates = 0;
    let collectionUpdates = 0;

    // Map of common image filenames to public URLs
    const imageUrlMap = {
      'radha_krishna_kachni.jpg': '/paintings/gallery_batch_1/radha_krishna_kachni.jpg',
      'durga_red.jpg': '/paintings/gallery_batch_1/durga_red.jpg',
      'radha_krishna_bharni.jpg': '/paintings/gallery_batch_1/radha_krishna_bharni.jpg',
      'durga_black_red.jpg': '/paintings/gallery_batch_1/durga_black_red.jpg',
      'ganesha_colored.jpg': '/paintings/gallery_batch_1/ganesha_colored.jpg',
      'ganesha_pink.jpg': '/paintings/gallery_batch_2/ganesha_pink.jpg',
      'krishna_cow.jpg': '/paintings/gallery_batch_2/krishna_cow.jpg',
      'painted_saree.jpg': '/paintings/gallery_batch_2/painted_saree.jpg',
      'radha_krishna_kachni_2.jpg': '/paintings/gallery_batch_2/radha_krishna_kachni_2.jpg',
      'bride.jpeg': '/paintings/bride.jpeg',
      'fish.jpeg': '/paintings/fish.jpeg',
      'Mummy.jpeg': '/paintings/Mummy.jpeg',
      'idkthecontext.jpeg': '/paintings/idkthecontext.jpeg',
      'peacockOne.jpeg': '/paintings/peacockOne.jpeg',
      'shivparvatiblacknwhite.jpeg': '/paintings/shivparvatiblacknwhite.jpeg',
      'Shivparvatimarriage.jpeg': '/paintings/Shivparvatimarriage.jpeg',
    };

    // Helper to resolve a local filename to a public URL
    const resolveUrl = (rawUrl) => {
      if (!rawUrl) return null;
      if (rawUrl.startsWith('/')) return rawUrl;
      if (rawUrl.startsWith('http')) return rawUrl;
      
      const filename = rawUrl.split('/').pop();
      if (imageUrlMap[filename]) {
        return imageUrlMap[filename];
      }
      
      return `/paintings/${filename}`;
    };

    // Update Products
    const products = await Product.find().exec();
    for (const product of products) {
      let changed = false;

      // Update main image
      if (product.image) {
        const resolved = resolveUrl(product.image);
        if (resolved !== product.image) {
          product.image = resolved;
          changed = true;
        }
      }

      // Update gallery array
      if (Array.isArray(product.gallery)) {
        product.gallery = product.gallery
          .map(url => resolveUrl(url))
          .filter(Boolean);
        changed = true;
      }

      // Update images array (if it has url field)
      if (Array.isArray(product.images)) {
        product.images = product.images.map(item => {
          if (typeof item === 'string') {
            return { url: resolveUrl(item) };
          }
          if (item?.url) {
            item.url = resolveUrl(item.url);
          }
          return item;
        });
        changed = true;
      }

      if (changed) {
        await product.save();
        productUpdates++;
      }
    }

    // Update Collections
    const collections = await Collection.find().exec();
    for (const collection of collections) {
      let changed = false;

      if (collection.coverImage) {
        const resolved = resolveUrl(collection.coverImage);
        if (resolved !== collection.coverImage) {
          collection.coverImage = resolved;
          changed = true;
        }
      }

      if (changed) {
        await collection.save();
        collectionUpdates++;
      }
    }

    const summary = {
      success: true,
      message: 'Image migration completed',
      productsUpdated: productUpdates,
      collectionsUpdated: collectionUpdates,
      timestamp: new Date().toISOString(),
    };

    console.log('[Migration] Complete:', summary);
    res.status(200).json(summary);
  } catch (error) {
    console.error('[Migration] Error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Migration failed',
      error: error.toString()
    });
  }
};

module.exports = {
  getUsers,
  getOrders,
  getCommissions,
  getProducts,
  updateProduct,
  updateOrderStatus,
  verifyPayment,
  rejectPayment,
  migrateArtworkImages,
};
