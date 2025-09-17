const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: true
  },
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  feedbackText: {
    type: String,
    required: true,
    trim: true,
    maxlength: 1000
  },
  image: {
    type: String, // URL to uploaded image
    default: null
  },
  isVerified: {
    type: Boolean,
    default: false // Admin can verify feedback
  },
  isVisible: {
    type: Boolean,
    default: true // Admin can hide inappropriate feedback
  },
  adminResponse: {
    type: String,
    default: null
  },
  adminResponseDate: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

// Index for efficient queries
feedbackSchema.index({ product: 1, isVisible: 1 });
feedbackSchema.index({ customer: 1 });
feedbackSchema.index({ order: 1 });

// Virtual for formatted rating
feedbackSchema.virtual('formattedRating').get(function() {
  return '★'.repeat(this.rating) + '☆'.repeat(5 - this.rating);
});

// Virtual for formatted date
feedbackSchema.virtual('formattedDate').get(function() {
  return this.createdAt.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
});

module.exports = mongoose.model('Feedback', feedbackSchema);