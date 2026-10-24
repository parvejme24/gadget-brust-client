"use client";

import { useEffect, useState } from "react";
import { LayoutGrid, List } from "lucide-react";
import { cx } from "@/lib/format";

// grid / table, remembered per page
export function useViewMode(key, initial = "grid") {
  const [mode, setMode] = useState(initial);
  useEffect(() => {
    try {
      const saved = localStorage.getItem(`gbView:${key}`);
      if (saved === "grid" || saved === "table") setMode(saved);
    } catch {
      // storage blocked: keep the default
    }
  }, [key]);
  const update = (next) => {
    setMode(next);
    try {
      localStorage.setItem(`gbView:${key}`, next);
    } catch {
      // ignore
    }
  };
  return [mode, update];
}

export function ViewToggle({ value, onChange }) {
  const options = [
    { key: "grid", label: "Grid view", icon: LayoutGrid },
    { key: "table", label: "Table view", icon: List },
  ];
  return (
    <div className="inline-flex shrink-0 rounded-xl border border-gray-200 bg-surface p-1 shadow-sm shadow-gray-900/[0.02]" role="radiogroup" aria-label="Layout">
      {options.map(({ key, label, icon: Icon }) => (
        <button
          key={key}
          type="button"
          role="radio"
          aria-checked={value === key}
          aria-label={label}
          title={label}
          onClick={() => onChange(key)}
          className={cx(
            "flex h-8 w-9 items-center justify-center rounded-lg transition",
            value === key ? "bg-gray-900 text-white shadow-sm" : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
          )}
        >
          <Icon className="h-4 w-4" />
        </button>
      ))}
    </div>
  );
}
