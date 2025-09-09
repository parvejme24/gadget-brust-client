"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { useAllCategories } from "@/lib/hooks/useCategories";

export default function CategoryHeader({ 
  categoryId, 
  subcategoryName, 
  productCount 
}) {
  const { data: categoriesData } = useAllCategories();
  const categories = categoriesData?.data || [];
  
  // Find the current category
  const currentCategory = categories.find(cat => cat._id === categoryId);

  const breadcrumbs = [
    { name: "Home", href: "/", icon: Home },
    { name: "Categories", href: "/categories" },
  ];

  if (currentCategory) {
    breadcrumbs.push({
      name: currentCategory.categoryName,
      href: `/category/${currentCategory._id}`,
    });
  }

  if (subcategoryName) {
    breadcrumbs.push({
      name: subcategoryName,
      href: `/category/${categoryId}?subcategory=${encodeURIComponent(subcategoryName)}`,
    });
  }

  return (
    <div className="bg-white border-b border-gray-200">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        {/* Breadcrumbs */}
        <nav className="flex items-center space-x-2 text-sm mb-4">
          {breadcrumbs.map((crumb, index) => (
            <React.Fragment key={index}>
              {index > 0 && (
                <ChevronRight className="h-4 w-4 text-gray-400" />
              )}
              {crumb.href && crumb.href !== "#" ? (
                <Link
                  href={crumb.href}
                  className="flex items-center text-gray-500 hover:text-[#38AD81] transition-colors duration-200"
                >
                  {crumb.icon && <crumb.icon className="h-4 w-4 mr-1" />}
                  {crumb.name}
                </Link>
              ) : (
                <span className="flex items-center text-gray-900 font-medium">
                  {crumb.icon && <crumb.icon className="h-4 w-4 mr-1" />}
                  {crumb.name}
                </span>
              )}
            </React.Fragment>
          ))}
        </nav>

        {/* Category Title and Info */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {subcategoryName ? subcategoryName : currentCategory?.categoryName || "Category"}
            </h1>
            <p className="text-gray-600">
              {subcategoryName 
                ? `Products in ${subcategoryName} category`
                : currentCategory?.categoryName 
                  ? `All products in ${currentCategory.categoryName} category`
                  : "Browse our products"
              }
            </p>
          </div>
          
          {productCount !== undefined && (
            <div className="mt-4 sm:mt-0">
              <div className="bg-[#38AD81] text-white px-4 py-2 rounded-lg">
                <span className="text-sm font-medium">
                  {productCount} Product{productCount !== 1 ? 's' : ''}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Subcategories */}
        {currentCategory && currentCategory.subcategories && currentCategory.subcategories.length > 0 && !subcategoryName && (
          <div className="mt-6">
            <h3 className="text-sm font-medium text-gray-900 mb-3">Browse by Subcategory:</h3>
            <div className="flex flex-wrap gap-2">
              {currentCategory.subcategories.map((subcategory) => (
                <Link
                  key={subcategory}
                  href={`/category/${categoryId}?subcategory=${encodeURIComponent(subcategory)}`}
                  className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-gray-100 text-gray-700 hover:bg-[#38AD81] hover:text-white transition-colors duration-200"
                >
                  {subcategory}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
