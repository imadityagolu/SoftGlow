const Customer = require('../models/Customer');
const Admin = require('../models/Admin');
const Notification = require('../models/Notification');
const OTP = require('../models/OTP');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { generateOTP, sendOTPEmail } = require('../utils/emailService');
const { createNotification } = require('./notificationController');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '30d',
  });
};

// Customer Registration
const registerCustomer = async (req, res) => {
  try {
    const { firstName, lastName, email, password, agreeToTerms } = req.body;

    // Validation
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    // Check if user agreed to terms
    if (!agreeToTerms) {
      return res.status(400).json({
        success: false,
        message: 'You must agree to the terms and conditions'
      });
    }

    // Check if customer already exists
    const existingCustomer = await Customer.findOne({ email });
    if (existingCustomer) {
      return res.status(400).json({
        success: false,
        message: 'Customer with this email already exists'
      });
    }

    // Create new customer
    const customer = await Customer.create({
      firstName,
      lastName,
      email,
      password
    });

    // Generate token
    const token = generateToken(customer._id);

    // Create welcome notification for the new customer
    try {
      await Notification.create({
        message: `Welcome to SoftGlow, ${customer.firstName}! 🕯️ We're excited to have you join our family. Explore our collection and place your first order!`,
        type: 'general',
        userId: customer._id,
        userType: 'Customer'
      });
    } catch (notificationError) {
      console.error('Error creating welcome notification:', notificationError);
      // Don't fail registration if notification creation fails
    }

    // Create notification for all admins about new customer
    try {
      const admins = await Admin.find({ isActive: true });
      const adminNotifications = admins.map(admin => ({
        message: `New customer joined! 👋 ${customer.firstName} ${customer.lastName} (${customer.email}) has registered on SoftGlow.`,
        type: 'general',
        userId: admin._id,
        userType: 'Admin'
      }));
      
      if (adminNotifications.length > 0) {
        await Notification.insertMany(adminNotifications);
      }
    } catch (adminNotificationError) {
      console.error('Error creating admin notifications:', adminNotificationError);
      // Don't fail registration if notification creation fails
    }

    res.status(201).json({
      success: true,
      message: 'Customer registered successfully',
      data: {
        customer,
        token
      }
    });

  } catch (error) {
    console.error('Customer registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during registration',
      error: error.message
    });
  }
};

// Customer Login
const loginCustomer = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    // Find customer and include password for comparison
    const customer = await Customer.findOne({ email }).select('+password');
    if (!customer) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check if customer is active
    if (!customer.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Customer account is deactivated'
      });
    }

    // Compare password
    const isPasswordValid = await customer.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Update last login
    customer.lastLogin = new Date();
    await customer.save();

    // Generate token
    const token = generateToken(customer._id);

    // Remove password from response
    customer.password = undefined;

    res.status(200).json({
      success: true,
      message: 'Customer logged in successfully',
      data: {
        customer,
        token
      }
    });

  } catch (error) {
    console.error('Customer login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login',
      error: error.message
    });
  }
};

// Get Customer Profile
const getCustomerProfile = async (req, res) => {
  try {
    const customer = await Customer.findById(req.customer.id);
    
    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        customer
      }
    });

  } catch (error) {
    console.error('Get customer profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Update Customer Profile
const updateCustomerProfile = async (req, res) => {
  try {
    const { firstName, lastName, phone, address, preferences } = req.body;
    
    const customer = await Customer.findById(req.customer.id);
    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found'
      });
    }

    // Update fields if provided
    if (firstName) customer.firstName = firstName;
    if (lastName) customer.lastName = lastName;
    if (phone) customer.phone = phone;
    if (address) customer.address = { ...customer.address, ...address };
    if (preferences) customer.preferences = { ...customer.preferences, ...preferences };

    await customer.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        customer
      }
    });

  } catch (error) {
    console.error('Update customer profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Customer Logout (client-side token removal)
const logoutCustomer = async (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Customer logged out successfully'
  });
};

// Google OAuth Callback
const googleAuthCallback = async (req, res) => {
  try {
    // User is authenticated via Passport
    const customer = req.user;
    
    // Generate JWT token
    const token = generateToken(customer._id);
    
    // Update last login
    customer.lastLogin = new Date();
    await customer.save();
    
    // Redirect to frontend with token and user data
    const redirectUrl = `${process.env.FRONTEND_URL}/customer/oauth-success?token=${token}&user=${encodeURIComponent(JSON.stringify(customer))}`;
    res.redirect(redirectUrl);
    
  } catch (error) {
    console.error('Google OAuth callback error:', error);
    res.redirect(`${process.env.FRONTEND_URL}/customer/login?error=oauth_callback_failed`);
  }
};

