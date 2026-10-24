"use client";

import { useCallback, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useAdminStats } from "@/lib/hooks/useAdmin";
import { useAccountSummary } from "@/lib/hooks/useAccount";
import { can, isStaff } from "@/lib/permissions";
import { cx } from "@/lib/format";
import { findNavItem } from "./navConfig";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import NoAccess from "./NoAccess";

const COLLAPSE_KEY = "gbAdminSidebarCollapsed";

// sidebar counters: pending orders for staff, active orders for customers
const useNavBadges = (role) => {
  const staff = isStaff(role);
  const { data: stats } = useAdminStats({ enabled: staff && can(role, "dashboard") });
  const { data: summary } = useAccountSummary({ enabled: !staff });
  return {
    pendingOrders: can(role, "orders") ? stats?.orders?.pending || 0 : 0,
    activeOrders: summary?.orders?.active || 0,
  };
};

export default function DashboardShell({ user, children }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const badges = useNavBadges(user.role);
  const allowed = can(user.role, findNavItem(pathname)?.permission);
  const closeMobile = useCallback(() => setMobileOpen(false), []);

  useEffect(() => {
    try {
      setCollapsed(localStorage.getItem(COLLAPSE_KEY) === "1");
    } catch {
      // storage blocked: default to expanded
    }
  }, []);

  useEffect(() => setMobileOpen(false), [pathname]);

  const toggleCollapse = () => {
    setCollapsed((c) => {
      try {
        localStorage.setItem(COLLAPSE_KEY, c ? "0" : "1");
      } catch {
        // ignore
      }
      return !c;
    });
  };

  return (
    <div className="min-h-screen bg-canvas">
      <Sidebar
        role={user.role}
        collapsed={collapsed}
        onToggleCollapse={toggleCollapse}
        mobileOpen={mobileOpen}
        onCloseMobile={closeMobile}
        badges={badges}
      />
      <div className={cx("min-w-0 transition-[padding] duration-200 print:pl-0!", collapsed ? "lg:pl-[76px]" : "lg:pl-64")}>
        <Topbar user={user} onOpenMobile={() => setMobileOpen(true)} />
        <main className="mx-auto max-w-[1400px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          {allowed ? children : <NoAccess role={user.role} />}
        </main>
      </div>
    </div>
  );
}
