import Link from "next/link";
import { ArrowDownRight, ArrowUpRight, History } from "lucide-react";
import { DataTable, EmptyState, cx, formatDate } from "@/components/Dashboard/Kit";
import { TypePill } from "./stockTypes";

export default function StockHistoryTable({ rows, loading }) {
  return (
    <DataTable
      loading={loading}
      rows={rows}
      empty={<EmptyState icon={History} title="No stock changes yet" />}
      columns={[
        { key: "date", header: "Date", render: (m) => <span className="whitespace-nowrap">{formatDate(m.createdAt, true)}</span> },
        { key: "product", header: "Product", render: (m) => <span className="line-clamp-1 max-w-[220px] font-medium text-gray-900">{m.product?.title || "Deleted product"}</span> },
        { key: "type", header: "Type", render: (m) => <TypePill type={m.type} /> },
        {
          key: "change",
          header: "Change",
          render: (m) => (
            <span className={cx("inline-flex items-center gap-0.5 font-bold tabular-nums", m.quantity > 0 ? "text-emerald-700" : "text-red-600")}>
              {m.quantity > 0 ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
              {m.quantity > 0 ? `+${m.quantity}` : m.quantity}
            </span>
          ),
        },
        { key: "balance", header: "Balance", hideBelow: "sm", render: (m) => <span className="tabular-nums">{m.balanceAfter}</span> },
        { key: "by", header: "By", hideBelow: "lg", render: (m) => m.user?.fullName || "—" },
        {
          key: "ref",
          header: "Reference",
          hideBelow: "md",
          render: (m) =>
            m.invoice ? (
              <Link href={`/dashboard/orders/${m.invoice._id}`} className="font-mono text-xs font-semibold text-gray-700 hover:underline">{m.invoice.invoiceNumber}</Link>
            ) : (
              <span className="text-xs text-gray-500">{[m.reference, m.note].filter(Boolean).join(" · ") || "—"}</span>
            ),
        },
      ]}
    />
  );
}
