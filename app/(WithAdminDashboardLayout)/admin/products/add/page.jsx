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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import {
  Loader2,
  ArrowLeft,
  Plus,
  Trash2,
  Search,
  ChevronDown,
} from "lucide-react";
import { TbEdit } from "react-icons/tb";
import { useRouter } from "next/navigation";
import { Checkbox } from "@/components/ui/checkbox";

export default function AddProductPage() {
  const router = useRouter();
  const createProductMutation = useCreateProduct();
  const { data: brandsData } = useAllBrands();
  const { data: categoriesData } = useAllCategories();

  const [formData, setFormData] = useState({
    title: "",
    shortDescription: "",
    price: "",
    discount: "",
    stock: "",
    remark: "regular",
    category: "",
    subcategory: "",
    brand: "",
    image: null,
    keyFeatures: [],
    isSlider: false,
  });

  const [errors, setErrors] = useState({});
  const [preview, setPreview] = useState(null);
  const [keyFeatureInput, setKeyFeatureInput] = useState({
    key: "",
    values: "",
  });
  const [editingFeatureIndex, setEditingFeatureIndex] = useState(null);
  const [selectedSubcategories, setSelectedSubcategories] = useState([]);
  const [openDropdowns, setOpenDropdowns] = useState({});

  // Required fields based on schema
  const requiredFields = [
    "title",
    "shortDescription",
    "price",
    "stock",
    "category",
    "subcategory",
    "brand",
  ];

  // Check if all required fields are filled
  const isFormValid = () => {
    return requiredFields.every(field => {
      const value = formData[field];
      return value !== undefined && value !== null && value !== '';
    });
  };

  const canCreateProduct = isFormValid();

  const toggleDropdown = (dropdown) => {
    setOpenDropdowns((prev) => ({
      ...prev,
      [dropdown]: !prev[dropdown],
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleImageChange = (file) => {
    if (file) {
      setFormData((prev) => ({ ...prev, image: file }));
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target.result);
      reader.readAsDataURL(file);
    } else {
      setFormData((prev) => ({ ...prev, image: null }));
      setPreview(null);
    }
  };

  const handleCategoryChange = (categoryId) => {
    setFormData((prev) => ({ ...prev, category: categoryId, subcategory: "" }));
    const selectedCategory = categoriesData?.data?.find(
      (cat) => cat._id === categoryId
    );
    setSelectedSubcategories(selectedCategory?.subcategories || []);

    // Clear errors
    if (errors.category) {
      setErrors((prev) => ({ ...prev, category: "" }));
    }
    if (errors.subcategory) {
      setErrors((prev) => ({ ...prev, subcategory: "" }));
    }
  };

  const handleSubcategoryChange = (subcategory) => {
    setFormData((prev) => ({ ...prev, subcategory }));
    if (errors.subcategory) {
      setErrors((prev) => ({ ...prev, subcategory: "" }));
    }
  };

  const handleBrandChange = (brandId) => {
    setFormData((prev) => ({ ...prev, brand: brandId }));
    if (errors.brand) {
      setErrors((prev) => ({ ...prev, brand: "" }));
    }
  };

  const handleRemarkChange = (remark) => {
    setFormData((prev) => ({ ...prev, remark }));
  };

  const handleAddKeyFeature = () => {
    if (keyFeatureInput.key.trim() && keyFeatureInput.values.trim()) {
      const values = keyFeatureInput.values
        .split(",")
        .map((v) => v.trim())
        .filter((v) => v);
      const newFeature = {
        key: keyFeatureInput.key.trim(),
        values: values,
      };

      setFormData((prev) => ({
        ...prev,
        keyFeatures: [...prev.keyFeatures, newFeature],
      }));

      setKeyFeatureInput({ key: "", values: "" });
      setEditingFeatureIndex(null);
    }
  };

  const handleRemoveKeyFeature = (index) => {
    setFormData((prev) => ({
      ...prev,
      keyFeatures: prev.keyFeatures.filter((_, i) => i !== index),
    }));
  };

  const handleEditKeyFeature = (index) => {
    const feature = formData.keyFeatures[index];
    setKeyFeatureInput({
      key: feature.key,
      values: feature.values.join(", "),
    });
    setEditingFeatureIndex(index);
  };

  const handleUpdateKeyFeature = () => {
    if (keyFeatureInput.key.trim() && keyFeatureInput.values.trim()) {
      const values = keyFeatureInput.values
        .split(",")
        .map((v) => v.trim())
        .filter((v) => v);

      const updatedFeature = {
        key: keyFeatureInput.key.trim(),
        values: values,
      };

      setFormData((prev) => ({
        ...prev,
        keyFeatures: prev.keyFeatures.map((feature, index) =>
          index === editingFeatureIndex ? updatedFeature : feature
        ),
      }));

      setKeyFeatureInput({ key: "", values: "" });
      setEditingFeatureIndex(null);
    }
  };

  const handleCancelEdit = () => {
    setKeyFeatureInput({ key: "", values: "" });
    setEditingFeatureIndex(null);
  };

  const validateForm = () => {
    const newErrors = {};

    // Required field validation
    requiredFields.forEach((field) => {
      if (!formData[field] || formData[field].toString().trim() === "") {
        newErrors[field] = `${
          field.charAt(0).toUpperCase() + field.slice(1)
        } is required`;
      }
    });

    // Price validation
    if (formData.price && (isNaN(formData.price) || formData.price < 0)) {
      newErrors.price = "Price must be a valid positive number";
    }

    // Stock validation
    if (formData.stock && (isNaN(formData.stock) || formData.stock < 0)) {
      newErrors.stock = "Stock must be a valid positive number";
    }

    // Discount validation
    if (
      formData.discount &&
      (isNaN(formData.discount) ||
        formData.discount < 0 ||
        formData.discount > 100)
    ) {
      newErrors.discount = "Discount must be between 0 and 100";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the errors before submitting");
      return;
    }

    try {
      const productData = {
        title: formData.title.trim(),
        shortDescription: formData.shortDescription.trim(),
        price: Number(formData.price),
        discount: Number(formData.discount) || 0,
        stock: Number(formData.stock),
        remark: formData.remark,
        category: formData.category,
        subcategory: formData.subcategory,
        brand: formData.brand,
        keyFeatures: formData.keyFeatures,
        image: formData.image,
        isSlider: formData.isSlider,
      };

      await createProductMutation.mutateAsync(productData);
      toast.success("Product created successfully");
      router.push("/dashboard/products");
    } catch (error) {
      console.error("Create product error:", error);
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to create product"
      );
    }
  };

  // Searchable Dropdown Component
  const SearchableDropdown = ({
    label,
    value,
    options,
    onSelect,
    placeholder = "Select...",
    required = false,
    dropdownKey,
    searchKey = "name",
  }) => {
    const [searchValue, setSearchValue] = useState("");

    const filteredOptions = options.filter((option) =>
      option[searchKey]?.toLowerCase().includes(searchValue.toLowerCase())
    );

    const displayValue =
      options.find((option) => option._id === value)?.[searchKey] || "";

    return (
      <div className="space-y-2">
        <Label className="text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </Label>
        <DropdownMenu
          open={openDropdowns[dropdownKey]}
          onOpenChange={() => toggleDropdown(dropdownKey)}
        >
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="h-10 px-3 text-left justify-between w-full border-gray-200 hover:border-gray-300"
            >
              <span className="truncate">{displayValue || placeholder}</span>
              <ChevronDown className="h-4 w-4 ml-2 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-full" align="start">
            <div className="p-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search..."
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  className="pl-8 h-8"
                />
              </div>
            </div>
            <DropdownMenuSeparator />
            {filteredOptions.map((option) => (
              <DropdownMenuCheckboxItem
                key={option._id}
                checked={value === option._id}
                onCheckedChange={() => onSelect(option._id)}
              >
                {option[searchKey]}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        {errors[dropdownKey] && (
          <p className="text-red-500 text-xs mt-1">{errors[dropdownKey]}</p>
        )}
      </div>
    );
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6 sm:mb-8">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="cursor-pointer text-gray-600 hover:text-gray-900 w-fit"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back
        </Button>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Add New Product</h1>
          <p className="text-gray-600 mt-1 text-sm sm:text-base">
            Create a new product for your store
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
        {/* Basic Information */}
        <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-200 p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6">
            Basic Information
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">
                Product Title <span className="text-red-500">*</span>
              </Label>
              <Input
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Enter product title"
                className={`h-12 border-gray-200 focus:border-[#38AD81] focus:ring-[#38AD81]/20 transition-all duration-200 ${
                  errors.title ? "border-red-500" : ""
                }`}
              />
              {errors.title && (
                <p className="text-red-500 text-xs mt-1">{errors.title}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">
                Remark
              </Label>
              <SearchableDropdown
                label=""
                value={formData.remark}
                options={[
                  { _id: "regular", name: "Regular" },
                  { _id: "trending", name: "Trending" },
                  { _id: "popular", name: "Popular" },
                  { _id: "top", name: "Top" },
                  { _id: "best", name: "Best" },
                  { _id: "new", name: "New" },
                ]}
                onSelect={handleRemarkChange}
                placeholder="Select remark"
                dropdownKey="remark"
              />
            </div>
          </div>

          <div className="mt-6 space-y-2">
            <Label className="text-sm font-medium text-gray-700">
              Short Description <span className="text-red-500">*</span>
            </Label>
            <Textarea
              name="shortDescription"
              value={formData.shortDescription}
              onChange={handleInputChange}
              placeholder="Enter short description"
              className={`min-h-[100px] border-gray-200 focus:border-[#38AD81] focus:ring-[#38AD81]/20 transition-all duration-200 ${
                errors.shortDescription ? "border-red-500" : ""
              }`}
            />
            {errors.shortDescription && (
              <p className="text-red-500 text-xs mt-1">
                {errors.shortDescription}
              </p>
            )}
          </div>
        </div>

        {/* Pricing & Inventory */}
        <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-200 p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6">
            Pricing & Inventory
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">
                Price (৳) <span className="text-red-500">*</span>
              </Label>
              <Input
                name="price"
                type="number"
                value={formData.price}
                onChange={handleInputChange}
                placeholder="0"
                className={`h-12 border-gray-200 focus:border-[#38AD81] focus:ring-[#38AD81]/20 transition-all duration-200 ${
                  errors.price ? "border-red-500" : ""
                }`}
              />
              {errors.price && (
                <p className="text-red-500 text-xs mt-1">{errors.price}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">
                Discount (%)
              </Label>
              <Input
                name="discount"
                type="number"
                value={formData.discount}
                onChange={handleInputChange}
                placeholder="0"
                className={`h-12 border-gray-200 focus:border-[#38AD81] focus:ring-[#38AD81]/20 transition-all duration-200 ${
                  errors.discount ? "border-red-500" : ""
                }`}
              />
              {errors.discount && (
                <p className="text-red-500 text-xs mt-1">{errors.discount}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">
                Stock <span className="text-red-500">*</span>
              </Label>
              <Input
                name="stock"
                type="number"
                value={formData.stock}
                onChange={handleInputChange}
                placeholder="0"
                className={`h-12 border-gray-200 focus:border-[#38AD81] focus:ring-[#38AD81]/20 transition-all duration-200 ${
                  errors.stock ? "border-red-500" : ""
                }`}
              />
              {errors.stock && (
                <p className="text-red-500 text-xs mt-1">{errors.stock}</p>
              )}
            </div>
          </div>
        </div>

        {/* Category & Brand */}
        <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-200 p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6">
            Category & Brand
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
            <SearchableDropdown
              label="Category"
              value={formData.category}
              options={categoriesData?.data || []}
              onSelect={handleCategoryChange}
              placeholder="Select Category"
              required={true}
              dropdownKey="category"
              searchKey="categoryName"
            />

            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">
                Subcategory <span className="text-red-500">*</span>
              </Label>
              <DropdownMenu
                open={openDropdowns.subcategory}
                onOpenChange={() => toggleDropdown("subcategory")}
              >
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="h-10 px-3 text-left justify-between w-full border-gray-200 hover:border-gray-300"
                  >
                    <span className="truncate">
                      {formData.subcategory || "Select Subcategory"}
                    </span>
                    <ChevronDown className="h-4 w-4 ml-2 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-full" align="start">
                  {selectedSubcategories.map((subcategory) => (
                    <DropdownMenuCheckboxItem
                      key={subcategory}
                      checked={formData.subcategory === subcategory}
                      onCheckedChange={() =>
                        handleSubcategoryChange(subcategory)
                      }
                    >
                      {subcategory}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              {errors.subcategory && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.subcategory}
                </p>
              )}
            </div>

            <SearchableDropdown
              label="Brand"
              value={formData.brand}
              options={brandsData?.data || []}
              onSelect={handleBrandChange}
              placeholder="Select Brand"
              required={true}
              dropdownKey="brand"
              searchKey="brandName"
            />
          </div>
        </div>

        {/* Images */}
        <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-200 p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6">
            Product Image
          </h2>

          <div className="space-y-3">
            <Label className="text-sm font-medium text-gray-700">
              Main Image
            </Label>
            <FileUpload
              onFileChange={handleImageChange}
              preview={preview}
              accept="image/*"
              disabled={createProductMutation.isPending}
            />
          </div>
        </div>

        {/* Key Features */}
        <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-200 p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6">
            Key Features
          </h2>

          <div className="space-y-4 sm:space-y-6">
            {/* Add/Edit Feature Form */}
            <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex flex-col sm:flex-row gap-3">
                  <Input
                    value={keyFeatureInput.key}
                    onChange={(e) =>
                      setKeyFeatureInput((prev) => ({
                        ...prev,
                        key: e.target.value,
                      }))
                    }
                    placeholder="Feature name (e.g., Capacity, Processor)"
                    className="flex-1 h-10 sm:h-12 border-gray-200 focus:border-[#38AD81] focus:ring-[#38AD81]/20 transition-all duration-200"
                  />
                  <Input
                    value={keyFeatureInput.values}
                    onChange={(e) =>
                      setKeyFeatureInput((prev) => ({
                        ...prev,
                        values: e.target.value,
                      }))
                    }
                    placeholder="Values (comma separated, e.g., 10000mAh, 20000mAh)"
                    className="flex-1 h-10 sm:h-12 border-gray-200 focus:border-[#38AD81] focus:ring-[#38AD81]/20 transition-all duration-200"
                  />
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3">
                  {editingFeatureIndex !== null ? (
                    <>
                      <Button
                        type="button"
                        onClick={handleUpdateKeyFeature}
                        className="cursor-pointer h-10 sm:h-12 px-4 sm:px-6 bg-[#38AD81] hover:bg-[#2d8f6a] text-white transition-all duration-200"
                      >
                        <TbEdit className="h-4 w-4 mr-2" />
                        Update Feature
                      </Button>
                      <Button
                        type="button"
                        onClick={handleCancelEdit}
                        variant="outline"
                        className="cursor-pointer h-10 sm:h-12 px-4 sm:px-6 border-gray-300 text-gray-700 hover:bg-gray-50 transition-all duration-200"
                      >
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <Button
                      type="button"
                      onClick={handleAddKeyFeature}
                      className="cursor-pointer h-10 sm:h-12 px-4 sm:px-6 bg-[#38AD81] hover:bg-[#2d8f6a] text-white transition-all duration-200"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Feature
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {/* Features List */}
            {formData.keyFeatures.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-base sm:text-lg font-medium text-gray-800 mb-2 sm:mb-3">
                  Added Features ({formData.keyFeatures.length})
                </h3>
                <div className="space-y-2 sm:space-y-3 max-h-60 sm:max-h-80 overflow-y-auto border border-gray-200 rounded-lg p-3 sm:p-4 bg-gray-50/30">
                  {formData.keyFeatures.map((feature, index) => (
                    <div
                      key={index}
                      className="flex flex-col sm:flex-row sm:items-center justify-between bg-white p-3 sm:p-4 rounded-lg border shadow-sm hover:shadow-md transition-shadow duration-200"
                    >
                      <div className="flex-1 mb-2 sm:mb-0">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-semibold text-xs sm:text-sm text-gray-900 bg-[#38AD81]/10 px-2 py-1 rounded">
                            {feature.key}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {feature.values.map((value, valueIndex) => (
                            <span
                              key={valueIndex}
                              className="text-xs sm:text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded-md"
                            >
                              {value}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="flex gap-2 sm:ml-4">
                        <Button
                          type="button"
                          onClick={() => handleEditKeyFeature(index)}
                          variant="ghost"
                          size="sm"
                          className="cursor-pointer text-blue-500 hover:text-blue-700 hover:bg-blue-50 h-8 w-8 sm:h-9 sm:w-9 p-0"
                        >
                          <TbEdit className="h-3 w-3 sm:h-4 sm:w-4" />
                        </Button>
                        <Button
                          type="button"
                          onClick={() => handleRemoveKeyFeature(index)}
                          variant="ghost"
                          size="sm"
                          className="cursor-pointer text-red-500 hover:text-red-700 hover:bg-red-50 h-8 w-8 sm:h-9 sm:w-9 p-0"
                        >
                          <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Product Settings */}
        <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-200 p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6">
            Product Settings
          </h2>

          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Checkbox
                type="checkbox"
                name="isSlider"
                checked={formData.isSlider}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    isSlider: e.target.checked,
                  }))
                }
                className="h-4 w-4 text-[#38AD81] focus:ring-[#38AD81] border-gray-300 rounded"
              />
              <Label className="text-sm font-medium text-gray-700 cursor-pointer">
                Display this product in the slider
              </Label>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 sm:pt-6">
          {/* Form Status Indicator */}
          {!canCreateProduct && (
            <div className="w-full sm:col-span-2 mb-2">
              <p className="text-sm text-gray-500">
                Please fill all required fields (*) to enable the Create Product button.
              </p>
            </div>
          )}
          
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            className="cursor-pointer w-full sm:w-auto h-10 sm:h-12 border-gray-200 hover:border-gray-300 transition-all duration-200"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={createProductMutation.isPending || !canCreateProduct}
            className={`cursor-pointer w-full sm:w-auto h-10 sm:h-12 transition-all duration-200 shadow-sm hover:shadow-md ${
              canCreateProduct && !createProductMutation.isPending
                ? 'bg-[#38AD81] hover:bg-[#2d8f6a] text-white'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {createProductMutation.isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Creating Product...
              </>
            ) : (
              <>
                <Plus className="h-4 w-4 mr-2" />
                Create Product
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
