"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Download,
  Filter,
  Calendar,
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Users,
  Package,
  BarChart3,
  PieChart,
  FileText,
  RefreshCw,
} from "lucide-react";

export default function ReportsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("monthly");
  const [dateRange, setDateRange] = useState({
    start: "2024-01-01",
    end: "2024-12-31",
  });
  const [isGenerating, setIsGenerating] = useState(false);

  const reportTypes = [
    {
      id: "sales",
      name: "Sales Report",
      icon: TrendingUp,
      description: "Revenue and sales performance",
      color: "bg-green-500",
    },
    {
      id: "products",
      name: "Product Report",
      icon: Package,
      description: "Product performance and inventory",
      color: "bg-blue-500",
    },
    {
      id: "customers",
      name: "Customer Report",
      icon: Users,
      description: "Customer analytics and behavior",
      color: "bg-purple-500",
    },
    {
      id: "orders",
      name: "Order Report",
      icon: ShoppingCart,
      description: "Order processing and fulfillment",
      color: "bg-orange-500",
    },
    {
      id: "financial",
      name: "Financial Report",
      icon: DollarSign,
      description: "Financial statements and metrics",
      color: "bg-red-500",
    },
    {
      id: "inventory",
      name: "Inventory Report",
      icon: BarChart3,
      description: "Stock levels and movement",
      color: "bg-indigo-500",
    },
  ];

  const periodOptions = [
    { value: "daily", label: "Daily" },
    { value: "weekly", label: "Weekly" },
    { value: "monthly", label: "Monthly" },
    { value: "quarterly", label: "Quarterly" },
    { value: "yearly", label: "Yearly" },
    { value: "custom", label: "Custom Range" },
  ];

  const recentReports = [
    {
      id: 1,
      name: "Monthly Sales Report",
      type: "Sales",
      generated: "2024-01-15",
      size: "2.4 MB",
      status: "completed",
    },
    {
      id: 2,
      name: "Product Performance Q4",
      type: "Products",
      generated: "2024-01-10",
      size: "1.8 MB",
      status: "completed",
    },
    {
      id: 3,
      name: "Customer Analytics",
      type: "Customers",
      generated: "2024-01-08",
      size: "3.2 MB",
      status: "completed",
    },
    {
      id: 4,
      name: "Financial Summary",
      type: "Financial",
      generated: "2024-01-05",
      size: "4.1 MB",
      status: "completed",
    },
  ];

  const handleGenerateReport = async (reportType) => {
    setIsGenerating(true);
    // Simulate report generation
    setTimeout(() => {
      setIsGenerating(false);
      // Handle report generation
    }, 2000);
  };

  const handleDownloadReport = (reportId) => {
    // Handle report download
    console.log("Downloading report:", reportId);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reports</h1>
          <p className="text-gray-600 mt-2">
            Generate and download comprehensive business reports
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" className="flex items-center">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="h-5 w-5 mr-2 text-[#38AD81]" />
            Report Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <Label htmlFor="period">Report Period</Label>
              <select
                id="period"
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-[#38AD81] focus:border-[#38AD81]"
              >
                {periodOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {selectedPeriod === "custom" && (
              <>
                <div>
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={dateRange.start}
                    onChange={(e) =>
                      setDateRange({ ...dateRange, start: e.target.value })
                    }
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="endDate">End Date</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={dateRange.end}
                    onChange={(e) =>
                      setDateRange({ ...dateRange, end: e.target.value })
                    }
                    className="mt-1"
                  />
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Report Types */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reportTypes.map((report) => {
          const IconComponent = report.icon;
          return (
            <Card key={report.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <div
                    className={`w-10 h-10 ${report.color} rounded-lg flex items-center justify-center mr-3`}
                  >
                    <IconComponent className="h-5 w-5 text-white" />
                  </div>
                  {report.name}
                </CardTitle>
                <p className="text-sm text-gray-600">{report.description}</p>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={() => handleGenerateReport(report.id)}
                  disabled={isGenerating}
                  className="w-full bg-[#38AD81] hover:bg-[#2d8f6a] text-white"
                >
                  {isGenerating ? (
                    <div className="flex items-center">
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Generating...
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <FileText className="h-4 w-4 mr-2" />
                      Generate Report
                    </div>
                  )}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent Reports */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="h-5 w-5 mr-2 text-[#38AD81]" />
            Recent Reports
          </CardTitle>
          <p className="text-sm text-gray-600">
            Your recently generated reports
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentReports.map((report) => (
              <div
                key={report.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    <FileText className="h-5 w-5 text-gray-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      {report.name}
                    </h4>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span>{report.type}</span>
                      <span>•</span>
                      <span>Generated: {report.generated}</span>
                      <span>•</span>
                      <span>{report.size}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Badge className="bg-green-100 text-green-800">
                    {report.status}
                  </Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDownloadReport(report.id)}
                    className="flex items-center"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                <TrendingUp className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Reports
                </p>
                <p className="text-2xl font-bold text-gray-900">24</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                <FileText className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">This Month</p>
                <p className="text-2xl font-bold text-gray-900">8</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                <Download className="h-4 w-4 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Downloads</p>
                <p className="text-2xl font-bold text-gray-900">156</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center mr-3">
                <BarChart3 className="h-4 w-4 text-orange-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Avg. Size</p>
                <p className="text-2xl font-bold text-gray-900">2.8 MB</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
