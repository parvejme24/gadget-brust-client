"use client";

import { useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { Banknote, Calendar, Loader2, Mail, ReceiptText, Star } from "lucide-react";
import { useAdminReviews, useAdminUser } from "@/lib/hooks/useAdmin";
import useCustomerStats from "@/lib/hooks/useCustomerStats";
import {
  DataTable,
  EmptyState,
  ErrorState,
  PageHeader,
  Panel,
  StatCard,
  StatusPill,
  Avatar,
  formatDate,
  formatTaka,
} from "@/components/Dashboard/Kit";

export default function CustomerDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { data: user, isLoading, isError, error, refetch } = useAdminUser(id);
  const { stats } = useCustomerStats();
  const { data: reviews = [] } = useAdminReviews();

  const entry = stats[id] || { orders: 0, spent: 0, list: [] };
  const orders = useMemo(() => [...(entry.list || [])].sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate)), [entry.list]);
  const theirReviews = reviews.filter((r) => (r.customerID?._id || r.customerID) === id);
  const paidOrders = orders.filter((o) => o.paymentStatus === "completed" && o.orderStatus !== "cancelled").length;

  if (isLoading) return <div className="flex justify-center py-20"><Loader2 className="h-6 w-6 animate-spin text-gray-400" /></div>;
  if (isError || !user) return <ErrorState error={error} onRetry={refetch} />;

  return (
    <>
      <PageHeader title={user.fullName} back={{ href: "/dashboard/customers", label: "Customers" }} />

      <div className="grid gap-6 xl:grid-cols-3">
        <Panel>
          <div className="flex flex-col items-center text-center">
            <Avatar name={user.fullName} size="h-20 w-20 text-2xl" />
            <p className="mt-4 text-lg font-semibold text-gray-900">{user.fullName}</p>
            <div className="mt-2"><StatusPill status={user.role} /></div>
          </div>
          <dl className="mt-6 space-y-3 border-t border-gray-100 pt-5 text-sm">
            <div className="flex items-center gap-3"><Mail className="h-4 w-4 text-gray-400" /><a href={`mailto:${user.email}`} className="truncate text-gray-700 hover:underline">{user.email}</a></div>
            <div className="flex items-center gap-3"><Calendar className="h-4 w-4 text-gray-400" /><span className="text-gray-700">Joined {formatDate(user.createdAt)}</span></div>
            <div className="flex items-center gap-3"><ReceiptText className="h-4 w-4 text-gray-400" /><span className="text-gray-700">Last order {formatDate(orders[0]?.orderDate)}</span></div>
          </dl>
        </Panel>

        <div className="space-y-6 xl:col-span-2">
          <div className="grid gap-4 sm:grid-cols-3">
            <StatCard label="Orders" value={orders.length} icon={ReceiptText} tone="sky" />
            <StatCard label="Total spent" value={formatTaka(entry.spent)} icon={Banknote} tone="brand" />
            <StatCard label="Average order" value={formatTaka(paidOrders ? entry.spent / paidOrders : 0)} tone="violet" />
          </div>

          <Panel title="Order history" bodyClassName="">
            <DataTable
              rows={orders}
              onRowClick={(o) => router.push(`/dashboard/orders/${o._id}`)}
              empty={<EmptyState icon={ReceiptText} title="No orders yet" className="py-8" />}
              columns={[
                { key: "inv", header: "Order", render: (o) => <span className="font-semibold text-gray-900">{o.invoiceNumber}</span> },
                { key: "date", header: "Date", hideBelow: "sm", render: (o) => formatDate(o.orderDate) },
                { key: "items", header: "Items", hideBelow: "md", render: (o) => (o.items || []).reduce((s, i) => s + i.qty, 0) },
                { key: "status", header: "Status", render: (o) => <StatusPill status={o.orderStatus} /> },
                { key: "total", header: "Total", className: "text-right font-semibold text-gray-900", headerClassName: "text-right", render: (o) => formatTaka(o.total) },
              ]}
            />
          </Panel>

          <Panel title={`Reviews (${theirReviews.length})`}>
            {theirReviews.length === 0 ? (
              <EmptyState icon={Star} title="No reviews written" className="py-6" />
            ) : (
              <ul className="divide-y divide-gray-100">
                {theirReviews.map((r) => (
                  <li key={r._id} className="py-3 first:pt-0 last:pb-0">
                    <div className="flex items-center justify-between gap-3 text-sm">
                      <span className="truncate font-medium text-gray-900">{r.productID?.title || "Product"}</span>
                      <span className="flex shrink-0 items-center gap-1 font-semibold text-gray-700"><Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" /> {r.rating}</span>
                    </div>
                    <p className="mt-1 text-sm text-gray-600">{r.reviewText}</p>
                  </li>
                ))}
              </ul>
            )}
          </Panel>
        </div>
      </div>
    </>
  );
}
