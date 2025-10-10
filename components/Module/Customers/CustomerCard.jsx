"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  MoreVertical,
  Edit,
  Trash2,
  Ban,
  UserCheck,
  Shield,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Eye
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function CustomerCard({ 
  customer, 
  onEdit, 
  onDelete, 
  onBan, 
  onUnban, 
  onRoleChange, 
  onView 
}) {
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

  return (
    <Card className="hover:shadow-md transition-shadow">
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
                  <DropdownMenuItem onClick={() => onEdit(customer.id)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Customer
                  </DropdownMenuItem>
                  
                  <DropdownMenuItem onClick={() => onRoleChange(customer.id, "vip")}>
                    <Shield className="h-4 w-4 mr-2" />
                    Make VIP
                  </DropdownMenuItem>
                  
                  <DropdownMenuItem onClick={() => onRoleChange(customer.id, "customer")}>
                    <UserCheck className="h-4 w-4 mr-2" />
                    Make Regular
                  </DropdownMenuItem>
                  
                  <DropdownMenuSeparator />
                  
                  {customer.status === "banned" ? (
                    <DropdownMenuItem onClick={() => onUnban(customer.id)}>
                      <UserCheck className="h-4 w-4 mr-2" />
                      Unban Customer
                    </DropdownMenuItem>
                  ) : (
                    <DropdownMenuItem onClick={() => onBan(customer.id)}>
                      <Ban className="h-4 w-4 mr-2" />
                      Ban Customer
                    </DropdownMenuItem>
                  )}
                  
                  <DropdownMenuSeparator />
                  
                  <DropdownMenuItem 
                    onClick={() => onDelete(customer.id)}
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
  );
}