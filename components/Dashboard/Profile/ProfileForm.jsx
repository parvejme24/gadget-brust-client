"use client";

import { useEffect, useState } from "react";
import { adminService } from "@/lib/services/adminService";
import { useAdminMutation } from "@/lib/hooks/useAdmin";
import { useAppDispatch } from "@/lib/hooks/redux";
import { updateSessionUser } from "@/lib/services/session";
import { Button, Field, Panel, inputClass } from "@/components/Dashboard/Kit";

export default function ProfileForm({ profile }) {
  const dispatch = useAppDispatch();
  const [fullName, setFullName] = useState("");
  useEffect(() => setFullName(profile.fullName), [profile.fullName]);

  const save = useAdminMutation((data) => adminService.updateProfile(data), {
    success: "Profile updated",
    // keep the header and stored session in step with the new name
    onSuccess: (user) => updateSessionUser(dispatch, { fullName: user.fullName }),
  });

  return (
    <Panel title="Personal information">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (fullName.trim().length >= 2) save.mutate({ fullName: fullName.trim() });
        }}
        className="grid gap-4 sm:grid-cols-2"
      >
        <Field label="Full name" htmlFor="fullName">
          <input id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} autoComplete="name" className={inputClass} />
        </Field>
        <Field label="Email" htmlFor="email" hint="Contact support to change your email.">
          <input id="email" value={profile.email} disabled className={inputClass} />
        </Field>
        <div className="sm:col-span-2">
          <Button type="submit" loading={save.isPending} disabled={fullName.trim() === profile.fullName || fullName.trim().length < 2}>Save changes</Button>
        </div>
      </form>
    </Panel>
  );
}
