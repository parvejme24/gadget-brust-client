"use client";

import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Eye, 
  Mail, 
  Phone, 
  Calendar,
  User,
  Edit,
  Trash2
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function CustomerCard({ customer, onEdit, onDelete }) {
  const router = useRouter();

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getRoleBadgeColor = (role) => {
    switch (role?.toLowerCase()) {
      case 'admin':
        return 'bg-red-100 text-red-800';
      case 'moderator':
        return 'bg-blue-100 text-blue-800';
      case 'user':
      default:
        return 'bg-green-100 text-green-800';
    }
  };

  const getStatusBadgeColor = (isActive) => {
    return isActive 
      ? 'bg-green-100 text-green-800' 
      : 'bg-gray-100 text-gray-800';
  };

  const handleViewDetails = () => {
    router.push(`/customers/${customer._id}`);
  };

  return (
    <div className="group bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 p-4 sm:p-6">
      {/* Customer Avatar and Basic Info */}
      <div className="flex items-start space-x-4 mb-4">
        <div className="flex-shrink-0">
          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
            {customer.avatar?.url ? (
              <Image
                width={64}
                height={64}
                src={customer.avatar.url}
                alt={customer.name || customer.email}
                className="w-full h-full object-cover"
              />
            ) : (
              <User className="h-8 w-8 text-gray-400" />
            )}
          </div>
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-gray-900 truncate">
              {customer.name || 'No Name'}
            </h3>
            <div className="flex space-x-2">
              <Badge className={getRoleBadgeColor(customer.role)}>
                {customer.role || 'User'}
              </Badge>
              <Badge className={getStatusBadgeColor(customer.isActive !== false)}>
                {customer.isActive !== false ? 'Active' : 'Inactive'}
              </Badge>
            </div>
          </div>
          
          <p className="text-sm text-gray-600 truncate mb-1">
            {customer.email}
          </p>
          
          {customer.phone && (
            <p className="text-sm text-gray-500 truncate">
              {customer.phone}
            </p>
          )}
        </div>
      </div>

      {/* Customer Details */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center text-sm text-gray-600">
          <Calendar className="h-4 w-4 mr-2" />
          <span>Joined: {formatDate(customer.createdAt)}</span>
        </div>
        
        {customer.lastLoginAt && (
          <div className="flex items-center text-sm text-gray-600">
            <Calendar className="h-4 w-4 mr-2" />
            <span>Last Login: {formatDate(customer.lastLoginAt)}</span>
          </div>
        )}
        
        {customer.address && (
          <div className="text-sm text-gray-600">
            <span className="font-medium">Address:</span> {customer.address}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="space-y-2">
        <Button 
          onClick={handleViewDetails}
          className="w-full bg-blue-100 hover:bg-blue-200 text-blue-800 transition-all duration-200 cursor-pointer"
          size="sm"
        >
          <Eye className="h-4 w-4 mr-2" />
          View Details
        </Button>
        
        <div className="flex gap-2">
          <Button
            onClick={() => onEdit && onEdit(customer)}
            className="flex-1 bg-green-100 hover:bg-green-200 text-green-800 cursor-pointer transition-all duration-200"
            size="sm"
          >
            <Edit className="h-4 w-4 mr-1" />
            Edit
          </Button>
          <Button
            onClick={() => onDelete && onDelete(customer)}
            className="flex-1 bg-orange-100 hover:bg-orange-200 text-orange-800 cursor-pointer transition-all duration-200"
            size="sm"
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
}
