"use client";

import { useState } from "react";
import { Plus, Truck } from "lucide-react";
import { adminService } from "@/lib/services/adminService";
import { useAdminMutation, useAdminShipping } from "@/lib/hooks/useAdmin";
import { Button, ConfirmDialog, EmptyState, ErrorState, PageHeader, Panel } from "@/components/Dashboard/Kit";
import ShippingCalculator from "@/components/Dashboard/Shipping/ShippingCalculator";
import ShippingMethodCard from "@/components/Dashboard/Shipping/ShippingMethodCard";
import ShippingFormModal from "@/components/Dashboard/Shipping/ShippingFormModal";

export default function ShippingPage() {
  const { data: methods = [], isLoading, isError, error, refetch } = useAdminShipping();
  const [editing, setEditing] = useState(null);
  const [toDelete, setToDelete] = useState(null);
  const toggle = useAdminMutation((id) => adminService.toggleShipping(id), { success: "Availability updated" });
  const remove = useAdminMutation((id) => adminService.deleteShipping(id), { success: "Shipping method deleted", onSuccess: () => setToDelete(null) });

  return (
    <>
      <PageHeader title="Shipping" description="Delivery options offered at checkout: rates, free-delivery thresholds and zones." actions={<Button onClick={() => setEditing("new")}><Plus className="h-4 w-4" /> New method</Button>} />

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="min-w-0 space-y-4 xl:col-span-2">
          {isError ? (
            <ErrorState error={error} onRetry={refetch} />
          ) : isLoading ? (
            Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-40 animate-pulse rounded-2xl bg-gray-100" />)
          ) : methods.length === 0 ? (
            <Panel><EmptyState icon={Truck} title="No shipping methods" text="Add at least one delivery option so customers can check out." /></Panel>
          ) : (
            methods.map((m) => (
              <ShippingMethodCard key={m._id} method={m} onToggle={() => toggle.mutate(m._id)} toggling={toggle.isPending} onEdit={() => setEditing(m)} onDelete={() => setToDelete(m)} />
            ))
          )}
        </div>
        <div className="min-w-0">{methods.length > 0 && <ShippingCalculator methods={methods.filter((m) => m.isActive)} />}</div>
      </div>

      <ShippingFormModal editing={editing} onClose={() => setEditing(null)} />
      <ConfirmDialog
        open={!!toDelete}
        onClose={() => setToDelete(null)}
        onConfirm={() => remove.mutate(toDelete._id)}
        loading={remove.isPending}
        title="Delete shipping method?"
        message={`"${toDelete?.name}" will no longer be offered to customers.`}
      />
    </>
  );
}

