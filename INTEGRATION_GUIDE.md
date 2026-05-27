# Authentication Integration Guide

## Overview
This guide explains how to integrate the authentication system with existing Mithila Art Studio features like Commission Requests, Shop Orders, and other user-related functionality.

## 1. Commission Page Integration

### Current State
The Commission page accepts submissions from anyone (public form).

### Integration Steps

#### Step 1: Import useAuth Hook
```jsx
import { useAuth } from '../context/AuthContext';
```

#### Step 2: Get User Data
```jsx
const { isAuthenticated, user } = useAuth();
```

#### Step 3: Pre-fill Form When Logged In
```jsx
const [formData, setFormData] = useState(() => {
  if (isAuthenticated && user) {
    return {
      name: user.name || '',
      email: user.email || '',
      phone: user.phone || '',
      // ... rest of fields
    };
  }
  return {
    name: '',
    email: '',
    phone: '',
    // ... rest of fields
  };
});
```

#### Step 4: Show Login Prompt (Optional)
```jsx
if (!isAuthenticated) {
  return (
    <div className="... alert-style">
      <p>Sign in to your account to easily submit commissions</p>
      <Link to="/login">Login Here</Link>
    </div>
  );
}
```

#### Step 5: Link Commission to User (Backend)
Update commission endpoint to include userId:

**Backend - commissionController.js (NEW)**
```javascript
const submitCommission = async (req, res) => {
  try {
    const userId = req.user?.userId; // From auth middleware
    
    const commission = new Commission({
      userId,  // Link to user
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      // ... other fields
    });
    
    await commission.save();
    res.status(201).json({ success: true, commission });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
```

**Backend - CommissionSchema (UPDATE)**
```javascript
const CommissionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null  // Allow public submissions too
  },
  name: { type: String, required: true },
  // ... rest of schema
});
```

**Backend - commissionRoutes.js (NEW)**
```javascript
const express = require('express');
const { authenticate } = require('../middleware/authMiddleware');

const router = express.Router();

// Public endpoint - anyone can submit
router.post('/commissions', submitCommission);

// Protected endpoint - users can view their commissions
router.get('/commissions/my-commissions', authenticate, getMyCommissions);
router.get('/commission/:id', getCommissionDetails);

module.exports = router;
```

## 2. Shop/Cart Integration

### Show User Orders in Profile
```jsx
// In ProfilePage.jsx
const [orders, setOrders] = useState([]);

useEffect(() => {
  if (isAuthenticated && user) {
    fetchUserOrders();
  }
}, [isAuthenticated, user]);

const fetchUserOrders = async () => {
  try {
    const response = await api.get('/api/orders/my-orders');
    setOrders(response.data.orders);
  } catch (error) {
    console.error('Failed to fetch orders:', error);
  }
};
```

### Backend - Track Orders by User
```javascript
// Update CartOrderSchema
const CartOrderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  name: String,
  // ... existing fields
});

// Add endpoint to get user orders
router.get('/api/orders/my-orders', authenticate, async (req, res) => {
  const orders = await CartOrder.find({ userId: req.user.userId });
  res.json({ success: true, orders });
});
```

## 3. Newsletter/Communications Integration

### Subscribe User to Newsletter
```jsx
// In ProfilePage or checkout
const subscribeNewsletter = async () => {
  if (user && user.email) {
    try {
      await api.post('/api/newsletter/subscribe', {
        email: user.email,
        name: user.name
      });
      setSuccess('Subscribed to newsletter!');
    } catch (error) {
      setError('Failed to subscribe');
    }
  }
};
```

## 4. Admin Dashboard Integration

### Protect Admin Routes
```jsx
// src/utils/ProtectedRoute.jsx (NEW)
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function AdminRoute({ element }) {
  const { user } = useAuth();
  
  // Check if user is admin (add role to User model)
  if (!user || user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }
  
  return element;
}

// Usage in App.jsx
<Route 
  path="/admin" 
  element={<AdminRoute element={<AdminPage />} />} 
/>
```

### Update User Model with Role
```javascript
// backend/models/User.js
userSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  password: String,
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  // ... other fields
});
```

## 5. Commission History in Profile

### Display User's Commissions
```jsx
// In ProfilePage.jsx
const [myCommissions, setMyCommissions] = useState([]);

useEffect(() => {
  if (isAuthenticated && user) {
    fetchMyCommissions();
  }
}, [isAuthenticated, user]);

const fetchMyCommissions = async () => {
  try {
    const response = await api.get('/api/commissions/my-commissions');
    setMyCommissions(response.data.commissions);
  } catch (error) {
    console.error('Failed to fetch commissions:', error);
  }
};

// Render commissions
{myCommissions.length > 0 ? (
  <div className="space-y-4">
    {myCommissions.map((commission) => (
      <CommissionCard key={commission._id} commission={commission} />
    ))}
  </div>
) : (
  <p>No commission requests yet</p>
)}
```

