# 🎨 Mithila Art Payment Integration - Complete Setup Guide

## ✅ What's Been Done

All code files have been created and updated with complete payment integration:

1. **Backend (`C:\Users\patha\`)**:
   - ✓ `index.js` - Complete Express server with Razorpay integration
   - ✓ `.env` - Environment configuration file (with test credentials)
   - ✓ MongoDB schema with payment fields

2. **Frontend (`c:\Users\patha\.gemini\antigravity\scratch\mithila-art\`)**:
   - ✓ `src/pages/PaymentPage.jsx` - New payment component
   - ✓ `src/pages/CommissionPage.jsx` - Updated with new workflow
   - ✓ `src/App.jsx` - Payment route added
   - ✓ `index.html` - Razorpay CDN script added

---

## 📋 NEW PAYMENT WORKFLOW

The implementation follows the artist-friendly workflow you suggested:

```
1. Customer submits commission form
   ↓
2. Admin reviews request
   ↓
3. Admin approves & sets quote price
   ↓
4. Customer sees approval notification
   ↓
5. Customer proceeds to payment
   ↓
6. Payment gateway (Razorpay) handles payment
   ↓
7. Payment verified and saved to MongoDB
   ↓
8. Commission status = "in-progress"
   ↓
9. Work begins
```

---

## 🔧 INSTALLATION STEPS

### Step 1: Install Razorpay Package

```powershell
cd C:\Users\patha
npm install razorpay
```

### Step 2: Verify .env File

File: `C:\Users\patha\.env`

Current test credentials:
```env
RAZORPAY_KEY_ID=rzp_test_1sSGgEqFwYjK2U
RAZORPAY_KEY_SECRET=testraxkey12345abcdefghij
MONGO_URI=mongodb://127.0.0.1:27017/mithilaReviews
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

**⚠️ IMPORTANT**: These are PLACEHOLDER test values. Replace with YOUR actual Razorpay keys.

### Step 3: Get Real Razorpay Credentials

1. Go to https://razorpay.com
2. Sign up / Login with your account
3. Navigate to: **Dashboard → Settings → API Keys**
4. You'll see two tabs: "Test Mode" and "Live Mode"
5. Click "Test Mode" to get test credentials (for development)
6. Copy:
   - **Key ID** (starts with `rzp_test_`)
   - **Key Secret** (long random string)
7. Update `C:\Users\patha\.env`:
   ```env
   RAZORPAY_KEY_ID=rzp_test_YOUR_KEY_ID_HERE
   RAZORPAY_KEY_SECRET=YOUR_KEY_SECRET_HERE
   ```

### Step 4: Start Backend

```powershell
cd C:\Users\patha
node index.js
```

Expected output:
```
✓ MongoDB Connected
✓ Server running on http://localhost:5000
✓ Environment: development
✓ Frontend URL: http://localhost:5173
```

### Step 5: Start Frontend

In a new terminal:

```powershell
cd c:\Users\patha\.gemini\antigravity\scratch\mithila-art
npm run dev
```

---

## 🧪 TESTING THE COMPLETE FLOW

### Test Case 1: Submit Commission (Customer Side)

1. Go to `http://localhost:5173/commission`
2. Fill in the 3-step form
3. Submit
4. **Expected**: You see "Commission Request Received" with status "Waiting for approval..."

### Test Case 2: Approve Commission (Admin Side - Manual)

Open MongoDB and find the commission document you just created:

```javascript
// In MongoDB:
db.commissions.findOneAndUpdate(
  { referenceId: "COM123456" },
  {
    $set: {
      status: "approved",
      quotedBudget: 5000,
      approvalMessage: "We love your vision! Quote: ₹5,000. Payment required to start."
    }
  }
)
```

Or use our API (curl):

```powershell
$body = @{
    commissionId = "64f1a2b3c4d5e6f7g8h9i0j1"
    quotedBudget = 5000
    approvalMessage = "Commission approved! Quote: ₹5,000"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:5000/admin/approve-commission" `
  -Method POST `
  -Body $body `
  -ContentType "application/json"
```

### Test Case 3: View Approved Status (Customer Side)

1. Refresh the commission page (or it auto-updates after 5 seconds)
2. **Expected**: You see "Commission Approved! 🎉" with the quoted price and "Proceed to Payment" button

### Test Case 4: Make Test Payment

1. Click "Proceed to Payment" button
2. Click "Proceed to Payment" on the payment page
3. Razorpay popup will open
4. **Use these test card details** (Razorpay provided):

   **Card Success Test**:
   - Card: `4111 1111 1111 1111`
   - Expiry: `12/25`
   - CVV: `123`

   **Card Failure Test**:
   - Card: `4444 3333 2222 1111`
   - Expiry: `12/25`
   - CVV: `123`

5. Complete the payment
6. **Expected**: Payment success page or back to home with success notification

### Test Case 5: Verify Data in MongoDB

```javascript
// Check if commission was updated
db.commissions.findOne(
  { referenceId: "COM123456" }
)
```

Expected fields:
- `paymentStatus`: "paid"
- `paymentId`: "pay_xxxxx..." (Razorpay payment ID)
- `transactionId`: Same as paymentId
- `status`: "in-progress"
- `paidAt`: Current timestamp

---

## 🔐 SECURITY CONSIDERATIONS

### ✅ Already Implemented:

1. **Signature Verification**: Backend verifies payment signature with Razorpay key
2. **CORS Protection**: Only your frontend URL can access backend
3. **Order Verification**: Backend checks commission exists before creating order
4. **Status Checks**: Backend verifies commission is "approved" before payment
5. **Error Handling**: All errors are caught and reported

### ⚠️ Additional Security for Production:

1. **Environment Variables**: Keep Razorpay keys in `.env` (NEVER commit to git)
2. **Admin Authentication**: Add authentication for `/admin/approve-commission` endpoint
3. **Rate Limiting**: Add rate limiting to prevent spam
4. **Webhook Verification**: Implement Razorpay webhook for server-to-server verification
5. **HTTPS Only**: Use HTTPS in production (not HTTP)
6. **IP Whitelisting**: Whitelist Razorpay IPs for webhooks

---

## 📊 DATABASE SCHEMA

### Commission Document Structure:

```javascript
{
  _id: ObjectId,
  referenceId: "COM123456",
  
  // Customer Info
  name: "John Doe",
  email: "john@example.com",
  phone: "+91 98765 43210",
  location: "Mumbai",
  
  // Artwork Details
  style: "Madhubani",
  size: "24×36 inches",
  colors: "Gold, Indigo",
  description: "Custom portrait with traditional themes",
  timeline: "Within 1 month",
  
  // Commission Status
  status: "in-progress", // submitted, approved, rejected, in-progress, completed
  
  // Quote & Payment
  quotedBudget: 5000,
  approvalMessage: "Commission approved!",
  
  // Payment Status
  paymentStatus: "paid", // pending, paid, failed
  orderId: "order_xxxxx", // Razorpay Order ID
  paymentId: "pay_xxxxx", // Razorpay Payment ID
  transactionId: "pay_xxxxx",
  
  // Timestamps
  submittedAt: 2024-05-26T10:30:00Z,
  approvedAt: 2024-05-26T11:45:00Z,
  paidAt: 2024-05-26T12:15:00Z
}
```

---

## 🔌 API ENDPOINTS

### Commission Endpoints:

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/commissions` | Submit new commission |
| GET | `/commission/:id` | Get commission details |
| POST | `/admin/approve-commission` | Approve & set price |
| GET | `/admin/commissions` | Get all commissions |

### Payment Endpoints:

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/create-order` | Create Razorpay order |
| POST | `/verify-payment` | Verify payment signature |
| POST | `/payment-failed` | Mark payment as failed |

### Example API Calls:

**Submit Commission:**
```bash
POST http://localhost:5000/commissions
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+91 98765 43210",
  "location": "Mumbai",
  "style": "Madhubani",
  "size": "24×36 inches",
  "colors": "Gold, Indigo",
  "description": "Custom portrait",
  "timeline": "Within 1 month"
}
```

**Create Payment Order:**
```bash
POST http://localhost:5000/create-order
Content-Type: application/json

