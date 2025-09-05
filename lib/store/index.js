import { configureStore } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';
import brandSlice from './slices/brandSlice';
import categorySlice from './slices/categorySlice';
import productSlice from './slices/productSlice';
import cartSlice from './slices/cartSlice';
import reviewSlice from './slices/reviewSlice';
import wishlistSlice from './slices/wishlistSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    brands: brandSlice,
    categories: categorySlice,
    products: productSlice,
    cart: cartSlice,
    reviews: reviewSlice,
    wishlist: wishlistSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});
