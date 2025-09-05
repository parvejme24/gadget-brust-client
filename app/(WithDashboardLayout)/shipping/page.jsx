"use client"
import React, { useState } from 'react';
import { MdLocalShipping, MdSearch, MdFilterList, MdLocationOn, MdSchedule, MdCheckCircle, MdError, MdDirectionsCar } from 'react-icons/md';
import { FaEye, FaEdit, FaTruck } from 'react-icons/fa';

export default function Shipping() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const shipments = [
    {
      id: 'SHIP-001',
      orderId: 'ORD-001',
      customer: 'John Doe',
      destination: '123 Main St, New York, NY 10001',
      carrier: 'FedEx',
      trackingNumber: 'FDX123456789',
      status: 'Delivered',
      shippedDate: '2024-01-16',
      deliveredDate: '2024-01-18',
      weight: '2.5 lbs',
      cost: 15.99,
      products: ['iPhone 15 Pro', 'AirPods Pro']
    },
    {
      id: 'SHIP-002',
      orderId: 'ORD-002',
      customer: 'Jane Smith',
      destination: '456 Oak Ave, Los Angeles, CA 90210',
      carrier: 'UPS',
      trackingNumber: 'UPS987654321',
      status: 'In Transit',
      shippedDate: '2024-01-17',
      deliveredDate: null,
      weight: '1.8 lbs',
      cost: 12.99,
      products: ['Samsung Galaxy S24']
    },
    {
      id: 'SHIP-003',
      orderId: 'ORD-003',
      customer: 'Mike Johnson',
      destination: '789 Pine Rd, Chicago, IL 60601',
      carrier: 'USPS',
      trackingNumber: 'USPS456789123',
      status: 'Shipped',
      shippedDate: '2024-01-18',
      deliveredDate: null,
      weight: '4.2 lbs',
      cost: 18.99,
      products: ['MacBook Air M2', 'Apple Watch Series 9']
    },
    {
      id: 'SHIP-004',
      orderId: 'ORD-004',
      customer: 'Sarah Wilson',
      destination: '321 Elm St, Miami, FL 33101',
      carrier: 'DHL',
      trackingNumber: 'DHL789123456',
      status: 'Delivered',
      shippedDate: '2024-01-15',
      deliveredDate: '2024-01-17',
      weight: '0.8 lbs',
      cost: 8.99,
      products: ['AirPods Pro']
    },
    {
      id: 'SHIP-005',
      orderId: 'ORD-005',
      customer: 'David Brown',
      destination: '654 Maple Dr, Seattle, WA 98101',
      carrier: 'FedEx',
      trackingNumber: 'FDX456789123',
      status: 'Cancelled',
      shippedDate: null,
      deliveredDate: null,
      weight: '3.1 lbs',
      cost: 16.99,
      products: ['iPad Air', 'Apple Pencil']
    }
  ];

  const statuses = ['all', 'Shipped', 'In Transit', 'Delivered', 'Cancelled'];

  const carriers = [
    { name: 'FedEx', logo: '🚚', color: 'bg-purple-100 text-purple-800' },
    { name: 'UPS', logo: '📦', color: 'bg-brown-100 text-brown-800' },
    { name: 'USPS', logo: '📮', color: 'bg-blue-100 text-blue-800' },
    { name: 'DHL', logo: '✈️', color: 'bg-yellow-100 text-yellow-800' }
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Shipped': return <MdLocalShipping className="w-5 h-5 text-blue-600" />;
      case 'In Transit': return <MdSchedule className="w-5 h-5 text-yellow-600" />;
      case 'Delivered': return <MdCheckCircle className="w-5 h-5 text-green-600" />;
      case 'Cancelled': return <MdError className="w-5 h-5 text-red-600" />;
      default: return <MdLocalShipping className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Shipped': return 'bg-blue-100 text-blue-800';
      case 'In Transit': return 'bg-yellow-100 text-yellow-800';
      case 'Delivered': return 'bg-green-100 text-green-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredShipments = shipments.filter(shipment => {
    const matchesSearch = shipment.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         shipment.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         shipment.trackingNumber.includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || shipment.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* page header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Shipping</h1>
          <p className="text-gray-600">Manage shipments and track deliveries</p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2">
          <MdLocalShipping />
          <span>Create Shipment</span>
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
                placeholder="Search shipments by ID, customer, or tracking number..."
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

      {/* shipping stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <MdLocalShipping className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Total Shipments</p>
              <p className="text-xl font-bold text-gray-900">{shipments.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <MdSchedule className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">In Transit</p>
              <p className="text-xl font-bold text-gray-900">
                {shipments.filter(s => s.status === 'In Transit').length}
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
                {shipments.filter(s => s.status === 'Delivered').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <FaTruck className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Total Cost</p>
              <p className="text-xl font-bold text-gray-900">
                ${shipments.reduce((sum, s) => sum + s.cost, 0).toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* shipments list */}
      <div className="space-y-4">
        {filteredShipments.map((shipment) => (
          <div key={shipment.id} className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              {/* shipment header */}
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <MdLocalShipping className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{shipment.id}</h3>
                  <p className="text-sm text-gray-600">Order: {shipment.orderId}</p>
                  <p className="text-xs text-gray-500">{shipment.customer}</p>
                </div>
              </div>

              {/* status and actions */}
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  {getStatusIcon(shipment.status)}
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(shipment.status)}`}>
                    {shipment.status}
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

            {/* shipment details */}
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Carrier</p>
                <p className="text-sm text-gray-900">{shipment.carrier}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Tracking Number</p>
                <p className="text-sm text-gray-900 font-mono">{shipment.trackingNumber}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Weight</p>
                <p className="text-sm text-gray-900">{shipment.weight}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Shipping Cost</p>
                <p className="text-sm font-bold text-green-600">${shipment.cost}</p>
              </div>
            </div>

            {/* destination and dates */}
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-2">Destination</p>
                <div className="flex items-start space-x-2">
                  <MdLocationOn className="w-4 h-4 text-gray-400 mt-0.5" />
                  <p className="text-sm text-gray-900">{shipment.destination}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Shipped Date</p>
                  <p className="text-sm text-gray-900">{shipment.shippedDate || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Delivered Date</p>
                  <p className="text-sm text-gray-900">{shipment.deliveredDate || 'N/A'}</p>
                </div>
              </div>
            </div>

            {/* products */}
            <div className="mt-4">
              <p className="text-sm font-medium text-gray-500 mb-2">Products</p>
              <div className="flex flex-wrap gap-2">
                {shipment.products.map((product, index) => (
                  <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                    {product}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* carrier information */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Shipping Carriers</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {carriers.map((carrier) => (
            <div key={carrier.name} className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-3xl mb-2">{carrier.logo}</div>
              <div className="font-medium text-gray-900">{carrier.name}</div>
              <div className="text-sm text-gray-600">Available</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

