const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Customer = require('../models/Customer');
const Product = require('../models/Product');
const Admin = require('../models/Admin');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const { createNotification } = require('./notificationController');

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// Validate customer data before order
const validateCustomerData = async (req, res) => {
  try {
    const customerId = req.customer._id;
    const customer = await Customer.findById(customerId);
    
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    const missingFields = [];
    
    // Check phone number
    if (!customer.phone || customer.phone.trim() === '') {
      missingFields.push('phone');
    }
    
    // Check address
    if (!customer.address || 
        !customer.address.street || customer.address.street.trim() === '' ||
        !customer.address.city || customer.address.city.trim() === '' ||
        !customer.address.state || customer.address.state.trim() === '' ||
        !customer.address.zipCode || customer.address.zipCode.trim() === '') {
      missingFields.push('address');
    }

    if (missingFields.length > 0) {
      return res.status(400).json({
        valid: false,
        missingFields,
        message: 'Please update your profile before placing an order'
      });
    }

    res.status(200).json({
      valid: true,
      message: 'Customer data is complete'
    });
  } catch (error) {
    console.error('Error validating customer data:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create Razorpay order
const createRazorpayOrder = async (req, res) => {
  try {
    const customerId = req.customer._id;
    
    // Get customer cart
    const cart = await Cart.findOne({ customer: customerId }).populate('items.product');
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    // Calculate total amount
    const totalAmount = cart.items.reduce((total, item) => {
      return total + (item.product.price * item.quantity);
    }, 0);

    // Create Razorpay order
    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(totalAmount * 100), // Amount in paise
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
      notes: {
        customerId: customerId.toString()
      }
    });

    res.status(200).json({
      orderId: razorpayOrder.id,
      amount: totalAmount,
      currency: 'INR',
      key: process.env.RAZORPAY_KEY_ID
    });
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    res.status(500).json({ message: 'Failed to create payment order', error: error.message });
  }
};

// Verify payment and create order
const verifyPaymentAndCreateOrder = async (req, res) => {
  console.log('FUNCTION CALLED - verifyPaymentAndCreateOrder');
  console.log('=== PAYMENT VERIFICATION STARTED ===');
  console.log('Request body:', req.body);
  console.log('Customer ID:', req.customer?._id);
  
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    } = req.body;

    console.log('Payment data received:', {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    });

    // Verify signature
    const sign = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest('hex');

    if (razorpay_signature !== expectedSign) {
      return res.status(400).json({ message: 'Invalid payment signature' });
    }

    const customerId = req.customer._id;
    
    // Get customer and cart data
    const customer = await Customer.findById(customerId);
    console.log('Customer found:', !!customer);
    
    // Test cart population step by step
    const cartBasic = await Cart.findOne({ customer: customerId });
    console.log('Cart found (basic):', !!cartBasic);
    console.log('Cart items count:', cartBasic?.items?.length || 0);
    
    if (cartBasic && cartBasic.items.length > 0) {
      console.log('First cart item (before population):', {
        productId: cartBasic.items[0].product,
        quantity: cartBasic.items[0].quantity,
        price: cartBasic.items[0].price
      });
      
      // Test if product exists
      const testProduct = await Product.findById(cartBasic.items[0].product);
      console.log('Product exists:', !!testProduct);
      console.log('Product name:', testProduct?.name);
    }
    
    const cart = await Cart.findOne({ customer: customerId }).populate({
      path: 'items.product',
      select: 'name price quantity description category'
    });
    
    console.log('Cart found (populated):', !!cart);
    
    if (cart && cart.items.length > 0) {
      console.log('First cart item (after population):', {
        productId: cart.items[0].product?._id,
        productName: cart.items[0].product?.name,
        quantity: cart.items[0].quantity,
        price: cart.items[0].price
      });
    }
    
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    console.log('Raw cart data:', JSON.stringify(cart, null, 2));
    
    console.log('Customer data:', {
      id: customer?._id,
      firstName: customer?.firstName,
      lastName: customer?.lastName,
      email: customer?.email,
      phone: customer?.phone,
      address: customer?.address
    });
    
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    console.log('Cart items detailed:', cart.items.map((item, index) => ({
      index,
      productId: item.product?._id,
      productName: item.product?.name,
      productObject: item.product,
      quantity: item.quantity,
      price: item.product?.price
    })));

    // Calculate total amount
    let totalAmount = 0;
    const orderItems = cart.items.map(item => {
      const itemTotal = item.product.price * item.quantity;
      totalAmount += itemTotal;
      console.log('Processing item:', {
        productId: item.product._id,
        productName: item.product.name,
        quantity: item.quantity,
        price: item.product.price
      });
      return {
        product: item.product._id,
        name: item.product.name,
        quantity: item.quantity,
        price: item.product.price,
        total: itemTotal
      };
    });

    console.log('Order items before saving:', orderItems);
    // Create order
    const order = new Order({
      customer: customerId,
      items: orderItems,
      totalAmount,
      status: 'confirmed',
      paymentStatus: 'completed',
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      razorpaySignature: razorpay_signature,
      shippingAddress: {
        street: customer.address.street,
        city: customer.address.city,
        state: customer.address.state,
        zipCode: customer.address.zipCode,
        country: customer.address.country || 'India'
      },
      customerPhone: customer.phone,
      customerEmail: customer.email,
      customerName: `${customer.firstName} ${customer.lastName}`,
      statusHistory: [{
        status: 'confirmed',
        timestamp: new Date(),
        notes: 'Order confirmed and payment completed'
      }]
    });

    console.log('Creating order with data:', {
      customerId,
      customerName: `${customer.firstName} ${customer.lastName}`,
      totalAmount,
      itemsCount: orderItems.length
    });

    // Check if order with this payment ID already exists
    const existingOrder = await Order.findOne({ razorpayPaymentId: razorpay_payment_id });
    if (existingOrder) {
      console.log('Order already exists for this payment ID:', razorpay_payment_id);
      return res.status(200).json({
        message: 'Order already processed',
        order: {
          orderNumber: existingOrder.orderNumber,
          totalAmount: existingOrder.totalAmount,
          status: existingOrder.status,
          orderDate: existingOrder.orderDate,
          items: existingOrder.items
        }
      });
    }

    await order.save();

    // Create notifications for customer and admin
    try {
      // Customer notification
      await createNotification({
        message: `Your order ${order.orderNumber} has been placed successfully`,
        type: 'order',
        userId: customerId,
        userType: 'Customer',
        orderId: order._id
      });

      // Admin notification - get first admin
      const admin = await Admin.findOne();
      if (admin) {
        await createNotification({
          message: `New order ${order.orderNumber} has been placed by ${customer.firstName} ${customer.lastName}`,
          type: 'order',
          userId: admin._id,
          userType: 'Admin',
          orderId: order._id
        });
      }
    } catch (notificationError) {
      console.error('Error creating notifications:', notificationError);
      // Don't fail the order if notification creation fails
    }

    // Update product quantities
    for (const item of cart.items) {
      await Product.findByIdAndUpdate(
        item.product._id,
        { $inc: { quantity: -item.quantity } }
      );
    }

    // Clear cart
    await cart.clearCart();

    // Populate order for response
    await order.populate('customer', 'firstName lastName email');

    res.status(201).json({
      message: 'Order placed successfully',
      order: {
        orderNumber: order.orderNumber,
        totalAmount: order.totalAmount,
        status: order.status,
        orderDate: order.orderDate,
        items: order.items
      }
    });
  } catch (error) {
    console.error('Error verifying payment and creating order:', error);
    
    // Handle duplicate key error (race condition)
    if (error.code === 11000) {
      console.log('Duplicate key error detected, checking for existing order...');
      try {
        const existingOrder = await Order.findOne({ razorpayPaymentId: req.body.razorpay_payment_id });
        if (existingOrder) {
          console.log('Found existing order for payment ID:', req.body.razorpay_payment_id);
          return res.status(200).json({
            message: 'Order already processed',
            order: {
              orderNumber: existingOrder.orderNumber,
              totalAmount: existingOrder.totalAmount,
              status: existingOrder.status,
              orderDate: existingOrder.orderDate,
              items: existingOrder.items
            }
          });
        }
      } catch (findError) {
        console.error('Error finding existing order:', findError);
      }
    }
    
    res.status(500).json({ message: 'Failed to process order', error: error.message });
  }
};

