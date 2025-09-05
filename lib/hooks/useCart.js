import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { cartService } from '../services/cartService';

// cart queries
export const useUserCart = (userId) => {
  return useQuery({
    queryKey: ['cart', 'user', userId],
    queryFn: () => cartService.getUserCart(userId),
    enabled: !!userId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useCartSummary = (userId) => {
  return useQuery({
    queryKey: ['cart', 'summary', userId],
    queryFn: () => cartService.getCartSummary(userId),
    enabled: !!userId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useCartItemById = (cartItemId) => {
  return useQuery({
    queryKey: ['cart', 'item', cartItemId],
    queryFn: () => cartService.getCartItemById(cartItemId),
    enabled: !!cartItemId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useAllCarts = () => {
  return useQuery({
    queryKey: ['cart', 'all'],
    queryFn: cartService.getAllCarts,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// cart mutations
export const useAddToCart = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: cartService.addToCart,
    onSuccess: (data, variables) => {
      // invalidate user cart query
      queryClient.invalidateQueries({ queryKey: ['cart', 'user', variables.user_id] });
      // invalidate cart summary query
      queryClient.invalidateQueries({ queryKey: ['cart', 'summary', variables.user_id] });
    },
  });
};

export const useUpdateCartItem = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ cartItemId, cartData }) => cartService.updateCartItem(cartItemId, cartData),
    onSuccess: (data, variables) => {
      // invalidate cart queries
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      // invalidate specific cart item query
      queryClient.invalidateQueries({ queryKey: ['cart', 'item', variables.cartItemId] });
    },
  });
};

export const useUpdateQuantity = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ cartItemId, quantity }) => cartService.updateQuantity(cartItemId, quantity),
    onSuccess: (data, variables) => {
      // invalidate cart queries
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      // invalidate specific cart item query
      queryClient.invalidateQueries({ queryKey: ['cart', 'item', variables.cartItemId] });
    },
  });
};

export const useRemoveFromCart = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: cartService.removeFromCart,
    onSuccess: () => {
      // invalidate all cart queries
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });
};

export const useClearUserCart = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: cartService.clearUserCart,
    onSuccess: (data, variables) => {
      // invalidate user cart query
      queryClient.invalidateQueries({ queryKey: ['cart', 'user', variables] });
      // invalidate cart summary query
      queryClient.invalidateQueries({ queryKey: ['cart', 'summary', variables] });
    },
  });
};
