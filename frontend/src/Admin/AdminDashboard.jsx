import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../contexts/AuthContext';
import productService from '../services/productService';
import customerService from '../services/customerService';
import orderService from '../services/orderService';
import adminStatsService from '../services/adminStatsService';
import contactService from '../services/contactService';
import { getImageUrl } from '../utils/imageUtils';
import NotificationSection from '../components/NotificationSection';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { logout, token, user } = useAuth();
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [statsLoading, setStatsLoading] = useState(false);
  const [contactsLoading, setContactsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [adminStats, setAdminStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalCustomers: 0,
    totalRevenue: 0,
    changes: {
      productChange: '+0%',
      orderChange: '+0%',
      customerChange: '+0%',
      revenueChange: '+0%'
    }
  });
  const [editingProduct, setEditingProduct] = useState(null);
  const [editForm, setEditForm] = useState({
    name: '',
    description: '',
    price: '',
    quantity: '',
    category: 'candles',
    images: [],
    newImages: []
  });
  const [deleteConfirmation, setDeleteConfirmation] = useState({
    show: false,
    productId: null,
    productName: ''
  });

  // Add Product Form State
  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    price: '',
    quantity: '',
    category: 'candles',
    images: []
  });

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  // Fetch products from API
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await productService.getAllProducts({ limit: 50 });
      setProducts(response.data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Error fetching products: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch customers from API
  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const response = await customerService.getAllCustomers({ limit: 50 }, token);
      setCustomers(response.data || []);
    } catch (error) {
      console.error('Error fetching customers:', error);
      toast.error('Error fetching customers: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch orders from API
  const fetchOrders = async () => {
    try {
      setOrdersLoading(true);
      const response = await orderService.getAllOrders(1, 20, statusFilter, searchTerm);
      setOrders(response.orders || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Error fetching orders: ' + error.message);
    } finally {
      setOrdersLoading(false);
    }
  };

  // Fetch contacts from API
  const fetchContacts = async () => {
    try {
      setContactsLoading(true);
      const response = await contactService.getAllContacts({ limit: 50 }, token);
      setContacts(response.data?.contacts || []);
    } catch (error) {
      console.error('Error fetching contacts:', error);
      toast.error('Error fetching contacts: ' + error.message);
    } finally {
      setContactsLoading(false);
    }
  };

  // Fetch admin statistics
  const fetchAdminStats = async () => {
    try {
      setStatsLoading(true);
      const response = await adminStatsService.getAdminStats(token);
      if (response.success) {
        setAdminStats(response.data);
      }
    } catch (error) {
      console.error('Error fetching admin stats:', error);
      toast.error('Error fetching statistics: ' + error.message);
    } finally {
      setStatsLoading(false);
    }
  };

  // Toggle customer status
  const toggleCustomerStatus = async (customerId, newStatus) => {
    try {
      await customerService.updateCustomerStatus(customerId, newStatus, token);
      toast.success(`Customer ${newStatus ? 'activated' : 'deactivated'} successfully!`);
      // Refresh customers list
      fetchCustomers();
    } catch (error) {
      toast.error('Error updating customer status: ' + error.message);
    }
  };

  // Update order status
  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await orderService.updateOrderStatus(orderId, newStatus, token);
      toast.success(`Order status updated to ${newStatus} successfully!`);
      // Refresh orders list
      fetchOrders();
    } catch (error) {
      toast.error('Error updating order status: ' + error.message);
    }
  };

  // Update contact status
  const updateContactStatus = async (contactId, newStatus) => {
    try {
      await contactService.updateContactStatus(contactId, newStatus, '', token);
      toast.success(`Contact status updated to ${newStatus} successfully!`);
      // Refresh contacts list
      fetchContacts();
    } catch (error) {
      toast.error('Error updating contact status: ' + error.message);
    }
  };

  // Start editing a product
  const startEditProduct = (product) => {
    setEditingProduct(product._id);
    setEditForm({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      quantity: product.quantity.toString(),
      category: product.category,
      images: product.images || [],
      newImages: []
    });
    setActiveTab('edit-product');
  };

  // Cancel editing
  const cancelEdit = () => {
    setEditingProduct(null);
    setActiveTab('products');
    setEditForm({
      name: '',
      description: '',
      price: '',
      quantity: '',
      category: 'candles',
      images: [],
      newImages: []
    });
  };

  // Update product
  const updateProduct = async (productId) => {
    try {
      setLoading(true);
      
      let finalImageUrls = [...editForm.images]; // Start with existing images
      
      // If new files were selected, upload them and add to the list
      if (editForm.newImages.length > 0) {
        const uploadResponse = await productService.uploadImages(editForm.newImages, token);
        finalImageUrls = [...finalImageUrls, ...uploadResponse.data.images];
      }
      
      // Ensure at least one image exists
      if (finalImageUrls.length === 0) {
        toast.error('Product must have at least one image');
        return;
      }
      
      const productData = {
        name: editForm.name,
        description: editForm.description,
        price: parseFloat(editForm.price),
        quantity: parseInt(editForm.quantity),
        category: editForm.category,
        images: finalImageUrls
      };
      
      await productService.updateProduct(productId, productData, token);
      toast.success('Product updated successfully!');
      cancelEdit();
      fetchProducts();
    } catch (error) {
      toast.error('Error updating product: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Delete product
  const showDeleteConfirmation = (product) => {
    setDeleteConfirmation({
      show: true,
      productId: product._id,
      productName: product.name
    });
  };

  const hideDeleteConfirmation = () => {
    setDeleteConfirmation({
      show: false,
      productId: null,
      productName: ''
    });
  };

  const confirmDeleteProduct = async () => {
    try {
      setLoading(true);
      await productService.deleteProduct(deleteConfirmation.productId, token);
      hideDeleteConfirmation();
      fetchProducts();
      // Show success message
      toast.success('Product deleted successfully!');
    } catch (error) {
      toast.error('Error deleting product: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle edit form image change
  const handleEditImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length < 1) {
      return;
    }
    
    setEditForm(prev => ({ ...prev, newImages: [...prev.newImages, ...files] }));
    // Clear the file input
    e.target.value = '';
  };

  // Remove existing image
  const removeExistingImage = (indexToRemove) => {
    setEditForm(prev => ({
      ...prev,
      images: prev.images.filter((_, index) => index !== indexToRemove)
    }));
  };

  // Remove new image
  const removeNewImage = (indexToRemove) => {
    setEditForm(prev => ({
      ...prev,
      newImages: prev.newImages.filter((_, index) => index !== indexToRemove)
    }));
  };

  // Fetch data when component mounts or when switching tabs
  useEffect(() => {
    if (activeTab === 'overview') {
      fetchAdminStats();
    } else if (activeTab === 'products') {
      fetchProducts();
    } else if (activeTab === 'customers') {
      fetchCustomers();
    } else if (activeTab === 'orders') {
      fetchOrders();
    } else if (activeTab === 'contacts') {
      fetchContacts();
    }
  }, [activeTab]);

  // Refetch orders when search term or status filter changes
  useEffect(() => {
    if (activeTab === 'orders') {
      fetchOrders();
    }
  }, [searchTerm, statusFilter]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length < 1) {
      toast.warning('Please select at least 1 image');
      return;
    }
    setProductForm(prev => ({ ...prev, images: files }));
  };

  // Remove image from product form
  const removeProductImage = (indexToRemove) => {
    setProductForm(prev => ({
      ...prev,
      images: prev.images.filter((_, index) => index !== indexToRemove)
    }));
  };

  // Clear all images from product form
  const clearAllProductImages = () => {
    setProductForm(prev => ({ ...prev, images: [] }));
    // Reset file input
    const fileInput = document.querySelector('input[type="file"]');
    if (fileInput) fileInput.value = '';
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    if (productForm.images.length < 1) {
      toast.warning('Please select at least 1 image');
      return;
    }
    
    setLoading(true);
    try {
      // Upload images first
      const uploadResponse = await productService.uploadImages(productForm.images, token);
      const imageUrls = uploadResponse.data.images;
      
      const productData = {
        name: productForm.name,
        description: productForm.description,
        price: parseFloat(productForm.price),
        quantity: parseInt(productForm.quantity),
        category: productForm.category,
        images: imageUrls
      };
      
      await productService.createProduct(productData, token);
      toast.success('Product added successfully!');
      setProductForm({ name: '', description: '', price: '', quantity: '', category: 'candles', images: [] });
      
      // Reset file input
      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput) fileInput.value = '';
      
      // Refresh products list if on products tab
      if (activeTab === 'products') {
        fetchProducts();
      }
    } catch (error) {
      toast.error('Error adding product: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    { 
      title: 'Total Products', 
      value: statsLoading ? 'Loading...' : adminStats.totalProducts.toLocaleString(), 
      change: adminStats.changes.productChange, 
      color: 'text-green-600' 
    },
    { 
      title: 'Total Customers', 
      value: statsLoading ? 'Loading...' : adminStats.totalCustomers.toLocaleString(), 
      change: adminStats.changes.customerChange, 
      color: 'text-green-600' 
    },
    { 
      title: 'Total Orders', 
      value: statsLoading ? 'Loading...' : adminStats.totalOrders.toLocaleString(), 
      change: adminStats.changes.orderChange, 
      color: 'text-green-600' 
    },
    { 
      title: 'Revenue', 
      value: statsLoading ? 'Loading...' : `₹${adminStats.totalRevenue.toLocaleString()}`, 
      change: adminStats.changes.revenueChange, 
      color: 'text-green-600' 
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'Processing': return 'bg-yellow-100 text-yellow-800';
      case 'Shipped': return 'bg-blue-100 text-blue-800';
      case 'Pending': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <div key={index} className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                      <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    </div>
                    <div className={`text-sm font-medium ${stat.color}`}>
                      {stat.change}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Notification Section */}
            <NotificationSection userId={user?._id} userType="Admin" />

          </div>
        );

      case 'products':
        return (
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-medium text-gray-900">Products: {products.length}</h3>
              <button 
                onClick={() => setActiveTab('add-product')}
                className="bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors"
              >
                Add New Product
              </button>
            </div>
            
            {loading ? (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
                <span className="ml-2 text-gray-600">Loading products...</span>
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-600">No products found. Add your first product!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4">
                {products.map((product) => (
                  <div key={product._id} className="bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 border border-amber-200 rounded-xl p-4 shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-105">
                    {/* Product Image */}
                    <div className="mb-3">
                      <div className="w-full h-100 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
                        {product.images && product.images.length > 0 ? (
                          <img 
                            className="w-full h-full object-cover" 
                            src={getImageUrl(product.images[0])} 
                            alt={product.name}
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'flex';
                            }}
                          />
                        ) : null}
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center" style={{display: product.images && product.images.length > 0 ? 'none' : 'flex'}}>
                          <span className="text-gray-500 text-sm">📷 No Image</span>
                        </div>
                      </div>
                    </div>

                    {/* Product Info */}
                    <div className="mb-3">
                      <div className="flex items-start justify-between mb-1">
                        <h4 className="font-semibold text-gray-900 text-sm leading-tight flex-1 mr-1">
                          {product.name}
                        </h4>
                        <span className="inline-flex px-1.5 py-0.5 text-xs font-medium rounded-full bg-amber-100 text-amber-800 capitalize whitespace-nowrap">
                          {product.category}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                        {product.description}
                      </p>
                    </div>

                    {/* Price and Quantity */}
                    <div className="mb-3">
                      <div className="bg-white rounded-lg p-2 border border-amber-200 shadow-sm">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">Price</p>
                            <p className="text-lg font-bold text-amber-600">₹{product.price?.toFixed(2)}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">Stock</p>
                            <p className="text-sm font-semibold text-gray-800">{product.quantity}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-1">
                      <button 
                        onClick={() => startEditProduct(product)}
                        className="flex-1 bg-amber-600 hover:bg-amber-700 text-white py-1.5 px-2 rounded-lg transition-colors text-xs font-medium flex items-center justify-center space-x-1"
                      >
                        <span>✏️</span>
                        <span>Edit</span>
                      </button>
                      <button 
                        onClick={() => showDeleteConfirmation(product)}
                        className="flex-1 bg-red-500 hover:bg-red-600 text-white py-1.5 px-2 rounded-lg transition-colors text-xs font-medium flex items-center justify-center space-x-1"
                      >
                        <span>🗑️</span>
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case 'add-product':
        return (
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center mb-6">
              <h3 className="text-lg font-medium text-gray-900">Add New Product</h3>
            </div>
            
            <form onSubmit={handleProductSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Name *
                </label>
                <input
                  type="text"
                  required
                  value={productForm.name}
                  onChange={(e) => setProductForm(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="Enter product name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  required
                  rows={4}
                  value={productForm.description}
                  onChange={(e) => setProductForm(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="Enter product description"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price (₹) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    value={productForm.price}
                    onChange={(e) => setProductForm(prev => ({ ...prev, price: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quantity *
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={productForm.quantity}
                    onChange={(e) => setProductForm(prev => ({ ...prev, quantity: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    required
                    value={productForm.category}
                    onChange={(e) => setProductForm(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  >
                    <option value="candles">Candles</option>
                    <option value="aromatherapy">Aromatherapy</option>
                    <option value="gift-sets">Gift Sets</option>
                    <option value="accessories">Accessories</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Images * (Select at least 1 image)
                </label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
                
                {/* Image Previews */}
                {productForm.images.length > 0 && (
                  <div className="mt-4">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="text-sm font-medium text-gray-700">
                        Selected Images ({productForm.images.length}):
                      </h4>
                      <button
                        type="button"
                        onClick={clearAllProductImages}
                        className="text-xs text-red-600 hover:text-red-800 underline"
                      >
                        Clear All
                      </button>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {productForm.images.map((file, index) => (
                        <div key={index} className="relative group w-50 h-50">
                          <div className="aspect-square w-full">
                            <img
                              src={URL.createObjectURL(file)}
                              alt={`Preview ${index + 1}`}
                              className="w-full h-full object-cover rounded-lg border border-gray-300"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => removeProductImage(index)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 transition-colors shadow-lg"
                            title="Remove image"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setActiveTab('products')}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Adding Product...
                    </>
                  ) : (
                    'Add Product'
                  )}
                </button>
              </div>
            </form>
          </div>
        );

      case 'edit-product':
        return (
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center mb-6">
              <button 
                onClick={cancelEdit}
                className="mr-4 text-gray-600 hover:text-gray-800"
              >
                ← Back to Products
              </button>
              <h3 className="text-lg font-medium text-gray-900">Edit Product</h3>
            </div>
            
            <form onSubmit={(e) => { e.preventDefault(); updateProduct(editingProduct); }} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Name *
                </label>
                <input
                  type="text"
                  required
                  value={editForm.name}
                  onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="Enter product name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  required
                  rows={4}
                  value={editForm.description}
                  onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="Enter product description"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price ($) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    value={editForm.price}
                    onChange={(e) => setEditForm(prev => ({ ...prev, price: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quantity *
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={editForm.quantity}
                    onChange={(e) => setEditForm(prev => ({ ...prev, quantity: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    required
                    value={editForm.category}
                    onChange={(e) => setEditForm(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  >
                    <option value="candles">Candles</option>
                    <option value="aromatherapy">Aromatherapy</option>
                    <option value="gift-sets">Gift Sets</option>
                    <option value="accessories">Accessories</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Images
                </label>
                
                {/* Current Images Preview */}
                {editForm.images.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Current Images:</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {editForm.images.map((imageUrl, index) => (
                        <div key={`existing-${index}`} className="relative group w-50 h-50">
                          <img
                            src={getImageUrl(imageUrl)}
                            alt={`Product ${index + 1}`}
                            className="w-full h-full object-cover rounded-lg border border-gray-300"
                          />
                          <button
                            type="button"
                            onClick={() => removeExistingImage(index)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* New Images Preview */}
                {editForm.newImages.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">New Images to Add:</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {editForm.newImages.map((file, index) => (
                        <div key={`new-${index}`} className="relative group w-50 h-50">
                          <img
                            src={URL.createObjectURL(file)}
                            alt={`New ${index + 1}`}
                            className="w-full h-full object-cover rounded-lg border border-gray-300"
                          />
                          <button
                            type="button"
                            onClick={() => removeNewImage(index)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Add New Images */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Add More Images:
                  </label>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleEditImageChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                </div>
                
                <div className="mt-2 text-sm text-gray-600">
                  Total images: {editForm.images.length + editForm.newImages.length}
                  {editForm.images.length + editForm.newImages.length === 0 && (
                    <span className="text-red-600 ml-2">⚠ Product must have at least one image</span>
                  )}
                </div>
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Updating Product...
                    </>
                  ) : (
                    'Update Product'
                  )}
                </button>
              </div>
            </form>
          </div>
        );

      case 'orders':
        return (
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-medium text-gray-900">Orders: {orders.length}</h3>
            </div>
            
            {/* Search and Filter Controls */}
            <div className="mb-6 flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search by Order ID or Customer Name
                </label>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Enter order ID or customer name..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
              </div>
              <div className="w-full sm:w-48">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Filter by Status
                </label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                >
                  <option value="all">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="refunded">Refunded</option>
                  <option value="return">Return</option>
                </select>
              </div>
            </div>
            
            {ordersLoading ? (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No orders found</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
                {orders.map((order) => (
                  <div key={order._id} className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-105 p-6">
                    {/* Order Header */}
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                          🎫 {order.orderNumber}
                        </h4>
                        <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                          🕔 {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-green-600">
                          ₹{order.totalAmount?.toFixed(2) || '0.00'}
                        </p>
                      </div>
                    </div>

                    {/* Customer Info */}
                    <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                      <h5 className="text-sm font-medium text-gray-700 mb-2">Customer Details</h5>
                      <div className="space-y-1">
                        <p className="text-sm text-gray-900 flex items-center gap-2">
                          🙋🏼 {order.customerName || `${order.customer?.firstName || ''} ${order.customer?.lastName || ''}`.trim() || 'N/A'}
                        </p>
                        <p className="text-sm text-gray-700 flex items-center gap-2">
                          📞 <a href={`tel:${order.customerPhone || order.customer?.phone}`} className="hover:text-blue-600">
                            {order.customerPhone || order.customer?.phone || 'N/A'}
                          </a>
                        </p>
                        <p className="text-sm text-gray-700 flex items-center gap-2">
                          📬 <a href={`mailto:${order.customerEmail || order.customer?.email}`} className="hover:text-blue-600">
                            {order.customerEmail || order.customer?.email || 'N/A'}
                          </a>
                        </p>
                        <div className="text-sm text-gray-700">
                          {order.customer?.address ? (
                            <div className="flex items-start gap-2">
                              <span>📍</span>
                              <div>
                                <div>{order.customer.address.street || 'N/A'}</div>
                                <div>{order.customer.address.city || 'N/A'}, {order.customer.address.state || 'N/A'}, {order.customer.address.zipCode || 'N/A'}, {order.customer.address.country || 'N/A'}</div>
                              </div>
                            </div>
                          ) : (
                            <div className="text-gray-500 flex items-center gap-2">📍 No address available</div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Items */}
                    <div className="mb-4 p-3 bg-amber-50 rounded-lg">
                      <h5 className="text-sm font-medium text-gray-700 mb-2">Order Items</h5>
                      <div className="space-y-2">
                        {order.items?.slice(0, 3).map((item, index) => (
                          <div key={index} className="flex justify-between items-center text-sm">
                            <span className="text-gray-900 truncate flex-1 mr-2">{item.name}</span>
                            <span className="text-gray-700 font-medium bg-white px-2 py-1 rounded">x{item.quantity}</span>
                          </div>
                        ))}
                        {order.items?.length > 3 && (
                          <div className="text-gray-500 text-center text-sm bg-white px-2 py-1 rounded">
                            +{order.items.length - 3} more items
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Payment Info */}
                    <div className="mb-4 p-3 bg-purple-50 rounded-lg">
                      <p className="text-sm text-gray-900">
                        <span className="font-medium">Payment ID:</span> {order.razorpayPaymentId || 'N/A'}
                      </p>
                    </div>

                    {/* Status and Actions */}
                    <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                      <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
                        order.status === 'completed' ? 'bg-green-100 text-green-800' :
                        order.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                        order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                        order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                        order.status === 'refunded' ? 'bg-purple-100 text-purple-800' :
                        order.status === 'return' ? 'bg-orange-100 text-orange-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {order.status?.charAt(0).toUpperCase() + order.status?.slice(1) || 'Unknown'}
                      </span>
                      <select
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                        className="text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white shadow-sm hover:shadow-md transition-shadow"
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                        <option value="refunded">Refunded</option>
                      </select>
                    </div>
                  </div>
                ))}
              </div>
             )}
           </div>
         );

      case 'customers':
        return (
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-medium text-gray-900">Customers: {customers.length}</h3>
            </div>
            
            {loading ? (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
                <span className="ml-2 text-gray-600">Loading customers...</span>
              </div>
            ) : customers.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-600">No customers found.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4">
                {customers.map((customer) => (
                  <div key={customer._id} className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 border border-blue-200 rounded-xl p-4 shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-105">
                    {/* Customer Profile */}
                    <div className="mb-3">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center space-x-2">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                            {customer.firstName?.charAt(0)?.toUpperCase()}{customer.lastName?.charAt(0)?.toUpperCase()}
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900 text-sm leading-tight mb-1">
                              {customer.firstName} {customer.lastName}
                            </h4>
                            <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${
                              customer.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {customer.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Contact Information */}
                    <div className="">
                      <div className="rounded-lg p-3">
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <span className="text-blue-600">📬</span>
                            <a href={`mailto:${customer.email}`} className="text-xs text-gray-700 hover:text-blue-600 transition-colors truncate">
                              {customer.email}
                            </a>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-green-600">📞</span>
                            <a href={`https://api.whatsapp.com/send?phone=${customer.phone}`} target='_blank' className="text-xs text-gray-700 hover:text-green-600 transition-colors">
                              {customer.phone || 'N/A'}
                            </a>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-purple-600">📅</span>
                            <span className="text-xs text-gray-600">
                              {new Date(customer.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Address Information */}
                    <div className="mb-3">
                      <div className="rounded-lg p-3">
                        <div className="flex items-start space-x-2">
                          <span className="text-orange-600 mt-0.5">📍</span>
                          <div className="text-xs text-gray-700 leading-relaxed">
                            <div>{customer.address?.street || 'N/A'}</div>
                            <div>{customer.address?.city || 'N/A'} - {customer.address?.zipCode || 'N/A'}, {customer.address?.state || 'N/A'}, {customer.address?.country || 'N/A'}</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Action Button */}
                    <div>
                      <button 
                        onClick={() => toggleCustomerStatus(customer._id, !customer.isActive)}
                        className={`w-full py-2 px-3 rounded-lg transition-all duration-300 text-xs font-medium flex items-center justify-center space-x-2 ${
                          customer.isActive 
                            ? 'bg-red-500 hover:bg-red-600 text-white shadow-sm hover:shadow-md' 
                            : 'bg-green-500 hover:bg-green-600 text-white shadow-sm hover:shadow-md'
                        }`}
                      >
                        <span>{customer.isActive ? '🔒' : '🔓'}</span>
                        <span>{customer.isActive ? 'Deactivate' : 'Activate'}</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case 'contacts':
        return (
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-medium text-gray-900">Contact Submissions: {contacts.length}</h3>
            </div>
            
            {contactsLoading ? (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
                <span className="ml-2 text-gray-600">Loading contacts...</span>
              </div>
            ) : contacts.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-600">No contact submissions found.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4">
                {contacts.map((contact) => (
                  <div key={contact._id} className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-4 border border-blue-200 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                    
                    {/* Contact Info Section */}
                    <div className="mb-3">
                      <div className="rounded-lg p-3">
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <span className="text-blue-600">🙋🏼</span>
                            <span className="text-sm font-medium text-gray-900 truncate">{contact.name}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-green-600">📬</span>
                            <a href={`mailto:${contact.email}`} className="text-xs text-gray-700 hover:text-blue-600 transition-colors truncate">
                              {contact.email}
                            </a>
                          </div>
                          {contact.phone && (
                            <div className="flex items-center space-x-2">
                              <span className="text-orange-600">📞</span>
                              <a href={`https://api.whatsapp.com/send?phone=${contact.phone}`} target='_blank' className="text-xs text-gray-700 hover:text-green-600 transition-colors">
                                {contact.phone}
                              </a>
                            </div>
                          )}
                          <div className="flex items-center space-x-2">
                            <span className="text-purple-600">🕔</span>
                            <span className="text-xs text-gray-600">
                              {new Date(contact.createdAt).toLocaleDateString()} - {new Date(contact.createdAt).toLocaleTimeString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Message Section */}
                    <div className="mb-3">
                      <div className="bg-white rounded-lg p-3 border border-blue-200 shadow-sm">
                        <div className="space-y-2">
                          <div className="flex items-start space-x-2">
                            <span className="text-amber-600 mt-0.5">🔖</span>
                            <div className="flex-1">
                              <div className="text-xs font-medium text-gray-900 mb-1">
                                {contact.subject || 'No Subject'}
                              </div>
                              <div className="text-xs text-gray-700 leading-relaxed line-clamp-3">
                                {contact.message}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Status and Action Section */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500 font-medium">Status:</span>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          contact.status === 'resolved' ? 'bg-green-100 text-green-800' :
                          contact.status === 'replied' ? 'bg-blue-100 text-blue-800' :
                          contact.status === 'read' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {contact.status || 'new'}
                        </span>
                      </div>
                      
                      <select
                        value={contact.status || 'new'}
                        onChange={(e) => updateContactStatus(contact._id, e.target.value)}
                        className="w-full text-xs border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white shadow-sm hover:shadow-md transition-all duration-200"
                      >
                        <option value="new">New</option>
                        <option value="read">Read</option>
                        <option value="replied">Replied</option>
                        <option value="resolved">Resolved</option>
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            )}
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
        <div className="w-full px-4 sm:px-6 lg:px-8">
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
              <span className="text-2xl mr-3">🕯️</span>
              <h1 className="text-2xl font-bold text-gray-900">SoftGlow</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">{user?.firstName || 'Admin'}</span>
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex">
          {/* Sidebar */}
          <div className={`${sidebarOpen ? 'fixed inset-y-0 left-0 transform translate-x-0 ' : 'fixed inset-y-0 left-0 transform -translate-x-full'} lg:relative lg:translate-x-0 lg:block w-64 bg-white lg:rounded-lg shadow-lg lg:mr-8 z-30 lg:z-auto transition-transform duration-300 ease-in-out`}>
            {/* Mobile header with close button */}
            <div className="lg:hidden flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-amber-50 to-orange-50">
              <h2 className="text-lg font-semibold text-gray-900">🕯️ SoftGlow</h2>
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
                  { id: 'products', label: 'Products', icon: '🕯️' },
                  { id: 'add-product', label: 'Add Product', icon: '➕' },
                  { id: 'orders', label: 'Orders', icon: '📦' },
                  { id: 'customers', label: 'Customers', icon: '👥' },
                  { id: 'contacts', label: 'Contacts', icon: '📧' }
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setSidebarOpen(false); // Close sidebar on mobile after selection
                    }}
                    className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-all duration-200 ${
                      activeTab === item.id
                        ? 'bg-gradient-to-r from-amber-100 to-orange-100 text-amber-800 border-r-4 border-amber-500 shadow-sm'
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

      {/* Delete Confirmation Modal */}
      {deleteConfirmation.show && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-opacity-20 backdrop-blur-sm">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
            <div className="flex items-center mb-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">Delete Product</h3>
                <p className="text-sm text-gray-500">This action cannot be undone.</p>
              </div>
            </div>
            
            <div className="mb-6">
              <p className="text-gray-700">
                Are you sure you want to delete <span className="font-semibold">"{deleteConfirmation.productName}"</span>? This will permanently remove the product from your inventory.
              </p>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={hideDeleteConfirmation}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteProduct}
                disabled={loading}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Deleting...
                  </>
                ) : (
                  'Delete Product'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;