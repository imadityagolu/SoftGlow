import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { useFavorites } from '../contexts/FavoritesContext';
import customerService from '../services/customerService';
import orderService from '../services/orderService';
import { getImageUrl } from '../utils/imageUtils';
import { toast } from 'react-toastify';
import NotificationSection from '../components/NotificationSection';

const CustomerDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { logout, user, token, login } = useAuth();
  const { cartItems, loading: cartLoading, updateCartItem, removeFromCart, clearCart, fetchCart, addToCart } = useCart();
  const { favorites, loading: favoritesLoading, fetchFavorites, removeFromFavorites: removeFavorite, addToFavorites } = useFavorites();
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: ''
    }
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [cancelOrderModal, setCancelOrderModal] = useState({ show: false, orderId: null, orderNumber: '' });
  const [returnOrderModal, setReturnOrderModal] = useState({ show: false, orderId: null, orderNumber: '' });

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  // Handle URL parameters for tab navigation
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabParam = urlParams.get('tab');
    if (tabParam && ['overview', 'orders', 'cart', 'favorites', 'profile'].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [location.search]);

  // Fetch customer orders function
  const fetchOrders = useCallback(async () => {
    if (token && activeTab === 'orders') {
      try {
        setOrdersLoading(true);
        const response = await orderService.getCustomerOrders();
        // Backend returns orders directly in response.orders
        setOrders(response.orders || []);
      } catch (error) {
        console.error('Error fetching orders:', error);
        // If JWT error, user might need to log in again
        if (error.message.includes('invalid signature') || error.message.includes('jwt')) {
          toast.error('Session expired. Please log in again.');
          logout();
          navigate('/customer/login');
        } else {
          toast.error('Failed to fetch orders');
        }
      } finally {
        setOrdersLoading(false);
      }
    }
  }, [token, activeTab, logout, navigate]);

  // Fetch customer orders
  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Fetch customer profile data
  useEffect(() => {
    const fetchProfile = async () => {
      if (token && activeTab === 'profile') {
        try {
          setLoading(true);
          const response = await customerService.getProfile(token);
          if (response.success) {
            const customer = response.data.customer;
            setProfileData({
              firstName: customer.firstName || '',
              lastName: customer.lastName || '',
              email: customer.email || '',
              phone: customer.phone || '',
              address: {
                street: customer.address?.street || '',
                city: customer.address?.city || '',
                state: customer.address?.state || '',
                zipCode: customer.address?.zipCode || '',
                country: customer.address?.country || ''
              }
            });
          }
        } catch (error) {
          setMessage({ type: 'error', text: error.message });
        } finally {
          setLoading(false);
        }
      }
    };

    fetchProfile();
  }, [token, activeTab]);

  // Refresh cart when cart tab is active
  useEffect(() => {
    if (activeTab === 'cart') {
      fetchCart();
    }
  }, [activeTab, fetchCart]);

  // Fetch favorites when favorites tab is active
  useEffect(() => {
    if (activeTab === 'favorites') {
      fetchFavorites();
    }
  }, [activeTab, fetchFavorites]);

  // Handle profile form changes
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('address.')) {
      const addressField = name.split('.')[1];
      setProfileData(prev => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value
        }
      }));
    } else {
      setProfileData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // Handle profile update
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setMessage({ type: '', text: '' });
      
      const response = await customerService.updateProfile(profileData, token);
      if (response.success) {
        setMessage({ type: 'success', text: 'Profile updated successfully!' });
        // Update user context with new data
        login(response.data.customer, token, 'customer');
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      }
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
      setTimeout(() => setMessage({ type: '', text: '' }), 5000);
    } finally {
      setLoading(false);
    }
  };

  // Handle cart quantity update
  const handleQuantityUpdate = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    
    // console.log('handleQuantityUpdate called with:', { itemId, newQuantity });
    // console.log('Current cartItems:', cartItems.map(item => ({ id: item._id, productId: item.product._id, quantity: item.quantity })));
    
    // Find the cart item to check stock
    const cartItem = cartItems.find(item => item._id === itemId);
    if (cartItem && newQuantity > cartItem.product.quantity) {
      setMessage({ type: 'error', text: `Only ${cartItem.product.quantity} items available in stock` });
      setTimeout(() => setMessage({ type: '', text: '' }), 5000);
      return;
    }
    
    try {
      await updateCartItem(itemId, newQuantity);
      setMessage({ type: 'success', text: 'Cart updated successfully' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
      setTimeout(() => setMessage({ type: '', text: '' }), 5000);
    }
  };

  // Handle cart item removal
  const handleRemoveItem = async (itemId) => {
    try {
      // console.log('handleRemoveItem called with:', { itemId });
      // console.log('Current cartItems:', cartItems.map(item => ({ id: item._id, productId: item.product._id })));
      await removeFromCart(itemId);
      setMessage({ type: 'success', text: 'Item removed from cart' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
      setTimeout(() => setMessage({ type: '', text: '' }), 5000);
    }
  };

  // Handle profile form submission
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await customerService.updateProfile(profileData, token);
      if (response.success) {
        setMessage({ type: 'success', text: 'Profile updated successfully!' });
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      } else {
        setMessage({ type: 'error', text: response.message || 'Failed to update profile' });
        setTimeout(() => setMessage({ type: '', text: '' }), 5000);
      }
    } catch (error) {
      setMessage({ type: 'error', text: error.message || 'Failed to update profile' });
      setTimeout(() => setMessage({ type: '', text: '' }), 5000);
    } finally {
      setLoading(false);
    }
  };

  // Calculate cart total
  const calculateCartTotal = () => {
    return cartItems.reduce((total, item) => total + (item.product.price * item.quantity), 0).toFixed(2);
  };

  // Handle checkout process
  const handleCheckout = async () => {
    try {
      setLoading(true);
      
      // First validate customer data
      const validationResponse = await orderService.validateCustomerData();
      
      if (!validationResponse.valid) {
        toast.error(validationResponse.message);
        setActiveTab('profile'); // Redirect to profile tab to update missing info
        return;
      }
      
      // Create Razorpay order
      const orderResponse = await orderService.createPaymentOrder();
      
      if (!orderResponse.orderId) {
        toast.error('Failed to create payment order');
        return;
      }
      
      // Initialize Razorpay
      const options = {
        key: orderResponse.key,
        amount: orderResponse.amount * 100, // Convert to paise
        currency: orderResponse.currency,
        name: 'SoftGlow',
        description: 'Order Payment',
        order_id: orderResponse.orderId,
        handler: async function (response) {
          try {
            // Verify payment and create order
            const verificationResponse = await orderService.verifyPaymentAndCreateOrder({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            });
            
            if (verificationResponse.message === 'Order placed successfully') {
              toast.success('Order placed successfully!');
              // Clear cart after successful order
              await clearCart();
              // Optionally redirect to orders tab
              setActiveTab('orders');
            } else {
              toast.error('Payment verification failed');
            }
          } catch (error) {
            console.error('Payment verification error:', error);
            toast.error('Payment verification failed');
          }
        },
        prefill: {
          name: profileData.name,
          email: profileData.email,
          contact: profileData.phone
        },
        theme: {
          color: '#ea580c'
        },
        modal: {
          ondismiss: function() {
            toast.warning('Payment cancelled');
          }
        }
      };
      
      const rzp = new window.Razorpay(options);
      rzp.open();
      
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error(error.message || 'Checkout failed');
    } finally {
      setLoading(false);
    }
  };

  // Handle removing item from favorites
  const handleRemoveFromFavorites = async (productId) => {
    try {
      await removeFavorite(productId);
      toast.success('Removed from favorites');
    } catch (error) {
      console.error('Error removing from favorites:', error);
      toast.error('Failed to remove from favorites');
    }
  };

  // Handle adding item to cart from favorites
  const handleAddToCartFromFavorites = async (product) => {
    try {
      await addToCart(product._id, 1);
      toast.success('Added to cart successfully');
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add to cart');
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'shipped': return 'bg-blue-100 text-blue-800';
      case 'processing': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'refunded': return 'bg-purple-100 text-purple-800';
      case 'pending': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Handle cancel order
  const handleCancelOrder = async () => {
    try {
      setLoading(true);
      const response = await orderService.cancelOrder(cancelOrderModal.orderId);
      
      if (response.success) {
        toast.success('Order cancelled successfully');
        // Update the order status in the local state
        setOrders(orders.map(order => 
          order._id === cancelOrderModal.orderId 
            ? { ...order, status: 'cancelled' }
            : order
        ));
      } else {
        toast.error(response.message || 'Failed to cancel order');
      }
    } catch (error) {
      console.error('Error cancelling order:', error);
      toast.error(error.message || 'Failed to cancel order');
    } finally {
      setLoading(false);
      setCancelOrderModal({ show: false, orderId: null, orderNumber: '' });
    }
  };

  // Handle download invoice
  const handleDownloadInvoice = async (orderId) => {
    try {
      setLoading(true);
      const response = await orderService.downloadInvoice(orderId);
      
      // Create blob and download
      const blob = new Blob([response], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `invoice-${orderId}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast.success('Invoice downloaded successfully');
    } catch (error) {
      console.error('Error downloading invoice:', error);
      toast.error(error.message || 'Failed to download invoice');
    } finally {
      setLoading(false);
    }
  };

  // Check if order is within 24 hours of completion
  const isWithin24Hours = (order) => {
    if (order.status?.toLowerCase() !== 'completed') {
      return false;
    }
    
    // Use deliveryDate if available, otherwise use updatedAt timestamp
    let completedTime;
    if (order.deliveryDate) {
      completedTime = new Date(order.deliveryDate);
    } else if (order.updatedAt) {
      completedTime = new Date(order.updatedAt);
    } else {
      return false;
    }
    
    const now = new Date();
    const timeDiff = now - completedTime;
    const hoursDiff = timeDiff / (1000 * 60 * 60); // Convert to hours
    
    return hoursDiff <= 24;
  };

  // Handle return order
  const handleReturnOrder = (orderId, orderNumber) => {
    setReturnOrderModal({ show: true, orderId, orderNumber });
  };

  const confirmReturnOrder = async () => {
    try {
      setLoading(true);
      await orderService.returnOrder(returnOrderModal.orderId);
      toast.success('Return request submitted successfully');
      fetchOrders(); // Refresh orders list
      setReturnOrderModal({ show: false, orderId: null, orderNumber: '' });
    } catch (error) {
      console.error('Error returning order:', error);
      toast.error(error.message || 'Failed to submit return request');
    } finally {
      setLoading(false);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            {/* Welcome Section */}
            <div className="bg-gradient-to-r from-orange-500 to-amber-500 rounded-lg p-6 text-white">
              <h2 className="text-2xl font-bold mb-2">Welcome, {user?.firstName || 'Customer'}!</h2>
              <p className="text-orange-100">Discover our latest candle collections and enjoy the perfect ambiance.</p>
            </div>

            {/* Notification Section */}
            <NotificationSection userId={user?._id} userType="Customer" />
            
          </div>
        );
      case 'orders':
        return (
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Order History</h3>
            </div>
            {ordersLoading ? (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
                <span className="ml-2 text-gray-600">Loading orders...</span>
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-8">
                <span className="text-4xl mb-4 block">📦</span>
                <p className="text-gray-500 mb-4">No orders found</p>
                <p className="text-sm text-gray-400">Your order history will appear here once you make your first purchase.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" colSpan="2">Items & Quantities</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {orders.map((order) => (
                      <tr key={order._id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {order.orderNumber}
                          <br/>
                          <span style={{color:'#ccc'}}>{new Date(order.orderDate).toLocaleDateString('en-IN', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}</span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900" colSpan="2">
                          <div className="space-y-1">
                            {order.items.map((item, index) => (
                              <div key={index} className="flex justify-between items-center">
                                <span className="text-sm font-medium text-gray-900 truncate mr-2">
                                  {item.product?.name || item.name}
                                </span>
                                <span className="text-sm text-gray-700 font-medium">
                                  x{item.quantity}
                                </span>
                              </div>
                            ))}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₹{order.totalAmount}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                            {order.status?.charAt(0).toUpperCase() + order.status?.slice(1) || 'Unknown'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-y-2">
                          {order.status?.toLowerCase() !== 'completed' && 
                           order.status?.toLowerCase() !== 'cancelled' && 
                           order.status?.toLowerCase() !== 'refunded' && 
                           order.status?.toLowerCase() !== 'return' && (
                            <button
                              onClick={() => setCancelOrderModal({ show: true, orderId: order._id, orderNumber: order.orderNumber })}
                              className="w-full bg-red-600 text-white py-1 px-3 rounded-lg hover:bg-red-700 transition-colors text-xs"
                            >
                              Cancel Order
                            </button>
                          )}
                          {order.status?.toLowerCase() === 'completed' && (
                            <div className="space-y-1">
                              <button
                                onClick={() => handleDownloadInvoice(order._id)}
                                className="bg-blue-600 text-white py-1 px-3 rounded-lg hover:bg-blue-700 transition-colors text-xs"
                              >
                                Download Invoice
                              </button>
                              {isWithin24Hours(order) && (
                                <button
                                  onClick={() => handleReturnOrder(order._id, order.orderNumber)}
                                  className="bg-orange-600 text-white py-1 px-3 rounded-lg hover:bg-orange-700 transition-colors text-xs"
                                >
                                  Return
                                </button>
                              )}
                            </div>
                          )}
                          {(order.status?.toLowerCase() === 'refunded' || 
                            order.status?.toLowerCase() === 'cancelled' ||
                            order.status?.toLowerCase() === 'return') && (
                            <span className="text-gray-400 text-xs">No actions available</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        );
      case 'favorites':
        return (
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Favorite Products</h3>
            </div>
            {favoritesLoading ? (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
                <span className="ml-2 text-gray-600">Loading favorites...</span>
              </div>
            ) : favorites.length === 0 ? (
              <div className="text-center py-8">
                <span className="text-4xl mb-4 block">❤️</span>
                <p className="text-gray-500 mb-4">No favorite products yet</p>
                <p className="text-sm text-gray-400">Start adding products to your favorites to see them here.</p>
              </div>
            ) : (
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {favorites.map((favorite) => {
                    const product = favorite.productId || favorite.product;
                    return (
                      <div key={favorite._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="text-center">
                          <Link 
                            to={`/product/${product?._id}`}
                            className="w-20 h-20 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4 overflow-hidden hover:bg-orange-200 transition-colors cursor-pointer"
                          >
                            {product && product.images && product.images.length > 0 ? (
                              <img 
                                src={getImageUrl(product.images[0])} 
                                alt={product.name}
                                className="w-full h-full object-cover rounded-lg"
                              />
                            ) : (
                              <span className="text-2xl">🕯️</span>
                            )}
                          </Link>
                          <Link 
                            to={`/product/${product?._id}`}
                            className="hover:text-orange-600 transition-colors cursor-pointer"
                          >
                            <h4 className="font-medium text-gray-900 mb-2 hover:text-orange-600">{product?.name || 'Product Name'}</h4>
                          </Link>
                          <p className="text-orange-600 font-bold mb-4">₹{product?.price || '0'}</p>
                          <div className=" space-y-2">
                            <button 
                              onClick={() => handleRemoveFromFavorites(product?._id)}
                              className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors text-sm"
                            >
                              Remove from Favorites
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        );
      case 'profile':
        return (
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Profile Settings</h3>
            </div>
            <div className="p-6">
              {loading ? (
                <div className="flex justify-center items-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
                  <span className="ml-2 text-gray-600">Loading profile...</span>
                </div>
              ) : (
                <form onSubmit={handleProfileSubmit} className="max-w-2xl space-y-6">
                  {/* Message Display */}
                  {message.text && (
                    <div className={`p-4 rounded-lg ${
                      message.type === 'success' 
                        ? 'bg-green-100 text-green-700 border border-green-200' 
                        : 'bg-red-100 text-red-700 border border-red-200'
                    }`}>
                      {message.text}
                    </div>
                  )}

                  {/* Personal Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                      <input 
                        type="text" 
                        name="firstName"
                        value={profileData.firstName}
                        onChange={handleProfileChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent" 
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                      <input 
                        type="text" 
                        name="lastName"
                        value={profileData.lastName}
                        onChange={handleProfileChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent" 
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input 
                      type="email" 
                      name="email"
                      value={profileData.email}
                      onChange={handleProfileChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-gray-50" 
                      disabled
                      title="Email cannot be changed"
                    />
                    <p className="text-sm text-gray-500 mt-1">Email cannot be changed</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone {user?.googleId && <span className="text-sm text-gray-500">(Optional)</span>}
                    </label>
                    <input 
                      type="tel" 
                      name="phone"
                      value={profileData.phone}
                      onChange={handleProfileChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent" 
                      required={!user?.googleId}
                      placeholder={user?.googleId ? "Add your phone number (optional)" : ""}
                    />
                    {user?.googleId && !profileData.phone && (
                      <p className="text-sm text-gray-500 mt-1">You can add your phone number for better account security and order updates.</p>
                    )}
                  </div>

                  {/* Address Section */}
                  <div className="border-t border-gray-200 pt-6">
                    <h4 className="text-lg font-medium text-gray-900 mb-4">Address Information</h4>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Street Address</label>
                        <input 
                          type="text" 
                          name="address.street"
                          value={profileData.address.street}
                          onChange={handleProfileChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent" 
                          placeholder="123 Main Street"
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                          <input 
                            type="text" 
                            name="address.city"
                            value={profileData.address.city}
                            onChange={handleProfileChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent" 
                            placeholder="New York"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                          <input 
                            type="text" 
                            name="address.state"
                            value={profileData.address.state}
                            onChange={handleProfileChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent" 
                            placeholder="NY"
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">ZIP Code</label>
                          <input 
                            type="text" 
                            name="address.zipCode"
                            value={profileData.address.zipCode}
                            onChange={handleProfileChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent" 
                            placeholder="10001"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                          <input 
                            type="text" 
                            name="address.country"
                            value={profileData.address.country}
                            onChange={handleProfileChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent" 
                            placeholder="United States"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end pt-6">
                    <button 
                      type="submit"
                      disabled={loading}
                      className="bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                    >
                      {loading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Updating...
                        </>
                      ) : (
                        'Update Profile'
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        );
      case 'cart':
        return (
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900"> Cart</h3>
            </div>
            <div className="p-6">
              {cartLoading ? (
                <div className="flex justify-center items-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
                  <span className="ml-2 text-gray-600">Loading cart...</span>
                </div>
              ) : cartItems.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">🛒</span>
                  </div>
                  <h4 className="text-lg font-medium text-gray-900 mb-2">Your cart is empty</h4>
                  <p className="text-gray-500 mb-4">Add some products to get started!</p>
                  <Link to="/products" className="bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700 transition-colors">
                    Browse Products
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div key={item.product._id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <Link 
                          to={`/product/${item.product._id}`}
                          className="w-16 h-16 bg-orange-100 rounded-lg flex items-center justify-center overflow-hidden hover:bg-orange-200 transition-colors cursor-pointer"
                        >
                          {item.product.images && item.product.images.length > 0 ? (
                            <img 
                              src={getImageUrl(item.product.images[0])} 
                              alt={item.product.name}
                              className="w-full h-full object-cover rounded-lg"
                              onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.nextSibling.style.display = 'flex';
                              }}
                            />
                          ) : null}
                          <div className="w-full h-full flex items-center justify-center" style={{display: item.product.images && item.product.images.length > 0 ? 'none' : 'flex'}}>
                            <span className="text-2xl">🕯️</span>
                          </div>
                        </Link>
                        <div>
                          <Link 
                            to={`/product/${item.product._id}`}
                            className="hover:text-orange-600 transition-colors cursor-pointer"
                          >
                            <h4 className="font-medium text-gray-900 hover:text-orange-600">{item.product.name}</h4>
                          </Link>
                          <p className="text-orange-600 font-bold">₹{item.product.price}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <button 
                            onClick={() => handleQuantityUpdate(item._id, item.quantity - 1)}
                            className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors"
                            disabled={item.quantity <= 1}
                          >
                            -
                          </button>
                          <span className="w-4 text-center font-medium">{item.quantity}</span>
                          <button 
                            onClick={() => handleQuantityUpdate(item._id, item.quantity + 1)}
                            className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={item.quantity >= item.product.quantity}
                          >
                            +
                          </button>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-gray-900">₹{(item.product.price * item.quantity).toFixed(2)}</p>
                          <button 
                            onClick={() => handleRemoveItem(item._id)}
                            className="text-red-600 hover:text-red-800 text-sm transition-colors p-1 rounded hover:bg-red-50"
                            title="Remove item"
                          >
                            🗑️ remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {/* Cart Summary */}
                  <div className="border-t pt-4 mt-6">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-lg font-medium text-gray-900">Total: ₹{calculateCartTotal()}</span>
                    </div>
                    <div>
                        <button 
                          onClick={handleCheckout}
                          disabled={loading || cartItems.length === 0}
                          className="bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {loading ? 'Processing...' : 'Proceed to Checkout'}
                        </button>
                      </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              {/* Mobile menu button */}
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden mr-4 p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <Link to="/" className="flex items-center">
              <span className="text-2xl mr-3">🕯️</span>
              <h1 className="text-2xl font-bold text-gray-900">SoftGlow</h1>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors cursor-pointer"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex">

          {/* Sidebar */}
          <div className={`${sidebarOpen ? 'fixed inset-y-0 left-0 transform translate-x-0' : 'fixed inset-y-0 left-0 transform -translate-x-full'} lg:relative lg:translate-x-0 lg:block w-64 bg-white lg:rounded-lg shadow-lg lg:mr-8 z-30 lg:z-auto transition-transform duration-300 ease-in-out`}>
            {/* Mobile header with close button */}
            <div className="lg:hidden flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-orange-50 to-amber-50">
              <div style={{display:'flex', alignItems:'center'}}>
                <span className="text-2xl">🕯️</span>
                <h2 className="text-lg font-semibold text-gray-900">SoftGlow</h2>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-white transition-colors"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <nav className="mt-6 lg:mt-8">
              <div className="px-4 space-y-2">
                {[
                  { id: 'overview', label: 'Overview', icon: '📊' },
                  { id: 'orders', label: 'My Orders', icon: '📦' },
                  { id: 'cart', label: 'Cart', icon: '🛒' },
                  { id: 'favorites', label: 'Favorites', icon: '❤️' },
                  { id: 'profile', label: 'Profile', icon: '👤' }
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setSidebarOpen(false); // Close sidebar on mobile after selection
                    }}
                    className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-all duration-200 ${
                      activeTab === item.id
                        ? 'bg-gradient-to-r from-orange-100 to-amber-100 text-orange-800 border-r-4 border-orange-500 shadow-sm'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900 hover:shadow-sm'
                    }`}
                  >
                    <span className="mr-3">{item.icon}</span>
                    {item.label}
                  </button>
                ))}
              </div>
            </nav>
          </div>

          {/* Overlay for mobile */}
          {sidebarOpen && (
            <div 
              className="lg:hidden fixed inset-0 bg-opacity-20 backdrop-blur-sm z-20 transition-opacity duration-300 ease-in-out"
              onClick={() => setSidebarOpen(false)}
            />
          )}

          {/* Main Content */}
          <div className="flex-1">
            {renderContent()}
          </div>
        </div>
      </div>

      {/* Cancel Order Modal */}
      {cancelOrderModal.show && (
        <div className="fixed inset-0 bg-opacity-20 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Cancel Order</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to cancel order <strong>{cancelOrderModal.orderNumber}</strong>? 
              This action cannot be undone.
            </p>
            <div className="flex space-x-4">
              <button
                onClick={() => setCancelOrderModal({ show: false, orderId: null, orderNumber: '' })}
                className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors"
                disabled={loading}
              >
                No, Keep Order
              </button>
              <button
                onClick={handleCancelOrder}
                className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors"
                disabled={loading}
              >
                {loading ? 'Cancelling...' : 'Yes, Cancel Order'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Return Order Modal */}
      {returnOrderModal.show && (
        <div className="fixed inset-0 bg-opacity-20 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Return Order</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to return order <strong>{returnOrderModal.orderNumber}</strong>? 
              This will initiate a return request that will be reviewed by our team.
            </p>
            <div className="flex space-x-4">
              <button
                onClick={() => setReturnOrderModal({ show: false, orderId: null, orderNumber: '' })}
                className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors"
                disabled={loading}
              >
                No, Keep Order
              </button>
              <button
                onClick={confirmReturnOrder}
                className="flex-1 bg-orange-600 text-white py-2 px-4 rounded-lg hover:bg-orange-700 transition-colors"
                disabled={loading}
              >
                {loading ? 'Processing...' : 'Yes, Return Order'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerDashboard;