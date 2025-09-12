const API_BASE_URL = `${import.meta.env.VITE_BACKEND_URL || 'http://localhost:8827'}/api`;

class AuthService {
  // Admin Authentication
  async adminSignup(userData) {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Admin signup failed');
      }

      return data;
    } catch (error) {
      throw new Error(error.message || 'Network error during admin signup');
    }
  }

  async adminLogin(credentials) {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Admin login failed');
      }

      return data;
    } catch (error) {
      throw new Error(error.message || 'Network error during admin login');
    }
  }

  // Customer Authentication
  async customerSignup(userData) {
    try {
      const response = await fetch(`${API_BASE_URL}/customer/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Customer signup failed');
      }

      return data;
    } catch (error) {
      throw new Error(error.message || 'Network error during customer signup');
    }
  }

  async customerLogin(credentials) {
    try {
      const response = await fetch(`${API_BASE_URL}/customer/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Customer login failed');
      }

      return data;
    } catch (error) {
      throw new Error(error.message || 'Network error during customer login');
    }
  }

  // Get Admin Profile
  async getAdminProfile(token) {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/auth/profile`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to get admin profile');
      }

      return data;
    } catch (error) {
      throw new Error(error.message || 'Network error getting admin profile');
    }
  }

  // Get Customer Profile
  async getCustomerProfile(token) {
    try {
      const response = await fetch(`${API_BASE_URL}/customer/auth/profile`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to get customer profile');
      }

      return data;
    } catch (error) {
      throw new Error(error.message || 'Network error getting customer profile');
    }
  }

  // Logout (both admin and customer)
  async logout(token, userType) {
    try {
      const endpoint = userType === 'admin' ? 'admin' : 'customer';
      const response = await fetch(`${API_BASE_URL}/${endpoint}/auth/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Logout failed');
      }

      return data;
    } catch (error) {
      throw new Error(error.message || 'Network error during logout');
    }
  }
}

export default new AuthService();