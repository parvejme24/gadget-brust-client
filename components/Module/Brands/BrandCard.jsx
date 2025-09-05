"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Image as ImageIcon } from "lucide-react";
import { TbEdit } from "react-icons/tb";
import { FaRegTrashCan } from "react-icons/fa6";

export default function BrandCard({ brand, onEdit, onDelete }) {
  return (
    <div className="group bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 p-2 sm:p-3 md:p-4">
      {/* Image Container */}
      <div className="relative mb-2 sm:mb-3 md:mb-4">
        <div className="aspect-square w-full rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center p-2 sm:p-3 md:p-4">
          {brand.brandImg ? (
            <img
              src={brand.brandImg}
              alt={brand.brandName}
              className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <ImageIcon className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 text-gray-400" />
            </div>
          )}
        </div>
 
        {/* Action buttons overlay */}
        <div className="absolute top-1 right-1 sm:top-2 sm:right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="flex gap-1">
            <Button
              size="icon"
              variant="secondary"
              className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 bg-white/90 hover:bg-white shadow-md cursor-pointer"
              onClick={() => onEdit(brand)}
            >
              <TbEdit className="h-3 w-3 sm:h-3.5 sm:w-3.5 md:h-4 md:w-4" />
            </Button>
            <Button
              size="icon"
              variant="destructive"
              className="h-6 w-6 sm:h-7 sm:w-7 text-red-600 md:h-8 md:w-8 bg-white/90 hover:bg-white shadow-md cursor-pointer"
              onClick={() => onDelete(brand)}
            >
              <FaRegTrashCan className="h-3 w-3 sm:h-3.5 sm:w-3.5 md:h-4 md:w-4" />
            </Button>
          </div>
        </div>
      </div>
 
      {/* Brand Name */}
      <div className="px-2 sm:px-3 md:px-4">
        <h3 className="text-sm sm:text-base md:text-lg font-semibold text-gray-900 text-center leading-tight">
          {brand.brandName}
        </h3>
      </div>
    </div>
  );
}
