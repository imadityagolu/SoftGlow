const express = require('express');
const router = express.Router();
const {
  validateCustomerData,
  createRazorpayOrder,
  verifyPaymentAndCreateOrder,
  getCustomerOrders,
  getOrderDetails,
  getAllOrders,
  updateOrderStatus,
  cancelOrder,
  returnOrder,
  generateInvoice
} = require('../controllers/orderController');
const { protectCustomer, protectAdmin } = require('../middleware/auth');

// Customer routes - require authentication
router.use('/customer', protectCustomer);

// Validate customer data before checkout
router.get('/customer/validate', validateCustomerData);

// Create Razorpay order
router.post('/customer/create-payment', createRazorpayOrder);

// Verify payment and create order (with logging)
router.post('/customer/verify-payment', (req, res, next) => {
  console.log('=== VERIFY PAYMENT ROUTE HIT ===');
  console.log('Request body:', req.body);
  console.log('Headers:', req.headers.authorization);
  next();
}, verifyPaymentAndCreateOrder);

// Get customer orders
router.get('/customer/orders', getCustomerOrders);

// Get single order details
router.get('/customer/orders/:orderId', getOrderDetails);

// Cancel order
router.put('/customer/orders/:orderId/cancel', cancelOrder);

// Return order
router.put('/customer/orders/:orderId/return', returnOrder);

// Generate and download invoice
router.get('/customer/orders/:orderId/invoice', generateInvoice);

// Admin routes
router.use('/admin', protectAdmin);

// Get all orders
router.get('/admin/orders', getAllOrders);

// Update order status
router.put('/admin/orders/:orderId/status', updateOrderStatus);

module.exports = router;