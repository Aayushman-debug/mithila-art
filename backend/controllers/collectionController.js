const Collection = require('../models/Collection');
const Product = require('../models/Product');

const getCollections = async (req, res) => {
  try {
    const collections = await Collection.find().sort({ orderIndex: 1, createdAt: -1 }).lean();
    res.status(200).json({ success: true, collections });
  } catch (error) {
    console.error('Get collections error:', error);
    res.status(500).json({ success: false, message: error.message || 'Could not fetch collections' });
  }
};

const getCollectionById = async (req, res) => {
  try {
    const collection = await Collection.findById(req.params.id).lean();
    if (!collection) return res.status(404).json({ success: false, message: 'Collection not found' });
    
    // Also fetch the artworks for this collection
    const products = await Product.find({ collectionId: collection._id }).lean();
    
    res.status(200).json({ success: true, collection, products });
  } catch (error) {
    console.error('Get collection error:', error);
    res.status(500).json({ success: false, message: error.message || 'Could not fetch collection' });
  }
};

const createCollection = async (req, res) => {
  try {
    const collection = new Collection(req.body);
    await collection.save();
    res.status(201).json({ success: true, collection });
  } catch (error) {
    console.error('Create collection error:', error);
    res.status(500).json({ success: false, message: error.message || 'Could not create collection' });
  }
};

const updateCollection = async (req, res) => {
  try {
    const collection = await Collection.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!collection) return res.status(404).json({ success: false, message: 'Collection not found' });
    res.status(200).json({ success: true, collection });
  } catch (error) {
    console.error('Update collection error:', error);
    res.status(500).json({ success: false, message: error.message || 'Could not update collection' });
  }
};

const deleteCollection = async (req, res) => {
  try {
    const collection = await Collection.findByIdAndDelete(req.params.id);
    if (!collection) return res.status(404).json({ success: false, message: 'Collection not found' });
    
    // Unset collectionId for products that were in this collection
    await Product.updateMany({ collectionId: collection._id }, { $unset: { collectionId: 1 } });
    
    res.status(200).json({ success: true, message: 'Collection deleted' });
  } catch (error) {
    console.error('Delete collection error:', error);
    res.status(500).json({ success: false, message: error.message || 'Could not delete collection' });
  }
};

module.exports = {
  getCollections,
  getCollectionById,
  createCollection,
  updateCollection,
  deleteCollection,
};
