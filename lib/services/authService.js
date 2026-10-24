import api from "../api";

const body = (promise) => promise.then((res) => res.data);

// sign-in endpoints; profile and user management are in accountService / adminService
export const authService = {
  register: (data) => body(api.post("/register", data)),
  login: (credentials) => body(api.post("/login", credentials)),
  logout: () => body(api.post("/logout")),
};
