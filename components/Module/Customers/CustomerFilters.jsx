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
import { Search, Filter, X, ChevronDown, ChevronUp } from "lucide-react";

export default function CustomerFilters({
  searchTerm,
  setSearchTerm,
  filters,
  updateFilter,
  clearFilters,
  hasActiveFilters,
}) {
  const [openDropdowns, setOpenDropdowns] = useState({});
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleDropdown = (dropdown) => {
    setOpenDropdowns(prev => ({
      ...prev,
      [dropdown]: !prev[dropdown]
    }));
  };

  const roleOptions = [
    { value: "user", label: "User" },
    { value: "moderator", label: "Moderator" },
    { value: "admin", label: "Admin" },
  ];

  const statusOptions = [
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
  ];

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
          option.label.toLowerCase().includes(searchValue.toLowerCase())
        )
      : options;

    return (
      <div className="space-y-2">
        <Label className="text-sm font-medium text-gray-700">{label}</Label>
        <DropdownMenu 
          open={openDropdowns[dropdownKey]} 
          onOpenChange={() => toggleDropdown(dropdownKey)}
        >
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-between text-left font-normal"
            >
              <span className={value ? "text-gray-900" : "text-gray-500"}>
                {value ? options.find(opt => opt.value === value)?.label : placeholder}
              </span>
              <ChevronDown className="h-4 w-4 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-full p-0" align="start">
            {searchable && (
              <>
                <div className="p-2">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search..."
                      value={searchValue}
                      onChange={(e) => setSearchValue(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                </div>
                <DropdownMenuSeparator />
              </>
            )}
            <div className="max-h-60 overflow-y-auto">
              <DropdownMenuCheckboxItem
                checked={!value}
                onCheckedChange={() => onSelect("")}
                className="px-2 py-1.5"
              >
                All {label.toLowerCase()}s
              </DropdownMenuCheckboxItem>
              {filteredOptions.map((option) => (
                <DropdownMenuCheckboxItem
                  key={option.value}
                  checked={value === option.value}
                  onCheckedChange={() => onSelect(option.value)}
                  className="px-2 py-1.5"
                >
                  {option.label}
                </DropdownMenuCheckboxItem>
              ))}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Search */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search customers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Role Filter */}
            <FilterDropdown
              label="Role"
              value={filters.role}
              options={roleOptions}
              onSelect={(value) => updateFilter('role', value)}
              placeholder="All Roles"
              dropdownKey="role"
            />

            {/* Status Filter */}
            <FilterDropdown
              label="Status"
              value={filters.status}
              options={statusOptions}
              onSelect={(value) => updateFilter('status', value)}
              placeholder="All Status"
              dropdownKey="status"
            />

            {/* Date Range */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Joined After</Label>
              <Input
                type="date"
                value={filters.joinedAfter}
                onChange={(e) => updateFilter('joinedAfter', e.target.value)}
                className="w-full"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
