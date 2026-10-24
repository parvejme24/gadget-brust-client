"use client";

import { useId, useState } from "react";
import { ChevronDown } from "lucide-react";
import { cx } from "@/lib/format";

// One open item at a time (or several with multiple), with smooth height animation.
// items: [{ id?, title, content }]
export default function Accordion({ items, multiple = false, defaultOpen = [], className, itemClassName }) {
  const baseId = useId();
  const [open, setOpen] = useState(defaultOpen);
  const toggle = (key) => setOpen((o) => (o.includes(key) ? o.filter((k) => k !== key) : multiple ? [...o, key] : [key]));

  return (
    <div className={className}>
      {items.map((item, i) => {
        const key = item.id ?? i;
        const isOpen = open.includes(key);
        const panelId = `${baseId}-${i}`;
        return (
          <div key={key} data-open={isOpen} className={cx("group", itemClassName)}>
            <h3>
              <button
                type="button"
                onClick={() => toggle(key)}
                aria-expanded={isOpen}
                aria-controls={panelId}
                className="flex w-full items-center justify-between gap-3 p-4 text-left text-sm font-semibold text-gray-900 transition hover:text-brand-dark"
              >
                {item.title}
                <span className={cx("flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition-all duration-300", isOpen ? "rotate-180 bg-brand text-white" : "bg-gray-100 text-gray-500")}>
                  <ChevronDown className="h-4 w-4" />
                </span>
              </button>
            </h3>
            <div id={panelId} role="region" className="accordion-panel">
              <div>
                <div className={cx("px-4 pb-4 text-sm leading-6 text-gray-600 transition-all duration-300", isOpen ? "translate-y-0 opacity-100" : "-translate-y-1 opacity-0")}>{item.content}</div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
