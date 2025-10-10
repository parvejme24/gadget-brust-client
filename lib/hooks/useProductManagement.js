import React, { useState, useMemo, useCallback } from "react";
import { useAllProducts } from "./useProducts";
import { useAllBrands } from "./useBrands";
import { useAllCategories } from "./useCategories";

export const useProductManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    category: "",
    subcategory: "",
    brand: "",
    remark: "",
    stockStatus: "",
    discountStatus: "",
    priceRange: { min: "", max: "" },
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);
  const [isFiltering, setIsFiltering] = useState(false);

  // Debounce search term
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500); // 500ms delay

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Set filtering state when debounced search term changes
  React.useEffect(() => {
    if (debouncedSearchTerm !== searchTerm) {
      setIsFiltering(true);
    }
  }, [debouncedSearchTerm, searchTerm]);

  // Build query parameters for API
  const queryParams = useMemo(() => {
    const params = {
      page: currentPage,
      limit: itemsPerPage,
    };

    // Add search term (use debounced version)
    if (debouncedSearchTerm) {
      params.search = debouncedSearchTerm;
    }

    // Add filters
    if (filters.category) {
      params.category = filters.category;
    }
    if (filters.subcategory) {
      params.subcategory = filters.subcategory;
    }
    if (filters.brand) {
      params.brand = filters.brand;
    }
    if (filters.remark) {
      params.remark = filters.remark;
    }
    if (filters.priceRange.min) {
      params.minPrice = filters.priceRange.min;
    }
    if (filters.priceRange.max) {
      params.maxPrice = filters.priceRange.max;
    }
    if (filters.stockStatus) {
      params.inStock = filters.stockStatus === 'inStock';
    }

    return params;
  }, [currentPage, itemsPerPage, debouncedSearchTerm, filters]);

  // Fetch products with server-side pagination and filtering
  const { data: productsData, isLoading, error } = useAllProducts(queryParams);
  const { data: brandsData } = useAllBrands();
  const { data: categoriesData } = useAllCategories();

  // Reset filtering state when data is loaded
  React.useEffect(() => {
    if (!isLoading && productsData) {
      setIsFiltering(false);
    }
  }, [isLoading, productsData]);

  // Get all unique subcategories from selected category
  const getSubcategories = useCallback((categoryId) => {
    if (!categoryId || !categoriesData?.data || !Array.isArray(categoriesData.data)) return [];
    const category = categoriesData.data.find(cat => cat._id === categoryId);
    return category?.subcategories || [];
  }, [categoriesData]);

  // Get all unique remarks from products (we'll need to fetch all products for this)
  const getRemarks = useCallback(() => {
    // For remarks, we might need to fetch all products or have a separate endpoint
    // For now, return common remarks
    return ["regular", "trending", "popular", "top", "best", "new"];
  }, []);

  // Extract products and pagination from API response
  const products = productsData?.data || [];
  const pagination = productsData?.pagination || {
    currentPage: 1,
    totalPages: 1,
    totalProducts: 0,
    hasNextPage: false,
    hasPrevPage: false
  };

  // Pagination functions
  const goToPage = useCallback((page) => {
    setCurrentPage(Math.max(1, Math.min(page, pagination.totalPages)));
  }, [pagination.totalPages]);

  const goToNextPage = useCallback(() => {
    if (pagination.hasNextPage) {
      setCurrentPage(prev => prev + 1);
    }
  }, [pagination.hasNextPage]);

  const goToPrevPage = useCallback(() => {
    if (pagination.hasPrevPage) {
      setCurrentPage(prev => prev - 1);
    }
  }, [pagination.hasPrevPage]);

  // Reset to first page when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchTerm, filters]);

  // Update filter function
  const updateFilter = useCallback((key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
    // Only set filtering state for non-search filters
    if (key !== 'search') {
      setIsFiltering(true);
    }
  }, []);

  // Custom setSearchTerm function
  const handleSetSearchTerm = useCallback((value) => {
    setSearchTerm(value);
    // Don't set isFiltering immediately for search - let debounce handle it
  }, []);

  // Clear all filters
  const clearFilters = useCallback(() => {
    setIsFiltering(true);
    setFilters({
      category: "",
      subcategory: "",
      brand: "",
      remark: "",
      stockStatus: "",
      discountStatus: "",
      priceRange: { min: "", max: "" },
    });
    setSearchTerm("");
  }, []);

  // Check if any filters are active
  const hasActiveFilters = useMemo(() => {
    return debouncedSearchTerm !== "" || 
           Object.values(filters).some(value => {
             if (typeof value === 'object' && value !== null) {
               return Object.values(value).some(v => v !== "");
             }
             return value !== "";
           });
  }, [debouncedSearchTerm, filters]);

  return {
    // Data
    products,
    allProducts: products, // For compatibility
    brands: brandsData?.data || [],
    categories: categoriesData?.data || [],
    remarks: getRemarks(),
    
    // Loading states
    isLoading,
    isFiltering,
    error,
    
    // Search and filters
    searchTerm,
    setSearchTerm: handleSetSearchTerm,
    filters,
    updateFilter,
    clearFilters,
    hasActiveFilters,
    getSubcategories,
    
    // Pagination
    currentPage,
    totalPages: pagination.totalPages,
    totalProducts: pagination.totalProducts,
    hasNextPage: pagination.hasNextPage,
    hasPrevPage: pagination.hasPrevPage,
    goToPage,
    goToNextPage,
    goToPrevPage,
  };
};