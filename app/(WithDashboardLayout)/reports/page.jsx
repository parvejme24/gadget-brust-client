"use client"
import React, { useState } from 'react';
import { MdReport, MdDownload, MdPrint, MdEmail, MdCalendarToday, MdTrendingUp, MdShoppingCart, MdPeople } from 'react-icons/md';
import { FaFilePdf, FaFileExcel, FaChartBar } from 'react-icons/fa';

export default function Reports() {
  const [selectedReport, setSelectedReport] = useState('sales');
  const [dateRange, setDateRange] = useState('month');

  const reports = [
    {
      id: 'sales',
      name: 'Sales Report',
      description: 'Comprehensive sales analysis and trends',
      icon: <MdTrendingUp className="w-6 h-6" />,
      color: 'bg-green-500'
    },
    {
      id: 'inventory',
      name: 'Inventory Report',
      description: 'Stock levels and product performance',
      icon: <MdShoppingCart className="w-6 h-6" />,
      color: 'bg-blue-500'
    },
    {
      id: 'customers',
      name: 'Customer Report',
      description: 'Customer behavior and demographics',
      icon: <MdPeople className="w-6 h-6" />,
      color: 'bg-purple-500'
    },
    {
      id: 'financial',
      name: 'Financial Report',
      description: 'Revenue, expenses, and profitability',
      icon: <MdReport className="w-6 h-6" />,
      color: 'bg-orange-500'
    }
  ];

  const salesData = [
    { date: '2024-01-01', revenue: 12500, orders: 89, customers: 67 },
    { date: '2024-01-02', revenue: 15800, orders: 112, customers: 89 },
    { date: '2024-01-03', revenue: 14200, orders: 98, customers: 76 },
    { date: '2024-01-04', revenue: 18900, orders: 134, customers: 98 },
    { date: '2024-01-05', revenue: 22100, orders: 156, customers: 112 },
    { date: '2024-01-06', revenue: 19800, orders: 143, customers: 98 },
    { date: '2024-01-07', revenue: 24500, orders: 178, customers: 134 }
  ];

  const topProducts = [
    { name: 'iPhone 15 Pro', sales: 156, revenue: 187200, growth: '+12%' },
    { name: 'MacBook Air M2', sales: 89, revenue: 115611, growth: '+8%' },
    { name: 'Samsung Galaxy S24', sales: 234, revenue: 210600, growth: '+15%' },
    { name: 'AirPods Pro', sales: 445, revenue: 110805, growth: '+22%' },
    { name: 'iPad Air', sales: 78, revenue: 46722, growth: '+5%' }
  ];

  const exportFormats = [
    { name: 'PDF', icon: <FaFilePdf className="w-4 h-4" />, color: 'text-red-600' },
    { name: 'Excel', icon: <FaFileExcel className="w-4 h-4" />, color: 'text-green-600' },
    { name: 'Print', icon: <MdPrint className="w-4 h-4" />, color: 'text-blue-600' },
    { name: 'Email', icon: <MdEmail className="w-4 h-4" />, color: 'text-purple-600' }
  ];

  const generateReport = () => {
    console.log(`Generating ${selectedReport} report for ${dateRange}`);
    // here you would typically generate the actual report
  };

  return (
    <div className="space-y-6">
      {/* page header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
        <p className="text-gray-600">Generate and analyze comprehensive business reports</p>
      </div>

      {/* report selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {reports.map((report) => (
          <div
            key={report.id}
            onClick={() => setSelectedReport(report.id)}
            className={`bg-white p-6 rounded-lg border-2 cursor-pointer transition-all ${
              selectedReport === report.id 
                ? 'border-blue-500 shadow-lg' 
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center space-x-3 mb-3">
              <div className={`p-3 rounded-lg ${report.color} text-white`}>
                {report.icon}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{report.name}</h3>
                <p className="text-sm text-gray-600">{report.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* report controls */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <MdCalendarToday className="text-gray-400" />
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="week">Last Week</option>
                <option value="month">Last Month</option>
                <option value="quarter">Last Quarter</option>
                <option value="year">Last Year</option>
                <option value="custom">Custom Range</option>
              </select>
            </div>
            <button
              onClick={generateReport}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
            >
              <MdReport />
              <span>Generate Report</span>
            </button>
          </div>
          
          <div className="flex items-center space-x-2">
            {exportFormats.map((format) => (
              <button
                key={format.name}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                title={`Export as ${format.name}`}
              >
                <div className={format.color}>
                  {format.icon}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* report content */}
      {selectedReport === 'sales' && (
        <div className="space-y-6">
          {/* sales overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                  <p className="text-2xl font-bold text-gray-900">
                    ${salesData.reduce((sum, day) => sum + day.revenue, 0).toLocaleString()}
                  </p>
                </div>
                <div className="p-3 bg-green-100 rounded-lg">
                  <MdTrendingUp className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Orders</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {salesData.reduce((sum, day) => sum + day.orders, 0)}
                  </p>
                </div>
                <div className="p-3 bg-blue-100 rounded-lg">
                  <MdShoppingCart className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Customers</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {salesData.reduce((sum, day) => sum + day.customers, 0)}
                  </p>
                </div>
                <div className="p-3 bg-purple-100 rounded-lg">
                  <MdPeople className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </div>
          </div>

          {/* daily sales chart */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Daily Sales Trend</h3>
            <div className="space-y-4">
              {salesData.map((day) => (
                <div key={day.date} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600">{day.date}</span>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className="text-sm text-gray-900">${day.revenue.toLocaleString()}</div>
                      <div className="text-xs text-gray-500">{day.orders} orders</div>
                    </div>
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${(day.revenue / 25000) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* top products */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performing Products</h3>
            <div className="space-y-4">
              {topProducts.map((product, index) => (
                <div key={product.name} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{product.name}</div>
                      <div className="text-sm text-gray-500">{product.sales} sales</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-green-600">${product.revenue.toLocaleString()}</div>
                    <div className="text-xs text-green-600">{product.growth}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {selectedReport === 'inventory' && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Inventory Report</h3>
          <p className="text-gray-600">Inventory report content will be displayed here...</p>
        </div>
      )}

      {selectedReport === 'customers' && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Report</h3>
          <p className="text-gray-600">Customer report content will be displayed here...</p>
        </div>
      )}

      {selectedReport === 'financial' && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Financial Report</h3>
          <p className="text-gray-600">Financial report content will be displayed here...</p>
        </div>
      )}

      {/* report actions */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Report Actions</h3>
        <div className="flex flex-wrap gap-3">
          <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center space-x-2">
            <MdDownload />
            <span>Download Report</span>
          </button>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2">
            <MdPrint />
            <span>Print Report</span>
          </button>
          <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 flex items-center space-x-2">
            <MdEmail />
            <span>Email Report</span>
          </button>
          <button className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 flex items-center space-x-2">
            <FaChartBar />
            <span>Export Charts</span>
          </button>
        </div>
      </div>
    </div>
  );
}

