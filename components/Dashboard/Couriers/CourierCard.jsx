import Link from "next/link";
import { ExternalLink, Phone, Truck } from "lucide-react";
import { CourierBadge, StatusPill, Toggle, formatTaka } from "@/components/Dashboard/Kit";
import { hostname } from "./courierForm";

export default function CourierCard({ courier: c, onToggle, toggling, actions }) {
  const rate = c.parcels ? Math.round((c.delivered / c.parcels) * 100) : 0;
  return (
    <article className="flex flex-col rounded-2xl border border-gray-200/70 bg-surface p-5 shadow-sm shadow-gray-900/[0.02]">
      <div className="flex items-start gap-3">
        <CourierBadge courier={c} size="h-12 w-12 text-sm" />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-1.5">
            <h3 className="truncate font-semibold text-gray-900">{c.name}</h3>
            {c.isDefault && <StatusPill status="pending" label="Default" />}
          </div>
          <div className="mt-0.5 flex flex-wrap gap-x-3 text-xs text-gray-500">
            {c.website && (
              <a href={c.website} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 hover:text-gray-900">
                {hostname(c.website)} <ExternalLink className="h-3 w-3" />
              </a>
            )}
            {c.phone && <a href={`tel:${c.phone}`} className="inline-flex items-center gap-1 hover:text-gray-900"><Phone className="h-3 w-3" /> {c.phone}</a>}
          </div>
        </div>
        <Toggle checked={c.isActive} onChange={() => onToggle(c._id)} label={`${c.name} active`} disabled={toggling} />
      </div>

      <dl className="mt-5 grid grid-cols-3 gap-3 rounded-xl bg-gray-50 p-3 text-center text-sm">
        <div><dt className="text-[11px] text-gray-500">Inside Dhaka</dt><dd className="mt-0.5 font-semibold text-gray-900">{formatTaka(c.charges?.insideDhaka)}</dd></div>
        <div><dt className="text-[11px] text-gray-500">Outside</dt><dd className="mt-0.5 font-semibold text-gray-900">{formatTaka(c.charges?.outsideDhaka)}</dd></div>
        <div><dt className="text-[11px] text-gray-500">COD fee</dt><dd className="mt-0.5 font-semibold text-gray-900">{c.codChargePercent}%</dd></div>
      </dl>

      <div className="mt-4 flex items-center gap-3 text-sm">
        <Truck className="h-4 w-4 text-gray-400" />
        <span className="text-gray-600">{c.deliveryTime?.insideDhaka} in Dhaka · {c.deliveryTime?.outsideDhaka} outside</span>
      </div>
      <div className="mb-4 mt-3">
        <div className="flex justify-between text-xs text-gray-500">
          <span>{c.parcels} parcels</span>
          <span>{rate}% delivered</span>
        </div>
        <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-gray-100">
          <div className="h-full rounded-full bg-[#2d8f6a]" style={{ width: `${rate}%` }} />
        </div>
      </div>

      <div className="mt-auto flex items-center justify-between border-t border-gray-100 pt-3">
        <Link href={`/dashboard/orders?courier=${c._id}`} className="text-xs font-semibold text-gray-500 hover:text-gray-900">View parcels →</Link>
        {actions}
      </div>
    </article>
  );
}
