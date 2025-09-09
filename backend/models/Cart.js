const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
    default: 1
  },
  price: {
    type: Number,
    required: true
  }
}, {
  timestamps: true
});

const cartSchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: true,
    unique: true
  },
  items: [cartItemSchema]
}, {
  timestamps: true
});

// Method to add item to cart
cartSchema.methods.addItem = function(productId, quantity, price) {
  const existingItemIndex = this.items.findIndex(item => 
    item.product.toString() === productId.toString()
  );
  
  if (existingItemIndex >= 0) {
    // Update existing item quantity
    this.items[existingItemIndex].quantity += quantity;
  } else {
    // Add new item
    this.items.push({
      product: productId,
      quantity: quantity,
      price: price
    });
  }
  
  return this.save();
};

// Method to update item quantity
cartSchema.methods.updateItem = function(itemId, quantity) {
  const itemIndex = this.items.findIndex(item => 
    item._id.toString() === itemId.toString()
  );
  
  if (itemIndex >= 0) {
    if (quantity <= 0) {
      this.items.splice(itemIndex, 1);
    } else {
      this.items[itemIndex].quantity = quantity;
    }
  }
  
  return this.save();
};

// Method to remove item from cart
cartSchema.methods.removeItem = function(itemId) {
  this.items = this.items.filter(item => 
    item._id.toString() !== itemId.toString()
  );
  
  return this.save();
};

// Method to clear cart
cartSchema.methods.clearCart = function() {
  this.items = [];
  return this.save();
};

module.exports = mongoose.model('Cart', cartSchema);