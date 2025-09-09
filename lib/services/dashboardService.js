import api from "../api";

// dashboard service functions
export const dashboardService = {
  // get dashboard statistics
  getDashboardStats: async () => {
    const response = await api.get('/dashboard/stats');
    return response.data.data;
  },

  // get revenue analytics
  getRevenueAnalytics: async (params = {}) => {
    const response = await api.get('/dashboard/revenue', { params });
    return response.data.data;
  },

  // get product analytics
  getProductAnalytics: async (params = {}) => {
    const response = await api.get('/dashboard/products', { params });
    return response.data.data;
  },

  // get customer analytics
  getCustomerAnalytics: async (params = {}) => {
    const response = await api.get('/dashboard/customers', { params });
    return response.data.data;
  },

  // get sales analytics
  getSalesAnalytics: async (params = {}) => {
    const response = await api.get('/dashboard/sales', { params });
    return response.data.data;
  },

  // get recent activities
  getRecentActivities: async (params = {}) => {
    const response = await api.get('/dashboard/activities', { params });
    return response.data.data;
  },
};
