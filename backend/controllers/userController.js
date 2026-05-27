const User = require('../models/User');
const CartOrder = require('../models/CartOrder');
const Commission = require('../models/Commission');

const getCart = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('cart');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.status(200).json({ success: true, cart: user.cart || [] });
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({ success: false, message: error.message || 'Could not fetch cart' });
  }
};

const saveCart = async (req, res) => {
  try {
    const { cart } = req.body;
    if (!Array.isArray(cart)) {
      return res.status(400).json({ success: false, message: 'Cart must be an array' });
    }

    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { cart },
      { new: true, runValidators: true }
    ).select('cart');

    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    res.status(200).json({ success: true, cart: user.cart });
  } catch (error) {
    console.error('Save cart error:', error);
    res.status(500).json({ success: false, message: error.message || 'Could not save cart' });
  }
};

const getWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('wishlist');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.status(200).json({ success: true, wishlist: user.wishlist || [] });
  } catch (error) {
    console.error('Get wishlist error:', error);
    res.status(500).json({ success: false, message: error.message || 'Could not fetch wishlist' });
  }
};

const toggleWishlist = async (req, res) => {
  try {
    const { productId, title, price, image, size, category } = req.body;
    if (!productId) {
      return res.status(400).json({ success: false, message: 'Product ID required' });
    }

    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const existingIndex = user.wishlist.findIndex((item) => item.productId === productId);

    if (existingIndex >= 0) {
      user.wishlist.splice(existingIndex, 1);
    } else {
      user.wishlist.push({ productId, title, price, image, size, category });
    }

    await user.save();
    res.status(200).json({ success: true, wishlist: user.wishlist });
  } catch (error) {
    console.error('Toggle wishlist error:', error);
    res.status(500).json({ success: false, message: error.message || 'Could not update wishlist' });
  }
};

const getOrders = async (req, res) => {
  try {
    const orders = await CartOrder.find({ user: req.user.userId }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, orders });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ success: false, message: error.message || 'Could not fetch orders' });
  }
};

const getCommissions = async (req, res) => {
  try {
    const commissions = await Commission.find({ user: req.user.userId }).sort({ submittedAt: -1 });
    res.status(200).json({ success: true, commissions });
  } catch (error) {
    console.error('Get commissions error:', error);
    res.status(500).json({ success: false, message: error.message || 'Could not fetch commissions' });
  }
};

const getAddresses = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('addresses');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.status(200).json({ success: true, addresses: user.addresses || [] });
  } catch (error) {
    console.error('Get addresses error:', error);
    res.status(500).json({ success: false, message: error.message || 'Could not fetch addresses' });
  }
};

const addAddress = async (req, res) => {
  try {
    const { label, line1, city, state, pincode, phone } = req.body;
    if (!line1 || !city || !state || !pincode || !phone) {
      return res.status(400).json({ success: false, message: 'Address line, city, state, pincode and phone are required' });
    }

    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    user.addresses.push({ label: label || 'Home', line1, city, state, pincode, phone });
    await user.save();

    res.status(200).json({ success: true, addresses: user.addresses });
  } catch (error) {
    console.error('Add address error:', error);
    res.status(500).json({ success: false, message: error.message || 'Could not add address' });
  }
};

const removeAddress = async (req, res) => {
  try {
    const { addressId } = req.params;
    if (!addressId) {
      return res.status(400).json({ success: false, message: 'Address ID required' });
    }

    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    user.addresses = user.addresses.filter((address) => address._id.toString() !== addressId);
    await user.save();

    res.status(200).json({ success: true, addresses: user.addresses });
  } catch (error) {
    console.error('Remove address error:', error);
    res.status(500).json({ success: false, message: error.message || 'Could not remove address' });
  }
};

module.exports = {
  getCart,
  saveCart,
  getWishlist,
  toggleWishlist,
  getOrders,
  getCommissions,
  getAddresses,
  addAddress,
  removeAddress,
};
