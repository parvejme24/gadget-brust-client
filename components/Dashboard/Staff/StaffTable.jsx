import { KeyRound, Trash2, UserCog } from "lucide-react";
import { ROLE_INFO } from "@/lib/permissions";
import { Avatar, DataTable, EmptyState, Toggle, buttonClass, cx, formatDate } from "@/components/Dashboard/Kit";
import { DropdownSelect } from "@/components/ui/dropdown-select";
import { roleOptions, roleTone } from "./staffConfig";

export default function StaffTable({ rows, loading, me, onRoleChange, onActiveChange, busy, onResetPassword, onRemove }) {
  return (
    <DataTable
      loading={loading}
      rows={rows}
      empty={<EmptyState icon={UserCog} title="No staff found" />}
      columns={[
        {
          key: "name",
          header: "Staff member",
          render: (u) => (
            <div className="flex min-w-[200px] items-center gap-3">
              <Avatar name={u.fullName} />
              <div className="min-w-0">
                <p className="truncate font-semibold text-gray-900">{u.fullName}{u._id === me?._id && <span className="ml-1.5 text-xs font-normal text-gray-500">(you)</span>}</p>
                <p className="truncate text-xs text-gray-500">{u.email}</p>
              </div>
            </div>
          ),
        },
        {
          key: "role",
          header: "Role",
          render: (u) =>
            u._id === me?._id ? (
              <span className={cx("rounded-lg px-2 py-0.5 text-xs font-bold", roleTone[u.role])}>{ROLE_INFO[u.role]?.label}</span>
            ) : (
              <DropdownSelect size="sm" className="w-40" label={`Role for ${u.fullName}`} value={u.role} onChange={(role) => role !== u.role && onRoleChange(u, role)} options={roleOptions} />
            ),
        },
        {
          key: "active",
          header: "Can sign in",
          hideBelow: "sm",
          render: (u) => <Toggle checked={u.isActive !== false} disabled={u._id === me?._id || busy} onChange={(v) => onActiveChange(u, v)} label={`${u.fullName} can sign in`} />,
        },
        { key: "joined", header: "Added", hideBelow: "lg", render: (u) => formatDate(u.createdAt) },
        {
          key: "actions",
          header: <span className="sr-only">Actions</span>,
          className: "text-right",
          render: (u) =>
            u._id !== me?._id && (
              <div className="flex justify-end gap-1">
                <button onClick={() => onResetPassword(u)} title="Reset password" aria-label={`Reset password for ${u.fullName}`} className={buttonClass("ghost", "icon")}><KeyRound className="h-4 w-4" /></button>
                <button onClick={() => onRemove(u)} title="Remove staff access" aria-label={`Remove staff access for ${u.fullName}`} className={buttonClass("danger-ghost", "icon")}><Trash2 className="h-4 w-4" /></button>
              </div>
            ),
        },
      ]}
    />
  );
}
