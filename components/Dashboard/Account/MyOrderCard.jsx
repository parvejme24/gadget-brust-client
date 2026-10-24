import Link from "next/link";
import { ChevronRight, Package } from "lucide-react";
import { StatusPill, formatDate, formatTaka } from "@/components/Dashboard/Kit";
import { CUSTOMER_STATUS_TEXT } from "@/components/Shared/Order/orderStatus";

export default function MyOrderCard({ order }) {
  const items = order.items || [];
  const count = items.reduce((s, i) => s + i.qty, 0);
  return (
    <Link href={`/dashboard/my-orders/${order._id}`} className="block min-w-0 rounded-2xl border border-gray-200/70 bg-surface p-4 shadow-sm shadow-gray-900/[0.02] transition hover:border-gray-300 hover:shadow-md sm:p-5">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="font-semibold text-gray-900">{order.invoiceNumber}</p>
          <p className="text-xs text-gray-500">{formatDate(order.orderDate || order.createdAt)} · {count} item{count === 1 ? "" : "s"}</p>
        </div>
        <StatusPill status={order.orderStatus || "pending"} />
      </div>
      <div className="mt-4 flex items-center gap-3">
        <div className="flex -space-x-2">
          {items.slice(0, 4).map((item, i) => (
            <span key={i} title={item.title} className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-xl bg-gray-50 ring-2 ring-surface">
              {item.image ? <img src={item.image} alt="" className="h-full w-full object-contain p-1" /> : <Package className="h-4 w-4 text-gray-300" />}
            </span>
          ))}
        </div>
        <p className="line-clamp-2 min-w-0 flex-1 text-sm text-gray-600">{items.map((i) => i.title).join(", ")}</p>
      </div>
      <div className="mt-4 flex items-center justify-between gap-3 border-t border-gray-100 pt-3">
        <p className="min-w-0 truncate text-xs text-gray-500">{CUSTOMER_STATUS_TEXT[order.orderStatus || "pending"]}</p>
        <span className="flex shrink-0 items-center gap-1 text-sm font-bold text-gray-900">
          {formatTaka(order.total)} <ChevronRight className="h-4 w-4 text-gray-300" />
        </span>
      </div>
    </Link>
  );
}
