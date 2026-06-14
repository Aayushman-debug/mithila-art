const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const compression = require('compression');
const Razorpay = require("razorpay");
const crypto = require("crypto");
require("dotenv").config();
const { createTransporter } = require('./utils/emailService');
const { validateEmail, isDisposableEmail, validateIndianPhone, normalizePhone } = require('./utils/validation');
const seedProducts = require('./utils/seeder');

// Auth routes
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const adminRoutes = require("./routes/adminRoutes");

const uploadRoutes = require("./routes/uploadRoutes");
const { verifyToken, authenticate, authorizeAdmin } = require('./middleware/authMiddleware');
const User = require('./models/User');
const Commission = require('./models/Commission');
const CartOrder = require('./models/CartOrder');
const Product = require('./models/Product');
const Coupon = require('./models/Coupon');

const requiredEnv = [
  "MONGODB_URI",
  "JWT_SECRET",
  "BREVO_SMTP_LOGIN",
  "BREVO_SMTP_PASSWORD",
  "EMAIL_FROM",
  "BACKEND_URL",
  "FRONTEND_URL",
  "FRONTEND_URLS",
  "RAZORPAY_KEY_ID",
  "RAZORPAY_KEY_SECRET",
  "GOOGLE_CLIENT_ID",
];

const missingEnv = requiredEnv.filter((name) => !process.env[name] || !String(process.env[name]).trim());
if (missingEnv.length > 0) {
  console.warn("⚠️ Missing required environment variables:", missingEnv.join(", "));
  if (missingEnv.includes("JWT_SECRET")) {
    throw new Error("❌ CRITICAL: JWT_SECRET is required to start the server.");
  }
  console.warn("⚠️ Backend is starting but some features may not work correctly.");
}

const app = express();

const defaultAllowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  "http://localhost:5173",
  "https://mithila-art-dhe3.vercel.app",
];

const getDynamicOrigins = () => {
  let origins = [...defaultAllowedOrigins];
  if (process.env.FRONTEND_URL) origins.push(process.env.FRONTEND_URL.replace(/\/$/, ''));
  if (process.env.FRONTEND_URLS) {
    const customOrigins = process.env.FRONTEND_URLS.split(',').map(u => u.trim().replace(/\/$/, ''));
    origins = origins.concat(customOrigins);
  }
  return origins;
};

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) {
      return callback(null, true);
    }

    const dynamicOrigins = getDynamicOrigins();
    if (dynamicOrigins.includes(origin)) {
      return callback(null, true);
    }

    console.log("Blocked Origin:", origin);

    return callback(new Error("Not allowed by CORS"));
  },

  credentials: true,
  exposedHeaders: ["set-cookie"],
}));
app.use(compression());
app.use(express.json({
  limit: '50mb',
  verify: (req, res, buf) => {
    req.rawBody = buf;
  }
}));
app.use(helmet());

// Removed aggressive caching so admin changes are visible immediately
app.use((req, res, next) => {
  if (req.method === 'GET') {
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  }
  next();
});
// Use a safe wrapper for mongo-sanitize to avoid issues when req.query is getter-only
const { sanitize } = mongoSanitize;
app.use((req, res, next) => {
  try {
    if (req.body) req.body = sanitize(req.body);
  } catch (e) { }
  try {
    if (req.params) req.params = sanitize(req.params);
  } catch (e) { }
  try {
    if (req.headers) req.headers = sanitize(req.headers);
  } catch (e) { }
  try {
    if (req.query) {
      // If query property is writable, replace; otherwise mutate in-place
      const desc = Object.getOwnPropertyDescriptor(req, 'query');
      const cleaned = sanitize(JSON.parse(JSON.stringify(req.query || {})));
      if (desc && desc.writable) {
        req.query = cleaned;
      } else {
        // mutate existing object to avoid setter errors
        Object.keys(req.query).forEach((k) => delete req.query[k]);
        Object.assign(req.query, cleaned);
      }
    }
  } catch (e) { }
  next();
});
// Note: xss-clean middleware has been removed due to prototype pollution vulnerabilities.
// Relying on express-mongo-sanitize and Mongoose schemas for validation.

