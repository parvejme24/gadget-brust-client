"use client";

import { useEffect, useState } from "react";
import { adminService } from "@/lib/services/adminService";
import { useAdminMutation } from "@/lib/hooks/useAdmin";
import { Button, Field, Modal, Toggle, inputClass } from "@/components/Dashboard/Kit";
import { emptyForm, toForm, toPayload } from "./shippingForm";

// editing: a method, "new", or null (closed)
export default function ShippingFormModal({ editing, onClose }) {
  const [form, setForm] = useState(emptyForm);
  const [formError, setFormError] = useState("");
  useEffect(() => {
    if (!editing) return;
    setFormError("");
    setForm(editing === "new" ? emptyForm : toForm(editing));
  }, [editing]);
  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const save = useAdminMutation((payload) => (editing === "new" ? adminService.createShipping(payload) : adminService.updateShipping(editing._id, payload)), {
    success: editing === "new" ? "Shipping method created" : "Shipping method updated",
    onSuccess: onClose,
  });

  const submit = (e) => {
    e.preventDefault();
    if (form.name.trim().length < 2) return setFormError("Enter a name.");
    if (Number(form.minDays) > Number(form.maxDays)) return setFormError("Minimum days can't be more than maximum days.");
    save.mutate(toPayload(form));
  };

  return (
    <Modal
      open={!!editing}
      onClose={onClose}
      size="lg"
      title={editing === "new" ? "New shipping method" : "Edit shipping method"}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button type="submit" form="shipping-form" loading={save.isPending}>{editing === "new" ? "Create" : "Save changes"}</Button>
        </>
      }
    >
      <form id="shipping-form" onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
        <Field label="Name" htmlFor="s-name" className="sm:col-span-2" error={formError}>
          <input id="s-name" value={form.name} onChange={set("name")} placeholder="e.g. Inside Dhaka" className={inputClass} />
        </Field>
        <Field label="Description" htmlFor="s-desc" className="sm:col-span-2">
          <input id="s-desc" value={form.description} onChange={set("description")} placeholder="Shown to customers at checkout" className={inputClass} />
        </Field>
        <Field label="Base charge (৳)" htmlFor="s-base"><input id="s-base" type="number" min="0" value={form.baseCharge} onChange={set("baseCharge")} className={inputClass} /></Field>
        <Field label="Per kg charge (৳)" htmlFor="s-kg"><input id="s-kg" type="number" min="0" value={form.perKgCharge} onChange={set("perKgCharge")} className={inputClass} /></Field>
        <Field label="Minimum order (৳)" htmlFor="s-min"><input id="s-min" type="number" min="0" value={form.minOrderAmount} onChange={set("minOrderAmount")} className={inputClass} /></Field>
        <Field label="Free delivery over (৳)" htmlFor="s-free" hint="0 = never free"><input id="s-free" type="number" min="0" value={form.freeShippingThreshold} onChange={set("freeShippingThreshold")} className={inputClass} /></Field>
        <Field label="Min. days" htmlFor="s-mind"><input id="s-mind" type="number" min="1" value={form.minDays} onChange={set("minDays")} className={inputClass} /></Field>
        <Field label="Max. days" htmlFor="s-maxd"><input id="s-maxd" type="number" min="1" value={form.maxDays} onChange={set("maxDays")} className={inputClass} /></Field>
        <Field label="Zones" htmlFor="s-zones" className="sm:col-span-2" hint="Comma separated. Add an extra charge with a colon, e.g. Remote Areas:50">
          <input id="s-zones" value={form.zones} onChange={set("zones")} placeholder="Dhaka City, Remote Areas:50" className={inputClass} />
        </Field>
        <div className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3 sm:col-span-2">
          <span className="text-sm font-medium text-gray-900">Available at checkout</span>
          <Toggle checked={form.isActive} onChange={(isActive) => setForm({ ...form, isActive })} label="Available at checkout" />
        </div>
      </form>
    </Modal>
  );
}
