"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { FaStar } from "react-icons/fa";
import { TbEdit } from "react-icons/tb";
import { FaRegTrashCan } from "react-icons/fa6";
import { Package, Eye } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function ProductCard({ product, onEdit, onDelete }) {
  const router = useRouter();

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-BD', {
      style: 'currency',
      currency: 'BDT',
      // minimumFractionDigits: 0,
    }).format(price);
  };

  const getStockStatus = () => {
    if (product?.stock === 0) return { text: "Out of Stock", color: "text-red-500", bg: "bg-red-50" };
    if (product?.stock <= 10) return { text: "Low Stock", color: "text-orange-500", bg: "bg-orange-50" };
    return { text: "In Stock", color: "text-green-500", bg: "bg-green-50" };
  };

  const stockStatus = getStockStatus();

  const handleViewDetails = () => {
    router.push(`/products/${product._id}`);
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
            <span className="bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-md">
              -{product.discount}% OFF
            </span>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="px-2 sm:px-3 md:px-4">
        {/* Product Title */}
        <h3 className="text-sm sm:text-base md:text-lg font-semibold text-gray-900 leading-tight mb-2 line-clamp-2">
          {product.title || product.name}
        </h3>

        {/* Rating */}
        {product?.star && (
          <div className="flex items-center gap-1 mb-2">
            <FaStar className="text-yellow-500 h-3 w-3 sm:h-4 sm:w-4" />
            <span className="text-xs sm:text-sm text-gray-600">{product.star}/5</span>
          </div>
        )}

        {/* Price */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex flex-col">
            <span className="text-sm sm:text-base md:text-lg font-bold text-gray-900">
              {formatPrice(product.price)}
            </span>
            {product?.originalPrice && product.originalPrice > product.price && (
              <span className="text-xs text-gray-500 line-through">
                {formatPrice(product.originalPrice)}
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
            className="w-full bg-blue-100 hover:bg-blue-200 text-blue-800 transition-all duration-200 cursor-pointer"
            size="sm"
          >
            <Eye className="h-4 w-4 mr-2" />
            View Details
          </Button>
          
          <div className="flex gap-2">
            <Button
              onClick={() => onEdit && onEdit(product)}
              className="flex-1 bg-green-100 hover:bg-green-200 text-green-800 cursor-pointer transition-all duration-200"
              size="sm"
            >
              <TbEdit className="h-4 w-4 mr-1" />
              Edit
            </Button>
            <Button
              onClick={() => onDelete && onDelete(product)}
              className="flex-1 bg-orange-100 hover:bg-orange-200 text-orange-800 cursor-pointer transition-all duration-200"
              size="sm"
            >
              <FaRegTrashCan className="h-4 w-4 mr-1" />
              Delete
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
