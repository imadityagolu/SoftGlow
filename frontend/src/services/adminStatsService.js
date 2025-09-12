const API_BASE_URL = 'http://localhost:8827/api';

class AdminStatsService {
  // Get admin dashboard statistics
  async getAdminStats(token) {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/stats`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch admin statistics');
      }

      return data;
    } catch (error) {
      throw new Error(error.message || 'Network error during admin stats fetch');
    }
  }
}

export default new AdminStatsService();