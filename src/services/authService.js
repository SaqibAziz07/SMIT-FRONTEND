import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Get token from localStorage
const token = localStorage.getItem('token');

// If token exists, add it to default headers
if (token) {
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

// Helper function to handle API errors
const handleError = (error) => {
  if (error.response) {
    // Server responded with error status
    return error.response.data?.message || 'Server error occurred';
  } else if (error.request) {
    // Request was made but no response
    return 'Network error - Unable to connect to server';
  } else {
    // Something else happened
    return error.message || 'An unexpected error occurred';
  }
};

export const authService = {
  /**
   * Register a new user
   * @param {string} name - User's full name
   * @param {string} email - User's email address
   * @param {string} password - User's password (min 6 characters)
   * @returns {Promise<{success: boolean, user?: object, error?: string}>}
   */
  register: async (name, email, password) => {
    try {
      const response = await api.post('/register', {
        name,
        email,
        password
      });
      
      if (response.data.success) {
        // Save token to localStorage
        localStorage.setItem('token', response.data.token);
        
        // Set default authorization header for future requests
        api.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
        
        return {
          success: true,
          user: response.data.user,
          token: response.data.token
        };
      }
      
      return {
        success: false,
        error: 'Registration failed'
      };
      
    } catch (error) {
      console.error('Registration error:', error);
      return {
        success: false,
        error: handleError(error)
      };
    }
  },

  /**
   * Login existing user
   * @param {string} email - User's email address
   * @param {string} password - User's password
   * @returns {Promise<{success: boolean, user?: object, error?: string}>}
   */
  login: async (email, password) => {
    try {
      const response = await api.post('/login', {
        email,
        password
      });
      
      if (response.data.success) {
        // Save token to localStorage
        localStorage.setItem('token', response.data.token);
        
        // Set default authorization header for future requests
        api.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
        
        return {
          success: true,
          user: response.data.user,
          token: response.data.token
        };
      }
      
      return {
        success: false,
        error: 'Login failed'
      };
      
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        error: handleError(error)
      };
    }
  },

  /**
   * Get current logged in user's information
   * @returns {Promise<{success: boolean, user?: object, error?: string}>}
   */
  getCurrentUser: async () => {
    try {
      const response = await api.get('/me');
      
      if (response.data.success) {
        return {
          success: true,
          user: response.data.data
        };
      }
      
      return {
        success: false,
        error: 'Failed to load user data'
      };
      
    } catch (error) {
      console.error('Get user error:', error);
      
      // If unauthorized, clear invalid token
      if (error.response?.status === 401) {
        authService.logout();
      }
      
      return {
        success: false,
        error: handleError(error)
      };
    }
  },

  /**
   * Logout user - clear token from localStorage and headers
   */
  logout: () => {
    // Remove token from localStorage
    localStorage.removeItem('token');
    
    // Remove authorization header from axios defaults
    delete api.defaults.headers.common['Authorization'];
    
    // Clear any user data from session storage if used
    sessionStorage.removeItem('user');
  },

  /**
   * Check if user is currently authenticated
   * @returns {boolean}
   */
  isAuthenticated: () => {
    const token = localStorage.getItem('token');
    return !!token && token !== 'undefined' && token !== 'null';
  },

  /**
   * Get the stored token
   * @returns {string|null}
   */
  getToken: () => {
    return localStorage.getItem('token');
  },

  /**
   * Set authorization header manually (useful after manual token set)
   * @param {string} token - JWT token
   */
  setAuthToken: (token) => {
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete api.defaults.headers.common['Authorization'];
    }
  },

  /**
   * Update user profile (if needed in future)
   * @param {object} userData - User data to update
   * @returns {Promise<{success: boolean, user?: object, error?: string}>}
   */
  updateProfile: async (userData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put('http://localhost:5000/api/users/profile', userData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        return {
          success: true,
          user: response.data.user
        };
      }
      
      return {
        success: false,
        error: 'Failed to update profile'
      };
      
    } catch (error) {
      console.error('Update profile error:', error);
      return {
        success: false,
        error: handleError(error)
      };
    }
  },

  /**
   * Change password
   * @param {string} currentPassword - Current password
   * @param {string} newPassword - New password
   * @returns {Promise<{success: boolean, error?: string}>}
   */
  changePassword: async (currentPassword, newPassword) => {
    try {
      const response = await api.post('/change-password', {
        currentPassword,
        newPassword
      });
      
      if (response.data.success) {
        return {
          success: true
        };
      }
      
      return {
        success: false,
        error: response.data.message || 'Failed to change password'
      };
      
    } catch (error) {
      console.error('Change password error:', error);
      return {
        success: false,
        error: handleError(error)
      };
    }
  }
};

// Export axios instance for direct use if needed
export { api };

// Default export
export default authService;