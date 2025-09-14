const express = require('express');
const router = express.Router();
const {
  submitContactForm,
  getAllContacts,
  getContactById,
  updateContactStatus,
  deleteContact
} = require('../controllers/contactController');
const { protectAdmin } = require('../middleware/auth');

// Public route - Submit contact form
router.post('/', submitContactForm);

// Admin routes - Manage contact submissions
router.get('/', protectAdmin, getAllContacts);
router.get('/:id', protectAdmin, getContactById);
router.put('/:id', protectAdmin, updateContactStatus);
router.delete('/:id', protectAdmin, deleteContact);

module.exports = router;