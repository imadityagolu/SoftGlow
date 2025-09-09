const express = require('express');
const router = express.Router();
const {
  registerCustomer,
  loginCustomer,
  getCustomerProfile,
  updateCustomerProfile,
  logoutCustomer
} = require('../controllers/customerAuthController');
const { protectCustomer } = require('../middleware/auth');

// Public routes
router.post('/register', registerCustomer);
router.post('/login', loginCustomer);

// Protected routes (require authentication)
router.get('/profile', protectCustomer, getCustomerProfile);
router.put('/profile', protectCustomer, updateCustomerProfile);
router.post('/logout', protectCustomer, logoutCustomer);

module.exports = router;