"use client";

import { Banknote, Package, ReceiptText, Users } from "lucide-react";
import { useAdminOrders, useAdminStats } from "@/lib/hooks/useAdmin";
import { StatCard, formatCompact, formatTaka } from "@/components/Dashboard/Kit";
import OverviewHeader from "./OverviewHeader";
import RevenuePanel from "./RevenuePanel";
import OrderPipelinePanel from "./OrderPipelinePanel";
import RecentOrdersPanel from "./RecentOrdersPanel";
import LowStockPanel from "./LowStockPanel";
import TopCustomersPanel from "./TopCustomersPanel";
import PaymentMethodsPanel from "./PaymentMethodsPanel";
import CatalogMixPanel from "./CatalogMixPanel";
import LatestReviewsPanel from "./LatestReviewsPanel";

// admin and manager: the whole store at a glance
export default function StoreOverview({ user }) {
  const { data: stats, isLoading } = useAdminStats();
  const { data: orders = [], isLoading: ordersLoading } = useAdminOrders();
  const toConfirm = orders.filter((o) => o.orderStatus === "pending" && o.source !== "pos");

  return (
    <div className="space-y-6">
      <OverviewHeader user={user} description="Here's what's happening with your store today." />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard loading={isLoading} label="Revenue this month" value={formatTaka(stats?.revenue?.thisMonth)} hint={`${formatCompact(stats?.revenue?.total)} all time`} icon={Banknote} tone="brand" href="/dashboard/reports" />
        <StatCard loading={isLoading} label="Orders" value={stats?.orders?.total ?? "—"} hint={`${stats?.orders?.pending || 0} pending · ${stats?.orders?.thisMonth || 0} this month`} icon={ReceiptText} tone="sky" href="/dashboard/orders" />
        <StatCard loading={isLoading} label="Customers" value={stats?.customers?.total ?? "—"} hint={`${stats?.customers?.newThisMonth || 0} new this month`} icon={Users} tone="violet" href="/dashboard/customers" />
        <StatCard loading={isLoading} label="Products" value={stats?.products?.total ?? "—"} hint={`${stats?.products?.lowStock || 0} low · ${stats?.products?.outOfStock || 0} out of stock`} icon={Package} tone="amber" href="/dashboard/products" />
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <RevenuePanel className="xl:col-span-2" />
        <OrderPipelinePanel orders={orders} stats={stats} />
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <RecentOrdersPanel
          className="xl:col-span-2"
          title="Waiting for confirmation"
          description="New online and guest orders: confirm, edit or cancel"
          orders={toConfirm.slice(0, 6)}
          loading={ordersLoading}
          viewAllHref="/dashboard/orders?status=pending"
        />
        <LowStockPanel />
      </div>

      <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
        <TopCustomersPanel />
        <PaymentMethodsPanel />
        <CatalogMixPanel className="lg:col-span-2 xl:col-span-1" />
      </div>

      <LatestReviewsPanel />
    </div>
  );
}
