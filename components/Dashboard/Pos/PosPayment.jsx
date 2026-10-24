import { Banknote, CreditCard, Smartphone } from "lucide-react";
import { cx, formatTaka, inputClass } from "@/components/Dashboard/Kit";

const METHODS = [
  { key: "cash", label: "Cash", icon: Banknote },
  { key: "card", label: "Card", icon: CreditCard },
  { key: "bkash", label: "bKash", icon: Smartphone },
  { key: "nagad", label: "Nagad", icon: Smartphone },
];

export default function PosPayment({ sale }) {
  const { method, setMethod, received, setReceived, quickCash, total, note, setNote } = sale;
  return (
    <div>
      <p className="text-sm font-semibold text-gray-900">Payment</p>
      <div className="mt-2 grid grid-cols-4 gap-2">
        {METHODS.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            type="button"
            onClick={() => setMethod(key)}
            aria-pressed={method === key}
            className={cx("flex flex-col items-center gap-1 rounded-xl border py-2.5 text-xs font-semibold transition", method === key ? "border-gray-900 bg-gray-900 text-white" : "border-gray-200 text-gray-600 hover:border-gray-300")}
          >
            <Icon className="h-4 w-4" /> {label}
          </button>
        ))}
      </div>
      {method === "cash" && (
        <div className="mt-3">
          <input type="number" min="0" value={received} onChange={(e) => setReceived(e.target.value)} placeholder="Cash received" aria-label="Cash received" className={cx(inputClass, "h-11 text-base font-semibold")} />
          <div className="mt-2 flex flex-wrap gap-1.5">
            {quickCash.map((v) => (
              <button key={v} type="button" onClick={() => setReceived(String(v))} className="rounded-lg bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-700 hover:bg-gray-200">
                {v === total ? "Exact" : formatTaka(v)}
              </button>
            ))}
          </div>
        </div>
      )}
      <input value={note} onChange={(e) => setNote(e.target.value)} placeholder="Note on memo (optional)" aria-label="Note" className={cx(inputClass, "mt-3")} />
    </div>
  );
}
