import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { cartService } from '../../services/cartService';

// async thunks for cart operations
export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async (cartData, { rejectWithValue }) => {
    try {
      const response = await cartService.addToCart(cartData);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add to cart');
    }
  }
);

export const getUserCart = createAsyncThunk(
  'cart/getUserCart',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await cartService.getUserCart(userId);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to get cart');
    }
  }
);

export const getCartSummary = createAsyncThunk(
  'cart/getCartSummary',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await cartService.getCartSummary(userId);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to get cart summary');
    }
  }
);

export const updateCartItem = createAsyncThunk(
  'cart/updateCartItem',
  async ({ cartItemId, cartData }, { rejectWithValue }) => {
    try {
      const response = await cartService.updateCartItem(cartItemId, cartData);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update cart item');
    }
  }
);

export const updateQuantity = createAsyncThunk(
  'cart/updateQuantity',
  async ({ cartItemId, quantity }, { rejectWithValue }) => {
    try {
      const response = await cartService.updateQuantity(cartItemId, quantity);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update quantity');
    }
  }
);

export const removeFromCart = createAsyncThunk(
  'cart/removeFromCart',
  async (cartItemId, { rejectWithValue }) => {
    try {
      const response = await cartService.removeFromCart(cartItemId);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to remove from cart');
    }
  }
);

export const clearUserCart = createAsyncThunk(
  'cart/clearUserCart',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await cartService.clearUserCart(userId);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to clear cart');
    }
  }
);

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    cartItems: [],
    cartSummary: null,
    isLoading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCart: (state) => {
      state.cartItems = [];
      state.cartSummary = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // add to cart
      .addCase(addToCart.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.isLoading = false;
        // check if item already exists and update quantity, or add new item
        const existingItemIndex = state.cartItems.findIndex(
          item => item.product_id === action.payload.product_id &&
                  item.color === action.payload.color &&
                  item.size === action.payload.size
        );
        if (existingItemIndex !== -1) {
          state.cartItems[existingItemIndex].qty += action.payload.qty;
        } else {
          state.cartItems.push(action.payload);
        }
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // get user cart
      .addCase(getUserCart.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getUserCart.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cartItems = action.payload;
      })
      .addCase(getUserCart.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // get cart summary
      .addCase(getCartSummary.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getCartSummary.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cartSummary = action.payload;
      })
      .addCase(getCartSummary.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // update cart item
      .addCase(updateCartItem.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateCartItem.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.cartItems.findIndex(item => item._id === action.payload._id);
        if (index !== -1) {
          state.cartItems[index] = action.payload;
        }
      })
      .addCase(updateCartItem.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // update quantity
      .addCase(updateQuantity.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateQuantity.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.cartItems.findIndex(item => item._id === action.payload._id);
        if (index !== -1) {
          state.cartItems[index].qty = action.payload.qty;
        }
      })
      .addCase(updateQuantity.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // remove from cart
      .addCase(removeFromCart.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cartItems = state.cartItems.filter(item => item._id !== action.payload._id);
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // clear user cart
      .addCase(clearUserCart.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(clearUserCart.fulfilled, (state) => {
        state.isLoading = false;
        state.cartItems = [];
        state.cartSummary = null;
      })
      .addCase(clearUserCart.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
