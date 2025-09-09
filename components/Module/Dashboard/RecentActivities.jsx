"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ShoppingCart, 
  User, 
  Package, 
  CreditCard,
  Clock,
  CheckCircle,
  AlertCircle
} from "lucide-react";

export default function RecentActivities({ data, isLoading }) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Activities</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center space-x-3 animate-pulse">
                <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!data) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Activities</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-gray-500 py-8">
            No recent activities available
          </div>
        </CardContent>
      </Card>
    );
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-BD', {
      style: 'currency',
      currency: 'BDT',
    }).format(price);
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'paid':
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'order':
        return <ShoppingCart className="h-4 w-4" />;
      case 'customer':
        return <User className="h-4 w-4" />;
      case 'product':
        return <Package className="h-4 w-4" />;
      case 'payment':
        return <CreditCard className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const activities = [
    ...(data.recentOrders || []).map(order => ({
      type: 'order',
      title: `New order ${order.invoiceNumber}`,
      subtitle: `${order.user_id?.fullName || order.user_id?.email} - ${formatPrice(order.total)}`,
      status: order.status,
      time: order.createdAt,
      icon: getActivityIcon('order')
    })),
    ...(data.recentCustomers || []).map(customer => ({
      type: 'customer',
      title: `New customer registered`,
      subtitle: `${customer.fullName} - ${customer.email}`,
      status: customer.role,
      time: customer.createdAt,
      icon: getActivityIcon('customer')
    })),
    ...(data.recentProducts || []).map(product => ({
      type: 'product',
      title: `New product added`,
      subtitle: `${product.title} - ${formatPrice(product.price)}`,
      status: product.stock > 10 ? 'in-stock' : 'low-stock',
      time: product.createdAt,
      icon: getActivityIcon('product')
    })),
    ...(data.recentPayments || []).map(payment => ({
      type: 'payment',
      title: `Payment ${payment.status}`,
      subtitle: `${payment.user_id?.fullName || payment.user_id?.email} - ${formatPrice(payment.amount)}`,
      status: payment.status,
      time: payment.createdAt,
      icon: getActivityIcon('payment')
    }))
  ].sort((a, b) => new Date(b.time) - new Date(a.time)).slice(0, 10);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activities</CardTitle>
        <p className="text-sm text-gray-600">
          Latest orders, customers, and payments
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.length > 0 ? (
            activities.map((activity, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex-shrink-0 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-600">
                  {activity.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {activity.title}
                    </p>
                    <span className="text-xs text-gray-500 ml-2">
                      {formatDate(activity.time)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 truncate">
                    {activity.subtitle}
                  </p>
                  <div className="mt-1">
                    <Badge className={`text-xs ${getStatusColor(activity.status)}`}>
                      {activity.status}
                    </Badge>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-500 py-8">
              No recent activities available
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
