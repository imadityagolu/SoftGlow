import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import ProductService from '../services/productService';
import { getImageUrl } from '../utils/imageUtils';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import favoriteService from '../services/favoriteService';
import Header from './Header';
import Footer from './Footer';

const Product = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, isCustomer } = useAuth();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState(null);
  const [addingToCart, setAddingToCart] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [addingToFavorites, setAddingToFavorites] = useState(false);

  // Fetch product details
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await ProductService.getAllProducts();
        if (response.success && response.data) {
          const foundProduct = response.data.find(p => p._id === id);
          if (foundProduct) {
            setProduct({
              id: foundProduct._id,
              name: foundProduct.name,
              price: foundProduct.price,
              originalPrice: foundProduct.price * 1.25, // 25% markup for original price
              images: foundProduct.images || [],
              rating: 5, // Default rating
              description: foundProduct.description,
              quantity: foundProduct.quantity,
              category: foundProduct.category
            });
          } else {
            setError('Product not found');
          }
        } else {
          setError('Failed to load product');
        }
      } catch (error) {
        console.error('Error fetching product:', error);
        setError('Failed to load product');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  // Check if product is in favorites
  useEffect(() => {
    const checkFavoriteStatus = async () => {
      if (product && isAuthenticated() && isCustomer()) {
        try {
          const response = await favoriteService.checkFavoriteStatus(product.id);
          setIsFavorite(response.isFavorite);
        } catch (error) {
          console.error('Error checking favorite status:', error);
        }
      }
    };

    checkFavoriteStatus();
  }, [product, isAuthenticated, isCustomer]);

  // Auto slideshow for multiple images
  useEffect(() => {
    if (product && product.images && product.images.length > 1) {
      const interval = setInterval(() => {
        setCurrentImageIndex(prevIndex => 
          prevIndex === product.images.length - 1 ? 0 : prevIndex + 1
        );
      }, 3000); // Change image every 3 seconds

      return () => clearInterval(interval);
    }
  }, [product]);

  // Helper function to get emoji based on category
  const getProductEmoji = (category) => {
    const emojiMap = {
      'candles': '🕯️',
      'aromatherapy': '🌿',
      'gift-sets': '🎁',
      'accessories': '✨'
    };
    return emojiMap[category] || '🕯️';
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={`text-lg ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}>
        ⭐
      </span>
    ));
  };

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= product.quantity) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = async () => {
    // Check if user is authenticated as customer
    if (!isAuthenticated() || !isCustomer()) {
      // Redirect to customer login page
      navigate('/customer/login');
      return;
    }

    try {
      setAddingToCart(true);
      await addToCart(product.id, quantity);
      toast.success(`Added ${quantity} ${product.name}(s) to cart!`);
    } catch (error) {
      console.error('Error adding to cart:', error);
      if (error.response?.status === 401) {
        // Token expired or invalid, redirect to login
        navigate('/customer/login');
      } else {
        toast.error('Failed to add product to cart. Please try again.');
      }
    } finally {
      setAddingToCart(false);
    }
  };

  const handleToggleFavorite = async () => {
    // Check if user is authenticated as customer
    if (!isAuthenticated() || !isCustomer()) {
      // Redirect to customer login page
      navigate('/customer/login');
      return;
    }

    try {
      setAddingToFavorites(true);
      if (isFavorite) {
        await favoriteService.removeFromFavorites(product.id);
        setIsFavorite(false);
        toast.success('Removed from favorites!');
      } else {
        await favoriteService.addToFavorites(product.id);
        setIsFavorite(true);
        toast.success('Added to favorites!');
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      if (error.response?.status === 401) {
        // Token expired or invalid, redirect to login
        navigate('/customer/login');
      } else {
        toast.error('Failed to update favorites. Please try again.');
      }
    } finally {
      setAddingToFavorites(false);
    }
  };



  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="animate-pulse">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="bg-gray-200 rounded-2xl h-96"></div>
              <div className="space-y-4">
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <span className="text-6xl mb-4 block">😞</span>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">{error || 'Product not found'}</h1>
            <p className="text-gray-600 mb-8">The product you're looking for doesn't exist or has been removed.</p>
            <Link 
              to="/all-products"
              className="bg-amber-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-amber-700 transition-colors"
            >
              Browse All Products
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Breadcrumb */}
      <div className="bg-gray-50 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center space-x-2 text-sm text-gray-600">
            <Link to="/" className="hover:text-amber-600">Home</Link>
            <span>›</span>
            <Link to="/all-products" className="hover:text-amber-600">Products</Link>
            <span>›</span>
            <span className="text-gray-900">{product.name}</span>
          </nav>
        </div>
      </div>

      {/* Product Details */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="bg-gradient-to-br from-amber-100 to-orange-100 rounded-2xl p-4 text-center relative overflow-hidden" style={{height: '500px'}}>
              {product.images && product.images.length > 0 ? (
                <img 
                  src={getImageUrl(product.images[currentImageIndex])} 
                  alt={product.name}
                  className="w-full h-full object-cover rounded-lg transition-opacity duration-500"
                  style={{height: '100%',width:'100%',objectFit:'contain'}}
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
              ) : null}
              <div className="w-full h-full flex items-center justify-center" style={{display: product.images && product.images.length > 0 ? 'none' : 'flex'}}>
                <span className="text-9xl">{getProductEmoji(product.category)}</span>
              </div>
            </div>
            
            {/* Thumbnail Images */}
            {product.images && product.images.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto justify-center">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                      index === currentImageIndex ? 'border-amber-600' : 'border-gray-200'
                    }`}
                  >
                    <img 
                      src={getImageUrl(image)} 
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-amber-100 to-orange-100" style={{display: 'none'}}>
                      <span className="text-2xl">{getProductEmoji(product.category)}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Title and Rating */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
              <div className="flex items-center space-x-2 mb-4">
                <div className="flex items-center">
                  {renderStars(product.rating)}
                </div>
                <span className="text-gray-600">(5.0)</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm bg-amber-100 text-amber-800 px-3 py-1 rounded-full">
                  {product.category || 'Candles'}
                </span>
                <span className={`text-sm px-3 py-1 rounded-full ${
                  product.quantity > 10 
                    ? 'bg-green-100 text-green-800' 
                    : product.quantity > 0 
                    ? 'bg-yellow-100 text-yellow-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {product.quantity > 0 ? `${product.quantity} in stock` : 'Out of stock'}
                </span>
              </div>
            </div>

            {/* Price */}
            <div className="space-y-2">
              <div className="flex items-center space-x-4">
                <span className="text-3xl font-bold text-amber-600">₹{product.price.toFixed(2)}</span>
                <span className="text-xl text-gray-500 line-through">₹{product.originalPrice.toFixed(2)}</span>
                <span className="text-sm bg-red-100 text-red-800 px-2 py-1 rounded-full">
                  {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                </span>
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
              <p className="text-gray-600 leading-relaxed">{product.description}</p>
            </div>

            {/* Quantity Selector */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Quantity</h3>
              <div className="flex items-center space-x-4">
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    −
                  </button>
                  <span className="px-4 py-2 border-x border-gray-300 min-w-[60px] text-center">{quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= product.quantity}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    +
                  </button>
                </div>
                <span className="text-sm text-gray-500">Max: {product.quantity}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              <div className="flex space-x-3">
                <button
                  onClick={handleAddToCart}
                  disabled={product.quantity === 0 || addingToCart}
                  className="flex-1 bg-amber-600 text-white py-4 rounded-lg font-medium hover:bg-amber-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {addingToCart ? 'Adding to Cart...' : 'Add to Cart'}
                </button>
                <button
                  onClick={handleToggleFavorite}
                  disabled={addingToFavorites}
                  className={`px-6 py-4 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                    isFavorite 
                      ? 'bg-red-100 text-red-600 hover:bg-red-200' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                  title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                >
                  {addingToFavorites ? (
                    <span className="animate-spin">⏳</span>
                  ) : (
                    <span className="text-xl">{isFavorite ? '❤️' : '🤍'}</span>
                  )}
                </button>
              </div>
            </div>

            {/* Additional Info */}
            <div className="border-t pt-6 space-y-3">
              <div className="flex items-center space-x-3 text-sm text-gray-600">
                <span>🚚</span>
                <span>Free shipping on orders over ₹500</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-gray-600">
                <span>↩️</span>
                <span>30-day return policy</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-gray-600">
                <span>🔒</span>
                <span>Secure payment guaranteed</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Product;