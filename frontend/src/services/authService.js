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
      const endpoint = userType === 'admin' ? '/admin/auth/logout' : '/customer/auth/logout';
      
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
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

  // Forgot Password Methods
  async sendPasswordResetOTP(email) {
    try {
      const response = await fetch(`${API_BASE_URL}/customer/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        // Create error object that preserves response data
        const error = new Error(data.message || 'Failed to send OTP');
        error.response = { data };
        throw error;
      }

      return data;
    } catch (error) {
      // If error already has response data, preserve it
      if (error.response) {
        throw error;
      }
      // Otherwise create new error for network issues
      throw new Error(error.message || 'Network error while sending OTP');
    }
  }

  async verifyPasswordResetOTP(email, otp) {
    try {
      const response = await fetch(`${API_BASE_URL}/customer/auth/verify-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        // Create error object that preserves response data
        const error = new Error(data.message || 'OTP verification failed');
        error.response = { data };
        throw error;
      }

      return data;
    } catch (error) {
      // If error already has response data, preserve it
      if (error.response) {
        throw error;
      }
      // Otherwise create new error for network issues
      throw new Error(error.message || 'Network error during OTP verification');
    }
  }

  async resetPassword(email, resetToken, newPassword) {
    try {
      const response = await fetch(`${API_BASE_URL}/customer/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ resetToken, newPassword }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Password reset failed');
      }

      return data;
    } catch (error) {
      throw new Error(error.message || 'Network error during password reset');
    }
  }
}

export default new AuthService();