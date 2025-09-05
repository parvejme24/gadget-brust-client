import api from '../api';

// brand service functions
export const brandService = {
  // create new brand
  createBrand: async (brandData) => {
    const formData = new FormData();
    formData.append('brandName', brandData.brandName);
    if (brandData.brandImg) {
      formData.append('brandImg', brandData.brandImg);
    }

    const response = await api.post('/brands', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // get all brands
  getAllBrands: async () => {
    const response = await api.get('/brands');
    return response.data;
  },

  // get brand by id
  getBrandById: async (brandId) => {
    const response = await api.get(`/brands/${brandId}`);
    return response.data;
  },

  // update brand
  updateBrand: async (brandId, brandData) => {
    const formData = new FormData();
    formData.append('brandName', brandData.brandName);
    if (brandData.brandImg) {
      formData.append('brandImg', brandData.brandImg);
    }

    const response = await api.put(`/brands/${brandId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // delete brand
  deleteBrand: async (brandId) => {
    const response = await api.delete(`/brands/${brandId}`);
    return response.data;
  }
};
