"use client";

import { useState } from "react";
import { KeyRound } from "lucide-react";
import { adminService } from "@/lib/services/adminService";
import { useAdminMutation } from "@/lib/hooks/useAdmin";
import { Button, Field, Panel, inputClass } from "@/components/Dashboard/Kit";

const empty = { currentPassword: "", newPassword: "", confirm: "" };

export default function PasswordForm() {
  const [passwords, setPasswords] = useState(empty);
  const [error, setError] = useState("");
  const change = useAdminMutation((data) => adminService.changePassword(data), { success: "Password changed", onSuccess: () => setPasswords(empty) });
  const set = (key) => (e) => setPasswords({ ...passwords, [key]: e.target.value });

  const submit = (e) => {
    e.preventDefault();
    if (passwords.newPassword.length < 6) return setError("New password must be at least 6 characters.");
    if (passwords.newPassword !== passwords.confirm) return setError("Passwords don't match.");
    setError("");
    change.mutate({ currentPassword: passwords.currentPassword, newPassword: passwords.newPassword });
  };

  return (
    <Panel title="Change password" description="Use at least 6 characters. You'll stay signed in on this device.">
      <form onSubmit={submit} className="grid gap-4 sm:grid-cols-3">
        <Field label="Current password" htmlFor="currentPassword">
          <input id="currentPassword" type="password" autoComplete="current-password" value={passwords.currentPassword} onChange={set("currentPassword")} className={inputClass} />
        </Field>
        <Field label="New password" htmlFor="newPassword">
          <input id="newPassword" type="password" autoComplete="new-password" value={passwords.newPassword} onChange={set("newPassword")} className={inputClass} />
        </Field>
        <Field label="Confirm new password" htmlFor="confirm">
          <input id="confirm" type="password" autoComplete="new-password" value={passwords.confirm} onChange={set("confirm")} className={inputClass} />
        </Field>
        {error && <p className="text-sm text-red-600 sm:col-span-3">{error}</p>}
        <div className="sm:col-span-3">
          <Button type="submit" variant="secondary" loading={change.isPending} disabled={!passwords.currentPassword || !passwords.newPassword}>
            <KeyRound className="h-4 w-4" /> Update password
          </Button>
        </div>
      </form>
    </Panel>
  );
}