## 6. Contact Form Enhancement

### Pre-fill User Info
```jsx
// In ContactPage.jsx
const { isAuthenticated, user } = useAuth();

// Initialize form
const [formData, setFormData] = useState(() => ({
  name: isAuthenticated && user ? user.name : '',
  email: isAuthenticated && user ? user.email : '',
  phone: isAuthenticated && user ? user.phone : '',
  message: ''
}));
```

## 7. Email Notifications

### Send Welcome Email
```javascript
// backend/controllers/authController.js
const sendWelcomeEmail = async (email, name) => {
  // Implementation with SendGrid, Nodemailer, etc.
  // Example:
  /*
  const msg = {
    to: email,
    from: 'noreply@mithilaart.com',
    subject: 'Welcome to Lalita Pathak Mithila Art Studio!',
    html: `<h1>Welcome, ${name}!</h1>...`
  };
  await sgMail.send(msg);
  */
};

// Call after successful registration
const register = async (req, res) => {
  // ... registration logic
  await sendWelcomeEmail(user.email, user.name);
};
```

## 8. Protected Commission Payment

### Link Payment to User
```javascript
// backend - verify-payment
router.post('/verify-payment', async (req, res) => {
  // ... payment verification
  
  const commission = await Commission.findByIdAndUpdate(
    commissionId,
    {
      userId: req.user?.userId || null, // Associate with user if logged in
      paymentStatus: 'paid',
      // ... other updates
    }
  );
});
```

## 9. User Settings/Preferences

### Add to Profile Page
```jsx
// In ProfilePage.jsx
const [preferences, setPreferences] = useState({
  emailNotifications: true,
  newsNotifications: true,
  orderUpdates: true
});

const updatePreferences = async () => {
  await api.put('/api/auth/preferences', preferences);
};
```

## 10. Activity Tracking

### Log User Actions
```javascript
// backend/middleware/activityLogger.js
const logActivity = (action) => async (req, res, next) => {
  if (req.user) {
    await Activity.create({
      userId: req.user.userId,
      action,
      timestamp: new Date()
    });
  }
  next();
};

// Usage
router.post('/commissions', logActivity('commission_created'), submitCommission);
```

## Implementation Priority

1. **High Priority** (Start first)
   - Commission page auto-fill
   - User commissions in profile
   - Order history

2. **Medium Priority** (Next)
   - Newsletter integration
   - Email notifications
   - Admin protection

3. **Low Priority** (Later)
   - User preferences
   - Activity tracking
   - Advanced analytics

## Testing Integration

### Test Commission with User
1. Login at http://localhost:5173/login
2. Go to http://localhost:5173/commission
3. Verify form is pre-filled with user data
4. Submit commission
5. Check in profile - commission should appear in history

### Test Payment Integration
1. Create commission while logged in
2. Submit and go to payment
3. Complete payment
4. Verify commission linked to user in database

### Test Admin Features
1. Make a user admin in database:
   ```javascript
   db.users.updateOne(
     { email: "admin@example.com" },
     { $set: { role: "admin" } }
   )
   ```
2. Login as admin
3. Access admin features
4. Verify restrictions work

## Database Relationships

```javascript
// User -> Commissions
User.commissionsSubmitted = [CommissionId, ...]

// User -> Orders
User.orders = [OrderId, ...]

// User -> Newsletter
User.subscribed = true/false

// Commission -> User
Commission.userId = UserId (optional)

// Order -> User
Order.userId = UserId (optional)
```

## API Endpoints to Create

```
POST   /api/auth/register              (exists)
POST   /api/auth/login                 (exists)
GET    /api/auth/profile               (exists)
PUT    /api/auth/profile               (exists)
POST   /api/auth/logout                (exists)

GET    /api/commissions/my-commissions (create)
POST   /api/commissions                (update to link user)
GET    /api/orders/my-orders           (create)
POST   /api/newsletter/subscribe       (create)
GET    /api/auth/preferences           (create)
PUT    /api/auth/preferences           (create)
```

## Summary

The authentication system is designed to integrate smoothly with existing features:

✅ Pre-fill forms with user data
✅ Track user commissions and orders
✅ Send personalized emails
✅ Protect admin features
✅ Maintain public access where needed
✅ Keep existing functionality intact

Follow the priority list above to implement integrations gradually without breaking existing features.
