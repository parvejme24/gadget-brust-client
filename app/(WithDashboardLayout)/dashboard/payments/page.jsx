"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Banknote, CheckCircle2, CreditCard, Download, Percent, XCircle } from "lucide-react";
import { useAdminPayments, useAdminPaymentStats } from "@/lib/hooks/useAdmin";
import {
  BarList,
  DataTable,
  EmptyState,
  ErrorState,
  PageHeader,
  Pagination,
  Panel,
  SearchInput,
  StatCard,
  StatusPill,
  buttonClass,
  formatCompact,
  formatDate,
  formatTaka,
  inputClass,
  paymentLabels,
} from "@/components/Dashboard/Kit";
import { DropdownSelect } from "@/components/ui/dropdown-select";

const PAGE_SIZE = 12;

export default function PaymentsPage() {
  const router = useRouter();
  const { data: payments = [], isLoading, isError, error, refetch } = useAdminPayments();
  const { data: stats, isLoading: statsLoading } = useAdminPaymentStats();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [method, setMethod] = useState("");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return payments.filter(
      (p) =>
        (!status || p.status === status) &&
        (!method || p.payment_method === method) &&
        (!q || [p.transaction_id, p.invoice_id?.invoiceNumber, p.user_id?.fullName, p.user_id?.email].some((v) => v?.toLowerCase().includes(q)))
    );
  }, [payments, search, status, method]);

  const completed = stats?.status_breakdown?.find((s) => s._id === "completed");
  const failed = stats?.status_breakdown?.find((s) => s._id === "failed");
  const successRate = stats?.total_payments ? Math.round(((completed?.count || 0) / stats.total_payments) * 100) : 0;

  const exportCSV = () => {
    const csv = [
      ["Transaction", "Order", "Customer", "Method", "Amount", "Status", "Date"],
      ...filtered.map((p) => [p.transaction_id, p.invoice_id?.invoiceNumber, p.user_id?.fullName, paymentLabels[p.payment_method], p.amount, p.status, formatDate(p.payment_date || p.createdAt)]),
    ]
      .map((r) => r.map((v) => `"${String(v ?? "").replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    a.download = `payments-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  return (
    <>
      <PageHeader
        title="Payments"
        description="Every transaction across your payment gateways."
        actions={<button onClick={exportCSV} disabled={!filtered.length} className={buttonClass("secondary")}><Download className="h-4 w-4" /> Export CSV</button>}
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard loading={statsLoading} label="Collected" value={formatTaka(stats?.total_completed_amount)} icon={Banknote} tone="brand" hint={`${completed?.count || 0} successful payments`} />
        <StatCard loading={statsLoading} label="Success rate" value={`${successRate}%`} icon={Percent} tone="sky" hint={`${stats?.total_payments || 0} attempts`} />
        <StatCard loading={statsLoading} label="Failed" value={failed?.count || 0} icon={XCircle} tone="red" hint={formatTaka(failed?.total_amount)} />
        <StatCard loading={statsLoading} label="Average payment" value={formatTaka(completed?.count ? stats.total_completed_amount / completed.count : 0)} icon={CheckCircle2} tone="violet" />
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <Panel title="By method" description="Successful payment volume">
          <BarList items={(stats?.payment_methods || []).map((m) => ({ label: paymentLabels[m._id] || m._id, value: m.total_amount }))} valueFormat={formatCompact} emptyText="No payments yet" />
        </Panel>

        <Panel className="xl:col-span-2" bodyClassName="">
          <div className="grid gap-3 border-b border-gray-100 p-4 sm:grid-cols-3">
            <SearchInput value={search} onChange={(v) => { setSearch(v); setPage(1); }} placeholder="Transaction, order or customer…" />
            <DropdownSelect label="Payment status" value={status} onChange={(v) => { setStatus(v); setPage(1); }} options={[{ value: "", label: "Any status" }, { value: "completed", label: "Paid" }, { value: "pending", label: "Pending" }, { value: "failed", label: "Failed" }, { value: "refunded", label: "Refunded" }]} />
            <DropdownSelect label="Payment method" value={method} onChange={(v) => { setMethod(v); setPage(1); }} options={[{ value: "", label: "Any method" }, ...Object.entries(paymentLabels).map(([value, label]) => ({ value, label }))]} />
          </div>
          {isError ? (
            <ErrorState error={error} onRetry={refetch} />
          ) : (
            <DataTable
              loading={isLoading}
              rows={filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)}
              onRowClick={(p) => p.invoice_id?._id && router.push(`/dashboard/orders/${p.invoice_id._id}`)}
              empty={<EmptyState icon={CreditCard} title="No payments found" />}
              columns={[
                {
                  key: "tx",
                  header: "Transaction",
                  render: (p) => (
                    <div>
                      <p className="font-mono text-xs font-semibold text-gray-900">{p.transaction_id || "—"}</p>
                      <p className="text-xs text-gray-500">{p.invoice_id?.invoiceNumber}</p>
                    </div>
                  ),
                },
                { key: "customer", header: "Customer", hideBelow: "md", render: (p) => p.user_id?.fullName || (p.metadata?.source === "pos" ? "Counter sale" : "—") },
                { key: "method", header: "Method", hideBelow: "lg", render: (p) => paymentLabels[p.payment_method] || p.payment_method },
                { key: "date", header: "Date", hideBelow: "sm", render: (p) => <span className="whitespace-nowrap">{formatDate(p.payment_date || p.createdAt)}</span> },
                { key: "status", header: "Status", render: (p) => <StatusPill status={p.status} /> },
                { key: "amount", header: "Amount", className: "text-right font-semibold text-gray-900 whitespace-nowrap", headerClassName: "text-right", render: (p) => formatTaka(p.amount) },
              ]}
            />
          )}
          <Pagination page={page} totalPages={Math.ceil(filtered.length / PAGE_SIZE)} total={filtered.length} pageSize={PAGE_SIZE} onChange={setPage} />
        </Panel>
      </div>
    </>
  );
}
