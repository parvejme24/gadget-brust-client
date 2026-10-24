"use client";

import { useState } from "react";
import { User, UserPlus, X } from "lucide-react";
import { useAdminUsers } from "@/lib/hooks/useAdmin";
import { inputClass } from "@/components/Dashboard/Kit";

// find a registered customer by name, email or phone
export default function CustomerPicker({ value, onChange, placeholder = "Search name, email or phone…" }) {
  const { data: users = [] } = useAdminUsers();
  const [query, setQuery] = useState("");
  const q = query.trim().toLowerCase();
  const matches = q ? users.filter((u) => u.role === "user" && `${u.fullName} ${u.email} ${u.phone || ""}`.toLowerCase().includes(q)).slice(0, 6) : [];

  if (value) {
    return (
      <div className="flex items-center gap-3 rounded-xl bg-gray-50 px-3 py-2.5">
        <User className="h-4 w-4 text-gray-400" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-gray-900">{value.fullName}</p>
          <p className="truncate text-xs text-gray-500">{value.email}</p>
        </div>
        <button type="button" onClick={() => onChange(null)} aria-label="Change customer" className="rounded-md p-1 text-gray-400 hover:bg-gray-200 hover:text-gray-700">
          <X className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="relative">
      <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={placeholder} aria-label="Find customer" className={inputClass} />
      {matches.length > 0 && (
        <ul className="absolute inset-x-0 top-full z-20 mt-1 overflow-hidden rounded-xl border border-gray-200 bg-surface shadow-lg">
          {matches.map((u) => (
            <li key={u._id}>
              <button
                type="button"
                onClick={() => {
                  onChange(u);
                  setQuery("");
                }}
                className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-gray-50"
              >
                <UserPlus className="h-4 w-4 text-gray-400" />
                <span className="min-w-0">
                  <span className="block truncate font-medium text-gray-900">{u.fullName}</span>
                  <span className="block truncate text-xs text-gray-500">{u.email}</span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
