import api from "../api";

// auth service functions
export const authService = {
  // register new user
  register: async (userData) => {
    const response = await api.post("/register", userData);
    return response.data;
  },

  // login user
  login: async (credentials) => {
    const response = await api.post("/login", credentials);
    return response.data;
  },

  // logout user
  logout: async () => {
    const response = await api.post("/logout");
    return response.data;
  },

  // get user profile
  getProfile: async () => {
    const response = await api.get("/profile");
    return response.data;
  },

  // update user profile
  updateProfile: async (profileData) => {
    const response = await api.put("/profile", profileData);
    return response.data;
  },

  // change password
  changePassword: async (passwordData) => {
    const response = await api.put("/change-password", passwordData);
    return response.data;
  },

  // delete user profile
  deleteProfile: async () => {
    const response = await api.delete("/profile");
    return response.data;
  },

  // admin: create user
  createUser: async (userData) => {
    const response = await api.post("/users", userData);
    return response.data;
  },

  // admin: get all users
  getAllUsers: async () => {
    const response = await api.get("/users");
    return response.data;
  },

  // admin: get user by id
  getUserById: async (userId) => {
    const response = await api.get(`/users/${userId}`);
    return response.data;
  },

  // admin: get user by email
  getUserByEmail: async (email) => {
    const response = await api.get(`/users/email/${email}`);
    return response.data;
  },

  // admin: update user
  updateUser: async (userId, userData) => {
    const response = await api.put(`/users/${userId}`, userData);
    return response.data;
  },

  // admin: update user role
  updateUserRole: async (userId, role) => {
    const response = await api.put(`/users/${userId}/role`, { role });
    return response.data;
  },

  // admin: delete user
  deleteUser: async (userId) => {
    const response = await api.delete(`/users/${userId}`);
    return response.data;
  },
};
