"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Bell, CheckCheck, Loader2 } from "lucide-react";
import { useNotifications, useNotificationActions } from "@/lib/hooks/useAccount";
import { useClickOutside } from "@/lib/hooks/useClickOutside";
import { cx } from "@/lib/format";
import NotificationItem from "@/components/Dashboard/Notifications/NotificationItem";

export default function NotificationBell() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);
  const ref = useClickOutside(close);
  const { data, isLoading, isError } = useNotifications({ limit: 8 });
  const { markRead, markAllRead } = useNotificationActions();
  const unread = data?.unread || 0;
  const items = data?.items || [];

  const openItem = (n) => {
    if (!n.read) markRead.mutate(n._id);
    close();
    if (n.link) router.push(n.link);
  };

  return (
    <div ref={ref} className="sm:relative">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label={`Notifications${unread ? ` (${unread} unread)` : ""}`}
        aria-expanded={open}
        className="relative flex h-10 w-10 items-center justify-center rounded-xl text-gray-600 hover:bg-gray-100 hover:text-gray-900"
      >
        <Bell className="h-5 w-5" />
        {unread > 0 && (
          <span className="absolute right-1 top-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white ring-2 ring-canvas">
            {unread > 99 ? "99+" : unread}
          </span>
        )}
      </button>

      {open && (
        // full width under the bar on phones, a dropdown from sm up
        <div className="absolute inset-x-2 top-full z-50 mt-2 overflow-hidden rounded-2xl border border-gray-200/70 bg-surface shadow-2xl shadow-gray-900/10 sm:inset-x-auto sm:right-0 sm:w-96">
          <div className="flex items-center justify-between gap-3 border-b border-gray-100 px-4 py-3">
            <div>
              <p className="text-sm font-semibold text-gray-900">Notifications</p>
              <p className="text-xs text-gray-500">{unread ? `${unread} unread` : "You're all caught up"}</p>
            </div>
            {unread > 0 && (
              <button
                onClick={() => markAllRead.mutate()}
                disabled={markAllRead.isPending}
                className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-xs font-semibold text-brand-dark hover:bg-brand-light disabled:opacity-50"
              >
                {markAllRead.isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <CheckCheck className="h-3.5 w-3.5" />}
                Mark all read
              </button>
            )}
          </div>

          <div className="max-h-[60vh] overflow-y-auto p-2">
            {isLoading ? (
              <div className="flex justify-center py-10">
                <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
              </div>
            ) : isError ? (
              <p className="px-4 py-8 text-center text-sm text-gray-500">Couldn&apos;t load notifications.</p>
            ) : items.length === 0 ? (
              <div className="flex flex-col items-center px-4 py-10 text-center">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-100 text-gray-400">
                  <Bell className="h-5 w-5" />
                </span>
                <p className="mt-3 text-sm font-medium text-gray-900">No notifications yet</p>
                <p className="mt-0.5 text-xs text-gray-500">New orders, stock alerts and updates show up here.</p>
              </div>
            ) : (
              <ul className="space-y-0.5">
                {items.map((n) => (
                  <li key={n._id}>
                    <NotificationItem notification={n} onOpen={() => openItem(n)} compact />
                  </li>
                ))}
              </ul>
            )}
          </div>

          <Link
            href="/dashboard/notifications"
            onClick={close}
            className={cx("block border-t border-gray-100 px-4 py-3 text-center text-sm font-semibold text-gray-700 hover:bg-gray-50")}
          >
            View all notifications
          </Link>
        </div>
      )}
    </div>
  );
}
