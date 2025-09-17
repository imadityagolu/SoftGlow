const API_BASE_URL = `${import.meta.env.VITE_BACKEND_URL || 'http://localhost:8827'}/api`;

class FeedbackService {
  // Create feedback for a product in an order
  async createFeedback(feedbackData) {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/feedback/customer/create`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(feedbackData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error creating feedback:', error);
      throw error;
    }
  }

  // Get feedback for a specific order
  async getFeedbackByOrder(orderId) {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/feedback/customer/order/${orderId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching feedback by order:', error);
      throw error;
    }
  }

  // Get feedback for a specific product (public)
  async getFeedbackByProduct(productId, page = 1, limit = 10) {
    try {
      const response = await fetch(`${API_BASE_URL}/feedback/product/${productId}?page=${page}&limit=${limit}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching feedback by product:', error);
      throw error;
    }
  }

  // Admin: Get all feedback
  async getAllFeedback(page = 1, limit = 20, status = 'all', search = '') {
    try {
      const token = localStorage.getItem('token');
      let url = `${API_BASE_URL}/feedback/admin/all?page=${page}&limit=${limit}`;
      if (status !== 'all') {
        url += `&status=${status}`;
      }
      if (search.trim()) {
        url += `&search=${encodeURIComponent(search.trim())}`;
      }
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching all feedback:', error);
      throw error;
    }
  }

  // Admin: Update feedback status
  async updateFeedbackStatus(feedbackId, statusData) {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/feedback/admin/${feedbackId}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(statusData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error updating feedback status:', error);
      throw error;
    }
  }

  // Upload feedback image
  async uploadFeedbackImage(imageFile) {
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('image', imageFile);
      
      const response = await fetch(`${API_BASE_URL}/upload/feedback-image`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error uploading feedback image:', error);
      throw error;
    }
  }
}

export default new FeedbackService();