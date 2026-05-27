# Authentication System Setup Guide

## Overview
This document outlines the complete JWT-based authentication system integrated into the Mithila Art Studio website. The system includes registration, login, user profiles, and secure API endpoints.

## Features Implemented

### 1. **User Registration (Signup)**
- **Route**: `/signup`
- **File**: `src/pages/RegisterPage.jsx`
- **Fields**:
  - Full Name (required)
  - Email (required, validated)
  - Phone Number (required, validated)
  - Password (minimum 8 characters)
  - Confirm Password (must match)
- **Validation**:
  - Email format validation
  - Phone number format validation
  - Password strength requirements
  - Password confirmation matching
- **Features**:
  - Show/hide password toggle
  - Real-time error messages
  - Success notifications
  - Automatic redirect to profile on successful signup
  - Glass morphism UI matching website design

### 2. **User Login**
- **Route**: `/login`
- **File**: `src/pages/LoginPage.jsx`
- **Fields**:
  - Email
  - Password
  - Remember Me checkbox
  - Forgot Password link
- **Features**:
  - Show/hide password eye icon
  - Remember me functionality
  - Error handling and display
  - Success notifications
  - Forgot password link (placeholder)
  - Auto-redirect after successful login

### 3. **User Profile**
- **Route**: `/profile`
- **File**: `src/pages/ProfilePage.jsx`
- **Features**:
  - View account information (Name, Email, Phone, Member Since)
  - Edit profile (Name, Phone)
  - Commission requests section (placeholder for future integration)
  - Order history section (placeholder for future integration)
  - Logout button
  - Protected route (redirects to login if not authenticated)

### 4. **Updated Navbar**
- **File**: `src/components/layout/Navbar.jsx`
- **Changes**:
  - Shows Login/Signup buttons when user is logged out
  - Shows Profile icon and Logout option when user is logged in
  - Mobile menu with auth options
  - All animations and styles preserved
  - Responsive design maintained

## Backend Implementation

### 1. **User Model**
- **File**: `backend/models/User.js`
- **Fields**:
  - `name`: String (required)
  - `email`: String (required, unique, lowercase)
  - `phone`: String (required)
  - `password`: String (required, hashed with bcrypt)
  - `profilePicture`: String (optional)
  - `createdAt`: Date
  - `updatedAt`: Date (auto)
- **Methods**:
  - `comparePassword()`: Compares plain text password with hashed password

### 2. **Authentication Routes**
- **File**: `backend/routes/authRoutes.js`
- **Endpoints**:

#### POST `/api/auth/register`
```json
Request:
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+91 XXXXX XXXXX",
  "password": "password123",
  "confirmPassword": "password123"
}

Response (Success):
{
  "success": true,
  "message": "User registered successfully",
  "token": "jwt_token_here",
  "user": {
    "_id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+91 XXXXX XXXXX",
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

#### POST `/api/auth/login`
```json
Request:
{
  "email": "john@example.com",
  "password": "password123"
}

