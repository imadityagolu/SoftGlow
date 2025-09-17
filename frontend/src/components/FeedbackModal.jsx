import React, { useState, useEffect } from 'react';
import feedbackService from '../services/feedbackService';
import { toast } from 'react-toastify';

const FeedbackModal = ({ show, onClose, order, onFeedbackSubmitted }) => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [feedbackText, setFeedbackText] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [existingFeedback, setExistingFeedback] = useState([]);

  useEffect(() => {
    if (show && order) {
      // Reset form
      setSelectedProduct(order.items.length === 1 ? order.items[0] : null);
      setRating(0);
      setHoverRating(0);
      setFeedbackText('');
      setImage(null);
      setImagePreview(null);
      
      // Fetch existing feedback for this order
      fetchExistingFeedback();
    }
  }, [show, order]);

  const fetchExistingFeedback = async () => {
    try {
      const response = await feedbackService.getFeedbackByOrder(order._id);
      setExistingFeedback(response.feedback || []);
    } catch (error) {
      console.error('Error fetching existing feedback:', error);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please select a valid image file');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }
      
      setImage(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImage(null);
    setImagePreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedProduct) {
      toast.error('Please select a product');
      return;
    }
    
    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }
    
    if (!feedbackText.trim()) {
      toast.error('Please enter your feedback');
      return;
    }

    // Check if feedback already exists for this product
    const existingProductFeedback = existingFeedback.find(
      fb => fb.product._id === selectedProduct.product._id
    );
    
    if (existingProductFeedback) {
      toast.error('You have already given feedback for this product');
      return;
    }

    try {
      setLoading(true);
      
      let imageUrl = null;
      
      // Upload image if provided
      if (image) {
        try {
          const imageResponse = await feedbackService.uploadFeedbackImage(image);
          imageUrl = imageResponse.imageUrl;
        } catch (imageError) {
          console.error('Error uploading image:', imageError);
          toast.warning('Failed to upload image, but feedback will be submitted without it');
        }
      }
      
      // Submit feedback
      const feedbackData = {
        orderId: order._id,
        productId: selectedProduct.product._id,
        rating,
        feedbackText: feedbackText.trim(),
        image: imageUrl
      };
      
      await feedbackService.createFeedback(feedbackData);
      toast.success('Feedback submitted successfully!');
      
      // Reset form
      setSelectedProduct(order.items.length === 1 ? order.items[0] : null);
      setRating(0);
      setHoverRating(0);
      setFeedbackText('');
      setImage(null);
      setImagePreview(null);
      
      // Refresh existing feedback
      await fetchExistingFeedback();
      
      // Notify parent component
      if (onFeedbackSubmitted) {
        onFeedbackSubmitted();
      }
      
    } catch (error) {
      console.error('Error submitting feedback:', error);
      toast.error(error.message || 'Failed to submit feedback');
    } finally {
      setLoading(false);
    }
  };

  const renderStars = () => {
    return [...Array(5)].map((_, index) => {
      const starValue = index + 1;
      return (
        <button
          key={index}
          type="button"
          className={`text-2xl transition-colors ${
            starValue <= (hoverRating || rating)
              ? 'text-yellow-400'
              : 'text-gray-300'
          }`}
          onMouseEnter={() => setHoverRating(starValue)}
          onMouseLeave={() => setHoverRating(0)}
          onClick={() => setRating(starValue)}
        >
          ★
        </button>
      );
    });
  };

  const hasExistingFeedback = (productId) => {
    return existingFeedback.some(fb => fb.product._id === productId);
  };

  const getAvailableProducts = () => {
    return order.items.filter(item => !hasExistingFeedback(item.product._id));
  };

  if (!show) return null;

  const availableProducts = getAvailableProducts();

  return (
    <div className="fixed inset-0 bg-opacity-20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-gray-900">
              Give Feedback - Order #{order.orderNumber}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>

          {availableProducts.length === 0 ? (
            <div className="text-center py-8">
              <span className="text-4xl mb-4 block">✅</span>
              <p className="text-gray-600 mb-2">All products have been reviewed!</p>
              <p className="text-sm text-gray-500">
                You have already given feedback for all products in this order.
              </p>
              <button
                onClick={onClose}
                className="mt-4 bg-orange-600 text-white py-2 px-4 rounded-lg hover:bg-orange-700 transition-colors"
              >
                Close
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Product Selection */}
              {order.items.length > 1 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Product to Review
                  </label>
                  <div className="grid grid-cols-1 gap-3">
                    {order.items.map((item) => {
                      const isDisabled = hasExistingFeedback(item.product._id);
                      return (
                        <div
                          key={item.product._id}
                          className={`border rounded-lg p-3 transition-colors ${
                            isDisabled
                              ? 'border-gray-200 bg-gray-50 cursor-not-allowed opacity-60'
                              : selectedProduct?.product._id === item.product._id
                              ? 'border-orange-500 bg-orange-50 cursor-pointer'
                              : 'border-gray-200 hover:border-gray-300 cursor-pointer'
                          }`}
                          onClick={() => !isDisabled && setSelectedProduct(item)}
                        >
                          <div className="flex items-center space-x-3">
                            <img
                              src={item.product.images?.[0] || '/placeholder-image.jpg'}
                              alt={item.name}
                              className={`w-12 h-12 object-cover rounded ${isDisabled ? 'grayscale' : ''}`}
                            />
                            <div className="flex-1">
                              <div className="flex items-center space-x-2">
                                <h4 className={`font-medium ${isDisabled ? 'text-gray-500' : 'text-gray-900'}`}>
                                  {item.name}
                                </h4>
                                {isDisabled && (
                                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                    ✓ Reviewed
                                  </span>
                                )}
                              </div>
                              <p className={`text-sm ${isDisabled ? 'text-gray-400' : 'text-gray-500'}`}>
                                Quantity: {item.quantity} | ₹{item.price}
                              </p>
                            </div>
                            <div className={`w-4 h-4 rounded-full border-2 ${
                              isDisabled
                                ? 'border-gray-300 bg-gray-300'
                                : selectedProduct?.product._id === item.product._id
                                ? 'border-orange-500 bg-orange-500'
                                : 'border-gray-300'
                            }`}>
                              {selectedProduct?.product._id === item.product._id && (
                                <div className="w-full h-full rounded-full bg-white scale-50"></div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Selected Product Display for Single Product */}
              {availableProducts.length === 1 && selectedProduct && (
                <div className="border rounded-lg p-3 bg-gray-50">
                  <div className="flex items-center space-x-3">
                    <img
                      src={selectedProduct.product.images?.[0] || '/placeholder-image.jpg'}
                      alt={selectedProduct.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                    <div>
                      <h4 className="font-medium text-gray-900">{selectedProduct.name}</h4>
                      <p className="text-sm text-gray-500">
                        Quantity: {selectedProduct.quantity} | ₹{selectedProduct.price}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Rating */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rating *
                </label>
                <div className="flex items-center space-x-1">
                  {renderStars()}
                  <span className="ml-2 text-sm text-gray-600">
                    {rating > 0 && `${rating} out of 5 stars`}
                  </span>
                </div>
              </div>

              {/* Feedback Text */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Feedback *
                </label>
                <textarea
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  placeholder="Share your experience with this product..."
                  rows={4}
                  maxLength={1000}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                />
                <div className="text-right text-xs text-gray-500 mt-1">
                  {feedbackText.length}/1000 characters
                </div>
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Add Photo (Optional)
                </label>
                {!imagePreview ? (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                      id="feedback-image"
                    />
                    <label
                      htmlFor="feedback-image"
                      className="cursor-pointer flex flex-col items-center"
                    >
                      <span className="text-3xl mb-2">📷</span>
                      <span className="text-sm text-gray-600">
                        Click to upload an image
                      </span>
                      <span className="text-xs text-gray-500 mt-1">
                        Max size: 5MB
                      </span>
                    </label>
                  </div>
                ) : (
                  <div className="relative">
                    <img
                      src={imagePreview}
                      alt="Feedback preview"
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
                    >
                      ×
                    </button>
                  </div>
                )}
              </div>

              {/* Submit Buttons */}
              <div className="flex space-x-4 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-orange-600 text-white py-2 px-4 rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50"
                  disabled={loading || !selectedProduct || rating === 0 || !feedbackText.trim()}
                >
                  {loading ? 'Submitting...' : 'Submit Feedback'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default FeedbackModal;