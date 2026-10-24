import Link from "next/link";
import { Check, MapPin } from "lucide-react";
import { cx } from "@/lib/format";

const sameAddress = (a, contact) =>
  a.street.trim().toLowerCase() === contact.street.trim().toLowerCase() && a.city.trim().toLowerCase() === contact.city.trim().toLowerCase();

// a signed-in customer's saved addresses; picking one fills the form below
export default function SavedAddresses({ addresses, contact, onPick }) {
  if (!addresses.length) return null;

  return (
    <div className="mb-5">
      <div className="mb-2 flex items-center justify-between">
        <p className="text-sm font-semibold text-gray-900">Saved addresses</p>
        <Link href="/dashboard/profile" className="text-xs font-semibold text-brand hover:underline">Manage</Link>
      </div>
      <div className="grid gap-3 sm:grid-cols-2" role="radiogroup" aria-label="Saved address">
        {addresses.map((a) => {
          const selected = sameAddress(a, contact);
          return (
            <button
              key={a._id}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => onPick(a)}
              className={cx(
                "relative rounded-2xl border p-4 text-left transition",
                selected ? "border-brand bg-brand-light/30 ring-2 ring-brand/20" : "border-gray-200 hover:border-gray-300"
              )}
            >
              {selected && <span className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-brand text-white"><Check className="h-3 w-3" /></span>}
              <span className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                <MapPin className="h-4 w-4 text-gray-400" /> {a.label}
                {a.isDefault && <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-600">Default</span>}
              </span>
              <span className="mt-1 block truncate pr-6 text-xs text-gray-500">{a.name} · {a.phone}</span>
              <span className="mt-0.5 block truncate pr-6 text-xs text-gray-500">{a.street}, {a.city}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
