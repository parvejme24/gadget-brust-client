"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import ProductCard from "@/components/Module/Products/ProductCard";
import ProductFilters from "@/components/Module/Products/ProductFilters";
import Pagination from "@/components/Shared/Pagination/Pagination";
import { useProductManagement } from "@/lib/hooks/useProductManagement";
import { Loader2, Plus, Package } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { productService } from "@/lib/services/productService";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function ProductContainer() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [productToDelete, setProductToDelete] = React.useState(null);

  const {
    products,
    brands,
    categories,
    remarks,
    isLoading,
    isFiltering,
    error,
    searchTerm,
    setSearchTerm,
    filters,
    updateFilter,
    clearFilters,
    hasActiveFilters,
    getSubcategories,
    currentPage,
    totalPages,
    totalProducts,
    hasNextPage,
    hasPrevPage,
    goToPage,
    goToNextPage,
    goToPrevPage,
  } = useProductManagement();

  // Delete product mutation
  const deleteProductMutation = useMutation({
    mutationFn: (productId) => productService.deleteProduct(productId),
    onSuccess: (data, productId) => {
      // Invalidate and refetch products
      queryClient.invalidateQueries({ queryKey: ['products'] });
      setDeleteDialogOpen(false);
      setProductToDelete(null);
      
      // Show success message
      toast.success("Product deleted successfully!", {
        description: `The product has been permanently removed from your inventory.`,
        duration: 4000,
      });
    },
    onError: (error) => {
      console.error('Error deleting product:', error);
      setDeleteDialogOpen(false);
      setProductToDelete(null);
      
      // Show error message
      toast.error("Failed to delete product", {
        description: "There was an error deleting the product. Please try again.",
        duration: 4000,
      });
    },
  });

  const handleEdit = (product) => {
    // Validate product has required data before navigating
    if (!product || !product._id) {
      toast.error("Invalid product data", {
        description: "Cannot edit product with missing information.",
        duration: 4000,
      });
      return;
    }
    
    // Check if product has been deleted or is invalid
    if (!product.title || product.title === 'undefined' || product.title === 'null') {
      toast.error("Product data is corrupted", {
        description: "This product appears to be invalid or corrupted. Please refresh the page.",
        duration: 4000,
      });
      return;
    }
    
    console.log('Navigating to edit product:', product._id, product.title);
    
    // Show loading toast
    const loadingToast = toast.loading("Loading product editor...", {
      description: "Preparing to edit the product.",
    });
    
    // Navigate to edit page
    router.push(`/admin/products/edit/${product._id}`);
    
    // Dismiss loading toast after a short delay
    setTimeout(() => {
      toast.dismiss(loadingToast);
    }, 1000);
  };

  const handleDelete = (product) => {
    setProductToDelete(product);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (productToDelete) {
      deleteProductMutation.mutate(productToDelete._id);
    }
  };

  // Function to refresh products data
  const refreshProducts = () => {
    queryClient.invalidateQueries({ queryKey: ['products'] });
    toast.success("Products refreshed", {
      description: "Product list has been updated.",
      duration: 3000,
    });
  };

  // Only show full page loading on initial load when no products exist AND not filtering
  if (isLoading && products.length === 0 && !isFiltering) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex items-center gap-3">
            <Loader2 className="h-6 w-6 animate-spin text-[#38AD81]" />
            <span className="text-gray-600">Loading products...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error && products.length === 0 && !isFiltering) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <Alert className="max-w-md">
            <Package className="h-4 w-4" />
            <AlertDescription>
              Failed to load products. Please try again later.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-600 mt-1">
            Manage your product inventory ({totalProducts} total products)
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={refreshProducts}
            variant="outline"
            className="cursor-pointer border-gray-300 hover:border-gray-400 text-gray-700 hover:text-gray-900 transition-all duration-200"
          >
            <Loader2 className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button
            onClick={() => router.push("/admin/products/add")}
            className="cursor-pointer bg-[#38AD81] hover:bg-[#2d8f6a] text-white transition-all duration-200 shadow-sm hover:shadow-md"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </Button>
        </div>
      </div>

      {/* Filters */}
      <ProductFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filters={filters}
        updateFilter={updateFilter}
        clearFilters={clearFilters}
        hasActiveFilters={hasActiveFilters}
        categories={categories}
        brands={brands}
        remarks={remarks}
        getSubcategories={getSubcategories}
      />

      {/* Products Grid/List */}
      <div className="relative">
        {/* Loading overlay for filter changes - only show when actually filtering and loading */}
        {isFiltering && isLoading && products.length > 0 && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex items-center justify-center min-h-[400px]">
            <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-lg shadow-lg">
              <Loader2 className="h-5 w-5 animate-spin text-[#38AD81]" />
              <span className="text-gray-600">Filtering products...</span>
            </div>
          </div>
        )}

        {products.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {products.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>

            {/* Pagination */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalProducts={totalProducts}
              hasNextPage={hasNextPage}
              hasPrevPage={hasPrevPage}
              onPageChange={goToPage}
              onNextPage={goToNextPage}
              onPrevPage={goToPrevPage}
            />
          </>
        ) : (
          <div className="flex items-center justify-center min-h-[400px]">
            {isFiltering && isLoading ? (
              <div className="flex items-center gap-3">
                <Loader2 className="h-6 w-6 animate-spin text-[#38AD81]" />
                <span className="text-gray-600">Loading products...</span>
              </div>
            ) : (
              <Alert className="max-w-md">
                <Package className="h-4 w-4" />
                <AlertDescription>
                  {hasActiveFilters
                    ? "No products match your search criteria. Try adjusting your filters."
                    : "No products found. Start by adding your first product."}
                </AlertDescription>
              </Alert>
            )}
          </div>
        )}
      </div>
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Product</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{productToDelete?.title}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              disabled={deleteProductMutation.isPending}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleteProductMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
