"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Truck } from "lucide-react";
import { adminService } from "@/lib/services/adminService";
import { useAdminCouriers, useAdminMutation } from "@/lib/hooks/useAdmin";
import { Button, Field, Modal, Toggle, formatTaka, inputClass } from "@/components/Dashboard/Kit";
import { DropdownSelect } from "@/components/ui/dropdown-select";

// pick a courier and tracking number; can also move the order to "shipped"
export default function ShipmentModal({ order, open, onClose }) {
  const { data: couriers = [] } = useAdminCouriers();
  const shipment = order.shipment?.courier ? order.shipment : null;
  const status = order.orderStatus || "pending";
  const active = couriers.filter((c) => c.isActive || c._id === shipment?.courier?._id);
  const [form, setForm] = useState({ courier: "", trackingNumber: "", note: "", markShipped: true });

  useEffect(() => {
    if (!open) return;
    setForm({
      courier: shipment?.courier?._id || couriers.find((c) => c.isDefault)?._id || active[0]?._id || "",
      trackingNumber: shipment?.trackingNumber || "",
      note: shipment?.note || "",
      markShipped: ["pending", "processing"].includes(status),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, couriers.length]);

  const save = useAdminMutation((payload) => adminService.updateShipment(order._id, payload), { success: "Shipment saved", onSuccess: onClose });

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={shipment ? "Update shipment" : "Ship with courier"}
      description={`Order ${order.invoiceNumber} · ${formatTaka(order.total)}`}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button
            loading={save.isPending}
            disabled={!form.courier}
            onClick={() => save.mutate({ ...form, trackingNumber: form.trackingNumber.trim(), note: form.note.trim() })}
          >
            <Truck className="h-4 w-4" /> {form.markShipped ? "Save & mark shipped" : "Save shipment"}
          </Button>
        </>
      }
    >
      {active.length === 0 ? (
        <div className="text-center text-sm text-gray-600">
          No active couriers yet.{" "}
          <Link href="/dashboard/couriers" className="font-semibold text-gray-900 underline">Add a courier</Link> first.
        </div>
      ) : (
        <div className="space-y-4">
          {status === "pending" && (
            <p className="rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-800">This order hasn&apos;t been accepted yet. Shipping it accepts it too and takes the items out of stock.</p>
          )}
          <Field label="Courier">
            <DropdownSelect
              value={form.courier}
              onChange={(v) => setForm({ ...form, courier: v })}
              placeholder="Choose a courier"
              options={active.map((c) => ({
                value: c._id,
                label: c.name,
                description: `${formatTaka(c.charges?.insideDhaka)} Dhaka · ${formatTaka(c.charges?.outsideDhaka)} outside${c.isDefault ? " · default" : ""}`,
              }))}
            />
          </Field>
          <Field label="Tracking / consignment number" htmlFor="tracking" hint="From the courier's merchant panel. You can add it later.">
            <input id="tracking" value={form.trackingNumber} onChange={(e) => setForm({ ...form, trackingNumber: e.target.value })} placeholder="e.g. SF12345678" className={`${inputClass} font-mono`} />
          </Field>
          <Field label="Note (optional)" htmlFor="ship-note">
            <input id="ship-note" value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} placeholder="Pickup slot, fragile item…" className={inputClass} />
          </Field>
          {["pending", "processing"].includes(status) && (
            <label className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3">
              <span className="text-sm font-medium text-gray-900">Mark order as shipped</span>
              <Toggle checked={form.markShipped} onChange={(v) => setForm({ ...form, markShipped: v })} label="Mark order as shipped" />
            </label>
          )}
        </div>
      )}
    </Modal>
  );
}