// Get customer orders
const getCustomerOrders = async (req, res) => {
  try {
    const customerId = req.customer._id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const orders = await Order.find({ customer: customerId })
      .sort({ orderDate: -1 })
      .skip(skip)
      .limit(limit)
      .populate('customer', 'name email')
      .populate('items.product', 'name images price');

    const totalOrders = await Order.countDocuments({ customer: customerId });

    res.status(200).json({
      orders,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalOrders / limit),
        totalOrders,
        hasNext: page < Math.ceil(totalOrders / limit),
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Error fetching customer orders:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get single order details
const getOrderDetails = async (req, res) => {
  try {
    const { orderId } = req.params;
    const customerId = req.customer._id;

    const order = await Order.findOne({ 
      _id: orderId, 
      customer: customerId 
    }).populate('customer', 'name email');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json({ order });
  } catch (error) {
    console.error('Error fetching order details:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Admin: Get all orders
const getAllOrders = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const status = req.query.status;
    const search = req.query.search;

    let query = {};
    
    // Filter by status
    if (status && status !== 'all') {
      query.status = status;
    }

    // Search by order ID or customer name
    if (search) {
      query.$or = [
        { orderNumber: { $regex: search, $options: 'i' } },
        { customerName: { $regex: search, $options: 'i' } },
        { customerEmail: { $regex: search, $options: 'i' } }
      ];
    }

    const orders = await Order.find(query)
      .sort({ orderDate: -1 })
      .skip(skip)
      .limit(limit)
      .populate('customer', 'firstName lastName email phone address');

    const totalOrders = await Order.countDocuments(query);

    res.status(200).json({
      orders,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalOrders / limit),
        totalOrders,
        hasNext: page < Math.ceil(totalOrders / limit),
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Error fetching all orders:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Admin: Update order status
const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status, notes } = req.body;

    const validStatuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'completed', 'cancelled', 'refunded'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const updateData = { status };
    if (notes) {
      updateData.notes = notes;
    }
    if (status === 'delivered' || status === 'completed') {
      updateData.deliveryDate = new Date();
    }
    if (status === 'refunded') {
      updateData.refundDate = new Date();
    }

    // First get the order to update statusHistory
    const order = await Order.findById(orderId).populate('customer', 'name email phone');
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Update the order fields
    Object.assign(order, updateData);
    
    // Add to statusHistory
    if (!order.statusHistory) {
      order.statusHistory = [];
    }
    
    order.statusHistory.push({
      status: status,
      timestamp: new Date(),
      notes: notes || `Order status updated to ${status}`
    });
    
    await order.save();

    // Create notification for customer about order status update
    try {
      const statusMessages = {
        pending: 'Your order is pending confirmation',
        confirmed: 'Your order has been confirmed and is being prepared',
        processing: 'Your order is currently being processed',
        shipped: 'Your order has been shipped and is on its way',
        delivered: 'Your order has been delivered successfully',
        completed: 'Your order has been completed successfully',
        cancelled: 'Your order has been cancelled',
        refunded: 'Your refund has been initiated and will be processed within 5-7 business days'
      };

      await createNotification({
        message: `Order ${order.orderNumber} status updated: ${statusMessages[status]}`,
        type: 'order',
        userId: order.customer._id,
        userType: 'Customer',
        orderId: order._id
      });

      // If status is refunded, also create notification for admin
      if (status === 'refunded') {
        console.log('Creating refund notifications for admins...');
        // Get admin users to notify
        const admins = await Admin.find({}, '_id');
        console.log('Found admins:', admins.length);
        
        if (admins.length === 0) {
          console.log('No admin users found in database');
        }
        
        for (const admin of admins) {
          console.log('Creating notification for admin:', admin._id);
          try {
            await createNotification({
              message: `Refund processed for Order ${order.orderNumber}`,
              type: 'order',
              userId: admin._id,
              userType: 'Admin',
              orderId: order._id
            });
            console.log('Admin notification created successfully for:', admin._id);
          } catch (adminNotificationError) {
            console.error('Error creating admin notification for:', admin._id, adminNotificationError);
          }
        }
      }
    } catch (notificationError) {
      console.error('Error creating notification:', notificationError);
      // Don't fail the order update if notification creation fails
    }

    res.status(200).json({
      message: 'Order status updated successfully',
      order
    });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Customer: Cancel order
const cancelOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const customerId = req.customer._id;

    // Find the order
    const order = await Order.findOne({ _id: orderId, customer: customerId });
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if order can be cancelled
    if (order.status === 'completed' || order.status === 'cancelled') {
      return res.status(400).json({ 
        message: `Order cannot be cancelled as it is already ${order.status}` 
      });
    }

    // Update order status to cancelled
    order.status = 'cancelled';
    order.cancelledAt = new Date();
    await order.save();

    // Create notification for customer
    await createNotification({
      userId: customerId,
      userType: 'Customer',
      type: 'order',
      message: `Your order ${order.orderNumber} has been cancelled successfully. Refund will be transfered.`,
      orderId: order._id
    });

    // Create notification for all admins
    const admins = await Admin.find({});
    for (const admin of admins) {
      await createNotification({
        userId: admin._id,
        userType: 'Admin',
        type: 'order',
        message: `Order ${order.orderNumber} has been cancelled by the customer.`,
        orderId: order._id
      });
    }

    res.status(200).json({
      success: true,
      message: 'Order cancelled successfully',
      order
    });
  } catch (error) {
    console.error('Error cancelling order:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Customer: Return order
const returnOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const customerId = req.customer._id;

    // Find the order
    const order = await Order.findOne({ _id: orderId, customer: customerId });
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if order can be returned (must be completed)
    if (order.status !== 'completed') {
      return res.status(400).json({ 
        message: 'Only completed orders can be returned' 
      });
    }

    // Check if order is within 24 hours of completion
    let completedTime;
    
    // First try to get completion time from statusHistory
    const completedStatus = order.statusHistory?.find(status => 
      status.status?.toLowerCase() === 'completed'
    );
    
    if (completedStatus) {
      completedTime = new Date(completedStatus.timestamp);
    } else if (order.deliveryDate) {
      // Fallback to deliveryDate for orders without statusHistory
      completedTime = new Date(order.deliveryDate);
    } else {
      return res.status(400).json({ 
        message: 'Order completion time not found' 
      });
    }
    const now = new Date();
    const timeDiff = now - completedTime;
    const hoursDiff = timeDiff / (1000 * 60 * 60); // Convert to hours

    if (hoursDiff > 24) {
      return res.status(400).json({ 
        message: 'Return period has expired. Orders can only be returned within 24 hours of completion.' 
      });
    }

    // Update order status to return
    order.status = 'return';
    
    // Initialize statusHistory if it doesn't exist
    if (!order.statusHistory) {
      order.statusHistory = [];
    }
    
    order.statusHistory.push({
      status: 'return',
      timestamp: new Date(),
      notes: 'Return requested by customer'
    });
    order.returnedAt = new Date();
    await order.save();

    // Create notification for customer
    await createNotification({
      userId: customerId,
      userType: 'Customer',
      type: 'order',
      message: `Your return request for order ${order.orderNumber} has been submitted successfully. We will process it shortly.`,
      orderId: order._id
    });

    // Create notification for all admins
    const admins = await Admin.find({});
    for (const admin of admins) {
      await createNotification({
        userId: admin._id,
        userType: 'Admin',
        type: 'order',
        message: `Customer has requested a return for order ${order.orderNumber}. Please review and process.`,
        orderId: order._id
      });
    }

    res.status(200).json({
      success: true,
      message: 'Return request submitted successfully',
      order
    });
  } catch (error) {
    console.error('Error returning order:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Customer: Generate and download invoice
const generateInvoice = async (req, res) => {
  try {
    const { orderId } = req.params;
    const customerId = req.customer._id;

    // Find the order
    const order = await Order.findOne({ _id: orderId, customer: customerId })
      .populate('customer')
      .populate('items.product');
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if order is completed
    if (order.status !== 'completed') {
      return res.status(400).json({ 
        message: 'Invoice can only be generated for completed orders' 
      });
    }

    // Generate PDF invoice (using a simple HTML to PDF approach)
    const PDFDocument = require('pdfkit');
    const doc = new PDFDocument();
    
    // Set response headers for PDF download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=invoice-${order.orderNumber}.pdf`);
    
    // Pipe the PDF to response
    doc.pipe(res);

    // Add invoice content
    doc.fontSize(20).text('SOFTGLOW INVOICE', 50, 50);
    doc.fontSize(12);
    
    // Order details
    doc.text(`Invoice Number: ${order.orderNumber}`, 50, 100);
    doc.text(`Order Date: ${new Date(order.orderDate).toLocaleDateString()}`, 50, 120);
    doc.text(`Order Status: ${order.status.toUpperCase()}`, 50, 140);
    
    // Customer details
    doc.text('Bill To:', 50, 180);
    doc.text(`${order.customer.firstName} ${order.customer.lastName}`, 50, 200);
    doc.text(`${order.customer.email}`, 50, 220);
    if (order.customer.phone) {
      doc.text(`Phone: ${order.customer.phone}`, 50, 240);
    }
    
    // Address
    if (order.customer.address) {
      const addr = order.customer.address;
      doc.text('Shipping Address:', 50, 280);
      doc.text(`${addr.street}`, 50, 300);
      doc.text(`${addr.city}, ${addr.state} ${addr.zipCode}`, 50, 320);
      if (addr.country) {
        doc.text(`${addr.country}`, 50, 340);
      }
    }
    
    // Items table header
    doc.text('Items:', 50, 380);
    doc.text('Product', 50, 400);
    doc.text('Quantity', 250, 400);
    doc.text('Price', 350, 400);
    doc.text('Total', 450, 400);
    
    // Draw line
    doc.moveTo(50, 415).lineTo(550, 415).stroke();
    
    // Items
    let yPosition = 430;
    order.items.forEach((item) => {
      doc.text(item.product.name, 50, yPosition);
      doc.text(item.quantity.toString(), 250, yPosition);
      doc.text(`₹${item.product.price}`, 350, yPosition);
      doc.text(`₹${(item.product.price * item.quantity).toFixed(2)}`, 450, yPosition);
      yPosition += 20;
    });
    
    // Total
    doc.moveTo(50, yPosition + 10).lineTo(550, yPosition + 10).stroke();
    doc.fontSize(14).text(`Total Amount: ₹${order.totalAmount}`, 350, yPosition + 30);
    
    // Footer
    doc.fontSize(10).text('Thank you for your business!', 50, yPosition + 80);
    doc.text('SoftGlow - Premium Candles', 50, yPosition + 100);
    
    // Finalize the PDF
    doc.end();

  } catch (error) {
    console.error('Error generating invoice:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  validateCustomerData,
  createRazorpayOrder,
  verifyPaymentAndCreateOrder,
  getCustomerOrders,
  getOrderDetails,
  getAllOrders,
  updateOrderStatus,
  cancelOrder,
  returnOrder,
  generateInvoice
};