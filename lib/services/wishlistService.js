import api from '../api';

export const wishlistService = {
  // Add product to wishlist
  addToWishlist: async (wishlistData) => {
    try {
      const response = await api.post('/wishlist', wishlistData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get all wishlists (admin)
  getAllWishlists: async (params = {}) => {
    try {
      const response = await api.get('/wishlist', { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get user's wishlist
  getUserWishlist: async (userId) => {
    try {
      const response = await api.get(`/wishlist/user/${userId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Check if product is in wishlist
  checkWishlistStatus: async (productId, customerEmail) => {
    try {
      const response = await api.get('/wishlist/check', {
        params: {
          productID: productId,
          customerEmail: customerEmail,
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Remove product from wishlist
  removeFromWishlist: async (wishlistId) => {
    try {
      const response = await api.delete(`/wishlist/${wishlistId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Clear user's entire wishlist
  clearWishlist: async (userId) => {
    try {
      const response = await api.delete(`/wishlist/${userId}/clear`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get wishlist by customer email (for public users)
  getWishlistByEmail: async (customerEmail) => {
    try {
      console.log('Fetching wishlist for email:', customerEmail);
      const response = await api.get('/wishlist', {
        params: { customerEmail },
      });
      console.log('Wishlist API response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Wishlist API error:', error);
      throw error;
    }
  },

  // Get wishlist by customer ID (for public users)
  getWishlistByCustomerId: async (customerId) => {
    try {
      const response = await api.get(`/wishlist/user/${customerId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Helper methods for different parameter formats
  addToWishlistWithParams: async (productId, customerEmail) => {
    try {
      const response = await api.post('/wishlist', {
        productID: productId,
        customerEmail: customerEmail,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};