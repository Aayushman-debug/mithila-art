const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Razorpay = require("razorpay");
const crypto = require("crypto");
require("dotenv").config();

const requiredEnv = ["MONGODB_URI", "RAZORPAY_KEY_ID", "RAZORPAY_KEY_SECRET", "FRONTEND_URL"];
const missingEnv = requiredEnv.filter((name) => !process.env[name]);
if (missingEnv.length > 0) {
  console.warn("⚠️ Missing required environment variables:", missingEnv.join(", "));
  console.warn("Backend may not function fully until these values are set.");
}

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true
}));
app.use(express.json());

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
console.log("CORS allowed origin:", process.env.FRONTEND_URL || "http://localhost:5173");

// ============ SCHEMAS ============

const CommissionSchema = new mongoose.Schema({
  // Customer Details
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  location: { type: String, required: true },

  // Artwork Details
  style: { type: String, required: true },
  size: { type: String, required: true },
  colors: { type: String },
  description: { type: String, required: true },
  timeline: { type: String },

  // Commission Status
  status: {
    type: String,
    enum: ["submitted", "approved", "rejected", "in-progress", "completed"],
    default: "submitted"
  },

  // Quote & Payment
  quotedBudget: { type: Number },
  approvalMessage: { type: String },

  // Payment Fields
  paymentStatus: {
    type: String,
    enum: ["pending", "paid", "failed"],
    default: "pending"
  },
  orderId: { type: String },
  paymentId: { type: String },
  transactionId: { type: String },

  // Timestamps
  submittedAt: { type: Date, default: Date.now },
  approvedAt: { type: Date },
  paidAt: { type: Date },

  // Admin Reference
  referenceId: {
    type: String,
    default: () => "COM" + Date.now().toString().slice(-6)
  }
});

const Commission = mongoose.model("Commission", CommissionSchema);

const CartOrderSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  pincode: { type: String, required: true },
  items: [
    {
      productId: String,
      title: String,
      quantity: Number,
      price: Number,
      image: String
    }
  ],
  totalAmount: { type: Number, required: true },
  shipping: { type: Number, required: true },
  grandTotal: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  couponCode: { type: String },
  orderId: String,
  paymentId: String,
  transactionId: String,
  paymentStatus: {
    type: String,
    enum: ["pending", "paid", "failed"],
    default: "pending"
  },
  createdAt: { type: Date, default: Date.now },
  paidAt: Date
});

const CartOrder = mongoose.model("CartOrder", CartOrderSchema);

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
    const commission = new Commission({
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      location: req.body.location,
      style: req.body.style,
      size: req.body.size,
      colors: req.body.colors,
      description: req.body.description,
      timeline: req.body.timeline,
      status: "submitted",
      paymentStatus: "pending"
    });

    const saved = await commission.save();

    res.status(201).json({
      success: true,
      message: "Commission submitted successfully",
      commissionId: saved._id,
      referenceId: saved.referenceId
    });
  } catch (error) {
    console.error("Commission save error:", error);
    res.status(500).json({
      success: false,
      error: error.message
    });
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

    if (!commissionId || !amount) {
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

    // Create Razorpay order
    const order = await razorpay.orders.create({
      amount: amount * 100,
      currency: "INR",
      receipt: commission.referenceId,
      notes: {
        commissionId: commissionId,
        customerName: commission.name,
        customerEmail: commission.email
      }
    });

    // Save order ID to commission
    commission.orderId = order.id;
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
app.post("/create-cart-order", async (req, res) => {
  try {
    console.log("/create-cart-order request body:", req.body);
    const { name, email, phone, address, city, state, pincode, totalAmount, shipping, grandTotal, discount, couponCode, items } = req.body;

    if (!name || !email || !phone || !address || !city || !state || !pincode || !grandTotal || !Array.isArray(items)) {
      return res.status(400).json({
        success: false,
        error: "Missing cart order details"
      });
    }

    const order = await razorpay.orders.create({
      amount: Math.round(grandTotal * 100),
      currency: "INR",
      receipt: `CART-${Date.now()}`,
      notes: {
        customerName: name,
        customerEmail: email
      }
    });
    console.log("/create-cart-order created Razorpay order:", order);

    const cartOrder = new CartOrder({
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
    const commission = await Commission.findByIdAndUpdate(
      commissionId,
      {
        paymentStatus: "paid",
        paymentId: paymentId,
        transactionId: paymentId,
        paidAt: new Date(),
        status: "in-progress"
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
      message: "Payment verified successfully",
      commission
    });
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

    const hmac = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET);
    hmac.update(orderId + "|" + paymentId);
    const generated_signature = hmac.digest("hex");

    if (generated_signature !== signature) {
      await CartOrder.findByIdAndUpdate(cartOrderId, {
        paymentStatus: "failed"
      });

      return res.status(400).json({
        success: false,
        error: "Payment verification failed - Invalid signature"
      });
    }

    const updatedOrder = await CartOrder.findByIdAndUpdate(
      cartOrderId,
      {
        paymentStatus: "paid",
        paymentId,
        transactionId: paymentId,
        paidAt: new Date()
      },
      { new: true }
    );

    res.json({
      success: true,
      message: "Payment verified successfully",
      order: updatedOrder
    });
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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("✓ Server running on http://localhost:" + PORT);
  console.log("✓ Environment: " + (process.env.NODE_ENV || "development"));
  console.log("✓ Frontend URL: " + (process.env.FRONTEND_URL || "http://localhost:5173"));
});
