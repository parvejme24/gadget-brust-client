import { AlertTriangle, Ban, CheckCircle2, CircleDashed, Clock, PackageCheck, RotateCcw, ShieldCheck, Truck, User, UserX, XCircle } from "lucide-react";
import { cx } from "@/lib/format";

export const Avatar = ({ name = "", size = "h-9 w-9 text-xs" }) => (
  <span className={`flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-emerald-100 to-sky-100 font-bold text-gray-700 ${size}`}>
    {name.split(" ").filter(Boolean).slice(0, 2).map((p) => p[0]).join("").toUpperCase() || "?"}
  </span>
);

// courier logo, or initials on the courier's brand colour
export const CourierBadge = ({ courier, size = "h-10 w-10 text-xs" }) =>
  courier?.logo ? (
    <span className={cx("flex shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white ring-1 ring-gray-200", size)}>
      <img src={courier.logo} alt="" className="h-full w-full object-contain p-1" />
    </span>
  ) : (
    <span className={cx("flex shrink-0 items-center justify-center rounded-xl font-bold text-white", size)} style={{ backgroundColor: courier?.color || "#1c2024" }}>
      {(courier?.name || "?").split(" ").filter(Boolean).slice(0, 2).map((w) => w[0]).join("").toUpperCase()}
    </span>
  );

const statusStyles = {
  // order lifecycle
  pending: { label: "Pending", icon: Clock, className: "bg-amber-50 text-amber-800 ring-amber-200" },
  processing: { label: "Processing", icon: CircleDashed, className: "bg-sky-50 text-sky-800 ring-sky-200" },
  shipped: { label: "Shipped", icon: Truck, className: "bg-violet-50 text-violet-800 ring-violet-200" },
  delivered: { label: "Delivered", icon: PackageCheck, className: "bg-emerald-50 text-emerald-800 ring-emerald-200" },
  cancelled: { label: "Cancelled", icon: Ban, className: "bg-gray-100 text-gray-700 ring-gray-200" },
  // payments / invoices
  paid: { label: "Paid", icon: CheckCircle2, className: "bg-emerald-50 text-emerald-800 ring-emerald-200" },
  completed: { label: "Paid", icon: CheckCircle2, className: "bg-emerald-50 text-emerald-800 ring-emerald-200" },
  failed: { label: "Failed", icon: XCircle, className: "bg-red-50 text-red-800 ring-red-200" },
  overdue: { label: "Overdue", icon: AlertTriangle, className: "bg-orange-50 text-orange-800 ring-orange-200" },
  refunded: { label: "Refunded", icon: RotateCcw, className: "bg-gray-100 text-gray-700 ring-gray-200" },
  // stock
  "in-stock": { label: "In stock", icon: CheckCircle2, className: "bg-emerald-50 text-emerald-800 ring-emerald-200" },
  "low-stock": { label: "Low stock", icon: AlertTriangle, className: "bg-amber-50 text-amber-800 ring-amber-200" },
  "out-of-stock": { label: "Out of stock", icon: XCircle, className: "bg-red-50 text-red-800 ring-red-200" },
  // misc
  active: { label: "Active", icon: CheckCircle2, className: "bg-emerald-50 text-emerald-800 ring-emerald-200" },
  inactive: { label: "Inactive", icon: Ban, className: "bg-gray-100 text-gray-700 ring-gray-200" },
  admin: { label: "Admin", icon: ShieldCheck, className: "bg-gray-900 text-white ring-gray-900" },
  user: { label: "Customer", icon: User, className: "bg-gray-100 text-gray-700 ring-gray-200" },
  guest: { label: "Guest", icon: UserX, className: "bg-orange-50 text-orange-800 ring-orange-200" },
};

export function StatusPill({ status, label }) {
  const style = statusStyles[status] || { label: status, icon: CircleDashed, className: "bg-gray-100 text-gray-700 ring-gray-200" };
  const Icon = style.icon;
  return (
    <span className={cx("inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2 py-0.5 text-xs font-semibold ring-1 ring-inset", style.className)}>
      <Icon className="h-3 w-3" />
      {label || style.label}
    </span>
  );
}
