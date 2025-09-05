import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { brandService } from '../services/brandService';

// brand queries
export const useAllBrands = () => {
  return useQuery({
    queryKey: ['brands'],
    queryFn: brandService.getAllBrands,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useBrandById = (brandId) => {
  return useQuery({
    queryKey: ['brands', brandId],
    queryFn: () => brandService.getBrandById(brandId),
    enabled: !!brandId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// brand mutations
export const useCreateBrand = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: brandService.createBrand,
    onSuccess: () => {
      // invalidate brands query
      queryClient.invalidateQueries({ queryKey: ['brands'] });
    },
  });
};

export const useUpdateBrand = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ brandId, brandData }) => brandService.updateBrand(brandId, brandData),
    onSuccess: (data, variables) => {
      // invalidate brands query
      queryClient.invalidateQueries({ queryKey: ['brands'] });
      // invalidate specific brand query
      queryClient.invalidateQueries({ queryKey: ['brands', variables.brandId] });
    },
  });
};

export const useDeleteBrand = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: brandService.deleteBrand,
    onSuccess: () => {
      // invalidate brands query
      queryClient.invalidateQueries({ queryKey: ['brands'] });
    },
  });
};
