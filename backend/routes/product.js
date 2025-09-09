const express = require('express');
const router = express.Router();
const {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getProductsByCategory
} = require('../controllers/productController');
const { protectAdmin } = require('../middleware/auth');

// Public routes (for customers to view products)
router.get('/', getAllProducts);
router.get('/category/:category', getProductsByCategory);
router.get('/:id', getProductById);

// Protected routes (admin only)
router.post('/', protectAdmin, createProduct);
router.put('/:id', protectAdmin, updateProduct);
router.delete('/:id', protectAdmin, deleteProduct);

module.exports = router;