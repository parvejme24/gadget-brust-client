"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Bell, CheckCheck } from "lucide-react";
import { useNotifications, useNotificationActions } from "@/lib/hooks/useAccount";
import { Button, EmptyState, ErrorState, PageHeader, Panel, cx } from "@/components/Dashboard/Kit";
import NotificationItem from "@/components/Dashboard/Notifications/NotificationItem";

export default function NotificationsPage() {
  const router = useRouter();
  const [filter, setFilter] = useState("all");
  const { data, isLoading, isError, error, refetch } = useNotifications({ limit: 100, ...(filter === "unread" && { unread: true }) });
  const { markRead, markAllRead } = useNotificationActions();
  const items = data?.items || [];

  const open = (n) => {
    if (!n.read) markRead.mutate(n._id);
    if (n.link) router.push(n.link);
  };

  return (
    <>
      <PageHeader
        title="Notifications"
        description={data ? `${data.unread} unread` : "Orders, stock alerts and updates for your role"}
        actions={
          <Button variant="secondary" onClick={() => markAllRead.mutate()} loading={markAllRead.isPending} disabled={!data?.unread}>
            <CheckCheck className="h-4 w-4" /> Mark all read
          </Button>
        }
      />
      <div className="mb-4 flex gap-1" role="tablist" aria-label="Filter">
        {[
          ["all", "All"],
          ["unread", "Unread"],
        ].map(([key, label]) => (
          <button key={key} role="tab" aria-selected={filter === key} onClick={() => setFilter(key)} className={cx("rounded-xl px-3.5 py-2 text-sm font-semibold transition", filter === key ? "bg-gray-900 text-white" : "text-gray-600 hover:bg-gray-100")}>
            {label}
          </button>
        ))}
      </div>
      <Panel bodyClassName="p-2">
        {isError ? (
          <ErrorState error={error} onRetry={refetch} />
        ) : isLoading ? (
          <div className="space-y-2 p-2">{[0, 1, 2, 3].map((i) => <div key={i} className="h-16 animate-pulse rounded-xl bg-gray-100" />)}</div>
        ) : items.length === 0 ? (
          <EmptyState icon={Bell} title={filter === "unread" ? "No unread notifications" : "No notifications yet"} />
        ) : (
          <ul className="space-y-0.5">
            {items.map((n) => (
              <li key={n._id}>
                <NotificationItem notification={n} onOpen={() => open(n)} />
              </li>
            ))}
          </ul>
        )}
      </Panel>
    </>
  );
}
