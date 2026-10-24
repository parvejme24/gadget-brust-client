"use client";

import { useState } from "react";
import { Bike, PackageCheck, Plus, Star } from "lucide-react";
import { adminService } from "@/lib/services/adminService";
import { useAdminCouriers, useAdminMutation } from "@/lib/hooks/useAdmin";
import { Button, ConfirmDialog, EmptyState, ErrorState, PageHeader, StatCard, ViewToggle, useViewMode } from "@/components/Dashboard/Kit";
import CourierCard from "@/components/Dashboard/Couriers/CourierCard";
import CouriersTable from "@/components/Dashboard/Couriers/CouriersTable";
import CourierActions from "@/components/Dashboard/Couriers/CourierActions";
import CourierFormModal from "@/components/Dashboard/Couriers/CourierFormModal";

export default function CouriersPage() {
  const { data: couriers = [], isLoading, isError, error, refetch } = useAdminCouriers();
  const [view, setView] = useViewMode("couriers", "grid");
  const [editing, setEditing] = useState(null);
  const [toDelete, setToDelete] = useState(null);

  const toggle = useAdminMutation((id) => adminService.toggleCourier(id), { success: (c) => (c?.isActive ? "Courier activated" : "Courier paused") });
  const makeDefault = useAdminMutation((id) => adminService.setDefaultCourier(id), { success: "Default courier updated" });
  const remove = useAdminMutation((id) => adminService.deleteCourier(id), { success: "Courier deleted", onSuccess: () => setToDelete(null) });

  const active = couriers.filter((c) => c.isActive);
  const totalParcels = couriers.reduce((s, c) => s + (c.parcels || 0), 0);
  const defaultCourier = couriers.find((c) => c.isDefault);
  const actions = (c) => <CourierActions courier={c} onDefault={() => makeDefault.mutate(c._id)} onEdit={() => setEditing(c)} onDelete={() => setToDelete(c)} />;

  return (
    <>
      <PageHeader
        title="Couriers"
        description="Delivery partners you hand parcels to. Assign one to each order when you ship it."
        actions={
          <>
            <ViewToggle value={view} onChange={setView} />
            <Button onClick={() => setEditing("new")}><Plus className="h-4 w-4" /> Add courier</Button>
          </>
        }
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <StatCard loading={isLoading} label="Active couriers" value={`${active.length} / ${couriers.length}`} icon={Bike} tone="brand" />
        <StatCard loading={isLoading} label="Parcels shipped" value={totalParcels} icon={PackageCheck} tone="sky" hint="Across all couriers" />
        <StatCard loading={isLoading} label="Default courier" value={defaultCourier?.name || "—"} icon={Star} tone="amber" hint="Pre-selected when you ship an order" />
      </div>

      {isError ? (
        <ErrorState error={error} onRetry={refetch} />
      ) : isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-56 animate-pulse rounded-2xl bg-gray-100" />)}</div>
      ) : couriers.length === 0 ? (
        <EmptyState icon={Bike} title="No couriers yet" text="Add Steadfast, Pathao, RedX or any partner you use." action={<Button onClick={() => setEditing("new")}><Plus className="h-4 w-4" /> Add courier</Button>} />
      ) : view === "table" ? (
        <CouriersTable couriers={couriers} onToggle={toggle.mutate} toggling={toggle.isPending} actions={actions} />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {couriers.map((c) => <CourierCard key={c._id} courier={c} onToggle={toggle.mutate} toggling={toggle.isPending} actions={actions(c)} />)}
        </div>
      )}

      <CourierFormModal editing={editing} couriers={couriers} onClose={() => setEditing(null)} />
      <ConfirmDialog
        open={!!toDelete}
        onClose={() => setToDelete(null)}
        onConfirm={() => remove.mutate(toDelete._id)}
        loading={remove.isPending}
        title="Delete courier?"
        message={`"${toDelete?.name}" will be removed. Past orders keep their tracking numbers.`}
      />
    </>
  );
}
