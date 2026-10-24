import Link from "next/link";
import { BarList, Panel, StatusPill, formatTaka } from "@/components/Dashboard/Kit";

const STATUSES = ["pending", "processing", "shipped", "delivered", "cancelled"];

export default function OrderPipelinePanel({ orders = [], stats, className }) {
  const counts = Object.fromEntries(STATUSES.map((s) => [s, 0]));
  orders.forEach((o) => (counts[o.orderStatus || "pending"] += 1));

  return (
    <Panel
      className={className}
      title="Order pipeline"
      description="All orders by fulfilment status"
      action={<Link href="/dashboard/orders" className="text-xs font-semibold text-gray-500 hover:text-gray-900">Manage</Link>}
    >
      <BarList items={STATUSES.map((status) => ({ label: <StatusPill status={status} />, value: counts[status], key: status }))} emptyText="No orders yet" />
      {stats && (
        <div className="mt-6 grid grid-cols-2 gap-3 border-t border-gray-100 pt-5">
          <div>
            <p className="text-xs text-gray-500">Avg. order value</p>
            <p className="mt-0.5 text-lg font-bold text-gray-900">{formatTaka(stats.orders?.completed ? stats.revenue.total / stats.orders.completed : 0)}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Paid orders</p>
            <p className="mt-0.5 text-lg font-bold text-gray-900">{stats.orders?.completed ?? "—"}</p>
          </div>
        </div>
      )}
    </Panel>
  );
}
