const User = require('../models/User');
const CartOrder = require('../models/CartOrder');
const Commission = require('../models/Commission');
const Product = require('../models/Product');

const getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password -resetPasswordToken -resetPasswordExpires');
    res.status(200).json({ success: true, users });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ success: false, message: error.message || 'Could not fetch users' });
  }
};

const getOrders = async (req, res) => {
  try {
    const orders = await CartOrder.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, orders });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ success: false, message: error.message || 'Could not fetch orders' });
  }
};

const getCommissions = async (req, res) => {
  try {
    const commissions = await Commission.find().sort({ submittedAt: -1 });
    res.status(200).json({ success: true, commissions });
  } catch (error) {
    console.error('Get commissions error:', error);
    res.status(500).json({ success: false, message: error.message || 'Could not fetch commissions' });
  }
};

const getProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, products });
  } catch (error) {
    console.error('Get admin products error:', error);
    res.status(500).json({ success: false, message: error.message || 'Could not fetch products' });
  }
};

module.exports = {
  getUsers,
  getOrders,
  getCommissions,
  getProducts,
};
