"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Package, Eye, ShoppingCart, Heart } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import WishlistButton from "@/components/Module/Wishlist/WishlistButton";

export default function PublicProductCard({ 
  product, 
  customerEmail,
  onAddToCart,
  showWishlist = true 
}) {
  const router = useRouter();

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-BD', {
      style: 'currency',
      currency: 'BDT',
    }).format(price);
  };

  const calculateDiscountPrice = (price, discount) => {
    if (discount > 0) {
      return price - (price * discount / 100);
    }
    return price;
  };

  const finalPrice = calculateDiscountPrice(product.price, product.discount || 0);

  const getStockStatus = () => {
    if (product?.stock === 0) return { text: "Out of Stock", color: "text-red-500", bg: "bg-red-50" };
    if (product?.stock <= 10) return { text: "Low Stock", color: "text-orange-500", bg: "bg-orange-50" };
    return { text: "In Stock", color: "text-green-500", bg: "bg-green-50" };
  };

  const stockStatus = getStockStatus();

  const handleViewDetails = () => {
    router.push(`/products/${product._id}`);
  };

  const handleAddToCart = () => {
    if (onAddToCart) {
      onAddToCart(product);
    }
  };

  return (
    <div className="group bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 p-2 sm:p-3 md:p-4">
      {/* Image Container */}
      <div className="relative mb-2 sm:mb-3 md:mb-4">
        <div className="aspect-square w-full rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center p-4 sm:p-6 md:p-8">
          {product?.image?.url ? (
            <Image
              width={120}
              height={120}
              src={product.image.url}
              alt={product.title || product.name}
              className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Package className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 text-gray-400" />
            </div>
          )}
        </div>

        {/* Discount Badge */}
        {product?.discount && product.discount > 0 && (
          <div className="absolute top-1 left-1 sm:top-2 sm:left-2">
            <Badge className="bg-red-500 text-white text-xs font-semibold">
              -{product.discount}% OFF
            </Badge>
          </div>
        )}

        {/* Wishlist Button */}
        {showWishlist && customerEmail && (
          <div className="absolute top-1 right-1 sm:top-2 sm:right-2">
            <WishlistButton
              productId={product._id}
              customerEmail={customerEmail}
              size="sm"
              className="bg-white/90 hover:bg-white shadow-sm"
            />
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="px-2 sm:px-3 md:px-4">
        {/* Product Title */}
        <h3 className="text-sm sm:text-base md:text-lg font-semibold text-gray-900 leading-tight mb-2 line-clamp-2">
          {product.title || product.name}
        </h3>

        {/* Short Description */}
        {product?.shortDescription && (
          <p className="text-xs sm:text-sm text-gray-600 mb-2 line-clamp-2">
            {product.shortDescription}
          </p>
        )}

        {/* Price */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex flex-col">
            <span className="text-sm sm:text-base md:text-lg font-bold text-[#38AD81]">
              {formatPrice(finalPrice)}
            </span>
            {product?.discount && product.discount > 0 && (
              <span className="text-xs text-gray-500 line-through">
                {formatPrice(product.price)}
              </span>
            )}
          </div>
          
          {/* Stock Status */}
          <div className={`px-2 py-1 rounded-full text-xs font-medium ${stockStatus.bg} ${stockStatus.color}`}>
            {stockStatus.text}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2">
          <Button 
            onClick={handleViewDetails}
            className="w-full bg-blue-100 hover:bg-blue-200 text-blue-800 transition-all duration-200"
            size="sm"
          >
            <Eye className="h-4 w-4 mr-2" />
            View Details
          </Button>
          
          <Button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="w-full bg-[#38AD81] hover:bg-[#2d8f6a] text-white transition-all duration-200"
            size="sm"
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
          </Button>
        </div>
      </div>
    </div>
  );
}

