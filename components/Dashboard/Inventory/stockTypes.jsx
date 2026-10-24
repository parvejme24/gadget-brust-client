import { ArrowDownRight, Boxes, ClipboardCheck, PackagePlus, PackageX, RotateCcw } from "lucide-react";
import { cx } from "@/lib/format";

// every kind of stock change; sign: +1 adds, -1 removes, 0 sets an exact count
export const TYPES = {
  restock: { label: "Restock", sign: 1, icon: PackagePlus, hint: "New stock from a supplier", tone: "text-emerald-700 bg-emerald-50 ring-emerald-200" },
  return: { label: "Customer return", sign: 1, icon: RotateCcw, hint: "Item came back in sellable condition", tone: "text-sky-700 bg-sky-50 ring-sky-200" },
  damage: { label: "Damage / loss", sign: -1, icon: PackageX, hint: "Broken, lost or written off", tone: "text-red-700 bg-red-50 ring-red-200" },
  adjustment: { label: "Stock count", sign: 0, icon: ClipboardCheck, hint: "Set the exact quantity after counting", tone: "text-amber-700 bg-amber-50 ring-amber-200" },
  sale: { label: "Sale", sign: -1, icon: ArrowDownRight, tone: "text-gray-700 bg-gray-100 ring-gray-200" },
  opening: { label: "Opening stock", sign: 1, icon: Boxes, tone: "text-violet-700 bg-violet-50 ring-violet-200" },
};

export function TypePill({ type }) {
  const t = TYPES[type] || TYPES.adjustment;
  const Icon = t.icon;
  return (
    <span className={cx("inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2 py-0.5 text-xs font-semibold ring-1 ring-inset", t.tone)}>
      <Icon className="h-3 w-3" /> {t.label}
    </span>
  );
}
