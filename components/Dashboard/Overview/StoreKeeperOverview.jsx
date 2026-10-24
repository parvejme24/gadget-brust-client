"use client";

import { Boxes, Package, PackageX, TriangleAlert } from "lucide-react";
import { useInventorySummary } from "@/lib/hooks/useAdmin";
import { StatCard, formatCompact } from "@/components/Dashboard/Kit";
import OverviewHeader from "./OverviewHeader";
import LowStockPanel from "./LowStockPanel";
import StockMovementsPanel from "./StockMovementsPanel";
import CatalogMixPanel from "./CatalogMixPanel";
import LatestReviewsPanel from "./LatestReviewsPanel";

// store keeper: stock levels and stock movement
export default function StoreKeeperOverview({ user }) {
  const { data: inv, isLoading } = useInventorySummary();

  return (
    <div className="space-y-6">
      <OverviewHeader user={user} description="Stock levels, restocks and what's selling out." />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard loading={isLoading} label="Products" value={inv?.products ?? "—"} hint={`${formatCompact(inv?.retailValue)} retail value`} icon={Package} tone="brand" href="/dashboard/products" />
        <StatCard loading={isLoading} label="Units in stock" value={inv?.units?.toLocaleString("en-IN") ?? "—"} hint="Across all products" icon={Boxes} tone="sky" href="/dashboard/inventory" />
        <StatCard loading={isLoading} label="Low stock" value={inv?.lowStock ?? "—"} hint={`${inv?.lowStockThreshold ?? 10} or fewer left`} icon={TriangleAlert} tone="amber" href="/dashboard/products?stock=low" />
        <StatCard loading={isLoading} label="Out of stock" value={inv?.outOfStock ?? "—"} hint="Can't be sold right now" icon={PackageX} tone="red" href="/dashboard/products?stock=out" />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <LowStockPanel limit={8} />
        <StockMovementsPanel limit={8} />
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <CatalogMixPanel />
        <LatestReviewsPanel className="xl:col-span-2" />
      </div>
    </div>
  );
}
