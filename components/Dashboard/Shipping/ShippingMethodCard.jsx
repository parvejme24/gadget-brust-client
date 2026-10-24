import { Clock, MapPin, Pencil, Trash2, Truck } from "lucide-react";
import { Panel, StatusPill, Toggle, buttonClass, formatTaka } from "@/components/Dashboard/Kit";

export default function ShippingMethodCard({ method: m, onToggle, toggling, onEdit, onDelete }) {
  return (
    <Panel>
      <div className="flex items-start gap-4">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-sky-100 text-sky-700"><Truck className="h-5 w-5" /></span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-semibold text-gray-900">{m.name}</h3>
            <StatusPill status={m.isActive ? "active" : "inactive"} />
          </div>
          {m.description && <p className="mt-0.5 text-sm text-gray-500">{m.description}</p>}
        </div>
        <div className="flex items-center gap-1">
          <Toggle checked={m.isActive} onChange={onToggle} label={`${m.name} available`} disabled={toggling} />
          <button onClick={onEdit} aria-label={`Edit ${m.name}`} className={buttonClass("ghost", "icon")}><Pencil className="h-4 w-4" /></button>
          <button onClick={onDelete} aria-label={`Delete ${m.name}`} className={buttonClass("danger-ghost", "icon")}><Trash2 className="h-4 w-4" /></button>
        </div>
      </div>
      <dl className="mt-5 grid grid-cols-2 gap-4 border-t border-gray-100 pt-4 text-sm sm:grid-cols-4">
        <div><dt className="text-xs text-gray-500">Base charge</dt><dd className="mt-0.5 font-semibold text-gray-900">{formatTaka(m.baseCharge)}</dd></div>
        <div><dt className="text-xs text-gray-500">Per kg</dt><dd className="mt-0.5 font-semibold text-gray-900">{formatTaka(m.perKgCharge)}</dd></div>
        <div><dt className="text-xs text-gray-500">Free over</dt><dd className="mt-0.5 font-semibold text-gray-900">{m.freeShippingThreshold ? formatTaka(m.freeShippingThreshold) : "—"}</dd></div>
        <div><dt className="text-xs text-gray-500">Delivery time</dt><dd className="mt-0.5 flex items-center gap-1 font-semibold text-gray-900"><Clock className="h-3.5 w-3.5 text-gray-400" /> {m.estimatedDays?.min}-{m.estimatedDays?.max} days</dd></div>
      </dl>
      {m.zones?.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-1.5">
          {m.zones.map((z) => (
            <span key={z._id || z.name} className="inline-flex items-center gap-1 rounded-lg bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600">
              <MapPin className="h-3 w-3" /> {z.name}{z.additionalCharge ? ` +${formatTaka(z.additionalCharge)}` : ""}
            </span>
          ))}
        </div>
      )}
    </Panel>
  );
}
