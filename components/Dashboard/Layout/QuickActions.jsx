"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import { Plus, Zap } from "lucide-react";
import { useClickOutside } from "@/lib/hooks/useClickOutside";
import { cx } from "@/lib/format";
import { quickActionsForRole } from "./navConfig";

// role-specific shortcuts: buttons on wide screens, one "+" menu on smaller ones
export default function QuickActions({ role }) {
  const actions = quickActionsForRole(role);
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);
  const ref = useClickOutside(close);

  if (!actions.length) return null;

  return (
    <>
      <div className="hidden items-center gap-1.5 xl:flex" aria-label="Quick actions">
        <span className="mx-1 h-6 w-px bg-gray-200" />
        {actions.map(({ label, href, icon: Icon }, i) => (
          <Link
            key={href}
            href={href}
            className={cx(
              "inline-flex h-9 items-center gap-2 whitespace-nowrap rounded-xl px-3 text-sm font-semibold transition",
              i === 0 ? "bg-gray-900 text-white hover:bg-gray-800" : "border border-gray-200 bg-surface text-gray-700 hover:border-gray-300 hover:bg-gray-50"
            )}
          >
            <Icon className="h-4 w-4" />
            {label}
          </Link>
        ))}
      </div>

      <div ref={ref} className="relative xl:hidden">
        <button
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-haspopup="menu"
          aria-label="Quick actions"
          className="flex h-9 w-9 items-center justify-center rounded-xl bg-gray-900 text-white transition hover:bg-gray-800"
        >
          <Plus className={cx("h-4 w-4 transition-transform", open && "rotate-45")} />
        </button>
        {open && (
          <div role="menu" className="absolute left-0 top-full z-50 mt-2 w-60 overflow-hidden rounded-2xl border border-gray-200/70 bg-surface p-2 shadow-2xl shadow-gray-900/10">
            <p className="flex items-center gap-1.5 px-3 pb-1.5 pt-1 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
              <Zap className="h-3 w-3" /> Quick actions
            </p>
            {actions.map(({ label, href, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                role="menuitem"
                onClick={close}
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 text-gray-600">
                  <Icon className="h-4 w-4" />
                </span>
                {label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
