const express = require('express');
const { authenticate, authorizeAdmin } = require('../middleware/authMiddleware');
const { getUsers, getOrders, getCommissions, getProducts, updateOrderStatus, verifyPayment, rejectPayment } = require('../controllers/adminController');

const router = express.Router();

router.use(authenticate, authorizeAdmin);
router.get('/users', getUsers);
router.get('/orders', getOrders);
router.put('/orders/:id/status', updateOrderStatus);
router.put('/orders/:id/verify-payment', verifyPayment);
router.put('/orders/:id/reject-payment', rejectPayment);
router.get('/commissions', getCommissions);
router.get('/products', getProducts);

module.exports = router;
