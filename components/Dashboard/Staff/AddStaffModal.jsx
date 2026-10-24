"use client";

import { useEffect, useState } from "react";
import { Shuffle } from "lucide-react";
import { adminService } from "@/lib/services/adminService";
import { useAdminMutation } from "@/lib/hooks/useAdmin";
import { ROLE_INFO, ROLE_PERMISSIONS } from "@/lib/permissions";
import { Button, Field, Modal, cx, inputClass } from "@/components/Dashboard/Kit";
import { DropdownSelect } from "@/components/ui/dropdown-select";
import { AREAS, makePassword, roleOptions } from "./staffConfig";

const blank = () => ({ fullName: "", email: "", phone: "", role: "cashier", password: makePassword(), customerId: "" });

// create a staff login, or give an existing customer account a staff role
export default function AddStaffModal({ open, onClose, customers }) {
  const [mode, setMode] = useState("new");
  const [form, setForm] = useState(blank);
  const [formError, setFormError] = useState("");
  const set = (key) => (e) => setForm({ ...form, [key]: e?.target ? e.target.value : e });

  useEffect(() => {
    if (!open) return;
    setMode("new");
    setForm(blank());
    setFormError("");
  }, [open]);

  const createStaff = useAdminMutation((data) => adminService.createUser(data), { success: "Staff account created", onSuccess: onClose });
  const promote = useAdminMutation(({ id, role }) => adminService.updateUserRole(id, role), { success: (_, v) => `Role changed to ${ROLE_INFO[v.role].label}`, onSuccess: onClose });

  const submit = () => {
    if (mode === "existing") {
      if (!form.customerId) return setFormError("Choose a customer account.");
      return promote.mutate({ id: form.customerId, role: form.role });
    }
    if (form.fullName.trim().length < 2) return setFormError("Enter the staff member's name.");
    if (!/^\S+@\S+\.\S+$/.test(form.email)) return setFormError("Enter a valid email.");
    if (form.password.length < 6) return setFormError("Password must be at least 6 characters.");
    setFormError("");
    createStaff.mutate({ fullName: form.fullName.trim(), email: form.email.trim(), phone: form.phone.trim(), role: form.role, password: form.password });
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Add staff"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button loading={createStaff.isPending || promote.isPending} onClick={submit}>{mode === "new" ? "Create account" : "Give access"}</Button>
        </>
      }
    >
      <div className="space-y-4">
        <div className="flex rounded-xl bg-gray-100 p-1 text-sm font-semibold">
          {[
            ["new", "New account"],
            ["existing", "Existing customer"],
          ].map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => {
                setMode(key);
                setFormError("");
              }}
              className={cx("flex-1 rounded-lg py-1.5 transition", mode === key ? "bg-surface text-gray-900 shadow-sm" : "text-gray-500")}
            >
              {label}
            </button>
          ))}
        </div>

        {mode === "new" ? (
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Full name" htmlFor="s-name" className="sm:col-span-2"><input id="s-name" value={form.fullName} onChange={set("fullName")} className={inputClass} /></Field>
            <Field label="Email (login)" htmlFor="s-email"><input id="s-email" type="email" value={form.email} onChange={set("email")} className={inputClass} /></Field>
            <Field label="Phone" htmlFor="s-phone"><input id="s-phone" type="tel" value={form.phone} onChange={set("phone")} className={inputClass} /></Field>
            <Field label="Temporary password" htmlFor="s-pass" className="sm:col-span-2" hint="Share it privately; they can change it from My profile.">
              <div className="flex gap-2">
                <input id="s-pass" value={form.password} onChange={set("password")} className={cx(inputClass, "font-mono")} />
                <Button type="button" variant="secondary" onClick={() => setForm({ ...form, password: makePassword() })} title="Generate" aria-label="Generate a password"><Shuffle className="h-4 w-4" /></Button>
              </div>
            </Field>
          </div>
        ) : (
          <Field label="Customer account" hint="They sign in with their existing email and password.">
            <DropdownSelect value={form.customerId} onChange={set("customerId")} placeholder="Choose a customer" options={customers.map((u) => ({ value: u._id, label: u.fullName, description: u.email }))} />
          </Field>
        )}

        <Field label="Role">
          <DropdownSelect value={form.role} onChange={set("role")} options={roleOptions} />
        </Field>
        <div className="flex flex-wrap gap-1.5">
          {ROLE_PERMISSIONS[form.role].map((p) => (
            <span key={p} className="rounded-md bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">{AREAS.find(([k]) => k === p)?.[1] || p}</span>
          ))}
        </div>
        {formError && <p className="rounded-xl bg-red-50 px-3.5 py-2.5 text-sm text-red-700" role="alert">{formError}</p>}
      </div>
    </Modal>
  );
}
