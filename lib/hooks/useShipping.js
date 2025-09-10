import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { shippingService } from '../services/shippingService';
import { toast } from 'sonner';

// Hook to get all shipping methods
export const useAllShipping = (params = {}) => {
  return useQuery({
    queryKey: ['shipping', params],
    queryFn: () => shippingService.getAllShipping(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook to get shipping method by ID
export const useShippingById = (id) => {
  return useQuery({
    queryKey: ['shipping', id],
    queryFn: () => shippingService.getShippingById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};

// Hook to create shipping method
export const useCreateShipping = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: shippingService.createShipping,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['shipping'] });
      toast.success('Shipping method created successfully!', {
        description: `"${data?.data?.name}" has been added to your shipping options.`,
        duration: 4000,
      });
    },
    onError: (error) => {
      toast.error('Failed to create shipping method', {
        description: error.response?.data?.message || 'Something went wrong. Please try again.',
        duration: 5000,
      });
    },
  });
};

// Hook to update shipping method
export const useUpdateShipping = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }) => shippingService.updateShipping(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['shipping'] });
      queryClient.invalidateQueries({ queryKey: ['shipping', variables.id] });
      toast.success('Shipping method updated successfully!', {
        description: `"${data?.data?.name}" has been updated.`,
        duration: 4000,
      });
    },
    onError: (error) => {
      toast.error('Failed to update shipping method', {
        description: error.response?.data?.message || 'Something went wrong. Please try again.',
        duration: 5000,
      });
    },
  });
};

// Hook to delete shipping method
export const useDeleteShipping = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: shippingService.deleteShipping,
    onSuccess: (data, shippingId) => {
      queryClient.invalidateQueries({ queryKey: ['shipping'] });
      toast.success('Shipping method deleted successfully!', {
        description: 'The shipping method has been permanently removed.',
        duration: 4000,
      });
    },
    onError: (error) => {
      toast.error('Failed to delete shipping method', {
        description: error.response?.data?.message || 'Something went wrong. Please try again.',
        duration: 5000,
      });
    },
  });
};

// Hook to toggle shipping status
export const useToggleShippingStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: shippingService.toggleShippingStatus,
    onSuccess: (data, shippingId) => {
      queryClient.invalidateQueries({ queryKey: ['shipping'] });
      queryClient.invalidateQueries({ queryKey: ['shipping', shippingId] });
      toast.success('Shipping status updated successfully!', {
        description: `Shipping method is now ${data?.data?.isActive ? 'active' : 'inactive'}.`,
        duration: 4000,
      });
    },
    onError: (error) => {
      toast.error('Failed to update shipping status', {
        description: error.response?.data?.message || 'Something went wrong. Please try again.',
        duration: 5000,
      });
    },
  });
};

// Hook to calculate shipping charge
export const useCalculateShippingCharge = () => {
  return useMutation({
    mutationFn: shippingService.calculateShippingCharge,
    onError: (error) => {
      toast.error('Failed to calculate shipping charge', {
        description: error.response?.data?.message || 'Something went wrong. Please try again.',
        duration: 5000,
      });
    },
  });
};
