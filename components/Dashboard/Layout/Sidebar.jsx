"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ExternalLink, PanelLeftClose, PanelLeftOpen, X } from "lucide-react";
import logo from "@/assets/logo.svg";
import { navForRole } from "./navConfig";
import { cx } from "@/lib/format";
import { ROLE_INFO } from "@/lib/permissions";

export default function AdminSidebar({ role, collapsed, onToggleCollapse, mobileOpen, onCloseMobile, badges = {} }) {
  const pathname = usePathname();
  const isActive = (href) => pathname === href || pathname.startsWith(`${href}/`);
  const roleLabel = ROLE_INFO[role]?.label || "Staff";

  const nav = (compact) => (
    <nav className="flex-1 overflow-y-auto px-3 py-4" aria-label="Dashboard navigation">
      {navForRole(role).map((group) => (
        <div key={group.group} className="mb-5 last:mb-0">
          {compact ? (
            <div className="mx-auto mb-2 h-px w-6 bg-gray-200" />
          ) : (
            <p className="mb-1.5 px-3 text-[11px] font-semibold uppercase tracking-wider text-gray-400">{group.group}</p>
          )}
          <ul className="space-y-0.5">
            {group.items.map(({ label, href, icon: Icon, badge }) => {
              const active = isActive(href);
              const count = badge ? badges[badge] : 0;
              return (
                <li key={href}>
                  <Link
                    href={href}
                    onClick={onCloseMobile}
                    title={compact ? label : undefined}
                    aria-current={active ? "page" : undefined}
                    className={cx(
                      "group relative flex items-center gap-3 rounded-xl text-sm font-medium transition",
                      compact ? "h-11 justify-center" : "h-10 px-3",
                      active ? "bg-gray-900 text-white shadow-sm" : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                    )}
                  >
                    <Icon className={cx("h-[18px] w-[18px] shrink-0", active ? "text-emerald-300" : "text-gray-400 group-hover:text-gray-700")} strokeWidth={2} />
                    {!compact && <span className="flex-1 truncate">{label}</span>}
                    {count > 0 &&
                      (compact ? (
                        <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-amber-500" />
                      ) : (
                        <span className={cx("rounded-full px-1.5 py-0.5 text-[11px] font-bold", active ? "bg-white/15 text-white" : "bg-amber-100 text-amber-800")}>
                          {count}
                        </span>
                      ))}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );

  const storeLink = (compact) => (
    <div className="border-t border-gray-200/70 p-3">
      <Link
        href="/"
        target="_blank"
        title={compact ? "View storefront" : undefined}
        className={cx(
          "flex items-center gap-3 rounded-xl text-sm font-medium text-gray-600 transition hover:bg-gray-100 hover:text-gray-900",
          compact ? "h-11 justify-center" : "h-10 px-3"
        )}
      >
        <ExternalLink className="h-[18px] w-[18px] text-gray-400" />
        {!compact && "View storefront"}
      </Link>
    </div>
  );

  return (
    <>
      {/* desktop */}
      <aside
        className={cx(
          "fixed inset-y-0 left-0 z-40 hidden flex-col border-r print:hidden! border-gray-200/70 bg-surface transition-[width] duration-200 lg:flex",
          collapsed ? "w-[76px]" : "w-64"
        )}
      >
        <div className={cx("flex h-16 items-center border-b border-gray-200/70", collapsed ? "justify-center" : "justify-between px-5")}>
          {!collapsed && (
            <Link href="/dashboard/dashboard" className="flex items-center gap-2">
              <Image src={logo} alt="Gadget Brust" className="h-8 w-auto" priority />
              <span className="max-w-[6.5rem] truncate rounded-md bg-gray-900 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">{roleLabel}</span>
            </Link>
          )}
          <button
            onClick={onToggleCollapse}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900"
          >
            {collapsed ? <PanelLeftOpen className="h-[18px] w-[18px]" /> : <PanelLeftClose className="h-[18px] w-[18px]" />}
          </button>
        </div>
        {nav(collapsed)}
        {storeLink(collapsed)}
      </aside>

      {/* mobile drawer */}
      <div className={cx("fixed inset-0 z-[60] lg:hidden print:hidden", mobileOpen ? "" : "pointer-events-none")} aria-hidden={!mobileOpen}>
        <div onClick={onCloseMobile} className={cx("absolute inset-0 bg-gray-950/40 transition-opacity", mobileOpen ? "opacity-100" : "opacity-0")} />
        <aside className={cx("absolute inset-y-0 left-0 flex w-72 flex-col bg-surface shadow-2xl transition-transform duration-300", mobileOpen ? "translate-x-0" : "-translate-x-full")}>
          <div className="flex h-16 items-center justify-between border-b border-gray-200/70 px-5">
            <Link href="/dashboard/dashboard" onClick={onCloseMobile} className="flex items-center gap-2">
              <Image src={logo} alt="Gadget Brust" className="h-8 w-auto" />
              <span className="max-w-[6.5rem] truncate rounded-md bg-gray-900 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">{roleLabel}</span>
            </Link>
            <button onClick={onCloseMobile} aria-label="Close menu" className="rounded-lg p-2 text-gray-500 hover:bg-gray-100">
              <X className="h-5 w-5" />
            </button>
          </div>
          {nav(false)}
          {storeLink(false)}
        </aside>
      </div>
    </>
  );
}
