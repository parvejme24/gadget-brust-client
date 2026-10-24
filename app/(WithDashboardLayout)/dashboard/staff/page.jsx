"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Plus } from "lucide-react";
import { adminService } from "@/lib/services/adminService";
import { useAdminMutation, useAdminUsers } from "@/lib/hooks/useAdmin";
import { useDashboardUser } from "@/components/Dashboard/Layout/DashboardUser";
import { ROLE_INFO } from "@/lib/permissions";
import { Button, ConfirmDialog, ErrorState, PageHeader, Panel, SearchInput } from "@/components/Dashboard/Kit";
import RoleCards from "@/components/Dashboard/Staff/RoleCards";
import StaffTable from "@/components/Dashboard/Staff/StaffTable";
import PermissionsMatrix from "@/components/Dashboard/Staff/PermissionsMatrix";
import AddStaffModal from "@/components/Dashboard/Staff/AddStaffModal";
import ResetPasswordModal from "@/components/Dashboard/Staff/ResetPasswordModal";

function StaffView() {
  const me = useDashboardUser();
  const searchParams = useSearchParams();
  const { data: users = [], isLoading, isError, error, refetch } = useAdminUsers();
  const [search, setSearch] = useState(searchParams.get("q") || "");
  const [roleFilter, setRoleFilter] = useState("");
  const [adding, setAdding] = useState(false);
  const [resetting, setResetting] = useState(null);
  const [toRemove, setToRemove] = useState(null);

  // the top bar search links here with ?q=email
  useEffect(() => setSearch(searchParams.get("q") || ""), [searchParams]);

  const staff = users.filter((u) => u.role !== "user");
  const customers = users.filter((u) => u.role === "user");
  const rows = useMemo(() => {
    const q = search.trim().toLowerCase();
    return staff.filter((u) => (!roleFilter || u.role === roleFilter) && (!q || `${u.fullName} ${u.email}`.toLowerCase().includes(q)));
  }, [staff, search, roleFilter]);

  const changeRole = useAdminMutation(({ id, role }) => adminService.updateUserRole(id, role), {
    success: (_, v) => (v.role === "user" ? "Staff access removed" : `Role changed to ${ROLE_INFO[v.role].label}`),
    onSuccess: () => setToRemove(null),
  });
  const setActive = useAdminMutation(({ id, isActive }) => adminService.updateUser(id, { isActive }), {
    success: (_, v) => (v.isActive ? "Account activated" : "Account deactivated"),
  });

  return (
    <>
      <PageHeader
        title="Staff & roles"
        description="Give your team their own logins with exactly the access they need."
        actions={<Button onClick={() => setAdding(true)}><Plus className="h-4 w-4" /> Add staff</Button>}
      />

      <RoleCards staff={staff} value={roleFilter} onChange={setRoleFilter} />

      <Panel bodyClassName="" className="mb-6">
        <div className="flex flex-col gap-3 border-b border-gray-100 p-4 sm:flex-row sm:items-center sm:justify-between">
          <SearchInput value={search} onChange={setSearch} placeholder="Search staff…" className="sm:w-72" />
          {roleFilter && <button onClick={() => setRoleFilter("")} className="text-xs font-semibold text-gray-500 hover:text-gray-900">Showing {ROLE_INFO[roleFilter].label} · clear</button>}
        </div>
        {isError ? (
          <ErrorState error={error} onRetry={refetch} />
        ) : (
          <StaffTable
            rows={rows}
            loading={isLoading}
            me={me}
            onRoleChange={(u, role) => changeRole.mutate({ id: u._id, role })}
            onActiveChange={(u, isActive) => setActive.mutate({ id: u._id, isActive })}
            busy={setActive.isPending}
            onResetPassword={setResetting}
            onRemove={setToRemove}
          />
        )}
      </Panel>

      <PermissionsMatrix />

      <AddStaffModal open={adding} onClose={() => setAdding(false)} customers={customers} />
      <ResetPasswordModal user={resetting} onClose={() => setResetting(null)} />
      <ConfirmDialog
        open={!!toRemove}
        onClose={() => setToRemove(null)}
        onConfirm={() => changeRole.mutate({ id: toRemove._id, role: "user" })}
        loading={changeRole.isPending}
        confirmLabel="Remove access"
        title="Remove staff access?"
        message={`${toRemove?.fullName} will become a regular customer account. They keep their customer dashboard but can't open staff pages.`}
      />
    </>
  );
}

export default function StaffPage() {
  return (
    <Suspense fallback={null}>
      <StaffView />
    </Suspense>
  );
}
