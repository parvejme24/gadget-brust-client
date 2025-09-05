"use client"
import React from 'react';
import { MdTrendingUp, MdShoppingCart, MdPeople, MdInventory, MdLocalShipping, MdPayment, MdAnalytics } from 'react-icons/md';
import { FaDollarSign, FaChartLine, FaChartBar, FaChartPie } from 'react-icons/fa';

export default function Analytics() {
  const monthlyData = [
    { month: 'Jan', sales: 12500, orders: 89, customers: 45 },
    { month: 'Feb', sales: 15800, orders: 112, customers: 67 },
    { month: 'Mar', sales: 14200, orders: 98, customers: 54 },
    { month: 'Apr', sales: 18900, orders: 134, customers: 78 },
    { month: 'May', sales: 22100, orders: 156, customers: 89 },
    { month: 'Jun', sales: 19800, orders: 143, customers: 76 },
    { month: 'Jul', sales: 24500, orders: 178, customers: 92 },
    { month: 'Aug', sales: 26700, orders: 189, customers: 101 },
    { month: 'Sep', sales: 28900, orders: 201, customers: 115 },
    { month: 'Oct', sales: 31200, orders: 223, customers: 128 },
    { month: 'Nov', sales: 29800, orders: 212, customers: 121 },
    { month: 'Dec', sales: 32400, orders: 234, customers: 134 }
  ];

  const topProducts = [
    { name: 'iPhone 15 Pro', sales: 156, revenue: 187200, growth: '+12%' },
    { name: 'MacBook Air M2', sales: 89, revenue: 115611, growth: '+8%' },
    { name: 'Samsung Galaxy S24', sales: 234, revenue: 210600, growth: '+15%' },
    { name: 'AirPods Pro', sales: 445, revenue: 110805, growth: '+22%' },
    { name: 'iPad Air', sales: 78, revenue: 46722, growth: '+5%' }
  ];

  const categoryPerformance = [
    { category: 'Smartphones', sales: 45, revenue: 397800, growth: '+18%' },
    { category: 'Laptops', sales: 23, revenue: 298700, growth: '+12%' },
    { category: 'Audio', sales: 67, revenue: 167805, growth: '+25%' },
    { category: 'Tablets', sales: 34, revenue: 203400, growth: '+8%' },
    { category: 'Wearables', sales: 28, revenue: 11172, growth: '+15%' }
  ];

  const recentActivity = [
    { action: 'New order received', details: 'ORD-001 from John Doe', time: '2 minutes ago', type: 'order' },
    { action: 'Product restocked', details: 'iPhone 15 Pro - 50 units added', time: '15 minutes ago', type: 'inventory' },
    { action: 'New customer registered', details: 'Emily Davis joined', time: '1 hour ago', type: 'customer' },
    { action: 'Payment received', details: 'ORD-002 payment confirmed', time: '2 hours ago', type: 'payment' },
    { action: 'Shipment delivered', details: 'ORD-003 delivered to Mike Johnson', time: '4 hours ago', type: 'shipping' }
  ];

  const getActivityIcon = (type) => {
    switch (type) {
      case 'order': return <MdShoppingCart className="w-4 h-4 text-blue-600" />;
      case 'inventory': return <MdInventory className="w-4 h-4 text-green-600" />;
      case 'customer': return <MdPeople className="w-4 h-4 text-purple-600" />;
      case 'payment': return <MdPayment className="w-4 h-4 text-green-600" />;
      case 'shipping': return <MdLocalShipping className="w-4 h-4 text-orange-600" />;
      default: return <MdAnalytics className="w-4 h-4 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* page header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
        <p className="text-gray-600">Comprehensive insights into your gadget shop performance</p>
      </div>

      {/* key metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">$284,500</p>
              <p className="text-sm text-green-600">+18.5% from last month</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <FaDollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900">2,234</p>
              <p className="text-sm text-blue-600">+12.3% from last month</p>
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
              <p className="text-2xl font-bold text-gray-900">1,234</p>
              <p className="text-sm text-purple-600">+8.7% from last month</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <MdPeople className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
              <p className="text-2xl font-bold text-gray-900">3.2%</p>
              <p className="text-sm text-orange-600">+0.5% from last month</p>
            </div>
            <div className="p-3 bg-orange-100 rounded-lg">
              <FaChartLine className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* charts section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* monthly trends */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Trends</h3>
          <div className="space-y-4">
            {monthlyData.slice(-6).map((data, index) => (
              <div key={data.month} className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">{data.month}</span>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="text-sm text-gray-900">${data.sales.toLocaleString()}</div>
                    <div className="text-xs text-gray-500">{data.orders} orders</div>
                  </div>
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${(data.sales / 35000) * 100}%` }}
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

      {/* category performance */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Category Performance</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {categoryPerformance.map((category) => (
            <div key={category.category} className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-lg font-semibold text-gray-900">{category.category}</div>
              <div className="text-2xl font-bold text-blue-600">${(category.revenue / 1000).toFixed(0)}K</div>
              <div className="text-sm text-gray-600">{category.sales} sales</div>
              <div className="text-xs text-green-600">{category.growth}</div>
            </div>
          ))}
        </div>
      </div>

      {/* recent activity and insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* recent activity */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="mt-1">
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-900">{activity.action}</div>
                  <div className="text-sm text-gray-600">{activity.details}</div>
                  <div className="text-xs text-gray-500">{activity.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* insights */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Insights</h3>
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <FaChartBar className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-900">Sales Growth</span>
              </div>
              <p className="text-sm text-blue-700">Your sales have increased by 18.5% this month compared to last month.</p>
            </div>

            <div className="p-4 bg-green-50 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <MdPeople className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-green-900">Customer Acquisition</span>
              </div>
              <p className="text-sm text-green-700">You've acquired 134 new customers this month, a 8.7% increase.</p>
            </div>

            <div className="p-4 bg-purple-50 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <MdInventory className="w-4 h-4 text-purple-600" />
                <span className="text-sm font-medium text-purple-900">Product Performance</span>
              </div>
              <p className="text-sm text-purple-700">AirPods Pro is your best-selling product with 445 units sold.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

