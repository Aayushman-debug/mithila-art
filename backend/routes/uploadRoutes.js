const express = require('express');
const router = express.Router();
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;
const { authenticate, authorizeAdmin } = require('../middleware/authMiddleware');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure Multer storage for Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'mithila_art_uploads',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ width: 1200, crop: 'limit' }] // Optimize large images
  },
});

const upload = multer({ storage: storage });

// @route   POST /api/upload
// @desc    Upload an image
// @access  Private/Admin
router.post('/', authenticate, authorizeAdmin, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }
    
    // Cloudinary details are in req.file
    res.status(200).json({
      success: true,
      url: req.file.path,
      public_id: req.file.filename,
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ success: false, message: 'Image upload failed' });
  }
});

// @route   POST /api/upload/delete
// @desc    Delete an image from Cloudinary
// @access  Private/Admin
router.post('/delete', authenticate, authorizeAdmin, async (req, res) => {
  try {
    const { public_id } = req.body;
    
    if (!public_id) {
      return res.status(400).json({ success: false, message: 'public_id is required' });
    }
    
    const result = await cloudinary.uploader.destroy(public_id);
    
    if (result.result === 'ok') {
      res.status(200).json({ success: true, message: 'Image deleted' });
    } else {
      res.status(400).json({ success: false, message: 'Failed to delete image', result });
    }
  } catch (error) {
    console.error('Delete image error:', error);
    res.status(500).json({ success: false, message: 'Image deletion failed' });
  }
});

module.exports = router;
