"use client"
import React, { useState } from 'react';
import { MdShoppingCart, MdSearch, MdFilterList, MdLocalShipping, MdPayment, MdCheckCircle, MdSchedule } from 'react-icons/md';
import { FaEye, FaEdit } from 'react-icons/fa';

export default function Orders() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const orders = [
    {
      id: 'ORD-001',
      customer: 'John Doe',
      email: 'john.doe@email.com',
      phone: '+1 (555) 123-4567',
      products: [
        { name: 'iPhone 15 Pro', price: 1199, quantity: 1 },
        { name: 'AirPods Pro', price: 249, quantity: 1 }
      ],
      total: 1448,
      status: 'Delivered',
      orderDate: '2024-01-15',
      deliveryDate: '2024-01-18',
      paymentMethod: 'Credit Card',
      shippingAddress: '123 Main St, New York, NY 10001'
    },
    {
      id: 'ORD-002',
      customer: 'Jane Smith',
      email: 'jane.smith@email.com',
      phone: '+1 (555) 987-6543',
      products: [
        { name: 'Samsung Galaxy S24', price: 899, quantity: 1 }
      ],
      total: 899,
      status: 'Shipped',
      orderDate: '2024-01-16',
      deliveryDate: '2024-01-20',
      paymentMethod: 'PayPal',
      shippingAddress: '456 Oak Ave, Los Angeles, CA 90210'
    },
    {
      id: 'ORD-003',
      customer: 'Mike Johnson',
      email: 'mike.johnson@email.com',
      phone: '+1 (555) 456-7890',
      products: [
        { name: 'MacBook Air M2', price: 1299, quantity: 1 },
        { name: 'Apple Watch Series 9', price: 399, quantity: 1 }
      ],
      total: 1698,
      status: 'Processing',
      orderDate: '2024-01-17',
      deliveryDate: '2024-01-22',
      paymentMethod: 'Credit Card',
      shippingAddress: '789 Pine Rd, Chicago, IL 60601'
    },
    {
      id: 'ORD-004',
      customer: 'Sarah Wilson',
      email: 'sarah.wilson@email.com',
      phone: '+1 (555) 321-0987',
      products: [
        { name: 'AirPods Pro', price: 249, quantity: 2 }
      ],
      total: 498,
      status: 'Delivered',
      orderDate: '2024-01-14',
      deliveryDate: '2024-01-17',
      paymentMethod: 'Apple Pay',
      shippingAddress: '321 Elm St, Miami, FL 33101'
    },
    {
      id: 'ORD-005',
      customer: 'David Brown',
      email: 'david.brown@email.com',
      phone: '+1 (555) 654-3210',
      products: [
        { name: 'iPad Air', price: 599, quantity: 1 },
        { name: 'Apple Pencil', price: 99, quantity: 1 }
      ],
      total: 698,
      status: 'Cancelled',
      orderDate: '2024-01-13',
      deliveryDate: null,
      paymentMethod: 'Credit Card',
      shippingAddress: '654 Maple Dr, Seattle, WA 98101'
    }
  ];

  const statuses = ['all', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Processing': return <MdSchedule className="w-5 h-5 text-yellow-600" />;
      case 'Shipped': return <MdLocalShipping className="w-5 h-5 text-blue-600" />;
      case 'Delivered': return <MdCheckCircle className="w-5 h-5 text-green-600" />;
      case 'Cancelled': return <MdPayment className="w-5 h-5 text-red-600" />;
      default: return <MdSchedule className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Processing': return 'bg-yellow-100 text-yellow-800';
      case 'Shipped': return 'bg-blue-100 text-blue-800';
      case 'Delivered': return 'bg-green-100 text-green-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* page header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
          <p className="text-gray-600">Manage customer orders and track shipments</p>
        </div>
      </div>

      {/* filters and search */}
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search orders by ID, customer, or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <MdFilterList className="text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {statuses.map(status => (
                <option key={status} value={status}>
                  {status === 'all' ? 'All Statuses' : status}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* orders list */}
      <div className="space-y-4">
        {filteredOrders.map((order) => (
          <div key={order.id} className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              {/* order header */}
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <MdShoppingCart className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{order.id}</h3>
                  <p className="text-sm text-gray-600">{order.customer}</p>
                  <p className="text-xs text-gray-500">{order.email}</p>
                </div>
              </div>

              {/* order status and actions */}
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  {getStatusIcon(order.status)}
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="text-blue-600 hover:text-blue-900 p-2">
                    <FaEye className="w-4 h-4" />
                  </button>
                  <button className="text-green-600 hover:text-green-900 p-2">
                    <FaEdit className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* order details */}
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Order Date</p>
                <p className="text-sm text-gray-900">{order.orderDate}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Total Amount</p>
                <p className="text-lg font-bold text-green-600">${order.total}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Payment Method</p>
                <p className="text-sm text-gray-900">{order.paymentMethod}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Phone</p>
                <p className="text-sm text-gray-900">{order.phone}</p>
              </div>
            </div>

            {/* products list */}
            <div className="mt-4">
              <p className="text-sm font-medium text-gray-500 mb-2">Products:</p>
              <div className="space-y-2">
                {order.products.map((product, index) => (
                  <div key={index} className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-900">{product.name}</span>
                    <div className="flex items-center space-x-4">
                      <span className="text-sm text-gray-600">Qty: {product.quantity}</span>
                      <span className="text-sm font-medium text-gray-900">${product.price}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* shipping address */}
            <div className="mt-4">
              <p className="text-sm font-medium text-gray-500 mb-2">Shipping Address:</p>
              <p className="text-sm text-gray-900">{order.shippingAddress}</p>
            </div>
          </div>
        ))}
      </div>

      {/* order stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <MdShoppingCart className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Total Orders</p>
              <p className="text-xl font-bold text-gray-900">{orders.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <MdSchedule className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Processing</p>
              <p className="text-xl font-bold text-gray-900">
                {orders.filter(o => o.status === 'Processing').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <MdLocalShipping className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Shipped</p>
              <p className="text-xl font-bold text-gray-900">
                {orders.filter(o => o.status === 'Shipped').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <MdCheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Delivered</p>
              <p className="text-xl font-bold text-gray-900">
                {orders.filter(o => o.status === 'Delivered').length}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
