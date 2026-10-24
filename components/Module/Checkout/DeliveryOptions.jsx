import { Check, Truck } from "lucide-react";
import { cx, formatTaka } from "@/lib/format";

// shipping methods from the store; free above each method's threshold
export default function DeliveryOptions({ methods, value, onChange, subtotal, loading }) {
  if (loading) return <div className="grid gap-3 sm:grid-cols-2">{[0, 1].map((i) => <div key={i} className="h-24 animate-pulse rounded-2xl bg-gray-100" />)}</div>;
  if (!methods.length) return <p className="text-sm text-gray-500">No delivery options are available right now. Please call us to order.</p>;

  return (
    <div className="grid gap-3 sm:grid-cols-2" role="radiogroup" aria-label="Delivery option">
      {methods.map((m) => {
        const selected = value === m._id;
        const free = m.freeShippingThreshold > 0 && subtotal >= m.freeShippingThreshold;
        const tooSmall = m.minOrderAmount > 0 && subtotal < m.minOrderAmount;
        return (
          <button
            key={m._id}
            type="button"
            role="radio"
            aria-checked={selected}
            disabled={tooSmall}
            onClick={() => onChange(m._id)}
            className={cx(
              "relative rounded-2xl border p-4 text-left transition disabled:cursor-not-allowed disabled:opacity-50",
              selected ? "border-brand bg-brand-light/30 ring-2 ring-brand/20" : "border-gray-200 hover:border-gray-300"
            )}
          >
            {selected && <span className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-brand text-white"><Check className="h-3 w-3" /></span>}
            <span className="flex items-center gap-2 font-semibold text-gray-900"><Truck className="h-4 w-4 text-gray-400" /> {m.name}</span>
            <span className="mt-1 block text-xs text-gray-500">{m.description}</span>
            <span className="mt-2 flex items-center justify-between text-sm">
              <span className="text-gray-600">{m.estimatedDays?.min}-{m.estimatedDays?.max} days</span>
              <span className={cx("font-bold", free ? "text-brand-dark" : "text-gray-900")}>{free ? "Free" : formatTaka(m.baseCharge)}</span>
            </span>
            {tooSmall ? (
              <span className="mt-1 block text-[11px] text-gray-500">For orders over {formatTaka(m.minOrderAmount)}</span>
            ) : (
              !free && m.freeShippingThreshold > 0 && <span className="mt-1 block text-[11px] text-gray-500">Free over {formatTaka(m.freeShippingThreshold)}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}
