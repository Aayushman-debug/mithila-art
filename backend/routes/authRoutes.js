const express = require('express');
const {
  register,
  login,
  getProfile,
  updateProfile,
  logout,
  forgotPassword,
  resetPassword,
  verifyEmail,
  resendVerification,
  googleLogin,
  facebookLogin,
} = require('../controllers/authController');
const { authenticate } = require('../middleware/authMiddleware');

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/forgot', forgotPassword);
router.post('/reset/:token', resetPassword);
router.get('/verify/:token', verifyEmail);
router.post('/resend-verification', resendVerification);
router.post('/google', googleLogin);
router.post('/facebook', facebookLogin);

// Protected routes
router.get('/profile', authenticate, getProfile);
router.get('/me', authenticate, getProfile);
router.put('/profile', authenticate, updateProfile);
router.post('/logout', authenticate, logout);

module.exports = router;
