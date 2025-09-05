import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { wishlistService } from '../../services/wishlistService';

// async thunks for wishlist operations
export const addToWishlist = createAsyncThunk(
  'wishlist/addToWishlist',
  async (wishlistData, { rejectWithValue }) => {
    try {
      const response = await wishlistService.addToWishlist(wishlistData);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add to wishlist');
    }
  }
);

export const getAllWishlists = createAsyncThunk(
  'wishlist/getAllWishlists',
  async (_, { rejectWithValue }) => {
    try {
      const response = await wishlistService.getAllWishlists();
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to get wishlists');
    }
  }
);

export const getUserWishlist = createAsyncThunk(
  'wishlist/getUserWishlist',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await wishlistService.getUserWishlist(userId);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to get user wishlist');
    }
  }
);

export const checkWishlistStatus = createAsyncThunk(
  'wishlist/checkWishlistStatus',
  async ({ productId, customerEmail }, { rejectWithValue }) => {
    try {
      const response = await wishlistService.checkWishlistStatus(productId, customerEmail);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to check wishlist status');
    }
  }
);

export const removeFromWishlist = createAsyncThunk(
  'wishlist/removeFromWishlist',
  async (wishlistItemId, { rejectWithValue }) => {
    try {
      const response = await wishlistService.removeFromWishlist(wishlistItemId);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to remove from wishlist');
    }
  }
);

export const clearWishlist = createAsyncThunk(
  'wishlist/clearWishlist',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await wishlistService.clearWishlist(userId);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to clear wishlist');
    }
  }
);

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: {
    wishlistItems: [],
    wishlistStatus: null,
    isLoading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearWishlistItems: (state) => {
      state.wishlistItems = [];
    },
    clearWishlistStatus: (state) => {
      state.wishlistStatus = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // add to wishlist
      .addCase(addToWishlist.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addToWishlist.fulfilled, (state, action) => {
        state.isLoading = false;
        state.wishlistItems.push(action.payload);
      })
      .addCase(addToWishlist.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // get all wishlists
      .addCase(getAllWishlists.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllWishlists.fulfilled, (state, action) => {
        state.isLoading = false;
        state.wishlistItems = action.payload;
      })
      .addCase(getAllWishlists.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // get user wishlist
      .addCase(getUserWishlist.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getUserWishlist.fulfilled, (state, action) => {
        state.isLoading = false;
        state.wishlistItems = action.payload;
      })
      .addCase(getUserWishlist.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // check wishlist status
      .addCase(checkWishlistStatus.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(checkWishlistStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        state.wishlistStatus = action.payload;
      })
      .addCase(checkWishlistStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // remove from wishlist
      .addCase(removeFromWishlist.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(removeFromWishlist.fulfilled, (state, action) => {
        state.isLoading = false;
        state.wishlistItems = state.wishlistItems.filter(item => item._id !== action.payload._id);
      })
      .addCase(removeFromWishlist.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // clear wishlist
      .addCase(clearWishlist.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(clearWishlist.fulfilled, (state) => {
        state.isLoading = false;
        state.wishlistItems = [];
      })
      .addCase(clearWishlist.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearWishlistItems, clearWishlistStatus } = wishlistSlice.actions;
export default wishlistSlice.reducer;
