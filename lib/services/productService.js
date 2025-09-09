import api from '../api';

// product service functions
export const productService = {
  // create new product
  createProduct: async (productData) => {
    const formData = new FormData();
    
    // Handle image separately
    if (productData.image) {
      formData.append('image', productData.image);
    }
    
    // Send other data
    const { image, ...otherData } = productData;
    Object.keys(otherData).forEach(key => {
      if (otherData[key] !== undefined && otherData[key] !== null && otherData[key] !== '') {
        if (key === 'keyFeatures' && Array.isArray(otherData[key])) {
          // Send keyFeatures as individual fields
          otherData[key].forEach((feature, index) => {
            formData.append(`keyFeatures[${index}].key`, feature.key);
            if (Array.isArray(feature.values)) {
              feature.values.forEach((value, valueIndex) => {
                formData.append(`keyFeatures[${index}].values[${valueIndex}]`, value);
              });
            }
          });
        } else {
          formData.append(key, otherData[key]);
        }
      }
    });

    const response = await api.post('/products', formData);
    return response.data;
  },

  // get all products
  getAllProducts: async (params = {}) => {
    const response = await api.get('/products', { params });
    // The API returns { success: true, message: "...", data: { products: [...] } }
    // But we need to return { data: [...] } for consistency
    return {
      data: response.data.data.products,
      pagination: response.data.data.pagination
    };
  },

  // get slider products
  getSliderProducts: async () => {
    const response = await api.get('/products/slider');
    return {
      data: response.data.data.products || response.data.data
    };
  },

  // get discounted products
  getDiscountedProducts: async () => {
    const response = await api.get('/products/discounted');
    return {
      data: response.data.data.products || response.data.data
    };
  },

  // get cheapest products
  getCheapestProducts: async () => {
    const response = await api.get('/products/cheapest');
    return {
      data: response.data.data.products || response.data.data
    };
  },

  // get newest products
  getNewestProducts: async () => {
    const response = await api.get('/products/newest');
    return {
      data: response.data.data.products || response.data.data
    };
  },

  // get products by category
  getProductsByCategory: async (categoryId) => {
    const response = await api.get(`/products/category/${categoryId}`);
    return {
      data: response.data.data.products || response.data.data
    };
  },

  // get products by subcategory
  getProductsBySubcategory: async (subcategoryName) => {
    const response = await api.get(`/products/subcategory/${subcategoryName}`);
    return {
      data: response.data.data.products || response.data.data
    };
  },

  // get products by category and subcategory
  getProductsByCategoryAndSubcategory: async (categoryId, subcategoryName) => {
    const response = await api.get(`/products/category/${categoryId}/subcategory/${subcategoryName}`);
    return {
      data: response.data.data.products || response.data.data
    };
  },

  // get products by brand
  getProductsByBrand: async (brandId) => {
    const response = await api.get(`/products/brand/${brandId}`);
    return {
      data: response.data.data.products || response.data.data
    };
  },

  // get products by remark
  getProductsByRemark: async (remark) => {
    const response = await api.get(`/products/remark/${remark}`);
    return {
      data: response.data.data.products || response.data.data
    };
  },

  // get product by id
  getProductById: async (productId) => {
    const response = await api.get(`/products/${productId}`);
    return {
      data: response.data.data.product || response.data.data
    };
  },

  // update product
  updateProduct: async (productId, productData) => {
    const formData = new FormData();
    
    // Handle image separately
    if (productData.image) {
      formData.append('image', productData.image);
    }
    
    // Send other data
    const { image, ...otherData } = productData;
    Object.keys(otherData).forEach(key => {
      if (otherData[key] !== undefined && otherData[key] !== null && otherData[key] !== '') {
        if (key === 'keyFeatures' && Array.isArray(otherData[key])) {
          // Send keyFeatures as individual fields
          otherData[key].forEach((feature, index) => {
            formData.append(`keyFeatures[${index}].key`, feature.key);
            if (Array.isArray(feature.values)) {
              feature.values.forEach((value, valueIndex) => {
                formData.append(`keyFeatures[${index}].values[${valueIndex}]`, value);
              });
            }
          });
        } else {
          formData.append(key, otherData[key]);
        }
      }
    });

    const response = await api.put(`/products/${productId}`, formData);
    return response.data;
  },

  // delete product
  deleteProduct: async (productId) => {
    const response = await api.delete(`/products/${productId}`);
    return response.data;
  }
};
