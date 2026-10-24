"use client";

import Link from "next/link";
import { Menu, Store } from "lucide-react";
import GlobalSearch from "@/components/Dashboard/Search/GlobalSearch";
import Breadcrumbs from "./Breadcrumbs";
import QuickActions from "./QuickActions";
import NotificationBell from "./NotificationBell";
import AvatarMenu from "./AvatarMenu";

// left: menu, breadcrumbs and the role's quick actions; right: search, store, notifications, avatar
export default function Topbar({ user, onOpenMobile }) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-2 border-b border-gray-200/70 bg-canvas/85 px-3 backdrop-blur-xl print:hidden sm:gap-3 sm:px-6 lg:px-8">
      <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3">
        <button onClick={onOpenMobile} aria-label="Open menu" className="rounded-xl p-2 text-gray-600 hover:bg-gray-100 lg:hidden">
          <Menu className="h-5 w-5" />
        </button>
        <Breadcrumbs />
        <QuickActions role={user.role} />
      </div>

      <div className="flex shrink-0 items-center gap-0.5 sm:gap-1">
        <GlobalSearch user={user} />
        <Link
          href="/"
          target="_blank"
          aria-label="View store"
          className="hidden h-10 items-center gap-2 rounded-xl px-3 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 sm:flex"
        >
          <Store className="h-4 w-4" />
          <span className="hidden xl:inline">Store</span>
        </Link>
        <NotificationBell />
        <AvatarMenu user={user} />
      </div>
    </header>
  );
}
