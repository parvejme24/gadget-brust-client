"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Image as ImageIcon } from "lucide-react";
import { TbEdit } from "react-icons/tb";
import { FaRegTrashCan } from "react-icons/fa6";

export default function CategoryCard({ category, onEdit, onDelete }) {
  const [showAllSubcategories, setShowAllSubcategories] = useState(false);

  const toggleSubcategories = () => {
    setShowAllSubcategories(!showAllSubcategories);
  };

  const displaySubcategories = showAllSubcategories 
    ? category.subcategories 
    : category.subcategories.slice(0, 4);

  const hasMoreSubcategories = category.subcategories.length > 4;

  return (
    <div className="group bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 p-2 sm:p-3 md:p-4">
      {/* Image Container */}
      <div className="relative mb-2 sm:mb-3 md:mb-4">
        <div className="aspect-square w-full rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center p-2 sm:p-3 md:p-4">
          {category.categoryImg?.url ? (
            <img
              src={category.categoryImg.url}
              alt={category.categoryName}
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
              onClick={() => onEdit(category)}
            >
              <TbEdit className="h-3 w-3 sm:h-3.5 sm:w-3.5 md:h-4 md:w-4" />
            </Button>
            <Button
              size="icon"
              variant="destructive"
              className="h-6 w-6 sm:h-7 sm:w-7 text-red-600 md:h-8 md:w-8 bg-white/90 hover:bg-white shadow-md cursor-pointer"
              onClick={() => onDelete(category)}
            >
              <FaRegTrashCan className="h-3 w-3 sm:h-3.5 sm:w-3.5 md:h-4 md:w-4" />
            </Button>
          </div>
        </div>
      </div>
 
      {/* Category Name */}
      <div className="px-2 sm:px-3 md:px-4">
        <h3 className="text-sm sm:text-base md:text-lg font-semibold text-gray-900 text-center leading-tight mb-3">
          {category.categoryName}
        </h3>
        
        {/* Subcategories */}
        {category.subcategories && category.subcategories.length > 0 && (
          <div className="text-left">
            <p className="text-xs font-medium text-gray-600 mb-2">Subcategories:</p>
            <ul className="text-xs text-gray-500 space-y-1">
              {displaySubcategories.map((sub, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-gray-400 mr-2">•</span>
                  <span className="leading-relaxed">{sub}</span>
                </li>
              ))}
            </ul>
            
            {/* See More/Less Button */}
            {hasMoreSubcategories && (
              <button
                onClick={toggleSubcategories}
                className="text-xs text-blue-600 hover:text-blue-800 font-medium mt-2 cursor-pointer transition-colors duration-200"
              >
                {showAllSubcategories ? "See Less" : `See More (+${category.subcategories.length - 4})`}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
