import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../contexts/AuthContext';
import productService from '../services/productService';
import customerService from '../services/customerService';
import orderService from '../services/orderService';
import adminStatsService from '../services/adminStatsService';
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
  const [loading, setLoading] = useState(false);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [statsLoading, setStatsLoading] = useState(false);
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
    images: []
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
      const response = await orderService.getAllOrders(token);
      setOrders(response.orders || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Error fetching orders: ' + error.message);
    } finally {
      setOrdersLoading(false);
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

  // Start editing a product
  const startEditProduct = (product) => {
    setEditingProduct(product._id);
    setEditForm({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      quantity: product.quantity.toString(),
      category: product.category,
      images: product.images || []
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
      images: []
    });
  };

  // Update product
  const updateProduct = async (productId) => {
    try {
      setLoading(true);
      
      let imageUrls = editForm.images;
      
      // If new files were selected, upload them
      if (editForm.images.length > 0 && editForm.images[0] instanceof File) {
        const uploadResponse = await productService.uploadImages(editForm.images, token);
        imageUrls = uploadResponse.data.images;
      }
      
      const productData = {
        name: editForm.name,
        description: editForm.description,
        price: parseFloat(editForm.price),
        quantity: parseInt(editForm.quantity),
        category: editForm.category,
        images: imageUrls
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
      toast.warning('Please select at least 1 image');
      return;
    }
    
    setEditForm(prev => ({ ...prev, images: files }));
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
    }
  }, [activeTab]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length < 1) {
      toast.warning('Please select at least 1 image');
      return;
    }
    setProductForm(prev => ({ ...prev, images: files }));
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
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {products.map((product) => (
                      <tr key={product._id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              {product.images && product.images.length > 0 ? (
                                <img className="h-10 w-10 rounded-full object-cover" src={getImageUrl(product.images[0])} alt={product.name} />
                              ) : (
                                <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                                  <span className="text-gray-600 text-xs">No Image</span>
                                </div>
                              )}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{product.name}</div>
                              <div className="text-sm text-gray-500">{product.description?.substring(0, 50)}...</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="capitalize text-sm text-gray-900">{product.category}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          ₹{product.price?.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {product.quantity}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            product.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {product.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button 
                            onClick={() => startEditProduct(product)}
                            className="text-amber-600 hover:text-amber-900 mr-3"
                          >
                            Edit
                          </button>
                          <button 
                            onClick={() => showDeleteConfirmation(product)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
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
                {productForm.images.length > 0 && (
                  <div className="mt-2 text-sm text-gray-600">
                    {productForm.images.length} image(s) selected
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
                  Product Images (Select new images to replace current ones)
                </label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleEditImageChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
                <div className="mt-2 text-sm text-gray-600">
                  Current images: {editForm.images.length} image(s)
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
              <h3 className="text-lg font-medium text-gray-900">Order: {orders.length}</h3>
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
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {orders.map((order) => (
                      <tr key={order._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {order.orderNumber}
                          <br/>
                          {new Date(order.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{order.customerName || `${order.customer?.firstName || ''} ${order.customer?.lastName || ''}`.trim() || 'N/A'}</div>
                          <div className="text-sm text-gray-900">{order.customerPhone || order.customer?.phone || 'N/A'}</div>
                          <div className="text-sm text-gray-500">{order.customerEmail || order.customer?.email || 'N/A'}</div>
                          <div className="text-sm text-gray-900">
                            {order.customer?.address ? (
                              <>
                                <div>{order.customer.address.street || 'N/A'}</div>
                                <div>{order.customer.address.city || 'N/A'}, {order.customer.address.state || 'N/A'}</div>
                                <div>{order.customer.address.zipCode || 'N/A'}, {order.customer.address.country || 'N/A'}</div>
                              </>
                            ) : (
                              <div className="text-gray-500">No address available</div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-xs text-gray-500">
                            {order.items?.slice(0, 2).map(item => item.name).join(', ')}
                            {order.items?.length > 2 && '...'}
                          </div>
                          <div className="text-sm text-gray-900">
                            x {order.items?.length || 0}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          ₹{order.totalAmount?.toFixed(2) || '0.00'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            order.status === 'completed' ? 'bg-green-100 text-green-800' :
                            order.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                            order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                            order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {order.status?.charAt(0).toUpperCase() + order.status?.slice(1) || 'Unknown'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <select
                            value={order.status}
                            onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                            className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          >
                            <option value="pending">Pending</option>
                            <option value="processing">Processing</option>
                            <option value="shipped">Shipped</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
             )}
           </div>
         );

      case 'customers':
        return (
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-medium text-gray-900">Customer: {customers.length}</h3>
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
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {customers.map((customer) => (
                      <tr key={customer._id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="">
                              <div className="text-sm font-medium text-gray-900">
                                {customer.firstName} {customer.lastName}
                                <br/>
                                {customer.email}
                                <br/>
                                {customer.phone || 'N/A'}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {customer.address?.street || 'N/A'}
                          <br/>
                          {customer.address?.city || 'N/A'}, {customer.address?.state || 'N/A'}-{customer.address?.zipCode || 'N/A'}
                          <br/>
                          {customer.address?.country || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(customer.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            customer.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {customer.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button 
                            onClick={() => toggleCustomerStatus(customer._id, !customer.isActive)}
                            className={`${customer.isActive ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'}`}
                          >
                            {customer.isActive ? 'Deactivate' : 'Activate'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
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
              <span className="text-2xl mr-3">🕯️</span>
              <h1 className="text-2xl font-bold text-gray-900">SoftGlow Admin</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">Welcome, {user?.firstName || 'Admin'}</span>
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex">
          {/* Sidebar */}
          <div className={`${sidebarOpen ? 'fixed inset-y-0 left-0 transform translate-x-0' : 'fixed inset-y-0 left-0 transform -translate-x-full'} lg:relative lg:translate-x-0 lg:block w-64 bg-white lg:rounded-lg shadow-lg lg:mr-8 z-30 lg:z-auto transition-transform duration-300 ease-in-out`}>
            {/* Mobile header with close button */}
            <div className="lg:hidden flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-amber-50 to-orange-50">
              <h2 className="text-lg font-semibold text-gray-900">SoftGlow Admin</h2>
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
                  { id: 'customers', label: 'Customers', icon: '👥' }
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
              className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-20 transition-opacity duration-300 ease-in-out"
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
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