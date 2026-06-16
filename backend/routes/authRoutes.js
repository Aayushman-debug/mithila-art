const express = require('express');
const rateLimit = require('express-rate-limit');
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

// ── Rate limiters ────────────────────────────────────────────────
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many login attempts. Please try again in 15 minutes.' },
});

const forgotLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many password reset requests. Please try again in 1 hour.' },
});

const resendLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many verification emails requested. Please try again in 1 hour.' },
});

const socialLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many social login attempts. Please try again later.' },
});

// ── Public routes ────────────────────────────────────────────────
router.post('/register', register);
router.post('/login', loginLimiter, login);
router.post('/forgot', forgotLimiter, forgotPassword);
router.post('/reset/:token', resetPassword);
router.get('/verify/:token', verifyEmail);
router.post('/resend-verification', resendLimiter, resendVerification);
router.post('/google', socialLimiter, googleLogin);
router.post('/facebook', socialLimiter, facebookLogin);

// ── Protected routes ─────────────────────────────────────────────
router.get('/profile', authenticate, getProfile);
router.get('/me', authenticate, getProfile);
router.put('/profile', authenticate, updateProfile);
router.post('/logout', authenticate, logout);

module.exports = router;
