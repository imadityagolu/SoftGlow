const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    minlength: [2, 'Product name must be at least 2 characters'],
    maxlength: [100, 'Product name cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Product description is required'],
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  price: {
    type: Number,
    required: [true, 'Product price is required'],
    min: [0, 'Price cannot be negative'],
    validate: {
      validator: function(value) {
        return Number(value.toFixed(2)) === value;
      },
      message: 'Price can only have up to 2 decimal places'
    }
  },
  quantity: {
    type: Number,
    required: [true, 'Product quantity is required'],
    min: [0, 'Quantity cannot be negative'],
    validate: {
      validator: Number.isInteger,
      message: 'Quantity must be a whole number'
    }
  },
  images: {
    type: [String],
    required: [true, 'At least one product image is required'],
    validate: {
      validator: function(images) {
        return images && images.length >= 1;
      },
      message: 'At least 1 product image is required'
    }
  },
  category: {
    type: String,
    default: 'candles',
    enum: ['candles', 'aromatherapy', 'gift-sets', 'accessories']
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    required: true
  }
}, {
  timestamps: true
});

// Index for better search performance
productSchema.index({ name: 'text', description: 'text' });
productSchema.index({ category: 1 });
productSchema.index({ isActive: 1 });
productSchema.index({ createdAt: -1 });

// Virtual for formatted price
productSchema.virtual('formattedPrice').get(function() {
  return `$${this.price.toFixed(2)}`;
});

// Method to check if product is in stock
productSchema.methods.isInStock = function() {
  return this.quantity > 0;
};

// Method to reduce quantity (for orders)
productSchema.methods.reduceQuantity = function(amount) {
  if (this.quantity >= amount) {
    this.quantity -= amount;
    return true;
  }
  return false;
};

// Static method to find active products
productSchema.statics.findActive = function() {
  return this.find({ isActive: true });
};

// Static method to find products by category
productSchema.statics.findByCategory = function(category) {
  return this.find({ category, isActive: true });
};

module.exports = mongoose.model('Product', productSchema);