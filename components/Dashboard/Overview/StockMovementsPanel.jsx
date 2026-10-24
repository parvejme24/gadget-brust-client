import Link from "next/link";
import { ArrowDownRight, ArrowUpRight, History } from "lucide-react";
import { useStockMovements } from "@/lib/hooks/useAdmin";
import { EmptyState, Panel, cx, formatDate } from "@/components/Dashboard/Kit";

const typeLabel = { restock: "Restock", sale: "Sale", return: "Return", damage: "Damaged", adjustment: "Count", opening: "Opening" };

export default function StockMovementsPanel({ limit = 6, className }) {
  const { data } = useStockMovements({ limit });
  const movements = data?.movements || [];

  return (
    <Panel
      className={className}
      title="Recent stock changes"
      action={<Link href="/dashboard/inventory" className="text-xs font-semibold text-gray-500 hover:text-gray-900">Inventory</Link>}
    >
      {movements.length === 0 ? (
        <EmptyState icon={History} title="No stock changes yet" className="py-8" />
      ) : (
        <ul className="divide-y divide-gray-100">
          {movements.map((m) => {
            const up = m.quantity > 0;
            const Icon = up ? ArrowUpRight : ArrowDownRight;
            return (
              <li key={m._id} className="flex items-center gap-3 py-2.5 first:pt-0 last:pb-0">
                <span className={cx("flex h-9 w-9 shrink-0 items-center justify-center rounded-xl", up ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700")}>
                  <Icon className="h-4 w-4" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium text-gray-900">{m.product?.title || "Product"}</span>
                  <span className="block truncate text-xs text-gray-500">
                    {typeLabel[m.type] || m.type}
                    {m.invoice?.invoiceNumber ? ` · ${m.invoice.invoiceNumber}` : m.reference ? ` · ${m.reference}` : ""} · {formatDate(m.createdAt)}
                  </span>
                </span>
                <span className={cx("shrink-0 text-sm font-bold tabular-nums", up ? "text-emerald-700" : "text-red-700")}>
                  {up ? "+" : ""}
                  {m.quantity}
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </Panel>
  );
}
