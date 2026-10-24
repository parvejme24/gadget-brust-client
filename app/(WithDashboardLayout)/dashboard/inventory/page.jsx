"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { AlertTriangle, ArrowDownRight, Boxes, History, PackageX, SlidersHorizontal, Wallet } from "lucide-react";
import { useAdminCategories, useAdminProducts, useInventorySummary, useStockMovements } from "@/lib/hooks/useAdmin";
import { Button, PageHeader, Pagination, Panel, SearchInput, StatCard, buttonClass, cx, formatCompact, formatTaka, stockStatus } from "@/components/Dashboard/Kit";
import { DropdownSelect } from "@/components/ui/dropdown-select";
import { TYPES } from "@/components/Dashboard/Inventory/stockTypes";
import AdjustStockModal from "@/components/Dashboard/Inventory/AdjustStockModal";
import StockLevelsTable from "@/components/Dashboard/Inventory/StockLevelsTable";
import StockHistoryTable from "@/components/Dashboard/Inventory/StockHistoryTable";

function InventoryView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [tab, setTab] = useState("levels");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [level, setLevel] = useState("");
  // { product } for one product, { product: null } to pick one first
  const [adjusting, setAdjusting] = useState(null);
  const [historyProduct, setHistoryProduct] = useState("");
  const [historyType, setHistoryType] = useState("");
  const [historyPage, setHistoryPage] = useState(1);

  const { data: summary, isLoading: summaryLoading } = useInventorySummary();
  const { data: catalog, isLoading } = useAdminProducts({ limit: 1000, sortBy: "stock", sortOrder: "asc" });
  const { data: categories = [] } = useAdminCategories();
  const { data: history, isLoading: historyLoading } = useStockMovements({ page: historyPage, limit: 20, ...(historyProduct && { product: historyProduct }), ...(historyType && { type: historyType }) });
  const threshold = summary?.lowStockThreshold ?? 10;
  const products = catalog?.products || [];

  // ?adjust=1 (quick action) opens the adjust dialog; ?product=ID (stock alerts) opens it for that product
  const wantAdjust = searchParams.get("adjust");
  const wantProduct = searchParams.get("product");
  useEffect(() => {
    if (wantAdjust) setAdjusting({ product: null });
  }, [wantAdjust]);
  useEffect(() => {
    const found = wantProduct && products.find((p) => p._id === wantProduct);
    if (found) setAdjusting({ product: found });
  }, [wantProduct, products]);

  const closeAdjust = () => {
    setAdjusting(null);
    if (wantAdjust || wantProduct) router.replace("/dashboard/inventory", { scroll: false });
  };

  const rows = useMemo(() => {
    const q = search.trim().toLowerCase();
    return products.filter(
      (p) =>
        (!category || (p.category?._id || p.category) === category) &&
        (!level || stockStatus(p.stock, threshold) === level) &&
        (!q || `${p.title} ${p.brand?.brandName || ""}`.toLowerCase().includes(q))
    );
  }, [products, search, category, level, threshold]);

  const flow = Object.fromEntries((summary?.last30Days || []).map((f) => [f._id, f]));
  const showHistoryFor = (p) => {
    setHistoryProduct(p._id);
    setHistoryPage(1);
    setTab("history");
  };

  return (
    <>
      <PageHeader
        title="Inventory"
        description="Stock on hand, adjustments and a full history of every change."
        actions={
          <>
            <Link href="/dashboard/pos" className={buttonClass("secondary")}><ArrowDownRight className="h-4 w-4" /> Sell at counter</Link>
            <Button onClick={() => setAdjusting({ product: null })}><SlidersHorizontal className="h-4 w-4" /> Adjust stock</Button>
          </>
        }
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard loading={summaryLoading} label="Units in stock" value={(summary?.units || 0).toLocaleString("en-IN")} icon={Boxes} tone="brand" hint={`${summary?.products || 0} products`} />
        <StatCard loading={summaryLoading} label="Stock value (retail)" value={formatCompact(summary?.retailValue)} icon={Wallet} tone="sky" hint={formatTaka(summary?.retailValue)} />
        <StatCard loading={summaryLoading} label="Low stock" value={summary?.lowStock || 0} icon={AlertTriangle} tone="amber" hint={`${threshold} or fewer units`} />
        <StatCard loading={summaryLoading} label="Out of stock" value={summary?.outOfStock || 0} icon={PackageX} tone="red" hint={`Last 30 days: +${flow.restock?.units || 0} restocked`} />
      </div>

      <div className="mb-4 flex gap-1" role="tablist" aria-label="Inventory views">
        {[
          ["levels", "Stock levels", SlidersHorizontal],
          ["history", "History", History],
        ].map(([key, label, Icon]) => (
          <button
            key={key}
            role="tab"
            aria-selected={tab === key}
            onClick={() => setTab(key)}
            className={cx("flex items-center gap-2 rounded-xl px-3.5 py-2 text-sm font-semibold transition", tab === key ? "bg-gray-900 text-white" : "text-gray-600 hover:bg-gray-100")}
          >
            <Icon className="h-4 w-4" /> {label}
          </button>
        ))}
      </div>

      {tab === "levels" ? (
        <Panel bodyClassName="">
          <div className="grid gap-3 border-b border-gray-100 p-4 sm:grid-cols-2 lg:grid-cols-4">
            <SearchInput value={search} onChange={setSearch} placeholder="Search product or brand…" className="sm:col-span-2" />
            <DropdownSelect label="Category" value={category} onChange={setCategory} options={[{ value: "", label: "All categories" }, ...categories.map((c) => ({ value: c._id, label: c.categoryName }))]} />
            <DropdownSelect label="Stock level" value={level} onChange={setLevel} options={[{ value: "", label: "Any level" }, { value: "low-stock", label: "Low stock" }, { value: "out-of-stock", label: "Out of stock" }, { value: "in-stock", label: "Healthy" }]} />
          </div>
          <StockLevelsTable rows={rows} loading={isLoading} threshold={threshold} onAdjust={(p) => setAdjusting({ product: p })} onHistory={showHistoryFor} />
        </Panel>
      ) : (
        <Panel bodyClassName="">
          <div className="grid gap-3 border-b border-gray-100 p-4 sm:grid-cols-2 lg:grid-cols-3">
            <DropdownSelect
              label="Product"
              value={historyProduct}
              onChange={(v) => {
                setHistoryProduct(v);
                setHistoryPage(1);
              }}
              options={[{ value: "", label: "All products" }, ...products.map((p) => ({ value: p._id, label: p.title }))]}
            />
            <DropdownSelect
              label="Change type"
              value={historyType}
              onChange={(v) => {
                setHistoryType(v);
                setHistoryPage(1);
              }}
              options={[{ value: "", label: "All changes" }, ...Object.entries(TYPES).map(([value, t]) => ({ value, label: t.label }))]}
            />
          </div>
          <StockHistoryTable rows={history?.movements || []} loading={historyLoading} />
          <Pagination page={historyPage} totalPages={history?.pages} total={history?.total} pageSize={20} onChange={setHistoryPage} />
        </Panel>
      )}

      <AdjustStockModal key={adjusting?.product?._id || (adjusting ? "pick" : "closed")} open={!!adjusting} product={adjusting?.product} onClose={closeAdjust} />
    </>
  );
}

export default function InventoryPage() {
  return (
    <Suspense fallback={null}>
      <InventoryView />
    </Suspense>
  );
}
