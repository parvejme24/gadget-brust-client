import api from "../api";

// customer service functions
export const customerService = {
  // get all customers/users
  getAllCustomers: async (params = {}) => {
    const response = await api.get('/users', { params });
    return {
      data: response.data.data.users || response.data.data,
      pagination: response.data.data.pagination || null
    };
  },

  // get customer by id
  getCustomerById: async (customerId) => {
    const response = await api.get(`/users/${customerId}`);
    return response.data.data.user || response.data.data;
  },

  // update customer
  updateCustomer: async (customerId, customerData) => {
    const response = await api.put(`/users/${customerId}`, customerData);
    return response.data;
  },

  // delete customer
  deleteCustomer: async (customerId) => {
    const response = await api.delete(`/users/${customerId}`);
    return response.data;
  },

  // update customer role
  updateCustomerRole: async (customerId, role) => {
    const response = await api.put(`/users/${customerId}/role`, { role });
    return response.data;
  },

  // get customer by email
  getCustomerByEmail: async (email) => {
    const response = await api.get(`/users/email/${email}`);
    return response.data.data.user || response.data.data;
  },
};
