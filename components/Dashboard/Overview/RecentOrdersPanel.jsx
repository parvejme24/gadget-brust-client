"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, ReceiptText } from "lucide-react";
import { DataTable, EmptyState, Panel, StatusPill, customerName, formatDate, formatTaka, isGuestOrder } from "@/components/Dashboard/Kit";

export default function RecentOrdersPanel({ orders = [], loading, title = "Recent orders", description, viewAllHref = "/dashboard/orders", basePath = "/dashboard/orders", showCustomer = true, className }) {
  const router = useRouter();
  return (
    <Panel
      className={className}
      title={title}
      description={description}
      bodyClassName=""
      action={
        <Link href={viewAllHref} className="inline-flex shrink-0 items-center gap-1 whitespace-nowrap text-xs font-semibold text-gray-500 hover:text-gray-900">
          View all <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      }
    >
      <DataTable
        loading={loading}
        rows={orders}
        skeletonRows={5}
        onRowClick={(o) => router.push(`${basePath}/${o._id}`)}
        empty={<EmptyState icon={ReceiptText} title="No orders here" className="py-10" />}
        columns={[
          {
            key: "invoice",
            header: "Order",
            render: (o) => (
              <span className="flex items-center gap-2">
                <span className="whitespace-nowrap font-semibold text-gray-900">{o.invoiceNumber}</span>
                {showCustomer && isGuestOrder(o) && <StatusPill status="guest" />}
              </span>
            ),
          },
          ...(showCustomer ? [{ key: "customer", header: "Customer", hideBelow: "md", render: (o) => customerName(o) }] : []),
          { key: "date", header: "Date", hideBelow: "lg", render: (o) => formatDate(o.orderDate || o.createdAt) },
          { key: "status", header: "Status", render: (o) => <StatusPill status={o.orderStatus || "pending"} /> },
          { key: "total", header: "Total", className: "text-right font-semibold text-gray-900", headerClassName: "text-right", render: (o) => formatTaka(o.total) },
        ]}
      />
    </Panel>
  );
}
