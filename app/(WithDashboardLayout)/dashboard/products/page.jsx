"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowUpDown, Download, Plus } from "lucide-react";
import { adminService } from "@/lib/services/adminService";
import { useAdminBrands, useAdminCategories, useAdminMutation, useAdminProducts } from "@/lib/hooks/useAdmin";
import { ConfirmDialog, ErrorState, PageHeader, Pagination, Panel, SearchInput, ViewToggle, buttonClass, useViewMode } from "@/components/Dashboard/Kit";
import { DropdownSelect } from "@/components/ui/dropdown-select";
import ProductCards from "@/components/Dashboard/Products/ProductCards";
import ProductsTable from "@/components/Dashboard/Products/ProductsTable";
import { productsToCSV, sorts } from "@/components/Dashboard/Products/productList";

const PAGE_SIZE = 12;

function ProductsView() {
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("q") || "");
  const [debounced, setDebounced] = useState(search);
  const [category, setCategory] = useState(searchParams.get("category") || "");
  const [brand, setBrand] = useState(searchParams.get("brand") || "");
  const [stock, setStock] = useState(searchParams.get("stock") || "");
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);
  const [toDelete, setToDelete] = useState(null);
  const [exporting, setExporting] = useState(false);
  const [view, setView] = useViewMode("products", "table");

  // topbar search and links from other pages arrive as URL params
  useEffect(() => {
    setSearch(searchParams.get("q") || "");
    setCategory(searchParams.get("category") || "");
    setBrand(searchParams.get("brand") || "");
    setStock(searchParams.get("stock") || "");
  }, [searchParams]);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(search.trim()), 300);
    return () => clearTimeout(t);
  }, [search]);
  useEffect(() => setPage(1), [debounced, category, brand, stock, sort]);

  const params = {
    page,
    limit: PAGE_SIZE,
    sortBy: sorts[sort].sortBy,
    sortOrder: sorts[sort].sortOrder,
    ...(debounced && { search: debounced }),
    ...(category && { category }),
    ...(brand && { brand }),
    ...(stock && { stockLevel: stock }),
  };
  const { data, isLoading, isError, error, refetch } = useAdminProducts(params);
  const { data: categories = [] } = useAdminCategories();
  const { data: brands = [] } = useAdminBrands();
  const products = data?.products || [];
  const pagination = data?.pagination;

  const deleteMutation = useAdminMutation((id) => adminService.deleteProduct(id), {
    success: "Product deleted",
    onSuccess: () => setToDelete(null),
  });
  const featureMutation = useAdminMutation(({ id, isSlider }) => adminService.updateProduct(id, { isSlider }), {
    success: (_, v) => (v.isSlider ? "Added to the home page slider" : "Removed from the slider"),
  });

  const exportCSV = async () => {
    setExporting(true);
    try {
      const all = await adminService.products({ ...params, page: 1, limit: 1000 });
      const blob = new Blob([productsToCSV(all?.products || [])], { type: "text/csv" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = `products-${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      URL.revokeObjectURL(a.href);
    } finally {
      setExporting(false);
    }
  };

  const filtersActive = debounced || category || brand || stock;
  const toggleSlider = (p, isSlider) => featureMutation.mutate({ id: p._id, isSlider });

  return (
    <>
      <PageHeader
        title="Products"
        description={pagination ? `${pagination.totalProducts} products in your catalog` : "Manage your catalog"}
        actions={
          <>
            <ViewToggle value={view} onChange={setView} />
            <button onClick={exportCSV} disabled={exporting} className={buttonClass("secondary")}>
              <Download className="h-4 w-4" /> Export CSV
            </button>
            <Link href="/dashboard/products/add" className={buttonClass("primary")}>
              <Plus className="h-4 w-4" /> Add product
            </Link>
          </>
        }
      />

      <Panel bodyClassName="">
        <div className="grid gap-3 border-b border-gray-100 p-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          <SearchInput value={search} onChange={setSearch} placeholder="Search products…" className="sm:col-span-2 lg:col-span-3 xl:col-span-2" />
          <DropdownSelect label="Filter by category" value={category} onChange={setCategory} options={[{ value: "", label: "All categories" }, ...categories.map((c) => ({ value: c._id, label: c.categoryName }))]} />
          <DropdownSelect label="Filter by brand" value={brand} onChange={setBrand} options={[{ value: "", label: "All brands" }, ...brands.map((b) => ({ value: b._id, label: b.brandName }))]} />
          <DropdownSelect label="Filter by stock" value={stock} onChange={setStock} options={[{ value: "", label: "Any stock" }, { value: "in", label: "In stock" }, { value: "low", label: "Low stock" }, { value: "out", label: "Out of stock" }]} />
          <DropdownSelect label="Sort products" icon={ArrowUpDown} value={sort} onChange={setSort} align="end" options={Object.entries(sorts).map(([value, s]) => ({ value, label: s.label }))} />
        </div>

        {isError ? (
          <ErrorState error={error} onRetry={refetch} />
        ) : view === "grid" ? (
          <ProductCards products={products} loading={isLoading} filtersActive={filtersActive} onDelete={setToDelete} onToggleSlider={toggleSlider} sliderBusy={featureMutation.isPending} />
        ) : (
          <ProductsTable products={products} loading={isLoading} filtersActive={filtersActive} onDelete={setToDelete} onToggleSlider={toggleSlider} sliderBusy={featureMutation.isPending} />
        )}
        <Pagination page={page} totalPages={pagination?.totalPages} total={pagination?.totalProducts} pageSize={PAGE_SIZE} onChange={setPage} />
      </Panel>

      <ConfirmDialog
        open={!!toDelete}
        onClose={() => setToDelete(null)}
        onConfirm={() => deleteMutation.mutate(toDelete._id)}
        loading={deleteMutation.isPending}
        title="Delete product?"
        message={`"${toDelete?.title}" will be removed from your store. This can't be undone.`}
      />
    </>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={null}>
      <ProductsView />
    </Suspense>
  );
}
