const express = require('express');
const router = express.Router();
const { addToCart, getCart, updateCartItem, removeFromCart, clearCart } = require('../controllers/cartController');
const { protectCustomer } = require('../middleware/auth');

// All cart routes require customer authentication
router.use(protectCustomer);

// Add item to cart
router.post('/add', addToCart);

// Get cart items
router.get('/', getCart);

// Update cart item quantity
router.put('/update/:itemId', updateCartItem);

// Remove item from cart
router.delete('/remove/:itemId', removeFromCart);

// Clear entire cart
router.delete('/clear', clearCart);

module.exports = router;