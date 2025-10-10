import api from "../api";
import paymentMethods from "../data/payment-methods.json";

// Payment service functions
export const paymentService = {
  // get payment methods analytics
  getPaymentMethods: async (params = {}) => {
    try {
      const response = await api.get('/dashboard/payment-methods', { params });
      return response.data.data;
    } catch (error) {
      console.log('Payment methods API not available, using JSON data...');
      return {
        paymentMethods: paymentMethods.paymentMethods,
        monthlyBreakdown: paymentMethods.monthlyBreakdown,
        trends: paymentMethods.trends,
        statistics: paymentMethods.statistics
      };
    }
  },

  // get payment method trends
  getPaymentTrends: async (params = {}) => {
    try {
      const response = await api.get('/dashboard/payment-trends', { params });
      return response.data.data;
    } catch (error) {
      console.log('Payment trends API not available, using JSON data...');
      return {
        trends: paymentMethods.trends,
        monthlyBreakdown: paymentMethods.monthlyBreakdown
      };
    }
  }
};
