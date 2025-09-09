const Product = require('../models/Product');
const mongoose = require('mongoose');

// @desc    Create a new product
// @route   POST /api/products
// @access  Private (Admin only)
const createProduct = async (req, res) => {
  try {
    const { name, description, price, quantity, images, category } = req.body;

    // Validate required fields
    if (!name || !description || !price || !quantity || !images) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: name, description, price, quantity, and images'
      });
    }

    // Validate images array
    if (!Array.isArray(images) || images.length < 1) {
      return res.status(400).json({
        success: false,
        message: 'At least 1 product image is required'
      });
    }

    // Create product with admin ID
    const product = await Product.create({
      name,
      description,
      price: parseFloat(price),
      quantity: parseInt(quantity),
      images,
      category: category || 'candles',
      createdBy: req.admin.id
    });

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: product
    });
  } catch (error) {
    console.error('Create product error:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation Error',
        errors: messages
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error while creating product'
    });
  }
};

// @desc    Get all products
// @route   GET /api/products
// @access  Public
const getAllProducts = async (req, res) => {
  try {
    const { page = 1, limit = 10, category, search, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
    
    // Build query
    let query = { isActive: true };
    
    if (category) {
      query.category = category;
    }
    
    if (search) {
      query.$text = { $search: search };
    }
    
    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;
    
    // Execute query with pagination
    const products = await Product.find(query)
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('createdBy', 'firstName lastName')
      .exec();
    
    // Get total count for pagination
    const total = await Product.countDocuments(query);
    
    res.status(200).json({
      success: true,
      data: products,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching products'
    });
  }
};

// @desc    Get single product by ID
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid product ID'
      });
    }
    
    const product = await Product.findById(id)
      .populate('createdBy', 'firstName lastName')
      .exec();
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching product'
    });
  }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private (Admin only)
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, quantity, images, category, isActive } = req.body;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid product ID'
      });
    }
    
    const product = await Product.findById(id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    // Update fields if provided
    if (name) product.name = name;
    if (description) product.description = description;
    if (price !== undefined) product.price = parseFloat(price);
    if (quantity !== undefined) product.quantity = parseInt(quantity);
    if (images && Array.isArray(images)) {
      if (images.length < 1) {
        return res.status(400).json({
          success: false,
          message: 'At least 1 product image is required'
        });
      }
      product.images = images;
    }
    if (category) product.category = category;
    if (isActive !== undefined) product.isActive = isActive;
    
    await product.save();
    
    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      data: product
    });
  } catch (error) {
    console.error('Update product error:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation Error',
        errors: messages
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error while updating product'
    });
  }
};

// @desc    Delete product (soft delete)
// @route   DELETE /api/products/:id
// @access  Private (Admin only)
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid product ID'
      });
    }
    
    const product = await Product.findById(id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    // Soft delete by setting isActive to false
    product.isActive = false;
    await product.save();
    
    res.status(200).json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting product'
    });
  }
};

// @desc    Get products by category
// @route   GET /api/products/category/:category
// @access  Public
const getProductsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
    
    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;
    
    const products = await Product.find({ category, isActive: true })
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('createdBy', 'firstName lastName')
      .exec();
    
    const total = await Product.countDocuments({ category, isActive: true });
    
    res.status(200).json({
      success: true,
      data: products,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    console.error('Get products by category error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching products by category'
    });
  }
};

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getProductsByCategory
};