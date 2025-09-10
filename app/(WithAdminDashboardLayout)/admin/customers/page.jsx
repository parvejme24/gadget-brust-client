"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import CustomerCard from "@/components/Module/Customers/CustomerCard";
import CustomerFilters from "@/components/Module/Customers/CustomerFilters";
import Pagination from "@/components/Shared/Pagination/Pagination";
import { useAllCustomers } from "@/lib/hooks/useCustomers";
import { Loader2, Plus, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { customerService } from "@/lib/services/customerService";
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

export default function CustomersPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [customerToDelete, setCustomerToDelete] = React.useState(null);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [filters, setFilters] = React.useState({
    role: "",
    status: "",
    joinedAfter: "",
  });
  const [currentPage, setCurrentPage] = React.useState(1);
  const [itemsPerPage] = React.useState(12);

  // Build query parameters for API
  const queryParams = React.useMemo(() => {
    const params = {
      page: currentPage,
      limit: itemsPerPage,
    };

    // Add search term
    if (searchTerm) {
      params.search = searchTerm;
    }

    // Add filters
    if (filters.role) {
      params.role = filters.role;
    }
    if (filters.status) {
      params.isActive = filters.status === 'active';
    }
    if (filters.joinedAfter) {
      params.joinedAfter = filters.joinedAfter;
    }

    return params;
  }, [currentPage, itemsPerPage, searchTerm, filters]);

  // Fetch customers with server-side pagination and filtering
  const { data: customersData, isLoading, error } = useAllCustomers(queryParams);

  // Delete customer mutation
  const deleteCustomerMutation = useMutation({
    mutationFn: (customerId) => customerService.deleteCustomer(customerId),
    onSuccess: (data, customerId) => {
      // Invalidate and refetch customers
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      setDeleteDialogOpen(false);
      setCustomerToDelete(null);
      
      // Show success message
      toast.success("Customer deleted successfully!", {
        description: `The customer has been permanently removed from your system.`,
        duration: 4000,
      });
    },
    onError: (error) => {
      console.error('Error deleting customer:', error);
      setDeleteDialogOpen(false);
      setCustomerToDelete(null);
      
      // Show error message
      toast.error("Failed to delete customer", {
        description: "There was an error deleting the customer. Please try again.",
        duration: 4000,
      });
    },
  });

  const handleEdit = (customer) => {
    router.push(`/customers/edit/${customer._id}`);
  };

  const handleDelete = (customer) => {
    setCustomerToDelete(customer);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (customerToDelete) {
      deleteCustomerMutation.mutate(customerToDelete._id);
    }
  };

  // Update filter function
  const updateFilter = React.useCallback((key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  }, []);

  // Clear all filters
  const clearFilters = React.useCallback(() => {
    setFilters({
      role: "",
      status: "",
      joinedAfter: "",
    });
    setSearchTerm("");
  }, []);

  // Check if any filters are active
  const hasActiveFilters = React.useMemo(() => {
    return searchTerm !== "" || 
           Object.values(filters).some(value => value !== "");
  }, [searchTerm, filters]);

  // Extract customers and pagination from API response
  const customers = customersData?.data || [];
  const pagination = customersData?.pagination || {
    currentPage: 1,
    totalPages: 1,
    totalCustomers: 0,
    hasNextPage: false,
    hasPrevPage: false
  };

  // Pagination functions
  const goToPage = React.useCallback((page) => {
    setCurrentPage(Math.max(1, Math.min(page, pagination.totalPages)));
  }, [pagination.totalPages]);

  const goToNextPage = React.useCallback(() => {
    if (pagination.hasNextPage) {
      setCurrentPage(prev => prev + 1);
    }
  }, [pagination.hasNextPage]);

  const goToPrevPage = React.useCallback(() => {
    if (pagination.hasPrevPage) {
      setCurrentPage(prev => prev - 1);
    }
  }, [pagination.hasPrevPage]);

  // Reset to first page when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filters]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-3">
          <Loader2 className="h-6 w-6 animate-spin text-[#38AD81]" />
          <span className="text-gray-600">Loading customers...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Alert className="max-w-md">
          <Users className="h-4 w-4" />
          <AlertDescription>
            There was an error loading customers. Please try again later.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Customers</h1>
          <p className="text-gray-600 mt-1">
            Manage your customer base ({pagination.totalCustomers} total customers)
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={() => router.push("/customers/add")}
            className="cursor-pointer bg-[#38AD81] hover:bg-[#2d8f6a] text-white transition-all duration-200 shadow-sm hover:shadow-md"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Customer
          </Button>
        </div>
      </div>

      {/* Filters */}
      <CustomerFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filters={filters}
        updateFilter={updateFilter}
        clearFilters={clearFilters}
        hasActiveFilters={hasActiveFilters}
      />

      {/* Customers Grid */}
      {customers.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {customers.map((customer) => (
              <CustomerCard
                key={customer._id}
                customer={customer}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={pagination.totalPages}
            totalProducts={pagination.totalCustomers}
            hasNextPage={pagination.hasNextPage}
            hasPrevPage={pagination.hasPrevPage}
            onPageChange={goToPage}
            onNextPage={goToNextPage}
            onPrevPage={goToPrevPage}
          />
        </>
      ) : (
        <div className="flex items-center justify-center min-h-[400px]">
          <Alert className="max-w-md">
            <Users className="h-4 w-4" />
            <AlertDescription>
              {hasActiveFilters
                ? "No customers match your search criteria. Try adjusting your filters."
                : "No customers found. Start by adding your first customer."}
            </AlertDescription>
          </Alert>
        </div>
      )}
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Customer</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{customerToDelete?.name || customerToDelete?.email}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              disabled={deleteCustomerMutation.isPending}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleteCustomerMutation.isPending ? (
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