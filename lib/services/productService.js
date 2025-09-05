import api from '../api';

// product service functions
export const productService = {
  // create new product
  createProduct: async (productData) => {
    const formData = new FormData();
    
    // append basic fields
    Object.keys(productData).forEach(key => {
      if (key === 'image' && productData[key]) {
        formData.append('image', productData[key]);
      } else if (key === 'images' && productData[key]) {
        productData[key].forEach((img, index) => {
          formData.append(`images[${index}]`, img);
        });
      } else if (key === 'keyFeatures' && productData[key]) {
        formData.append('keyFeatures', JSON.stringify(productData[key]));
      } else if (productData[key] !== undefined && productData[key] !== null) {
        formData.append(key, productData[key]);
      }
    });

    const response = await api.post('/products', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // get all products
  getAllProducts: async (params = {}) => {
    const response = await api.get('/products', { params });
    return response.data;
  },

  // get slider products
  getSliderProducts: async () => {
    const response = await api.get('/products/slider');
    return response.data;
  },

  // get discounted products
  getDiscountedProducts: async () => {
    const response = await api.get('/products/discounted');
    return response.data;
  },

  // get cheapest products
  getCheapestProducts: async () => {
    const response = await api.get('/products/cheapest');
    return response.data;
  },

  // get newest products
  getNewestProducts: async () => {
    const response = await api.get('/products/newest');
    return response.data;
  },

  // get products by category
  getProductsByCategory: async (categoryId) => {
    const response = await api.get(`/products/category/${categoryId}`);
    return response.data;
  },

  // get products by subcategory
  getProductsBySubcategory: async (subcategoryName) => {
    const response = await api.get(`/products/subcategory/${subcategoryName}`);
    return response.data;
  },

  // get products by category and subcategory
  getProductsByCategoryAndSubcategory: async (categoryId, subcategoryName) => {
    const response = await api.get(`/products/category/${categoryId}/subcategory/${subcategoryName}`);
    return response.data;
  },

  // get products by brand
  getProductsByBrand: async (brandId) => {
    const response = await api.get(`/products/brand/${brandId}`);
    return response.data;
  },

  // get products by remark
  getProductsByRemark: async (remark) => {
    const response = await api.get(`/products/remark/${remark}`);
    return response.data;
  },

  // get product by id
  getProductById: async (productId) => {
    const response = await api.get(`/products/${productId}`);
    return response.data;
  },

  // update product
  updateProduct: async (productId, productData) => {
    const formData = new FormData();
    
    // append basic fields
    Object.keys(productData).forEach(key => {
      if (key === 'image' && productData[key]) {
        formData.append('image', productData[key]);
      } else if (key === 'images' && productData[key]) {
        productData[key].forEach((img, index) => {
          formData.append(`images[${index}]`, img);
        });
      } else if (key === 'keyFeatures' && productData[key]) {
        formData.append('keyFeatures', JSON.stringify(productData[key]));
      } else if (productData[key] !== undefined && productData[key] !== null) {
        formData.append(key, productData[key]);
      }
    });

    const response = await api.put(`/products/${productId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // delete product
  deleteProduct: async (productId) => {
    const response = await api.delete(`/products/${productId}`);
    return response.data;
  }
};
