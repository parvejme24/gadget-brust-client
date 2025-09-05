import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { categoryService } from '../../services/categoryService';

// async thunks for category operations
export const createCategory = createAsyncThunk(
  'categories/createCategory',
  async (categoryData, { rejectWithValue }) => {
    try {
      const response = await categoryService.createCategory(categoryData);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create category');
    }
  }
);

export const getAllCategories = createAsyncThunk(
  'categories/getAllCategories',
  async (_, { rejectWithValue }) => {
    try {
      const response = await categoryService.getAllCategories();
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to get categories');
    }
  }
);

export const getCategoryById = createAsyncThunk(
  'categories/getCategoryById',
  async (categoryId, { rejectWithValue }) => {
    try {
      const response = await categoryService.getCategoryById(categoryId);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to get category');
    }
  }
);

export const getCategorySubcategories = createAsyncThunk(
  'categories/getCategorySubcategories',
  async (categoryId, { rejectWithValue }) => {
    try {
      const response = await categoryService.getCategorySubcategoriesWithProductCounts(categoryId);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to get subcategories');
    }
  }
);

export const updateCategory = createAsyncThunk(
  'categories/updateCategory',
  async ({ categoryId, categoryData }, { rejectWithValue }) => {
    try {
      const response = await categoryService.updateCategory(categoryId, categoryData);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update category');
    }
  }
);

export const deleteCategory = createAsyncThunk(
  'categories/deleteCategory',
  async (categoryId, { rejectWithValue }) => {
    try {
      const response = await categoryService.deleteCategory(categoryId);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete category');
    }
  }
);

export const addSubcategory = createAsyncThunk(
  'categories/addSubcategory',
  async ({ categoryId, subcategoryName }, { rejectWithValue }) => {
    try {
      const response = await categoryService.addSubcategory(categoryId, subcategoryName);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add subcategory');
    }
  }
);

export const updateSubcategory = createAsyncThunk(
  'categories/updateSubcategory',
  async ({ categoryId, subcategoryData }, { rejectWithValue }) => {
    try {
      const response = await categoryService.updateSubcategory(categoryId, subcategoryData);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update subcategory');
    }
  }
);

export const deleteSubcategory = createAsyncThunk(
  'categories/deleteSubcategory',
  async ({ categoryId, subcategoryName }, { rejectWithValue }) => {
    try {
      const response = await categoryService.deleteSubcategory(categoryId, subcategoryName);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete subcategory');
    }
  }
);

const categorySlice = createSlice({
  name: 'categories',
  initialState: {
    categories: [],
    currentCategory: null,
    subcategories: [],
    isLoading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentCategory: (state) => {
      state.currentCategory = null;
    },
    clearSubcategories: (state) => {
      state.subcategories = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // create category
      .addCase(createCategory.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.categories.push(action.payload);
      })
      .addCase(createCategory.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // get all categories
      .addCase(getAllCategories.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllCategories.fulfilled, (state, action) => {
        state.isLoading = false;
        state.categories = action.payload;
      })
      .addCase(getAllCategories.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // get category by id
      .addCase(getCategoryById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getCategoryById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentCategory = action.payload;
      })
      .addCase(getCategoryById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // get category subcategories
      .addCase(getCategorySubcategories.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getCategorySubcategories.fulfilled, (state, action) => {
        state.isLoading = false;
        state.subcategories = action.payload;
      })
      .addCase(getCategorySubcategories.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // update category
      .addCase(updateCategory.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.categories.findIndex(category => category._id === action.payload._id);
        if (index !== -1) {
          state.categories[index] = action.payload;
        }
        if (state.currentCategory && state.currentCategory._id === action.payload._id) {
          state.currentCategory = action.payload;
        }
      })
      .addCase(updateCategory.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // delete category
      .addCase(deleteCategory.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.categories = state.categories.filter(category => category._id !== action.payload._id);
        if (state.currentCategory && state.currentCategory._id === action.payload._id) {
          state.currentCategory = null;
        }
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // add subcategory
      .addCase(addSubcategory.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addSubcategory.fulfilled, (state, action) => {
        state.isLoading = false;
        if (state.currentCategory) {
          state.currentCategory.subcategories.push(action.payload.subcategoryName);
        }
      })
      .addCase(addSubcategory.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // update subcategory
      .addCase(updateSubcategory.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateSubcategory.fulfilled, (state, action) => {
        state.isLoading = false;
        // update subcategory in current category
        if (state.currentCategory) {
          const index = state.currentCategory.subcategories.findIndex(
            sub => sub === action.payload.oldName
          );
          if (index !== -1) {
            state.currentCategory.subcategories[index] = action.payload.newName;
          }
        }
      })
      .addCase(updateSubcategory.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // delete subcategory
      .addCase(deleteSubcategory.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteSubcategory.fulfilled, (state, action) => {
        state.isLoading = false;
        if (state.currentCategory) {
          state.currentCategory.subcategories = state.currentCategory.subcategories.filter(
            sub => sub !== action.payload.subcategoryName
          );
        }
      })
      .addCase(deleteSubcategory.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearCurrentCategory, clearSubcategories } = categorySlice.actions;
export default categorySlice.reducer;
