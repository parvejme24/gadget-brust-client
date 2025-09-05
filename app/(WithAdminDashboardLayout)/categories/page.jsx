"use client";

import React, { useState } from "react";
import { useAllCategories } from "@/lib/hooks/useCategories";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, Plus, Info } from "lucide-react";
import CategoryCard from "@/components/Module/Categories/CategoryCard";
import AddCategory from "@/components/Module/Categories/AddCategory";
import EditCategory from "@/components/Module/Categories/EditCategory";
import DeleteCategory from "@/components/Module/Categories/DeleteCategory";

export default function CategoriesPage() {
  const { data: categoriesData, isLoading, error } = useAllCategories();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const categories = categoriesData?.data || [];

  const handleEditCategory = (category) => {
    setSelectedCategory(category);
    setShowEditModal(true);
  };

  const handleDeleteCategory = (category) => {
    setSelectedCategory(category);
    setShowDeleteModal(true);
  };

  const handleAddCategory = () => {
    setShowAddModal(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading categories...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-red-500 mb-4">Error loading categories: {error.message}</p>
          <Button onClick={() => window.location.reload()} className="cursor-pointer">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-3 sm:p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Categories Management</h1>
          <p className="text-gray-600 mt-1 sm:mt-2 text-sm sm:text-base">Manage your category collection</p>
        </div>
        <Button className="flex items-center gap-2 cursor-pointer w-full sm:w-auto" onClick={handleAddCategory}>
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">Add New Category</span>
          <span className="sm:hidden">Add Category</span>
        </Button>
      </div>

      {/* Categories Grid */}
      {categories.length === 0 ? (
        <div className="space-y-6">
          <Alert className="border-blue-200 bg-blue-50">
            <Info className="h-4 w-4 text-blue-600" />
            <AlertTitle className="text-blue-800">No Categories Found</AlertTitle>
            <AlertDescription className="text-blue-700">
              You haven't added any categories yet. Get started by adding your first category to manage your category collection.
            </AlertDescription>
          </Alert>
          
          <div className="text-center">
            <Button className="flex items-center gap-2 cursor-pointer w-full sm:w-auto" onClick={handleAddCategory}>
              <Plus className="h-4 w-4" />
              Add Your First Category
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-6">
          {categories.map((category) => (
            <CategoryCard
              key={category._id}
              category={category}
              onEdit={handleEditCategory}
              onDelete={handleDeleteCategory}
            />
          ))}
        </div>
      )}

      {/* Modals */}
      <AddCategory 
        isOpen={showAddModal} 
        onClose={() => setShowAddModal(false)} 
      />
      
      <EditCategory 
        isOpen={showEditModal} 
        onClose={() => {
          setShowEditModal(false);
          setSelectedCategory(null);
        }}
        category={selectedCategory}
      />
      
      <DeleteCategory 
        isOpen={showDeleteModal} 
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedCategory(null);
        }}
        category={selectedCategory}
      />
    </div>
  );
}
