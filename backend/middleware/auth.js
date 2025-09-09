const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const Customer = require('../models/Customer');

// Protect Admin Routes
const protectAdmin = async (req, res, next) => {
  try {
    let token;

    // Check if token exists in headers
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Find admin by id
    const admin = await Admin.findById(decoded.id);
    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token. Admin not found.'
      });
    }

    // Check if admin is active
    if (!admin.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Admin account is deactivated.'
      });
    }

    // Add admin to request object
    req.admin = admin;
    next();

  } catch (error) {
    console.error('Admin auth middleware error:', error);
    return res.status(401).json({
      success: false,
      message: 'Invalid token.'
    });
  }
};

// Protect Customer Routes
const protectCustomer = async (req, res, next) => {
  try {
    let token;

    // Check if token exists in headers
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Find customer by id
    const customer = await Customer.findById(decoded.id);
    if (!customer) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token. Customer not found.'
      });
    }

    // Check if customer is active
    if (!customer.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Customer account is deactivated.'
      });
    }

    // Add customer to request object
    req.customer = customer;
    next();

  } catch (error) {
    console.error('Customer auth middleware error:', error);
    return res.status(401).json({
      success: false,
      message: 'Invalid token.'
    });
  }
};

// General Auth Middleware (for both admin and customer)
const protect = async (req, res, next) => {
  try {
    let token;

    // Check if token exists in headers
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Try to find admin first, then customer
    let user = await Admin.findById(decoded.id);
    let userType = 'admin';
    
    if (!user) {
      user = await Customer.findById(decoded.id);
      userType = 'customer';
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token. User not found.'
      });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'User account is deactivated.'
      });
    }

    // Add user and userType to request object
    req.user = user;
    req.userType = userType;
    next();

  } catch (error) {
    console.error('General auth middleware error:', error);
    return res.status(401).json({
      success: false,
      message: 'Invalid token.'
    });
  }
};

module.exports = {
  protectAdmin,
  protectCustomer,
  protect
};