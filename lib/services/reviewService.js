import api from '../api';

// review service functions
export const reviewService = {
  // create new review
  createReview: async (reviewData) => {
    const response = await api.post('/reviews', reviewData);
    return response.data;
  },

  // get all reviews (admin)
  getAllReviews: async () => {
    const response = await api.get('/reviews');
    return response.data;
  },

  // get reviews by product
  getReviewsByProduct: async (productId) => {
    const response = await api.get(`/reviews/product/${productId}`);
    return response.data;
  },

  // get reviews by customer
  getReviewsByCustomer: async (customerId) => {
    const response = await api.get(`/reviews/customer/${customerId}`);
    return response.data;
  },

  // get review by id
  getReviewById: async (reviewId) => {
    const response = await api.get(`/reviews/${reviewId}`);
    return response.data;
  },

  // update review
  updateReview: async (reviewId, reviewData) => {
    const response = await api.put(`/reviews/${reviewId}`, reviewData);
    return response.data;
  },

  // delete review
  deleteReview: async (reviewId) => {
    const response = await api.delete(`/reviews/${reviewId}`);
    return response.data;
  }
};
