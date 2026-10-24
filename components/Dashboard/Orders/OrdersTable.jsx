"use client";

import { useRouter } from "next/navigation";
import { Package, ReceiptText } from "lucide-react";
import { CourierBadge, DataTable, EmptyState, StatusPill, customerName, formatDate, formatTaka, isGuestOrder, paymentLabels } from "@/components/Dashboard/Kit";

const itemCount = (o) => (o.items || []).reduce((s, i) => s + i.qty, 0);

export default function OrdersTable({ rows, loading }) {
  const router = useRouter();
  return (
    <DataTable
      loading={loading}
      rows={rows}
      onRowClick={(o) => router.push(`/dashboard/orders/${o._id}`)}
      empty={<EmptyState icon={ReceiptText} title="No orders found" text="Try another status or clear the filters." />}
      columns={[
        {
          key: "order",
          header: "Order",
          render: (o) => (
            <div className="min-w-0 whitespace-nowrap">
              <p className="flex items-center gap-1.5 font-semibold text-gray-900">
                {o.invoiceNumber}
                {isGuestOrder(o) && <StatusPill status="guest" />}
              </p>
              {/* customer moves here on phones */}
              <p className="max-w-[11rem] truncate text-xs text-gray-500 md:hidden">{customerName(o)}</p>
              <p className="hidden text-xs text-gray-500 md:block">{itemCount(o)} item{itemCount(o) === 1 ? "" : "s"}{o.source === "pos" ? " · counter" : ""}</p>
            </div>
          ),
        },
        {
          key: "customer",
          header: "Customer",
          hideBelow: "md",
          render: (o) => (
            <div className="min-w-0">
              <p className="truncate font-medium text-gray-900">{customerName(o)}</p>
              <p className="truncate text-xs text-gray-500">{o.phone || o.user_id?.email || (o.source === "pos" ? "Counter sale" : "")}</p>
            </div>
          ),
        },
        {
          key: "items",
          header: "Products",
          hideBelow: "2xl",
          render: (o) => (
            <div className="flex -space-x-2">
              {(o.items || []).slice(0, 3).map((item, i) => (
                <span key={i} title={item.title} className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-lg bg-gray-50 ring-2 ring-surface">
                  {item.image ? <img src={item.image} alt="" className="h-full w-full object-contain p-0.5" /> : <Package className="h-4 w-4 text-gray-300" />}
                </span>
              ))}
            </div>
          ),
        },
        { key: "date", header: "Date", hideBelow: "lg", render: (o) => <span className="whitespace-nowrap">{formatDate(o.orderDate)}</span> },
        {
          key: "payment",
          header: "Payment",
          hideBelow: "sm",
          render: (o) => (
            <div>
              <StatusPill status={o.paymentStatus === "pending" ? "pending" : o.paymentStatus} label={o.paymentStatus === "pending" ? "Unpaid" : undefined} />
              <p className="mt-1 text-xs text-gray-500">{paymentLabels[o.paymentMethod] || o.paymentMethod}</p>
            </div>
          ),
        },
        {
          key: "courier",
          header: "Courier",
          hideBelow: "xl",
          render: (o) =>
            o.shipment?.courier ? (
              <div className="flex items-center gap-2">
                <CourierBadge courier={o.shipment.courier} size="h-7 w-7 text-[10px] rounded-lg" />
                <div className="min-w-0">
                  <p className="truncate text-xs font-semibold text-gray-900">{o.shipment.courier.name}</p>
                  <p className="truncate font-mono text-[11px] text-gray-500">{o.shipment.trackingNumber || "No tracking #"}</p>
                </div>
              </div>
            ) : (
              <span className="text-xs text-gray-400">{o.source === "pos" ? "—" : "Not shipped"}</span>
            ),
        },
        { key: "status", header: "Status", render: (o) => <StatusPill status={o.orderStatus || "pending"} /> },
        { key: "total", header: "Total", className: "text-right font-semibold text-gray-900 whitespace-nowrap", headerClassName: "text-right", render: (o) => formatTaka(o.total) },
      ]}
    />
  );
}
