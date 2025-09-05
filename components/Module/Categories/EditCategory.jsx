"use client";

import React, { useState, useEffect } from "react";
import { useUpdateCategory } from "@/lib/hooks/useCategories";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import FileUpload from "@/components/ui/file-upload";
import { toast } from "sonner";
import { Loader2, X } from "lucide-react";
import { TbEdit } from "react-icons/tb";
import { FaRegTrashCan } from "react-icons/fa6";

export default function EditCategory({ isOpen, onClose, category }) {
  const [formData, setFormData] = useState({
    categoryName: "",
    categoryImg: null,
    subcategories: [],
  });
  const [preview, setPreview] = useState(null);
  const [subcategoryInput, setSubcategoryInput] = useState("");
  const updateCategoryMutation = useUpdateCategory();

  useEffect(() => {
    if (category) {
      setFormData({
        categoryName: category.categoryName || "",
        categoryImg: null,
        subcategories: category.subcategories || [],
      });
      setPreview(category.categoryImg?.url || null);
    }
  }, [category]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (file) => {
    if (file) {
      setFormData((prev) => ({
        ...prev,
        categoryImg: file,
      }));

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target.result);
      reader.readAsDataURL(file);
    } else {
      setFormData((prev) => ({ ...prev, categoryImg: null }));
      setPreview(null);
    }
  };

  const handleAddSubcategory = () => {
    if (
      subcategoryInput.trim() &&
      !formData.subcategories.includes(subcategoryInput.trim())
    ) {
      setFormData((prev) => ({
        ...prev,
        subcategories: [...prev.subcategories, subcategoryInput.trim()],
      }));
      setSubcategoryInput("");
    }
  };

  const handleRemoveSubcategory = (index) => {
    setFormData((prev) => ({
      ...prev,
      subcategories: prev.subcategories.filter((_, i) => i !== index),
    }));
  };

  const handleEditSubcategory = (index, newValue) => {
    if (newValue.trim()) {
      setFormData((prev) => ({
        ...prev,
        subcategories: prev.subcategories.map((sub, i) =>
          i === index ? newValue.trim() : sub
        ),
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.categoryName.trim()) {
      toast.error("Category name is required");
      return;
    }

    try {
      await updateCategoryMutation.mutateAsync({
        categoryId: category._id,
        categoryData: formData,
      });
      toast.success("Category updated successfully");
      handleClose();
    } catch (error) {
      toast.error(error.message || "Failed to update category");
    }
  };

  const handleClose = () => {
    setFormData({ categoryName: "", categoryImg: null, subcategories: [] });
    setPreview(null);
    setSubcategoryInput("");
    onClose();
  };

  if (!isOpen || !category) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
      <div className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl max-h-[95vh] bg-white rounded-3xl shadow-2xl border-0 overflow-hidden animate-in slide-in-from-bottom-4 duration-500">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#38AD81] to-[#2d8f6a] px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-white">
                Edit Category
              </h2>
              <p className="text-green-100 text-sm mt-1">
                Update category information
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClose}
              className="cursor-pointer text-white hover:bg-white/20 transition-colors duration-200"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 overflow-y-auto max-h-[calc(95vh-120px)]">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Category Name */}
            <div className="space-y-3">
              <Label
                htmlFor="categoryName"
                className="text-sm font-medium text-gray-700"
              >
                Category Name
              </Label>
              <Input
                id="categoryName"
                name="categoryName"
                value={formData.categoryName}
                onChange={handleInputChange}
                placeholder="Enter category name"
                className="h-12 border-gray-200 focus:border-[#38AD81] focus:ring-[#38AD81]/20 transition-all duration-200"
                required
              />
            </div>

            {/* Category Image */}
            <div className="space-y-3">
              <Label className="text-sm font-medium text-gray-700">
                Category Image
              </Label>
              <FileUpload
                onFileChange={handleImageChange}
                preview={preview}
                accept="image/*"
                disabled={updateCategoryMutation.isPending}
              />
            </div>

            {/* Subcategories */}
            <div className="space-y-3">
              <Label className="text-sm font-medium text-gray-700">
                Subcategories
              </Label>

              {/* Existing Subcategories - Editable List */}
              {formData.subcategories.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-[#38AD81] rounded-full"></div>
                    <span className="text-sm font-medium text-gray-600">
                      Current Subcategories
                    </span>
                  </div>
                  <div className="space-y-2 max-h-32 overflow-y-auto border border-gray-200 rounded-lg p-3 bg-gray-50/30">
                    {formData.subcategories.map((sub, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 group"
                      >
                        <div className="w-6 h-6 bg-[#38AD81] rounded-full flex items-center justify-center text-white text-xs font-medium">
                          {index + 1}
                        </div>
                        <Input
                          value={sub}
                          onChange={(e) =>
                            handleEditSubcategory(index, e.target.value)
                          }
                          className="flex-1 h-9 text-sm border-gray-200 focus:border-[#38AD81] focus:ring-[#38AD81]/20 transition-all duration-200"
                          placeholder="Enter subcategory name"
                        />
                        <Button
                          type="button"
                          onClick={() => handleRemoveSubcategory(index)}
                          variant="ghost"
                          size="sm"
                          className="cursor-pointer text-red-500 hover:text-red-700 hover:bg-red-50 transition-all duration-200 opacity-0 group-hover:opacity-100"
                        >
                          <FaRegTrashCan className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Add New Subcategory */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm font-medium text-gray-600">
                    Add New Subcategory
                  </span>
                </div>
                <div className="flex gap-2">
                  <Input
                    value={subcategoryInput}
                    onChange={(e) => setSubcategoryInput(e.target.value)}
                    placeholder="Enter new subcategory name"
                    className="h-10 border-gray-200 focus:border-[#38AD81] focus:ring-[#38AD81]/20 transition-all duration-200"
                    onKeyPress={(e) =>
                      e.key === "Enter" &&
                      (e.preventDefault(), handleAddSubcategory())
                    }
                  />
                  <Button
                    type="button"
                    onClick={handleAddSubcategory}
                    className="cursor-pointer h-10 px-4 bg-[#38AD81] hover:bg-[#2d8f6a] text-white transition-all duration-200 shadow-sm hover:shadow-md"
                  >
                    <TbEdit className="h-4 w-4" />
                  </Button>
                </div>
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
                disabled={updateCategoryMutation.isPending} 
                className="cursor-pointer w-full sm:w-auto h-11 bg-[#38AD81] hover:bg-[#2d8f6a] text-white transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {updateCategoryMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Updating...
                  </>
                ) : (
                  <>
                    <TbEdit className="h-4 w-4 mr-2" />
                    Update Category
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
