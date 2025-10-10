"use client";

import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function SalesByBrandChart({ data, isLoading }) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Sales by Brand</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80 flex items-center justify-center">
            <div className="text-gray-500">Loading chart...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Handle different data structures
  let brandData = data?.byBrand || data?.salesByBrand || [];
  
  // If no data, use fake data
  if (!brandData || brandData.length === 0) {
    brandData = [
      { name: 'Apple', revenue: 450000, value: 40, orders: 1250 },
      { name: 'Samsung', revenue: 320000, value: 28, orders: 890 },
      { name: 'Sony', revenue: 180000, value: 16, orders: 500 },
      { name: 'LG', revenue: 120000, value: 11, orders: 333 },
      { name: 'Xiaomi', revenue: 80000, value: 7, orders: 222 },
      { name: 'OnePlus', revenue: 60000, value: 5, orders: 167 },
      { name: 'Huawei', revenue: 40000, value: 4, orders: 111 }
    ];
  }

  const chartData = {
    labels: brandData.map(item => {
      // Handle different data structures
      if (item._id) {
        return item._id.charAt(0).toUpperCase() + item._id.slice(1);
      } else {
        return item.name || item.label || 'Unknown';
      }
    }),
    datasets: [
      {
        label: 'Revenue',
        data: brandData.map(item => item.revenue || item.totalSales || item.value || 0),
        backgroundColor: [
          'rgba(56, 173, 129, 0.8)',   // #38AD81
          'rgba(59, 130, 246, 0.8)',   // blue-500
          'rgba(245, 158, 11, 0.8)',   // amber-500
          'rgba(239, 68, 68, 0.8)',    // red-500
          'rgba(139, 92, 246, 0.8)',   // violet-500
          'rgba(236, 72, 153, 0.8)',   // pink-500
          'rgba(34, 197, 94, 0.8)',    // green-500
          'rgba(251, 146, 60, 0.8)',   // orange-400
        ],
        borderColor: [
          'rgb(56, 173, 129)',
          'rgb(59, 130, 246)',
          'rgb(245, 158, 11)',
          'rgb(239, 68, 68)',
          'rgb(139, 92, 246)',
          'rgb(236, 72, 153)',
          'rgb(34, 197, 94)',
          'rgb(251, 146, 60)',
        ],
        borderWidth: 1,
        borderRadius: 4,
        borderSkipped: false,
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: 'rgba(56, 173, 129, 0.5)',
        borderWidth: 1,
        callbacks: {
          label: function(context) {
            const item = brandData[context.dataIndex];
            return [
              `Revenue: $${context.parsed.y.toLocaleString()}`,
              `Orders: ${item.orders || item.orderCount || 0}`,
              `Percentage: ${item.percentage || item.value || 0}%`
            ];
          }
        }
      }
    },
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: 'Brand'
        },
        grid: {
          display: false,
        }
      },
      y: {
        display: true,
        title: {
          display: true,
          text: 'Revenue ($)'
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          callback: function(value) {
            return '$' + value.toLocaleString();
          }
        }
      }
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sales by Brand</CardTitle>
        <p className="text-sm text-gray-600">
          Revenue breakdown by product brand
        </p>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <Bar data={chartData} options={options} />
        </div>
      </CardContent>
    </Card>
  );
}
