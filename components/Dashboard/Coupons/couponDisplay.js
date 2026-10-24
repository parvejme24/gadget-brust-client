import { Banknote, Gift, Percent, Truck } from "lucide-react";
import { formatDate } from "@/lib/format";

export const typeIcons = { percentage: Percent, fixed: Banknote, bogo: Gift, free_shipping: Truck };
export const typeTints = {
  percentage: "bg-emerald-100 text-emerald-700",
  fixed: "bg-sky-100 text-sky-700",
  bogo: "bg-violet-100 text-violet-700",
  free_shipping: "bg-amber-100 text-amber-700",
};
export const statusPill = {
  active: { status: "active", label: "Active" },
  scheduled: { status: "processing", label: "Scheduled" },
  expired: { status: "cancelled", label: "Expired" },
  paused: { status: "inactive", label: "Paused" },
  "used-up": { status: "overdue", label: "Used up" },
};

export const validity = (c) =>
  c.startDate || c.endDate ? `${c.startDate ? formatDate(c.startDate) : "Now"} – ${c.endDate ? formatDate(c.endDate) : "No end"}` : "No end date";
