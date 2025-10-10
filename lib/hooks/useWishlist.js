import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { wishlistService } from '../services/wishlistService';

// Hook to get all wishlists (admin)
export const useAllWishlists = (params = {}) => {
  return useQuery({
    queryKey: ['wishlists', params],
    queryFn: () => wishlistService.getAllWishlists(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook to get user's wishlist
export const useUserWishlist = (userId) => {
  return useQuery({
    queryKey: ['userWishlist', userId],
    queryFn: () => wishlistService.getUserWishlist(userId),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
  });
};

// Hook to get wishlist by customer email
export const useWishlistByEmail = (customerEmail) => {
  return useQuery({
    queryKey: ['wishlistByEmail', customerEmail],
    queryFn: () => wishlistService.getWishlistByEmail(customerEmail),
    enabled: !!customerEmail,
    staleTime: 5 * 60 * 1000,
    select: (data) => {
      // Transform the data to handle both old and new API response structures
      if (data?.data) {
        return {
          ...data,
          data: data.data.map(item => ({
            ...item,
            // Handle both productID and product fields
            product: item.product || item.productID,
            productID: item.productID || item.product
          }))
        };
      }
      return data;
    }
  });
};

// Hook to check wishlist status
export const useWishlistStatus = (productId, customerEmail) => {
  return useQuery({
    queryKey: ['wishlistStatus', productId, customerEmail],
    queryFn: () => wishlistService.checkWishlistStatus(productId, customerEmail),
    enabled: !!productId && !!customerEmail,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Hook to add to wishlist
export const useAddToWishlist = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ productId, customerEmail }) => 
      wishlistService.addToWishlistWithParams(productId, customerEmail),
    onSuccess: (data) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['wishlists'] });
      queryClient.invalidateQueries({ queryKey: ['userWishlist'] });
      queryClient.invalidateQueries({ queryKey: ['wishlistByEmail'] });
      queryClient.invalidateQueries({ queryKey: ['wishlistStatus'] });
      
      toast.success('Added to wishlist!', {
        description: 'Product has been added to your wishlist.',
        duration: 3000,
      });
    },
    onError: (error) => {
      const message = error.response?.data?.message || 'Failed to add to wishlist';
      toast.error('Error', {
        description: message,
        duration: 4000,
      });
    },
  });
};

// Hook to remove from wishlist
export const useRemoveFromWishlist = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (wishlistId) => wishlistService.removeFromWishlist(wishlistId),
    onSuccess: (data) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['wishlists'] });
      queryClient.invalidateQueries({ queryKey: ['userWishlist'] });
      queryClient.invalidateQueries({ queryKey: ['wishlistByEmail'] });
      queryClient.invalidateQueries({ queryKey: ['wishlistStatus'] });
      
      toast.success('Removed from wishlist!', {
        description: 'Product has been removed from your wishlist.',
        duration: 3000,
      });
    },
    onError: (error) => {
      const message = error.response?.data?.message || 'Failed to remove from wishlist';
      toast.error('Error', {
        description: message,
        duration: 4000,
      });
    },
  });
};

// Hook to clear wishlist
export const useClearWishlist = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (userId) => wishlistService.clearWishlist(userId),
    onSuccess: (data) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['wishlists'] });
      queryClient.invalidateQueries({ queryKey: ['userWishlist'] });
      queryClient.invalidateQueries({ queryKey: ['wishlistByEmail'] });
      
      toast.success('Wishlist cleared!', {
        description: 'All items have been removed from your wishlist.',
        duration: 3000,
      });
    },
    onError: (error) => {
      const message = error.response?.data?.message || 'Failed to clear wishlist';
      toast.error('Error', {
        description: message,
        duration: 4000,
      });
    },
  });
};

// Custom hook for wishlist management
export const useWishlistManagement = (customerEmail) => {
  const addToWishlistMutation = useAddToWishlist();
  const removeFromWishlistMutation = useRemoveFromWishlist();
  const clearWishlistMutation = useClearWishlist();
  
  const { data: wishlistData, isLoading, error } = useWishlistByEmail(customerEmail);
  
  const addToWishlist = (productId) => {
    addToWishlistMutation.mutate({ productId, customerEmail });
  };
  
  const removeFromWishlist = (wishlistId) => {
    removeFromWishlistMutation.mutate(wishlistId);
  };
  
  const clearWishlist = () => {
    // For clearing by email, we need to get the user ID first
    // This is a simplified version - you might need to adjust based on your auth system
    if (wishlistData?.data?.[0]?.customerID) {
      clearWishlistMutation.mutate(wishlistData.data[0].customerID);
    }
  };
  
  const isInWishlist = (productId) => {
    if (!wishlistData?.data) return false;
    return wishlistData.data.some(item => {
      const product = item.productID || item.product;
      return product?._id === productId;
    });
  };
  
  const getWishlistItemId = (productId) => {
    if (!wishlistData?.data) return null;
    const item = wishlistData.data.find(item => {
      const product = item.productID || item.product;
      return product?._id === productId;
    });
    return item?._id || null;
  };
  
  return {
    wishlist: wishlistData?.data || [],
    isLoading,
    error,
    addToWishlist,
    removeFromWishlist,
    clearWishlist,
    isInWishlist,
    getWishlistItemId,
    isAdding: addToWishlistMutation.isPending,
    isRemoving: removeFromWishlistMutation.isPending,
    isClearing: clearWishlistMutation.isPending,
  };
};