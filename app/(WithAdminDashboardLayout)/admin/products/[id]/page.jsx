"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Edit, Trash2, Package, Star, Tag, Calendar } from "lucide-react";
import Image from "next/image";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { productService } from "@/lib/services/productService";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function ProductDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);

  const productId = params.id;

  // Fetch product details
  const { data: product, isLoading, error } = useQuery({
    queryKey: ['product', productId],
    queryFn: () => productService.getProductById(productId),
    enabled: !!productId,
    onSuccess: (data) => {
      // Show success message when product loads
      toast.success("Product details loaded", {
        description: `Viewing details for "${data?.title}"`,
        duration: 2000,
      });
    },
  });

  // Delete product mutation
  const deleteProductMutation = useMutation({
    mutationFn: (productId) => productService.deleteProduct(productId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      
      // Show success message
      toast.success("Product deleted successfully!", {
        description: `"${product?.title}" has been permanently removed from your inventory.`,
        duration: 4000,
      });
      
      router.push('/products');
    },
    onError: (error) => {
      console.error('Error deleting product:', error);
      
      // Show error message
      toast.error("Failed to delete product", {
        description: "There was an error deleting the product. Please try again.",
        duration: 4000,
      });
    },
  });

  const handleEdit = () => {
    router.push(`/products/edit/${productId}`);
  };

  const handleDelete = () => {
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    deleteProductMutation.mutate(productId);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-BD', {
      style: 'currency',
      currency: 'BDT',
    }).format(price);
  };

  const getStockStatus = (stock) => {
    if (stock === 0) return { text: "Out of Stock", color: "text-red-500", bg: "bg-red-50" };
    if (stock <= 10) return { text: "Low Stock", color: "text-orange-500", bg: "bg-orange-50" };
    return { text: "In Stock", color: "text-green-500", bg: "bg-green-50" };
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-3">
          <Loader2 className="h-6 w-6 animate-spin text-[#38AD81]" />
          <span className="text-gray-600">Loading product details...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Product Not Found</h3>
          <p className="text-gray-600 mb-4">The product you're looking for doesn't exist.</p>
          <Button onClick={() => router.push('/products')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Products
          </Button>
        </div>
      </div>
    );
  }

  if (!product) {
    return null;
  }

  const stockStatus = getStockStatus(product.stock);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => router.push('/products')}
            className="cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Products
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{product.title}</h1>
            <p className="text-gray-600 mt-1">Product Details</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={handleEdit}
            className="cursor-pointer bg-green-600 hover:bg-green-700 text-white"
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit Product
          </Button>
          <Button
            onClick={handleDelete}
            variant="outline"
            className="cursor-pointer border-red-300 text-red-600 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Image */}
        <Card>
          <CardHeader>
            <CardTitle>Product Image</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="aspect-square w-full rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
              {product.image?.url ? (
                <Image
                  width={400}
                  height={400}
                  src={product.image.url}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-center text-gray-500">
                  <Package className="h-16 w-16 mx-auto mb-2" />
                  <p>No image available</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Product Information */}
        <div className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Title</label>
                <p className="text-lg font-semibold text-gray-900">{product.title}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-500">Description</label>
                <p className="text-gray-700">{product.shortDescription}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Category</label>
                  <p className="font-medium text-gray-900">{product.category?.categoryName || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Subcategory</label>
                  <p className="font-medium text-gray-900">{product.subcategory || 'N/A'}</p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">Brand</label>
                <p className="font-medium text-gray-900">{product.brand?.brandName || 'N/A'}</p>
              </div>
            </CardContent>
          </Card>

          {/* Pricing & Inventory */}
          <Card>
            <CardHeader>
              <CardTitle>Pricing & Inventory</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Price</label>
                  <p className="text-xl font-bold text-gray-900">{formatPrice(product.price)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Stock</label>
                  <p className="text-xl font-bold text-gray-900">{product.stock}</p>
                </div>
              </div>

              {product.discount > 0 && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Discount</label>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      {product.discount}% OFF
                    </Badge>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Discounted Price</label>
                    <p className="text-xl font-bold text-green-600">{formatPrice(product.discountPrice)}</p>
                  </div>
                </div>
              )}

              <div>
                <label className="text-sm font-medium text-gray-500">Stock Status</label>
                <Badge className={`${stockStatus.bg} ${stockStatus.color} border-0`}>
                  {stockStatus.text}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Product Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Product Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-500">Remark</label>
                  <p className="font-medium text-gray-900 capitalize">{product.remark}</p>
                </div>
                <Badge variant="outline" className="capitalize">
                  {product.remark}
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-500">Slider Display</label>
                  <p className="font-medium text-gray-900">
                    {product.isSlider ? 'Yes' : 'No'}
                  </p>
                </div>
                <Badge variant={product.isSlider ? "default" : "secondary"}>
                  {product.isSlider ? 'In Slider' : 'Not in Slider'}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Product Metadata */}
          <Card>
            <CardHeader>
              <CardTitle>Product Metadata</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Created</label>
                  <p className="font-medium text-gray-900">
                    {product.createdAt ? new Date(product.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    }) : 'N/A'}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Last Updated</label>
                  <p className="font-medium text-gray-900">
                    {product.updatedAt ? new Date(product.updatedAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    }) : 'N/A'}
                  </p>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-500">Product ID</label>
                <p className="font-mono text-sm text-gray-600 bg-gray-50 p-2 rounded">
                  {product._id}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Key Features */}
      {product.keyFeatures && product.keyFeatures.length > 0 && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Key Features</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {product.keyFeatures.map((feature, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">{feature.key}</h4>
                  <div className="flex flex-wrap gap-2">
                    {feature.values.map((value, valueIndex) => (
                      <Badge key={valueIndex} variant="outline">
                        {value}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Product</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{product.title}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              disabled={deleteProductMutation.isPending}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleteProductMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}