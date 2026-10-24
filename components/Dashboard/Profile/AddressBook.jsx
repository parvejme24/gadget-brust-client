"use client";

import { useState } from "react";
import { toast } from "sonner";
import { MapPin, Pencil, Plus, Star, Trash2 } from "lucide-react";
import { useAddressActions, useAddresses } from "@/lib/hooks/useAccount";
import { Button, ConfirmDialog, Field, Modal, Panel, cx, inputClass } from "@/components/Dashboard/Kit";

const LABELS = ["Home", "Office", "Other"];
const empty = { label: "Home", name: "", phone: "", street: "", city: "", zipCode: "", isDefault: false };
const BD_PHONE = /^(?:\+?88)?01[3-9]\d{8}$/;

function AddressForm({ address, onClose }) {
  const { create, update } = useAddressActions();
  const [form, setForm] = useState({ ...empty, ...address });
  const [error, setError] = useState("");
  const set = (key) => (e) => setForm({ ...form, [key]: e.target.type === "checkbox" ? e.target.checked : e.target.value });
  const saving = create.isPending || update.isPending;

  const save = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.street.trim() || !form.city.trim()) return setError("Name, address and city are required.");
    if (!BD_PHONE.test(form.phone.replace(/[\s-]/g, ""))) return setError("Enter a valid mobile number (01XXXXXXXXX).");
    setError("");
    try {
      await (form._id ? update : create).mutateAsync(form);
    } catch {
      return; // the hook shows the error
    }
    toast.success(form._id ? "Address updated" : "Address saved");
    onClose();
  };

  return (
    <Modal
      open
      onClose={onClose}
      title={form._id ? "Edit address" : "New address"}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button type="submit" form="address-form" loading={saving}>Save address</Button>
        </>
      }
    >
      <form id="address-form" onSubmit={save} className="grid gap-4 sm:grid-cols-2">
        <Field label="Label" className="sm:col-span-2">
          <div className="flex gap-2">
            {LABELS.map((label) => (
              <button
                key={label}
                type="button"
                onClick={() => setForm({ ...form, label })}
                className={cx(
                  "h-9 rounded-xl border px-4 text-sm font-medium transition",
                  form.label === label ? "border-gray-900 bg-gray-900 text-white" : "border-gray-200 text-gray-600 hover:border-gray-300"
                )}
              >
                {label}
              </button>
            ))}
          </div>
        </Field>
        <Field label="Full name" htmlFor="addr-name">
          <input id="addr-name" value={form.name} onChange={set("name")} autoComplete="name" className={inputClass} />
        </Field>
        <Field label="Mobile number" htmlFor="addr-phone">
          <input id="addr-phone" value={form.phone} onChange={set("phone")} autoComplete="tel" inputMode="tel" placeholder="01XXXXXXXXX" className={inputClass} />
        </Field>
        <Field label="Address" htmlFor="addr-street" className="sm:col-span-2">
          <input id="addr-street" value={form.street} onChange={set("street")} autoComplete="street-address" placeholder="House, road, area" className={inputClass} />
        </Field>
        <Field label="City" htmlFor="addr-city">
          <input id="addr-city" value={form.city} onChange={set("city")} autoComplete="address-level2" className={inputClass} />
        </Field>
        <Field label="Postcode (optional)" htmlFor="addr-zip">
          <input id="addr-zip" value={form.zipCode} onChange={set("zipCode")} autoComplete="postal-code" className={inputClass} />
        </Field>
        <label className="flex items-center gap-2 text-sm text-gray-700 sm:col-span-2">
          <input type="checkbox" checked={form.isDefault} onChange={set("isDefault")} className="h-4 w-4 rounded border-gray-300" />
          Use as my default delivery address
        </label>
        {error && <p className="text-sm text-red-600 sm:col-span-2">{error}</p>}
      </form>
    </Modal>
  );
}

// the customer's saved delivery addresses, used to prefill checkout
export default function AddressBook() {
  const { data: addresses = [], isLoading } = useAddresses();
  const { remove, setDefault } = useAddressActions();
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);

  const confirmDelete = async () => {
    try {
      await remove.mutateAsync(deleting._id);
    } catch {
      return;
    }
    toast.success("Address removed");
    setDeleting(null);
  };

  return (
    <Panel
      title="Delivery addresses"
      description="Saved addresses are filled in for you at checkout."
      action={
        addresses.length < 10 && (
          <Button size="sm" variant="secondary" onClick={() => setEditing({})}>
            <Plus className="h-4 w-4" /> Add address
          </Button>
        )
      }
    >
      {isLoading ? (
        <div className="grid gap-3 sm:grid-cols-2">{[0, 1].map((i) => <div key={i} className="h-28 animate-pulse rounded-2xl bg-gray-100" />)}</div>
      ) : addresses.length === 0 ? (
        <div className="flex flex-col items-center rounded-2xl border border-dashed border-gray-200 px-4 py-8 text-center">
          <MapPin className="h-6 w-6 text-gray-300" />
          <p className="mt-2 text-sm text-gray-500">No saved addresses yet. Add one, or tick "save this address" at checkout.</p>
        </div>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2">
          {addresses.map((a) => (
            <li key={a._id} className={cx("rounded-2xl border p-4", a.isDefault ? "border-gray-900/30 bg-gray-50/60" : "border-gray-200/70")}>
              <div className="flex items-start justify-between gap-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-semibold text-gray-700">{a.label}</span>
                  {a.isDefault && <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">Default</span>}
                </div>
                <div className="flex shrink-0 gap-0.5">
                  <button onClick={() => setEditing(a)} aria-label="Edit address" className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700">
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button onClick={() => setDeleting(a)} aria-label="Delete address" className="rounded-lg p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <p className="mt-3 text-sm font-semibold text-gray-900">{a.name}</p>
              <p className="text-sm text-gray-600">{a.phone}</p>
              <p className="mt-1 text-sm leading-6 text-gray-600">
                {a.street}, {a.city}
                {a.zipCode ? ` ${a.zipCode}` : ""}
              </p>
              {!a.isDefault && (
                <button onClick={() => setDefault.mutate(a._id)} disabled={setDefault.isPending} className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-gray-600 hover:text-gray-900">
                  <Star className="h-3.5 w-3.5" /> Make default
                </button>
              )}
            </li>
          ))}
        </ul>
      )}

      {editing && <AddressForm address={editing} onClose={() => setEditing(null)} />}
      <ConfirmDialog
        open={!!deleting}
        onClose={() => setDeleting(null)}
        onConfirm={confirmDelete}
        loading={remove.isPending}
        title="Delete this address?"
        message={deleting ? `${deleting.label}: ${deleting.street}, ${deleting.city}` : ""}
      />
    </Panel>
  );
}
