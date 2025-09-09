const express = require('express');
const router = express.Router();
const {
  registerAdmin,
  loginAdmin,
  getAdminProfile,
  logoutAdmin
} = require('../controllers/adminAuthController');
const { protectAdmin } = require('../middleware/auth');

// Public routes
router.post('/register', registerAdmin);
router.post('/login', loginAdmin);

// Protected routes (require authentication)
router.get('/profile', protectAdmin, getAdminProfile);
router.post('/logout', protectAdmin, logoutAdmin);

module.exports = router;