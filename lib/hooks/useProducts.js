import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productService } from '../services/productService';

// product queries
export const useAllProducts = (params = {}) => {
  return useQuery({
    queryKey: ['products', params],
    queryFn: () => productService.getAllProducts(params),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useSliderProducts = () => {
  return useQuery({
    queryKey: ['products', 'slider'],
    queryFn: productService.getSliderProducts,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useDiscountedProducts = () => {
  return useQuery({
    queryKey: ['products', 'discounted'],
    queryFn: productService.getDiscountedProducts,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useCheapestProducts = () => {
  return useQuery({
    queryKey: ['products', 'cheapest'],
    queryFn: productService.getCheapestProducts,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useNewestProducts = () => {
  return useQuery({
    queryKey: ['products', 'newest'],
    queryFn: productService.getNewestProducts,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useProductsByCategory = (categoryId) => {
  return useQuery({
    queryKey: ['products', 'category', categoryId],
    queryFn: () => productService.getProductsByCategory(categoryId),
    enabled: !!categoryId,
    staleTime: 3 * 60 * 1000, // 3 minutes
  });
};

export const useProductsBySubcategory = (subcategoryName) => {
  return useQuery({
    queryKey: ['products', 'subcategory', subcategoryName],
    queryFn: () => productService.getProductsBySubcategory(subcategoryName),
    enabled: !!subcategoryName,
    staleTime: 3 * 60 * 1000, // 3 minutes
  });
};

export const useProductsByCategoryAndSubcategory = (categoryId, subcategoryName) => {
  return useQuery({
    queryKey: ['products', 'category', categoryId, 'subcategory', subcategoryName],
    queryFn: () => productService.getProductsByCategoryAndSubcategory(categoryId, subcategoryName),
    enabled: !!categoryId && !!subcategoryName,
    staleTime: 3 * 60 * 1000, // 3 minutes
  });
};

export const useProductsByBrand = (brandId) => {
  return useQuery({
    queryKey: ['products', 'brand', brandId],
    queryFn: () => productService.getProductsByBrand(brandId),
    enabled: !!brandId,
    staleTime: 3 * 60 * 1000, // 3 minutes
  });
};

export const useProductsByRemark = (remark) => {
  return useQuery({
    queryKey: ['products', 'remark', remark],
    queryFn: () => productService.getProductsByRemark(remark),
    enabled: !!remark,
    staleTime: 3 * 60 * 1000, // 3 minutes
  });
};

export const useProductById = (productId) => {
  return useQuery({
    queryKey: ['products', productId],
    queryFn: () => productService.getProductById(productId),
    enabled: !!productId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// product mutations
export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: productService.createProduct,
    onSuccess: () => {
      // invalidate all product queries
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ productId, productData }) => productService.updateProduct(productId, productData),
    onSuccess: (data, variables) => {
      // invalidate all product queries
      queryClient.invalidateQueries({ queryKey: ['products'] });
      // invalidate specific product query
      queryClient.invalidateQueries({ queryKey: ['products', variables.productId] });
    },
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: productService.deleteProduct,
    onSuccess: () => {
      // invalidate all product queries
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};
