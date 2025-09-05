"use client"
import React from 'react';
import { 
  MdTrendingUp, 
  MdShoppingCart, 
  MdPeople, 
  MdInventory,
  MdLocalShipping,
  MdPayment,
  MdStar,
  MdAnalytics,
  MdBarChart,
  MdPieChart,
  MdShowChart,
  MdAttachMoney,
  MdCategory,
  MdBrandingWatermark,
  MdAdd
} from 'react-icons/md';
import { FaEye, FaDollarSign, FaChartLine, FaChartBar, FaChartPie } from 'react-icons/fa';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line, Bar, Pie, Doughnut } from 'react-chartjs-2';

// register chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function Dashboard() {
  const stats = [
    {
      name: 'Total Sales',
      value: '$24,450',
      change: '+12.5%',
      changeType: 'positive',
      icon: <FaDollarSign className="w-6 h-6" />,
      color: 'bg-green-500'
    },
    {
      name: 'Total Orders',
      value: '1,234',
      change: '+8.2%',
      changeType: 'positive',
      icon: <MdShoppingCart className="w-6 h-6" />,
      color: 'bg-blue-500'
    },
    {
      name: 'Total Customers',
      value: '892',
      change: '+15.3%',
      changeType: 'positive',
      icon: <MdPeople className="w-6 h-6" />,
      color: 'bg-purple-500'
    },
    {
      name: 'Products',
      value: '156',
      change: '+3.1%',
      changeType: 'positive',
      icon: <MdInventory className="w-6 h-6" />,
      color: 'bg-orange-500'
    }
  ];

  // monthly revenue data for charts
  const monthlyRevenueData = [
    { month: 'Jan', revenue: 18500, orders: 156, customers: 89 },
    { month: 'Feb', revenue: 22100, orders: 189, customers: 112 },
    { month: 'Mar', revenue: 19800, orders: 167, customers: 98 },
    { month: 'Apr', revenue: 25600, orders: 234, customers: 145 },
    { month: 'May', revenue: 28900, orders: 267, customers: 178 },
    { month: 'Jun', revenue: 32400, orders: 298, customers: 201 },
    { month: 'Jul', revenue: 29800, orders: 276, customers: 189 },
    { month: 'Aug', revenue: 35600, orders: 312, customers: 234 },
    { month: 'Sep', revenue: 38900, orders: 345, customers: 267 },
    { month: 'Oct', revenue: 42300, orders: 378, customers: 289 },
    { month: 'Nov', revenue: 45600, orders: 412, customers: 312 },
    { month: 'Dec', revenue: 48900, orders: 445, customers: 345 }
  ];

  // category performance data
  const categoryPerformance = [
    { category: 'Smartphones', revenue: 12500, percentage: 35, color: '#3B82F6' },
    { category: 'Laptops', revenue: 8900, percentage: 25, color: '#10B981' },
    { category: 'Tablets', revenue: 6700, percentage: 19, color: '#8B5CF6' },
    { category: 'Accessories', revenue: 4500, percentage: 13, color: '#F59E0B' },
    { category: 'Smart Home', revenue: 2900, percentage: 8, color: '#EF4444' }
  ];

  // brand performance data
  const brandPerformance = [
    { brand: 'Apple', revenue: 15600, growth: '+18%', color: '#1F2937' },
    { brand: 'Samsung', revenue: 12300, growth: '+12%', color: '#2563EB' },
    { brand: 'Sony', revenue: 8900, growth: '+8%', color: '#7C3AED' },
    { brand: 'LG', revenue: 6700, growth: '+5%', color: '#DC2626' },
    { brand: 'Xiaomi', revenue: 4500, growth: '+15%', color: '#EA580C' }
  ];

  // weekly sales trend
  const weeklySalesTrend = [
    { day: 'Mon', sales: 4200, orders: 45 },
    { day: 'Tue', sales: 3800, orders: 38 },
    { day: 'Wed', sales: 5200, orders: 52 },
    { day: 'Thu', sales: 4800, orders: 48 },
    { day: 'Fri', sales: 6100, orders: 61 },
    { day: 'Sat', sales: 7200, orders: 72 },
    { day: 'Sun', sales: 6800, orders: 68 }
  ];

  const recentOrders = [
    {
      id: '#ORD-001',
      customer: 'John Doe',
      product: 'iPhone 15 Pro',
      amount: '$1,199',
      status: 'Delivered',
      date: '2 hours ago'
    },
    {
      id: '#ORD-002',
      customer: 'Jane Smith',
      product: 'Samsung Galaxy S24',
      amount: '$899',
      status: 'Shipped',
      date: '4 hours ago'
    },
    {
      id: '#ORD-003',
      customer: 'Mike Johnson',
      product: 'MacBook Air M2',
      amount: '$1,299',
      status: 'Processing',
      date: '6 hours ago'
    },
    {
      id: '#ORD-004',
      customer: 'Sarah Wilson',
      product: 'AirPods Pro',
      amount: '$249',
      status: 'Delivered',
      date: '1 day ago'
    }
  ];

  const topProducts = [
    { name: 'iPhone 15 Pro', sales: 45, revenue: '$53,955' },
    { name: 'MacBook Air M2', sales: 32, revenue: '$41,568' },
    { name: 'Samsung Galaxy S24', sales: 28, revenue: '$25,172' },
    { name: 'AirPods Pro', sales: 67, revenue: '$16,683' }
  ];

  // chart configurations
  const areaChartData = {
    labels: monthlyRevenueData.map(d => d.month),
    datasets: [
      {
        label: 'Revenue',
        data: monthlyRevenueData.map(d => d.revenue),
        borderColor: 'rgba(59, 130, 246, 1)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.4,
        pointBackgroundColor: 'rgba(59, 130, 246, 1)',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8,
      },
      {
        label: 'Orders',
        data: monthlyRevenueData.map(d => d.orders),
        borderColor: 'rgba(139, 92, 246, 1)',
        backgroundColor: 'rgba(139, 92, 246, 0.1)',
        fill: true,
        tension: 0.4,
        pointBackgroundColor: 'rgba(139, 92, 246, 1)',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8,
      }
    ]
  };

  const barChartData = {
    labels: weeklySalesTrend.map(d => d.day),
    datasets: [
      {
        label: 'Sales ($)',
        data: weeklySalesTrend.map(d => d.sales),
        backgroundColor: [
          'rgba(147, 51, 234, 0.8)',
          'rgba(168, 85, 247, 0.8)',
          'rgba(192, 132, 252, 0.8)',
          'rgba(217, 70, 239, 0.8)',
          'rgba(236, 72, 153, 0.8)',
          'rgba(244, 63, 94, 0.8)',
          'rgba(239, 68, 68, 0.8)'
        ],
        borderColor: [
          'rgba(147, 51, 234, 1)',
          'rgba(168, 85, 247, 1)',
          'rgba(192, 132, 252, 1)',
          'rgba(217, 70, 239, 1)',
          'rgba(236, 72, 153, 1)',
          'rgba(244, 63, 94, 1)',
          'rgba(239, 68, 68, 1)'
        ],
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false,
      }
    ]
  };

  const pieChartData = {
    labels: categoryPerformance.map(d => d.category),
    datasets: [
      {
        data: categoryPerformance.map(d => d.revenue),
        backgroundColor: categoryPerformance.map(d => d.color),
        borderColor: '#ffffff',
        borderWidth: 3,
        hoverBorderWidth: 4,
        hoverOffset: 8,
      }
    ]
  };

  const doughnutChartData = {
    labels: brandPerformance.map(d => d.brand),
    datasets: [
      {
        data: brandPerformance.map(d => d.revenue),
        backgroundColor: brandPerformance.map(d => d.color),
        borderColor: '#ffffff',
        borderWidth: 3,
        hoverBorderWidth: 4,
        hoverOffset: 8,
        cutout: '60%',
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12,
            weight: '600'
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: 'rgba(255, 255, 255, 0.2)',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true,
        usePointStyle: true,
      }
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 12,
            weight: '600'
          }
        }
      },
      y: {
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
          borderDash: [5, 5],
        },
        ticks: {
          font: {
            size: 12,
            weight: '600'
          },
          callback: function(value) {
            return '$' + value.toLocaleString();
          }
        }
      }
    }
  };

  const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12,
            weight: '600'
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: 'rgba(255, 255, 255, 0.2)',
        borderWidth: 1,
        cornerRadius: 8,
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.parsed || 0;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: $${value.toLocaleString()} (${percentage}%)`;
          }
        }
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* page header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's what's happening with your gadget shop today.</p>
      </div>

      {/* stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className={`p-3 rounded-full ${stat.color} text-white`}>
                {stat.icon}
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
              </div>
            </div>
            <div className="mt-4">
              <span className={`text-sm font-medium ${
                stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
              }`}>
                {stat.change}
              </span>
              <span className="text-sm text-gray-600"> from last month</span>
            </div>
          </div>
        ))}
      </div>

      {/* revenue charts section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* monthly revenue trend area chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Monthly Revenue Trend</h3>
              <p className="text-sm text-gray-600">Revenue & orders performance over 12 months</p>
            </div>
            <div className="flex items-center space-x-2">
              <FaChartLine className="text-blue-600" />
              <span className="text-sm font-medium text-blue-600">Area Chart</span>
            </div>
          </div>
          
          <div className="h-80">
            <Line data={areaChartData} options={chartOptions} />
          </div>
        </div>

        {/* category performance pie chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Category Performance</h3>
              <p className="text-sm text-gray-600">Revenue breakdown by product category</p>
            </div>
            <div className="flex items-center space-x-2">
              <FaChartPie className="text-green-600" />
              <span className="text-sm font-medium text-green-600">Pie Chart</span>
            </div>
          </div>
          
          <div className="h-80">
            <Pie data={pieChartData} options={pieChartOptions} />
          </div>
        </div>
      </div>

      {/* management charts section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* weekly sales trend bar chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Weekly Sales Trend</h3>
              <p className="text-sm text-gray-600">Daily sales performance this week</p>
            </div>
            <div className="flex items-center space-x-2">
              <FaChartBar className="text-purple-600" />
              <span className="text-sm font-medium text-purple-600">Bar Chart</span>
            </div>
          </div>
          
          <div className="h-80">
            <Bar data={barChartData} options={chartOptions} />
          </div>
        </div>

        {/* brand performance doughnut chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Brand Performance</h3>
              <p className="text-sm text-gray-600">Revenue by brand with growth rates</p>
            </div>
            <div className="flex items-center space-x-2">
              <MdBrandingWatermark className="text-orange-600" />
              <span className="text-sm font-medium text-orange-600">Doughnut Chart</span>
            </div>
          </div>
          
          <div className="h-80">
            <Doughnut data={doughnutChartData} options={pieChartOptions} />
          </div>
        </div>
      </div>

      {/* orders and products analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* recent orders */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentOrders.map((order, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <MdShoppingCart className="text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{order.customer}</p>
                        <p className="text-sm text-gray-600">{order.product}</p>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{order.amount}</p>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                      order.status === 'Shipped' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* top products */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Top Products</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {topProducts.map((product, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <MdInventory className="text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{product.name}</p>
                      <p className="text-sm text-gray-600">{product.sales} units sold</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{product.revenue}</p>
                    <p className="text-xs text-gray-500">Revenue</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* quick actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <button className="flex items-center justify-center p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors duration-200">
            <MdAdd className="w-5 h-5 text-blue-600 mr-2" />
            <span className="text-sm font-medium text-blue-600">Add Product</span>
          </button>
          <button className="flex items-center justify-center p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors duration-200">
            <MdShoppingCart className="w-5 h-5 text-green-600 mr-2" />
            <span className="text-sm font-medium text-green-600">New Order</span>
          </button>
          <button className="flex items-center justify-center p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors duration-200">
            <MdPeople className="w-5 h-5 text-purple-600 mr-2" />
            <span className="text-sm font-medium text-purple-600">Add Customer</span>
          </button>
          <button className="flex items-center justify-center p-4 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors duration-200">
            <MdAnalytics className="w-5 h-5 text-orange-600 mr-2" />
            <span className="text-sm font-medium text-orange-600">View Reports</span>
          </button>
        </div>
      </div>
    </div>
  );
}

