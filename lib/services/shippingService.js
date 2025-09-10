import api from "../api";

export const shippingService = {
  // Get all shipping methods
  getAllShipping: async (params = {}) => {
    const response = await api.get("/shipping", { params });
    return response.data;
  },

  // Get shipping method by ID
  getShippingById: async (id) => {
    const response = await api.get(`/shipping/${id}`);
    return response.data;
  },

  // Create new shipping method
  createShipping: async (shippingData) => {
    const response = await api.post("/shipping", shippingData);
    return response.data;
  },

  // Update shipping method
  updateShipping: async (id, shippingData) => {
    const response = await api.put(`/shipping/${id}`, shippingData);
    return response.data;
  },

  // Delete shipping method
  deleteShipping: async (id) => {
    const response = await api.delete(`/shipping/${id}`);
    return response.data;
  },

  // Toggle shipping status
  toggleShippingStatus: async (id) => {
    const response = await api.patch(`/shipping/${id}/toggle-status`);
    return response.data;
  },

  // Calculate shipping charge
  calculateShippingCharge: async (calculationData) => {
    const response = await api.post("/shipping/calculate", calculationData);
    return response.data;
  },
};
