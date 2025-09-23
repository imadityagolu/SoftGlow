import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import ProductService from '../services/productService';
import { getImageUrl } from '../utils/imageUtils';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import Header from './Header';
import Footer from './Footer';
import HeroSection from './HeroSection';

const Home = () => {

  const categories = [
    {
      name: "Aromatherapy",
      image: "🌿",
      description: "Relaxing scents for wellness"
    },
    {
      name: "Luxury Collection",
      image: "💎",
      description: "Premium handcrafted candles"
    },
    {
      name: "Seasonal Specials",
      image: "🍂",
      description: "Limited edition seasonal scents"
    }
  ];

  const navigate = useNavigate();
  const { isCustomer, isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentImageIndexes, setCurrentImageIndexes] = useState({});
  const [totalProductCount, setTotalProductCount] = useState(0);
  const [addingToCart, setAddingToCart] = useState({});

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        // First get total count
        const totalResponse = await ProductService.getAllProducts({ sortBy: 'createdAt', sortOrder: 'desc' });
        if (totalResponse.success && totalResponse.data) {
          setTotalProductCount(totalResponse.data.length);
        }
        
        // Then get limited products for display
        const response = await ProductService.getAllProducts({ limit: 4, sortBy: 'createdAt', sortOrder: 'desc' });
        if (response.success && response.data) {
          // Transform API data to match UI format
          const transformedProducts = response.data.map(product => ({
            id: product._id,
            name: product.name,
            price: `₹${product.price.toFixed(2)}`,
            originalPrice: `₹${(product.price * 1.25).toFixed(2)}`, // 25% markup for original price
            images: product.images || [],
            rating: 5, // Default rating
            description: product.description,
            quantity: product.quantity
          }));
          setFeaturedProducts(transformedProducts);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
        // Fallback to empty array if API fails
        setFeaturedProducts([]);
        setTotalProductCount(0);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Image slideshow effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndexes(prev => {
        const newIndexes = { ...prev };
        featuredProducts.forEach(product => {
          if (product.images && product.images.length > 1) {
            const currentIndex = newIndexes[product.id] || 0;
            newIndexes[product.id] = (currentIndex + 1) % product.images.length;
          }
        });
        return newIndexes;
      });
    }, 3000); // Change image every 3 seconds

    return () => clearInterval(interval);
  }, [featuredProducts]);

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

  // Handle add to cart
  const handleAddToCart = async (productId, productName) => {
    // Check if user is authenticated as customer
    if (!isAuthenticated() || !isCustomer()) {
      // Redirect to customer login page
      navigate('/customer/login');
      return;
    }

    try {
      setAddingToCart(prev => ({ ...prev, [productId]: true }));
      await addToCart(productId, 1); // Default quantity 1
      toast.success(`Added ${productName} to cart!`);
    } catch (error) {
      console.error('Error adding to cart:', error);
      if (error.response?.status === 401) {
        // Token expired or invalid, redirect to login
        navigate('/customer/login');
      } else {
        toast.error('Failed to add product to cart. Please try again.');
      }
    } finally {
      setAddingToCart(prev => ({ ...prev, [productId]: false }));
    }
  };



  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={`text-sm ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}>
        ⭐
      </span>
    ));
  };

  return (
    <div className="min-h-screen bg-white">

      <Header />

      {/* banners */}
      <HeroSection />

      {/* Featured Products */}
      <section id="products" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Featured Products</h2>
            <p className="text-xl text-gray-600">Our bestselling premium candles</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {loading ? (
              // Loading skeleton
              Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="bg-white rounded-2xl shadow-lg overflow-hidden">
                  <div className="bg-gradient-to-br from-amber-100 to-orange-100 p-8 text-center">
                    <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto animate-pulse"></div>
                  </div>
                  <div className="p-6">
                    <div className="h-4 bg-gray-200 rounded mb-2 animate-pulse"></div>
                    <div className="h-6 bg-gray-200 rounded mb-2 animate-pulse"></div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="h-6 bg-gray-200 rounded w-20 animate-pulse"></div>
                      <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
                    </div>
                    <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                </div>
              ))
            ) : featuredProducts.length > 0 ? (
              featuredProducts.map((product, index) => (
                <div key={product.id || index} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                  <div className="bg-gradient-to-br from-amber-100 to-orange-100 p-4 text-center relative overflow-hidden" style={{height: '350px'}}>
                    {product.images && product.images.length > 0 ? (
                      <img 
                        src={getImageUrl(product.images[currentImageIndexes[product.id] || 0])} 
                        alt={product.name}
                        className="w-full h-full object-cover rounded-lg transition-opacity duration-500"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div className="w-full h-full flex items-center justify-center" style={{display: product.images && product.images.length > 0 ? 'none' : 'flex'}}>
                      <span className="text-6xl">{getProductEmoji('candles')}</span>
                    </div>
                    {product.images && product.images.length > 1 && (
                      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
                        {product.images.map((_, imgIndex) => (
                          <div 
                            key={imgIndex}
                            className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                              imgIndex === (currentImageIndexes[product.id] || 0) 
                                ? 'bg-amber-600' 
                                : 'bg-white bg-opacity-50'
                            }`}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <div className="flex items-center mb-2">
                      {renderStars(product.rating)}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{product.name}</h3>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-2xl font-bold text-amber-600">{product.price}</span>
                      <span className="text-sm text-gray-500 line-through">{product.originalPrice}</span>
                    </div>
                    <div className="flex space-x-2">
                      <Link 
                        to={`/product/${product.id}`}
                        className="flex-1 bg-gray-100 text-gray-800 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors text-center"
                      >
                        View Details
                      </Link>
                      <button
                        onClick={() => handleAddToCart(product.id, product.name)}
                        disabled={addingToCart[product.id]}
                        className="flex-1 bg-amber-600 text-white py-3 rounded-lg font-medium hover:bg-amber-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {addingToCart[product.id] ? 'Adding...' : 'Add to Cart'}
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              // No products message
              <div className="col-span-full text-center py-12">
                <span className="text-6xl mb-4 block">🕯️</span>
                <h3 className="text-xl font-bold text-gray-900 mb-2">No Products Available</h3>
                <p className="text-gray-600">Check back soon for our latest candle collections!</p>
              </div>
            )}
          </div>
          
          {/* Show All Products Button */}
          {totalProductCount > 4 && (
            <div className="text-center mt-12">
              <Link 
                to="/all-products"
                className="bg-amber-600 text-white px-8 py-4 rounded-lg font-medium hover:bg-amber-700 transition-colors inline-block"
              >
                Show All Products ({totalProductCount})
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Popular Categories */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Popular Categories</h2>
            <p className="text-xl text-gray-600">Discover our most loved candle collections</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {categories.map((category, index) => (
              <div key={index} className="group cursor-pointer">
                <div className="bg-gradient-to-br from-amber-50 to-orange-100 rounded-2xl p-8 text-center hover:shadow-xl transition-all duration-300 transform group-hover:-translate-y-2">
                  <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <span className="text-4xl">{category.image}</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">{category.name}</h3>
                  <p className="text-gray-600">{category.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">About SoftGlow</h2>
              <p className="text-lg text-gray-600 mb-6">
                For over a years, SoftGlow has been crafting premium candles that transform spaces and create unforgettable moments. Our artisans carefully select the finest waxes and fragrances to ensure each candle delivers an exceptional experience.
              </p>
              <p className="text-lg text-gray-600 mb-8">
                From intimate dinners to relaxing baths, our candles are designed to enhance life's special moments with beautiful scents and warm, ambient lighting.
              </p>
              <Link to="/about" className="bg-amber-600 text-white px-8 py-4 rounded-lg font-medium hover:bg-amber-700 transition-colors">
                Learn More
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-amber-100 to-orange-100 rounded-2xl p-8 text-center">
                <span className="text-4xl block mb-4">🏆</span>
                <h3 className="font-bold text-gray-900">Award Winning</h3>
              </div>
              <div className="bg-gradient-to-br from-orange-100 to-amber-100 rounded-2xl p-8 text-center">
                <span className="text-4xl block mb-4">🌱</span>
                <h3 className="font-bold text-gray-900">Eco Friendly</h3>
              </div>
              <div className="bg-gradient-to-br from-amber-100 to-orange-100 rounded-2xl p-8 text-center">
                <span className="text-4xl block mb-4">✋</span>
                <h3 className="font-bold text-gray-900">Handcrafted</h3>
              </div>
              <div className="bg-gradient-to-br from-orange-100 to-amber-100 rounded-2xl p-8 text-center">
                <span className="text-4xl block mb-4">💝</span>
                <h3 className="font-bold text-gray-900">Premium Quality</h3>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;