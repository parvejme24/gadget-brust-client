"use client";

import React from 'react';
import WishlistCard from './WishlistCard';
import { Card, CardContent } from '@/components/ui/card';
import { Heart, Package } from 'lucide-react';

export default function WishlistGrid({ wishlistItems, onRemove }) {
  if (!wishlistItems || wishlistItems.length === 0) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Your wishlist is empty
          </h3>
          <p className="text-gray-600">
            Start adding products to your wishlist to see them here.
          </p>
        </CardContent>
      </Card>
    );
  }

  // Filter out items with null products
  const validItems = wishlistItems.filter(item => item && item.productID);

  if (validItems.length === 0) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No valid products found
          </h3>
          <p className="text-gray-600">
            Some products in your wishlist may have been removed.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {validItems.map((item) => (
        <WishlistCard
          key={item._id}
          wishlistItem={item}
          onRemove={onRemove}
        />
      ))}
    </div>
  );
}
