"use client";

import { useState } from "react";
import { TicketPercent, X } from "lucide-react";
import { fieldClass } from "./CheckoutField";
import { cx } from "@/lib/format";

// applied: the code the server accepted (or ""); error: why it was refused
export default function CouponBox({ applied, error, checking, onApply, onRemove }) {
  const [code, setCode] = useState("");

  if (applied) {
    return (
      <div className="flex items-center gap-3 rounded-xl bg-emerald-50 px-3 py-2.5 ring-1 ring-emerald-200">
        <TicketPercent className="h-4 w-4 text-emerald-700" />
        <p className="flex-1 font-mono text-sm font-bold text-emerald-900">{applied}</p>
        <button type="button" onClick={onRemove} aria-label="Remove coupon" className="rounded-md p-1 text-emerald-700 hover:bg-emerald-100"><X className="h-4 w-4" /></button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex gap-2">
        <input
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              if (code.trim()) onApply(code.trim());
            }
          }}
          placeholder="Coupon code"
          aria-label="Coupon code"
          className={cx(fieldClass, "h-11 font-mono")}
        />
        <button
          type="button"
          disabled={!code.trim() || checking}
          onClick={() => onApply(code.trim())}
          className="h-11 shrink-0 rounded-xl border border-gray-200 px-4 text-sm font-semibold text-gray-700 transition hover:border-gray-300 disabled:opacity-50"
        >
          Apply
        </button>
      </div>
      {error && <p className="mt-1.5 text-xs text-red-600">{error}</p>}
    </div>
  );
}
