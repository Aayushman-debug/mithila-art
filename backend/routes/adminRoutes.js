const express = require('express');
const { authenticate, authorizeAdmin } = require('../middleware/authMiddleware');
const { getUsers, getOrders, getCommissions, getProducts, updateProduct, updateOrderStatus, verifyPayment, rejectPayment, deleteOrder, cleanupBase64Images, getCoupons, createCoupon, toggleCoupon, deleteCoupon } = require('../controllers/adminController');

const router = express.Router();

router.use(authenticate, authorizeAdmin);
router.post('/cleanup', cleanupBase64Images);
router.get('/users', getUsers);
router.get('/orders', getOrders);
router.put('/orders/:id/status', updateOrderStatus);
router.put('/orders/:id/verify-payment', verifyPayment);
router.put('/orders/:id/reject-payment', rejectPayment);
router.delete('/orders/:id', deleteOrder);
router.get('/commissions', getCommissions);
router.get('/products', getProducts);
router.put('/products/:productId', updateProduct);
router.get('/coupons', getCoupons);
router.post('/coupons', createCoupon);
router.put('/coupons/:id/toggle', toggleCoupon);
router.delete('/coupons/:id', deleteCoupon);

module.exports = router;
