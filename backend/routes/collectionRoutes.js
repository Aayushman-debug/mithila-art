const express = require('express');
const router = express.Router();
const {
  getCollections,
  getCollectionById,
  createCollection,
  updateCollection,
  deleteCollection,
} = require('../controllers/collectionController');
const { authenticate, authorizeAdmin } = require('../middleware/authMiddleware');

router.route('/')
  .get(getCollections)
  .post(authenticate, authorizeAdmin, createCollection);

router.route('/:id')
  .get(getCollectionById)
  .put(authenticate, authorizeAdmin, updateCollection)
  .delete(authenticate, authorizeAdmin, deleteCollection);

module.exports = router;
