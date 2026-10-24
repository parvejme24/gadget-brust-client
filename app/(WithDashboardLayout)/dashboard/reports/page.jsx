"use client";

import { useMemo, useState } from "react";
import { Banknote, Download, Package, Printer, ReceiptText, ShoppingBag, XCircle } from "lucide-react";
import { useAdminCategories, useAdminOrders, useAdminProducts } from "@/lib/hooks/useAdmin";
import { MonthlyBarChart } from "@/components/Dashboard/Kit/Charts";
import { DateRangePicker, parseDateValue } from "@/components/ui/date-range-picker";
import {
  BarList,
  PageHeader,
  Panel,
  StatCard,
  buttonClass,
  cx,
  formatCompact,
  formatTaka,
  paymentLabels,
  customerName,
} from "@/components/Dashboard/Kit";

const DAY = 86400000;
const presets = [
  { key: "7d", label: "7 days", days: 7 },
  { key: "30d", label: "30 days", days: 30 },
  { key: "90d", label: "90 days", days: 90 },
  { key: "12m", label: "12 months", days: 365 },
  { key: "all", label: "All time", days: null },
];

const dayKey = (d) => new Date(d).toISOString().slice(0, 10);
const monthKey = (d) => new Date(d).toISOString().slice(0, 7);

export default function ReportsPage() {
  const { data: orders = [], isLoading } = useAdminOrders();
  const { data: catalog } = useAdminProducts({ limit: 1000 });
  const { data: categories = [] } = useAdminCategories();
  const [preset, setPreset] = useState("90d");
  const [custom, setCustom] = useState({ from: "", to: "" });

  const range = useMemo(() => {
    if (custom.from || custom.to) {
      return { from: custom.from ? parseDateValue(custom.from).getTime() : 0, to: custom.to ? parseDateValue(custom.to).getTime() + DAY : Date.now() + DAY };
    }
    const p = presets.find((x) => x.key === preset);
    return { from: p.days ? Date.now() - p.days * DAY : 0, to: Date.now() + DAY };
  }, [preset, custom]);

  const report = useMemo(() => {
    const inRange = orders.filter((o) => {
      const t = new Date(o.orderDate).getTime();
      return t >= range.from && t < range.to;
    });
    const cancelled = inRange.filter((o) => o.orderStatus === "cancelled");
    const paid = inRange.filter((o) => o.orderStatus !== "cancelled" && o.paymentStatus === "completed");
    const revenue = paid.reduce((s, o) => s + o.total, 0);

    const productCategory = Object.fromEntries((catalog?.products || []).map((p) => [p._id, p.category?._id || p.category]));
    const categoryName = (id) => categories.find((c) => c._id === id)?.categoryName || "Other";

    const byProduct = {};
    const byCategory = {};
    const byCustomer = {};
    const byMethod = {};
    let units = 0;
    paid.forEach((o) => {
      (o.items || []).forEach((item) => {
        const id = item.product?._id || item.product;
        const lineTotal = item.price * item.qty;
        units += item.qty;
        (byProduct[id] ||= { label: item.title, value: 0, units: 0 }).value += lineTotal;
        byProduct[id].units += item.qty;
        const cat = categoryName(productCategory[id]);
        byCategory[cat] = (byCategory[cat] || 0) + lineTotal;
      });
      const name = customerName(o);
      byCustomer[name] = (byCustomer[name] || 0) + o.total;
      const method = paymentLabels[o.paymentMethod] || o.paymentMethod;
      byMethod[method] = (byMethod[method] || 0) + o.total;
    });

    // daily buckets for short ranges, monthly otherwise
    const spanDays = (range.to - Math.max(range.from, paid.length ? Math.min(...paid.map((o) => new Date(o.orderDate).getTime())) : range.to)) / DAY;
    const daily = spanDays <= 92;
    const buckets = {};
    paid.forEach((o) => {
      const key = daily ? dayKey(o.orderDate) : monthKey(o.orderDate);
      buckets[key] = (buckets[key] || 0) + o.total;
    });
    const series = Object.entries(buckets)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, value]) => ({
        _id: key,
        label: daily ? new Date(key).toLocaleDateString("en-GB", { day: "numeric", month: "short" }) : undefined,
        value,
      }));

    const toList = (obj) => Object.entries(obj).map(([label, value]) => ({ label, value })).sort((a, b) => b.value - a.value);

    return {
      orders: inRange.length,
      paid: paid.length,
      revenue,
      aov: paid.length ? revenue / paid.length : 0,
      units,
      cancelRate: inRange.length ? Math.round((cancelled.length / inRange.length) * 100) : 0,
      series,
      daily,
      topProducts: Object.values(byProduct).sort((a, b) => b.value - a.value).slice(0, 8),
      categories: toList(byCategory).slice(0, 8),
      customers: toList(byCustomer).slice(0, 6),
      methods: toList(byMethod),
    };
  }, [orders, catalog, categories, range]);

  const exportCSV = () => {
    const lines = [
      ["Metric", "Value"],
      ["Revenue", report.revenue],
      ["Orders", report.orders],
      ["Paid orders", report.paid],
      ["Average order value", Math.round(report.aov)],
      ["Units sold", report.units],
      ["Cancellation rate %", report.cancelRate],
      [],
      [report.daily ? "Day" : "Month", "Revenue"],
      ...report.series.map((p) => [p._id, p.value]),
      [],
      ["Product", "Units", "Revenue"],
      ...report.topProducts.map((p) => [p.label, p.units, p.value]),
    ];
    const csv = lines.map((r) => r.map((v) => `"${String(v ?? "").replace(/"/g, '""')}"`).join(",")).join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    a.download = `sales-report-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  return (
    <>
      <PageHeader
        title="Reports"
        description="Sales performance for the selected period. Revenue counts paid, non-cancelled orders."
        actions={
          <div className="flex gap-2 print:hidden">
            <button onClick={() => window.print()} className={buttonClass("secondary")}><Printer className="h-4 w-4" /> Print</button>
            <button onClick={exportCSV} className={buttonClass("primary")}><Download className="h-4 w-4" /> Export CSV</button>
          </div>
        }
      />

      <div className="mb-6 flex flex-col gap-3 lg:flex-row lg:items-center print:hidden">
        <div className="no-scrollbar flex gap-1 overflow-x-auto rounded-xl bg-gray-100 p-1" role="tablist" aria-label="Report period">
          {presets.map((p) => (
            <button
              key={p.key}
              role="tab"
              aria-selected={preset === p.key && !custom.from && !custom.to}
              onClick={() => { setPreset(p.key); setCustom({ from: "", to: "" }); }}
              className={cx(
                "shrink-0 rounded-lg px-3.5 py-1.5 text-sm font-semibold transition",
                preset === p.key && !custom.from && !custom.to ? "bg-surface text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-800"
              )}
            >
              {p.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span className="shrink-0">or</span>
          <DateRangePicker label="Custom report period" placeholder="Custom range" value={custom} onChange={setCustom} className="sm:w-72" />
        </div>
      </div>

      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard loading={isLoading} label="Revenue" value={formatTaka(report.revenue)} icon={Banknote} tone="brand" />
        <StatCard loading={isLoading} label="Orders" value={report.orders} hint={`${report.paid} paid`} icon={ReceiptText} tone="sky" />
        <StatCard loading={isLoading} label="Avg. order value" value={formatTaka(report.aov)} icon={ShoppingBag} tone="violet" />
        <StatCard loading={isLoading} label="Units sold" value={report.units} icon={Package} tone="amber" />
        <StatCard loading={isLoading} label="Cancellation rate" value={`${report.cancelRate}%`} icon={XCircle} tone="red" />
      </div>

      <Panel title="Revenue over time" description={report.daily ? "Per day" : "Per month"} className="mb-6">
        <MonthlyBarChart points={report.series} valueLabel="Revenue" height={300} />
      </Panel>

      <div className="grid gap-6 lg:grid-cols-2">
        <Panel title="Top products" description="By revenue">
          <BarList items={report.topProducts} valueFormat={formatCompact} emptyText="No sales in this period" />
        </Panel>
        <Panel title="Revenue by category">
          <BarList items={report.categories} valueFormat={formatCompact} emptyText="No sales in this period" />
        </Panel>
        <Panel title="Top customers">
          <BarList items={report.customers} valueFormat={formatCompact} emptyText="No sales in this period" />
        </Panel>
        <Panel title="Payment methods">
          <BarList items={report.methods} valueFormat={formatCompact} emptyText="No sales in this period" />
        </Panel>
      </div>
    </>
  );
}
