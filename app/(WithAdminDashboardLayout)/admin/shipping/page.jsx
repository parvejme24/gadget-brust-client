"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import SearchableDropdown from "@/components/ui/searchable-dropdown";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useAllShipping } from "@/lib/hooks/useShipping";
import ShippingCard from "@/components/Module/Shipping/ShippingCard";
import ShippingForm from "@/components/Module/Shipping/ShippingForm";
import ShippingCalculator from "@/components/Module/Shipping/ShippingCalculator";
import {
  Loader2,
  Plus,
  Search,
  Filter,
  Truck,
  Calculator,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

export default function ShippingPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [showCalculator, setShowCalculator] = useState(false);
  const [editingShipping, setEditingShipping] = useState(null);
  const [viewingShipping, setViewingShipping] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  const { data: shippingData, isLoading, error } = useAllShipping();
  const shippingMethods = shippingData?.data || [];

  // Filter shipping methods
  const filteredShipping = shippingMethods.filter((shipping) => {
    const matchesSearch =
      shipping.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shipping.description?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && shipping.isActive) ||
      (statusFilter === "inactive" && !shipping.isActive);

    return matchesSearch && matchesStatus;
  });

  const handleAddNew = () => {
    setEditingShipping(null);
    setShowForm(true);
  };

  const handleEdit = (shipping) => {
    setEditingShipping(shipping);
    setShowForm(true);
  };

  const handleView = (shipping) => {
    setViewingShipping(shipping);
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingShipping(null);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingShipping(null);
  };

  const handleCalculatorClose = () => {
    setShowCalculator(false);
  };

  const activeCount = shippingMethods.filter((s) => s.isActive).length;
  const inactiveCount = shippingMethods.filter((s) => !s.isActive).length;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading shipping methods...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertTriangle className="h-8 w-8 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 mb-4">Failed to load shipping methods</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Shipping Management
                </h1>
                <p className="text-gray-600 mt-1">
                  Manage shipping methods and calculate delivery costs
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  onClick={() => setShowCalculator(true)}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <Calculator className="h-4 w-4" />
                  Calculator
                </Button>
                <Button
                  onClick={handleAddNew}
                  className="bg-[#38AD81] hover:bg-[#2d8f6a] text-white"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Shipping Method
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Truck className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    Total Methods
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {shippingMethods.length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Truck className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    Active Methods
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {activeCount}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <Truck className="h-6 w-6 text-gray-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    Inactive Methods
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {inactiveCount}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Search & Filters
              </CardTitle>
              <Button
                onClick={() => setShowFilters(!showFilters)}
                variant="ghost"
                size="sm"
              >
                {showFilters ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>
            </div>
          </CardHeader>

          {showFilters && (
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="search">Search Shipping Methods</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="search"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search by name or description..."
                      className="pl-10"
                    />
                  </div>
                </div>

                <SearchableDropdown
                  label="Status Filter"
                  options={[
                    {
                      value: "all",
                      label: "All Methods",
                      description: "Show all shipping methods",
                    },
                    {
                      value: "active",
                      label: "Active Only",
                      description: "Show only active methods",
                    },
                    {
                      value: "inactive",
                      label: "Inactive Only",
                      description: "Show only inactive methods",
                    },
                  ]}
                  value={statusFilter}
                  onValueChange={setStatusFilter}
                  placeholder="Select status filter"
                  searchPlaceholder="Search filters..."
                  emptyMessage="No filters found"
                  renderOption={(option) => (
                    <div className="flex flex-col">
                      <span className="font-medium">{option.label}</span>
                      <span className="text-sm text-gray-500">
                        {option.description}
                      </span>
                    </div>
                  )}
                  searchFields={["label", "description"]}
                />
              </div>
            </CardContent>
          )}
        </Card>

        {/* Shipping Methods Grid */}
        {filteredShipping.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredShipping.map((shipping) => (
              <ShippingCard
                key={shipping._id}
                shipping={shipping}
                onEdit={handleEdit}
                onView={handleView}
              />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <Truck className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No shipping methods found
              </h3>
              <p className="text-gray-600 mb-4">
                {searchTerm || statusFilter !== "all"
                  ? "Try adjusting your search criteria or filters."
                  : "Get started by creating your first shipping method."}
              </p>
              {!searchTerm && statusFilter === "all" && (
                <Button
                  onClick={handleAddNew}
                  className="bg-[#38AD81] hover:bg-[#2d8f6a] text-white"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add First Shipping Method
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Shipping Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <ShippingForm
              shipping={editingShipping}
              onClose={handleFormClose}
              onSuccess={handleFormSuccess}
            />
          </div>
        </div>
      )}

      {/* Shipping Calculator Modal */}
      {showCalculator && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <ShippingCalculator />
            <div className="mt-4 flex justify-end">
              <Button onClick={handleCalculatorClose} variant="outline">
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* View Details Modal */}
      {viewingShipping && (
        <AlertDialog
          open={!!viewingShipping}
          onOpenChange={() => setViewingShipping(null)}
        >
          <AlertDialogContent className="max-w-2xl">
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2">
                <Truck className="h-5 w-5" />
                {viewingShipping.name} - Details
              </AlertDialogTitle>
            </AlertDialogHeader>

            <div className="space-y-4">
              {viewingShipping.description && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">
                    Description
                  </h4>
                  <p className="text-gray-600">{viewingShipping.description}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Pricing</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>Base Charge:</span>
                      <span>${viewingShipping.baseCharge}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Per KG Charge:</span>
                      <span>${viewingShipping.perKgCharge}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Min Order:</span>
                      <span>${viewingShipping.minOrderAmount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Free Shipping:</span>
                      <span>${viewingShipping.freeShippingThreshold}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Delivery</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>Min Days:</span>
                      <span>{viewingShipping.estimatedDays.min}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Max Days:</span>
                      <span>{viewingShipping.estimatedDays.max}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Status:</span>
                      <span
                        className={
                          viewingShipping.isActive
                            ? "text-green-600"
                            : "text-red-600"
                        }
                      >
                        {viewingShipping.isActive ? "Active" : "Inactive"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {viewingShipping.zones && viewingShipping.zones.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">
                    Shipping Zones
                  </h4>
                  <div className="space-y-2">
                    {viewingShipping.zones.map((zone, index) => (
                      <div key={index} className="bg-gray-50 p-3 rounded-lg">
                        <div className="font-medium">{zone.name}</div>
                        {zone.countries.length > 0 && (
                          <div className="text-sm text-gray-600">
                            Countries: {zone.countries.join(", ")}
                          </div>
                        )}
                        {zone.additionalCharge > 0 && (
                          <div className="text-sm text-green-600">
                            Additional Charge: +${zone.additionalCharge}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <AlertDialogFooter>
              <AlertDialogCancel>Close</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => {
                  setViewingShipping(null);
                  handleEdit(viewingShipping);
                }}
                className="bg-[#38AD81] hover:bg-[#2d8f6a] text-white"
              >
                Edit Method
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
}
