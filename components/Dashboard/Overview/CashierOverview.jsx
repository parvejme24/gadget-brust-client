"use client";

import Link from "next/link";
import { ArrowRight, Banknote, ClipboardCheck, ReceiptText, ScanBarcode, Truck } from "lucide-react";
import { useAdminOrders, useAdminStats } from "@/lib/hooks/useAdmin";
import { Panel, StatCard, buttonClass, formatTaka, isGuestOrder } from "@/components/Dashboard/Kit";
import OverviewHeader from "./OverviewHeader";
import RecentOrdersPanel from "./RecentOrdersPanel";
import TopCustomersPanel from "./TopCustomersPanel";

const isToday = (d) => new Date(d).toDateString() === new Date().toDateString();

// cashier: counter sales and the orders that need action
export default function CashierOverview({ user }) {
  const { data: stats, isLoading } = useAdminStats();
  const { data: orders = [], isLoading: ordersLoading } = useAdminOrders();

  const online = orders.filter((o) => o.source !== "pos");
  const pending = online.filter((o) => o.orderStatus === "pending");
  const toShip = online.filter((o) => o.orderStatus === "processing");
  const posToday = orders.filter((o) => o.source === "pos" && isToday(o.orderDate || o.createdAt));
  const posTotal = posToday.reduce((s, o) => s + o.total, 0);

  return (
    <div className="space-y-6">
      <OverviewHeader user={user} description="Counter sales and the orders waiting for you." />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard loading={isLoading} label="Paid today" value={formatTaka(stats?.revenue?.today)} hint={`${stats?.orders?.today || 0} orders today`} icon={Banknote} tone="brand" />
        <StatCard loading={ordersLoading} label="Counter sales today" value={posToday.length} hint={formatTaka(posTotal)} icon={ScanBarcode} tone="sky" href="/dashboard/pos" />
        <StatCard loading={ordersLoading} label="To confirm" value={pending.length} hint={`${pending.filter(isGuestOrder).length} from guests`} icon={ClipboardCheck} tone="amber" href="/dashboard/orders?status=pending" />
        <StatCard loading={ordersLoading} label="Ready to ship" value={toShip.length} hint="Accepted, waiting for a courier" icon={Truck} tone="violet" href="/dashboard/orders?status=processing" />
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <RecentOrdersPanel
          className="xl:col-span-2"
          title="Waiting for confirmation"
          description="Call the customer, then accept, edit or cancel"
          orders={pending.slice(0, 8)}
          loading={ordersLoading}
          viewAllHref="/dashboard/orders?status=pending"
        />
        <Panel title="Counter" description="Sell to walk-in customers">
          <div className="rounded-2xl bg-gradient-to-br from-gray-900 to-gray-800 p-5 text-white">
            <p className="text-sm text-gray-300">Today at the counter</p>
            <p className="mt-1 text-3xl font-bold tracking-tight">{formatTaka(posTotal)}</p>
            <p className="mt-1 text-xs text-gray-400">{posToday.length} sale{posToday.length === 1 ? "" : "s"}</p>
            <Link href="/dashboard/pos" className={buttonClass("brand", "md", "mt-5 w-full justify-center")}>
              <ScanBarcode className="h-4 w-4" /> Start a new sale
            </Link>
          </div>
          <Link href="/dashboard/orders?status=processing" className="mt-4 flex items-center justify-between rounded-xl border border-gray-100 p-3.5 text-sm font-medium text-gray-700 hover:bg-gray-50">
            <span className="flex items-center gap-2">
              <ReceiptText className="h-4 w-4 text-gray-400" /> {toShip.length} order{toShip.length === 1 ? "" : "s"} ready for a courier
            </span>
            <ArrowRight className="h-4 w-4 text-gray-300" />
          </Link>
        </Panel>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <RecentOrdersPanel className="xl:col-span-2" title="Ready to ship" orders={toShip.slice(0, 6)} loading={ordersLoading} viewAllHref="/dashboard/orders?status=processing" />
        <TopCustomersPanel />
      </div>
    </div>
  );
}
