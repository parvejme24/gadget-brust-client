"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  Filter, 
  MoreVertical,
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
  Download,
  RefreshCw,
  ChevronDown
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function OrdersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [showCompleteDialog, setShowCompleteDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [ordersPerPage] = useState(10);
  const [editingOrder, setEditingOrder] = useState(null);
  const [orders, setOrders] = useState([
    {
      id: "ORD-001",
      customer: {
        name: "John Doe",
        email: "john.doe@example.com",
        phone: "+880 1712345678"
      },
      status: "pending",
      paymentStatus: "paid",
      total: 25000,
      items: 3,
      orderDate: "2024-01-20",
      deliveryDate: "2024-01-25",
      shippingAddress: "House 123, Road 45, Dhanmondi, Dhaka",
      paymentMethod: "bKash",
      trackingNumber: "TRK-001234",
      notes: "Handle with care"
    },
    {
      id: "ORD-002",
      customer: {
        name: "Sarah Wilson",
        email: "sarah.wilson@example.com",
        phone: "+880 1712345679"
      },
      status: "processing",
      paymentStatus: "paid",
      total: 45000,
      items: 2,
      orderDate: "2024-01-19",
      deliveryDate: "2024-01-24",
      shippingAddress: "House 456, Road 78, Gulshan, Dhaka",
      paymentMethod: "Cash on Delivery",
      trackingNumber: "TRK-001235",
      notes: "Call before delivery"
    },
    {
      id: "ORD-003",
      customer: {
        name: "Mike Johnson",
        email: "mike.johnson@example.com",
        phone: "+880 1712345680"
      },
      status: "shipped",
      paymentStatus: "paid",
      total: 120000,
      items: 5,
      orderDate: "2024-01-18",
      deliveryDate: "2024-01-23",
      shippingAddress: "House 789, Road 12, Banani, Dhaka",
      paymentMethod: "Bank Transfer",
      trackingNumber: "TRK-001236",
      notes: "VIP customer"
    },
    {
      id: "ORD-004",
      customer: {
        name: "Emily Brown",
        email: "emily.brown@example.com",
        phone: "+880 1712345681"
      },
      status: "delivered",
      paymentStatus: "paid",
      total: 35000,
      items: 1,
      orderDate: "2024-01-15",
      deliveryDate: "2024-01-20",
      shippingAddress: "House 321, Road 67, Uttara, Dhaka",
      paymentMethod: "Nagad",
      trackingNumber: "TRK-001237",
      notes: "Delivered successfully"
    },
    {
      id: "ORD-005",
      customer: {
        name: "David Lee",
        email: "david.lee@example.com",
        phone: "+880 1712345682"
      },
      status: "cancelled",
      paymentStatus: "refunded",
      total: 18000,
      items: 2,
      orderDate: "2024-01-17",
      deliveryDate: "2024-01-22",
      shippingAddress: "House 654, Road 34, Mirpur, Dhaka",
      paymentMethod: "Rocket",
      trackingNumber: "TRK-001238",
      notes: "Customer requested cancellation"
    },
    {
      id: "ORD-006",
      customer: {
        name: "Alice Smith",
        email: "alice.smith@example.com",
        phone: "+880 1712345683"
      },
      status: "pending",
      paymentStatus: "pending",
      total: 32000,
      items: 2,
      orderDate: "2024-01-21",
      deliveryDate: "2024-01-26",
      shippingAddress: "House 111, Road 22, Chittagong",
      paymentMethod: "Cash on Delivery",
      trackingNumber: "TRK-001239",
      notes: "New customer"
    },
    {
      id: "ORD-007",
      customer: {
        name: "Bob Wilson",
        email: "bob.wilson@example.com",
        phone: "+880 1712345684"
      },
      status: "processing",
      paymentStatus: "paid",
      total: 75000,
      items: 4,
      orderDate: "2024-01-21",
      deliveryDate: "2024-01-26",
      shippingAddress: "House 222, Road 33, Sylhet",
      paymentMethod: "Bank Transfer",
      trackingNumber: "TRK-001240",
      notes: "Bulk order"
    },
    {
      id: "ORD-008",
      customer: {
        name: "Carol Brown",
        email: "carol.brown@example.com",
        phone: "+880 1712345685"
      },
      status: "shipped",
      paymentStatus: "paid",
      total: 28000,
      items: 1,
      orderDate: "2024-01-20",
      deliveryDate: "2024-01-25",
      shippingAddress: "House 333, Road 44, Rajshahi",
      paymentMethod: "Nagad",
      trackingNumber: "TRK-001241",
      notes: "Express delivery"
    },
    {
      id: "ORD-009",
      customer: {
        name: "David Miller",
        email: "david.miller@example.com",
        phone: "+880 1712345686"
      },
      status: "delivered",
      paymentStatus: "paid",
      total: 55000,
      items: 3,
      orderDate: "2024-01-19",
      deliveryDate: "2024-01-24",
      shippingAddress: "House 444, Road 55, Khulna",
      paymentMethod: "Rocket",
      trackingNumber: "TRK-001242",
      notes: "Delivered successfully"
    },
    {
      id: "ORD-010",
      customer: {
        name: "Eva Davis",
        email: "eva.davis@example.com",
        phone: "+880 1712345687"
      },
      status: "pending",
      paymentStatus: "pending",
      total: 15000,
      items: 1,
      orderDate: "2024-01-22",
      deliveryDate: "2024-01-27",
      shippingAddress: "House 555, Road 66, Barisal",
      paymentMethod: "Cash on Delivery",
      trackingNumber: "TRK-001243",
      notes: "First time customer"
    }
  ]);

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

  const handleStatusChange = (orderId, newStatus) => {
    console.log(`Changing status for order ${orderId} to ${newStatus}`);
    setOrders(prevOrders => 
      prevOrders.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
  };

  const handleCancelOrder = (orderId) => {
    console.log(`Cancelling order ${orderId}`);
    setOrders(prevOrders => 
      prevOrders.map(order => 
        order.id === orderId ? { ...order, status: "cancelled" } : order
      )
    );
    setShowCancelDialog(false);
  };

  const handleCompleteOrder = (orderId) => {
    console.log(`Completing order ${orderId}`);
    setOrders(prevOrders => 
      prevOrders.map(order => 
        order.id === orderId ? { ...order, status: "delivered" } : order
      )
    );
    setShowCompleteDialog(false);
  };

  const handleExportOrders = () => {
    console.log("Exporting orders...");
    // Implement export logic
  };

  const handleRefreshOrders = () => {
    console.log("Refreshing orders...");
    // Implement refresh logic
    setCurrentPage(1);
  };

  const handleEditOrder = (orderId) => {
    console.log(`Editing order ${orderId}`);
    const order = orders.find(o => o.id === orderId);
    setEditingOrder(order);
    setShowEditDialog(true);
  };

  const handleSaveOrder = (updatedOrder) => {
    console.log(`Saving order ${updatedOrder.id}`);
    setOrders(prevOrders => 
      prevOrders.map(order => 
        order.id === updatedOrder.id ? { ...order, ...updatedOrder } : order
      )
    );
    setShowEditDialog(false);
    setEditingOrder(null);
  };

  // Reset page when search or filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, dateFilter]);

  const filteredOrders = orders.filter((order) => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customer.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    const matchesDate = dateFilter === "all" || 
                       (dateFilter === "today" && order.orderDate === "2024-01-20") ||
                       (dateFilter === "week" && new Date(order.orderDate) >= new Date("2024-01-14")) ||
                       (dateFilter === "month" && new Date(order.orderDate) >= new Date("2024-01-01"));
    
    return matchesSearch && matchesStatus && matchesDate;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);
  const startIndex = (currentPage - 1) * ordersPerPage;
  const endIndex = startIndex + ordersPerPage;
  const currentOrders = filteredOrders.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Orders</h1>
          <p className="text-gray-600 mt-2">
            Manage customer orders and track fulfillment
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
          <Button variant="outline" className="flex items-center justify-center w-full sm:w-auto">
            <Filter className="h-4 w-4 mr-2" />
            Advanced Filters
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
                placeholder="Search orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="shipped">Shipped</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Dates" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Dates</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
              </SelectContent>
            </Select>
            
            <Button variant="outline" className="flex items-center justify-center w-full sm:w-auto">
              <Filter className="h-4 w-4 mr-2" />
              More Filters
            </Button>
          </div>
          
          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-2 mt-4">
            <Button variant="outline" onClick={handleExportOrders} className="flex items-center">
              <Download className="h-4 w-4 mr-2" />
              Export Orders
            </Button>
            <Button variant="outline" onClick={handleRefreshOrders} className="flex items-center">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(order.status)}
                        <span>{order.id}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium">{order.customer.name}</div>
                        <div className="text-sm text-gray-500">{order.customer.email}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <Badge className={`${getStatusColor(order.status)} text-xs`}>
                          {order.status}
                        </Badge>
                        <div className="text-xs text-gray-500">{order.items} items</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <Badge className={`${getPaymentStatusColor(order.paymentStatus)} text-xs`}>
                          {order.paymentStatus}
                        </Badge>
                        <div className="text-xs text-gray-500">{order.paymentMethod}</div>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">
                      ৳{order.total.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{order.orderDate}</div>
                        <div className="text-gray-500">Due: {order.deliveryDate}</div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleEditOrder(order.id)}
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                        
                        {order.status === "pending" && (
                          <Button 
                            size="sm"
                            onClick={() => handleStatusChange(order.id, "processing")}
                            className="bg-blue-600 hover:bg-blue-700"
                          >
                            <Package className="h-4 w-4 mr-1" />
                            Process
                          </Button>
                        )}
                        
                        {order.status === "processing" && (
                          <Button 
                            size="sm"
                            onClick={() => handleStatusChange(order.id, "shipped")}
                            className="bg-purple-600 hover:bg-purple-700"
                          >
                            <Truck className="h-4 w-4 mr-1" />
                            Ship
                          </Button>
                        )}
                        
                        {order.status === "shipped" && (
                          <Button 
                            size="sm"
                            onClick={() => {
                              setSelectedOrder(order);
                              setShowCompleteDialog(true);
                            }}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Deliver
                          </Button>
                        )}
                        
                        {order.status !== "cancelled" && order.status !== "delivered" && (
                          <Button 
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedOrder(order);
                              setShowCancelDialog(true);
                            }}
                            className="text-red-600 hover:text-red-700"
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            Cancel
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Pagination */}
      <div className="flex justify-center">
        <div className="flex items-center space-x-1 sm:space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="px-2 sm:px-3"
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          
          {/* Page Numbers */}
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <Button
              key={page}
              variant={currentPage === page ? "default" : "outline"}
              size="sm"
              className="px-2 sm:px-3"
              onClick={() => handlePageChange(page)}
            >
              {page}
            </Button>
          ))}
          
          <Button 
            variant="outline" 
            size="sm" 
            className="px-2 sm:px-3"
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      </div>
      
      {/* Pagination Info */}
      <div className="text-center text-sm text-gray-600">
        Showing {startIndex + 1} to {Math.min(endIndex, filteredOrders.length)} of {filteredOrders.length} orders
      </div>

      {/* Cancel Confirmation Dialog */}
      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Order</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to cancel this order? This action cannot be undone.
              The customer will be notified and any payments will be refunded.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep Order</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => handleCancelOrder(selectedOrder?.id)}
              className="bg-red-600 hover:bg-red-700"
            >
              Cancel Order
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Complete Confirmation Dialog */}
      <AlertDialog open={showCompleteDialog} onOpenChange={setShowCompleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Mark as Delivered</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to mark this order as delivered? This will complete the order
              and notify the customer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep Processing</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => handleCompleteOrder(selectedOrder?.id)}
              className="bg-green-600 hover:bg-green-700"
            >
              Mark as Delivered
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Edit Order Dialog */}
      <AlertDialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <AlertDialogContent className="max-w-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Edit Order</AlertDialogTitle>
            <AlertDialogDescription>
              Update order details and information.
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          {editingOrder && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Order ID</label>
                  <Input 
                    value={editingOrder.id} 
                    disabled 
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Status</label>
                  <Select 
                    value={editingOrder.status} 
                    onValueChange={(value) => setEditingOrder({...editingOrder, status: value})}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="processing">Processing</SelectItem>
                      <SelectItem value="shipped">Shipped</SelectItem>
                      <SelectItem value="delivered">Delivered</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Customer Name</label>
                  <Input 
                    value={editingOrder.customer.name} 
                    onChange={(e) => setEditingOrder({
                      ...editingOrder, 
                      customer: {...editingOrder.customer, name: e.target.value}
                    })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Customer Email</label>
                  <Input 
                    value={editingOrder.customer.email} 
                    onChange={(e) => setEditingOrder({
                      ...editingOrder, 
                      customer: {...editingOrder.customer, email: e.target.value}
                    })}
                    className="mt-1"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Total Amount</label>
                  <Input 
                    type="number"
                    value={editingOrder.total} 
                    onChange={(e) => setEditingOrder({...editingOrder, total: parseInt(e.target.value)})}
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Payment Method</label>
                  <Select 
                    value={editingOrder.paymentMethod} 
                    onValueChange={(value) => setEditingOrder({...editingOrder, paymentMethod: value})}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bKash">bKash</SelectItem>
                      <SelectItem value="Nagad">Nagad</SelectItem>
                      <SelectItem value="Rocket">Rocket</SelectItem>
                      <SelectItem value="Cash on Delivery">Cash on Delivery</SelectItem>
                      <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium">Shipping Address</label>
                <Input 
                  value={editingOrder.shippingAddress} 
                  onChange={(e) => setEditingOrder({...editingOrder, shippingAddress: e.target.value})}
                  className="mt-1"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">Notes</label>
                <Input 
                  value={editingOrder.notes} 
                  onChange={(e) => setEditingOrder({...editingOrder, notes: e.target.value})}
                  className="mt-1"
                />
              </div>
            </div>
          )}
          
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowEditDialog(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => handleSaveOrder(editingOrder)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Save Changes
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}