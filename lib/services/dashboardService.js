import api from "../api";

// Import JSON data files
import revenueAnalytics from "../data/revenue-analytics.json";
import paymentMethods from "../data/payment-methods.json";
import salesAnalytics from "../data/sales-analytics.json";

// Generate fake data for dashboard
const generateFakeData = () => {
  // Generate recent activities
  const activities = [
    { id: 1, type: 'order', message: 'New order #1234 received', time: '2 minutes ago', status: 'success' },
    { id: 2, type: 'product', message: 'Product "iPhone 15 Pro" added', time: '15 minutes ago', status: 'info' },
    { id: 3, type: 'customer', message: 'New customer registered', time: '1 hour ago', status: 'success' },
    { id: 4, type: 'order', message: 'Order #1233 completed', time: '2 hours ago', status: 'success' },
    { id: 5, type: 'product', message: 'Product "Samsung Galaxy S24" updated', time: '3 hours ago', status: 'info' },
    { id: 6, type: 'order', message: 'Order #1232 cancelled', time: '4 hours ago', status: 'warning' },
    { id: 7, type: 'customer', message: 'Customer profile updated', time: '5 hours ago', status: 'info' },
    { id: 8, type: 'product', message: 'Low stock alert for "MacBook Pro"', time: '6 hours ago', status: 'warning' },
    { id: 9, type: 'order', message: 'Order #1231 shipped', time: '8 hours ago', status: 'success' },
    { id: 10, type: 'product', message: 'New category "Smart Home" added', time: '1 day ago', status: 'info' }
  ];

  return {
    activities
  };
};

// dashboard service functions
export const dashboardService = {
  // get dashboard statistics
  getDashboardStats: async () => {
    try {
      const response = await api.get('/dashboard/stats');
      return response.data.data;
    } catch (error) {
      console.log('Dashboard API not available, using fake data...');
      // Return fake data if API fails
      const fakeData = generateFakeData();
      const currentMonth = fakeData.monthlyRevenue[fakeData.monthlyRevenue.length - 1];
      const previousMonth = fakeData.monthlyRevenue[fakeData.monthlyRevenue.length - 2];
      
      return {
        revenue: {
          total: 850000,
          thisMonth: currentMonth.revenue,
          today: Math.round(currentMonth.revenue / 30),
          growth: Math.round(((currentMonth.revenue - previousMonth.revenue) / previousMonth.revenue) * 100)
        },
        orders: {
          total: 1250,
          thisMonth: currentMonth.orders,
          today: Math.round(currentMonth.orders / 30),
          completed: 1100,
          pending: 120,
          cancelled: 30
        },
        customers: {
          total: 850,
          newThisMonth: currentMonth.customers,
          newToday: Math.round(currentMonth.customers / 30)
        },
        products: {
          total: 150,
          categories: 8,
          brands: 25,
          lowStock: 12,
          outOfStock: 3
        }
      };
    }
  },

  // get revenue analytics
  getRevenueAnalytics: async (params = {}) => {
    try {
      const response = await api.get('/dashboard/revenue', { params });
      return response.data.data;
    } catch (error) {
      console.log('Revenue API not available, using JSON data...');
      return {
        monthly: revenueAnalytics.monthly,
        quarterly: revenueAnalytics.quarterly,
        yearly: revenueAnalytics.yearly,
        daily: revenueAnalytics.daily,
        trends: revenueAnalytics.trends
      };
    }
  },

  // get product analytics
  getProductAnalytics: async (params = {}) => {
    try {
      const response = await api.get('/dashboard/products', { params });
      return response.data.data;
    } catch (error) {
      console.log('Product analytics API not available, using fake data...');
      return {
        categories: 8,
        brands: 25,
        totalProducts: 150,
        lowStock: 12,
        outOfStock: 3
      };
    }
  },

  // get customer analytics
  getCustomerAnalytics: async (params = {}) => {
    try {
      const response = await api.get('/dashboard/customers', { params });
      return response.data.data;
    } catch (error) {
      console.log('Customer analytics API not available, using fake data...');
      return {
        totalCustomers: 850,
        newCustomers: 45,
        returningCustomers: 805,
        averageOrderValue: 680
      };
    }
  },

  // get sales analytics
  getSalesAnalytics: async (params = {}) => {
    try {
      const response = await api.get('/dashboard/sales', { params });
      return response.data.data;
    } catch (error) {
      console.log('Sales analytics API not available, using JSON data...');
      return {
        byCategory: salesAnalytics.byCategory,
        monthlySales: salesAnalytics.monthlySales,
        trends: salesAnalytics.trends,
        statistics: salesAnalytics.statistics
      };
    }
  },

  // get recent activities
  getRecentActivities: async (params = {}) => {
    try {
      const response = await api.get('/dashboard/activities', { params });
      return response.data.data;
    } catch (error) {
      console.log('Activities API not available, using fake data...');
      const fakeData = generateFakeData();
      const limit = params.limit || 10;
      return fakeData.activities.slice(0, limit);
    }
  },
};
