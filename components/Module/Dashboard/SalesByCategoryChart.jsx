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

export default function SalesByCategoryChart({ data, isLoading }) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Sales by Category</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80 flex items-center justify-center">
            <div className="text-gray-500">Loading chart...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!data?.salesByCategory) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Sales by Category</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80 flex items-center justify-center">
            <div className="text-gray-500">No sales data available</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const chartData = {
    labels: data.salesByCategory.map(item => item._id),
    datasets: [
      {
        label: 'Revenue',
        data: data.salesByCategory.map(item => item.totalSales),
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
            const item = data.salesByCategory[context.dataIndex];
            return [
              `Revenue: $${context.parsed.y.toLocaleString()}`,
              `Orders: ${item.orderCount}`,
              `Quantity: ${item.totalQuantity}`
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
          text: 'Category'
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
        <CardTitle>Sales by Category</CardTitle>
        <p className="text-sm text-gray-600">
          Revenue breakdown by product category
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
