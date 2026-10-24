import api from "../api";

const body = (promise) => promise.then((res) => res.data);

// sign-in endpoints; profile and user management are in accountService / adminService
export const authService = {
  register: (data) => body(api.post("/register", data)),
  login: (credentials) => body(api.post("/login", credentials)),
  forgotPassword: (email) => body(api.post("/forgot-password", { email })),
  resetPassword: (data) => body(api.post("/reset-password", data)),
  // revokes the refresh token on the server
  logout: (refreshToken) => body(api.post("/logout", { refreshToken })),
};
