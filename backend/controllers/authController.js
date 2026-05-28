const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const { createTransporter, getPreviewUrl } = require('../utils/emailService');
const { validateEmail, isDisposableEmail, validateIndianPhone } = require('../utils/validation');

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRE = '7d';

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is required for auth token signing. Set it in environment before starting the backend.');
}

// Generate JWT token
const generateToken = (user) => {
  return jwt.sign(
    {
      userId: user._id,
      role: user.role || 'user',
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRE }
  );
};

const cryptoRandom = (len = 40) => {
  return crypto.randomBytes(len).toString('hex');
};

// ============ REGISTER ============
const register = async (req, res) => {
  try {
    const { name, email, phone, password, confirmPassword } = req.body;

    // Validation
    if (!name || !email || !phone || !password || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields',
      });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({ success: false, message: 'Invalid email format' });
    }

    if (isDisposableEmail(email)) {
      return res.status(400).json({ success: false, message: 'Disposable email addresses are not permitted' });
    }

    if (!validateIndianPhone(phone)) {
      return res.status(400).json({ success: false, message: 'Please enter a valid Indian mobile number' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Passwords do not match',
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 8 characters',
      });
    }

    // Strong password (at least one letter and one number)
    const strongPass = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/;
    if (!strongPass.test(password)) {
      return res.status(400).json({ success: false, message: 'Password must include letters and numbers' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'Email already registered',
      });
    }
    // Create new user (unverified)
    const verificationToken = cryptoRandom(20);
    const verificationExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

    const user = new User({
      name,
      email: email.toLowerCase(),
      phone,
      password,
      isVerified: false,
      verificationToken,
      verificationExpires,
    });

    await user.save();

    // Send verification email via Brevo SMTP
    let emailSent = false;
    let emailError = null;
    let previewUrl = null;
    try {
      const transportResult = await createTransporter(console);
      const verifyUrl = `${process.env.BACKEND_URL}/api/auth/verify/${verificationToken}`;
      console.log('Generated Verification URL:', verifyUrl);
      const mailOptions = {
        from: process.env.EMAIL_FROM,
        to: user.email,
        subject: 'Verify your Mithila Art account',
        html: `<p>Hi ${user.name},</p>
          <p>Thanks for registering. Please verify your email by clicking the link below:</p>
          <p><a href="${verifyUrl}">Verify Email</a></p>
          <p>This link expires in 24 hours.</p>`,
      };

      const info = await transportResult.transporter.sendMail(mailOptions);
      emailSent = true;
      if (transportResult.provider === 'ethereal') {
        previewUrl = getPreviewUrl(info);
      }
    } catch (mailErr) {
      emailError = mailErr && mailErr.message ? mailErr.message : String(mailErr);
      console.error('Registration email send error [sendMail failure]:', mailErr);
    }

    // Return response indicating verification required
    const userData = user.toObject();
    delete userData.password;
    delete userData.verificationToken;
    delete userData.verificationExpires;

    const resp = { success: true, requiresVerification: false, user: userData }; // TEMPORARILY DISABLED FOR SMTP DEBUGGING: set requiresVerification to false
    if (emailSent) {
      resp.message = 'Registration successful. Verification email sent.';
      resp.emailSent = true;
      if (previewUrl) resp.previewUrl = previewUrl;
    } else {
      resp.message = 'Registration successful. Could not send verification email. Please request resend.';
      resp.emailSent = false;
      resp.emailError = emailError;
    }
    res.status(201).json(resp);
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Registration failed',
    });
  }
};

// Verify email route
const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;
    if (!token) return res.status(400).json({ success: false, message: 'Verification token missing' });

    const user = await User.findOne({ verificationToken: token, verificationExpires: { $gt: Date.now() } });
    if (!user) {
      const redirectFail = `${process.env.FRONTEND_URL}/login?verified=false`;
      return res.redirect(redirectFail);
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationExpires = undefined;
    await user.save();

    const redirectSuccess = `${process.env.FRONTEND_URL}/login?verified=true`;
    return res.redirect(redirectSuccess);
  } catch (error) {
    console.error('Email verification error:', error);
    return res.status(500).json({ success: false, message: error.message || 'Verification failed' });
  }
};