// Send OTP for password reset
const sendPasswordResetOTP = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    // Check if customer exists
    const customer = await Customer.findOne({ email: email.toLowerCase() });
    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'No account found with this email address'
      });
    }

    // Check if customer signed up with Google OAuth
    if (customer.authProvider === 'google' || customer.googleId) {
      return res.status(400).json({
        success: false,
        message: 'You have signed up using Google. Please use "Sign in with Google" to access your account.',
        isGoogleUser: true
      });
    }

    // Check for existing valid OTP
    const existingOTP = await OTP.findOne({
      email: email.toLowerCase(),
      purpose: 'password_reset',
      isUsed: false,
      expiresAt: { $gt: new Date() }
    });

    if (existingOTP) {
      return res.status(400).json({
        success: false,
        message: 'An OTP has already been sent. Please wait before requesting a new one.'
      });
    }

    // Generate new OTP
    const otp = generateOTP();

    // Save OTP to database
    await OTP.create({
      email: email.toLowerCase(),
      otp,
      purpose: 'password_reset'
    });

    // Send OTP email
    const emailResult = await sendOTPEmail(email, otp, customer.firstName);

    // Always return success since OTP is generated and saved to database
    // Even if email fails, user can still use the OTP (logged in console for debugging)
    const message = emailResult.emailFailed 
      ? 'OTP generated successfully. Check server logs for OTP (email delivery failed)'
      : 'OTP sent successfully to your email address';

    res.status(200).json({
      success: true,
      message: message,
      emailSent: !emailResult.emailFailed
    });

  } catch (error) {
    console.error('Send OTP error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Verify OTP
const verifyPasswordResetOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: 'Email and OTP are required'
      });
    }

    // Find OTP record
    const otpRecord = await OTP.findOne({
      email: email.toLowerCase(),
      otp,
      purpose: 'password_reset'
    });

    if (!otpRecord) {
      return res.status(400).json({
        success: false,
        message: 'Invalid OTP'
      });
    }

    // Check if OTP is valid
    if (!otpRecord.isValid()) {
      return res.status(400).json({
        success: false,
        message: 'OTP has expired or exceeded maximum attempts'
      });
    }

    // Mark OTP as used
    await otpRecord.markAsUsed();

    // Generate a temporary token for password reset
    const resetToken = jwt.sign(
      { email: email.toLowerCase(), purpose: 'password_reset' },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );

    res.status(200).json({
      success: true,
      message: 'OTP verified successfully',
      resetToken
    });

  } catch (error) {
    console.error('Verify OTP error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Reset password
const resetPassword = async (req, res) => {
  try {
    const { resetToken, newPassword } = req.body;

    if (!resetToken || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Reset token and new password are required'
      });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 8 characters long'
      });
    }

    // Verify reset token
    let decoded;
    try {
      decoded = jwt.verify(resetToken, process.env.JWT_SECRET);
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired reset token'
      });
    }

    if (decoded.purpose !== 'password_reset') {
      return res.status(400).json({
        success: false,
        message: 'Invalid reset token'
      });
    }

    // Find customer
    const customer = await Customer.findOne({ email: decoded.email });
    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found'
      });
    }

    // Update customer password (let the model middleware handle hashing)
    customer.password = newPassword;
    await customer.save();

    // Create notification for password reset
    try {
      // console.log(`📧 Creating password reset notification for customer: ${customer.email} (ID: ${customer._id})`);
      const notification = await createNotification({
        message: `Your password has been successfully reset on ${new Date().toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })}. If you didn't make this change, please contact support immediately.`,
        type: 'general',
        userId: customer._id,
        userType: 'Customer'
      });
      // console.log(`✅ Password reset notification created successfully: ${notification._id}`);
    } catch (notificationError) {
      console.error('❌ Error creating password reset notification:', notificationError);
      // Don't fail the password reset if notification creation fails
    }

    // Clean up any remaining OTPs for this email
    await OTP.deleteMany({
      email: decoded.email,
      purpose: 'password_reset'
    });

    res.status(200).json({
      success: true,
      message: 'Password reset successfully'
    });

  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

module.exports = {
  registerCustomer,
  loginCustomer,
  getCustomerProfile,
  updateCustomerProfile,
  logoutCustomer,
  googleAuthCallback,
  sendPasswordResetOTP,
  verifyPasswordResetOTP,
  resetPassword
};