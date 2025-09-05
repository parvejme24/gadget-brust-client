import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { categoryService } from '../services/categoryService';

// category queries
export const useAllCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: categoryService.getAllCategories,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useCategoryById = (categoryId) => {
  return useQuery({
    queryKey: ['categories', categoryId],
    queryFn: () => categoryService.getCategoryById(categoryId),
    enabled: !!categoryId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useCategorySubcategories = (categoryId) => {
  return useQuery({
    queryKey: ['categories', categoryId, 'subcategories'],
    queryFn: () => categoryService.getCategorySubcategoriesWithProductCounts(categoryId),
    enabled: !!categoryId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// category mutations
export const useCreateCategory = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: categoryService.createCategory,
    onSuccess: () => {
      // invalidate categories query
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });
};

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ categoryId, categoryData }) => categoryService.updateCategory(categoryId, categoryData),
    onSuccess: (data, variables) => {
      // invalidate categories query
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      // invalidate specific category query
      queryClient.invalidateQueries({ queryKey: ['categories', variables.categoryId] });
    },
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: categoryService.deleteCategory,
    onSuccess: () => {
      // invalidate categories query
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });
};

// subcategory mutations
export const useAddSubcategory = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ categoryId, subcategoryName }) => categoryService.addSubcategory(categoryId, subcategoryName),
    onSuccess: (data, variables) => {
      // invalidate categories query
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      // invalidate specific category query
      queryClient.invalidateQueries({ queryKey: ['categories', variables.categoryId] });
      // invalidate subcategories query
      queryClient.invalidateQueries({ queryKey: ['categories', variables.categoryId, 'subcategories'] });
    },
  });
};

export const useUpdateSubcategory = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ categoryId, subcategoryData }) => categoryService.updateSubcategory(categoryId, subcategoryData),
    onSuccess: (data, variables) => {
      // invalidate categories query
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      // invalidate specific category query
      queryClient.invalidateQueries({ queryKey: ['categories', variables.categoryId] });
      // invalidate subcategories query
      queryClient.invalidateQueries({ queryKey: ['categories', variables.categoryId, 'subcategories'] });
    },
  });
};

export const useDeleteSubcategory = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ categoryId, subcategoryName }) => categoryService.deleteSubcategory(categoryId, subcategoryName),
    onSuccess: (data, variables) => {
      // invalidate categories query
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      // invalidate specific category query
      queryClient.invalidateQueries({ queryKey: ['categories', variables.categoryId] });
      // invalidate subcategories query
      queryClient.invalidateQueries({ queryKey: ['categories', variables.categoryId, 'subcategories'] });
    },
  });
};
