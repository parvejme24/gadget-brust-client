import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { wishlistService } from '../services/wishlistService';

// wishlist queries
export const useAllWishlists = () => {
  return useQuery({
    queryKey: ['wishlist'],
    queryFn: wishlistService.getAllWishlists,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useUserWishlist = (userId) => {
  return useQuery({
    queryKey: ['wishlist', 'user', userId],
    queryFn: () => wishlistService.getUserWishlist(userId),
    enabled: !!userId,
    staleTime: 3 * 60 * 1000, // 3 minutes
  });
};

export const useWishlistStatus = (productId, customerEmail) => {
  return useQuery({
    queryKey: ['wishlist', 'status', productId, customerEmail],
    queryFn: () => wishlistService.checkWishlistStatus(productId, customerEmail),
    enabled: !!productId && !!customerEmail,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// wishlist mutations
export const useAddToWishlist = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: wishlistService.addToWishlist,
    onSuccess: (data, variables) => {
      // invalidate all wishlist queries
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
      // invalidate user wishlist query
      queryClient.invalidateQueries({ queryKey: ['wishlist', 'user', variables.customerID] });
      // invalidate wishlist status query
      queryClient.invalidateQueries({ 
        queryKey: ['wishlist', 'status', variables.productID, variables.customerEmail] 
      });
    },
  });
};

export const useRemoveFromWishlist = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: wishlistService.removeFromWishlist,
    onSuccess: (data, variables) => {
      // invalidate all wishlist queries
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
      // invalidate user wishlist query
      queryClient.invalidateQueries({ queryKey: ['wishlist', 'user', data.customerID] });
      // invalidate wishlist status query
      queryClient.invalidateQueries({ 
        queryKey: ['wishlist', 'status', data.productID, data.customerEmail] 
      });
    },
  });
};

export const useClearWishlist = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: wishlistService.clearWishlist,
    onSuccess: (data, variables) => {
      // invalidate user wishlist query
      queryClient.invalidateQueries({ queryKey: ['wishlist', 'user', variables] });
      // invalidate all wishlist queries
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
    },
  });
};
