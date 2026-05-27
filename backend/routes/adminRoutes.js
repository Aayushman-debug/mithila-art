const express = require('express');
const { authenticate, authorizeAdmin } = require('../middleware/authMiddleware');
const { getUsers, getOrders, getCommissions, getProducts } = require('../controllers/adminController');

const router = express.Router();

router.use(authenticate, authorizeAdmin);
router.get('/users', getUsers);
router.get('/orders', getOrders);
router.get('/commissions', getCommissions);
router.get('/products', getProducts);

module.exports = router;
