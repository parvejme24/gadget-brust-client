"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import StatCard from "@/components/Module/Dashboard/StatCard";
import RevenueChart from "@/components/Module/Dashboard/RevenueChart";
import PaymentMethodChart from "@/components/Module/Dashboard/PaymentMethodChart";
import SalesByCategoryChart from "@/components/Module/Dashboard/SalesByCategoryChart";
import RecentActivities from "@/components/Module/Dashboard/RecentActivities";
import {
  useDashboardStats,
  useRevenueAnalytics,
  useSalesAnalytics,
  useRecentActivities,
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
  const { data: stats, isLoading: statsLoading } = useDashboardStats();
  const { data: revenueData, isLoading: revenueLoading } = useRevenueAnalytics({
    period: "monthly",
    year: new Date().getFullYear(),
  });
  const { data: salesData, isLoading: salesLoading } = useSalesAnalytics({
    period: "monthly",
    year: new Date().getFullYear(),
  });
  const { data: activitiesData, isLoading: activitiesLoading } =
    useRecentActivities({
      limit: 10,
    });

  if (statsLoading) {
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
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Revenue"
          value={stats?.revenue?.total || 0}
          change={`+${(
            ((stats?.revenue?.thisMonth || 0) / (stats?.revenue?.total || 1)) *
            100
          ).toFixed(1)}%`}
          changeType="positive"
          icon={DollarSign}
          subtitle={`$${((stats?.revenue?.thisMonth || 0) / 1000).toFixed(
            1
          )}K this month`}
        />

        <StatCard
          title="Total Orders"
          value={stats?.orders?.total || 0}
          change={`+${stats?.orders?.thisMonth || 0} this month`}
          changeType="positive"
          icon={ShoppingCart}
          subtitle={`${stats?.orders?.pending || 0} pending`}
        />

        <StatCard
          title="Total Customers"
          value={stats?.customers?.total || 0}
          change={`+${stats?.customers?.newThisMonth || 0} this month`}
          changeType="positive"
          icon={Users}
          subtitle={`${stats?.customers?.newToday || 0} new today`}
        />

        <StatCard
          title="Total Products"
          value={stats?.products?.total || 0}
          change={`${stats?.products?.lowStock || 0} low stock`}
          changeType={stats?.products?.lowStock > 10 ? "negative" : "neutral"}
          icon={Package}
          subtitle={`${stats?.products?.outOfStock || 0} out of stock`}
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
        <RecentActivities data={activitiesData} isLoading={activitiesLoading} />
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
                  {stats?.orders?.completed || 0}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm">Pending</span>
                </div>
                <span className="font-semibold">
                  {stats?.orders?.pending || 0}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                  <span className="text-sm">Cancelled</span>
                </div>
                <span className="font-semibold">
                  {stats?.orders?.cancelled || 0}
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
                  {stats?.products?.categories || 0}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Total Brands</span>
                <span className="font-semibold">
                  {stats?.products?.brands || 0}
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
                  ${(stats?.revenue?.today || 0).toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Today's Orders</span>
                <span className="font-semibold">
                  {stats?.orders?.today || 0}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">New Customers</span>
                <span className="font-semibold">
                  {stats?.customers?.newToday || 0}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
