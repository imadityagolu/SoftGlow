const Product = require('../models/Product');
const Order = require('../models/Order');
const Customer = require('../models/Customer');

// @desc    Get admin dashboard statistics
// @route   GET /api/admin/stats
// @access  Private (Admin only)
const getAdminStats = async (req, res) => {
  try {
    // Get total counts
    const totalProducts = await Product.countDocuments({ isActive: true });
    const totalCustomers = await Customer.countDocuments();
    const totalOrders = await Order.countDocuments();
    
    // Calculate total revenue from all orders (excluding cancelled, refunded, and return orders)
    const revenueResult = await Order.aggregate([
      {
        $match: {
          status: { $nin: ['cancelled', 'refunded', 'return'] }
        }
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$totalAmount' }
        }
      }
    ]);
    
    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0;
    
    // Get stats for the last 30 days for percentage calculations
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const newProducts = await Product.countDocuments({
      isActive: true,
      createdAt: { $gte: thirtyDaysAgo }
    });
    
    const newCustomers = await Customer.countDocuments({
      createdAt: { $gte: thirtyDaysAgo }
    });
    
    const newOrders = await Order.countDocuments({
      orderDate: { $gte: thirtyDaysAgo }
    });
    
    // Calculate revenue for last 30 days (excluding cancelled, refunded, and return orders)
    const recentRevenueResult = await Order.aggregate([
      {
        $match: {
          orderDate: { $gte: thirtyDaysAgo },
          status: { $nin: ['cancelled', 'refunded', 'return'] }
        }
      },
      {
        $group: {
          _id: null,
          recentRevenue: { $sum: '$totalAmount' }
        }
      }
    ]);
    
    const recentRevenue = recentRevenueResult.length > 0 ? recentRevenueResult[0].recentRevenue : 0;
    
    // Calculate percentage changes (simplified calculation)
    const productChange = totalProducts > 0 ? Math.round((newProducts / totalProducts) * 100) : 0;
    const customerChange = totalCustomers > 0 ? Math.round((newCustomers / totalCustomers) * 100) : 0;
    const orderChange = totalOrders > 0 ? Math.round((newOrders / totalOrders) * 100) : 0;
    const revenueChange = totalRevenue > 0 ? Math.round((recentRevenue / totalRevenue) * 100) : 0;
    
    res.status(200).json({
      success: true,
      data: {
        totalProducts,
        totalOrders,
        totalCustomers,
        totalRevenue,
        changes: {
          productChange: `+${productChange}%`,
          orderChange: `+${orderChange}%`,
          customerChange: `+${customerChange}%`,
          revenueChange: `+${revenueChange}%`
        },
        recentStats: {
          newProducts,
          newOrders,
          newCustomers,
          recentRevenue
        }
      }
    });
  } catch (error) {
    console.error('Get admin stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching admin statistics'
    });
  }
};

module.exports = {
  getAdminStats
};