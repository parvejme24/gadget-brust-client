import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { productService } from '../../services/productService';

// async thunks for product operations
export const createProduct = createAsyncThunk(
  'products/createProduct',
  async (productData, { rejectWithValue }) => {
    try {
      const response = await productService.createProduct(productData);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create product');
    }
  }
);

export const getAllProducts = createAsyncThunk(
  'products/getAllProducts',
  async (params, { rejectWithValue }) => {
    try {
      const response = await productService.getAllProducts(params);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to get products');
    }
  }
);

export const getSliderProducts = createAsyncThunk(
  'products/getSliderProducts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await productService.getSliderProducts();
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to get slider products');
    }
  }
);

export const getDiscountedProducts = createAsyncThunk(
  'products/getDiscountedProducts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await productService.getDiscountedProducts();
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to get discounted products');
    }
  }
);

export const getCheapestProducts = createAsyncThunk(
  'products/getCheapestProducts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await productService.getCheapestProducts();
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to get cheapest products');
    }
  }
);

export const getNewestProducts = createAsyncThunk(
  'products/getNewestProducts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await productService.getNewestProducts();
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to get newest products');
    }
  }
);

export const getProductsByCategory = createAsyncThunk(
  'products/getProductsByCategory',
  async (categoryId, { rejectWithValue }) => {
    try {
      const response = await productService.getProductsByCategory(categoryId);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to get products by category');
    }
  }
);

export const getProductsBySubcategory = createAsyncThunk(
  'products/getProductsBySubcategory',
  async (subcategoryName, { rejectWithValue }) => {
    try {
      const response = await productService.getProductsBySubcategory(subcategoryName);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to get products by subcategory');
    }
  }
);

export const getProductsByBrand = createAsyncThunk(
  'products/getProductsByBrand',
  async (brandId, { rejectWithValue }) => {
    try {
      const response = await productService.getProductsByBrand(brandId);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to get products by brand');
    }
  }
);

export const getProductsByRemark = createAsyncThunk(
  'products/getProductsByRemark',
  async (remark, { rejectWithValue }) => {
    try {
      const response = await productService.getProductsByRemark(remark);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to get products by remark');
    }
  }
);

export const getProductById = createAsyncThunk(
  'products/getProductById',
  async (productId, { rejectWithValue }) => {
    try {
      const response = await productService.getProductById(productId);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to get product');
    }
  }
);

export const updateProduct = createAsyncThunk(
  'products/updateProduct',
  async ({ productId, productData }, { rejectWithValue }) => {
    try {
      const response = await productService.updateProduct(productId, productData);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update product');
    }
  }
);

export const deleteProduct = createAsyncThunk(
  'products/deleteProduct',
  async (productId, { rejectWithValue }) => {
    try {
      const response = await productService.deleteProduct(productId);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete product');
    }
  }
);

const productSlice = createSlice({
  name: 'products',
  initialState: {
    products: [],
    currentProduct: null,
    sliderProducts: [],
    discountedProducts: [],
    cheapestProducts: [],
    newestProducts: [],
    categoryProducts: [],
    brandProducts: [],
    remarkProducts: [],
    isLoading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentProduct: (state) => {
      state.currentProduct = null;
    },
    clearCategoryProducts: (state) => {
      state.categoryProducts = [];
    },
    clearBrandProducts: (state) => {
      state.brandProducts = [];
    },
    clearRemarkProducts: (state) => {
      state.remarkProducts = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // create product
      .addCase(createProduct.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.isLoading = false;
        state.products.push(action.payload);
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // get all products
      .addCase(getAllProducts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.products = action.payload;
      })
      .addCase(getAllProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // get slider products
      .addCase(getSliderProducts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getSliderProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.sliderProducts = action.payload;
      })
      .addCase(getSliderProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // get discounted products
      .addCase(getDiscountedProducts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getDiscountedProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.discountedProducts = action.payload;
      })
      .addCase(getDiscountedProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // get cheapest products
      .addCase(getCheapestProducts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getCheapestProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cheapestProducts = action.payload;
      })
      .addCase(getCheapestProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // get newest products
      .addCase(getNewestProducts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getNewestProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.newestProducts = action.payload;
      })
      .addCase(getNewestProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // get products by category
      .addCase(getProductsByCategory.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getProductsByCategory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.categoryProducts = action.payload;
      })
      .addCase(getProductsByCategory.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // get products by subcategory
      .addCase(getProductsBySubcategory.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getProductsBySubcategory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.categoryProducts = action.payload;
      })
      .addCase(getProductsBySubcategory.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // get products by brand
      .addCase(getProductsByBrand.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getProductsByBrand.fulfilled, (state, action) => {
        state.isLoading = false;
        state.brandProducts = action.payload;
      })
      .addCase(getProductsByBrand.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // get products by remark
      .addCase(getProductsByRemark.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getProductsByRemark.fulfilled, (state, action) => {
        state.isLoading = false;
        state.remarkProducts = action.payload;
      })
      .addCase(getProductsByRemark.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // get product by id
      .addCase(getProductById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getProductById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentProduct = action.payload;
      })
      .addCase(getProductById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // update product
      .addCase(updateProduct.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.products.findIndex(product => product._id === action.payload._id);
        if (index !== -1) {
          state.products[index] = action.payload;
        }
        if (state.currentProduct && state.currentProduct._id === action.payload._id) {
          state.currentProduct = action.payload;
        }
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // delete product
      .addCase(deleteProduct.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.isLoading = false;
        state.products = state.products.filter(product => product._id !== action.payload._id);
        if (state.currentProduct && state.currentProduct._id === action.payload._id) {
          state.currentProduct = null;
        }
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { 
  clearError, 
  clearCurrentProduct, 
  clearCategoryProducts, 
  clearBrandProducts, 
  clearRemarkProducts 
} = productSlice.actions;
export default productSlice.reducer;
