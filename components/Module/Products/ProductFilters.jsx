"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Search, Filter, X, ChevronDown, ChevronUp, Loader2 } from "lucide-react";

export default function ProductFilters({
  searchTerm,
  setSearchTerm,
  filters,
  updateFilter,
  clearFilters,
  hasActiveFilters,
  categories,
  brands,
  remarks,
  getSubcategories,
  isLoading = false,
}) {
  const [openDropdowns, setOpenDropdowns] = useState({});
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleDropdown = (dropdown) => {
    setOpenDropdowns(prev => ({
      ...prev,
      [dropdown]: !prev[dropdown]
    }));
  };

  const subcategories = getSubcategories(filters.category);

  const FilterDropdown = ({ 
    label, 
    value, 
    options, 
    onSelect, 
    placeholder = "Select...",
    searchable = true,
    dropdownKey 
  }) => {
    const [searchValue, setSearchValue] = useState("");
    
    const filteredOptions = searchable 
      ? options.filter(option => 
          option.toLowerCase().includes(searchValue.toLowerCase())
        )
      : options;

    return (
      <DropdownMenu 
        open={openDropdowns[dropdownKey]} 
        onOpenChange={() => toggleDropdown(dropdownKey)}
      >
        <DropdownMenuTrigger asChild className="w-full">
          <Button
            variant="outline"
            className="h-10 px-3 text-left justify-between min-w-[140px] border-gray-200 hover:border-gray-300"
          >
            <span className="truncate">
              {value || placeholder}
            </span>
            <ChevronDown className="h-4 w-4 ml-2 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="start">
          {searchable && (
            <>
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
            </>
          )}
          <DropdownMenuCheckboxItem
            checked={!value}
            onCheckedChange={() => onSelect("")}
            className="text-gray-500"
          >
            All {label}s
          </DropdownMenuCheckboxItem>
          <DropdownMenuSeparator />
          {filteredOptions.map((option) => (
            <DropdownMenuCheckboxItem
              key={option}
              checked={value === option}
              onCheckedChange={() => onSelect(option)}
            >
              {option}
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 mb-6">
      {/* Filter Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            disabled={isLoading}
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters
            {isCollapsed ? (
              <ChevronDown className="h-4 w-4 ml-2" />
            ) : (
              <ChevronUp className="h-4 w-4 ml-2" />
            )}
          </Button>
          {hasActiveFilters && (
            <span className="bg-[#38AD81] text-white text-xs font-medium px-2 py-1 rounded-full">
              Active
            </span>
          )}
        </div>
        
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-4 w-4 mr-1" />
            Clear All
          </Button>
        )}
      </div>

      {/* Collapsible Filter Content */}
      {!isCollapsed && (
        <div className="p-6">
          <div className="space-y-4">
            {/* Search */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Search Products</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by title, description, category, or brand..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-10 border-gray-200 focus:border-[#38AD81] focus:ring-[#38AD81]/20"
                />
              </div>
            </div>

            {/* Filter Row 1 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Category</Label>
                <FilterDropdown
                  label="Category"
                  value={filters.category ? categories.find(c => c._id === filters.category)?.categoryName : ""}
                  options={categories.map(c => c.categoryName)}
                  onSelect={(value) => {
                    const category = categories.find(c => c.categoryName === value);
                    updateFilter("category", category?._id || "");
                  }}
                  placeholder="All Categories"
                  dropdownKey="category"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Subcategory</Label>
                <FilterDropdown
                  label="Subcategory"
                  value={filters.subcategory}
                  options={subcategories}
                  onSelect={(value) => updateFilter("subcategory", value)}
                  placeholder="All Subcategories"
                  dropdownKey="subcategory"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Brand</Label>
                <FilterDropdown
                  label="Brand"
                  value={filters.brand ? brands.find(b => b._id === filters.brand)?.brandName : ""}
                  options={brands.map(b => b.brandName)}
                  onSelect={(value) => {
                    const brand = brands.find(b => b.brandName === value);
                    updateFilter("brand", brand?._id || "");
                  }}
                  placeholder="All Brands"
                  dropdownKey="brand"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Remark</Label>
                <FilterDropdown
                  label="Remark"
                  value={filters.remark}
                  options={remarks}
                  onSelect={(value) => updateFilter("remark", value)}
                  placeholder="All Remarks"
                  dropdownKey="remark"
                />
              </div>
            </div>

            {/* Filter Row 2 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Stock Status</Label>
                <FilterDropdown
                  label="Stock"
                  value={filters.stockStatus}
                  options={["In Stock", "Low Stock", "Out of Stock"]}
                  onSelect={(value) => {
                    const statusMap = {
                      "In Stock": "in-stock",
                      "Low Stock": "low-stock", 
                      "Out of Stock": "out-of-stock"
                    };
                    updateFilter("stockStatus", statusMap[value] || "");
                  }}
                  placeholder="All Stock Status"
                  dropdownKey="stockStatus"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Discount Status</Label>
                <FilterDropdown
                  label="Discount"
                  value={filters.discountStatus}
                  options={["With Discount", "Without Discount"]}
                  onSelect={(value) => {
                    const statusMap = {
                      "With Discount": "with-discount",
                      "Without Discount": "without-discount"
                    };
                    updateFilter("discountStatus", statusMap[value] || "");
                  }}
                  placeholder="All Discount Status"
                  dropdownKey="discountStatus"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Min Price (৳)</Label>
                <Input
                  type="number"
                  placeholder="Min price"
                  value={filters.priceRange.min}
                  onChange={(e) => updateFilter("priceRange", { min: e.target.value })}
                  className="h-10 border-gray-200 focus:border-[#38AD81] focus:ring-[#38AD81]/20"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Max Price (৳)</Label>
                <Input
                  type="number"
                  placeholder="Max price"
                  value={filters.priceRange.max}
                  onChange={(e) => updateFilter("priceRange", { max: e.target.value })}
                  className="h-10 border-gray-200 focus:border-[#38AD81] focus:ring-[#38AD81]/20"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}