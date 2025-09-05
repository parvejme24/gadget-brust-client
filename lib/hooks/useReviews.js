import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { reviewService } from '../services/reviewService';

// review queries
export const useAllReviews = () => {
  return useQuery({
    queryKey: ['reviews'],
    queryFn: reviewService.getAllReviews,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useReviewsByProduct = (productId) => {
  return useQuery({
    queryKey: ['reviews', 'product', productId],
    queryFn: () => reviewService.getReviewsByProduct(productId),
    enabled: !!productId,
    staleTime: 3 * 60 * 1000, // 3 minutes
  });
};

export const useReviewsByCustomer = (customerId) => {
  return useQuery({
    queryKey: ['reviews', 'customer', customerId],
    queryFn: () => reviewService.getReviewsByCustomer(customerId),
    enabled: !!customerId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useReviewById = (reviewId) => {
  return useQuery({
    queryKey: ['reviews', reviewId],
    queryFn: () => reviewService.getReviewById(reviewId),
    enabled: !!reviewId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// review mutations
export const useCreateReview = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: reviewService.createReview,
    onSuccess: (data, variables) => {
      // invalidate all reviews query
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
      // invalidate product reviews query
      queryClient.invalidateQueries({ queryKey: ['reviews', 'product', variables.productID] });
      // invalidate customer reviews query
      queryClient.invalidateQueries({ queryKey: ['reviews', 'customer', variables.customerID] });
    },
  });
};

export const useUpdateReview = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ reviewId, reviewData }) => reviewService.updateReview(reviewId, reviewData),
    onSuccess: (data, variables) => {
      // invalidate all reviews query
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
      // invalidate specific review query
      queryClient.invalidateQueries({ queryKey: ['reviews', variables.reviewId] });
      // invalidate product reviews query
      queryClient.invalidateQueries({ queryKey: ['reviews', 'product', data.productID] });
      // invalidate customer reviews query
      queryClient.invalidateQueries({ queryKey: ['reviews', 'customer', data.customerID] });
    },
  });
};

export const useDeleteReview = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: reviewService.deleteReview,
    onSuccess: (data, variables) => {
      // invalidate all reviews query
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
      // invalidate specific review query
      queryClient.invalidateQueries({ queryKey: ['reviews', variables] });
      // invalidate product reviews query
      queryClient.invalidateQueries({ queryKey: ['reviews', 'product', data.productID] });
      // invalidate customer reviews query
      queryClient.invalidateQueries({ queryKey: ['reviews', 'customer', data.customerID] });
    },
  });
};
