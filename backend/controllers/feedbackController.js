const mongoose = require('mongoose');
const Feedback = require('../models/Feedback');
const Order = require('../models/Order');
const Product = require('../models/Product');
const { createNotification } = require('./notificationController');
const Admin = require('../models/Admin');

// @desc    Create feedback for a product in an order
// @route   POST /api/feedback/customer/create
// @access  Private (Customer only)
const createFeedback = async (req, res) => {
  try {
    const { orderId, productId, rating, feedbackText, image } = req.body;
    const customerId = req.customer._id;

    // Validate required fields
    if (!orderId || !productId || !rating || !feedbackText) {
      return res.status(400).json({ 
        message: 'Order ID, Product ID, rating, and feedback text are required' 
      });
    }

    // Validate rating
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ 
        message: 'Rating must be between 1 and 5' 
      });
    }

    // Check if order exists and belongs to customer
    const order = await Order.findOne({ 
      _id: orderId, 
      customer: customerId 
    }).populate('items.product');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if order is completed
    if (order.status !== 'completed') {
      return res.status(400).json({ 
        message: 'Feedback can only be given for completed orders' 
      });
    }

    // Check if product exists in the order
    const orderItem = order.items.find(item => 
      item.product._id.toString() === productId
    );

    if (!orderItem) {
      return res.status(400).json({ 
        message: 'Product not found in this order' 
      });
    }

    // Check if feedback already exists for this product in this order
    const existingFeedback = await Feedback.findOne({
      customer: customerId,
      order: orderId,
      product: productId
    });

    if (existingFeedback) {
      return res.status(400).json({ 
        message: 'Feedback already exists for this product in this order' 
      });
    }

    // Create feedback
    const feedback = new Feedback({
      customer: customerId,
      order: orderId,
      product: productId,
      rating,
      feedbackText: feedbackText.trim(),
      image: image || null
    });

    await feedback.save();

    // Populate the feedback for response
    await feedback.populate([
      { path: 'customer', select: 'firstName lastName' },
      { path: 'product', select: 'name images' },
      { path: 'order', select: 'orderNumber' }
    ]);

    // Create notification for admins
    const admins = await Admin.find({});
    for (const admin of admins) {
      await createNotification({
        userId: admin._id,
        userType: 'Admin',
        type: 'general',
        message: `New feedback received for ${orderItem.name} from ${req.customer.firstName} ${req.customer.lastName}`,
        orderId: orderId
      });
    }

    res.status(201).json({
      success: true,
      message: 'Feedback submitted successfully',
      feedback
    });
  } catch (error) {
    console.error('Error creating feedback:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get feedback for a specific order
// @route   GET /api/feedback/customer/order/:orderId
// @access  Private (Customer only)
const getFeedbackByOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const customerId = req.customer._id;

    // Check if order belongs to customer
    const order = await Order.findOne({ 
      _id: orderId, 
      customer: customerId 
    });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const feedback = await Feedback.find({
      customer: customerId,
      order: orderId
    }).populate([
      { path: 'product', select: 'name images price' },
      { path: 'order', select: 'orderNumber' }
    ]).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      feedback
    });
  } catch (error) {
    console.error('Error fetching feedback by order:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get feedback for a specific product
// @route   GET /api/feedback/product/:productId
// @access  Public
const getFeedbackByProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const feedback = await Feedback.find({
      product: productId,
      isVisible: true
    })
    .populate('customer', 'firstName lastName')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

    const totalFeedback = await Feedback.countDocuments({
      product: productId,
      isVisible: true
    });

    // Calculate average rating
    const ratingStats = await Feedback.aggregate([
      { 
        $match: { 
          product: new mongoose.Types.ObjectId(productId),
          isVisible: true 
        } 
      },
      {
        $group: {
          _id: null,
          averageRating: { $avg: '$rating' },
          totalRatings: { $sum: 1 },
          ratingDistribution: {
            $push: '$rating'
          }
        }
      }
    ]);

    const stats = ratingStats.length > 0 ? {
      averageRating: Math.round(ratingStats[0].averageRating * 10) / 10,
      totalRatings: ratingStats[0].totalRatings,
      ratingDistribution: ratingStats[0].ratingDistribution.reduce((acc, rating) => {
        acc[rating] = (acc[rating] || 0) + 1;
        return acc;
      }, {})
    } : {
      averageRating: 0,
      totalRatings: 0,
      ratingDistribution: {}
    };

    res.status(200).json({
      success: true,
      feedback,
      stats,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalFeedback / limit),
        totalFeedback,
        hasNext: page < Math.ceil(totalFeedback / limit),
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Error fetching feedback by product:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get all feedback (Admin only)
// @route   GET /api/feedback/admin/all
// @access  Private (Admin only)
const getAllFeedback = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const search = req.query.search || '';
    const status = req.query.status || 'all'; // all, visible, hidden, verified, unverified

    let query = {};

    // Apply status filter
    if (status === 'visible') {
      query.isVisible = true;
    } else if (status === 'hidden') {
      query.isVisible = false;
    } else if (status === 'verified') {
      query.isVerified = true;
    } else if (status === 'unverified') {
      query.isVerified = false;
    }

    // Apply search filter
    if (search.trim()) {
      query.$or = [
        { feedbackText: { $regex: search, $options: 'i' } }
      ];
    }

    const feedback = await Feedback.find(query)
      .populate([
        { path: 'customer', select: 'firstName lastName email' },
        { path: 'product', select: 'name images' },
        { path: 'order', select: 'orderNumber' }
      ])
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalFeedback = await Feedback.countDocuments(query);

    res.status(200).json({
      success: true,
      feedback,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalFeedback / limit),
        totalFeedback,
        hasNext: page < Math.ceil(totalFeedback / limit),
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Error fetching all feedback:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update feedback visibility/verification (Admin only)
// @route   PUT /api/feedback/admin/:feedbackId/status
// @access  Private (Admin only)
const updateFeedbackStatus = async (req, res) => {
  try {
    const { feedbackId } = req.params;
    const { isVisible, isVerified, adminResponse } = req.body;

    const feedback = await Feedback.findById(feedbackId);
    if (!feedback) {
      return res.status(404).json({ message: 'Feedback not found' });
    }

    // Update fields if provided
    if (typeof isVisible === 'boolean') {
      feedback.isVisible = isVisible;
    }
    if (typeof isVerified === 'boolean') {
      feedback.isVerified = isVerified;
    }
    if (adminResponse !== undefined) {
      feedback.adminResponse = adminResponse;
      feedback.adminResponseDate = new Date();
    }

    await feedback.save();

    // Populate for response
    await feedback.populate([
      { path: 'customer', select: 'firstName lastName' },
      { path: 'product', select: 'name' },
      { path: 'order', select: 'orderNumber' }
    ]);

    res.status(200).json({
      success: true,
      message: 'Feedback status updated successfully',
      feedback
    });
  } catch (error) {
    console.error('Error updating feedback status:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  createFeedback,
  getFeedbackByOrder,
  getFeedbackByProduct,
  getAllFeedback,
  updateFeedbackStatus
};