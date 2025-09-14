import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || `${import.meta.env.VITE_BACKEND_URL || 'http://localhost:8827'}/api`;

// Create axios instance with interceptors
const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const favoriteService = {
  // Add product to favorites
  addToFavorites: async (productId) => {
    try {
      const response = await api.post('/favorites', { productId });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Remove product from favorites
  removeFromFavorites: async (productId) => {
    try {
      const response = await api.delete(`/favorites/${productId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get user's favorites
  getUserFavorites: async (page = 1, limit = 20) => {
    try {
      const response = await api.get(`/favorites?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Check if product is in user's favorites
  checkFavoriteStatus: async (productId) => {
    try {
      const response = await api.get(`/favorites/check/${productId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get favorite count for a product (public)
  getFavoriteCount: async (productId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/favorites/count/${productId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};

export default favoriteService;