"use client"
import React, { useState } from 'react';
import { MdPeople, MdSearch, MdFilterList, MdEmail, MdPhone, MdLocationOn, MdShoppingCart, MdStar } from 'react-icons/md';
import { FaEye, FaEdit, FaTrash } from 'react-icons/fa';

export default function Customers() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const customers = [
    {
      id: 1,
      name: 'John Doe',
      email: 'john.doe@email.com',
      phone: '+1 (555) 123-4567',
      location: 'New York, NY',
      joinDate: '2023-01-15',
      totalOrders: 12,
      totalSpent: 2847,
      lastOrder: '2024-01-15',
      status: 'Active',
      avatar: '👨‍💼'
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane.smith@email.com',
      phone: '+1 (555) 987-6543',
      location: 'Los Angeles, CA',
      joinDate: '2023-03-22',
      totalOrders: 8,
      totalSpent: 1899,
      lastOrder: '2024-01-16',
      status: 'Active',
      avatar: '👩‍💼'
    },
    {
      id: 3,
      name: 'Mike Johnson',
      email: 'mike.johnson@email.com',
      phone: '+1 (555) 456-7890',
      location: 'Chicago, IL',
      joinDate: '2023-06-10',
      totalOrders: 5,
      totalSpent: 1698,
      lastOrder: '2024-01-17',
      status: 'Active',
      avatar: '👨‍💻'
    },
    {
      id: 4,
      name: 'Sarah Wilson',
      email: 'sarah.wilson@email.com',
      phone: '+1 (555) 321-0987',
      location: 'Miami, FL',
      joinDate: '2023-08-05',
      totalOrders: 15,
      totalSpent: 3245,
      lastOrder: '2024-01-14',
      status: 'VIP',
      avatar: '👩‍🎨'
    },
    {
      id: 5,
      name: 'David Brown',
      email: 'david.brown@email.com',
      phone: '+1 (555) 654-3210',
      location: 'Seattle, WA',
      joinDate: '2023-11-18',
      totalOrders: 3,
      totalSpent: 698,
      lastOrder: '2024-01-13',
      status: 'Inactive',
      avatar: '👨‍🔬'
    },
    {
      id: 6,
      name: 'Emily Davis',
      email: 'emily.davis@email.com',
      phone: '+1 (555) 789-0123',
      location: 'Austin, TX',
      joinDate: '2023-12-01',
      totalOrders: 7,
      totalSpent: 1456,
      lastOrder: '2024-01-12',
      status: 'Active',
      avatar: '👩‍🏫'
    }
  ];

  const statuses = ['all', 'Active', 'VIP', 'Inactive'];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'VIP': return 'bg-purple-100 text-purple-800';
      case 'Inactive': return 'bg-gray-100 text-gray-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.phone.includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || customer.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* page header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
          <p className="text-gray-600">Manage your customer database and relationships</p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2">
          <MdPeople />
          <span>Add Customer</span>
        </button>
      </div>

      {/* filters and search */}
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search customers by name, email, or phone..."
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

      {/* customers grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCustomers.map((customer) => (
          <div key={customer.id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
            {/* customer header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="text-3xl">{customer.avatar}</div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{customer.name}</h3>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(customer.status)}`}>
                    {customer.status}
                  </span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button className="text-blue-600 hover:text-blue-900 p-1">
                  <FaEye className="w-4 h-4" />
                </button>
                <button className="text-green-600 hover:text-green-900 p-1">
                  <FaEdit className="w-4 h-4" />
                </button>
                <button className="text-red-600 hover:text-red-900 p-1">
                  <FaTrash className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* contact info */}
            <div className="space-y-3 mb-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <MdEmail className="w-4 h-4" />
                <span>{customer.email}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <MdPhone className="w-4 h-4" />
                <span>{customer.phone}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <MdLocationOn className="w-4 h-4" />
                <span>{customer.location}</span>
              </div>
            </div>

            {/* customer stats */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-lg font-bold text-blue-600">{customer.totalOrders}</div>
                <div className="text-xs text-gray-600">Orders</div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-lg font-bold text-green-600">${customer.totalSpent}</div>
                <div className="text-xs text-gray-600">Spent</div>
              </div>
            </div>

            {/* additional info */}
            <div className="text-xs text-gray-500 space-y-1">
              <div>Member since: {customer.joinDate}</div>
              <div>Last order: {customer.lastOrder}</div>
            </div>
          </div>
        ))}
      </div>

      {/* customer stats overview */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{customers.length}</div>
            <div className="text-sm text-gray-600">Total Customers</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {customers.filter(c => c.status === 'Active').length}
            </div>
            <div className="text-sm text-gray-600">Active Customers</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {customers.filter(c => c.status === 'VIP').length}
            </div>
            <div className="text-sm text-gray-600">VIP Customers</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">
              ${customers.reduce((sum, c) => sum + c.totalSpent, 0).toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">Total Revenue</div>
          </div>
        </div>
      </div>

      {/* top customers */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Customers by Spending</h3>
        <div className="space-y-3">
          {customers
            .sort((a, b) => b.totalSpent - a.totalSpent)
            .slice(0, 5)
            .map((customer, index) => (
              <div key={customer.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{customer.name}</div>
                    <div className="text-sm text-gray-600">{customer.email}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-green-600">${customer.totalSpent}</div>
                  <div className="text-sm text-gray-600">{customer.totalOrders} orders</div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

