const Cart = require('../models/Cart');
const Product = require('../models/Product');

// Add item to cart
const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;
    const customerId = req.customer._id;

    // Validate product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check if product has enough stock
    if (product.quantity < quantity) {
      return res.status(400).json({ message: 'Insufficient stock' });
    }

    // Find or create cart for customer
    let cart = await Cart.findOne({ customer: customerId });
    if (!cart) {
      cart = new Cart({ customer: customerId, items: [] });
    }

    // Add item to cart
    await cart.addItem(productId, quantity, product.price);
    
    // Populate cart with product details
    await cart.populate('items.product');

    res.status(200).json({
      message: 'Item added to cart successfully',
      cart
    });
  } catch (error) {
    console.error('Error adding to cart:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get cart items
const getCart = async (req, res) => {
  try {
    const customerId = req.customer._id;

    const cart = await Cart.findOne({ customer: customerId })
      .populate('items.product');

    if (!cart) {
      return res.status(200).json({
        cart: {
          items: []
        }
      });
    }

    res.status(200).json({ cart });
  } catch (error) {
    console.error('Error fetching cart:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update cart item quantity
const updateCartItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const { quantity } = req.body;
    const customerId = req.customer._id;

    console.log('Update cart item request:', { itemId, quantity, customerId });

    if (quantity < 0) {
      return res.status(400).json({ message: 'Quantity cannot be negative' });
    }

    const cart = await Cart.findOne({ customer: customerId });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    console.log('Cart found, items before update:', cart.items.map(item => ({ id: item._id, quantity: item.quantity })));

    // Update item quantity
    await cart.updateItem(itemId, quantity);
    
    console.log('Cart items after update:', cart.items.map(item => ({ id: item._id, quantity: item.quantity })));
    
    // Populate cart with product details
    await cart.populate('items.product');

    res.status(200).json({
      message: 'Cart item updated successfully',
      cart
    });
  } catch (error) {
    console.error('Error updating cart item:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Remove item from cart
const removeFromCart = async (req, res) => {
  try {
    const { itemId } = req.params;
    const customerId = req.customer._id;

    console.log('Remove cart item request:', { itemId, customerId });

    const cart = await Cart.findOne({ customer: customerId });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    console.log('Cart found, items before removal:', cart.items.map(item => ({ id: item._id, product: item.product })));

    // Remove item from cart
    await cart.removeItem(itemId);
    
    console.log('Cart items after removal:', cart.items.map(item => ({ id: item._id, product: item.product })));
    
    // Populate cart with product details
    await cart.populate('items.product');

    res.status(200).json({
      message: 'Item removed from cart successfully',
      cart
    });
  } catch (error) {
    console.error('Error removing from cart:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Clear entire cart
const clearCart = async (req, res) => {
  try {
    const customerId = req.customer._id;

    const cart = await Cart.findOne({ customer: customerId });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    // Clear cart
    await cart.clearCart();

    res.status(200).json({
      message: 'Cart cleared successfully',
      cart
    });
  } catch (error) {
    console.error('Error clearing cart:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  addToCart,
  getCart,
  updateCartItem,
  removeFromCart,
  clearCart
};