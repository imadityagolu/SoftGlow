const Customer = require('../models/Customer');
const jwt = require('jsonwebtoken');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '30d',
  });
};

// Customer Registration
const registerCustomer = async (req, res) => {
  try {
    const { firstName, lastName, email, phone, password, confirmPassword, agreeToTerms } = req.body;

    // Validation
    if (!firstName || !lastName || !email || !phone || !password || !confirmPassword) {
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

    // Check if phone number already exists
    const existingPhone = await Customer.findOne({ phone });
    if (existingPhone) {
      return res.status(400).json({
        success: false,
        message: 'Customer with this phone number already exists'
      });
    }

    // Create new customer
    const customer = await Customer.create({
      firstName,
      lastName,
      email,
      phone,
      password
    });

    // Generate token
    const token = generateToken(customer._id);

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
    const customer = await Customer.findById(req.customer.id)
      .populate('orders')
      .populate('favorites');
    
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

module.exports = {
  registerCustomer,
  loginCustomer,
  getCustomerProfile,
  updateCustomerProfile,
  logoutCustomer
};