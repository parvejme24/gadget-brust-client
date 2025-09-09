"use client";

import React, { useState, useEffect } from "react";
import { useCreateProduct } from "@/lib/hooks/useProducts";
import { useAllBrands } from "@/lib/hooks/useBrands";
import { useAllCategories } from "@/lib/hooks/useCategories";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import FileUpload from "@/components/ui/file-upload";
import { toast } from "sonner";
import { Loader2, X, Plus, Trash2 } from "lucide-react";
import { TbEdit } from "react-icons/tb";

export default function AddProduct({ isOpen, onClose }) {
  const createProductMutation = useCreateProduct();
  const { data: brandsData } = useAllBrands();
  const { data: categoriesData } = useAllCategories();

  const [formData, setFormData] = useState({
    title: "",
    shortDescription: "",
    price: "",
    discount: "",
    stock: "",
    star: "",
    remark: "",
    category: "",
    subcategory: "",
    brand: "",
    image: null,
    images: [],
    keyFeatures: []
  });

  const [preview, setPreview] = useState(null);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [keyFeatureInput, setKeyFeatureInput] = useState({ key: "", values: "" });
  const [selectedSubcategories, setSelectedSubcategories] = useState([]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (file) => {
    if (file) {
      setFormData(prev => ({ ...prev, image: file }));
      
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target.result);
      reader.readAsDataURL(file);
    } else {
      setFormData(prev => ({ ...prev, image: null }));
      setPreview(null);
    }
  };

  const handleImagesChange = (files) => {
    if (files && files.length > 0) {
      const fileArray = Array.from(files);
      setFormData(prev => ({ ...prev, images: fileArray }));
      
      const readers = fileArray.map(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
          setImagePreviews(prev => [...prev, e.target.result]);
        };
        reader.readAsDataURL(file);
        return reader;
      });
    }
  };

  const handleCategoryChange = (e) => {
    const categoryId = e.target.value;
    setFormData(prev => ({ ...prev, category: categoryId, subcategory: "" }));
    
    const selectedCategory = categoriesData?.data?.find(cat => cat._id === categoryId);
    setSelectedSubcategories(selectedCategory?.subcategories || []);
  };

  const handleAddKeyFeature = () => {
    if (keyFeatureInput.key.trim() && keyFeatureInput.values.trim()) {
      const values = keyFeatureInput.values.split(',').map(v => v.trim()).filter(v => v);
      const newFeature = {
        key: keyFeatureInput.key.trim(),
        values: values
      };
      
      setFormData(prev => ({
        ...prev,
        keyFeatures: [...prev.keyFeatures, newFeature]
      }));
      
      setKeyFeatureInput({ key: "", values: "" });
    }
  };

  const handleRemoveKeyFeature = (index) => {
    setFormData(prev => ({
      ...prev,
      keyFeatures: prev.keyFeatures.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const formDataToSend = new FormData();
      
      // Basic fields
      formDataToSend.append('title', formData.title);
      formDataToSend.append('shortDescription', formData.shortDescription);
      formDataToSend.append('price', formData.price);
      formDataToSend.append('discount', formData.discount || 0);
      formDataToSend.append('stock', formData.stock);
      formDataToSend.append('star', formData.star || 0);
      formDataToSend.append('remark', formData.remark);
      formDataToSend.append('category', formData.category);
      formDataToSend.append('subcategory', formData.subcategory);
      formDataToSend.append('brand', formData.brand);
      
      // Key features
      formDataToSend.append('keyFeatures', JSON.stringify(formData.keyFeatures));
      
      // Images
      if (formData.image) {
        formDataToSend.append('image', formData.image);
      }
      
      formData.images.forEach((image, index) => {
        formDataToSend.append(`images`, image);
      });

      await createProductMutation.mutateAsync(formDataToSend);
      toast.success("Product created successfully");
      handleClose();
    } catch (error) {
      toast.error(error.message || "Failed to create product");
    }
  };

  const handleClose = () => {
    setFormData({
      title: "",
      shortDescription: "",
      price: "",
      discount: "",
      stock: "",
      star: "",
      remark: "",
      category: "",
      subcategory: "",
      brand: "",
      image: null,
      images: [],
      keyFeatures: []
    });
    setPreview(null);
    setImagePreviews([]);
    setKeyFeatureInput({ key: "", values: "" });
    setSelectedSubcategories([]);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
      <div className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl max-h-[95vh] bg-white rounded-3xl shadow-2xl border-0 overflow-hidden animate-in slide-in-from-bottom-4 duration-500">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center bg-[#38AD81]/10">
                <TbEdit className="h-6 w-6 text-[#38AD81]" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Create New Product</h2>
                <p className="text-gray-500 text-sm">Add a new product to your store</p>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleClose} 
              className="cursor-pointer text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors duration-200"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>
        
        {/* Content */}
        <div className="p-4 sm:p-6 overflow-y-auto max-h-[calc(95vh-120px)]">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">Basic Information</h3>
              
              <div className="space-y-3">
                <Label htmlFor="title" className="text-sm font-medium text-gray-700">Product Title</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Enter product title"
                  className="h-12 border-gray-200 focus:border-[#38AD81] focus:ring-[#38AD81]/20 transition-all duration-200"
                  required
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="shortDescription" className="text-sm font-medium text-gray-700">Short Description</Label>
                <Textarea
                  id="shortDescription"
                  name="shortDescription"
                  value={formData.shortDescription}
                  onChange={handleInputChange}
                  placeholder="Enter short description"
                  className="min-h-[80px] border-gray-200 focus:border-[#38AD81] focus:ring-[#38AD81]/20 transition-all duration-200"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-3">
                  <Label htmlFor="price" className="text-sm font-medium text-gray-700">Price (৳)</Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    value={formData.price}
                    onChange={handleInputChange}
                    placeholder="0"
                    className="h-12 border-gray-200 focus:border-[#38AD81] focus:ring-[#38AD81]/20 transition-all duration-200"
                    required
                  />
                </div>
                <div className="space-y-3">
                  <Label htmlFor="discount" className="text-sm font-medium text-gray-700">Discount (%)</Label>
                  <Input
                    id="discount"
                    name="discount"
                    type="number"
                    value={formData.discount}
                    onChange={handleInputChange}
                    placeholder="0"
                    className="h-12 border-gray-200 focus:border-[#38AD81] focus:ring-[#38AD81]/20 transition-all duration-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-3">
                  <Label htmlFor="stock" className="text-sm font-medium text-gray-700">Stock</Label>
                  <Input
                    id="stock"
                    name="stock"
                    type="number"
                    value={formData.stock}
                    onChange={handleInputChange}
                    placeholder="0"
                    className="h-12 border-gray-200 focus:border-[#38AD81] focus:ring-[#38AD81]/20 transition-all duration-200"
                    required
                  />
                </div>
                <div className="space-y-3">
                  <Label htmlFor="star" className="text-sm font-medium text-gray-700">Rating</Label>
                  <Input
                    id="star"
                    name="star"
                    type="number"
                    step="0.1"
                    min="0"
                    max="5"
                    value={formData.star}
                    onChange={handleInputChange}
                    placeholder="0"
                    className="h-12 border-gray-200 focus:border-[#38AD81] focus:ring-[#38AD81]/20 transition-all duration-200"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <Label htmlFor="remark" className="text-sm font-medium text-gray-700">Remark</Label>
                <Input
                  id="remark"
                  name="remark"
                  value={formData.remark}
                  onChange={handleInputChange}
                  placeholder="e.g., popular, new, featured"
                  className="h-12 border-gray-200 focus:border-[#38AD81] focus:ring-[#38AD81]/20 transition-all duration-200"
                />
              </div>
            </div>

            {/* Category & Brand */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">Category & Brand</h3>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-3">
                  <Label htmlFor="category" className="text-sm font-medium text-gray-700">Category</Label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleCategoryChange}
                    className="h-12 w-full px-3 py-2 border border-gray-200 rounded-md focus:border-[#38AD81] focus:ring-[#38AD81]/20 transition-all duration-200"
                    required
                  >
                    <option value="">Select Category</option>
                    {categoriesData?.data?.map(category => (
                      <option key={category._id} value={category._id}>
                        {category.categoryName}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-3">
                  <Label htmlFor="subcategory" className="text-sm font-medium text-gray-700">Subcategory</Label>
                  <select
                    id="subcategory"
                    name="subcategory"
                    value={formData.subcategory}
                    onChange={handleInputChange}
                    className="h-12 w-full px-3 py-2 border border-gray-200 rounded-md focus:border-[#38AD81] focus:ring-[#38AD81]/20 transition-all duration-200"
                    required
                  >
                    <option value="">Select Subcategory</option>
                    {selectedSubcategories.map(subcategory => (
                      <option key={subcategory} value={subcategory}>
                        {subcategory}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-3">
                <Label htmlFor="brand" className="text-sm font-medium text-gray-700">Brand</Label>
                <select
                  id="brand"
                  name="brand"
                  value={formData.brand}
                  onChange={handleInputChange}
                  className="h-12 w-full px-3 py-2 border border-gray-200 rounded-md focus:border-[#38AD81] focus:ring-[#38AD81]/20 transition-all duration-200"
                  required
                >
                  <option value="">Select Brand</option>
                  {brandsData?.data?.map(brand => (
                    <option key={brand._id} value={brand._id}>
                      {brand.brandName}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Images */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">Images</h3>
              
              <div className="space-y-3">
                <Label className="text-sm font-medium text-gray-700">Main Image</Label>
                <FileUpload
                  onFileChange={handleImageChange}
                  preview={preview}
                  accept="image/*"
                  disabled={createProductMutation.isPending}
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="images" className="text-sm font-medium text-gray-700">Additional Images</Label>
                <Input
                  id="images"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => handleImagesChange(e.target.files)}
                  className="h-12 border-gray-200 focus:border-[#38AD81] focus:ring-[#38AD81]/20 transition-all duration-200"
                />
                {imagePreviews.length > 0 && (
                  <div className="grid grid-cols-3 gap-2 mt-3">
                    {imagePreviews.map((preview, index) => (
                      <div key={index} className="aspect-square rounded-lg overflow-hidden border border-gray-200">
                        <img src={preview} alt={`Preview ${index + 1}`} className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Key Features */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">Key Features</h3>
              
              <div className="space-y-3">
                <div className="flex gap-2">
                  <Input
                    value={keyFeatureInput.key}
                    onChange={(e) => setKeyFeatureInput(prev => ({ ...prev, key: e.target.value }))}
                    placeholder="Feature name (e.g., Capacity)"
                    className="flex-1 h-10 border-gray-200 focus:border-[#38AD81] focus:ring-[#38AD81]/20 transition-all duration-200"
                  />
                  <Input
                    value={keyFeatureInput.values}
                    onChange={(e) => setKeyFeatureInput(prev => ({ ...prev, values: e.target.value }))}
                    placeholder="Values (comma separated)"
                    className="flex-1 h-10 border-gray-200 focus:border-[#38AD81] focus:ring-[#38AD81]/20 transition-all duration-200"
                  />
                  <Button
                    type="button"
                    onClick={handleAddKeyFeature}
                    className="cursor-pointer h-10 px-4 bg-[#38AD81] hover:bg-[#2d8f6a] text-white transition-all duration-200"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                
                {formData.keyFeatures.length > 0 && (
                  <div className="space-y-2 max-h-32 overflow-y-auto border border-gray-200 rounded-lg p-3 bg-gray-50/30">
                    {formData.keyFeatures.map((feature, index) => (
                      <div key={index} className="flex items-center justify-between bg-white p-2 rounded border">
                        <div>
                          <span className="font-medium text-sm">{feature.key}:</span>
                          <span className="text-sm text-gray-600 ml-2">{feature.values.join(", ")}</span>
                        </div>
                        <Button
                          type="button"
                          onClick={() => handleRemoveKeyFeature(index)}
                          variant="ghost"
                          size="sm"
                          className="cursor-pointer text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleClose} 
                className="cursor-pointer w-full sm:w-auto h-11 border-gray-200 hover:border-gray-300 transition-all duration-200"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={createProductMutation.isPending} 
                className="cursor-pointer w-full sm:w-auto h-11 bg-[#38AD81] hover:bg-[#2d8f6a] text-white transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {createProductMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Creating...
                  </>
                ) : (
                  <>
                    <TbEdit className="h-4 w-4 mr-2" />
                    Create Product
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