{
  "commissionId": "64f1a2b3c4d5e6f7g8h9i0j1",
  "amount": 5000
}
```

---

## 🚀 PRODUCTION DEPLOYMENT

### Before Going Live:

1. **Switch to Live Credentials**:
   - Go to Razorpay Dashboard → API Keys
   - Click "Live Mode"
   - Copy Live Key ID and Secret (starts with `rzp_live_`)
   - Update `.env`

2. **Update FRONTEND_URL**:
   ```env
   FRONTEND_URL=https://yourdomain.com
   ```

3. **Enable HTTPS**:
   - Deploy backend on HTTPS
   - Update all `http://localhost:5000` to `https://yourdomain.com/api`

4. **Add Environment Variables** on hosting (Vercel, Heroku, etc.):
   - RAZORPAY_KEY_ID
   - RAZORPAY_KEY_SECRET
   - MONGO_URI
   - NODE_ENV=production
   - FRONTEND_URL

5. **Implement Razorpay Webhooks**:
   - For real-time payment updates
   - More secure than relying on client-side verification alone

---

## 🐛 TROUBLESHOOTING

### Issue: "Razorpay SDK not loaded"

**Solution**: Make sure Razorpay CDN script is in `index.html`:
```html
<script src="https://checkout.razorpay.com/v1/checkout.js"></script>
```

### Issue: "Commission not found" error

**Solution**: Make sure commission was created and approved before attempting payment.

### Issue: "CORS error" from frontend

**Solution**: Verify backend is running and CORS is enabled in `index.js`:
```javascript
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true
}));
```

### Issue: Payment verification fails

**Solution**:
1. Check `.env` has correct Razorpay credentials
2. Verify MongoDB connection is working
3. Check backend console for error messages

### Issue: MongoDB not connected

**Solution**:
```powershell
# Check if MongoDB service is running
Get-Service MongoDB

# If stopped, start it:
Start-Service MongoDB
```

---

## 📱 Payment Methods Supported

The Razorpay integration automatically supports:

- ✅ PhonePe
- ✅ Google Pay (UPI)
- ✅ Paytm
- ✅ UPI Direct
- ✅ Credit/Debit Cards (Visa, Mastercard, Amex)
- ✅ NEFT/RTGS
- ✅ EMI Options
- ✅ Digital Wallets

No additional code needed - all handled by Razorpay!

---

## 📞 Support

For issues:

1. Check Razorpay documentation: https://razorpay.com/docs/
2. Check MongoDB logs: `C:\Users\patha\index.js` console output
3. Check browser console for frontend errors (F12)
4. Check backend terminal for API errors

---

## 🎯 Next Steps

1. ✅ Install Razorpay package
2. ✅ Update `.env` with real credentials
3. ✅ Start backend and frontend
4. ✅ Test the complete flow
5. ✅ Create admin dashboard to approve commissions
6. ✅ Add email notifications for approval/payment
7. ✅ Switch to live mode when ready
8. ✅ Deploy to production

---

**Created**: May 26, 2024
**Version**: 1.0 - Initial Payment Integration
