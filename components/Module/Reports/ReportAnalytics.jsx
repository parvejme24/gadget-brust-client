"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  BarChart3, 
  PieChart, 
  TrendingUp,
  FileText,
  Download,
  Users,
  Calendar,
  Clock
} from "lucide-react";

export default function ReportAnalytics() {
  const analyticsData = {
    totalReports: 156,
    monthlyReports: 24,
    downloads: 1240,
    avgSize: 2.8,
    reportTypes: [
      { name: "Sales", count: 45, percentage: 28.8, color: "bg-green-500" },
      { name: "Products", count: 38, percentage: 24.4, color: "bg-blue-500" },
      { name: "Customers", count: 32, percentage: 20.5, color: "bg-purple-500" },
      { name: "Financial", count: 25, percentage: 16.0, color: "bg-red-500" },
      { name: "Inventory", count: 16, percentage: 10.3, color: "bg-indigo-500" }
    ],
    monthlyTrend: [
      { month: "Jan", reports: 12, downloads: 98 },
      { month: "Feb", reports: 18, downloads: 145 },
      { month: "Mar", reports: 22, downloads: 178 },
      { month: "Apr", reports: 16, downloads: 132 },
      { month: "May", reports: 24, downloads: 189 },
      { month: "Jun", reports: 28, downloads: 215 },
      { month: "Jul", reports: 32, downloads: 245 },
      { month: "Aug", reports: 26, downloads: 198 },
      { month: "Sep", reports: 30, downloads: 225 },
      { month: "Oct", reports: 34, downloads: 267 },
      { month: "Nov", reports: 29, downloads: 234 },
      { month: "Dec", reports: 35, downloads: 278 }
    ],
    recentActivity: [
      { action: "Sales Report Generated", user: "Admin", time: "2 hours ago", type: "success" },
      { action: "Product Report Downloaded", user: "Manager", time: "4 hours ago", type: "info" },
      { action: "Customer Report Failed", user: "Analyst", time: "6 hours ago", type: "error" },
      { action: "Financial Report Shared", user: "Admin", time: "8 hours ago", type: "info" },
      { action: "Inventory Report Generated", user: "Manager", time: "12 hours ago", type: "success" }
    ]
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case "success":
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      case "error":
        return <FileText className="h-4 w-4 text-red-600" />;
      default:
        return <Download className="h-4 w-4 text-blue-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                <FileText className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total Reports</p>
                <p className="text-2xl font-bold text-gray-900">{analyticsData.totalReports}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                <Calendar className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">This Month</p>
                <p className="text-2xl font-bold text-gray-900">{analyticsData.monthlyReports}</p>
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
                <p className="text-2xl font-bold text-gray-900">{analyticsData.downloads}</p>
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
                <p className="text-2xl font-bold text-gray-900">{analyticsData.avgSize} MB</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Report Types Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <PieChart className="h-5 w-5 mr-2 text-[#38AD81]" />
              Report Types Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analyticsData.reportTypes.map((type, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-4 h-4 ${type.color} rounded-full`}></div>
                    <span className="text-sm font-medium text-gray-900">{type.name}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">{type.count}</span>
                    <span className="text-sm font-semibold text-gray-900">{type.percentage}%</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Monthly Trend */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-[#38AD81]" />
              Monthly Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analyticsData.monthlyTrend.slice(-6).map((month, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-900">{month.month}</span>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">Reports:</span>
                      <span className="text-sm font-semibold">{month.reports}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">Downloads:</span>
                      <span className="text-sm font-semibold">{month.downloads}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Clock className="h-5 w-5 mr-2 text-[#38AD81]" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analyticsData.recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="flex-shrink-0">
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                  <p className="text-xs text-gray-600">by {activity.user}</p>
                </div>
                <div className="flex-shrink-0 text-xs text-gray-500">
                  {activity.time}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
