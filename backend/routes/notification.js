const express = require('express');
const router = express.Router();
const {
  getNotifications,
  markAsRead,
  markAllAsRead,
  getUnreadCount
} = require('../controllers/notificationController');
const { protect } = require('../middleware/auth');

// Get notifications for a user
router.get('/', protect, getNotifications);

// Get unread count
router.get('/unread-count', protect, getUnreadCount);

// Mark notification as read
router.patch('/:notificationId/read', protect, markAsRead);

// Mark all notifications as read
router.patch('/mark-all-read', protect, markAllAsRead);

module.exports = router;