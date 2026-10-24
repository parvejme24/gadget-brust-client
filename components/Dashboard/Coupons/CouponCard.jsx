"use client";

import { toast } from "sonner";
import { Copy, TicketPercent } from "lucide-react";
import { conditionsLabel, couponStatus, describeCoupon, scopeLabel } from "@/lib/coupons";
import { StatusPill, Toggle, cx } from "@/components/Dashboard/Kit";
import { statusPill, typeIcons, typeTints, validity } from "./couponDisplay";

const copy = async (code) => {
  try {
    await navigator.clipboard.writeText(code);
    toast.success(`Copied ${code}`);
  } catch {
    toast.error("Couldn't copy");
  }
};

// ticket-style coupon card
export default function CouponCard({ coupon: c, categories, brands, onToggle, toggling, actions }) {
  const Icon = typeIcons[c.type] || TicketPercent;
  const status = couponStatus(c);
  const used = c.usageLimit ? Math.min(100, Math.round((c.usedCount / c.usageLimit) * 100)) : null;
  return (
    <article className="relative flex flex-col overflow-hidden rounded-2xl border border-gray-200/70 bg-surface shadow-sm shadow-gray-900/[0.02]">
      {/* ticket header */}
      <div className="flex items-start gap-3 p-5 pb-4">
        <span className={cx("flex h-11 w-11 shrink-0 items-center justify-center rounded-xl", typeTints[c.type])}>
          <Icon className="h-5 w-5" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-lg font-bold leading-tight text-gray-900">{describeCoupon(c)}</p>
          <p className="truncate text-sm text-gray-500">{c.title}</p>
        </div>
        <Toggle checked={c.isActive} onChange={onToggle} label={`${c.code} active`} disabled={toggling} />
      </div>
      {/* perforation */}
      <div className="relative mx-5 border-t-2 border-dashed border-gray-200">
        <span className="absolute -left-8 -top-2.5 h-5 w-5 rounded-full bg-canvas" />
        <span className="absolute -right-8 -top-2.5 h-5 w-5 rounded-full bg-canvas" />
      </div>
      <div className="flex flex-1 flex-col p-5 pt-4">
        <div className="flex items-center justify-between gap-2">
          <button onClick={() => copy(c.code)} className="inline-flex items-center gap-2 rounded-lg border border-dashed border-gray-300 bg-gray-50 px-3 py-1.5 font-mono text-sm font-bold tracking-wide text-gray-900 hover:border-gray-400">
            {c.code} <Copy className="h-3.5 w-3.5 text-gray-400" />
          </button>
          <StatusPill {...statusPill[status]} />
        </div>
        <dl className="mt-4 space-y-1.5 text-sm">
          <div className="flex gap-2"><dt className="w-20 shrink-0 text-gray-500">Applies to</dt><dd className="line-clamp-1 font-medium text-gray-800">{scopeLabel(c, { categories, brands })}</dd></div>
          <div className="flex gap-2"><dt className="w-20 shrink-0 text-gray-500">Valid</dt><dd className="font-medium text-gray-800">{validity(c)}</dd></div>
          {conditionsLabel(c) && <div className="flex gap-2"><dt className="w-20 shrink-0 text-gray-500">Rules</dt><dd className="line-clamp-2 font-medium text-gray-800">{conditionsLabel(c)}</dd></div>}
        </dl>
        <div className="mt-4">
          <div className="flex justify-between text-xs text-gray-500">
            <span>Used {c.usedCount} time{c.usedCount === 1 ? "" : "s"}</span>
            <span>{c.usageLimit ? `limit ${c.usageLimit}` : "no limit"}</span>
          </div>
          {used !== null && (
            <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-gray-100">
              <div className="h-full rounded-full bg-[#2d8f6a]" style={{ width: `${used}%` }} />
            </div>
          )}
        </div>
        <div className="mt-auto flex items-center justify-between border-t border-gray-100 pt-3">
          <span className="text-xs text-gray-500">{c.isPublic ? "Shown in store" : "Hidden code"}</span>
          {actions}
        </div>
      </div>
    </article>
  );
}
