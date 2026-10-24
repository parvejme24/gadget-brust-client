"use client";

import { useEffect, useState } from "react";
import { Shuffle } from "lucide-react";
import { adminService } from "@/lib/services/adminService";
import { useAdminMutation } from "@/lib/hooks/useAdmin";
import { Button, Field, Modal, cx, inputClass } from "@/components/Dashboard/Kit";
import { makePassword } from "./staffConfig";

export default function ResetPasswordModal({ user, onClose }) {
  const [password, setPassword] = useState("");
  useEffect(() => {
    if (user) setPassword(makePassword());
  }, [user]);
  const save = useAdminMutation(() => adminService.updateUser(user._id, { password }), { success: "Password reset", onSuccess: onClose });

  return (
    <Modal
      open={!!user}
      onClose={onClose}
      size="sm"
      title="Reset password"
      description={user?.email}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button loading={save.isPending} disabled={password.length < 6} onClick={() => save.mutate()}>Set password</Button>
        </>
      }
    >
      <Field label="New password" htmlFor="np" hint="Share it privately with this staff member.">
        <div className="flex gap-2">
          <input id="np" value={password} onChange={(e) => setPassword(e.target.value)} className={cx(inputClass, "font-mono")} />
          <Button type="button" variant="secondary" onClick={() => setPassword(makePassword())} title="Generate" aria-label="Generate a password"><Shuffle className="h-4 w-4" /></Button>
        </div>
      </Field>
    </Modal>
  );
}
