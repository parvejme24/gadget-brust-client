"use client";

import React from "react";
import { useAllCategories } from "@/lib/hooks/useCategories";
import Image from "next/image";

export default function CategoriesPage() {
  const { data: categoriesData, isLoading, error } = useAllCategories();

  const categories = categoriesData?.data || [];

  if (isLoading) {
    return <div>Loading categories...</div>;
  }

  if (error) {
    return <div>Error loading categories</div>;
  }

  return (
    <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {categories.map((category) => (
          <div
            key={category._id}
            className="border p-5 rounded-lg shadow grid grid-cols-2 gap-5 items-center"
          >
            <div>
              <h2 className="font-semibold text-lg">{category.categoryName}</h2>
              {category.subcategories && category.subcategories.length > 0 && (
                <ul className="space-y-2 mt-3">
                  {category.subcategories.map((subcategory, index) => (
                    <li key={index} className="text-sm text-gray-600">
                      {subcategory}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="relative w-full h-20">
              {category.categoryImg?.url && (
                <Image
                  src={category.categoryImg.url}
                  alt={category.categoryName}
                  fill
                  className="object-contain"
                />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
