import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { reviewService } from '../../services/reviewService';

// async thunks for review operations
export const createReview = createAsyncThunk(
  'reviews/createReview',
  async (reviewData, { rejectWithValue }) => {
    try {
      const response = await reviewService.createReview(reviewData);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create review');
    }
  }
);

export const getAllReviews = createAsyncThunk(
  'reviews/getAllReviews',
  async (_, { rejectWithValue }) => {
    try {
      const response = await reviewService.getAllReviews();
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to get reviews');
    }
  }
);

export const getReviewsByProduct = createAsyncThunk(
  'reviews/getReviewsByProduct',
  async (productId, { rejectWithValue }) => {
    try {
      const response = await reviewService.getReviewsByProduct(productId);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to get product reviews');
    }
  }
);

export const getReviewsByCustomer = createAsyncThunk(
  'reviews/getReviewsByCustomer',
  async (customerId, { rejectWithValue }) => {
    try {
      const response = await reviewService.getReviewsByCustomer(customerId);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to get customer reviews');
    }
  }
);

export const getReviewById = createAsyncThunk(
  'reviews/getReviewById',
  async (reviewId, { rejectWithValue }) => {
    try {
      const response = await reviewService.getReviewById(reviewId);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to get review');
    }
  }
);

export const updateReview = createAsyncThunk(
  'reviews/updateReview',
  async ({ reviewId, reviewData }, { rejectWithValue }) => {
    try {
      const response = await reviewService.updateReview(reviewId, reviewData);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update review');
    }
  }
);

export const deleteReview = createAsyncThunk(
  'reviews/deleteReview',
  async (reviewId, { rejectWithValue }) => {
    try {
      const response = await reviewService.deleteReview(reviewId);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete review');
    }
  }
);

const reviewSlice = createSlice({
  name: 'reviews',
  initialState: {
    reviews: [],
    productReviews: [],
    customerReviews: [],
    currentReview: null,
    isLoading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentReview: (state) => {
      state.currentReview = null;
    },
    clearProductReviews: (state) => {
      state.productReviews = [];
    },
    clearCustomerReviews: (state) => {
      state.customerReviews = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // create review
      .addCase(createReview.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createReview.fulfilled, (state, action) => {
        state.isLoading = false;
        state.reviews.push(action.payload);
      })
      .addCase(createReview.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // get all reviews
      .addCase(getAllReviews.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllReviews.fulfilled, (state, action) => {
        state.isLoading = false;
        state.reviews = action.payload;
      })
      .addCase(getAllReviews.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // get reviews by product
      .addCase(getReviewsByProduct.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getReviewsByProduct.fulfilled, (state, action) => {
        state.isLoading = false;
        state.productReviews = action.payload;
      })
      .addCase(getReviewsByProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // get reviews by customer
      .addCase(getReviewsByCustomer.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getReviewsByCustomer.fulfilled, (state, action) => {
        state.isLoading = false;
        state.customerReviews = action.payload;
      })
      .addCase(getReviewsByCustomer.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // get review by id
      .addCase(getReviewById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getReviewById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentReview = action.payload;
      })
      .addCase(getReviewById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // update review
      .addCase(updateReview.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateReview.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.reviews.findIndex(review => review._id === action.payload._id);
        if (index !== -1) {
          state.reviews[index] = action.payload;
        }
        if (state.currentReview && state.currentReview._id === action.payload._id) {
          state.currentReview = action.payload;
        }
      })
      .addCase(updateReview.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // delete review
      .addCase(deleteReview.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteReview.fulfilled, (state, action) => {
        state.isLoading = false;
        state.reviews = state.reviews.filter(review => review._id !== action.payload._id);
        if (state.currentReview && state.currentReview._id === action.payload._id) {
          state.currentReview = null;
        }
      })
      .addCase(deleteReview.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearCurrentReview, clearProductReviews, clearCustomerReviews } = reviewSlice.actions;
export default reviewSlice.reducer;
