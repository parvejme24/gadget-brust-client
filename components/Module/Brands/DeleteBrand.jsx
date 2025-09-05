'use client';

import React from 'react';
import { useDeleteBrand } from '@/lib/hooks/useBrands';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Loader2, X } from 'lucide-react';
import { FaRegTrashCan } from "react-icons/fa6";

export default function DeleteBrand({ isOpen, onClose, brand }) {
  const deleteBrandMutation = useDeleteBrand();

  const handleDelete = async () => {
    try {
      await deleteBrandMutation.mutateAsync(brand._id);
      toast.success('Brand deleted successfully');
      onClose();
    } catch (error) {
      toast.error(error.message || 'Failed to delete brand');
    }
  };

  if (!isOpen || !brand) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg sm:text-xl text-red-600">Delete Brand</CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose} className="cursor-pointer">
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
              {brand.brandImg && (
                <div className="w-16 h-16 rounded-lg overflow-hidden border">
                  <img src={brand.brandImg} alt={brand.brandName} className="w-full h-full object-cover" />
                </div>
              )}
              <div>
                <h3 className="font-semibold text-gray-900">{brand.brandName}</h3>
                <p className="text-sm text-gray-500">Created: {new Date(brand.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
            
            <p className="text-gray-600">
              Are you sure you want to delete this brand? This action cannot be undone.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 justify-end pt-4">
              <Button
                variant="outline"
                onClick={onClose}
                disabled={deleteBrandMutation.isPending}
                className="cursor-pointer w-full sm:w-auto"
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={deleteBrandMutation.isPending}
                className="cursor-pointer w-full sm:w-auto"
              >
                {deleteBrandMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <FaRegTrashCan className="h-4 w-4 mr-2" />
                    Delete Brand
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