// Rate limiting
app.set('trust proxy', 1); // Required for rate limiting behind a reverse proxy (like Render/Vercel)
const isProd = process.env.NODE_ENV === 'production';
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: isProd ? 100 : 200, // stricter in prod, relaxed for local dev
  message: { success: false, message: 'Too many auth attempts, please try again later.' },
});
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: isProd ? 100 : 1000,
});
app.use(generalLimiter);

console.log('Rate limiter auth max:', isProd ? 10 : 200);

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/mithilaReviews", {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 15000,
  socketTimeoutMS: 60000,
  autoIndex: false, // Don't build indexes on cold start
})
  .then(async () => {
    console.log("✓ MongoDB Connected");
  })
  .catch(err => console.error("✗ MongoDB Error:", err));

// Razorpay Instance
let razorpay = null;
if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
  razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
  });
} else {
  console.warn("⚠️ Razorpay keys are not configured. Payment endpoints will fail without them.");
}
console.log("Razorpay key loaded:", !!process.env.RAZORPAY_KEY_ID, !!process.env.RAZORPAY_KEY_SECRET);
// ============ ROUTES ============

// HEALTH CHECK / ROOT ROUTE
app.get("/", (req, res) => {
  res.send("Mithila Art Backend Running 🚀");
});

app.get("/health", (req, res) => {
  res.send("Mithila Art Backend Running 🚀");
});

// 1. SUBMIT COMMISSION (Customer)
app.post("/commissions", async (req, res) => {
  try {
    // Validate required fields strictly
    const { name, email, phone, location, style, size, colors, description, timeline } = req.body;

    if (!name || !email || !phone || !location || !style || !size || !description) {
      return res.status(400).json({ success: false, message: 'Please provide name, email, phone, location, style, size and description' });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({ success: false, message: 'Invalid email format' });
    }

    if (isDisposableEmail(email)) {
      return res.status(400).json({ success: false, message: 'Disposable email addresses are not permitted' });
    }

    if (!validateIndianPhone(phone)) {
      return res.status(400).json({ success: false, message: 'Invalid Indian phone number' });
    }

    const normalizedPhone = normalizePhone(phone);

    if (description && email) {
      const recent = await Commission.findOne({ email: email.toLowerCase(), description }).sort({ submittedAt: -1 });
      if (recent && recent.submittedAt && (Date.now() - new Date(recent.submittedAt)) < 2 * 60 * 1000) {
        return res.status(429).json({ success: false, message: 'Duplicate submission detected. Please wait a moment before submitting again.' });
      }
    }

    // If an auth token is present, try to attach the commission to the user
    const authHeader = req.headers.authorization;
    let attachedUser = null;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      try {
        const decoded = verifyToken(token, process.env.JWT_SECRET);
        if (decoded && decoded.userId) {
          attachedUser = await User.findById(decoded.userId).select('name email phone');
        }
      } catch (e) {
        // invalid token - ignore and continue as guest
        attachedUser = null;
      }
    }

    const commission = new Commission({
      user: attachedUser?._id || null,
      name: attachedUser?.name || name,
      email: attachedUser?.email || email,
      phone: attachedUser?.phone || normalizedPhone,
      location: location || null,
      style: style || null,
      size: size || null,
      colors: colors || null,
      description: description || null,
      timeline: timeline || null,
      status: "submitted",
      paymentStatus: "pending"
    });

    const saved = await commission.save();

    if (attachedUser) {
      await User.findByIdAndUpdate(attachedUser._id, {
        $push: { commissions: saved._id },
      });
    }

    return res.status(201).json({ success: true, message: 'Commission submitted successfully', commissionId: saved._id, referenceId: saved.referenceId });
  } catch (error) {
    console.error("Commission save error:", error);
    return res.status(500).json({ success: false, message: error.message || 'Could not save commission' });
  }
});


