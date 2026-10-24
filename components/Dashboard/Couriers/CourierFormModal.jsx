"use client";

import { useEffect, useState } from "react";
import { adminService } from "@/lib/services/adminService";
import { useAdminMutation } from "@/lib/hooks/useAdmin";
import { Button, CourierBadge, Field, ImageInput, Modal, Toggle, inputClass } from "@/components/Dashboard/Kit";
import { emptyForm, suggestions, toForm, toPayload } from "./courierForm";

// editing: a courier, "new", or null (closed)
export default function CourierFormModal({ editing, couriers, onClose }) {
  const [form, setForm] = useState(emptyForm);
  const [formError, setFormError] = useState("");
  useEffect(() => {
    if (!editing) return;
    setForm(editing === "new" ? emptyForm : toForm(editing));
    setFormError("");
  }, [editing]);

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e?.target ? e.target.value : e }));
  const save = useAdminMutation((payload) => (editing === "new" ? adminService.createCourier(payload) : adminService.updateCourier(editing._id, payload)), {
    success: editing === "new" ? "Courier added" : "Courier updated",
    onSuccess: onClose,
  });
  const unused = suggestions.filter((s) => !couriers.some((c) => c.name.toLowerCase() === s.name.toLowerCase()));

  const submit = (e) => {
    e.preventDefault();
    if (form.name.trim().length < 2) return setFormError("Enter the courier's name.");
    if (form.trackingUrl && !form.trackingUrl.includes("{tracking}")) return setFormError("The tracking link must contain {tracking}.");
    setFormError("");
    save.mutate(toPayload(form));
  };

  return (
    <Modal
      open={!!editing}
      onClose={onClose}
      size="lg"
      title={editing === "new" ? "Add courier" : `Edit ${editing?.name || "courier"}`}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button type="submit" form="courier-form" loading={save.isPending}>{editing === "new" ? "Add courier" : "Save changes"}</Button>
        </>
      }
    >
      <form id="courier-form" onSubmit={submit} className="space-y-5">
        {editing === "new" && unused.length > 0 && (
          <div>
            <p className="mb-2 text-[13px] font-medium text-gray-700">Quick add</p>
            <div className="flex flex-wrap gap-2">
              {unused.map((s) => (
                <button
                  key={s.name}
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, name: s.name, color: s.color, website: s.website }))}
                  className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-surface py-1 pl-1 pr-3 text-xs font-semibold text-gray-700 hover:border-gray-400"
                >
                  <CourierBadge courier={s} size="h-6 w-6 text-[9px] rounded-full" />
                  {s.name}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Courier name" htmlFor="c-name" className="sm:col-span-2" error={formError}>
            <input id="c-name" value={form.name} onChange={set("name")} placeholder="e.g. Steadfast Courier" className={inputClass} />
          </Field>
          <Field label="Brand colour" htmlFor="c-color" hint="Used when there's no logo.">
            <div className="flex gap-2">
              <input id="c-color" type="color" value={form.color} onChange={set("color")} className="h-10 w-12 shrink-0 cursor-pointer rounded-xl border border-gray-200 bg-surface p-1" />
              <input value={form.color} onChange={set("color")} aria-label="Brand colour hex" className={inputClass} />
            </div>
          </Field>
          <Field label="Phone / hotline" htmlFor="c-phone">
            <input id="c-phone" type="tel" value={form.phone} onChange={set("phone")} placeholder="Support number" className={inputClass} />
          </Field>
          <Field label="Website" htmlFor="c-web">
            <input id="c-web" type="url" value={form.website} onChange={set("website")} placeholder="https://" className={inputClass} />
          </Field>
          <Field label="Merchant / store ID" htmlFor="c-merchant" hint="Your account ID with this courier (optional).">
            <input id="c-merchant" value={form.merchantId} onChange={set("merchantId")} className={inputClass} />
          </Field>
          <Field label="Tracking link" htmlFor="c-track" className="sm:col-span-2" hint="Optional. Use {tracking} where the tracking number goes, e.g. https://courier.com/track/{tracking}">
            <input id="c-track" value={form.trackingUrl} onChange={set("trackingUrl")} placeholder="https://…/{tracking}" className={inputClass} />
          </Field>
        </div>

        <ImageInput value={form.logo} onChange={set("logo")} label="Logo" hint="Optional. Square logos look best." />

        <div>
          <p className="mb-2 text-[13px] font-semibold text-gray-900">Rates</p>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <Field label="Inside Dhaka (৳)" htmlFor="c-in"><input id="c-in" type="number" min="0" value={form.insideDhaka} onChange={set("insideDhaka")} className={inputClass} /></Field>
            <Field label="Outside Dhaka (৳)" htmlFor="c-out"><input id="c-out" type="number" min="0" value={form.outsideDhaka} onChange={set("outsideDhaka")} className={inputClass} /></Field>
            <Field label="Per extra kg (৳)" htmlFor="c-kg"><input id="c-kg" type="number" min="0" value={form.perKg} onChange={set("perKg")} className={inputClass} /></Field>
            <Field label="COD charge (%)" htmlFor="c-cod"><input id="c-cod" type="number" min="0" max="100" step="0.1" value={form.codChargePercent} onChange={set("codChargePercent")} className={inputClass} /></Field>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Delivery time inside Dhaka" htmlFor="c-tin"><input id="c-tin" value={form.timeInside} onChange={set("timeInside")} placeholder="1-2 days" className={inputClass} /></Field>
          <Field label="Delivery time outside Dhaka" htmlFor="c-tout"><input id="c-tout" value={form.timeOutside} onChange={set("timeOutside")} placeholder="2-4 days" className={inputClass} /></Field>
          <Field label="Notes" htmlFor="c-notes" className="sm:col-span-2">
            <textarea id="c-notes" rows={2} value={form.notes} onChange={set("notes")} placeholder="Pickup times, contact person…" className={`${inputClass} h-auto py-2.5`} />
          </Field>
        </div>

        <div className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3">
          <span className="text-sm font-medium text-gray-900">Available for new shipments</span>
          <Toggle checked={form.isActive} onChange={set("isActive")} label="Available for new shipments" />
        </div>
      </form>
    </Modal>
  );
}
