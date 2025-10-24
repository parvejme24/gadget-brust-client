"use client";

import React, { useState, useEffect, use } from "react";
import { useProductById, useUpdateProduct } from "@/lib/hooks/useProducts";
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
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import {
  Loader2,
  ArrowLeft,
  Plus,
  Trash2,
  Search,
  ChevronDown,
  Save,
  Eye,
  Package,
  DollarSign,
  Tag,
  Settings,
  Image as ImageIcon,
  Star,
} from "lucide-react";
import { TbEdit } from "react-icons/tb";
import { useRouter } from "next/navigation";
import { Checkbox } from "@/components/ui/checkbox";

export default function EditProductPage({ params }) {
  const router = useRouter();
  const resolvedParams = use(params);
  
  console.log('=== EDIT PAGE INITIALIZATION ===');
  console.log('Raw params:', params);
  console.log('Resolved params:', resolvedParams);
  console.log('Product ID from resolved params:', resolvedParams?.id);
  console.log('Current URL:', typeof window !== 'undefined' ? window.location.href : 'Server side');
  
  const { data: productData, isLoading: productLoading, error: productError } = useProductById(resolvedParams.id);
  const updateProductMutation = useUpdateProduct();
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
  const [searchTerms, setSearchTerms] = useState({
    category: '',
    subcategory: '',
    brand: '',
    remark: ''
  });

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

  const canUpdateProduct = isFormValid();

  const toggleDropdown = (dropdown) => {
    setOpenDropdowns((prev) => ({
      ...prev,
      [dropdown]: !prev[dropdown],
    }));
  };

  // Load product data when available
  useEffect(() => {
    console.log('=== PRODUCT LOADING DEBUG ===');
    console.log('Product data received:', productData);
    console.log('Product ID from params:', resolvedParams.id);
    console.log('Product ID type:', typeof resolvedParams.id);
    console.log('Product loading state:', productLoading);
    console.log('Product error:', productError);
    console.log('Full params object:', resolvedParams);
    
    if (productData?.data) {
      const product = productData.data;
      console.log('Setting form data for product:', product);
      console.log('Product ID from data:', product._id);
      setFormData({
        title: product.title || "",
        shortDescription: product.shortDescription || "",
        price: product.price || "",
        discount: product.discount || "",
        stock: product.stock || "",
        remark: product.remark || "regular",
        category: product.category?._id || "",
        subcategory: product.subcategory || "",
        brand: product.brand?._id || "",
        image: null,
        keyFeatures: product.keyFeatures || [],
        isSlider: product.isSlider || false,
      });

      // Set preview for existing image
      if (product.image?.url) {
        setPreview(product.image.url);
      }

      // Set subcategories based on selected category
      if (product.category?.subcategories) {
        setSelectedSubcategories(product.category.subcategories);
      }
    } else if (productData === null || productData === undefined) {
      console.error('Product data is null/undefined - product may not exist');
    }
  }, [productData, resolvedParams.id, productLoading]);

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

  const handleCategoryChange = (e) => {
    const categoryId = e.target.value;
    setFormData((prev) => ({ ...prev, category: categoryId, subcategory: "" }));

    const selectedCategory = categoriesData?.data?.find(
      (cat) => cat._id === categoryId
    );
    setSelectedSubcategories(selectedCategory?.subcategories || []);
  };

  const handleCheckboxChange = (name, checked) => {
    setFormData((prev) => ({
      ...prev,
      [name]: checked,
    }));
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

  const handleCancelEditKeyFeature = () => {
    setKeyFeatureInput({ key: "", values: "" });
    setEditingFeatureIndex(null);
  };

  const handleRemoveKeyFeature = (index) => {
    setFormData((prev) => ({
      ...prev,
      keyFeatures: prev.keyFeatures.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if only image is being updated
    const isImageOnlyUpdate = formData.image && 
      (!formData.title || !formData.shortDescription || !formData.price || 
       !formData.stock || !formData.category || !formData.subcategory || !formData.brand);

    // If it's not an image-only update, validate required fields
    if (!isImageOnlyUpdate) {
      const newErrors = {};
      requiredFields.forEach(field => {
        if (!formData[field] || formData[field] === '') {
          newErrors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
        }
      });

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        toast.error("Please fill in all required fields");
        return;
      }
    }

    const loadingToast = toast.loading("Updating product...");

    try {
      // Prepare product data - only include fields that have values
      const productData = {};
      
      // Always include image if it exists
      if (formData.image) {
        productData.image = formData.image;
      }

      // Only include other fields if they have values (not empty strings)
      if (formData.title && formData.title.trim()) {
        productData.title = formData.title.trim();
      }
      if (formData.shortDescription && formData.shortDescription.trim()) {
        productData.shortDescription = formData.shortDescription.trim();
      }
      if (formData.price && formData.price !== '') {
        productData.price = Number(formData.price);
      }
      if (formData.discount !== '' && formData.discount !== undefined) {
        productData.discount = Number(formData.discount) || 0;
        // Calculate discount price if discount is provided
        if (formData.price && formData.price !== '') {
          const price = Number(formData.price);
          const discount = Number(formData.discount) || 0;
          if (discount > 0) {
            productData.discountPrice = price - (price * discount) / 100;
          }
        }
      }
      if (formData.stock && formData.stock !== '') {
        productData.stock = Number(formData.stock);
      }
      if (formData.remark && formData.remark.trim()) {
        productData.remark = formData.remark;
      }
      if (formData.category && formData.category !== '') {
        productData.category = formData.category;
      }
      if (formData.subcategory && formData.subcategory.trim()) {
        productData.subcategory = formData.subcategory;
      }
      if (formData.brand && formData.brand !== '') {
        productData.brand = formData.brand;
      }
      // Always include keyFeatures, even if empty array
      if (formData.keyFeatures !== undefined) {
        productData.keyFeatures = formData.keyFeatures;
      }
      if (formData.isSlider !== undefined) {
        productData.isSlider = formData.isSlider;
      }

      console.log('Sending update data:', productData);
      console.log('Product ID:', resolvedParams.id);
      console.log('Product ID type:', typeof resolvedParams.id);
      console.log('Key Features being sent:', productData.keyFeatures);
      console.log('Full params object:', resolvedParams);

      // Validate productId before sending
      if (!resolvedParams.id) {
        console.error('Product ID is missing from params:', resolvedParams);
        throw new Error('Product ID is missing');
      }

      await updateProductMutation.mutateAsync({ productId: resolvedParams.id, productData });
      toast.dismiss(loadingToast);
      toast.success("Product updated successfully");
      router.push("/dashboard/products");
    } catch (error) {
      console.error("Update product error:", error);
      console.error("Error details:", {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message,
        config: error.config
      });
      toast.dismiss(loadingToast);
      
      // Handle specific error types
      if (error.code === 'ERR_NETWORK') {
        toast.error("Network error - please check your connection and try again");
      } else if (error.response?.status === 413) {
        toast.error("Image file is too large - please compress the image or choose a smaller file");
      } else if (error.response?.status === 400) {
        const errorMessage = error.response?.data?.message || 
                           error.response?.data?.error || 
                           "Invalid product data - please check all fields";
        console.error("400 Error details:", error.response?.data);
        toast.error(errorMessage);
      } else if (error.response?.status === 401) {
        toast.error("Authentication failed - please login again");
      } else if (error.response?.status === 403) {
        toast.error("You don't have permission to update this product");
      } else if (error.response?.status === 404) {
        const errorData = error.response?.data;
        const serverMessage = errorData?.message || "Product not found";
        
        console.error("404 Error Details:", {
          status: error.response?.status,
          message: serverMessage,
          errors: errorData?.errors,
          timestamp: errorData?.timestamp
        });
        
        toast.error("Product Not Found", {
          description: `The product you're trying to edit no longer exists. ${serverMessage}`,
          duration: 6000,
        });
        
        // Redirect to products page after showing error
        setTimeout(() => {
          router.push("/dashboard/products");
        }, 2000);
      } else {
        toast.error(
          error.response?.data?.message ||
            error.response?.data?.error ||
            error.message ||
            "Failed to update product"
        );
      }
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

  // Handle case when product is not found or there's an error
  if (!productLoading && (!productData?.data || productError)) {
    const is404Error = productError?.response?.status === 404;
    const errorMessage = is404Error 
      ? "The product you're looking for doesn't exist or has been deleted."
      : "There was an error loading the product. Please try again.";
    
    return (
      <div className="p-6 max-w-4xl mx-auto">
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
            <h1 className="text-3xl font-bold text-gray-900">
              {is404Error ? "Product Not Found" : "Error Loading Product"}
            </h1>
            <p className="text-gray-600 mt-1">
              {errorMessage}
            </p>
          </div>
        </div>
        
        <div className={`border rounded-lg p-6 ${is404Error ? 'bg-red-50 border-red-200' : 'bg-yellow-50 border-yellow-200'}`}>
          <div className="flex items-center gap-3 mb-4">
            <div className={`h-8 w-8 rounded-full flex items-center justify-center ${is404Error ? 'bg-red-100' : 'bg-yellow-100'}`}>
              <span className={`text-sm font-medium ${is404Error ? 'text-red-600' : 'text-yellow-600'}`}>
                {is404Error ? '!' : '⚠'}
              </span>
            </div>
            <h3 className={`text-lg font-semibold ${is404Error ? 'text-red-800' : 'text-yellow-800'}`}>
              {is404Error ? 'Product Not Found' : 'Loading Error'}
            </h3>
          </div>
          <p className={`mb-4 ${is404Error ? 'text-red-700' : 'text-yellow-700'}`}>
            {is404Error ? (
              <>
                The product with ID <code className="bg-red-100 px-2 py-1 rounded text-sm">{resolvedParams.id}</code> could not be found.
                <br />
                <span className="text-sm mt-2 block">
                  This usually means the product was deleted or the ID is incorrect.
                </span>
              </>
            ) : (
              <>
                There was an error loading the product data. This could be due to:
                <ul className="list-disc list-inside mt-2 text-sm">
                  <li>Network connection issues</li>
                  <li>Server problems</li>
                  <li>Invalid product ID format</li>
                </ul>
              </>
            )}
          </p>
          <div className="flex gap-3">
            <Button
              onClick={() => router.push("/dashboard/products")}
              className={`${is404Error ? 'bg-red-600 hover:bg-red-700' : 'bg-yellow-600 hover:bg-yellow-700'} text-white`}
            >
              Go to Products
            </Button>
            <Button
              variant="outline"
              onClick={() => router.back()}
              className={`${is404Error ? 'border-red-300 text-red-700 hover:bg-red-50' : 'border-yellow-300 text-yellow-700 hover:bg-yellow-50'}`}
            >
              Go Back
            </Button>
            {!is404Error && (
              <Button
                variant="outline"
                onClick={() => window.location.reload()}
                className="border-blue-300 text-blue-700 hover:bg-blue-50"
              >
                Retry
              </Button>
            )}
            <Button
              variant="outline"
              onClick={() => {
                // Clear any cached data and refresh products
                if (typeof window !== 'undefined') {
                  localStorage.removeItem('products-cache');
                  sessionStorage.clear();
                }
                router.push("/dashboard/products");
              }}
              className="border-green-300 text-green-700 hover:bg-green-50"
            >
              Refresh Products
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={() => router.back()}
                className="cursor-pointer text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Edit Product</h1>
                <p className="text-sm text-gray-500">
                  Update product information and settings
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={() => router.push("/dashboard/products")}
                className="cursor-pointer"
              >
                <Eye className="h-4 w-4 mr-2" />
                View All Products
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Package className="h-4 w-4 text-blue-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">Basic Information</h2>
              </div>
              <p className="text-sm text-gray-600 mt-1">Essential product details</p>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-sm font-medium text-gray-700">
                    Product Title *
                  </Label>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Enter product title"
                    className={`h-12 border-gray-200 focus:border-[#38AD81] focus:ring-[#38AD81]/20 transition-all duration-200 ${
                      errors.title ? 'border-red-500' : ''
                    }`}
                    required
                  />
                  {errors.title && (
                    <p className="text-red-500 text-sm mt-1">{errors.title}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="remark" className="text-sm font-medium text-gray-700">
                    Remark
                  </Label>
                  <DropdownMenu
                    open={openDropdowns.remark}
                    onOpenChange={() => toggleDropdown('remark')}
                  >
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        className="h-12 w-full justify-between text-left font-normal"
                      >
                        {formData.remark || 'Select Remark'}
                        <ChevronDown className="h-4 w-4 opacity-50" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-full">
                      <div className="p-2">
                        <div className="relative">
                          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                          <Input
                            placeholder="Search remarks..."
                            value={searchTerms.remark || ''}
                            onChange={(e) => setSearchTerms(prev => ({ ...prev, remark: e.target.value }))}
                            className="pl-8 h-8 text-sm"
                            onClick={(e) => e.stopPropagation()}
                          />
                        </div>
                      </div>
                      <DropdownMenuSeparator />
                      <div className="max-h-60 overflow-y-auto">
                        {['regular', 'trending', 'popular', 'top', 'best', 'new']
                          ?.filter(remark => 
                            remark.toLowerCase().includes((searchTerms.remark || '').toLowerCase())
                          )
                          ?.map((remark) => (
                            <DropdownMenuItem
                              key={remark}
                              onClick={() => {
                                handleInputChange({ target: { name: 'remark', value: remark } });
                                setSearchTerms(prev => ({ ...prev, remark: '' }));
                                toggleDropdown('remark');
                              }}
                              className="cursor-pointer capitalize"
                            >
                              {remark}
                            </DropdownMenuItem>
                          ))}
                      </div>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="shortDescription" className="text-sm font-medium text-gray-700">
                  Short Description *
                </Label>
                <Textarea
                  id="shortDescription"
                  name="shortDescription"
                  value={formData.shortDescription}
                  onChange={handleInputChange}
                  placeholder="Enter short description"
                  className={`min-h-[100px] border-gray-200 focus:border-[#38AD81] focus:ring-[#38AD81]/20 transition-all duration-200 ${
                    errors.shortDescription ? 'border-red-500' : ''
                  }`}
                  required
                />
                {errors.shortDescription && (
                  <p className="text-red-500 text-sm mt-1">{errors.shortDescription}</p>
                )}
              </div>
            </div>
          </div>

          {/* Pricing & Inventory */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="h-4 w-4 text-green-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">Pricing & Inventory</h2>
              </div>
              <p className="text-sm text-gray-600 mt-1">Set pricing and stock information</p>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="price" className="text-sm font-medium text-gray-700">
                    Price (৳) *
                  </Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    value={formData.price}
                    onChange={handleInputChange}
                    placeholder="0"
                    className={`h-12 border-gray-200 focus:border-[#38AD81] focus:ring-[#38AD81]/20 transition-all duration-200 ${
                      errors.price ? 'border-red-500' : ''
                    }`}
                    required
                  />
                  {errors.price && (
                    <p className="text-red-500 text-sm mt-1">{errors.price}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="discount" className="text-sm font-medium text-gray-700">
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
                  <Label htmlFor="stock" className="text-sm font-medium text-gray-700">
                    Stock *
                  </Label>
                  <Input
                    id="stock"
                    name="stock"
                    type="number"
                    value={formData.stock}
                    onChange={handleInputChange}
                    placeholder="0"
                    className={`h-12 border-gray-200 focus:border-[#38AD81] focus:ring-[#38AD81]/20 transition-all duration-200 ${
                      errors.stock ? 'border-red-500' : ''
                    }`}
                    required
                  />
                  {errors.stock && (
                    <p className="text-red-500 text-sm mt-1">{errors.stock}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Category & Brand */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Tag className="h-4 w-4 text-purple-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">Category & Brand</h2>
              </div>
              <p className="text-sm text-gray-600 mt-1">Organize your product</p>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="category" className="text-sm font-medium text-gray-700">
                    Category *
                  </Label>
                  <DropdownMenu
                    open={openDropdowns.category}
                    onOpenChange={() => toggleDropdown('category')}
                  >
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        className={`h-12 w-full justify-between text-left font-normal ${
                          errors.category ? 'border-red-500' : ''
                        }`}
                      >
                        {formData.category ? 
                          categoriesData?.data?.find(cat => cat._id === formData.category)?.categoryName || 'Select Category'
                          : 'Select Category'
                        }
                        <ChevronDown className="h-4 w-4 opacity-50" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-full">
                      <div className="p-2">
                        <div className="relative">
                          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                          <Input
                            placeholder="Search categories..."
                            value={searchTerms.category}
                            onChange={(e) => setSearchTerms(prev => ({ ...prev, category: e.target.value }))}
                            className="pl-8 h-8 text-sm"
                            onClick={(e) => e.stopPropagation()}
                          />
                        </div>
                      </div>
                      <DropdownMenuSeparator />
                      <div className="max-h-60 overflow-y-auto">
                        {categoriesData?.data
                          ?.filter(category => 
                            category.categoryName.toLowerCase().includes(searchTerms.category.toLowerCase())
                          )
                          ?.map((category) => (
                            <DropdownMenuItem
                              key={category._id}
                              onClick={() => {
                                handleCategoryChange({ target: { value: category._id } });
                                setSearchTerms(prev => ({ ...prev, category: '' }));
                                toggleDropdown('category');
                              }}
                              className="cursor-pointer"
                            >
                              {category.categoryName}
                            </DropdownMenuItem>
                          ))}
                      </div>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  {errors.category && (
                    <p className="text-red-500 text-sm mt-1">{errors.category}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="subcategory" className="text-sm font-medium text-gray-700">
                    Subcategory *
                  </Label>
                  <DropdownMenu
                    open={openDropdowns.subcategory}
                    onOpenChange={() => toggleDropdown('subcategory')}
                  >
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        className={`h-12 w-full justify-between text-left font-normal ${
                          errors.subcategory ? 'border-red-500' : ''
                        }`}
                        disabled={!formData.category || selectedSubcategories.length === 0}
                      >
                        {formData.subcategory || 'Select Subcategory'}
                        <ChevronDown className="h-4 w-4 opacity-50" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-full">
                      <div className="p-2">
                        <div className="relative">
                          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                          <Input
                            placeholder="Search subcategories..."
                            value={searchTerms.subcategory}
                            onChange={(e) => setSearchTerms(prev => ({ ...prev, subcategory: e.target.value }))}
                            className="pl-8 h-8 text-sm"
                            onClick={(e) => e.stopPropagation()}
                          />
                        </div>
                      </div>
                      <DropdownMenuSeparator />
                      <div className="max-h-60 overflow-y-auto">
                        {selectedSubcategories
                          ?.filter(subcategory => 
                            subcategory.toLowerCase().includes(searchTerms.subcategory.toLowerCase())
                          )
                          ?.map((subcategory) => (
                            <DropdownMenuItem
                              key={subcategory}
                              onClick={() => {
                                handleInputChange({ target: { name: 'subcategory', value: subcategory } });
                                setSearchTerms(prev => ({ ...prev, subcategory: '' }));
                                toggleDropdown('subcategory');
                              }}
                              className="cursor-pointer"
                            >
                              {subcategory}
                            </DropdownMenuItem>
                          ))}
                      </div>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  {errors.subcategory && (
                    <p className="text-red-500 text-sm mt-1">{errors.subcategory}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="brand" className="text-sm font-medium text-gray-700">
                    Brand *
                  </Label>
                  <DropdownMenu
                    open={openDropdowns.brand}
                    onOpenChange={() => toggleDropdown('brand')}
                  >
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        className={`h-12 w-full justify-between text-left font-normal ${
                          errors.brand ? 'border-red-500' : ''
                        }`}
                      >
                        {formData.brand ? 
                          brandsData?.data?.find(brand => brand._id === formData.brand)?.brandName || 'Select Brand'
                          : 'Select Brand'
                        }
                        <ChevronDown className="h-4 w-4 opacity-50" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-full">
                      <div className="p-2">
                        <div className="relative">
                          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                          <Input
                            placeholder="Search brands..."
                            value={searchTerms.brand}
                            onChange={(e) => setSearchTerms(prev => ({ ...prev, brand: e.target.value }))}
                            className="pl-8 h-8 text-sm"
                            onClick={(e) => e.stopPropagation()}
                          />
                        </div>
                      </div>
                      <DropdownMenuSeparator />
                      <div className="max-h-60 overflow-y-auto">
                        {brandsData?.data
                          ?.filter(brand => 
                            brand.brandName.toLowerCase().includes(searchTerms.brand.toLowerCase())
                          )
                          ?.map((brand) => (
                            <DropdownMenuItem
                              key={brand._id}
                              onClick={() => {
                                handleInputChange({ target: { name: 'brand', value: brand._id } });
                                setSearchTerms(prev => ({ ...prev, brand: '' }));
                                toggleDropdown('brand');
                              }}
                              className="cursor-pointer"
                            >
                              {brand.brandName}
                            </DropdownMenuItem>
                          ))}
                      </div>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  {errors.brand && (
                    <p className="text-red-500 text-sm mt-1">{errors.brand}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Images */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 bg-orange-100 rounded-lg flex items-center justify-center">
                  <ImageIcon className="h-4 w-4 text-orange-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">Product Images</h2>
              </div>
              <p className="text-sm text-gray-600 mt-1">Upload product images</p>
            </div>
            
            <div className="p-6">
              <div className="space-y-3">
                <Label className="text-sm font-medium text-gray-700">
                  Main Image
                </Label>
                <FileUpload
                  onFileChange={handleImageChange}
                  preview={preview}
                  accept="image/*"
                  disabled={updateProductMutation.isPending}
                />
                <p className="text-sm text-gray-500">
                  💡 You can update just the image without changing other fields
                </p>
              </div>
            </div>
          </div>

          {/* Key Features */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <Star className="h-4 w-4 text-indigo-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">Key Features</h2>
              </div>
              <p className="text-sm text-gray-600 mt-1">Add product specifications and features</p>
            </div>
            
            <div className="p-6">
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
                    onClick={editingFeatureIndex !== null ? handleUpdateKeyFeature : handleAddKeyFeature}
                    className="cursor-pointer h-12 px-6 bg-[#38AD81] hover:bg-[#2d8f6a] text-white transition-all duration-200"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    {editingFeatureIndex !== null ? 'Update' : 'Add'}
                  </Button>
                  {editingFeatureIndex !== null && (
                    <Button
                      type="button"
                      onClick={handleCancelEditKeyFeature}
                      className="cursor-pointer h-12 px-4 bg-gray-500 hover:bg-gray-600 text-white transition-all duration-200"
                    >
                      Cancel
                    </Button>
                  )}
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
                        <div className="flex gap-2">
                          <Button
                            type="button"
                            onClick={() => handleEditKeyFeature(index)}
                            variant="ghost"
                            size="sm"
                            className="cursor-pointer text-blue-500 hover:text-blue-700 hover:bg-blue-50"
                          >
                            <TbEdit className="h-4 w-4" />
                          </Button>
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
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Display Settings */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 bg-gray-100 rounded-lg flex items-center justify-center">
                  <Settings className="h-4 w-4 text-gray-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">Display Settings</h2>
              </div>
              <p className="text-sm text-gray-600 mt-1">Configure how the product appears</p>
            </div>
            
            <div className="p-6">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isSlider"
                  checked={formData.isSlider}
                  onCheckedChange={(checked) => handleCheckboxChange('isSlider', checked)}
                />
                <Label
                  htmlFor="isSlider"
                  className="text-sm font-medium text-gray-700"
                >
                  Show on homepage slider
                </Label>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="p-6">
              <div className="flex flex-col sm:flex-row gap-4">
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
                  disabled={updateProductMutation.isPending || (!canUpdateProduct && !formData.image)}
                  className="cursor-pointer w-full sm:w-auto h-12 bg-[#38AD81] hover:bg-[#2d8f6a] text-white transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {updateProductMutation.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Updating Product...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      {formData.image && !canUpdateProduct ? 'Update Image' : 'Update Product'}
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}