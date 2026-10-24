"use client";

import { Banknote, ReceiptText, Star, TicketPercent } from "lucide-react";
import { useAdminCoupons, useAdminReviews, useAdminStats } from "@/lib/hooks/useAdmin";
import { StatCard, formatTaka } from "@/components/Dashboard/Kit";
import OverviewHeader from "./OverviewHeader";
import RevenuePanel from "./RevenuePanel";
import CouponPerformancePanel from "./CouponPerformancePanel";
import CatalogMixPanel from "./CatalogMixPanel";
import LatestReviewsPanel from "./LatestReviewsPanel";

// marketing: sales trend, campaigns and customer feedback
export default function MarketingOverview({ user }) {
  const { data: stats, isLoading } = useAdminStats();
  const { data: coupons = [] } = useAdminCoupons();
  const { data: reviews = [] } = useAdminReviews();
  const now = new Date();
  const live = coupons.filter((c) => c.isActive && (!c.endDate || new Date(c.endDate) >= now));
  const redemptions = coupons.reduce((s, c) => s + (c.usedCount || 0), 0);
  const avgRating = reviews.length ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0;

  return (
    <div className="space-y-6">
      <OverviewHeader user={user} description="Sales trend, campaigns and what customers are saying." />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard loading={isLoading} label="Revenue this month" value={formatTaka(stats?.revenue?.thisMonth)} icon={Banknote} tone="brand" href="/dashboard/reports" />
        <StatCard loading={isLoading} label="Orders this month" value={stats?.orders?.thisMonth ?? "—"} hint={`${stats?.orders?.total || 0} all time`} icon={ReceiptText} tone="sky" href="/dashboard/reports" />
        <StatCard label="Live coupons" value={live.length} hint={`${redemptions} redemptions in total`} icon={TicketPercent} tone="violet" href="/dashboard/coupons" />
        <StatCard label="Average rating" value={avgRating ? `${avgRating.toFixed(1)} ★` : "—"} hint={`${reviews.length} reviews`} icon={Star} tone="amber" href="/dashboard/reviews" />
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <RevenuePanel className="xl:col-span-2" />
        <CouponPerformancePanel />
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <CatalogMixPanel />
        <LatestReviewsPanel className="xl:col-span-2" />
      </div>
    </div>
  );
}
