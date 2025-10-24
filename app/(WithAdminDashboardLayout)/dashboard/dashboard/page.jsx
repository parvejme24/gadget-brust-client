"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import StatCard from "@/components/Module/Dashboard/StatCard";
import RevenueChart from "@/components/Module/Dashboard/RevenueChart";
import PaymentMethodChart from "@/components/Module/Dashboard/PaymentMethodChart";
import SalesByCategoryChart from "@/components/Module/Dashboard/SalesByCategoryChart";
import SalesByBrandChart from "@/components/Module/Dashboard/SalesByBrandChart";
import {
  useDashboardStats,
  useRevenueAnalytics,
  useSalesAnalytics,
} from "@/lib/hooks/useDashboard";
import {
  Users,
  Package,
  ShoppingCart,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  Clock,
} from "lucide-react";
import { Loader2 } from "lucide-react";

export default function DashboardPage() {
  // Fetch dashboard data
  const { data: stats, isLoading: statsLoading, error: statsError } = useDashboardStats();
  const { data: revenueData, isLoading: revenueLoading, error: revenueError } = useRevenueAnalytics({
    period: "monthly",
    year: new Date().getFullYear(),
  });
  const { data: salesData, isLoading: salesLoading, error: salesError } = useSalesAnalytics({
    period: "monthly",
    year: new Date().getFullYear(),
  });

  // Show loading only if all data is loading
  if (statsLoading && revenueLoading && salesLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-3">
          <Loader2 className="h-6 w-6 animate-spin text-[#38AD81]" />
          <span className="text-gray-600">Loading dashboard...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Fake Data Notice */}
      {(statsError || revenueError || salesError) && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span className="text-blue-700 text-sm">
              Dashboard is using demo data. Connect to your backend API for real-time data.
            </span>
          </div>
        </div>
      )}

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Revenue"
          value={stats?.revenue?.total || 1250000}
          change={`+${(
            ((stats?.revenue?.thisMonth || 125000) / (stats?.revenue?.total || 1250000)) *
            100
          ).toFixed(1)}%`}
          changeType="positive"
          icon={DollarSign}
          subtitle={`$${((stats?.revenue?.thisMonth || 125000) / 1000).toFixed(
            1
          )}K this month`}
        />

        <StatCard
          title="Total Orders"
          value={stats?.orders?.total || 3420}
          change={`+${stats?.orders?.thisMonth || 285} this month`}
          changeType="positive"
          icon={ShoppingCart}
          subtitle={`${stats?.orders?.pending || 45} pending`}
        />

        <StatCard
          title="Total Customers"
          value={stats?.customers?.total || 1250}
          change={`+${stats?.customers?.newThisMonth || 85} this month`}
          changeType="positive"
          icon={Users}
          subtitle={`${stats?.customers?.newToday || 12} new today`}
        />

        <StatCard
          title="Total Products"
          value={stats?.products?.total || 185}
          change={`${stats?.products?.lowStock || 8} low stock`}
          changeType={stats?.products?.lowStock > 10 ? "negative" : "neutral"}
          icon={Package}
          subtitle={`${stats?.products?.outOfStock || 3} out of stock`}
          badge={stats?.products?.outOfStock > 0 ? "Alert" : undefined}
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RevenueChart data={revenueData} isLoading={revenueLoading} />
        <PaymentMethodChart data={revenueData} isLoading={revenueLoading} />
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SalesByCategoryChart data={salesData} isLoading={salesLoading} />
        <SalesByBrandChart data={salesData} isLoading={salesLoading} />
      </div>

      {/* Additional Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Order Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Completed</span>
                </div>
                <span className="font-semibold">
                  {stats?.orders?.completed || 2850}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm">Pending</span>
                </div>
                <span className="font-semibold">
                  {stats?.orders?.pending || 45}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                  <span className="text-sm">Cancelled</span>
                </div>
                <span className="font-semibold">
                  {stats?.orders?.cancelled || 25}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Product Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Total Categories</span>
                <span className="font-semibold">
                  {stats?.products?.categories || 12}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Total Brands</span>
                <span className="font-semibold">
                  {stats?.products?.brands || 8}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Average Stock</span>
                <span className="font-semibold">
                  {stats?.products?.total
                    ? Math.round(
                        ((stats?.products?.total -
                          (stats?.products?.lowStock || 0) -
                          (stats?.products?.outOfStock || 0)) /
                          stats?.products?.total) *
                          100
                      )
                    : 0}
                  %
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Today's Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Today's Revenue</span>
                <span className="font-semibold">
                  ${(stats?.revenue?.today || 4500).toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Today's Orders</span>
                <span className="font-semibold">
                  {stats?.orders?.today || 18}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">New Customers</span>
                <span className="font-semibold">
                  {stats?.customers?.newToday || 3}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
