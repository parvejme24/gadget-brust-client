"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft,
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
  CreditCard,
  FileText,
  MessageSquare,
  Download,
  Printer
} from "lucide-react";
import Link from "next/link";

export default function OrderDetailPage({ params }) {
  const [order, setOrder] = useState({
    id: params.id,
    customer: {
      name: "John Doe",
      email: "john.doe@example.com",
      phone: "+880 1712345678",
      address: "House 123, Road 45, Dhanmondi, Dhaka"
    },
    status: "processing",
    paymentStatus: "paid",
    total: 25000,
    subtotal: 22000,
    shipping: 2000,
    tax: 1000,
    discount: 0,
    items: [
      {
        id: 1,
        name: "iPhone 15 Pro",
        price: 15000,
        quantity: 1,
        image: "/placeholder-product.jpg"
      },
      {
        id: 2,
        name: "Samsung Galaxy S24",
        price: 7000,
        quantity: 1,
        image: "/placeholder-product.jpg"
      }
    ],
    orderDate: "2024-01-20",
    deliveryDate: "2024-01-25",
    shippingAddress: "House 123, Road 45, Dhanmondi, Dhaka",
    billingAddress: "House 123, Road 45, Dhanmondi, Dhaka",
    paymentMethod: "bKash",
    trackingNumber: "TRK-001234",
    notes: "Handle with care",
    timeline: [
      {
        status: "pending",
        date: "2024-01-20",
        time: "10:30 AM",
        description: "Order placed"
      },
      {
        status: "processing",
        date: "2024-01-20",
        time: "11:45 AM",
        description: "Order confirmed and processing"
      },
      {
        status: "shipped",
        date: "2024-01-21",
        time: "09:15 AM",
        description: "Order shipped with tracking number TRK-001234"
      }
    ]
  });

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
        return <Clock className="h-5 w-5" />;
      case "processing":
        return <Package className="h-5 w-5" />;
      case "shipped":
        return <Truck className="h-5 w-5" />;
      case "delivered":
        return <CheckCircle className="h-5 w-5" />;
      case "cancelled":
        return <XCircle className="h-5 w-5" />;
      default:
        return <Clock className="h-5 w-5" />;
    }
  };

  const handleStatusChange = (newStatus) => {
    console.log(`Changing order status to ${newStatus}`);
    setOrder(prev => ({ ...prev, status: newStatus }));
  };

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
        <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
          <Link href="/admin/orders">
            <Button variant="outline" size="sm" className="w-full sm:w-auto">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Orders
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Order Details</h1>
            <p className="text-gray-600">Order ID: {order.id}</p>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
          <Button variant="outline" className="w-full sm:w-auto">
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
          <Button variant="outline" className="w-full sm:w-auto">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" className="w-full sm:w-auto">
            <Edit className="h-4 w-4 mr-2" />
            Edit Order
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                {getStatusIcon(order.status)}
                <span className="ml-2">Order Status</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                <div className="flex items-center space-x-4">
                  <Badge className={`${getStatusColor(order.status)} text-sm px-3 py-1`}>
                    {order.status}
                  </Badge>
                  <Badge className={`${getPaymentStatusColor(order.paymentStatus)} text-sm px-3 py-1`}>
                    {order.paymentStatus}
                  </Badge>
                </div>
                <div className="flex items-center space-x-2">
                  {order.status === "pending" && (
                    <Button onClick={() => handleStatusChange("processing")} size="sm">
                      <Package className="h-4 w-4 mr-2" />
                      Process Order
                    </Button>
                  )}
                  {order.status === "processing" && (
                    <Button onClick={() => handleStatusChange("shipped")} size="sm">
                      <Truck className="h-4 w-4 mr-2" />
                      Ship Order
                    </Button>
                  )}
                  {order.status === "shipped" && (
                    <Button onClick={() => handleStatusChange("delivered")} size="sm">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Mark Delivered
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Order Items */}
          <Card>
            <CardHeader>
              <CardTitle>Order Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                      <Package className="h-8 w-8 text-gray-400" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{item.name}</h4>
                      <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">৳{item.price.toLocaleString()}</p>
                      <p className="text-sm text-gray-600">Total: ৳{(item.price * item.quantity).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Order Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>Order Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.timeline.map((event, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-[#38AD81] rounded-full flex items-center justify-center">
                        {getStatusIcon(event.status)}
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">{event.description}</p>
                      <p className="text-sm text-gray-600">{event.date} at {event.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Customer Information */}
          <Card>
            <CardHeader>
              <CardTitle>Customer Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-3">
                <User className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="font-semibold">{order.customer.name}</p>
                  <p className="text-sm text-gray-600">{order.customer.email}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-gray-400" />
                <span>{order.customer.phone}</span>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-gray-400 mt-1" />
                <span className="text-sm">{order.customer.address}</span>
              </div>
            </CardContent>
          </Card>

          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-semibold">৳{order.subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="font-semibold">৳{order.shipping.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax</span>
                <span className="font-semibold">৳{order.tax.toLocaleString()}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span>-৳{order.discount.toLocaleString()}</span>
                </div>
              )}
              <div className="border-t pt-3">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>৳{order.total.toLocaleString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Shipping Information */}
          <Card>
            <CardHeader>
              <CardTitle>Shipping Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-3">
                <Calendar className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Order Date</p>
                  <p className="font-semibold">{order.orderDate}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Truck className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Delivery Date</p>
                  <p className="font-semibold">{order.deliveryDate}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Package className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Tracking Number</p>
                  <p className="font-semibold">{order.trackingNumber}</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-gray-400 mt-1" />
                <div>
                  <p className="text-sm text-gray-600">Shipping Address</p>
                  <p className="font-semibold text-sm">{order.shippingAddress}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Information */}
          <Card>
            <CardHeader>
              <CardTitle>Payment Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-3">
                <CreditCard className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Payment Method</p>
                  <p className="font-semibold">{order.paymentMethod}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <div>
                  <p className="text-sm text-gray-600">Payment Status</p>
                  <Badge className={getPaymentStatusColor(order.paymentStatus)}>
                    {order.paymentStatus}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Order Notes */}
          <Card>
            <CardHeader>
              <CardTitle>Order Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-start space-x-3">
                <FileText className="h-5 w-5 text-gray-400 mt-1" />
                <div>
                  <p className="text-sm text-gray-600">Special Instructions</p>
                  <p className="font-semibold">{order.notes}</p>
                </div>
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
                <MessageSquare className="h-4 w-4 mr-2" />
                Contact Customer
              </Button>
              <Button className="w-full" variant="outline">
                <Truck className="h-4 w-4 mr-2" />
                Update Tracking
              </Button>
              <Button className="w-full" variant="outline">
                <Edit className="h-4 w-4 mr-2" />
                Edit Order
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
