import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { brandService } from '../../services/brandService';

// async thunks for brand operations
export const createBrand = createAsyncThunk(
  'brands/createBrand',
  async (brandData, { rejectWithValue }) => {
    try {
      const response = await brandService.createBrand(brandData);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create brand');
    }
  }
);

export const getAllBrands = createAsyncThunk(
  'brands/getAllBrands',
  async (_, { rejectWithValue }) => {
    try {
      const response = await brandService.getAllBrands();
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to get brands');
    }
  }
);

export const getBrandById = createAsyncThunk(
  'brands/getBrandById',
  async (brandId, { rejectWithValue }) => {
    try {
      const response = await brandService.getBrandById(brandId);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to get brand');
    }
  }
);

export const updateBrand = createAsyncThunk(
  'brands/updateBrand',
  async ({ brandId, brandData }, { rejectWithValue }) => {
    try {
      const response = await brandService.updateBrand(brandId, brandData);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update brand');
    }
  }
);

export const deleteBrand = createAsyncThunk(
  'brands/deleteBrand',
  async (brandId, { rejectWithValue }) => {
    try {
      const response = await brandService.deleteBrand(brandId);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete brand');
    }
  }
);

const brandSlice = createSlice({
  name: 'brands',
  initialState: {
    brands: [],
    currentBrand: null,
    isLoading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentBrand: (state) => {
      state.currentBrand = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // create brand
      .addCase(createBrand.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createBrand.fulfilled, (state, action) => {
        state.isLoading = false;
        state.brands.push(action.payload);
      })
      .addCase(createBrand.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // get all brands
      .addCase(getAllBrands.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllBrands.fulfilled, (state, action) => {
        state.isLoading = false;
        state.brands = action.payload;
      })
      .addCase(getAllBrands.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // get brand by id
      .addCase(getBrandById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getBrandById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentBrand = action.payload;
      })
      .addCase(getBrandById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // update brand
      .addCase(updateBrand.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateBrand.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.brands.findIndex(brand => brand._id === action.payload._id);
        if (index !== -1) {
          state.brands[index] = action.payload;
        }
        if (state.currentBrand && state.currentBrand._id === action.payload._id) {
          state.currentBrand = action.payload;
        }
      })
      .addCase(updateBrand.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // delete brand
      .addCase(deleteBrand.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteBrand.fulfilled, (state, action) => {
        state.isLoading = false;
        state.brands = state.brands.filter(brand => brand._id !== action.payload._id);
        if (state.currentBrand && state.currentBrand._id === action.payload._id) {
          state.currentBrand = null;
        }
      })
      .addCase(deleteBrand.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearCurrentBrand } = brandSlice.actions;
export default brandSlice.reducer;
