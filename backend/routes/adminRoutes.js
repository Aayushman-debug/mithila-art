const express = require('express');
const { authenticate, authorizeAdmin } = require('../middleware/authMiddleware');
const { getUsers, getOrders, getCommissions, getProducts, updateProduct, updateOrderStatus, verifyPayment, rejectPayment, migrateArtworkImages } = require('../controllers/adminController');

const router = express.Router();

router.use(authenticate, authorizeAdmin);
router.get('/users', getUsers);
router.get('/orders', getOrders);
router.put('/orders/:id/status', updateOrderStatus);
router.put('/orders/:id/verify-payment', verifyPayment);
router.put('/orders/:id/reject-payment', rejectPayment);
router.get('/commissions', getCommissions);
router.get('/products', getProducts);
router.put('/products/:productId', updateProduct);
router.post('/migrate-artwork-images', migrateArtworkImages);

module.exports = router;
