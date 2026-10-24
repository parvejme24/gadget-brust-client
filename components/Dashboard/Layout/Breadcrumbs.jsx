"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { cx } from "@/lib/format";
import { findNavItem, findNavParent } from "./navConfig";

const subPageLabel = (pathname) => (pathname.endsWith("/add") || pathname.endsWith("/new") ? "New" : pathname.includes("/edit") ? "Edit" : "Details");

export default function Breadcrumbs() {
  const pathname = usePathname();
  const current = findNavItem(pathname);
  const parent = findNavParent(current);
  const isSubPage = current && pathname !== current.href;

  const crumbs = [
    parent && { label: parent.label, href: parent.href },
    current && { label: current.label, href: current.href },
    isSubPage && { label: subPageLabel(pathname) },
  ].filter(Boolean);

  return (
    <nav aria-label="Breadcrumb" className="flex min-w-0 items-center gap-1.5 text-sm">
      <Link href="/dashboard/dashboard" className="hidden shrink-0 text-gray-500 hover:text-gray-900 md:inline">
        Dashboard
      </Link>
      {crumbs.map((crumb, i) => {
        const last = i === crumbs.length - 1;
        return (
          // on phones only the current page is shown
          <span key={crumb.label} className={cx("min-w-0 items-center gap-1.5", last ? "flex" : "hidden md:flex")}>
            <ChevronRight className="hidden h-3.5 w-3.5 shrink-0 text-gray-300 md:block" />
            {crumb.href && !last ? (
              <Link href={crumb.href} className="truncate text-gray-500 hover:text-gray-900">{crumb.label}</Link>
            ) : (
              <span className="truncate font-semibold text-gray-900">{crumb.label}</span>
            )}
          </span>
        );
      })}
    </nav>
  );
}
