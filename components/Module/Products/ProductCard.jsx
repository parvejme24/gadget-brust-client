"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { TbEdit } from "react-icons/tb";
import { FaRegTrashCan } from "react-icons/fa6";
import { Package, Eye, Tag } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { FaTags } from "react-icons/fa";

export default function ProductCard({ product, onEdit, onDelete }) {
  const router = useRouter();

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-BD", {
      style: "currency",
      currency: "BDT",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getStockStatus = () => {
    if (product?.stock === 0)
      return { text: "Out of Stock", color: "text-red-500", bg: "bg-red-50" };
    if (product?.stock <= 10)
      return {
        text: "Low Stock",
        color: "text-orange-500",
        bg: "bg-orange-50",
      };
    return { text: "In Stock", color: "text-green-500", bg: "bg-green-50" };
  };

  const stockStatus = getStockStatus();

  const handleViewDetails = () => {
    router.push(`/products/${product._id}`);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden">
      {/* Product Image */}
      <div className="relative h-48 bg-gray-100">
        {product.image?.url ? (
          <Image
            src={product.image.url}
            alt={product.title || "Product"}
            fill
            className="object-contain py-5"
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <Package className="h-12 w-12 text-gray-400" />
          </div>
        )}

        {/* Discount Badge */}
        {product.discount > 0 && (
          <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
            <FaTags className="text-xs" />
            {product.discount}% OFF
          </div>
        )}

        {/* Stock Status Badge */}
        <div
          className={`absolute top-2 left-2 px-2 py-1 rounded-full text-xs font-medium ${stockStatus.bg} ${stockStatus.color}`}
        >
          {stockStatus.text}
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4">
        {/* Title */}
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
          {product.title || "No Title"}
        </h3>

        {/* Price */}
        <div className="mb-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-gray-900">
              {formatPrice(product.price || 0)}
            </span>
            {product.discount > 0 && (
              <span className="text-lg text-gray-500 line-through">
                {formatPrice((product.price * (100 + product.discount)) / 100)}
              </span>
            )}
          </div>
        </div>

        {/* Product Details */}
        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Category:</span>
            <span className="text-gray-900 font-medium">
              {typeof product.category === "object"
                ? product.category?.categoryName
                : product.category || "N/A"}
            </span>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Brand:</span>
            <span className="text-gray-900 font-medium">
              {typeof product.brand === "object"
                ? product.brand?.brandName
                : product.brand || "N/A"}
            </span>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Stock:</span>
            <span className="text-gray-900 font-medium">
              {product.stock || 0} units
            </span>
          </div>

          {product.subcategory && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Subcategory:</span>
              <span className="text-gray-900 font-medium">
                {product.subcategory}
              </span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(product)}
            className="flex-1 hover:bg-blue-50 hover:border-blue-300"
          >
            <TbEdit className="h-4 w-4 mr-1" />
            Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDelete(product)}
            className="flex-1 hover:bg-red-50 hover:border-red-300 hover:text-red-600"
          >
            <FaRegTrashCan className="h-4 w-4 mr-1" />
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
}