Response (Success):
{
  "success": true,
  "message": "Login successful",
  "token": "jwt_token_here",
  "user": {
    "_id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+91 XXXXX XXXXX",
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

#### GET `/api/auth/profile` (Protected)
- **Headers**: `Authorization: Bearer <token>`
- **Response**: User object

#### PUT `/api/auth/profile` (Protected)
```json
Request:
{
  "name": "Jane Doe",
  "phone": "+91 YYYYY YYYYY",
  "profilePicture": "url_to_image"
}

Response: Updated user object
```

#### POST `/api/auth/logout` (Protected)
- **Response**: Success message

### 3. **Authentication Middleware**
- **File**: `backend/middleware/authMiddleware.js`
- **Function**: Verifies JWT token in request headers
- **Usage**: Applied to protected routes

### 4. **Authentication Controller**
- **File**: `backend/controllers/authController.js`
- **Functions**:
  - `register()`: Handle user registration
  - `login()`: Handle user login
  - `getProfile()`: Retrieve user profile
  - `updateProfile()`: Update user information
  - `logout()`: Handle logout
  - `generateToken()`: Create JWT token

## Frontend Implementation

### 1. **AuthContext**
- **File**: `src/context/AuthContext.jsx`
- **State**:
  - `isAuthenticated`: Boolean
  - `user`: User object
  - `token`: JWT token
  - `loading`: Loading state
  - `error`: Error message
- **Methods**:
  - `register()`: Register new user
  - `login()`: Login user
  - `logout()`: Logout user
  - `getProfile()`: Fetch user profile
  - `updateProfile()`: Update profile
- **Storage**: Persists token and user in localStorage

### 2. **API Module**
- **File**: `src/api.js`
- **Features**:
  - Axios instance with baseURL
  - Request interceptor to add JWT token
  - Response interceptor to handle 401 errors
  - API methods for:
    - `authAPI.register()`
    - `authAPI.login()`
    - `authAPI.logout()`
    - `authAPI.getProfile()`
    - `authAPI.updateProfile()`

### 3. **Components**
- **LoginPage** (`src/pages/LoginPage.jsx`): Login form with animations
- **RegisterPage** (`src/pages/RegisterPage.jsx`): Signup form with validation
- **ProfilePage** (`src/pages/ProfilePage.jsx`): User profile management

## Security Features

### 1. **Password Security**
- Hashed with bcryptjs (10 salt rounds)
- Minimum 8 characters
- Never returned in API responses
- Password confirmation on signup

### 2. **JWT Tokens**
- Signed with secret key
- Expires in 7 days
- Stored securely in localStorage
- Sent via Authorization header
- Verified on protected routes

### 3. **Email Security**
- Validated on signup and login
- Unique constraint in database
- Stored in lowercase

### 4. **CORS Protection**
- Configured for frontend URL only
- Credentials enabled

## Environment Variables

### Frontend (`.env`)
```
VITE_API_BASE_URL=http://localhost:5000
```

### Backend (`.env`)
```
MONGODB_URI=mongodb://127.0.0.1:27017/mithilaReviews
JWT_SECRET=your_jwt_secret_key_here
RAZORPAY_KEY_ID=your_key
RAZORPAY_KEY_SECRET=your_secret
FRONTEND_URL=http://localhost:5173
PORT=5000
NODE_ENV=development
```

## Installation & Setup

### 1. **Install Dependencies**

**Frontend:**
```bash
npm install
# or
yarn install
```

**Backend:**
```bash
cd backend
npm install
```

### 2. **Configure Environment**

**Backend (.env):**
```bash
cp backend/.env.example backend/.env
# Edit backend/.env with your values
```

### 3. **Start Services**

**Backend:**
```bash
cd backend
npm run dev
# Runs on http://localhost:5000
```

**Frontend:**
```bash
npm run dev
# Runs on http://localhost:5173
```

### 4. **MongoDB Setup**

**Local MongoDB:**
```bash
# Make sure MongoDB is running
mongod
```

**Cloud MongoDB (Atlas):**
Update `MONGODB_URI` in `.env`:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/mithilaReviews
```

## API Testing

### Register User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "phone": "+91 9876543210",
    "password": "password123",
    "confirmPassword": "password123"
  }'
```

### Login User
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Get Profile (Protected)
```bash
curl -X GET http://localhost:5000/api/auth/profile \
  -H "Authorization: Bearer <token>"
```

## Integration Points

### 1. **Commission Page**
- When user is logged in, automatically populate name, email, phone
- Store commissioned artwork linked to user
- Track commission history in profile

### 2. **Shop/Cart**
- Link purchases to user account
- Track order history

### 3. **Newsletter/Notifications**
- Send emails to registered users
- Personalized notifications

## File Structure

```
frontend/
  src/
    pages/
      LoginPage.jsx          (New)
      RegisterPage.jsx       (New)
      ProfilePage.jsx        (New)
    context/
      AuthContext.jsx        (Updated)
    components/
      layout/
        Navbar.jsx           (Updated)
    api.js                   (Updated)

backend/
  models/
    User.js                  (New)
  routes/
    authRoutes.js            (New)
  controllers/
    authController.js        (New)
  middleware/
    authMiddleware.js        (New)
  index.js                   (Updated)
  package.json               (Updated)
  .env.example               (Updated)
```

## Existing Features Preserved

✅ Home Page
✅ Gallery
✅ Commission Page (will integrate user info when logged in)
✅ Blog
✅ History
✅ Shop & Cart
✅ Payment Integration
✅ Contact Form
✅ All animations & transitions
✅ Theme switching
✅ Mobile responsiveness
✅ Navbar structure
✅ Color scheme & gradients

## Future Enhancements

1. **Forgot Password Flow**
   - Email reset link
   - Password reset page
   - Token validation

2. **Social Login**
   - Google OAuth
   - Facebook OAuth

3. **Email Verification**
   - Verify email on signup
   - Resend verification link

4. **Two-Factor Authentication**
   - SMS/Email OTP
   - Authenticator app support

5. **Commission History**
   - Track submitted commissions
   - Commission status updates
   - Timeline tracking

6. **Advanced Profile**
   - Profile picture upload
   - Address book
   - Saved preferences

7. **Admin Dashboard**
   - User management
   - Authentication logs
   - Security settings

## Troubleshooting

### "Cannot POST /api/auth/register"
- Make sure backend is running on port 5000
- Check `FRONTEND_URL` in backend `.env`
- Verify CORS configuration

### "Invalid or expired token"
- Token may have expired (check JWT_EXPIRE setting)
- Try logging out and back in
- Clear browser localStorage

### "Email already registered"
- The email is already in the database
- Use a different email or login with existing account

### MongoDB Connection Error
- Ensure MongoDB is running
- Check `MONGODB_URI` in `.env`
- Verify connection string format

## Support & Maintenance

For issues or questions:
1. Check error messages in browser console
2. Check backend logs
3. Verify environment variables
4. Test API endpoints with curl/Postman
5. Check MongoDB connection

## License & Credits

Created as part of Lalita Pathak Mithila Art Studio website enhancement.
Authentication system uses industry-standard security practices.
