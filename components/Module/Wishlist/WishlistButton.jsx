"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { Heart, Loader2 } from 'lucide-react';
import { useWishlistManagement } from '@/lib/hooks/useWishlist';

export default function WishlistButton({ 
  productId, 
  customerEmail, 
  className = "",
  size = "sm",
  showText = false 
}) {
  const { 
    isInWishlist, 
    addToWishlist, 
    removeFromWishlist, 
    getWishlistItemId,
    isAdding 
  } = useWishlistManagement(customerEmail);
  
  const handleToggleWishlist = () => {
    if (isInWishlist(productId)) {
      const wishlistItemId = getWishlistItemId(productId);
      if (wishlistItemId) {
        removeFromWishlist(wishlistItemId);
      }
    } else {
      addToWishlist(productId);
    }
  };
  
  const isWishlisted = isInWishlist(productId);
  
  return (
    <Button
      variant="outline"
      size={size}
      onClick={handleToggleWishlist}
      disabled={isAdding}
      className={`${
        isWishlisted 
          ? 'bg-red-50 border-red-200 text-red-600 hover:bg-red-100' 
          : 'hover:bg-red-50 hover:border-red-200 hover:text-red-600'
      } transition-colors duration-200 ${className}`}
    >
      {isAdding ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-current' : ''}`} />
      )}
      {showText && (
        <span className="ml-1">
          {isWishlisted ? 'Remove' : 'Add to Wishlist'}
        </span>
      )}
    </Button>
  );
}

