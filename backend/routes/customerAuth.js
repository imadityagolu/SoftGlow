const express = require('express');
const router = express.Router();
const {
  registerCustomer,
  loginCustomer,
  getCustomerProfile,
  updateCustomerProfile,
  logoutCustomer,
  googleAuthCallback,
  sendPasswordResetOTP,
  verifyPasswordResetOTP,
  resetPassword
} = require('../controllers/customerAuthController');
const { protectCustomer } = require('../middleware/auth');
const passport = require('passport');

// Public routes
router.post('/register', registerCustomer);
router.post('/login', loginCustomer);

// Forgot password routes
router.post('/forgot-password', sendPasswordResetOTP);
router.post('/verify-otp', verifyPasswordResetOTP);
router.post('/reset-password', resetPassword);

// Google OAuth routes
router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email']
}));

router.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: `${process.env.FRONTEND_URL}/customer/login?error=oauth_failed` }),
  googleAuthCallback
);

// Protected routes (require authentication)
router.get('/profile', protectCustomer, getCustomerProfile);
router.put('/profile', protectCustomer, updateCustomerProfile);
router.post('/logout', protectCustomer, logoutCustomer);

module.exports = router;