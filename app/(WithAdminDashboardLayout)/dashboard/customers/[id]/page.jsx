"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft,
  Edit,
  Ban,
  UserCheck,
  Shield,
  Mail,
  Phone,
  MapPin,
  Calendar,
  ShoppingCart,
  DollarSign,
  Package,
  TrendingUp,
  Clock,
  Star,
  MessageSquare
} from "lucide-react";
import Link from "next/link";

export default function CustomerDetailPage({ params }) {
  const [customer, setCustomer] = useState({
    id: params.id,
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+880 1712345678",
    role: "customer",
    status: "active",
    joinDate: "2024-01-15",
    lastLogin: "2024-01-20",
    avatar: null,
    address: "House 123, Road 45, Dhanmondi, Dhaka",
    totalOrders: 12,
    totalSpent: 45000,
    averageOrderValue: 3750,
    favoriteCategory: "Electronics",
    loyaltyPoints: 1250
  });

  const recentOrders = [
    {
      id: "ORD-001",
      date: "2024-01-20",
      status: "delivered",
      total: 8500,
      items: 3
    },
    {
      id: "ORD-002",
      date: "2024-01-18",
      status: "shipped",
      total: 12000,
      items: 2
    },
    {
      id: "ORD-003",
      date: "2024-01-15",
      status: "delivered",
      total: 6500,
      items: 1
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

  const getOrderStatusColor = (status) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-800";
      case "shipped":
        return "bg-blue-100 text-blue-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
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
    <div className="p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
        <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
          <Link href="/dashboard/customers">
            <Button variant="outline" size="sm" className="w-full sm:w-auto">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Customers
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Customer Details</h1>
            <p className="text-gray-600">View and manage customer information</p>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
          <Button variant="outline" className="w-full sm:w-auto">
            <MessageSquare className="h-4 w-4 mr-2" />
            Send Message
          </Button>
          <Button variant="outline" className="w-full sm:w-auto">
            <Edit className="h-4 w-4 mr-2" />
            Edit Customer
          </Button>
          {customer.status === "banned" ? (
            <Button className="w-full sm:w-auto bg-green-600 hover:bg-green-700">
              <UserCheck className="h-4 w-4 mr-2" />
              Unban Customer
            </Button>
          ) : (
            <Button variant="outline" className="w-full sm:w-auto text-red-600 hover:text-red-700">
              <Ban className="h-4 w-4 mr-2" />
              Ban Customer
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Customer Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="h-5 w-5 mr-2 text-[#38AD81]" />
                Customer Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-[#38AD81] rounded-full flex items-center justify-center flex-shrink-0 mx-auto sm:mx-0">
                  <span className="text-white font-semibold text-lg sm:text-xl">
                    {getInitials(customer.name)}
                  </span>
                </div>
                <div className="flex-1 space-y-4">
                  <div className="text-center sm:text-left">
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900">{customer.name}</h3>
                    <div className="flex items-center justify-center sm:justify-start space-x-3 mt-2">
                      <Badge className={getStatusColor(customer.status)}>
                        {customer.status}
                      </Badge>
                      <Badge className={getRoleColor(customer.role)}>
                        {customer.role}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-3">
                      <Mail className="h-5 w-5 text-gray-400 flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-sm text-gray-600">Email</p>
                        <p className="font-semibold truncate">{customer.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Phone className="h-5 w-5 text-gray-400 flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-sm text-gray-600">Phone</p>
                        <p className="font-semibold">{customer.phone}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Calendar className="h-5 w-5 text-gray-400 flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-sm text-gray-600">Joined</p>
                        <p className="font-semibold">{customer.joinDate}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Clock className="h-5 w-5 text-gray-400 flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-sm text-gray-600">Last Login</p>
                        <p className="font-semibold">{customer.lastLogin}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <MapPin className="h-5 w-5 text-gray-400 mt-1 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm text-gray-600">Address</p>
                      <p className="font-semibold break-words">{customer.address}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Orders */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <ShoppingCart className="h-5 w-5 mr-2 text-[#38AD81]" />
                Recent Orders
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div key={order.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 border rounded-lg space-y-3 sm:space-y-0">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Package className="h-5 w-5 text-gray-600" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-semibold text-gray-900 truncate">{order.id}</h4>
                        <p className="text-sm text-gray-600">
                          {order.date} • {order.items} items
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between sm:justify-end space-x-4">
                      <div className="text-left sm:text-right">
                        <p className="font-semibold">৳{order.total.toLocaleString()}</p>
                        <Badge className={getOrderStatusColor(order.status)}>
                          {order.status}
                        </Badge>
                      </div>
                      <Button variant="outline" size="sm" className="flex-shrink-0">
                        View
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Statistics */}
          <Card>
            <CardHeader>
              <CardTitle>Customer Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <ShoppingCart className="h-5 w-5 text-blue-600" />
                  <span className="text-sm text-gray-600">Total Orders</span>
                </div>
                <span className="font-semibold">{customer.totalOrders}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <DollarSign className="h-5 w-5 text-green-600" />
                  <span className="text-sm text-gray-600">Total Spent</span>
                </div>
                <span className="font-semibold">৳{customer.totalSpent.toLocaleString()}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <TrendingUp className="h-5 w-5 text-purple-600" />
                  <span className="text-sm text-gray-600">Avg. Order Value</span>
                </div>
                <span className="font-semibold">৳{customer.averageOrderValue.toLocaleString()}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Star className="h-5 w-5 text-yellow-600" />
                  <span className="text-sm text-gray-600">Loyalty Points</span>
                </div>
                <span className="font-semibold">{customer.loyaltyPoints}</span>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full" variant="outline">
                <Mail className="h-4 w-4 mr-2" />
                Send Email
              </Button>
              <Button className="w-full" variant="outline">
                <MessageSquare className="h-4 w-4 mr-2" />
                Send Message
              </Button>
              <Button className="w-full" variant="outline">
                <Shield className="h-4 w-4 mr-2" />
                Change Role
              </Button>
              <Button className="w-full" variant="outline">
                <Edit className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            </CardContent>
          </Card>

          {/* Customer Notes */}
          <Card>
            <CardHeader>
              <CardTitle>Customer Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>VIP Customer:</strong> High-value customer with excellent payment history.
                  </p>
                  <p className="text-xs text-blue-600 mt-1">Added on 2024-01-15</p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <p className="text-sm text-green-800">
                    <strong>Preferred Contact:</strong> Prefers email communication.
                  </p>
                  <p className="text-xs text-green-600 mt-1">Added on 2024-01-10</p>
                </div>
              </div>
              <Button className="w-full mt-4" variant="outline">
                Add Note
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}