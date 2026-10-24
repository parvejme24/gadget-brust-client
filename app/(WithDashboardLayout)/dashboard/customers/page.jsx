"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowUpDown, Download, Eye, Trash2, UserPlus, Users } from "lucide-react";
import { can } from "@/lib/permissions";
import { adminService } from "@/lib/services/adminService";
import { useAdminMutation, useAdminUsers } from "@/lib/hooks/useAdmin";
import { useSession } from "@/lib/hooks/useSession";
import useCustomerStats from "@/lib/hooks/useCustomerStats";
import {
  ConfirmDialog,
  DataTable,
  EmptyState,
  ErrorState,
  PageHeader,
  Pagination,
  Panel,
  SearchInput,
  StatCard,
  StatusPill,
  buttonClass,
  formatDate,
  formatTaka,
  inputClass,
  Avatar,
} from "@/components/Dashboard/Kit";
import { DropdownSelect } from "@/components/ui/dropdown-select";

const PAGE_SIZE = 12;

export default function CustomersPage() {
  const router = useRouter();
  const { user: me } = useSession();
  const { data: users = [], isLoading, isError, error, refetch } = useAdminUsers();
  const { stats } = useCustomerStats();
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("spent");
  const [page, setPage] = useState(1);
  const [confirm, setConfirm] = useState(null);

  const rows = useMemo(() => {
    const q = search.trim().toLowerCase();
    return users
      .map((u) => ({ ...u, ...(stats[u._id] || { orders: 0, spent: 0, lastOrder: null }) }))
      .filter((u) => u.role === "user" && (!q || [u.fullName, u.email, u.phone].some((v) => v?.toLowerCase().includes(q))))
      .sort((a, b) =>
        sort === "spent" ? b.spent - a.spent : sort === "orders" ? b.orders - a.orders : sort === "newest" ? new Date(b.createdAt) - new Date(a.createdAt) : a.fullName.localeCompare(b.fullName)
      );
  }, [users, stats, search, sort]);

  const customers = users.filter((u) => u.role === "user");
  const totalSpent = Object.values(stats).reduce((s, x) => s + x.spent, 0);
  const repeat = customers.filter((u) => (stats[u._id]?.orders || 0) > 1).length;

  const canDelete = can(me?.role, "staff");
  const roleMutation = useAdminMutation(({ id, role }) => adminService.updateUserRole(id, role), {
    success: "Role updated",
    onSuccess: () => setConfirm(null),
  });
  const deleteMutation = useAdminMutation((id) => adminService.deleteUser(id), { success: "User deleted", onSuccess: () => setConfirm(null) });

  const exportCSV = () => {
    const csv = [["Name", "Email", "Phone", "Orders", "Spent", "Joined", "Last order"], ...rows.map((u) => [u.fullName, u.email, u.phone, u.orders, u.spent, formatDate(u.createdAt), formatDate(u.lastOrder)])]
      .map((r) => r.map((v) => `"${String(v ?? "").replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    a.download = `customers-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  return (
    <>
      <PageHeader
        title="Customers"
        description="Everyone who shops with an account. Staff are managed under Staff & roles."
        actions={<button onClick={exportCSV} disabled={!rows.length} className={buttonClass("secondary")}><Download className="h-4 w-4" /> Export CSV</button>}
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <StatCard loading={isLoading} label="Customers" value={customers.length} icon={Users} tone="violet" hint="Registered shoppers" />
        <StatCard loading={isLoading} label="Repeat customers" value={repeat} icon={UserPlus} tone="sky" hint={customers.length ? `${Math.round((repeat / customers.length) * 100)}% ordered more than once` : ""} />
        <StatCard loading={isLoading} label="Lifetime value" value={formatTaka(customers.length ? totalSpent / customers.length : 0)} hint="Average paid spend per customer" tone="brand" />
      </div>

      <Panel bodyClassName="">
        <div className="grid gap-3 border-b border-gray-100 p-4 sm:grid-cols-4">
          <SearchInput value={search} onChange={(v) => { setSearch(v); setPage(1); }} placeholder="Search name, email or phone…" className="sm:col-span-3" />
          <DropdownSelect label="Sort customers" icon={ArrowUpDown} value={sort} onChange={setSort} options={[{ value: "spent", label: "Top spenders" }, { value: "orders", label: "Most orders" }, { value: "newest", label: "Newest" }, { value: "name", label: "Name A-Z" }]} />
        </div>
        {isError ? (
          <ErrorState error={error} onRetry={refetch} />
        ) : (
          <DataTable
            loading={isLoading}
            rows={rows.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)}
            onRowClick={(u) => router.push(`/dashboard/customers/${u._id}`)}
            empty={<EmptyState icon={Users} title="No customers found" />}
            columns={[
              {
                key: "name",
                header: "Customer",
                render: (u) => (
                  <div className="flex min-w-[200px] items-center gap-3">
                    <Avatar name={u.fullName} />
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-gray-900">{u.fullName}</p>
                      <p className="truncate text-xs text-gray-500">{u.email}</p>
                    </div>
                  </div>
                ),
              },
              { key: "orders", header: "Orders", hideBelow: "md", className: "tabular-nums", render: (u) => u.orders },
              { key: "spent", header: "Spent", className: "font-semibold text-gray-900 whitespace-nowrap", render: (u) => formatTaka(u.spent) },
              { key: "last", header: "Last order", hideBelow: "lg", render: (u) => formatDate(u.lastOrder) },
              { key: "joined", header: "Joined", hideBelow: "xl", render: (u) => formatDate(u.createdAt) },
              {
                key: "actions",
                header: <span className="sr-only">Actions</span>,
                className: "text-right",
                render: (u) => (
                  <div className="flex justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                    <Link href={`/dashboard/customers/${u._id}`} title="View" className={buttonClass("ghost", "icon")}><Eye className="h-4 w-4" /></Link>
                    {canDelete && (
                      <button onClick={() => setConfirm({ type: "delete", user: u })} title="Delete" className={buttonClass("danger-ghost", "icon")}><Trash2 className="h-4 w-4" /></button>
                    )}
                  </div>
                ),
              },
            ]}
          />
        )}
        <Pagination page={page} totalPages={Math.ceil(rows.length / PAGE_SIZE)} total={rows.length} pageSize={PAGE_SIZE} onChange={setPage} />
      </Panel>

      <ConfirmDialog
        open={!!confirm}
        onClose={() => setConfirm(null)}
        loading={roleMutation.isPending || deleteMutation.isPending}
        confirmLabel={confirm?.type === "delete" ? "Delete" : confirm?.user?.role === "admin" ? "Remove access" : "Make admin"}
        title={confirm?.type === "delete" ? "Delete this account?" : confirm?.user?.role === "admin" ? "Remove admin access?" : "Give admin access?"}
        message={
          confirm?.type === "delete"
            ? `${confirm?.user?.fullName}'s account will be deleted. Their past orders stay in your records.`
            : confirm?.user?.role === "admin"
            ? `${confirm?.user?.fullName} will no longer be able to open the dashboard.`
            : `${confirm?.user?.fullName} will be able to manage products, orders and settings.`
        }
        onConfirm={() =>
          confirm.type === "delete"
            ? deleteMutation.mutate(confirm.user._id)
            : roleMutation.mutate({ id: confirm.user._id, role: confirm.user.role === "admin" ? "user" : "admin" })
        }
      />
    </>
  );
}
