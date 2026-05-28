const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const xssLib = require('xss-clean/lib/xss');
const Razorpay = require("razorpay");
const crypto = require("crypto");
require("dotenv").config();
const { createTransporter } = require('./utils/emailService');
const { validateEmail, isDisposableEmail, validateIndianPhone } = require('./utils/validation');

// Auth routes
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const adminRoutes = require("./routes/adminRoutes");
const { verifyToken, authenticate } = require('./middleware/authMiddleware');
const User = require('./models/User');
const Commission = require('./models/Commission');
const CartOrder = require('./models/CartOrder');
const Product = require('./models/Product');

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
];

const missingEnv = requiredEnv.filter((name) => !process.env[name] || !String(process.env[name]).trim());
if (missingEnv.length > 0) {
  console.error("✗ Missing required environment variables:", missingEnv.join(", "));
  console.error("✗ Backend will not start until required environment variables are set.");
  process.exit(1);
}

const app = express();

const allowedFrontendOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  "http://localhost:5173",
  "https://mithila-art-dhe3.vercel.app",
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) {
      return callback(null, true);
    }

    if (allowedFrontendOrigins.includes(origin)) {
      return callback(null, true);
    }

    console.log("Blocked Origin:", origin);

    return callback(new Error("Not allowed by CORS"));
  },

  credentials: true,
  exposedHeaders: ["set-cookie"],
}));
app.use(express.json());
app.use(helmet());
// Use a safe wrapper for mongo-sanitize to avoid issues when req.query is getter-only
const { sanitize } = mongoSanitize;
app.use((req, res, next) => {
  try {
    if (req.body) req.body = sanitize(req.body);
  } catch (e) {}
  try {
    if (req.params) req.params = sanitize(req.params);
  } catch (e) {}
  try {
    if (req.headers) req.headers = sanitize(req.headers);
  } catch (e) {}
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
  } catch (e) {}
  next();
});
// Replace xss-clean middleware with a safe wrapper to avoid reassigning getter-only properties
app.use((req, res, next) => {
  try {
    if (req.body) req.body = xssLib.clean(req.body);
  } catch (e) {}
  try {
    if (req.params) req.params = xssLib.clean(req.params);
  } catch (e) {}
  try {
    if (req.query) {
      const cleaned = JSON.parse(JSON.stringify(xssLib.clean(req.query || {})));
      const desc = Object.getOwnPropertyDescriptor(req, 'query');
      if (desc && desc.writable) {
        req.query = cleaned;
      } else {
        Object.keys(req.query).forEach((k) => delete req.query[k]);
        Object.assign(req.query, cleaned);
      }
    }
  } catch (e) {}
  next();
});

// Rate limiting
const isProd = process.env.NODE_ENV === 'production';
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: isProd ? 10 : 200, // stricter in prod, relaxed for local dev
  message: { success: false, message: 'Too many auth attempts, please try again later.' },
});
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: isProd ? 100 : 1000,
});
app.use(generalLimiter);

console.log('Rate limiter auth max:', isProd ? 10 : 200);

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/mithilaReviews")
  .then(() => console.log("✓ MongoDB Connected"))
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
        const decoded = verifyToken(token, process.env.JWT_SECRET || 'your_jwt_secret_key');
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
      phone: attachedUser?.phone || phone,
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
app.get("/commission/:commissionId", async (req, res) => {
  try {
    const commission = await Commission.findById(req.params.commissionId);
    
    if (!commission) {
      return res.status(404).json({
        success: false,
        error: "Commission not found"
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
app.post("/admin/approve-commission", async (req, res) => {
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
app.post("/create-order", async (req, res) => {
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

// 4b. CREATE CART ORDER
app.post("/create-cart-order", authenticate, async (req, res) => {
  try {
    console.log("/create-cart-order request body:", req.body);
    const { name, email, phone, address, city, state, pincode, totalAmount, shipping, grandTotal, discount, couponCode, items } = req.body;

    if (!name || !email || !phone || !address || !city || !state || !pincode || !grandTotal || !Array.isArray(items)) {
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

    const pinCodeValue = String(pincode).trim();
    if (!/^[0-9]{6}$/.test(pinCodeValue)) {
      return res.status(400).json({ success: false, error: 'Invalid pincode format' });
    }

    const requestedGrandTotal = Number(grandTotal);
    if (Number.isNaN(requestedGrandTotal) || requestedGrandTotal <= 0) {
      return res.status(400).json({ success: false, error: 'Invalid grand total amount' });
    }

    const order = await razorpay.orders.create({
      amount: Math.round(requestedGrandTotal * 100),
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
      phone,
      address,
      city,
      state,
      pincode,
      items,
      totalAmount: totalAmount || grandTotal,
      shipping: shipping || 0,
      grandTotal,
      discount: discount || 0,
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
app.post("/payment-failed", async (req, res) => {
  try {
    const { commissionId, orderId } = req.body;

    const commission = await Commission.findByIdAndUpdate(
      commissionId,
      {
        paymentStatus: "failed",
        orderId: null
      },
      { new: true }
    );

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

// 7. GET ALL COMMISSIONS (for admin dashboard)
app.get("/admin/commissions", async (req, res) => {
  try {
    const commissions = await Commission.find().sort({ submittedAt: -1 });
    res.json({
      success: true,
      commissions
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Keep old endpoint for compatibility
app.get("/reviews", async (req, res) => {
  try {
    const commissions = await Commission.find();
    res.json(commissions);
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
