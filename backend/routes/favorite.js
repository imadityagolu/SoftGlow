const express = require('express');
const router = express.Router();
const {
  addToFavorites,
  removeFromFavorites,
  getUserFavorites,
  checkFavoriteStatus,
  getFavoriteCount
} = require('../controllers/favoriteController');
const { protect } = require('../middleware/auth');

// Add product to favorites
router.post('/', protect, addToFavorites);

// Remove product from favorites
router.delete('/:productId', protect, removeFromFavorites);

// Get user's favorites
router.get('/', protect, getUserFavorites);

// Check if product is in user's favorites
router.get('/check/:productId', protect, checkFavoriteStatus);

// Get favorite count for a product (public)
router.get('/count/:productId', getFavoriteCount);

module.exports = router;