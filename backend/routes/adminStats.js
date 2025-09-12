const express = require('express');
const router = express.Router();
const { getAdminStats } = require('../controllers/adminStatsController');
const { protectAdmin } = require('../middleware/auth');

// All routes are protected and require admin authentication
router.use(protectAdmin);

// Admin statistics route
router.get('/', getAdminStats);

module.exports = router;