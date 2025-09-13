const express = require('express');
const router = express.Router();
const {
  submitContactForm,
  getAllContacts,
  getContactById,
  updateContactStatus,
  deleteContact,
  getContactStats
} = require('../controllers/contactController');
const { protectAdmin } = require('../middleware/auth');

// Public route for contact form submission
router.post('/', submitContactForm);

// Admin-only routes for contact management
router.use('/admin', protectAdmin);
router.get('/admin', getAllContacts);
router.get('/admin/stats', getContactStats);
router.get('/admin/:id', getContactById);
router.put('/admin/:id/status', updateContactStatus);
router.delete('/admin/:id', deleteContact);

module.exports = router;