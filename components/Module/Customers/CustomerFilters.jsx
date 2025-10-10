"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  Filter, 
  Download,
  RefreshCw,
  Plus
} from "lucide-react";

export default function CustomerFilters({ 
  searchTerm, 
  onSearchChange, 
  statusFilter, 
  onStatusChange, 
  roleFilter, 
  onRoleChange,
  onExport,
  onRefresh,
  onAddCustomer
}) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search customers..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>
          
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => onStatusChange(e.target.value)}
            className="p-2 border border-gray-300 rounded-md focus:ring-[#38AD81] focus:border-[#38AD81]"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="banned">Banned</option>
          </select>
          
          {/* Role Filter */}
          <select
            value={roleFilter}
            onChange={(e) => onRoleChange(e.target.value)}
            className="p-2 border border-gray-300 rounded-md focus:ring-[#38AD81] focus:border-[#38AD81]"
          >
            <option value="all">All Roles</option>
            <option value="customer">Customer</option>
            <option value="vip">VIP</option>
            <option value="admin">Admin</option>
          </select>
          
          {/* Action Buttons */}
          <div className="flex items-center space-x-2">
            <Button variant="outline" className="flex items-center">
              <Filter className="h-4 w-4 mr-2" />
              More Filters
            </Button>
          </div>
          
          {/* Export and Add */}
          <div className="flex items-center space-x-2">
            <Button variant="outline" onClick={onExport} className="flex items-center">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button variant="outline" onClick={onRefresh} className="flex items-center">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button onClick={onAddCustomer} className="flex items-center bg-[#38AD81] hover:bg-[#2d8f6a]">
              <Plus className="h-4 w-4 mr-2" />
              Add Customer
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}