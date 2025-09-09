const Customer = require('../models/Customer');
const mongoose = require('mongoose');

// @desc    Get all customers (Admin only)
// @route   GET /api/admin/customers
// @access  Private (Admin only)
const getAllCustomers = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
    
    // Build query
    let query = {};
    
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;
    
    // Execute query with pagination
    const customers = await Customer.find(query)
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select('-password')
      .exec();
    
    // Get total count for pagination
    const total = await Customer.countDocuments(query);
    
    res.status(200).json({
      success: true,
      data: customers,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    console.error('Get customers error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching customers'
    });
  }
};

// @desc    Get single customer by ID (Admin only)
// @route   GET /api/admin/customers/:id
// @access  Private (Admin only)
const getCustomerById = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid customer ID'
      });
    }
    
    const customer = await Customer.findById(id)
      .select('-password')
      .populate('orders')
      .populate('favorites')
      .exec();
    
    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: customer
    });
  } catch (error) {
    console.error('Get customer error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching customer'
    });
  }
};

// @desc    Update customer status (Admin only)
// @route   PUT /api/admin/customers/:id/status
// @access  Private (Admin only)
const updateCustomerStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid customer ID'
      });
    }
    
    const customer = await Customer.findById(id);
    
    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found'
      });
    }
    
    customer.isActive = isActive;
    await customer.save();
    
    res.status(200).json({
      success: true,
      message: `Customer ${isActive ? 'activated' : 'deactivated'} successfully`,
      data: customer
    });
  } catch (error) {
    console.error('Update customer status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating customer status'
    });
  }
};

// @desc    Get customer statistics (Admin only)
// @route   GET /api/admin/customers/stats
// @access  Private (Admin only)
const getCustomerStats = async (req, res) => {
  try {
    const totalCustomers = await Customer.countDocuments();
    const activeCustomers = await Customer.countDocuments({ isActive: true });
    const inactiveCustomers = await Customer.countDocuments({ isActive: false });
    
    // Get customers registered in the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const newCustomers = await Customer.countDocuments({
      createdAt: { $gte: thirtyDaysAgo }
    });
    
    res.status(200).json({
      success: true,
      data: {
        totalCustomers,
        activeCustomers,
        inactiveCustomers,
        newCustomers
      }
    });
  } catch (error) {
    console.error('Get customer stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching customer statistics'
    });
  }
};

module.exports = {
  getAllCustomers,
  getCustomerById,
  updateCustomerStatus,
  getCustomerStats
};