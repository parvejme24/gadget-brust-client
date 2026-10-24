"use client";

import { useEffect, useState } from "react";
import { adminService } from "@/lib/services/adminService";
import { useAdminMutation } from "@/lib/hooks/useAdmin";
import { Button, Field, Modal, formatTaka, inputClass } from "@/components/Dashboard/Kit";

// delivery charge, discount and the order note
export default function EditChargesModal({ order, open, onClose }) {
  const [form, setForm] = useState({ shippingCharge: 0, discount: 0, notes: "" });
  useEffect(() => {
    if (open) setForm({ shippingCharge: order.shippingCharge || 0, discount: order.discount || 0, notes: order.notes || "" });
  }, [open, order]);

  const total = order.subtotal - (Number(form.discount) || 0) + (Number(form.shippingCharge) || 0) + (order.tax || 0);
  const save = useAdminMutation(
    () => adminService.editOrder(order._id, { shippingCharge: Number(form.shippingCharge) || 0, discount: Number(form.discount) || 0, notes: form.notes }),
    { success: "Order updated", onSuccess: onClose }
  );

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Charges & note"
      description={`Items subtotal ${formatTaka(order.subtotal)}`}
      footer={
        <>
          <span className="mr-auto self-center text-sm text-gray-600">
            New total <span className="font-bold text-gray-900">{formatTaka(total)}</span>
          </span>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button loading={save.isPending} onClick={() => save.mutate()}>Save</Button>
        </>
      }
    >
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <Field label="Delivery charge (৳)" htmlFor="charge">
            <input id="charge" type="number" min="0" value={form.shippingCharge} onChange={(e) => setForm({ ...form, shippingCharge: e.target.value })} className={inputClass} />
          </Field>
          <Field label="Discount (৳)" htmlFor="discount">
            <input id="discount" type="number" min="0" value={form.discount} onChange={(e) => setForm({ ...form, discount: e.target.value })} className={inputClass} />
          </Field>
        </div>
        <Field label="Order note" htmlFor="notes" hint="Shown on the order and the invoice.">
          <textarea id="notes" rows={3} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} className={`${inputClass} h-auto py-2.5`} />
        </Field>
      </div>
    </Modal>
  );
}
