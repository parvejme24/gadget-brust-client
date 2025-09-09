"use client";

import React from "react";
import Link from "next/link";
import { useAllCategories } from "@/lib/hooks/useCategories";
import { Loader2, Package, ChevronRight } from "lucide-react";
import Image from "next/image";

export default function CategoriesPage() {
  const { data: categoriesData, isLoading, error } = useAllCategories();
  const categories = categoriesData?.data || [];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center gap-3">
          <Loader2 className="h-6 w-6 animate-spin text-[#38AD81]" />
          <span className="text-gray-600">Loading categories...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 mb-4">
            <svg
              className="mx-auto h-12 w-12"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 19.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Error Loading Categories
          </h3>
          <p className="text-gray-600">
            There was an error loading the categories. Please try again later.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Categories Grid */}
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        {categories.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <div
                key={category._id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-300"
              >
                <div className="flex h-full">
                  {/* Left Side - Category Name and Subcategories */}
                  <div className="w-1/2 p-6">
                    <div className="h-full flex flex-col justify-center">
                      <Link
                        href={`/category/${category._id}`}
                        className="group"
                      >
                        <h2 className="text-xl font-bold text-gray-900 group-hover:text-[#38AD81] transition-colors duration-200 mb-3">
                          {category.categoryName}
                        </h2>
                      </Link>

                      {category.subcategories &&
                        category.subcategories.length > 0 && (
                          <div className="space-y-3 mb-4">
                            <div className="space-y-1">
                              {category.subcategories
                                .slice(0, 4)
                                .map((subcategory, index) => (
                                  <Link
                                    key={index}
                                    href={`/category/${
                                      category._id
                                    }?subcategory=${encodeURIComponent(
                                      subcategory
                                    )}`}
                                    className="flex items-center text-gray-700 hover:text-[#38AD81] transition-colors duration-200 group"
                                  >
                                    <ChevronRight className="h-3 w-3 mr-2 group-hover:translate-x-1 transition-transform duration-200" />
                                    <span className="text-sm">
                                      {subcategory}
                                    </span>
                                  </Link>
                                ))}
                              {category.subcategories.length > 4 && (
                                <p className="text-xs text-gray-500">
                                  +{category.subcategories.length - 4} more
                                </p>
                              )}
                            </div>
                          </div>
                        )}
                    </div>
                  </div>

                  {/* Right Side - Category Image */}
                  <div className="w-1/2 relative">
                    {category.categoryImg?.url && (
                      <Image
                        src={category.categoryImg.url}
                        alt={category.categoryName}
                        fill
                        className="object-cover p-10 w-[100px] h-auto"
                        sizes=""
                      />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Package className="mx-auto h-16 w-16" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No Categories Available
            </h3>
            <p className="text-gray-600">
              No product categories are available at the moment.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
