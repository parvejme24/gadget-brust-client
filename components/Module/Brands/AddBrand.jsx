'use client';

import React, { useState } from 'react';
import { useCreateBrand } from '@/lib/hooks/useBrands';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Loader2, X, Upload } from 'lucide-react';
import { TbEdit } from "react-icons/tb";

export default function AddBrand({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    brandName: '',
    brandImg: null
  });
  const [preview, setPreview] = useState(null);
  const createBrandMutation = useCreateBrand();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        brandImg: file
      }));
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.brandName.trim()) {
      toast.error('Brand name is required');
      return;
    }

    try {
      await createBrandMutation.mutateAsync(formData);
      toast.success('Brand created successfully');
      handleClose();
    } catch (error) {
      toast.error(error.message || 'Failed to create brand');
    }
  };

  const handleClose = () => {
    setFormData({ brandName: '', brandImg: null });
    setPreview(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg sm:text-xl">Add New Brand</CardTitle>
          <Button variant="ghost" size="icon" onClick={handleClose} className="cursor-pointer">
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="brandName">Brand Name</Label>
              <Input
                id="brandName"
                name="brandName"
                value={formData.brandName}
                onChange={handleInputChange}
                placeholder="Enter brand name"
                required
              />
            </div>

            <div className="space-y-4">
              <Label htmlFor="brandImg">Brand Image</Label>
              
              {/* Image Preview */}
              {preview && (
                <div className="w-full">
                  <Label className="text-sm font-medium text-gray-700 mb-2 block">Image Preview</Label>
                  <div className="w-32 h-32 mx-auto aspect-square rounded-lg overflow-hidden border-2 border-gray-200 bg-gray-50">
                    <img 
                      src={preview} 
                      alt="Brand Preview" 
                      className="w-full h-full object-contain" 
                    />
                  </div>
                </div>
              )}
              
              {/* File Input */}
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2 block">
                  {preview ? 'Change Image' : 'Upload Image'}
                </Label>
                <Input
                  id="brandImg"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-end pt-4">
              <Button type="button" variant="outline" onClick={handleClose} className="cursor-pointer w-full sm:w-auto">
                Cancel
              </Button>
              <Button type="submit" disabled={createBrandMutation.isPending} className="cursor-pointer w-full sm:w-auto">
                {createBrandMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Creating...
                  </>
                ) : (
                  <>
                    <TbEdit className="h-4 w-4 mr-2" />
                    Create Brand
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
