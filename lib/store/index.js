import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import shopReducer from "./slices/shopSlice";

// Client-only global state. Server data (products, orders, …) lives in TanStack Query.
export const store = configureStore({
  reducer: {
    auth: authReducer,
    shop: shopReducer,
  },
});
