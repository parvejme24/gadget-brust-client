import { History, Package, SlidersHorizontal } from "lucide-react";
import { Button, DataTable, EmptyState, StatusPill, buttonClass, formatTaka, stockStatus } from "@/components/Dashboard/Kit";

export default function StockLevelsTable({ rows, loading, threshold, onAdjust, onHistory }) {
  return (
    <DataTable
      loading={loading}
      rows={rows}
      empty={<EmptyState icon={Package} title="No products match" />}
      columns={[
        {
          key: "product",
          header: "Product",
          render: (p) => (
            <div className="flex min-w-[180px] items-center gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gray-50 ring-1 ring-gray-100">
                {p.image?.url ? <img src={p.image.url} alt="" className="h-full w-full object-contain p-1" /> : <Package className="h-4 w-4 text-gray-300" />}
              </span>
              <div className="min-w-0">
                <p className="line-clamp-1 font-semibold text-gray-900">{p.title}</p>
                <p className="text-xs text-gray-500">{[p.category?.categoryName, p.brand?.brandName].filter(Boolean).join(" · ")}</p>
              </div>
            </div>
          ),
        },
        { key: "stock", header: "On hand", render: (p) => <span className="text-base font-bold tabular-nums text-gray-900">{p.stock}</span> },
        { key: "status", header: "Status", hideBelow: "sm", render: (p) => <StatusPill status={stockStatus(p.stock, threshold)} /> },
        { key: "price", header: "Unit price", hideBelow: "lg", render: (p) => formatTaka(p.discountPrice || p.price) },
        { key: "value", header: "Stock value", hideBelow: "md", render: (p) => <span className="font-medium">{formatTaka((p.discountPrice || p.price) * p.stock)}</span> },
        {
          key: "actions",
          header: <span className="sr-only">Actions</span>,
          className: "text-right",
          render: (p) => (
            <div className="flex justify-end gap-1">
              <button onClick={() => onHistory(p)} title="History" aria-label={`Stock history for ${p.title}`} className={buttonClass("ghost", "icon")}><History className="h-4 w-4" /></button>
              <Button size="sm" variant="secondary" onClick={() => onAdjust(p)}><SlidersHorizontal className="h-3.5 w-3.5" /> <span className="hidden sm:inline">Adjust</span></Button>
            </div>
          ),
        },
      ]}
    />
  );
}
