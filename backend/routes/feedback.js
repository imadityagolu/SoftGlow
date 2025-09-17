const express = require('express');
const router = express.Router();
const {
  createFeedback,
  getFeedbackByOrder,
  getFeedbackByProduct,
  getAllFeedback,
  updateFeedbackStatus
} = require('../controllers/feedbackController');
const { protectCustomer, protectAdmin } = require('../middleware/auth');

// Customer routes - require authentication
router.use('/customer', protectCustomer);

// Create feedback
router.post('/customer/create', createFeedback);

// Get feedback by order
router.get('/customer/order/:orderId', getFeedbackByOrder);

// Public routes
// Get feedback by product (public - for product pages)
router.get('/product/:productId', getFeedbackByProduct);

// Admin routes
router.use('/admin', protectAdmin);

// Get all feedback
router.get('/admin/all', getAllFeedback);

// Update feedback status
router.put('/admin/:feedbackId/status', updateFeedbackStatus);

module.exports = router;