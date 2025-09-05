'use client';

import React, { useState } from 'react';
import { useAllBrands } from '@/lib/hooks/useBrands';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, Plus, Info } from 'lucide-react';
import BrandCard from '@/components/Module/Brands/BrandCard';
import AddBrand from '@/components/Module/Brands/AddBrand';
import EditBrand from '@/components/Module/Brands/EditBrand';
import DeleteBrand from '@/components/Module/Brands/DeleteBrand';

export default function BrandsPage() {
  const { data: brandsData, isLoading, error } = useAllBrands();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState(null);

  const brands = brandsData?.data || [];

  const handleEditBrand = (brand) => {
    setSelectedBrand(brand);
    setShowEditModal(true);
  };

  const handleDeleteBrand = (brand) => {
    setSelectedBrand(brand);
    setShowDeleteModal(true);
  };

  const handleAddBrand = () => {
    setShowAddModal(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading brands...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-red-500 mb-4">Error loading brands: {error.message}</p>
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
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Brands Management</h1>
          <p className="text-gray-600 mt-1 sm:mt-2 text-sm sm:text-base">Manage your brand collection</p>
        </div>
        <Button className="flex items-center gap-2 cursor-pointer w-full sm:w-auto" onClick={handleAddBrand}>
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">Add New Brand</span>
          <span className="sm:hidden">Add Brand</span>
        </Button>
      </div>

      {/* Brands Grid */}
      {brands.length === 0 ? (
        <div className="space-y-6">
          <Alert className="border-blue-200 bg-blue-50">
            <Info className="h-4 w-4 text-blue-600" />
            <AlertTitle className="text-blue-800">No Brands Found</AlertTitle>
            <AlertDescription className="text-blue-700">
              You haven't added any brands yet. Get started by adding your first brand to manage your brand collection.
            </AlertDescription>
          </Alert>
          
          <div className="text-center">
            <Button className="flex items-center gap-2 cursor-pointer w-full sm:w-auto" onClick={handleAddBrand}>
              <Plus className="h-4 w-4" />
              Add Your First Brand
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 md:gap-6">
          {brands.map((brand) => (
            <BrandCard
              key={brand._id}
              brand={brand}
              onEdit={handleEditBrand}
              onDelete={handleDeleteBrand}
            />
          ))}
        </div>
      )}

      {/* Modals */}
      <AddBrand 
        isOpen={showAddModal} 
        onClose={() => setShowAddModal(false)} 
      />
      
      <EditBrand 
        isOpen={showEditModal} 
        onClose={() => {
          setShowEditModal(false);
          setSelectedBrand(null);
        }}
        brand={selectedBrand}
      />
      
      <DeleteBrand 
        isOpen={showDeleteModal} 
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedBrand(null);
        }}
        brand={selectedBrand}
      />
    </div>
  );
}
