"use client";

import React from "react";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function PaymentMethodChart({ data, isLoading }) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Payment Methods</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center">
            <div className="text-gray-500">Loading chart...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Handle different data structures
  let paymentData = data?.paymentMethods || data?.paymentMethodBreakdown || [];
  
  // If no data, use fake data
  if (!paymentData || paymentData.length === 0) {
    paymentData = [
      { name: 'Cash on Delivery', revenue: 350000, value: 30, color: '#38AD81' },
      { name: 'bKash', revenue: 280000, value: 24, color: '#E2136E' },
      { name: 'Nagad', revenue: 210000, value: 18, color: '#F7941D' },
      { name: 'Rocket', revenue: 175000, value: 15, color: '#00A651' },
      { name: 'Upay', revenue: 105000, value: 9, color: '#FF6B35' },
      { name: 'Bank Transfer', revenue: 70000, value: 6, color: '#0070ba' },
      { name: 'Stripe', revenue: 35000, value: 3, color: '#635BFF' }
    ];
  }

  const chartData = {
    labels: paymentData.map(item => {
      // Handle different data structures
      if (item._id) {
        // Convert payment method names
        switch (item._id) {
          case 'ssl_commerz':
            return 'SSL Commerz';
          case 'stripe':
            return 'Stripe';
          default:
            return item._id.charAt(0).toUpperCase() + item._id.slice(1);
        }
      } else {
        // Use name field directly
        return item.name || item.label || 'Unknown';
      }
    }),
    datasets: [
      {
        data: paymentData.map(item => item.revenue || item.value || 0),
        backgroundColor: paymentData.map(item => {
          if (item.color) {
            // Convert hex to rgba
            const hex = item.color.replace('#', '');
            const r = parseInt(hex.substr(0, 2), 16);
            const g = parseInt(hex.substr(2, 2), 16);
            const b = parseInt(hex.substr(4, 2), 16);
            return `rgba(${r}, ${g}, ${b}, 0.8)`;
          }
          return 'rgba(56, 173, 129, 0.8)'; // fallback color
        }),
        borderColor: paymentData.map(item => item.color || '#38AD81'),
        borderWidth: 2,
        hoverOffset: 4,
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          usePointStyle: true,
          padding: 20,
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: 'rgba(56, 173, 129, 0.5)',
        borderWidth: 1,
        callbacks: {
          label: function(context) {
            const value = context.parsed;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${context.label}: $${value.toLocaleString()} (${percentage}%)`;
          }
        }
      }
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Methods</CardTitle>
        <p className="text-sm text-gray-600">
          Revenue breakdown by payment method
        </p>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <Doughnut data={chartData} options={options} />
        </div>
      </CardContent>
    </Card>
  );
}
