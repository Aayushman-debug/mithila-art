const User = require('../models/User');
const CartOrder = require('../models/CartOrder');
const Commission = require('../models/Commission');
const Product = require('../models/Product');

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

const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await CartOrder.findByIdAndDelete(id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    res.status(200).json({ success: true, message: 'Order deleted successfully' });
  } catch (error) {
    console.error('Delete order error:', error);
    res.status(500).json({ success: false, message: error.message || 'Could not delete order' });
  }
};

const cleanupBase64Images = async (req, res) => {
  try {
    const products = await Product.find({});
    let count = 0;
    for (const product of products) {
      let needsSave = false;
      if (product.images && product.images.length > 0) {
        const initialLen = product.images.length;
        product.images = product.images.filter(img => {
          if (img.url && img.url.startsWith('data:image') && img.url.length > 100000) {
            return false;
          }
          return true;
        });
        if (product.images.length !== initialLen) needsSave = true;
      }
      if (needsSave) {
        await product.save();
        count++;
      }
    }
    res.status(200).json({ success: true, message: `Cleaned up ${count} products with massive base64 images.` });
  } catch (error) {
    console.error('Cleanup error:', error);
    res.status(500).json({ success: false, message: error.message || 'Cleanup failed' });
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
  deleteOrder,
  cleanupBase64Images,
};
