import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import ProductService from '../services/productService';
import { getImageUrl } from '../utils/imageUtils';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import Header from './Header';
import Footer from './Footer';

const AllProducts = () => {
  const navigate = useNavigate();
  const { isCustomer, isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentImageIndexes, setCurrentImageIndexes] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [addingToCart, setAddingToCart] = useState({});

  // Fetch all products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await ProductService.getAllProducts({ 
          sortBy: sortBy, 
          sortOrder: sortOrder 
        });
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
            quantity: product.quantity,
            category: product.category
          }));
          setProducts(transformedProducts);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [sortBy, sortOrder]);

  // Image slideshow effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndexes(prev => {
        const newIndexes = { ...prev };
        products.forEach(product => {
          if (product.images && product.images.length > 1) {
            const currentIndex = newIndexes[product.id] || 0;
            newIndexes[product.id] = (currentIndex + 1) % product.images.length;
          }
        });
        return newIndexes;
      });
    }, 3000); // Change image every 3 seconds

    return () => clearInterval(interval);
  }, [products]);

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

  // Filter products based on search term
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-amber-50 to-orange-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              All Our <span className="text-amber-600 italic font-serif">Premium Candles</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Discover our complete collection of handcrafted candles
            </p>
          </div>
        </div>
      </section>

      {/* Filters and Search */}
      <section className="py-8 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="flex-1 max-w-md">
              <input
                type="text"
                placeholder="Search candles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
            </div>
            
            {/* Sort Options */}
            <div className="flex gap-4">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              >
                <option value="createdAt">Sort by Date</option>
                <option value="name">Sort by Name</option>
                <option value="price">Sort by Price</option>
              </select>
              
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              >
                <option value="desc">Descending</option>
                <option value="asc">Ascending</option>
              </select>
            </div>
          </div>
          
          {/* Results Count */}
          <div className="mt-4 text-gray-600">
            Showing {filteredProducts.length} of {products.length} products
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {loading ? (
              // Loading skeleton
              Array.from({ length: 8 }).map((_, index) => (
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
            ) : filteredProducts.length > 0 ? (
              filteredProducts.map((product, index) => (
                <div key={product.id || index} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                  <div className="bg-gradient-to-br from-amber-100 to-orange-100 p-4 text-center relative overflow-hidden" style={{height: '200px'}}>
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
                      <span className="text-6xl">{getProductEmoji(product.category)}</span>
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
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-2xl font-bold text-amber-600">{product.price}</span>
                      <span className="text-sm text-gray-500 line-through">{product.originalPrice}</span>
                    </div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm text-gray-500">Stock: {product.quantity}</span>
                      <span className="text-sm bg-amber-100 text-amber-800 px-2 py-1 rounded-full">
                        {product.category || 'Candles'}
                      </span>
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
                <span className="text-6xl mb-4 block">🔍</span>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {searchTerm ? 'No products found' : 'No Products Available'}
                </h3>
                <p className="text-gray-600">
                  {searchTerm 
                    ? `Try searching for something else or clear your search.` 
                    : 'Check back soon for our latest candle collections!'
                  }
                </p>
                {searchTerm && (
                  <button 
                    onClick={() => setSearchTerm('')}
                    className="mt-4 text-amber-600 hover:text-amber-700 font-medium"
                  >
                    Clear Search
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AllProducts;