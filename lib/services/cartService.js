import api from '../api';

// cart service functions
export const cartService = {
  // add item to cart
  addToCart: async (cartData) => {
    const response = await api.post('/cart', cartData);
    return response.data;
  },

  // get all carts (admin)
  getAllCarts: async () => {
    const response = await api.get('/cart');
    return response.data;
  },

  // get user's cart
  getUserCart: async (userId) => {
    const response = await api.get(`/cart/user/${userId}`);
    return response.data;
  },

  // get cart summary for user
  getCartSummary: async (userId) => {
    const response = await api.get(`/cart/user/${userId}/summary`);
    return response.data;
  },

  // get cart item by id
  getCartItemById: async (cartItemId) => {
    const response = await api.get(`/cart/${cartItemId}`);
    return response.data;
  },

  // update cart item
  updateCartItem: async (cartItemId, cartData) => {
    const response = await api.put(`/cart/${cartItemId}`, cartData);
    return response.data;
  },

  // update cart item quantity
  updateQuantity: async (cartItemId, quantity) => {
    const response = await api.patch(`/cart/${cartItemId}/quantity`, { qty: quantity });
    return response.data;
  },

  // remove item from cart
  removeFromCart: async (cartItemId) => {
    const response = await api.delete(`/cart/${cartItemId}`);
    return response.data;
  },

  // clear user's cart
  clearUserCart: async (userId) => {
    const response = await api.delete(`/cart/user/${userId}/clear`);
    return response.data;
  }
};
