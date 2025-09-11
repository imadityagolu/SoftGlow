const mongoose = require('mongoose');

const favoriteSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: 'userType'
  },
  userType: {
    type: String,
    required: true,
    enum: ['Customer', 'Admin']
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  }
}, {
  timestamps: true
});

// Create compound index to ensure a user can't favorite the same product twice
favoriteSchema.index({ userId: 1, productId: 1 }, { unique: true });

// Index for efficient queries
favoriteSchema.index({ userId: 1, createdAt: -1 });
favoriteSchema.index({ productId: 1 });

module.exports = mongoose.model('Favorite', favoriteSchema);