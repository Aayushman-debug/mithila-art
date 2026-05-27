const express = require('express');
const { authenticate, authorizeAdmin } = require('../middleware/authMiddleware');
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');

const router = express.Router();

router.get('/', getProducts);
router.get('/:productId', getProductById);
router.post('/', authenticate, authorizeAdmin, createProduct);
router.put('/:productId', authenticate, authorizeAdmin, updateProduct);
router.delete('/:productId', authenticate, authorizeAdmin, deleteProduct);

module.exports = router;
