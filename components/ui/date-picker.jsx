"use client";

import { useState } from "react";
import { CalendarDays, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Calendar } from "./calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { parseDateValue, toDateValue } from "./date-range-picker";

/** Single-date picker; value is a "YYYY-MM-DD" string */
export function DatePicker({ value, onChange, placeholder = "Pick a date", id, label, disabled, className, align = "start" }) {
  const [open, setOpen] = useState(false);
  const date = parseDateValue(value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          id={id}
          type="button"
          aria-label={label}
          className={cn(
            "group inline-flex h-10 w-full min-w-0 items-center gap-2 rounded-xl border border-gray-200 bg-surface px-3.5 text-left text-sm font-medium shadow-sm shadow-gray-900/[0.02] outline-none transition hover:border-gray-300 data-[state=open]:border-gray-400 data-[state=open]:ring-4 data-[state=open]:ring-gray-900/5",
            className
          )}
        >
          <CalendarDays className="h-4 w-4 shrink-0 text-gray-400" />
          <span className={cn("min-w-0 flex-1 truncate", date ? "text-gray-900" : "text-gray-400")}>
            {date ? date.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", year: "numeric" }) : placeholder}
          </span>
          {date && (
            <span
              role="button"
              tabIndex={-1}
              aria-label="Clear date"
              onClick={(e) => {
                e.stopPropagation();
                onChange?.("");
              }}
              className="-mr-1 rounded-md p-0.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
            >
              <X className="h-3.5 w-3.5" />
            </span>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent align={align} className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date}
          defaultMonth={date}
          disabled={disabled}
          onSelect={(d) => {
            onChange?.(toDateValue(d));
            setOpen(false);
          }}
        />
      </PopoverContent>
    </Popover>
  );
}

export default DatePicker;