// Resend verification email
const resendVerification = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ success: false, message: 'Email required' });

    if (!validateEmail(email)) {
      return res.status(400).json({ success: false, message: 'Invalid email format' });
    }

    if (isDisposableEmail(email)) {
      return res.status(400).json({ success: false, message: 'Disposable email addresses are not permitted' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(404).json({ success: false, message: 'Account does not exist' });
    if (user.isVerified) return res.status(400).json({ success: false, message: 'Email already verified' });

    const verificationToken = cryptoRandom(20);
    const verificationExpires = Date.now() + 24 * 60 * 60 * 1000;

    user.verificationToken = verificationToken;
    user.verificationExpires = verificationExpires;
    await user.save();

    let emailSent = false;
    let emailError = null;
    let previewUrl = null;

    try {
      const transportResult = await createTransporter(console);
      const verifyUrl = `${process.env.BACKEND_URL}/api/auth/verify/${verificationToken}`;
      console.log('Generated Resend Verification URL:', verifyUrl);
      const mailOptions = {
        from: process.env.EMAIL_FROM,
        to: user.email,
        subject: 'Resend: Verify your Mithila Art account',
        html: `<p>Hi ${user.name},</p><p>Please verify your email by clicking <a href="${verifyUrl}">this link</a>. Link expires in 24 hours.</p>`,
      };
      const info = await transportResult.transporter.sendMail(mailOptions);
      emailSent = true;
      if (transportResult.provider === 'ethereal') {
        previewUrl = getPreviewUrl(info);
      }
    } catch (mailErr) {
      emailError = mailErr && mailErr.message ? mailErr.message : String(mailErr);
      console.error('Resend verification email send error [sendMail failure]:', mailErr);
    }
    const resp = { success: emailSent, emailSent };
    if (emailSent) {
      resp.message = 'Verification email resent';
      if (previewUrl) resp.previewUrl = previewUrl;
    } else {
      resp.message = 'Could not resend verification email';
      resp.emailError = emailError;
    }
    return res.status(emailSent ? 200 : 500).json(resp);
  } catch (error) {
    console.error('Resend verification error:', error);
    return res.status(500).json({ success: false, message: error.message || 'Could not resend verification' });
  }
};

// ============ LOGIN ============
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password',
      });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({ success: false, message: 'Invalid email format' });
    }

    // Find user (include password field for comparison)
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

    if (!user) {
      return res.status(404).json({ success: false, message: 'Account does not exist' });
    }

    // Compare passwords
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: 'Invalid password' });
    }

    // TEMPORARILY DISABLED FOR SMTP DEBUGGING
    // Check email verification
    // if (!user.isVerified) {
    //   return res.status(403).json({ success: false, message: 'Please verify your email before logging in.' });
    // }

    // Generate token
    const token = generateToken(user);

    // Return user data (exclude password)
    const userData = user.toObject();
    delete userData.password;

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: userData,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Login failed',
    });
  }
};

// ============ GET PROFILE ============
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch profile',
    });
  }
};

// ============ UPDATE PROFILE ============
const updateProfile = async (req, res) => {
  try {
    const { name, phone, profilePicture } = req.body;
    const userId = req.user.userId;

    const updateData = {};
    if (name) updateData.name = name;
    if (phone) updateData.phone = phone;
    if (profilePicture) updateData.profilePicture = profilePicture;

    const user = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
      runValidators: true,
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user,
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to update profile',
    });
  }
};

// ============ LOGOUT ============
const logout = (req, res) => {
  // Token is handled on the client side
  res.status(200).json({
    success: true,
    message: 'Logout successful',
  });
};

// ============ FORGOT PASSWORD ============
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required' });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({ success: false, message: 'Invalid email format' });
    }

    if (isDisposableEmail(email)) {
      return res.status(400).json({ success: false, message: 'Disposable email addresses are not permitted' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(404).json({ success: false, message: 'Account not found' });
    }

    const resetToken = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save({ validateBeforeSave: false });

    const transportResult = await createTransporter(console);
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
    console.log('Generated Reset URL:', resetUrl);

    // 6. Prepare email - ONLY send to the requested user's email
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      replyTo: process.env.EMAIL_FROM,
      to: normalizedEmail,
      subject: 'Reset your Mithila Art password',
      html: `<p>Hi ${user.name || 'user'},</p>
        <p>We received a request to reset your password. Click the link below to proceed:</p>
        <p><a href="${resetUrl}">Reset Password</a></p>
        <p>This link will expire in one hour.</p>
        <p>If you did not request this, please ignore this email.</p>`,
    };

    // 7. Send email
    try {
      const info = await transportResult.transporter.sendMail(mailOptions);
      const responsePayload = {
        success: true,
        message: 'Reset email sent successfully',
        provider: transportResult.provider,
      };
      
      if (transportResult.provider === 'ethereal') {
        const previewUrl = getPreviewUrl(info);
        responsePayload.previewUrl = previewUrl;
        responsePayload.resetUrl = resetUrl;
      }
      return res.status(200).json(responsePayload);
    } catch (mailErr) {
      console.error('❌ Email send failed:', mailErr.message);
      return res.status(500).json({ success: false, message: 'Failed to send reset email', error: mailErr.message || String(mailErr) });
    }
  } catch (error) {
    console.error('❌ Forgot password error:', error);
    return res.status(500).json({ success: false, message: error.message || 'Could not process request' });
  }
};

// ============ RESET PASSWORD ============
const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password, confirmPassword } = req.body;
    if (!token) {
      console.warn('❌ No reset token provided');
      return res.status(400).json({ success: false, message: 'Reset token is required' });
    }

    if (!password || !confirmPassword) {
      return res.status(400).json({ success: false, message: 'Password and confirmation required' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ success: false, message: 'Passwords do not match' });
    }

    if (password.length < 8) {
      return res.status(400).json({ success: false, message: 'Password must be at least 8 characters' });
    }

    const user = await User.findOne({ 
      resetPasswordToken: token, 
      resetPasswordExpires: { $gt: Date.now() } 
    });

    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid or expired reset token' });
    }
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();
    return res.status(200).json({ 
      success: true, 
      message: 'Password reset successful. You can now login with your new password.' 
    });
  } catch (error) {
    console.error('❌ Reset password error:', error);
    res.status(500).json({ success: false, message: error.message || 'Could not reset password' });
  }
};

module.exports = {
  register,
  login,
  getProfile,
  updateProfile,
  logout,
  forgotPassword,
  resetPassword,
  generateToken,
  verifyEmail,
  resendVerification,
};

