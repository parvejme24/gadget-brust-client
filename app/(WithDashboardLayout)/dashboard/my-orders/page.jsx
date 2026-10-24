"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ShoppingBag } from "lucide-react";
import { useMyOrders } from "@/lib/hooks/useAccount";
import { EmptyState, ErrorState, PageHeader, buttonClass, cx } from "@/components/Dashboard/Kit";
import MyOrderCard from "@/components/Dashboard/Account/MyOrderCard";

const tabs = [
  { key: "all", label: "All", match: () => true },
  { key: "active", label: "In progress", match: (o) => ["pending", "processing", "shipped"].includes(o.orderStatus) },
  { key: "delivered", label: "Delivered", match: (o) => o.orderStatus === "delivered" },
  { key: "cancelled", label: "Cancelled", match: (o) => o.orderStatus === "cancelled" },
];

function MyOrdersView() {
  const searchParams = useSearchParams();
  const { data: orders = [], isLoading, isError, error, refetch } = useMyOrders();
  const [tab, setTab] = useState(searchParams.get("status") || "all");
  useEffect(() => setTab(searchParams.get("status") || "all"), [searchParams]);
  const current = tabs.find((t) => t.key === tab) || tabs[0];
  const visible = orders.filter(current.match);

  return (
    <>
      <PageHeader title="My orders" description="Track deliveries and see what you've bought." actions={<Link href="/products" className={buttonClass("secondary")}>Continue shopping</Link>} />

      <div className="no-scrollbar -mx-4 mb-4 flex gap-1 overflow-x-auto px-4 sm:mx-0 sm:px-0" role="tablist" aria-label="Order status">
        {tabs.map((t) => (
          <button
            key={t.key}
            role="tab"
            aria-selected={tab === t.key}
            onClick={() => setTab(t.key)}
            className={cx("flex shrink-0 items-center gap-2 rounded-xl px-3.5 py-2 text-sm font-semibold transition", tab === t.key ? "bg-gray-900 text-white" : "text-gray-600 hover:bg-gray-100")}
          >
            {t.label}
            <span className={cx("rounded-md px-1.5 text-xs", tab === t.key ? "bg-white/15" : "bg-gray-100 text-gray-500")}>{orders.filter(t.match).length}</span>
          </button>
        ))}
      </div>

      {isError ? (
        <ErrorState error={error} onRetry={refetch} />
      ) : isLoading ? (
        <div className="grid gap-4 lg:grid-cols-2">{[0, 1, 2, 3].map((i) => <div key={i} className="h-40 animate-pulse rounded-2xl bg-gray-100" />)}</div>
      ) : visible.length === 0 ? (
        <EmptyState icon={ShoppingBag} title={orders.length ? "No orders here" : "No orders yet"} text={orders.length ? "Try another tab." : "Your orders will appear here after checkout."} action={!orders.length && <Link href="/products" className={buttonClass("brand")}>Start shopping</Link>} />
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {visible.map((o) => <MyOrderCard key={o._id} order={o} />)}
        </div>
      )}
    </>
  );
}

export default function MyOrdersPage() {
  return (
    <Suspense fallback={null}>
      <MyOrdersView />
    </Suspense>
  );
}