// 2. GET COMMISSION DETAILS (Customer checks status)
app.get("/commission/:commissionId", authenticate, async (req, res) => {
  try {
    const commission = await Commission.findById(req.params.commissionId);

    if (!commission) {
      return res.status(404).json({
        success: false,
        error: "Commission not found"
      });
    }

    // Verify ownership: matches userId, email matches logged in user, or user is admin
    let isOwner = false;
    if (commission.user) {
      isOwner = commission.user.toString() === req.user.userId;
    } else {
      const user = await User.findById(req.user.userId);
      if (user && user.email.toLowerCase() === commission.email.toLowerCase()) {
        isOwner = true;
      }
    }
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        error: "You are not authorized to view this commission"
      });
    }

    res.json({
      success: true,
      commission: {
        _id: commission._id,
        referenceId: commission.referenceId,
        name: commission.name,
        email: commission.email,
        phone: commission.phone,
        style: commission.style,
        size: commission.size,
        status: commission.status,
        paymentStatus: commission.paymentStatus,
        quotedBudget: commission.quotedBudget,
        approvalMessage: commission.approvalMessage,
        submittedAt: commission.submittedAt,
        approvedAt: commission.approvedAt,
        paidAt: commission.paidAt
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// 3. ADMIN: APPROVE COMMISSION & SET PRICE
app.post("/admin/approve-commission", authenticate, authorizeAdmin, async (req, res) => {
  try {
    const { commissionId, quotedBudget, approvalMessage } = req.body;

    if (!commissionId || !quotedBudget) {
      return res.status(400).json({
        success: false,
        error: "Commission ID and quoted budget required"
      });
    }

    const commission = await Commission.findByIdAndUpdate(
      commissionId,
      {
        status: "approved",
        quotedBudget: quotedBudget,
        approvalMessage: approvalMessage || "Your commission has been approved!",
        approvedAt: new Date()
      },
      { new: true }
    );

    if (!commission) {
      return res.status(404).json({
        success: false,
        error: "Commission not found"
      });
    }

    res.json({
      success: true,
      message: "Commission approved",
      commission
    });
  } catch (error) {
    console.error("Approval error:", error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// 4. CREATE RAZORPAY ORDER (when customer ready to pay)
app.post("/create-order", authenticate, async (req, res) => {
  try {
    console.log("/create-order request body:", req.body);
    const { commissionId, amount } = req.body;

    if (!commissionId || amount == null) {
      return res.status(400).json({
        success: false,
        error: "Commission ID and amount required"
      });
    }

    const commission = await Commission.findById(commissionId);

    if (!commission) {
      return res.status(404).json({
        success: false,
        error: "Commission not found"
      });
    }

    // Verify ownership
    let isOwner = false;
    if (commission.user) {
      isOwner = commission.user.toString() === req.user.userId;
    } else {
      const user = await User.findById(req.user.userId);
      if (user && user.email.toLowerCase() === commission.email.toLowerCase()) {
        isOwner = true;
      }
    }
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ success: false, error: "Access denied" });
    }

    if (commission.status !== "approved") {
      return res.status(400).json({
        success: false,
        error: "Commission must be approved before payment"
      });
    }

    if (!razorpay) {
      return res.status(503).json({ success: false, error: 'Payment gateway not configured' });
    }

    const expectedAmount = Number(commission.quotedBudget);
    const requestedAmount = Number(amount);
    if (Number.isNaN(requestedAmount) || requestedAmount <= 0) {
      return res.status(400).json({ success: false, error: 'Invalid payment amount' });
    }

    if (requestedAmount !== expectedAmount) {
      return res.status(400).json({ success: false, error: 'Payment amount mismatch' });
    }

    // If an order was already created for this commission and payment still pending, return it (idempotency)
    if (commission.orderId && commission.paymentStatus === 'pending') {
      return res.json({
        success: true,
        orderId: commission.orderId,
        amount: Math.round(expectedAmount * 100),
        currency: 'INR',
        key: process.env.RAZORPAY_KEY_ID,
        note: 'existing-order'
      });
    }

    // Create Razorpay order
    const order = await razorpay.orders.create({
      amount: Math.round(expectedAmount * 100),
      currency: "INR",
      receipt: commission.referenceId,
      notes: {
        commissionId: commissionId,
        customerName: commission.name,
        customerEmail: commission.email
      }
    });

    // Save order ID to commission (only when new)
    commission.orderId = order.id;
    commission.paymentStatus = 'pending';
    await commission.save();

    res.json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      key: process.env.RAZORPAY_KEY_ID
    });
  } catch (error) {
    console.error("Order creation error:", error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Validate Coupon Endpoint
app.post("/validate-coupon", authenticate, async (req, res) => {
  try {
    const { code } = req.body;
    if (!code) {
      return res.status(400).json({ success: false, error: "Coupon code is required" });
    }
    const couponCode = String(code).toUpperCase().trim();
    const coupon = await Coupon.findOne({ code: couponCode, isActive: true });
    if (!coupon) {
      return res.status(400).json({ success: false, error: "Invalid or inactive coupon code" });
    }
    if (coupon.singleUse) {
      const existingOrder = await CartOrder.findOne({
        couponCode,
        paymentStatus: { $nin: ['pending', 'failed'] },
        user: req.user.userId
      });
      if (existingOrder) {
        return res.status(400).json({ success: false, error: "You have already used this coupon." });
      }
    }
    res.json({
      success: true,
      coupon: {
        code: coupon.code,
        type: coupon.type,
        value: coupon.value,
        freeShipping: coupon.freeShipping
      }
    });
  } catch (error) {
    console.error("Coupon validation error:", error);
    res.status(500).json({ success: false, error: "Could not validate coupon" });
  }
});

// 4b. CREATE CART ORDER
app.post("/create-cart-order", authenticate, async (req, res) => {
  try {
    console.log("/create-cart-order request body:", req.body);
    const { name, email, phone, address, city, state, pincode, totalAmount, shipping, grandTotal, discount, couponCode, items } = req.body;

    if (!name || !email || !phone || !address || !city || !state || !pincode || grandTotal == null || !Array.isArray(items)) {
      return res.status(400).json({
        success: false,
        error: "Missing cart order details"
      });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({ success: false, error: 'Invalid email format' });
    }

    if (isDisposableEmail(email)) {
      return res.status(400).json({ success: false, error: 'Disposable email addresses are not permitted' });
    }

    if (!validateIndianPhone(phone)) {
      return res.status(400).json({ success: false, error: 'Invalid Indian phone number' });
    }

    const normalizedPhone = normalizePhone(phone);

    const pinCodeValue = String(pincode).trim();
    if (!/^[0-9]{6}$/.test(pinCodeValue)) {
      return res.status(400).json({ success: false, error: 'Invalid pincode format' });
    }

    // 1. Calculate subtotal using product prices from database (prevent client manipulation)
    let calculatedSubtotal = 0;
    const validatedItems = [];
    for (const item of items) {
      const query = mongoose.Types.ObjectId.isValid(item.productId)
        ? { $or: [{ _id: item.productId }, { productId: item.productId }] }
        : { productId: item.productId };
      const dbProduct = await Product.findOne(query);
      if (!dbProduct) {
        return res.status(404).json({ success: false, error: `Product not found: ${item.title}` });
      }
      calculatedSubtotal += dbProduct.price * (item.quantity || 1);
      validatedItems.push({
        productId: dbProduct.productId,
        title: dbProduct.title,
        quantity: item.quantity || 1,
        price: dbProduct.price,
        image: dbProduct.image || ''
      });
    }

    if (calculatedSubtotal !== totalAmount) {
      return res.status(400).json({ success: false, error: "Order subtotal calculation mismatch" });
    }

    // 2. Verify discount coupon if applied
    let calculatedDiscount = 0;
    let isFreeShipping = false;
    if (couponCode) {
      const code = String(couponCode).toUpperCase().trim();
      const coupon = await Coupon.findOne({ code, isActive: true });
      if (!coupon) {
        return res.status(400).json({ success: false, error: "Invalid or inactive coupon code" });
      }
      if (coupon.singleUse) {
        // For single use, we check if this specific user has used it.
        const existingOrder = await CartOrder.findOne({
          couponCode: code,
          paymentStatus: { $nin: ['pending', 'failed'] },
          user: req.user.userId
        });
        if (existingOrder) {
          return res.status(400).json({ success: false, error: "You have already used this coupon." });
        }
      }
      if (coupon.freeShipping) {
        isFreeShipping = true;
      }

      if (coupon.type === 'percent') {
        calculatedDiscount = Math.round((calculatedSubtotal * coupon.value) / 100);
      } else if (coupon.type === 'flat') {
        calculatedDiscount = Math.min(coupon.value, calculatedSubtotal);
      }
    }

    if (calculatedDiscount !== discount) {
      return res.status(400).json({ success: false, error: "Coupon discount mismatch" });
    }

    // 3. Verify shipping cost
    let expectedShipping = calculatedSubtotal > 5000 ? 0 : 199;
    if (isFreeShipping) {
      expectedShipping = 0;
    }
    if (expectedShipping !== shipping) {
      return res.status(400).json({ success: false, error: "Shipping cost mismatch" });
    }

    // 4. Verify grand total
    const expectedGrandTotal = Math.max(0, calculatedSubtotal - calculatedDiscount + expectedShipping);
    if (Math.round(expectedGrandTotal) !== Math.round(grandTotal)) {
      return res.status(400).json({ success: false, error: "Grand total amount mismatch" });
    }

    if (!razorpay) {
      return res.status(503).json({ success: false, error: 'Payment gateway not configured' });
    }

    const order = await razorpay.orders.create({
      amount: Math.round(expectedGrandTotal * 100),
      currency: "INR",
      receipt: `CART-${Date.now()}`,
      notes: {
        customerName: name,
        customerEmail: email
      }
    });
    console.log("/create-cart-order created Razorpay order:", order);

    const cartOrder = new CartOrder({
      user: req.user.userId,
      name,
      email,
      phone: normalizedPhone,
      address,
      city,
      state,
      pincode,
      items: validatedItems,
      totalAmount: calculatedSubtotal,
      shipping: expectedShipping,
      grandTotal: expectedGrandTotal,
      discount: calculatedDiscount,
      couponCode: couponCode || null,
      orderId: order.id,
      paymentStatus: "pending"
    });

    await cartOrder.save();

    await User.findByIdAndUpdate(req.user.userId, {
      $push: { orders: cartOrder._id },
    });

    res.json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      key: process.env.RAZORPAY_KEY_ID,
      cartOrderId: cartOrder._id
    });
  } catch (error) {
    console.error("Cart order creation error:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Could not create payment order"
    });
  }
});

// 4c. CREATE UPI ORDER
app.post("/create-upi-order", authenticate, async (req, res) => {
  try {
    console.log("/create-upi-order request body (keys):", Object.keys(req.body));
    const { name, email, phone, address, city, state, pincode, totalAmount, shipping, grandTotal, discount, couponCode, items, paymentScreenshot } = req.body;

    if (!name || !email || !phone || !address || !city || !state || !pincode || grandTotal == null || !Array.isArray(items)) {
      return res.status(400).json({
        success: false,
        error: "Missing UPI order details"
      });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({ success: false, error: 'Invalid email format' });
    }

    if (isDisposableEmail(email)) {
      return res.status(400).json({ success: false, error: 'Disposable email addresses are not permitted' });
    }

    if (!validateIndianPhone(phone)) {
      return res.status(400).json({ success: false, error: 'Invalid Indian phone number' });
    }

    const normalizedPhone = normalizePhone(phone);

    const pinCodeValue = String(pincode).trim();
    if (!/^[0-9]{6}$/.test(pinCodeValue)) {
      return res.status(400).json({ success: false, error: 'Invalid pincode format' });
    }

    // 1. Calculate subtotal using product prices from database (prevent client manipulation)
    let calculatedSubtotal = 0;
    const validatedItems = [];
    for (const item of items) {
      const query = mongoose.Types.ObjectId.isValid(item.productId)
        ? { $or: [{ _id: item.productId }, { productId: item.productId }] }
        : { productId: item.productId };
      const dbProduct = await Product.findOne(query);
      if (!dbProduct) {
        return res.status(404).json({ success: false, error: `Product not found: ${item.title}` });
      }
      calculatedSubtotal += dbProduct.price * (item.quantity || 1);
      validatedItems.push({
        productId: dbProduct.productId,
        title: dbProduct.title,
        quantity: item.quantity || 1,
        price: dbProduct.price,
        image: dbProduct.image || ''
      });
    }

    if (calculatedSubtotal !== totalAmount) {
      return res.status(400).json({ success: false, error: "Order subtotal calculation mismatch" });
    }

    // 2. Verify discount coupon if applied
    let calculatedDiscount = 0;
    let isFreeShipping = false;
    if (couponCode) {
      const code = String(couponCode).toUpperCase().trim();
      const coupon = await Coupon.findOne({ code, isActive: true });
      if (!coupon) {
        return res.status(400).json({ success: false, error: "Invalid or inactive coupon code" });
      }
      if (coupon.singleUse) {
        // For single use, we check if this specific user has used it.
        const existingOrder = await CartOrder.findOne({
          couponCode: code,
          paymentStatus: { $nin: ['pending', 'failed'] },
          user: req.user.userId
        });
        if (existingOrder) {
          return res.status(400).json({ success: false, error: "You have already used this coupon." });
        }
      }
      if (coupon.freeShipping) {
        isFreeShipping = true;
      }

      if (coupon.type === 'percent') {
        calculatedDiscount = Math.round((calculatedSubtotal * coupon.value) / 100);
      } else if (coupon.type === 'flat') {
        calculatedDiscount = Math.min(coupon.value, calculatedSubtotal);
      }
    }

    if (calculatedDiscount !== discount) {
      return res.status(400).json({ success: false, error: "Coupon discount mismatch" });
    }

    // 3. Verify shipping cost
    let expectedShipping = calculatedSubtotal > 5000 ? 0 : 199;
    if (isFreeShipping) {
      expectedShipping = 0;
    }
    if (expectedShipping !== shipping) {
      return res.status(400).json({ success: false, error: "Shipping cost mismatch" });
    }

    // 4. Verify grand total
    const expectedGrandTotal = Math.max(0, calculatedSubtotal - calculatedDiscount + expectedShipping);
    if (Math.round(expectedGrandTotal) !== Math.round(grandTotal)) {
      return res.status(400).json({ success: false, error: "Grand total amount mismatch" });
    }

    const upiOrderId = `UPI-${Date.now()}`;

    const cartOrder = new CartOrder({
      user: req.user.userId,
      name,
      email,
      phone: normalizedPhone,
      address,
      city,
      state,
      pincode,
      items: validatedItems,
      totalAmount: calculatedSubtotal,
      shipping: expectedShipping,
      grandTotal: expectedGrandTotal,
      discount: calculatedDiscount,
      couponCode: couponCode || null,
      orderId: upiOrderId,
      paymentMethod: 'upi',
      paymentScreenshot: paymentScreenshot || null,
      paymentVerification: 'pending',
      paymentStatus: 'awaiting_verification',
      status: 'Pending Payment Verification',
    });

    await cartOrder.save();

    await User.findByIdAndUpdate(req.user.userId, {
      $push: { orders: cartOrder._id },
    });

    res.json({
      success: true,
      orderId: upiOrderId,
      cartOrderId: cartOrder._id,
      message: 'UPI order created successfully. Payment verification is pending.',
    });
  } catch (error) {
    console.error("UPI order creation error:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Could not create UPI order"
    });
  }
});

// 5. VERIFY PAYMENT & UPDATE COMMISSION
app.post("/verify-payment", async (req, res) => {
  try {
    const { commissionId, paymentId, orderId, signature } = req.body;

    if (!commissionId || !paymentId || !orderId || !signature) {
      return res.status(400).json({
        success: false,
        error: "Missing payment verification details"
      });
    }

    if (!process.env.RAZORPAY_KEY_SECRET) {
      return res.status(503).json({ success: false, error: 'Payment gateway secret not configured' });
    }

    // Verify signature
    const hmac = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET);
    hmac.update(orderId + "|" + paymentId);
    const generated_signature = hmac.digest("hex");

    if (generated_signature !== signature) {
      return res.status(400).json({
        success: false,
        error: "Payment verification failed - Invalid signature"
      });
    }

    // Update commission with payment details
    const commission = await Commission.findById(commissionId);
    if (!commission) {
      return res.status(404).json({ success: false, error: 'Commission not found' });
    }

    // Ensure orderId matches
    if (commission.orderId && commission.orderId !== orderId) {
      return res.status(400).json({ success: false, error: 'Order ID mismatch' });
    }

    // Idempotent: if already marked paid, return success
    if (commission.paymentStatus === 'paid') {
      return res.json({ success: true, message: 'Payment already verified', commission });
    }

    commission.paymentStatus = 'paid';
    commission.paymentId = paymentId;
    commission.transactionId = paymentId;
    commission.paidAt = new Date();
    commission.status = 'in-progress';

    // Optional: link to authenticated user if payment verified and user is logged in
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      try {
        const decoded = verifyToken(token, process.env.JWT_SECRET || 'your_jwt_secret_key');
        if (decoded && decoded.userId) {
          const userObj = await User.findById(decoded.userId);
          if (userObj) {
            commission.user = userObj._id;
            // Push to user's commissions if not already present
            if (!userObj.commissions.includes(commission._id)) {
              userObj.commissions.push(commission._id);
              await userObj.save();
            }
          }
        }
      } catch (err) {
        console.error("Optional payment auth error:", err);
      }
    } else {
      // Fallback: Check if the email on the commission matches an existing registered user
      try {
        const matchingUser = await User.findOne({ email: commission.email });
        if (matchingUser) {
          commission.user = matchingUser._id;
          if (!matchingUser.commissions.includes(commission._id)) {
            matchingUser.commissions.push(commission._id);
            await matchingUser.save();
          }
        }
      } catch (err) {
        console.error("Optional email matching error:", err);
      }
    }

    await commission.save();

    res.json({ success: true, message: 'Payment verified successfully', commission });
  } catch (error) {
    console.error("Payment verification error:", error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// 5b. VERIFY CART PAYMENT
app.post("/verify-cart-payment", async (req, res) => {
  try {
    const { cartOrderId, paymentId, orderId, signature } = req.body;

    if (!cartOrderId || !paymentId || !orderId || !signature) {
      return res.status(400).json({
        success: false,
        error: "Missing cart payment verification details"
      });
    }

    const cartOrder = await CartOrder.findById(cartOrderId);
    if (!cartOrder) {
      return res.status(404).json({
        success: false,
        error: "Cart order not found"
      });
    }

    if (cartOrder.orderId !== orderId) {
      return res.status(400).json({
        success: false,
        error: "Order ID mismatch"
      });
    }

    if (!process.env.RAZORPAY_KEY_SECRET) {
      return res.status(503).json({ success: false, error: 'Payment gateway secret not configured' });
    }

    const hmac = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET);
    hmac.update(orderId + "|" + paymentId);
    const generated_signature = hmac.digest("hex");

    if (generated_signature !== signature) {
      await CartOrder.findByIdAndUpdate(cartOrderId, { paymentStatus: 'failed' });
      return res.status(400).json({ success: false, error: 'Payment verification failed - Invalid signature' });
    }

    const updatedOrder = await CartOrder.findById(cartOrderId);
    if (updatedOrder.paymentStatus === 'paid') {
      return res.json({ success: true, message: 'Payment already verified', order: updatedOrder });
    }

    updatedOrder.paymentStatus = 'paid';
    updatedOrder.paymentId = paymentId;
    updatedOrder.transactionId = paymentId;
    updatedOrder.paidAt = new Date();
    await updatedOrder.save();

    if (updatedOrder.couponCode) {
      await Coupon.findOneAndUpdate(
        { code: String(updatedOrder.couponCode).toUpperCase().trim() },
        { $inc: { usageCount: 1 } }
      );
    }

    res.json({ success: true, message: 'Payment verified successfully', order: updatedOrder });
  } catch (error) {
    console.error("Cart payment verification error:", error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// 6. MARK PAYMENT FAILED
app.post("/payment-failed", authenticate, async (req, res) => {
  try {
    const { commissionId, orderId } = req.body;

    const commission = await Commission.findById(commissionId);
    if (!commission) {
      return res.status(404).json({ success: false, error: 'Commission not found' });
    }

    // Verify ownership
    let isOwner = false;
    if (commission.user) {
      isOwner = commission.user.toString() === req.user.userId;
    } else {
      const user = await User.findById(req.user.userId);
      if (user && user.email.toLowerCase() === commission.email.toLowerCase()) {
        isOwner = true;
      }
    }
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ success: false, error: "Access denied" });
    }

    commission.paymentStatus = "failed";
    commission.orderId = null;
    await commission.save();

    res.json({
      success: true,
      message: "Payment marked as failed",
      commission
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// ============ AUTH ROUTES ============
app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/products", productRoutes);

app.use("/api/admin", adminRoutes);
app.use("/api/upload", uploadRoutes);

// Webhook handler for Razorpay async updates
app.post("/api/webhooks/razorpay", async (req, res) => {
  try {
    const signature = req.headers["x-razorpay-signature"];
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

    if (!webhookSecret) {
      console.error("Webhook secret not configured on server");
      return res.status(500).json({ success: false, error: "Webhook secret not configured" });
    }

    if (!signature) {
      return res.status(400).json({ success: false, error: "Missing signature" });
    }

    if (!req.rawBody) {
      return res.status(400).json({ success: false, error: "Missing request raw body" });
    }

    // Verify webhook signature
    const expectedSignature = crypto
      .createHmac("sha256", webhookSecret)
      .update(req.rawBody)
      .digest("hex");

    if (expectedSignature !== signature) {
      console.warn("Invalid webhook signature received");
      return res.status(400).json({ success: false, error: "Invalid signature verification" });
    }

    const event = req.body;
    console.log(`✓ Received verified webhook event: ${event.event}`);

    const payload = event.payload;

    if (event.event === "order.paid" || event.event === "payment.captured") {
      const payment = payload.payment.entity;
      const orderId = payment.order_id;
      const paymentId = payment.id;

      // Handle commission payments
      const commission = await Commission.findOne({ orderId });
      if (commission && commission.paymentStatus !== "paid") {
        commission.paymentStatus = "paid";
        commission.paymentId = paymentId;
        commission.transactionId = paymentId;
        commission.paidAt = new Date();
        commission.status = "in-progress";
        await commission.save();
        console.log(`[Webhook] Promoted commission order ${orderId} to paid`);
      }

      // Handle cart orders
      const cartOrder = await CartOrder.findOne({ orderId });
      if (cartOrder && cartOrder.paymentStatus !== "paid") {
        cartOrder.paymentStatus = "paid";
        cartOrder.paymentId = paymentId;
        cartOrder.transactionId = paymentId;
        cartOrder.paidAt = new Date();
        await cartOrder.save();
        console.log(`[Webhook] Promoted cart order ${orderId} to paid`);
      }
    } else if (event.event === "payment.failed") {
      const payment = payload.payment.entity;
      const orderId = payment.order_id;

      // Handle cart orders
      const cartOrder = await CartOrder.findOne({ orderId });
      if (cartOrder && cartOrder.paymentStatus === "pending") {
        cartOrder.paymentStatus = "failed";
        await cartOrder.save();
        console.log(`[Webhook] Marked cart order ${orderId} as failed`);
      }
    }

    res.json({ status: "ok" });
  } catch (error) {
    console.error("Webhook processing error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Global error handler - ensures structured JSON responses and prevents server crashes
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  const status = err.status || 500;
  res.status(status).json({ success: false, message: err.message || 'Internal Server Error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("✓ Server running on http://localhost:" + PORT);
  console.log("✓ Environment: " + (process.env.NODE_ENV || "development"));
  console.log("✓ Frontend URL: " + (process.env.FRONTEND_URL || "http://localhost:5173"));
});
