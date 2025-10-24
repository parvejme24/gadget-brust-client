"use client";

import React, { useState } from "react";
import { useAllBrands } from "@/lib/hooks/useBrands";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Search, Grid, List, Star, Package } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function BrandsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [sortBy, setSortBy] = useState("name");

  const { data: brandsData, isLoading, error } = useAllBrands();

  const brands = brandsData?.data || [];

  // Filter brands based on search term
  const filteredBrands = brands.filter((brand) =>
    brand.brandName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (brand.description && brand.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Sort brands
  const sortedBrands = [...filteredBrands].sort((a, b) => {
    switch (sortBy) {
      case "name":
        return a.brandName.localeCompare(b.brandName);
      case "products":
        return (b.productCount || 0) - (a.productCount || 0);
      case "rating":
        return (b.rating || 0) - (a.rating || 0);
      default:
        return 0;
    }
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin text-[#38AD81] mx-auto mb-4" />
              <p className="text-gray-600">Loading brands...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="text-red-500 mb-4">
                <Package className="h-12 w-12 mx-auto" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Brands</h3>
              <p className="text-gray-600 mb-4">Unable to load brands. Please try again later.</p>
              <Button onClick={() => window.location.reload()}>
                Try Again
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Our Brands</h1>
          <p className="text-gray-600">Discover products from trusted brands</p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Search brands..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* View Mode and Sort */}
            <div className="flex items-center gap-2">
              {/* View Mode Toggle */}
              <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="rounded-none"
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="rounded-none"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>

              {/* Sort Dropdown */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#38AD81] focus:border-transparent"
              >
                <option value="name">Sort by Name</option>
                <option value="products">Sort by Products</option>
                <option value="rating">Sort by Rating</option>
              </select>
            </div>
          </div>
        </div>

        {/* Brands Grid/List */}
        {sortedBrands.length === 0 ? (
          <div className="text-center py-12">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Brands Found</h3>
            <p className="text-gray-600">
              {searchTerm ? "No brands match your search." : "No brands available."}
            </p>
          </div>
        ) : (
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                : "space-y-4"
            }
          >
            {sortedBrands.map((brand) => (
              <Card
                key={brand._id}
                className="hover:shadow-lg transition-shadow duration-200 cursor-pointer group"
              >
                <Link href={`/brands/${brand._id}`}>
                  <CardHeader className="pb-3">
                    <div className="aspect-square relative overflow-hidden rounded-lg mb-4 bg-gray-100">
                      {brand.brandLogo?.url ? (
                        <Image
                          src={brand.brandLogo.url}
                          alt={brand.brandName}
                          fill
                          className="object-contain p-4 group-hover:scale-105 transition-transform duration-200"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <Package className="h-12 w-12 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg font-semibold text-gray-900 group-hover:text-[#38AD81] transition-colors">
                        {brand.brandName}
                      </CardTitle>
                      <Badge variant="secondary" className="bg-[#38AD81]/10 text-[#38AD81]">
                        {brand.productCount || 0} products
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {brand.description && (
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                        {brand.description}
                      </p>
                    )}
                    
                    {/* Brand Rating */}
                    {brand.rating && brand.rating > 0 && (
                      <div className="flex items-center gap-2 mb-4">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < Math.floor(brand.rating)
                                  ? "text-yellow-400 fill-current"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-500">
                          {brand.rating.toFixed(1)} ({brand.reviewCount || 0} reviews)
                        </span>
                      </div>
                    )}

                    {/* Brand Features */}
                    {brand.features && brand.features.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-gray-700">Key Features:</p>
                        <div className="flex flex-wrap gap-1">
                          {brand.features.slice(0, 3).map((feature, index) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className="text-xs"
                            >
                              {feature}
                            </Badge>
                          ))}
                          {brand.features.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{brand.features.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Brand Status */}
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">
                          {brand.isActive ? "Active" : "Inactive"}
                        </span>
                        <Badge 
                          variant={brand.isActive ? "default" : "secondary"}
                          className={brand.isActive ? "bg-green-100 text-green-800" : ""}
                        >
                          {brand.isActive ? "Available" : "Unavailable"}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Link>
              </Card>
            ))}
          </div>
        )}

        {/* Results Summary */}
        {sortedBrands.length > 0 && (
          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Showing {sortedBrands.length} of {brands.length} brands
              {searchTerm && ` for "${searchTerm}"`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
