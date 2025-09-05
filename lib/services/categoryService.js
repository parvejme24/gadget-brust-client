import api from '../api';

// category service functions
export const categoryService = {
  // create new category
  createCategory: async (categoryData) => {
    const formData = new FormData();
    formData.append('categoryName', categoryData.categoryName);
    if (categoryData.subcategories) {
      formData.append('subcategories', JSON.stringify(categoryData.subcategories));
    }
    if (categoryData.categoryImg) {
      formData.append('categoryImg', categoryData.categoryImg);
    }

    const response = await api.post('/categories', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // get all categories
  getAllCategories: async () => {
    const response = await api.get('/categories');
    return response.data;
  },

  // get category by id
  getCategoryById: async (categoryId) => {
    const response = await api.get(`/categories/${categoryId}`);
    return response.data;
  },

  // get category subcategories with product counts
  getCategorySubcategoriesWithProductCounts: async (categoryId) => {
    const response = await api.get(`/categories/${categoryId}/subcategories`);
    return response.data;
  },

  // update category
  updateCategory: async (categoryId, categoryData) => {
    const formData = new FormData();
    formData.append('categoryName', categoryData.categoryName);
    if (categoryData.subcategories) {
      formData.append('subcategories', JSON.stringify(categoryData.subcategories));
    }
    if (categoryData.categoryImg) {
      formData.append('categoryImg', categoryData.categoryImg);
    }

    const response = await api.put(`/categories/${categoryId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // delete category
  deleteCategory: async (categoryId) => {
    const response = await api.delete(`/categories/${categoryId}`);
    return response.data;
  },

  // delete all categories
  deleteAllCategories: async () => {
    const response = await api.delete('/categories');
    return response.data;
  },

  // add subcategory
  addSubcategory: async (categoryId, subcategoryName) => {
    const response = await api.post(`/categories/${categoryId}/subcategories`, {
      subcategoryName
    });
    return response.data;
  },

  // update subcategory
  updateSubcategory: async (categoryId, subcategoryData) => {
    const response = await api.put(`/categories/${categoryId}/subcategories`, subcategoryData);
    return response.data;
  },

  // delete subcategory
  deleteSubcategory: async (categoryId, subcategoryName) => {
    const response = await api.delete(`/categories/${categoryId}/subcategories`, {
      data: { subcategoryName }
    });
    return response.data;
  }
};
