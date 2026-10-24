"use client";

import { useState } from "react";
import { X } from "lucide-react";

// chips you add with Enter or comma and remove with × or Backspace
export function TagInput({ value, onChange, placeholder = "Type and press Enter", label = "Add item" }) {
  const [draft, setDraft] = useState("");
  const add = () => {
    const tag = draft.trim();
    if (tag && !value.some((v) => v.toLowerCase() === tag.toLowerCase())) onChange([...value, tag]);
    setDraft("");
  };
  return (
    <div className="rounded-xl border border-gray-200 bg-surface p-2 focus-within:border-gray-400 focus-within:ring-4 focus-within:ring-gray-900/5">
      <div className="flex flex-wrap gap-1.5">
        {value.map((tag) => (
          <span key={tag} className="inline-flex items-center gap-1 rounded-lg bg-gray-100 py-1 pl-2.5 pr-1 text-xs font-medium text-gray-700">
            {tag}
            <button type="button" onClick={() => onChange(value.filter((t) => t !== tag))} aria-label={`Remove ${tag}`} className="rounded p-0.5 hover:bg-gray-200">
              <X className="h-3 w-3" />
            </button>
          </span>
        ))}
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === ",") {
              e.preventDefault();
              add();
            } else if (e.key === "Backspace" && !draft && value.length) onChange(value.slice(0, -1));
          }}
          onBlur={add}
          placeholder={value.length ? "Add another…" : placeholder}
          aria-label={label}
          className="h-7 min-w-[10rem] flex-1 bg-transparent px-1.5 text-sm outline-none placeholder:text-gray-400"
        />
      </div>
    </div>
  );
}
