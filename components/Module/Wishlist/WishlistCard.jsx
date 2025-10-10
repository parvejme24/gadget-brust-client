"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useRemoveFromWishlist } from '@/lib/hooks/useWishlist';
import { 
  Heart, 
  ShoppingCart, 
  Eye, 
  Trash2, 
  Package,
  DollarSign,
  Star,
  Loader2
} from 'lucide-react';

export default function WishlistCard({ wishlistItem, onRemove }) {
  const removeFromWishlistMutation = useRemoveFromWishlist();
  
  const { productID: product, customerEmail, _id: wishlistId } = wishlistItem;
  
  // Early return if product is null or undefined
  if (!product) {
    return (
      <Card className="border border-gray-200">
        <CardContent className="p-4">
          <div className="text-center text-gray-500">
            <Package className="h-8 w-8 mx-auto mb-2" />
            <p className="text-sm">Product not found</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  const handleRemove = () => {
    removeFromWishlistMutation.mutate(wishlistId, {
      onSuccess: () => {
        if (onRemove) onRemove(wishlistId);
      }
    });
  };
  
  const formatPrice = (price) => {
    if (!price || isNaN(price)) return '$0.00';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };
  
  const calculateDiscountPrice = (price, discount) => {
    if (!price || isNaN(price)) return 0;
    if (discount > 0) {
      return price - (price * discount / 100);
    }
    return price;
  };
  
  const finalPrice = calculateDiscountPrice(product.price || 0, product.discount || 0);
  
  return (
    <Card className="group hover:shadow-lg transition-all duration-300 border border-gray-200">
      <CardContent className="p-0">
        <div className="relative">
          {/* Product Image */}
          <div className="relative h-48 w-full overflow-hidden rounded-t-lg">
            {product.image?.url ? (
              <Image
                src={product.image.url}
                alt={product.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center bg-gray-100">
                <Package className="h-12 w-12 text-gray-400" />
              </div>
            )}
            
            {/* Discount Badge */}
            {product.discount && product.discount > 0 && (
              <Badge className="absolute top-2 left-2 bg-red-500 text-white">
                -{product.discount}%
              </Badge>
            )}
            
            {/* Stock Status */}
            <Badge 
              className={`absolute top-2 right-2 ${
                (product.stock || 0) > 0 
                  ? 'bg-green-500 text-white' 
                  : 'bg-red-500 text-white'
              }`}
            >
              {(product.stock || 0) > 0 ? 'In Stock' : 'Out of Stock'}
            </Badge>
          </div>
          
          {/* Product Info */}
          <div className="p-4">
            <div className="space-y-3">
              {/* Product Title */}
              <Link href={`/products/${product._id || '#'}`} className="group">
                <h3 className="font-semibold text-gray-900 group-hover:text-[#38AD81] transition-colors duration-200 line-clamp-2">
                  {product.title || 'Untitled Product'}
                </h3>
              </Link>
              
              {/* Short Description */}
              {product.shortDescription && (
                <p className="text-sm text-gray-600 line-clamp-2">
                  {product.shortDescription}
                </p>
              )}
              
              {/* Price */}
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-[#38AD81]">
                  {formatPrice(finalPrice)}
                </span>
                {product.discount && product.discount > 0 && (
                  <span className="text-sm text-gray-500 line-through">
                    {formatPrice(product.price || 0)}
                  </span>
                )}
              </div>
              
              {/* Category & Brand */}
              <div className="flex items-center gap-2 text-xs text-gray-500">
                {product.category && (
                  <span className="bg-gray-100 px-2 py-1 rounded">
                    {product.category.categoryName || product.category.name}
                  </span>
                )}
                {product.brand && (
                  <span className="bg-gray-100 px-2 py-1 rounded">
                    {product.brand.brandName || product.brand.name}
                  </span>
                )}
              </div>
              
              {/* Customer Email */}
              <div className="text-xs text-gray-400">
                Added by: {customerEmail}
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="mt-4 flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1 hover:bg-[#38AD81] hover:text-white hover:border-[#38AD81] transition-colors duration-200"
                asChild
              >
                <Link href={`/products/${product._id}`}>
                  <Eye className="h-4 w-4 mr-1" />
                  View
                </Link>
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                className="flex-1 hover:bg-blue-500 hover:text-white hover:border-blue-500 transition-colors duration-200"
                disabled={(product.stock || 0) === 0}
              >
                <ShoppingCart className="h-4 w-4 mr-1" />
                Add to Cart
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={handleRemove}
                disabled={removeFromWishlistMutation.isPending}
                className="hover:bg-red-500 hover:text-white hover:border-red-500 transition-colors duration-200"
              >
                {removeFromWishlistMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
