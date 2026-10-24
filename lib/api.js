import axios from "axios";
import { tokenStorage } from "./session/tokenStorage";
import { store } from "./store";
import { signedOut } from "./store/slices/authSlice";

const baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:6060/api";

// one axios client for the whole app
const api = axios.create({
  baseURL,
  timeout: 30000, // large image uploads
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = tokenStorage.getAccessToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  // let the browser set the multipart boundary
  if (config.data instanceof FormData) delete config.headers["Content-Type"];
  return config;
});

// refresh the 1-hour access token once, then retry the request
let refreshPromise = null;

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    const refreshToken = tokenStorage.getRefreshToken();

    if (error.response?.status === 401 && refreshToken && !original._retry && !original.url?.includes("/refresh")) {
      original._retry = true;
      try {
        // share one refresh call between parallel failing requests
        refreshPromise ||= axios.post(`${baseURL}/refresh`, { refreshToken }).finally(() => {
          refreshPromise = null;
        });
        const response = await refreshPromise;
        const accessToken = response.data?.data?.token;
        tokenStorage.setAccessToken(accessToken);
        original.headers.Authorization = `Bearer ${accessToken}`;
        return api(original);
      } catch {
        // refresh token expired: sign out everywhere, and send people on the dashboard to login
        tokenStorage.clear();
        store.dispatch(signedOut());
        const path = window.location.pathname;
        if (path.startsWith("/dashboard")) window.location.href = `/login?redirect=${encodeURIComponent(path)}`;
      }
    }
    return Promise.reject(error);
  }
);

export default api;
