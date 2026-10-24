"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { CalendarClock, Gift, Plus, TicketPercent } from "lucide-react";
import { adminService } from "@/lib/services/adminService";
import { useAdminBrands, useAdminCategories, useAdminCoupons, useAdminMutation } from "@/lib/hooks/useAdmin";
import { couponStatus } from "@/lib/coupons";
import { ConfirmDialog, EmptyState, ErrorState, PageHeader, SearchInput, StatCard, ViewToggle, buttonClass, useViewMode } from "@/components/Dashboard/Kit";
import { DropdownSelect } from "@/components/ui/dropdown-select";
import CouponCard from "@/components/Dashboard/Coupons/CouponCard";
import CouponsTable from "@/components/Dashboard/Coupons/CouponsTable";
import CouponActions from "@/components/Dashboard/Coupons/CouponActions";

export default function CouponsPage() {
  const { data: coupons = [], isLoading, isError, error, refetch } = useAdminCoupons();
  const { data: categories = [] } = useAdminCategories();
  const { data: brands = [] } = useAdminBrands();
  const [view, setView] = useViewMode("coupons", "grid");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");
  const [toDelete, setToDelete] = useState(null);

  const toggle = useAdminMutation((id) => adminService.toggleCoupon(id), { success: (c) => (c?.isActive ? "Coupon activated" : "Coupon paused") });
  const remove = useAdminMutation((id) => adminService.deleteCoupon(id), { success: "Coupon deleted", onSuccess: () => setToDelete(null) });

  const rows = useMemo(() => {
    const q = search.trim().toLowerCase();
    return coupons.filter(
      (c) => (!filter || couponStatus(c) === filter || c.type === filter) && (!q || `${c.code} ${c.title}`.toLowerCase().includes(q))
    );
  }, [coupons, search, filter]);

  const counts = coupons.reduce((acc, c) => ((acc[couponStatus(c)] = (acc[couponStatus(c)] || 0) + 1), acc), {});
  const redemptions = coupons.reduce((s, c) => s + (c.usedCount || 0), 0);

  const actions = (c) => <CouponActions coupon={c} onDelete={setToDelete} />;

  return (
    <>
      <PageHeader
        title="Coupons"
        description="Discount codes for a product, a group of products, categories, brands or the whole store."
        actions={
          <>
            <ViewToggle value={view} onChange={setView} />
            <Link href="/dashboard/coupons/new" className={buttonClass("primary")}><Plus className="h-4 w-4" /> Create coupon</Link>
          </>
        }
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard loading={isLoading} label="Active coupons" value={counts.active || 0} icon={TicketPercent} tone="brand" />
        <StatCard loading={isLoading} label="Scheduled" value={counts.scheduled || 0} icon={CalendarClock} tone="sky" />
        <StatCard loading={isLoading} label="Times redeemed" value={redemptions} icon={Gift} tone="violet" />
        <StatCard loading={isLoading} label="Expired or paused" value={(counts.expired || 0) + (counts.paused || 0) + (counts["used-up"] || 0)} tone="gray" />
      </div>

      <div className="mb-5 flex flex-col gap-3 sm:flex-row">
        <SearchInput value={search} onChange={setSearch} placeholder="Search code or title…" className="sm:w-72" />
        <DropdownSelect
          label="Filter coupons"
          value={filter}
          onChange={setFilter}
          className="sm:w-56"
          options={[
            { value: "", label: "All coupons" },
            { value: "active", label: "Active" },
            { value: "scheduled", label: "Scheduled" },
            { value: "expired", label: "Expired" },
            { value: "paused", label: "Paused" },
            { value: "percentage", label: "Type: Percentage" },
            { value: "fixed", label: "Type: Fixed amount" },
            { value: "bogo", label: "Type: Buy X get Y" },
            { value: "free_shipping", label: "Type: Free delivery" },
          ]}
        />
      </div>

      {isError ? (
        <ErrorState error={error} onRetry={refetch} />
      ) : isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-56 animate-pulse rounded-2xl bg-gray-100" />)}</div>
      ) : rows.length === 0 ? (
        <EmptyState
          icon={TicketPercent}
          title={coupons.length ? "No coupons match" : "No coupons yet"}
          text="Create percentage, fixed amount, buy-X-get-Y or free delivery coupons."
          action={<Link href="/dashboard/coupons/new" className={buttonClass("primary")}><Plus className="h-4 w-4" /> Create coupon</Link>}
        />
      ) : view === "table" ? (
        <CouponsTable coupons={rows} categories={categories} brands={brands} actions={actions} />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {rows.map((c) => (
            <CouponCard key={c._id} coupon={c} categories={categories} brands={brands} onToggle={() => toggle.mutate(c._id)} toggling={toggle.isPending} actions={actions(c)} />
          ))}
        </div>
      )}

      <ConfirmDialog
        open={!!toDelete}
        onClose={() => setToDelete(null)}
        onConfirm={() => remove.mutate(toDelete._id)}
        loading={remove.isPending}
        title="Delete coupon?"
        message={`"${toDelete?.code}" will stop working immediately. Orders that already used it keep their discount.`}
      />
    </>
  );
}
