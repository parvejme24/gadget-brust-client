"use client";

import { DayPicker } from "react-day-picker";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

// shadcn-style calendar on react-day-picker v9, styled with the store's tokens
export function Calendar({ className, classNames, showOutsideDays = true, ...props }) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
        months: "relative flex flex-col gap-6 sm:flex-row",
        month: "flex flex-col gap-3",
        month_caption: "flex h-9 items-center justify-center",
        caption_label: "text-sm font-semibold text-gray-900",
        nav: "absolute inset-x-0 top-0 z-10 flex h-9 items-center justify-between",
        button_previous:
          "flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-surface text-gray-600 transition hover:bg-gray-100 hover:text-gray-900 disabled:opacity-40",
        button_next:
          "flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-surface text-gray-600 transition hover:bg-gray-100 hover:text-gray-900 disabled:opacity-40",
        month_grid: "border-collapse",
        weekdays: "flex",
        weekday: "w-9 pb-1 text-center text-[11px] font-medium uppercase tracking-wide text-gray-400",
        week: "mt-1 flex",
        day: "relative h-9 w-9 p-0 text-center text-sm",
        day_button:
          "h-9 w-9 rounded-lg font-medium text-gray-700 transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900/20",
        today: "[&>button]:ring-1 [&>button]:ring-inset [&>button]:ring-brand/60 [&>button]:text-brand-dark",
        selected: "[&>button]:bg-gray-900 [&>button]:text-white [&>button]:hover:bg-gray-800 [&>button]:hover:text-white",
        range_start: "rounded-l-lg bg-gray-100",
        range_end: "rounded-r-lg bg-gray-100",
        range_middle: "rounded-none bg-gray-100 [&>button]:bg-transparent! [&>button]:text-gray-900! [&>button]:hover:bg-gray-200!",
        outside: "[&>button]:text-gray-300",
        disabled: "[&>button]:pointer-events-none [&>button]:text-gray-300",
        hidden: "invisible",
        ...classNames,
      }}
      components={{
        Chevron: ({ orientation }) => (orientation === "left" ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />),
      }}
      {...props}
    />
  );
}

export default Calendar;
