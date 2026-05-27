# Quick Start Guide - Authentication System

## 🚀 Fast Setup (5 minutes)

### Step 1: Install Backend Dependencies
```bash
cd backend
npm install
```

### Step 2: Configure Backend Environment
```bash
# Copy example file
cp .env.example .env

# Edit .env and set:
# - MONGODB_URI (local or Atlas)
# - JWT_SECRET (any random string)
# - FRONTEND_URL=http://localhost:5173
```

### Step 3: Install Frontend Dependencies
```bash
# Go back to root
cd ..

# Install if not already done
npm install
```

### Step 4: Start Services

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
# Should show: ✓ Server running on http://localhost:5000
```

**Terminal 2 - Frontend:**
```bash
npm run dev
# Should show: ✓ Local: http://localhost:5173
```

### Step 5: Test It Out

1. Open http://localhost:5173 in your browser
2. Click "Sign Up" in navbar (or go to http://localhost:5173/signup)
3. Create an account:
   - Name: Your Name
   - Email: test@example.com
   - Phone: +91 9876543210
   - Password: TestPass123 (minimum 8 chars)
4. Submit → You'll be logged in and redirected to profile
5. Click your profile icon in navbar → View your profile
6. Click "Sign Out" → Returns to login screen

## ✅ Features to Test

### Authentication
- ✅ Sign up with validation
- ✅ Login with email/password
- ✅ Persistent login (refresh page - stays logged in)
- ✅ Logout functionality
- ✅ Show/hide password toggle
- ✅ Error messages
- ✅ Success notifications

### Profile
- ✅ View account details
- ✅ Edit name and phone
- ✅ Member since date
- ✅ Commission history (placeholder)
- ✅ Order history (placeholder)

### Navbar
- ✅ Shows Login/Signup when logged out
- ✅ Shows Profile icon when logged in
- ✅ Logout option in mobile menu
- ✅ All existing features preserved

## 🔧 Useful Commands

**Backend Development:**
```bash
cd backend
npm run dev          # Start server
npm start            # Alternative start
```

**Frontend Development:**
```bash
npm run dev          # Start Vite dev server
npm run build        # Build for production
npm run preview      # Preview production build
```

**MongoDB:**
```bash
# If using local MongoDB
mongod              # Start MongoDB service

# Check if running
mongo               # Connect to MongoDB shell
```

## 📝 API Endpoints (Backend)

```bash
# Register
POST http://localhost:5000/api/auth/register
Body: { name, email, phone, password, confirmPassword }

# Login
POST http://localhost:5000/api/auth/login
Body: { email, password }

# Get Profile (requires token in Authorization header)
GET http://localhost:5000/api/auth/profile
Headers: { Authorization: Bearer <token> }

# Update Profile (requires token)
PUT http://localhost:5000/api/auth/profile
Body: { name, phone, profilePicture }

# Logout
POST http://localhost:5000/api/auth/logout
```

## 🔍 Troubleshooting

### "Cannot find module" error
```bash
npm install
# or
npm install --force
```

### "MONGODB_URI not set" warning
Add to backend/.env:
```
MONGODB_URI=mongodb://127.0.0.1:27017/mithilaReviews
```

### "CORS error" on frontend
1. Check backend is running on port 5000
2. Verify `FRONTEND_URL` in backend/.env equals http://localhost:5173
3. Check `.env.example` has correct settings

### "Cannot POST /api/auth/register"
1. Backend not running? Start it: `cd backend && npm run dev`
2. Check if on http://localhost:5000
3. Frontend .env missing? Create it or check VITE_API_BASE_URL

### Token expired after refresh
Tokens last 7 days. After expiry:
1. Clear browser localStorage
2. Login again
3. New token will be generated

## 📁 Key Files Modified/Created

**Created:**
- `src/pages/LoginPage.jsx` - Login form
- `src/pages/RegisterPage.jsx` - Signup form  
- `src/pages/ProfilePage.jsx` - User profile
- `backend/models/User.js` - User schema
- `backend/routes/authRoutes.js` - Auth endpoints
- `backend/controllers/authController.js` - Auth logic
- `backend/middleware/authMiddleware.js` - JWT verification

**Updated:**
- `src/context/AuthContext.jsx` - JWT-based auth
- `src/components/layout/Navbar.jsx` - Auth UI in navbar
- `src/App.jsx` - New routes
- `src/api.js` - Axios instance with interceptors
- `backend/index.js` - Import auth routes
- `backend/package.json` - Added bcryptjs, jsonwebtoken
- `package.json` - Added axios

**Configuration:**
- `backend/.env.example` - Backend config template
- `AUTH_SETUP.md` - Complete documentation

## 🎨 Design Notes

All auth pages use:
- Glass morphism backgrounds
- Existing color scheme (earth/cream/gold)
- Framer Motion animations
- Same typography & spacing
- Mobile responsive design
- Dark mode support

## 🔐 Security Checklist

- ✅ Passwords hashed with bcrypt
- ✅ JWT tokens for authentication
- ✅ Protected API routes
- ✅ Email uniqueness enforced
- ✅ CORS configuration
- ✅ No plaintext passwords in responses
- ✅ Token stored securely in localStorage
- ✅ Automatic logout on token expiry

## 📚 Documentation

Full documentation available in [AUTH_SETUP.md](./AUTH_SETUP.md)

Covers:
- Complete feature list
- All API endpoints
- Installation guide
- Environment variables
- Troubleshooting
- Future enhancements

## 🎯 Next Steps

1. **Test locally** - Follow Setup above
2. **Deploy backend** - Render (configured in render.yaml)
3. **Deploy frontend** - Netlify (configured in netlify.toml)
4. **Update .env** - Use production URLs
5. **Set JWT_SECRET** - Use strong random value
6. **Enable email** - Configure SendGrid for password reset
7. **Monitor** - Check logs and user feedback

## 💡 Tips

- Login persists across page refreshes
- Passwords minimum 8 characters
- Email must be valid format
- Phone validation for common formats
- Remember me checkbox (for UI consistency)
- All errors show in real-time
- Success notifications auto-dismiss

## ❓ Need Help?

Check [AUTH_SETUP.md](./AUTH_SETUP.md) for:
- Detailed API documentation
- MongoDB setup instructions
- Deployment guidelines
- Integration examples
- Common issues & fixes

---

**Your authentication system is ready to use! 🎉**

Start with the 5-minute setup above, then explore the full documentation.
