const Admin = require('../models/Admin');
const jwt = require('jsonwebtoken');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '30d',
  });
};

// Admin Registration
const registerAdmin = async (req, res) => {
  try {
    const { firstName, lastName, email, password, confirmPassword, adminCode } = req.body;

    // Validation
    if (!firstName || !lastName || !email || !password || !confirmPassword || !adminCode) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Passwords do not match'
      });
    }

    // Validate admin code (you can set this in your .env file)
    const validAdminCode = process.env.ADMIN_CODE || 'ADMIN123';
    if (adminCode !== validAdminCode) {
      return res.status(400).json({
        success: false,
        message: 'Invalid admin code'
      });
    }

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({
        success: false,
        message: 'Admin with this email already exists'
      });
    }

    // Create new admin
    const admin = await Admin.create({
      firstName,
      lastName,
      email,
      password,
      adminCode
    });

    // Generate token
    const token = generateToken(admin._id);

    res.status(201).json({
      success: true,
      message: 'Admin registered successfully',
      data: {
        admin,
        token
      }
    });

  } catch (error) {
    console.error('Admin registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during registration',
      error: error.message
    });
  }
};

// Admin Login
const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    // Find admin and include password for comparison
    const admin = await Admin.findOne({ email }).select('+password');
    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check if admin is active
    if (!admin.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Admin account is deactivated'
      });
    }

    // Compare password
    const isPasswordValid = await admin.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Update last login
    admin.lastLogin = new Date();
    await admin.save();

    // Generate token
    const token = generateToken(admin._id);

    // Remove password from response
    admin.password = undefined;

    res.status(200).json({
      success: true,
      message: 'Admin logged in successfully',
      data: {
        admin,
        token
      }
    });

  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login',
      error: error.message
    });
  }
};

// Get Admin Profile
const getAdminProfile = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin.id);
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Admin not found'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        admin
      }
    });

  } catch (error) {
    console.error('Get admin profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Admin Logout (client-side token removal)
const logoutAdmin = async (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Admin logged out successfully'
  });
};

module.exports = {
  registerAdmin,
  loginAdmin,
  getAdminProfile,
  logoutAdmin
};