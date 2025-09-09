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

  if (!data?.paymentMethodBreakdown) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Payment Methods</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center">
            <div className="text-gray-500">No payment data available</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const chartData = {
    labels: data.paymentMethodBreakdown.map(item => {
      // Convert payment method names
      switch (item._id) {
        case 'ssl_commerz':
          return 'SSL Commerz';
        case 'stripe':
          return 'Stripe';
        default:
          return item._id.charAt(0).toUpperCase() + item._id.slice(1);
      }
    }),
    datasets: [
      {
        data: data.paymentMethodBreakdown.map(item => item.revenue),
        backgroundColor: [
          'rgba(56, 173, 129, 0.8)', // #38AD81
          'rgba(59, 130, 246, 0.8)',  // blue-500
          'rgba(245, 158, 11, 0.8)',  // amber-500
          'rgba(239, 68, 68, 0.8)',   // red-500
          'rgba(139, 92, 246, 0.8)',  // violet-500
        ],
        borderColor: [
          'rgb(56, 173, 129)',
          'rgb(59, 130, 246)',
          'rgb(245, 158, 11)',
          'rgb(239, 68, 68)',
          'rgb(139, 92, 246)',
        ],
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
