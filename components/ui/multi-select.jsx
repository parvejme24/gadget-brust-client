"use client";

import { useMemo, useState } from "react";
import { Check, ChevronDown, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";

/**
 * Searchable multi-select.
 * options: [{ value, label, image?, description? }]   value: array of selected values
 */
export function MultiSelect({ options = [], value = [], onChange, placeholder = "Select…", searchPlaceholder = "Search…", label, className, maxChips = 3, emptyText = "Nothing found" }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const selected = useMemo(() => options.filter((o) => value.includes(o.value)), [options, value]);
  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? options.filter((o) => `${o.label} ${o.description || ""}`.toLowerCase().includes(q)) : options;
  }, [options, query]);

  const toggle = (v) => onChange(value.includes(v) ? value.filter((x) => x !== v) : [...value, v]);
  const allVisibleSelected = visible.length > 0 && visible.every((o) => value.includes(o.value));

  return (
    <Popover open={open} onOpenChange={(o) => { setOpen(o); if (!o) setQuery(""); }}>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label={label}
          className={cn(
            "group flex min-h-10 w-full items-center gap-2 rounded-xl border border-gray-200 bg-surface px-3 py-1.5 text-left text-sm shadow-sm shadow-gray-900/[0.02] outline-none transition hover:border-gray-300 data-[state=open]:border-gray-400 data-[state=open]:ring-4 data-[state=open]:ring-gray-900/5",
            className
          )}
        >
          <span className="flex min-w-0 flex-1 flex-wrap gap-1.5">
            {selected.length === 0 ? (
              <span className="py-0.5 text-gray-400">{placeholder}</span>
            ) : (
              <>
                {selected.slice(0, maxChips).map((o) => (
                  <span key={o.value} className="inline-flex max-w-[12rem] items-center gap-1 rounded-lg bg-gray-100 py-0.5 pl-2 pr-1 text-xs font-semibold text-gray-700">
                    <span className="truncate">{o.label}</span>
                    <span
                      role="button"
                      tabIndex={-1}
                      aria-label={`Remove ${o.label}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggle(o.value);
                      }}
                      className="rounded p-0.5 hover:bg-gray-200"
                    >
                      <X className="h-3 w-3" />
                    </span>
                  </span>
                ))}
                {selected.length > maxChips && <span className="py-0.5 text-xs font-semibold text-gray-500">+{selected.length - maxChips} more</span>}
              </>
            )}
          </span>
          <ChevronDown className="h-4 w-4 shrink-0 text-gray-400 transition-transform group-data-[state=open]:rotate-180" />
        </button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-[var(--radix-popover-trigger-width)] min-w-[18rem] p-0">
        <div className="flex items-center gap-2 border-b border-gray-100 px-3">
          <Search className="h-4 w-4 text-gray-400" />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={searchPlaceholder}
            className="h-11 min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-gray-400"
          />
        </div>
        <ul className="max-h-72 overflow-y-auto p-1.5" role="listbox" aria-multiselectable="true">
          {visible.length === 0 && <li className="px-3 py-6 text-center text-sm text-gray-500">{emptyText}</li>}
          {visible.map((o) => {
            const checked = value.includes(o.value);
            return (
              <li key={o.value}>
                <button
                  type="button"
                  role="option"
                  aria-selected={checked}
                  onClick={() => toggle(o.value)}
                  className="flex w-full items-center gap-3 rounded-xl px-2.5 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                >
                  <span className={cn("flex h-4 w-4 shrink-0 items-center justify-center rounded border", checked ? "border-gray-900 bg-gray-900 text-white" : "border-gray-300")}>
                    {checked && <Check className="h-3 w-3" strokeWidth={3} />}
                  </span>
                  {o.image && <img src={o.image} alt="" className="h-8 w-8 shrink-0 rounded-lg bg-gray-50 object-contain p-0.5" />}
                  <span className="min-w-0 flex-1">
                    <span className={cn("block truncate", checked && "font-semibold text-gray-900")}>{o.label}</span>
                    {o.description && <span className="block truncate text-xs text-gray-500">{o.description}</span>}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
        <div className="flex items-center justify-between border-t border-gray-100 px-3 py-2 text-xs">
          <span className="text-gray-500">{value.length} selected</span>
          <div className="flex gap-1">
            <button
              type="button"
              onClick={() => onChange(allVisibleSelected ? value.filter((v) => !visible.some((o) => o.value === v)) : [...new Set([...value, ...visible.map((o) => o.value)])])}
              className="rounded-lg px-2 py-1 font-semibold text-gray-600 hover:bg-gray-100"
            >
              {allVisibleSelected ? "Unselect shown" : "Select shown"}
            </button>
            <button type="button" onClick={() => onChange([])} className="rounded-lg px-2 py-1 font-semibold text-gray-600 hover:bg-gray-100">
              Clear
            </button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

export default MultiSelect;
