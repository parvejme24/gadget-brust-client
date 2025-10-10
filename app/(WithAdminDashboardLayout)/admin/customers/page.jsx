"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Filter, 
  MoreVertical,
  Edit,
  Trash2,
  Ban,
  UserCheck,
  UserX,
  Shield,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Eye,
  RefreshCw,
  Download,
  Plus
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showBanDialog, setShowBanDialog] = useState(false);
  const [showUnbanDialog, setShowUnbanDialog] = useState(false);

  const customers = [
    {
      id: 1,
      name: "John Doe",
      email: "john.doe@example.com",
      phone: "+880 1712345678",
      role: "customer",
      status: "active",
      joinDate: "2024-01-15",
      lastLogin: "2024-01-20",
      orders: 12,
      totalSpent: 45000,
      address: "House 123, Road 45, Dhanmondi, Dhaka",
      avatar: null
    },
    {
      id: 2,
      name: "Sarah Wilson",
      email: "sarah.wilson@example.com",
      phone: "+880 1712345679",
      role: "customer",
      status: "banned",
      joinDate: "2024-01-10",
      lastLogin: "2024-01-18",
      orders: 8,
      totalSpent: 25000,
      address: "House 456, Road 78, Gulshan, Dhaka",
      avatar: null
    },
    {
      id: 3,
      name: "Mike Johnson",
      email: "mike.johnson@example.com",
      phone: "+880 1712345680",
      role: "vip",
      status: "active",
      joinDate: "2023-12-20",
      lastLogin: "2024-01-21",
      orders: 25,
      totalSpent: 125000,
      address: "House 789, Road 12, Banani, Dhaka",
      avatar: null
    },
    {
      id: 4,
      name: "Emily Brown",
      email: "emily.brown@example.com",
      phone: "+880 1712345681",
      role: "customer",
      status: "inactive",
      joinDate: "2024-01-05",
      lastLogin: "2024-01-10",
      orders: 3,
      totalSpent: 8000,
      address: "House 321, Road 67, Uttara, Dhaka",
      avatar: null
    },
    {
      id: 5,
      name: "David Lee",
      email: "david.lee@example.com",
      phone: "+880 1712345682",
      role: "customer",
      status: "active",
      joinDate: "2024-01-12",
      lastLogin: "2024-01-19",
      orders: 6,
      totalSpent: 18000,
      address: "House 654, Road 34, Mirpur, Dhaka",
      avatar: null
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-gray-100 text-gray-800";
      case "banned":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case "vip":
        return "bg-purple-100 text-purple-800";
      case "customer":
        return "bg-blue-100 text-blue-800";
      case "admin":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleRoleChange = (customerId, newRole) => {
    console.log(`Changing role for customer ${customerId} to ${newRole}`);
    // Implement role change logic
  };

  const handleBanCustomer = (customerId) => {
    console.log(`Banning customer ${customerId}`);
    // Implement ban logic
    setShowBanDialog(false);
  };

  const handleUnbanCustomer = (customerId) => {
    console.log(`Unbanning customer ${customerId}`);
    // Implement unban logic
    setShowUnbanDialog(false);
  };

  const handleDeleteCustomer = (customerId) => {
    console.log(`Deleting customer ${customerId}`);
    // Implement delete logic
    setShowDeleteDialog(false);
  };

  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || customer.status === statusFilter;
    const matchesRole = roleFilter === "all" || customer.role === roleFilter;
    
    return matchesSearch && matchesStatus && matchesRole;
  });

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Customers</h1>
          <p className="text-gray-600 mt-2">
            Manage your customers and their accounts
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
          <Button variant="outline" className="flex items-center justify-center w-full sm:w-auto">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button className="flex items-center justify-center w-full sm:w-auto bg-[#38AD81] hover:bg-[#2d8f6a]">
            <Plus className="h-4 w-4 mr-2" />
            Add Customer
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4 sm:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search customers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="p-2 border border-gray-300 rounded-md focus:ring-[#38AD81] focus:border-[#38AD81] w-full"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="banned">Banned</option>
            </select>
            
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="p-2 border border-gray-300 rounded-md focus:ring-[#38AD81] focus:border-[#38AD81] w-full"
            >
              <option value="all">All Roles</option>
              <option value="customer">Customer</option>
              <option value="vip">VIP</option>
              <option value="admin">Admin</option>
            </select>
            
            <Button variant="outline" className="flex items-center justify-center w-full sm:w-auto">
              <Filter className="h-4 w-4 mr-2" />
              More Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Customers List */}
      <div className="space-y-3 sm:space-y-4">
        {filteredCustomers.map((customer) => (
          <Card key={customer.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-3 sm:p-4 lg:p-6">
              <div className="space-y-4">
                {/* Top Row - Avatar, Name, Status, Actions */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 min-w-0 flex-1">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#38AD81] rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-semibold text-xs sm:text-sm">
                        {getInitials(customer.name)}
                      </span>
                    </div>
                    
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-col xs:flex-row xs:items-center xs:space-x-3 space-y-1 xs:space-y-0">
                        <h3 className="font-semibold text-gray-900 truncate text-sm sm:text-base">{customer.name}</h3>
                        <div className="flex items-center space-x-1 sm:space-x-2">
                          <Badge className={`${getStatusColor(customer.status)} text-xs px-2 py-1`}>
                            {customer.status}
                          </Badge>
                          <Badge className={`${getRoleColor(customer.role)} text-xs px-2 py-1`}>
                            {customer.role}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Actions */}
                  <div className="flex-shrink-0">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                          <MoreVertical className="h-4 w-4" />
                          <span className="sr-only">Actions</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem onClick={() => console.log("Edit customer")}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit Customer
                        </DropdownMenuItem>
                        
                        <DropdownMenuItem onClick={() => handleRoleChange(customer.id, "vip")}>
                          <Shield className="h-4 w-4 mr-2" />
                          Make VIP
                        </DropdownMenuItem>
                        
                        <DropdownMenuItem onClick={() => handleRoleChange(customer.id, "customer")}>
                          <UserCheck className="h-4 w-4 mr-2" />
                          Make Regular
                        </DropdownMenuItem>
                        
                        <DropdownMenuSeparator />
                        
                        {customer.status === "banned" ? (
                          <DropdownMenuItem onClick={() => setShowUnbanDialog(true)}>
                            <UserCheck className="h-4 w-4 mr-2" />
                            Unban Customer
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem onClick={() => setShowBanDialog(true)}>
                            <Ban className="h-4 w-4 mr-2" />
                            Ban Customer
                          </DropdownMenuItem>
                        )}
                        
                        <DropdownMenuSeparator />
                        
                        <DropdownMenuItem 
                          onClick={() => setShowDeleteDialog(true)}
                          className="text-red-600"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete Customer
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
                
                {/* Contact Info Row */}
                <div className="grid grid-cols-1 xs:grid-cols-2 gap-2 text-xs sm:text-sm text-gray-600">
                  <div className="flex items-center space-x-2 min-w-0">
                    <Mail className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                    <span className="truncate">{customer.email}</span>
                  </div>
                  <div className="flex items-center space-x-2 min-w-0">
                    <Phone className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                    <span className="truncate">{customer.phone}</span>
                  </div>
                </div>
                
                {/* Additional Info Row */}
                <div className="grid grid-cols-1 xs:grid-cols-2 gap-2 text-xs sm:text-sm text-gray-600">
                  <div className="flex items-center space-x-2 min-w-0">
                    <Calendar className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                    <span className="truncate">Joined: {customer.joinDate}</span>
                  </div>
                  <div className="flex items-center space-x-2 min-w-0">
                    <MapPin className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                    <span className="truncate">{customer.address}</span>
                  </div>
                </div>
                
                {/* Stats Row */}
                <div className="grid grid-cols-1 xs:grid-cols-3 gap-2 text-xs sm:text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Orders:</span>
                    <span className="font-semibold">{customer.orders}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Spent:</span>
                    <span className="font-semibold">৳{customer.totalSpent.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Last Login:</span>
                    <span className="font-semibold truncate">{customer.lastLogin}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center">
        <div className="flex items-center space-x-1 sm:space-x-2">
          <Button variant="outline" size="sm" className="px-2 sm:px-3">Previous</Button>
          <Button variant="outline" size="sm" className="px-2 sm:px-3">1</Button>
          <Button variant="outline" size="sm" className="px-2 sm:px-3">2</Button>
          <Button variant="outline" size="sm" className="px-2 sm:px-3">3</Button>
          <Button variant="outline" size="sm" className="px-2 sm:px-3">Next</Button>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Customer</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this customer? This action cannot be undone.
              All customer data, orders, and history will be permanently removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => handleDeleteCustomer(selectedCustomer?.id)}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete Customer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Ban Confirmation Dialog */}
      <AlertDialog open={showBanDialog} onOpenChange={setShowBanDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Ban Customer</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to ban this customer? They will not be able to access their account
              or make new orders until you unban them.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => handleBanCustomer(selectedCustomer?.id)}
              className="bg-orange-600 hover:bg-orange-700"
            >
              Ban Customer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Unban Confirmation Dialog */}
      <AlertDialog open={showUnbanDialog} onOpenChange={setShowUnbanDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Unban Customer</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to unban this customer? They will regain access to their account
              and be able to make new orders.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => handleUnbanCustomer(selectedCustomer?.id)}
              className="bg-green-600 hover:bg-green-700"
            >
              Unban Customer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}