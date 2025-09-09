"use client";

import React from "react";
import { useParams, useSearchParams } from "next/navigation";
import CategoryHeader from "@/components/Module/Categories/CategoryHeader";
import ProductGrid from "@/components/Module/Products/ProductGrid";
import { 
  useProductsByCategory, 
  useProductsByCategoryAndSubcategory 
} from "@/lib/hooks/useProducts";
import { useCategoryById } from "@/lib/hooks/useCategories";

export default function CategoryPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  
  const categoryId = params.id;
  const subcategoryName = searchParams.get('subcategory');

  // Fetch category details
  const { data: categoryData, isLoading: categoryLoading } = useCategoryById(categoryId);

  // Fetch products based on whether subcategory is selected
  const { 
    data: productsData, 
    isLoading: productsLoading, 
    error: productsError 
  } = subcategoryName 
    ? useProductsByCategoryAndSubcategory(categoryId, subcategoryName)
    : useProductsByCategory(categoryId);

  const products = productsData?.data || [];
  const isLoading = categoryLoading || productsLoading;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Category Header */}
      <CategoryHeader 
        categoryId={categoryId}
        subcategoryName={subcategoryName}
        productCount={products.length}
      />

      {/* Main Content */}
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <ProductGrid
          products={products}
          isLoading={isLoading}
          error={productsError}
          title={subcategoryName ? `${subcategoryName} Products` : undefined}
          subtitle={subcategoryName 
            ? `Browse all products in the ${subcategoryName} subcategory`
            : `Browse all products in the ${categoryData?.data?.categoryName || 'category'} category`
          }
        />
      </div>
    </div>
  );
}
