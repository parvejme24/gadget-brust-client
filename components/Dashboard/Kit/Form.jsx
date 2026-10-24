"use client";

import { Minus, Plus, Search, X } from "lucide-react";
import { cx } from "@/lib/format";

export const inputClass =
  "h-10 w-full rounded-xl border border-gray-200 bg-surface px-3.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-400 focus:ring-4 focus:ring-gray-900/5 disabled:opacity-60";

export function Field({ label, hint, error, htmlFor, children, className = "" }) {
  return (
    <div className={className}>
      {label && (
        <label htmlFor={htmlFor} className="mb-1.5 block text-[13px] font-medium text-gray-700">
          {label}
        </label>
      )}
      {children}
      {error ? <p className="mt-1.5 text-xs text-red-600">{error}</p> : hint ? <p className="mt-1.5 text-xs text-gray-500">{hint}</p> : null}
    </div>
  );
}

export function SearchInput({ value, onChange, placeholder = "Search…", className = "" }) {
  return (
    <div className={cx("relative", className)}>
      <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
      <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} aria-label={placeholder} className={cx(inputClass, "pl-10 pr-9")} />
      {value && (
        <button onClick={() => onChange("")} aria-label="Clear search" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700">
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}

export function Toggle({ checked, onChange, label, disabled }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={cx("relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition", checked ? "bg-brand" : "bg-gray-300")}
    >
      <span className={cx("inline-block h-5 w-5 rounded-full bg-white shadow transition", checked ? "translate-x-[22px]" : "translate-x-0.5")} />
    </button>
  );
}

// − qty + control; max is optional (e.g. stock left)
export function QtyStepper({ value, onChange, min = 1, max, size = "md", label = "Quantity" }) {
  const h = size === "sm" ? "h-8" : "h-9";
  return (
    <div className={cx("inline-flex shrink-0 items-center rounded-lg border border-gray-200 bg-surface", h)} role="group" aria-label={label}>
      <button type="button" onClick={() => onChange(value - 1)} disabled={value <= min} aria-label="Less" className="flex h-full w-8 items-center justify-center text-gray-500 hover:text-gray-900 disabled:opacity-30">
        <Minus className="h-3.5 w-3.5" />
      </button>
      <span className="w-7 text-center text-sm font-semibold tabular-nums text-gray-900">{value}</span>
      <button type="button" onClick={() => onChange(value + 1)} disabled={max !== undefined && value >= max} aria-label="More" className="flex h-full w-8 items-center justify-center text-gray-500 hover:text-gray-900 disabled:opacity-30">
        <Plus className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
