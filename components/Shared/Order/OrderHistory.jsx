import { cx, formatDate } from "@/lib/format";
import { HISTORY_LABEL } from "./orderStatus";

const dot = {
  pending: "bg-amber-500",
  processing: "bg-sky-500",
  shipped: "bg-violet-500",
  delivered: "bg-emerald-500",
  cancelled: "bg-gray-400",
};

// newest first; staff see who made each change
export default function OrderHistory({ history = [], showActor = false }) {
  const entries = [...history].reverse();
  if (!entries.length) return <p className="text-sm text-gray-500">No history recorded for this order.</p>;

  return (
    <ol className="relative space-y-5 before:absolute before:bottom-2 before:left-[5px] before:top-2 before:w-px before:bg-gray-200">
      {entries.map((h, i) => {
        const edit = h.note?.startsWith("Edited");
        return (
          <li key={h._id || i} className="relative flex gap-3 pl-6">
            <span className={cx("absolute left-0 top-1.5 h-[11px] w-[11px] rounded-full ring-4 ring-surface", edit ? "bg-gray-300" : dot[h.status] || "bg-gray-400")} />
            <div className="min-w-0">
              <p className="text-sm font-semibold text-gray-900">{edit ? "Order edited" : HISTORY_LABEL[h.status] || h.status}</p>
              {h.note && <p className="mt-0.5 text-sm text-gray-600">{edit ? h.note.replace(/^Edited /, "Changed ") : h.note}</p>}
              <p className="mt-0.5 text-xs text-gray-400">
                {formatDate(h.at, true)}
                {showActor && (h.by?.fullName || h.byName) ? ` · ${h.by?.fullName || h.byName}` : ""}
              </p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
