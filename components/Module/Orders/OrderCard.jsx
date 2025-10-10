"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  MoreVertical,
  Eye,
  Edit,
  Truck,
  Package,
  CheckCircle,
  XCircle,
  Clock,
  User,
  Calendar,
  MapPin,
  Phone,
  Mail,
  CreditCard
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";

export default function OrderCard({ 
  order, 
  onEdit, 
  onStatusChange, 
  onCancel, 
  onComplete 
}) {
  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "shipped":
        return "bg-purple-100 text-purple-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "failed":
        return "bg-red-100 text-red-800";
      case "refunded":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4" />;
      case "processing":
        return <Package className="h-4 w-4" />;
      case "shipped":
        return <Truck className="h-4 w-4" />;
      case "delivered":
        return <CheckCircle className="h-4 w-4" />;
      case "cancelled":
        return <XCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-3 sm:p-4 lg:p-6">
        <div className="space-y-4">
          {/* Top Row - Order ID, Status, Actions */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 min-w-0 flex-1">
              <div className="flex items-center space-x-2">
                {getStatusIcon(order.status)}
                <h3 className="font-semibold text-gray-900 text-sm sm:text-base">{order.id}</h3>
              </div>
              <div className="flex items-center space-x-2">
                <Badge className={`${getStatusColor(order.status)} text-xs px-2 py-1`}>
                  {order.status}
                </Badge>
                <Badge className={`${getPaymentStatusColor(order.paymentStatus)} text-xs px-2 py-1`}>
                  {order.paymentStatus}
                </Badge>
              </div>
            </div>
            
            {/* Actions */}
            <div className="flex items-center space-x-2">
              <Link href={`/admin/orders/${order.id}`}>
                <Button variant="outline" size="sm" className="h-8 px-3">
                  <Eye className="h-4 w-4 mr-1" />
                  View
                </Button>
              </Link>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                    <MoreVertical className="h-4 w-4" />
                    <span className="sr-only">Actions</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={() => onEdit(order.id)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Order
                  </DropdownMenuItem>
                  
                  {order.status === "pending" && (
                    <DropdownMenuItem onClick={() => onStatusChange(order.id, "processing")}>
                      <Package className="h-4 w-4 mr-2" />
                      Mark as Processing
                    </DropdownMenuItem>
                  )}
                  
                  {order.status === "processing" && (
                    <DropdownMenuItem onClick={() => onStatusChange(order.id, "shipped")}>
                      <Truck className="h-4 w-4 mr-2" />
                      Mark as Shipped
                    </DropdownMenuItem>
                  )}
                  
                  {order.status === "shipped" && (
                    <DropdownMenuItem onClick={() => onComplete(order.id)}>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Mark as Delivered
                    </DropdownMenuItem>
                  )}
                  
                  <DropdownMenuSeparator />
                  
                  {order.status !== "cancelled" && order.status !== "delivered" && (
                    <DropdownMenuItem 
                      onClick={() => onCancel(order.id)}
                      className="text-red-600"
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Cancel Order
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          
          {/* Customer Info Row */}
          <div className="grid grid-cols-1 xs:grid-cols-2 gap-2 text-xs sm:text-sm text-gray-600">
            <div className="flex items-center space-x-2 min-w-0">
              <User className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
              <span className="truncate">{order.customer.name}</span>
            </div>
            <div className="flex items-center space-x-2 min-w-0">
              <Mail className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
              <span className="truncate">{order.customer.email}</span>
            </div>
          </div>
          
          {/* Order Details Row */}
          <div className="grid grid-cols-1 xs:grid-cols-2 gap-2 text-xs sm:text-sm text-gray-600">
            <div className="flex items-center space-x-2 min-w-0">
              <Calendar className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
              <span className="truncate">Order: {order.orderDate}</span>
            </div>
            <div className="flex items-center space-x-2 min-w-0">
              <Truck className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
              <span className="truncate">Delivery: {order.deliveryDate}</span>
            </div>
          </div>
          
          {/* Stats Row */}
          <div className="grid grid-cols-1 xs:grid-cols-3 gap-2 text-xs sm:text-sm">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Total:</span>
              <span className="font-semibold">৳{order.total.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Items:</span>
              <span className="font-semibold">{order.items}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Payment:</span>
              <span className="font-semibold truncate">{order.paymentMethod}</span>
            </div>
          </div>
          
          {/* Tracking and Address */}
          <div className="grid grid-cols-1 xs:grid-cols-2 gap-2 text-xs sm:text-sm text-gray-600">
            <div className="flex items-center space-x-2 min-w-0">
              <Package className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
              <span className="truncate">Tracking: {order.trackingNumber}</span>
            </div>
            <div className="flex items-center space-x-2 min-w-0">
              <MapPin className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
              <span className="truncate">{order.shippingAddress}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
