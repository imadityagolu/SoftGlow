const express = require('express');
const router = express.Router();
const {
  getAllCustomers,
  getCustomerById,
  updateCustomerStatus,
  getCustomerStats
} = require('../controllers/customerController');
const { protectAdmin } = require('../middleware/auth');

// All routes are protected and require admin authentication
router.use(protectAdmin);

// Customer management routes
router.get('/', getAllCustomers);
router.get('/stats', getCustomerStats);
router.get('/:id', getCustomerById);
router.put('/:id/status', updateCustomerStatus);

module.exports = router;