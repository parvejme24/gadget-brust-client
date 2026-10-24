"use client";

import { useEffect, useState } from "react";
import { CalendarDays, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Calendar } from "./calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";

// values are "YYYY-MM-DD" strings in local time, so pages can keep simple string state
export const parseDateValue = (value) => {
  if (!value) return undefined;
  const [y, m, d] = value.split("-").map(Number);
  return new Date(y, m - 1, d);
};
export const toDateValue = (date) =>
  date ? `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}` : "";

const fmt = (date, withYear = true) =>
  date.toLocaleDateString("en-GB", { day: "numeric", month: "short", ...(withYear && { year: "numeric" }) });

const startOfDay = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
const presets = () => {
  const today = startOfDay(new Date());
  const daysAgo = (n) => new Date(today.getFullYear(), today.getMonth(), today.getDate() - n);
  return [
    { label: "Today", range: { from: today, to: today } },
    { label: "Yesterday", range: { from: daysAgo(1), to: daysAgo(1) } },
    { label: "Last 7 days", range: { from: daysAgo(6), to: today } },
    { label: "Last 30 days", range: { from: daysAgo(29), to: today } },
    { label: "This month", range: { from: new Date(today.getFullYear(), today.getMonth(), 1), to: today } },
    { label: "Last month", range: { from: new Date(today.getFullYear(), today.getMonth() - 1, 1), to: new Date(today.getFullYear(), today.getMonth(), 0) } },
    { label: "This year", range: { from: new Date(today.getFullYear(), 0, 1), to: today } },
  ];
};

export const formatRangeLabel = (from, to) => {
  if (!from) return "";
  const thisYear = new Date().getFullYear();
  if (!to || from.getTime() === to.getTime()) return fmt(from, from.getFullYear() !== thisYear);
  const sameYear = from.getFullYear() === to.getFullYear();
  // drop the year when both dates are in the current year
  return `${fmt(from, !sameYear)} – ${fmt(to, !(sameYear && to.getFullYear() === thisYear))}`;
};

/**
 * shadcn-style date range picker.
 * value: { from: "YYYY-MM-DD" | "", to: "YYYY-MM-DD" | "" }
 */
export function DateRangePicker({ value = { from: "", to: "" }, onChange, placeholder = "Pick a date range", align = "start", className, label = "Date range" }) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(undefined);
  const [months, setMonths] = useState(2);
  const from = parseDateValue(value.from);
  const to = parseDateValue(value.to);
  const hasValue = !!from;

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 640px)");
    const update = () => setMonths(mq.matches ? 2 : 1);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const openChange = (next) => {
    setOpen(next);
    if (next) setDraft(from ? { from, to: to || from } : undefined);
  };

  const apply = (range = draft) => {
    onChange?.({ from: toDateValue(range?.from), to: toDateValue(range?.to || range?.from) });
    setOpen(false);
  };

  const clear = (e) => {
    e?.stopPropagation();
    onChange?.({ from: "", to: "" });
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={openChange}>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label={label}
          className={cn(
            "group inline-flex h-10 w-full min-w-0 items-center gap-2 rounded-xl border border-gray-200 bg-surface px-3.5 text-left text-sm font-medium shadow-sm shadow-gray-900/[0.02] outline-none transition hover:border-gray-300 data-[state=open]:border-gray-400 data-[state=open]:ring-4 data-[state=open]:ring-gray-900/5",
            className
          )}
        >
          <CalendarDays className="h-4 w-4 shrink-0 text-gray-400" />
          <span className={cn("min-w-0 flex-1 truncate", hasValue ? "text-gray-900" : "text-gray-400")}>{hasValue ? formatRangeLabel(from, to) : placeholder}</span>
          {hasValue && (
            <span role="button" tabIndex={-1} onClick={clear} aria-label="Clear dates" className="-mr-1 rounded-md p-0.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700">
              <X className="h-3.5 w-3.5" />
            </span>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent align={align} className="w-auto max-w-[calc(100vw-2rem)] p-0">
        <div className="flex flex-col sm:flex-row">
          <div className="no-scrollbar flex gap-1 overflow-x-auto border-b border-gray-100 p-2 sm:w-36 sm:flex-col sm:overflow-visible sm:border-b-0 sm:border-r">
            {presets().map((preset) => (
              <button
                key={preset.label}
                type="button"
                onClick={() => apply(preset.range)}
                className="shrink-0 rounded-lg px-3 py-1.5 text-left text-[13px] font-medium text-gray-600 transition hover:bg-gray-100 hover:text-gray-900"
              >
                {preset.label}
              </button>
            ))}
          </div>
          <div>
            <Calendar
              mode="range"
              numberOfMonths={months}
              showOutsideDays={false}
              selected={draft}
              onSelect={setDraft}
              defaultMonth={(() => {
                // show the month the range ends in, with the previous month beside it
                const end = draft?.to || draft?.from || new Date();
                return new Date(end.getFullYear(), end.getMonth() - (months - 1), 1);
              })()}
              disabled={{ after: new Date() }}
            />
            <div className="flex items-center justify-between gap-3 border-t border-gray-100 px-4 py-3">
              <span className="truncate text-xs text-gray-500">{draft?.from ? formatRangeLabel(draft.from, draft.to) : "Select a start date"}</span>
              <div className="flex shrink-0 gap-2">
                <button type="button" onClick={clear} className="h-8 rounded-lg px-3 text-xs font-semibold text-gray-600 hover:bg-gray-100">
                  Clear
                </button>
                <button type="button" onClick={() => apply()} disabled={!draft?.from} className="h-8 rounded-lg bg-gray-900 px-3.5 text-xs font-semibold text-white hover:bg-gray-800 disabled:opacity-40">
                  Apply
                </button>
              </div>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

export default DateRangePicker;
