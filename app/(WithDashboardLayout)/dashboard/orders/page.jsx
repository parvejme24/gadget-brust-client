"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ClipboardPlus, Download } from "lucide-react";
import { useAdminCouriers, useAdminOrders } from "@/lib/hooks/useAdmin";
import { ErrorState, PageHeader, Pagination, Panel, buttonClass, customerName, cx, formatTaka, isGuestOrder } from "@/components/Dashboard/Kit";
import { parseDateValue } from "@/components/ui/date-range-picker";
import OrderFilters from "@/components/Dashboard/Orders/OrderFilters";
import OrdersTable from "@/components/Dashboard/Orders/OrdersTable";
import { downloadCSV, ordersToCSV } from "@/components/Dashboard/Orders/ordersCsv";

const PAGE_SIZE = 12;
const statusTabs = ["all", "pending", "processing", "shipped", "delivered", "cancelled"];
const tabLabel = { processing: "accepted" };
const emptyFilters = { search: "", source: "", payment: "", method: "", courier: "", from: "", to: "" };

const matchesSource = (o, source) =>
  !source || (source === "pos" ? o.source === "pos" : source === "guest" ? isGuestOrder(o) : o.source !== "pos" && !!o.user_id);

function OrdersView() {
  const searchParams = useSearchParams();
  const { data: orders = [], isLoading, isError, error, refetch } = useAdminOrders();
  const { data: couriers = [] } = useAdminCouriers();
  const [tab, setTab] = useState(searchParams.get("status") || "all");
  const [filters, setFilters] = useState({ ...emptyFilters, courier: searchParams.get("courier") || "", source: searchParams.get("source") || "" });
  const [page, setPage] = useState(1);

  // links from other pages (sidebar badge, overview, notifications) arrive as URL params
  useEffect(() => {
    setTab(searchParams.get("status") || "all");
    setFilters((f) => ({ ...f, courier: searchParams.get("courier") || "", source: searchParams.get("source") || "" }));
  }, [searchParams]);
  useEffect(() => setPage(1), [tab, filters]);

  const counts = useMemo(() => {
    const c = { all: 0 };
    orders.filter((o) => matchesSource(o, filters.source)).forEach((o) => {
      c.all += 1;
      c[o.orderStatus] = (c[o.orderStatus] || 0) + 1;
    });
    return c;
  }, [orders, filters.source]);

  const filtered = useMemo(() => {
    const { search, source, payment, method, courier, from, to } = filters;
    const q = search.trim().toLowerCase();
    const fromTime = from ? parseDateValue(from).getTime() : null;
    const toTime = to ? parseDateValue(to).getTime() + 86400000 : null;
    return orders.filter((o) => {
      if (tab !== "all" && o.orderStatus !== tab) return false;
      if (!matchesSource(o, source)) return false;
      if (payment && o.paymentStatus !== payment) return false;
      if (method && o.paymentMethod !== method) return false;
      if (courier && (o.shipment?.courier?._id || o.shipment?.courier) !== courier) return false;
      const t = new Date(o.orderDate).getTime();
      if (fromTime && t < fromTime) return false;
      if (toTime && t >= toTime) return false;
      if (q && ![o.invoiceNumber, customerName(o), o.user_id?.email, o.customer?.email, o.phone, o.shipment?.trackingNumber].some((v) => v?.toLowerCase().includes(q))) return false;
      return true;
    });
  }, [orders, tab, filters]);

  const rows = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const filteredTotal = filtered.filter((o) => o.orderStatus !== "cancelled").reduce((s, o) => s + o.total, 0);

  return (
    <>
      <PageHeader
        title="Orders"
        description={`${filtered.length} orders · ${formatTaka(filteredTotal)} in value (excluding cancelled)`}
        actions={
          <>
            <button onClick={() => downloadCSV(ordersToCSV(filtered), "orders")} disabled={!filtered.length} className={buttonClass("secondary")}>
              <Download className="h-4 w-4" /> Export CSV
            </button>
            <Link href="/dashboard/orders/new" className={buttonClass("primary")}>
              <ClipboardPlus className="h-4 w-4" /> New order
            </Link>
          </>
        }
      />

      <div className="no-scrollbar -mx-4 mb-4 flex gap-1 overflow-x-auto px-4 sm:mx-0 sm:px-0" role="tablist" aria-label="Order status">
        {statusTabs.map((status) => (
          <button
            key={status}
            role="tab"
            aria-selected={tab === status}
            onClick={() => setTab(status)}
            className={cx(
              "flex shrink-0 items-center gap-2 rounded-xl px-3.5 py-2 text-sm font-semibold capitalize transition",
              tab === status ? "bg-gray-900 text-white" : "text-gray-600 hover:bg-gray-100"
            )}
          >
            {tabLabel[status] || status}
            <span className={cx("rounded-md px-1.5 text-xs", tab === status ? "bg-white/15" : "bg-gray-100 text-gray-500")}>{counts[status] || 0}</span>
          </button>
        ))}
      </div>

      <Panel bodyClassName="">
        <OrderFilters filters={filters} onChange={setFilters} couriers={couriers} />
        {isError ? <ErrorState error={error} onRetry={refetch} /> : <OrdersTable rows={rows} loading={isLoading} />}
        <Pagination page={page} totalPages={Math.ceil(filtered.length / PAGE_SIZE)} total={filtered.length} pageSize={PAGE_SIZE} onChange={setPage} />
      </Panel>
    </>
  );
}

export default function OrdersPage() {
  return (
    <Suspense fallback={null}>
      <OrdersView />
    </Suspense>
  );
}
