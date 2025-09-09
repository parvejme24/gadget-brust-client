"use client";

import React, { useState, useEffect } from "react";
import { useProductById } from "@/lib/hooks/useProducts";
import { useUpdateProduct } from "@/lib/hooks/useProducts";
import { useAllBrands } from "@/lib/hooks/useBrands";
import { useAllCategories } from "@/lib/hooks/useCategories";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import FileUpload from "@/components/ui/file-upload";
import { toast } from "sonner";
import { Loader2, ArrowLeft, Plus, Trash2 } from "lucide-react";
import { TbEdit } from "react-icons/tb";
import { useRouter } from "next/navigation";

export default function EditProductPage({ params }) {
  const router = useRouter();
  const { data: productData, isLoading: productLoading } = useProductById(params.id);
  const updateProductMutation = useUpdateProduct();
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
    keyFeatures: [],
  });

  const [preview, setPreview] = useState(null);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [keyFeatureInput, setKeyFeatureInput] = useState({
    key: "",
    values: "",
  });
  const [selectedSubcategories, setSelectedSubcategories] = useState([]);

  // Load product data when available
  useEffect(() => {
    if (productData?.data) {
      const product = productData.data;
      setFormData({
        title: product.title || "",
        shortDescription: product.shortDescription || "",
        price: product.price || "",
        discount: product.discount || "",
        stock: product.stock || "",
        star: product.star || "",
        remark: product.remark || "",
        category: product.category?._id || "",
        subcategory: product.subcategory || "",
        brand: product.brand?._id || "",
        image: null,
        images: [],
        keyFeatures: product.keyFeatures || [],
      });

      // Set preview for existing image
      if (product.image?.url) {
        setPreview(product.image.url);
      }

      // Set subcategories based on selected category
      if (product.category?.subcategories) {
        setSelectedSubcategories(product.category.subcategories);
      }
    }
  }, [productData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
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

  const handleImagesChange = (files) => {
    if (files && files.length > 0) {
      const fileArray = Array.from(files);
      setFormData((prev) => ({ ...prev, images: fileArray }));

      setImagePreviews([]);
      fileArray.forEach((file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          setImagePreviews((prev) => [...prev, e.target.result]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleCategoryChange = (e) => {
    const categoryId = e.target.value;
    setFormData((prev) => ({ ...prev, category: categoryId, subcategory: "" }));

    const selectedCategory = categoriesData?.data?.find(
      (cat) => cat._id === categoryId
    );
    setSelectedSubcategories(selectedCategory?.subcategories || []);
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
    }
  };

  const handleRemoveKeyFeature = (index) => {
    setFormData((prev) => ({
      ...prev,
      keyFeatures: prev.keyFeatures.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formDataToSend = new FormData();

      // Basic fields
      formDataToSend.append("title", formData.title);
      formDataToSend.append("shortDescription", formData.shortDescription);
      formDataToSend.append("price", formData.price);
      formDataToSend.append("discount", formData.discount || 0);
      formDataToSend.append("stock", formData.stock);
      formDataToSend.append("star", formData.star || 0);
      formDataToSend.append("remark", formData.remark);
      formDataToSend.append("category", formData.category);
      formDataToSend.append("subcategory", formData.subcategory);
      formDataToSend.append("brand", formData.brand);

      // Key features
      formDataToSend.append(
        "keyFeatures",
        JSON.stringify(formData.keyFeatures)
      );

      // Images
      if (formData.image) {
        formDataToSend.append("image", formData.image);
      }

      formData.images.forEach((image, index) => {
        formDataToSend.append(`images`, image);
      });

      await updateProductMutation.mutateAsync({ id: params.id, data: formDataToSend });
      toast.success("Product updated successfully");
      router.push("/admin/products");
    } catch (error) {
      toast.error(error.message || "Failed to update product");
    }
  };

  if (productLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-3">
          <Loader2 className="h-6 w-6 animate-spin text-[#38AD81]" />
          <span className="text-gray-600">Loading product data...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="cursor-pointer text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Edit Product</h1>
          <p className="text-gray-600 mt-1">
            Update product information
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Basic Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label
                htmlFor="title"
                className="text-sm font-medium text-gray-700"
              >
                Product Title *
              </Label>
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

            <div className="space-y-2">
              <Label
                htmlFor="remark"
                className="text-sm font-medium text-gray-700"
              >
                Remark
              </Label>
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

          <div className="mt-6 space-y-2">
            <Label
              htmlFor="shortDescription"
              className="text-sm font-medium text-gray-700"
            >
              Short Description *
            </Label>
            <Textarea
              id="shortDescription"
              name="shortDescription"
              value={formData.shortDescription}
              onChange={handleInputChange}
              placeholder="Enter short description"
              className="min-h-[100px] border-gray-200 focus:border-[#38AD81] focus:ring-[#38AD81]/20 transition-all duration-200"
              required
            />
          </div>
        </div>

        {/* Pricing & Inventory */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Pricing & Inventory
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="space-y-2">
              <Label
                htmlFor="price"
                className="text-sm font-medium text-gray-700"
              >
                Price (৳) *
              </Label>
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
            <div className="space-y-2">
              <Label
                htmlFor="discount"
                className="text-sm font-medium text-gray-700"
              >
                Discount (%)
              </Label>
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
            <div className="space-y-2">
              <Label
                htmlFor="stock"
                className="text-sm font-medium text-gray-700"
              >
                Stock *
              </Label>
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
            <div className="space-y-2">
              <Label
                htmlFor="star"
                className="text-sm font-medium text-gray-700"
              >
                Rating
              </Label>
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
        </div>

        {/* Category & Brand */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Category & Brand
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label
                htmlFor="category"
                className="text-sm font-medium text-gray-700"
              >
                Category *
              </Label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleCategoryChange}
                className="h-12 w-full px-3 py-2 border border-gray-200 rounded-md focus:border-[#38AD81] focus:ring-[#38AD81]/20 transition-all duration-200"
                required
              >
                <option value="">Select Category</option>
                {categoriesData?.data?.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.categoryName}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="subcategory"
                className="text-sm font-medium text-gray-700"
              >
                Subcategory *
              </Label>
              <select
                id="subcategory"
                name="subcategory"
                value={formData.subcategory}
                onChange={handleInputChange}
                className="h-12 w-full px-3 py-2 border border-gray-200 rounded-md focus:border-[#38AD81] focus:ring-[#38AD81]/20 transition-all duration-200"
                required
              >
                <option value="">Select Subcategory</option>
                {selectedSubcategories.map((subcategory) => (
                  <option key={subcategory} value={subcategory}>
                    {subcategory}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="brand"
                className="text-sm font-medium text-gray-700"
              >
                Brand *
              </Label>
              <select
                id="brand"
                name="brand"
                value={formData.brand}
                onChange={handleInputChange}
                className="h-12 w-full px-3 py-2 border border-gray-200 rounded-md focus:border-[#38AD81] focus:ring-[#38AD81]/20 transition-all duration-200"
                required
              >
                <option value="">Select Brand</option>
                {brandsData?.data?.map((brand) => (
                  <option key={brand._id} value={brand._id}>
                    {brand.brandName}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Images */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Images</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <Label className="text-sm font-medium text-gray-700">
                Main Image *
              </Label>
              <FileUpload
                onFileChange={handleImageChange}
                preview={preview}
                accept="image/*"
                disabled={updateProductMutation.isPending}
              />
            </div>

            <div className="space-y-3">
              <Label
                htmlFor="images"
                className="text-sm font-medium text-gray-700"
              >
                Additional Images
              </Label>
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
                    <div
                      key={index}
                      className="aspect-square rounded-lg overflow-hidden border border-gray-200"
                    >
                      <img
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Key Features */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Key Features
          </h2>

          <div className="space-y-4">
            <div className="flex gap-3">
              <Input
                value={keyFeatureInput.key}
                onChange={(e) =>
                  setKeyFeatureInput((prev) => ({
                    ...prev,
                    key: e.target.value,
                  }))
                }
                placeholder="Feature name (e.g., Capacity)"
                className="flex-1 h-12 border-gray-200 focus:border-[#38AD81] focus:ring-[#38AD81]/20 transition-all duration-200"
              />
              <Input
                value={keyFeatureInput.values}
                onChange={(e) =>
                  setKeyFeatureInput((prev) => ({
                    ...prev,
                    values: e.target.value,
                  }))
                }
                placeholder="Values (comma separated)"
                className="flex-1 h-12 border-gray-200 focus:border-[#38AD81] focus:ring-[#38AD81]/20 transition-all duration-200"
              />
              <Button
                type="button"
                onClick={handleAddKeyFeature}
                className="cursor-pointer h-12 px-6 bg-[#38AD81] hover:bg-[#2d8f6a] text-white transition-all duration-200"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add
              </Button>
            </div>

            {formData.keyFeatures.length > 0 && (
              <div className="space-y-3 max-h-60 overflow-y-auto border border-gray-200 rounded-lg p-4 bg-gray-50/30">
                {formData.keyFeatures.map((feature, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-white p-3 rounded-lg border"
                  >
                    <div>
                      <span className="font-medium text-sm text-gray-900">
                        {feature.key}:
                      </span>
                      <span className="text-sm text-gray-600 ml-2">
                        {feature.values.join(", ")}
                      </span>
                    </div>
                    <Button
                      type="button"
                      onClick={() => handleRemoveKeyFeature(index)}
                      variant="ghost"
                      size="sm"
                      className="cursor-pointer text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 pt-6">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            className="cursor-pointer w-full sm:w-auto h-12 border-gray-200 hover:border-gray-300 transition-all duration-200"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={updateProductMutation.isPending}
            className="cursor-pointer w-full sm:w-auto h-12 bg-[#38AD81] hover:bg-[#2d8f6a] text-white transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {updateProductMutation.isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Updating Product...
              </>
            ) : (
              <>
                <TbEdit className="h-4 w-4 mr-2" />
                Update Product
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}

