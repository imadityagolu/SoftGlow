const API_BASE_URL = `${import.meta.env.VITE_BACKEND_URL || 'http://localhost:8827'}/api`;

class ProductService {
  // Upload images to server
  async uploadImages(files, token) {
    try {
      const formData = new FormData();
      
      // Append all files to FormData
      for (let i = 0; i < files.length; i++) {
        formData.append('images', files[i]);
      }

      const response = await fetch(`${API_BASE_URL}/upload/images`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to upload images');
      }

      return data;
    } catch (error) {
      throw new Error(error.message || 'Network error during image upload');
    }
  }
  // Create a new product (Admin only)
  async createProduct(productData, token) {
    try {
      const response = await fetch(`${API_BASE_URL}/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(productData),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to create product');
      }

      return data;
    } catch (error) {
      throw new Error(error.message || 'Network error during product creation');
    }
  }

  // Get all products with pagination and filters
  async getAllProducts(params = {}) {
    try {
      const queryParams = new URLSearchParams();
      
      if (params.page) queryParams.append('page', params.page);
      if (params.limit) queryParams.append('limit', params.limit);
      if (params.category) queryParams.append('category', params.category);
      if (params.search) queryParams.append('search', params.search);
      if (params.sortBy) queryParams.append('sortBy', params.sortBy);
      if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder);

      const url = `${API_BASE_URL}/products${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch products');
      }

      return data;
    } catch (error) {
      throw new Error(error.message || 'Network error during product fetch');
    }
  }

  // Get a single product by ID
  async getProductById(productId) {
    try {
      const response = await fetch(`${API_BASE_URL}/products/${productId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch product');
      }

      return data;
    } catch (error) {
      throw new Error(error.message || 'Network error during product fetch');
    }
  }

  // Update a product (Admin only)
  async updateProduct(productId, productData, token) {
    try {
      const response = await fetch(`${API_BASE_URL}/products/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(productData),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to update product');
      }

      return data;
    } catch (error) {
      throw new Error(error.message || 'Network error during product update');
    }
  }

  // Delete a product (Admin only)
  async deleteProduct(productId, token) {
    try {
      const response = await fetch(`${API_BASE_URL}/products/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to delete product');
      }

      return data;
    } catch (error) {
      throw new Error(error.message || 'Network error during product deletion');
    }
  }

  // Get products by category
  async getProductsByCategory(category, params = {}) {
    try {
      const queryParams = new URLSearchParams();
      
      if (params.page) queryParams.append('page', params.page);
      if (params.limit) queryParams.append('limit', params.limit);
      if (params.search) queryParams.append('search', params.search);
      if (params.sortBy) queryParams.append('sortBy', params.sortBy);
      if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder);

      const url = `${API_BASE_URL}/products/category/${category}${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch products by category');
      }

      return data;
    } catch (error) {
      throw new Error(error.message || 'Network error during category products fetch');
    }
  }
}

export default new ProductService();