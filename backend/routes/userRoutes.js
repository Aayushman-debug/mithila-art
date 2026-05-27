const express = require('express');
const { authenticate } = require('../middleware/authMiddleware');
const {
  getCart,
  saveCart,
  getWishlist,
  toggleWishlist,
  getOrders,
  getCommissions,
  getAddresses,
  addAddress,
  removeAddress,
} = require('../controllers/userController');

const router = express.Router();

router.get('/cart', authenticate, getCart);
router.post('/cart', authenticate, saveCart);
router.get('/wishlist', authenticate, getWishlist);
router.post('/wishlist/toggle', authenticate, toggleWishlist);
router.get('/orders', authenticate, getOrders);
router.get('/commissions', authenticate, getCommissions);
router.get('/addresses', authenticate, getAddresses);
router.post('/addresses', authenticate, addAddress);
router.delete('/addresses/:addressId', authenticate, removeAddress);

module.exports = router;
