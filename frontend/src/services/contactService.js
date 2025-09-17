const API_BASE_URL = `${import.meta.env.VITE_BACKEND_URL || 'http://localhost:8827'}/api`;

class ContactService {
  // Get all contact submissions (Admin only)
  async getAllContacts(params = {}, token) {
    try {
      const queryParams = new URLSearchParams();
      
      if (params.page) queryParams.append('page', params.page);
      if (params.limit) queryParams.append('limit', params.limit);
      if (params.status) queryParams.append('status', params.status);
      if (params.search) queryParams.append('search', params.search);

      const url = `${API_BASE_URL}/contact${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch contacts');
      }

      return data;
    } catch (error) {
      throw new Error(error.message || 'Network error during contact fetch');
    }
  }

  // Get contact by ID (Admin only)
  async getContactById(contactId, token) {
    try {
      const response = await fetch(`${API_BASE_URL}/contact/${contactId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch contact');
      }

      return data;
    } catch (error) {
      throw new Error(error.message || 'Network error during contact fetch');
    }
  }

  // Update contact status (Admin only)
  async updateContactStatus(contactId, status, adminNotes, token) {
    try {
      const response = await fetch(`${API_BASE_URL}/contact/${contactId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ status, adminNotes }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to update contact status');
      }

      return data;
    } catch (error) {
      throw new Error(error.message || 'Network error during contact update');
    }
  }

  // Delete contact (Admin only)
  async deleteContact(contactId, token) {
    try {
      const response = await fetch(`${API_BASE_URL}/contact/${contactId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to delete contact');
      }

      return data;
    } catch (error) {
      throw new Error(error.message || 'Network error during contact deletion');
    }
  }

  // Submit contact form (Public)
  async submitContactForm(contactData) {
    try {
      const response = await fetch(`${API_BASE_URL}/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(contactData),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to submit contact form');
      }

      return data;
    } catch (error) {
      throw new Error(error.message || 'Network error during contact form submission');
    }
  }
}

export default new ContactService();