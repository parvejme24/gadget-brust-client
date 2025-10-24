"use client";

import React, { useState, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
import { useWishlistByEmail, useClearWishlist, useRemoveFromWishlist } from "@/lib/hooks/useWishlist";
import { useAuthProfile } from "@/lib/hooks/useAuth";
import {
  Loader2,
  Search,
  Heart,
  Trash2,
  ShoppingCart,
  AlertTriangle,
  Package,
  Eye,
  Calendar,
  X,
} from "lucide-react";

function WishlistContent({ customerEmail: propCustomerEmail = null }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [showClearDialog, setShowClearDialog] = useState(false);
  const [removingItem, setRemovingItem] = useState(null);
  
  // Get URL search params
  const searchParams = useSearchParams();
  const urlEmail = searchParams.get('email');
  
  // Get current user from auth
  const { data: userProfile, isLoading: authLoading } = useAuthProfile();
  
  // Get customer email from props, URL, auth profile, or localStorage
  const getCustomerEmail = () => {
    if (propCustomerEmail) return propCustomerEmail;
    if (urlEmail) return urlEmail;
    if (userProfile?.data?.email) return userProfile.data.email;
    
    // Fallback to localStorage
    try {
      const userData = localStorage.getItem('userData');
      if (userData) {
        const parsed = JSON.parse(userData);
        return parsed.email;
      }
    } catch (error) {
      console.error('Error parsing userData from localStorage:', error);
    }
    
    return null;
  };
  
  const customerEmail = getCustomerEmail();
  const [showEmailInput, setShowEmailInput] = useState(!customerEmail);

  // Debug logging
  console.log('PublicWishlistPage rendered with:', {
    propCustomerEmail,
    urlEmail,
    customerEmail,
    userProfile: userProfile?.data,
    authLoading,
    timestamp: new Date().toISOString()
  });

  // If no customer email is provided, show email input form
  if (!customerEmail) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center max-w-md mx-auto">
            <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {authLoading ? 'Loading...' : 'Access Your Wishlist'}
            </h3>
            <p className="text-gray-600 mb-6">
              {authLoading 
                ? 'Please wait while we load your profile...' 
                : 'Please log in to view your wishlist or enter your email address below.'
              }
            </p>
            
            {!authLoading && (
              <div className="space-y-4">
                <div>
                  <Input
                    type="email"
                    placeholder="Enter your email address"
                    value={customerEmail || ''}
                    onChange={(e) => {
                      // This will trigger a re-render with the new email
                      const newEmail = e.target.value;
                      if (newEmail) {
                        // Force re-render by updating state
                        window.location.href = `/wishlist?email=${encodeURIComponent(newEmail)}`;
                      }
                    }}
                    className="text-center"
                  />
                </div>
                
                <Button
                  onClick={() => {
                    const emailInput = document.querySelector('input[type="email"]');
                    const email = emailInput?.value;
                    if (email) {
                      window.location.href = `/wishlist?email=${encodeURIComponent(email)}`;
                    }
                  }}
                  disabled={!customerEmail}
                  className="w-full bg-[#38AD81] hover:bg-[#2d8f6a] text-white"
                >
                  <Heart className="h-4 w-4 mr-2" />
                  View My Wishlist
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  const {
    data: wishlistData,
    isLoading,
    error,
  } = useWishlistByEmail(customerEmail);
  const clearWishlistMutation = useClearWishlist();
  const removeFromWishlistMutation = useRemoveFromWishlist();

  const wishlistItems = wishlistData?.data || [];

  // Debug logging to understand the data structure
  React.useEffect(() => {
    if (wishlistData) {
      console.log('Wishlist Data:', wishlistData);
      console.log('Wishlist Items:', wishlistItems);
      if (wishlistItems.length > 0) {
        console.log('First Item:', wishlistItems[0]);
        console.log('First Item Product:', wishlistItems[0]?.productID);
      }
    }
  }, [wishlistData, wishlistItems]);

  // Filter wishlist items based on search
  const filteredWishlist = wishlistItems.filter((item) => {
    const product = item.productID || item.product;
    const matchesSearch =
      product?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product?.shortDescription?.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesSearch;
  });

  const handleClearWishlist = () => {
    // Find customer ID from wishlist data
    const customerItem = wishlistItems.find(item => item.customerEmail === customerEmail);
    if (customerItem?.customerID) {
      clearWishlistMutation.mutate(customerItem.customerID, {
        onSuccess: () => {
          setShowClearDialog(false);
        },
        onError: () => {
          setShowClearDialog(false);
        }
      });
    }
  };

  const handleRemoveItem = (wishlistId) => {
    removeFromWishlistMutation.mutate(wishlistId, {
      onSuccess: () => {
        setRemovingItem(null);
      },
      onError: () => {
        setRemovingItem(null);
      }
    });
  };

  const formatPrice = (price) => {
    if (!price || isNaN(price)) return '$0.00';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-[#38AD81] mx-auto mb-4" />
          <p className="text-gray-600">Loading your wishlist...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <AlertTriangle className="h-8 w-8 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 mb-4">Failed to load wishlist</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Wishlist</h1>
          <p className="text-gray-600 mt-1">
            Your saved products ({wishlistItems.length} items)
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Viewing wishlist for: <span className="font-medium">{customerEmail}</span>
            {userProfile?.data?.fullName && (
              <span className="ml-2">({userProfile.data.fullName})</span>
            )}
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCustomerEmail("")}
            className="text-gray-600"
          >
            <X className="h-4 w-4 mr-1" />
            Change Email
          </Button>
          
          {wishlistItems.length > 0 && (
            <Button
              variant="outline"
              onClick={() => setShowClearDialog(true)}
              className="text-red-600 border-red-200 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Clear All
            </Button>
          )}
        </div>
      </div>

      {/* Search */}
      {wishlistItems.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Search Your Wishlist
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search products in your wishlist..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Wishlist Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5" />
            Wishlist Items ({filteredWishlist.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredWishlist.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Product</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Price</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Stock</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Added Date</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredWishlist.map((item) => {
                    const product = item.productID || item.product;
                    if (!product) return null;

                    const finalPrice = product.finalPrice || 
                      (product.discount > 0 ? 
                        product.price - (product.price * product.discount / 100) : 
                        product.price);

                    return (
                      <tr key={item._id} className="border-b border-gray-100 hover:bg-gray-50">
                        {/* Product Info */}
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                              {product.image?.url ? (
                                <Image
                                  src={product.image.url}
                                  alt={product.title || 'Product'}
                                  fill
                                  className="object-cover"
                                  sizes="64px"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <Package className="h-6 w-6 text-gray-400" />
                                </div>
                              )}
                            </div>
                            <div className="min-w-0 flex-1">
                              <Link 
                                href={`/products/${product._id}`}
                                className="font-medium text-gray-900 hover:text-[#38AD81] transition-colors duration-200 line-clamp-2"
                              >
                                {product.title || 'Untitled Product'}
                              </Link>
                              {product.shortDescription && (
                                <p className="text-sm text-gray-600 line-clamp-2 mt-1">
                                  {product.shortDescription}
                                </p>
                              )}
                              <div className="flex items-center gap-2 mt-2">
                                {product.category && (
                                  <Badge variant="secondary" className="text-xs">
                                    {product.category.name || product.category.categoryName}
                                  </Badge>
                                )}
                                {product.brand && (
                                  <Badge variant="outline" className="text-xs">
                                    {product.brand.name || product.brand.brandName}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Price */}
                        <td className="py-4 px-4">
                          <div className="flex flex-col">
                            <span className="font-semibold text-[#38AD81]">
                              {formatPrice(finalPrice)}
                            </span>
                            {product.discount > 0 && (
                              <span className="text-sm text-gray-500 line-through">
                                {formatPrice(product.price)}
                              </span>
                            )}
                            {product.discount > 0 && (
                              <Badge className="bg-red-500 text-white text-xs w-fit mt-1">
                                -{product.discount}% OFF
                              </Badge>
                            )}
                          </div>
                        </td>

                        {/* Stock */}
                        <td className="py-4 px-4">
                          <Badge 
                            className={
                              (product.stock || 0) > 0 
                                ? 'bg-green-500 text-white' 
                                : 'bg-red-500 text-white'
                            }
                          >
                            {(product.stock || 0) > 0 ? 'In Stock' : 'Out of Stock'}
                          </Badge>
                        </td>

                        {/* Added Date */}
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Calendar className="h-4 w-4" />
                            {formatDate(item.createdAt)}
                          </div>
                        </td>

                        {/* Actions */}
                        <td className="py-4 px-4">
                          <div className="flex items-center justify-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="hover:bg-[#38AD81] hover:text-white hover:border-[#38AD81] transition-colors duration-200"
                              asChild
                            >
                              <Link href={`/products/${product._id}`}>
                                <Eye className="h-4 w-4" />
                              </Link>
                            </Button>
                            
                            <Button
                              variant="outline"
                              size="sm"
                              className="hover:bg-blue-500 hover:text-white hover:border-blue-500 transition-colors duration-200"
                              disabled={(product.stock || 0) === 0}
                            >
                              <ShoppingCart className="h-4 w-4" />
                            </Button>
                            
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setRemovingItem(item._id)}
                              disabled={removeFromWishlistMutation.isPending}
                              className="hover:bg-red-500 hover:text-white hover:border-red-500 transition-colors duration-200"
                            >
                              {removingItem === item._id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Trash2 className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : wishlistItems.length === 0 ? (
            <div className="text-center py-12">
              <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Your wishlist is empty
              </h3>
              <p className="text-gray-600 mb-4">
                Start adding products to your wishlist to see them here.
              </p>
              <Button
                onClick={() => window.location.href = '/products'}
                className="bg-[#38AD81] hover:bg-[#2d8f6a] text-white"
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                Browse Products
              </Button>
            </div>
          ) : (
            <div className="text-center py-12">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No products found
              </h3>
              <p className="text-gray-600">
                Try adjusting your search criteria.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Remove Item Confirmation Dialog */}
      <AlertDialog open={!!removingItem} onOpenChange={() => setRemovingItem(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove from Wishlist</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove this product from your wishlist? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => handleRemoveItem(removingItem)}
              className="bg-red-600 hover:bg-red-700"
              disabled={removeFromWishlistMutation.isPending}
            >
              {removeFromWishlistMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Removing...
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Remove
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Clear Wishlist Confirmation Dialog */}
      <AlertDialog open={showClearDialog} onOpenChange={setShowClearDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Clear Your Wishlist</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to clear your entire wishlist? This action
              cannot be undone and will remove all {wishlistItems.length} items
              from your wishlist.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleClearWishlist}
              className="bg-red-600 hover:bg-red-700"
              disabled={clearWishlistMutation.isPending}
            >
              {clearWishlistMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Clearing...
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear Wishlist
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default function PublicWishlistPage({ customerEmail: propCustomerEmail = null }) {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-[#38AD81] mx-auto mb-4" />
          <p className="text-gray-600">Loading wishlist...</p>
        </div>
      </div>
    }>
      <WishlistContent customerEmail={propCustomerEmail} />
    </Suspense>
  );
}