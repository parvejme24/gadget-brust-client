import api from '../api';

// wishlist service functions
export const wishlistService = {
  // add item to wishlist
  addToWishlist: async (wishlistData) => {
    const response = await api.post('/wishlist', wishlistData);
    return response.data;
  },

  // get all wishlists (admin)
  getAllWishlists: async () => {
    const response = await api.get('/wishlist');
    return response.data;
  },

  // get user's wishlist
  getUserWishlist: async (userId) => {
    const response = await api.get(`/wishlist/user/${userId}`);
    return response.data;
  },

  // check if item is in wishlist
  checkWishlistStatus: async (productId, customerEmail) => {
    const response = await api.get('/wishlist/check', {
      params: { productId, customerEmail }
    });
    return response.data;
  },

  // remove item from wishlist
  removeFromWishlist: async (wishlistItemId) => {
    const response = await api.delete(`/wishlist/${wishlistItemId}`);
    return response.data;
  },

  // clear user's wishlist
  clearWishlist: async (userId) => {
    const response = await api.delete(`/wishlist/${userId}/clear`);
    return response.data;
  }
};
