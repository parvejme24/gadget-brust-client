import { AlertTriangle, Bell, PackageX, ReceiptText, ShoppingBag, Star, Truck } from "lucide-react";
import { cx } from "@/lib/format";

export const notificationStyles = {
  "order.new": { icon: ShoppingBag, tone: "bg-emerald-100 text-emerald-700" },
  "order.status": { icon: Truck, tone: "bg-violet-100 text-violet-700" },
  "order.updated": { icon: ReceiptText, tone: "bg-sky-100 text-sky-700" },
  "stock.low": { icon: AlertTriangle, tone: "bg-orange-100 text-orange-700" },
  "stock.out": { icon: PackageX, tone: "bg-red-100 text-red-700" },
  "review.new": { icon: Star, tone: "bg-amber-100 text-amber-700" },
  system: { icon: Bell, tone: "bg-gray-100 text-gray-600" },
};

// "Just now", "5 min ago", "3h ago", "2d ago", then a date
export const timeAgo = (value) => {
  const minutes = Math.max(0, (Date.now() - new Date(value).getTime()) / 60000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${Math.floor(minutes)} min ago`;
  if (minutes < 60 * 24) return `${Math.floor(minutes / 60)}h ago`;
  if (minutes < 60 * 24 * 7) return `${Math.floor(minutes / 1440)}d ago`;
  return new Date(value).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
};

export default function NotificationItem({ notification: n, onOpen, compact = false }) {
  const { icon: Icon, tone } = notificationStyles[n.type] || notificationStyles.system;
  return (
    <button
      onClick={onOpen}
      className={cx(
        "flex w-full items-start gap-3 rounded-xl text-left transition hover:bg-gray-50",
        compact ? "p-2.5" : "p-3.5",
        !n.read && "bg-brand-light/40"
      )}
    >
      <span className={cx("flex h-9 w-9 shrink-0 items-center justify-center rounded-xl", tone)}>
        <Icon className="h-4 w-4" />
      </span>
      <span className="min-w-0 flex-1">
        <span className={cx("block text-sm text-gray-900", !n.read ? "font-semibold" : "font-medium")}>{n.title}</span>
        {n.message && <span className={cx("mt-0.5 block text-xs text-gray-500", compact && "line-clamp-2")}>{n.message}</span>}
        <span className="mt-1 block text-[11px] text-gray-400">{timeAgo(n.createdAt)}</span>
      </span>
      {!n.read && <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-brand" aria-label="Unread" />}
    </button>
  );
}
