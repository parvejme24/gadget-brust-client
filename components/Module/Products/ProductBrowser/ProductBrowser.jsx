"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { keepPreviousData } from "@tanstack/react-query";
import { ArrowUpDown, ChevronLeft, ChevronRight, PackageSearch, Search, SlidersHorizontal, X } from "lucide-react";
import { useAllProducts } from "@/lib/hooks/useStorefront";
import { useAllCategories } from "@/lib/hooks/useStorefront";
import { useAllBrands } from "@/lib/hooks/useStorefront";
import ProductTile, { ProductTileSkeleton } from "@/components/Module/Home/ProductTile/ProductTile";
import { formatTaka } from "@/lib/format";
import FilterPanel from "./FilterPanel";
import { DropdownSelect } from "@/components/ui/dropdown-select";
import { useMounted } from "@/lib/hooks/useMounted";

const PAGE_SIZE = 12;
const FILTER_KEYS = ["q", "category", "subcategory", "brand", "minPrice", "maxPrice", "inStock", "sort", "page"];

const sortOptions = [
  { value: "newest", label: "Newest first", sortBy: "createdAt", sortOrder: "desc" },
  { value: "price-asc", label: "Price: Low to High", sortBy: "price", sortOrder: "asc" },
  { value: "price-desc", label: "Price: High to Low", sortBy: "price", sortOrder: "desc" },
  { value: "rating", label: "Top rated", sortBy: "star", sortOrder: "desc" },
  { value: "discount", label: "Biggest discount", sortBy: "discount", sortOrder: "desc" },
];

// compact page list like 1 … 4 5 6 … 12
const pageList = (current, total) => {
  const pages = new Set([1, total, current - 1, current, current + 1]);
  const sorted = [...pages].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b);
  return sorted.flatMap((p, i) => (i > 0 && p - sorted[i - 1] > 1 ? ["…", p] : [p]));
};

export default function ProductBrowser() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const filters = useMemo(
    () => Object.fromEntries(FILTER_KEYS.map((key) => [key, searchParams.get(key) || ""])),
    [searchParams]
  );
  const [searchDraft, setSearchDraft] = useState(filters.q);

  // filters live in the URL so links like /products?category=… work and pages are shareable
  const setFilters = (updates) => {
    const next = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => (value ? next.set(key, value) : next.delete(key)));
    if (!("page" in updates)) next.delete("page");
    const query = next.toString();
    router.push(query ? `${pathname}?${query}` : pathname, { scroll: false });
  };

  // debounce typing into the search box
  useEffect(() => {
    if (searchDraft === filters.q) return;
    const timer = setTimeout(() => setFilters({ q: searchDraft.trim() }), 400);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchDraft]);

  useEffect(() => setSearchDraft(filters.q), [filters.q]);

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => (document.body.style.overflow = "");
  }, [drawerOpen]);

  const sort = sortOptions.find((s) => s.value === filters.sort) || sortOptions[0];
  const page = Math.max(1, parseInt(filters.page) || 1);

  const queryParams = {
    page,
    limit: PAGE_SIZE,
    sortBy: sort.sortBy,
    sortOrder: sort.sortOrder,
    ...(filters.q && { search: filters.q }),
    ...(filters.category && { category: filters.category }),
    ...(filters.subcategory && { subcategory: filters.subcategory }),
    ...(filters.brand && { brand: filters.brand }),
    ...(filters.minPrice && { minPrice: filters.minPrice }),
    ...(filters.maxPrice && { maxPrice: filters.maxPrice }),
    ...(filters.inStock && { inStock: filters.inStock }),
  };

  const { data, isLoading, isFetching, isError } = useAllProducts(queryParams, { placeholderData: keepPreviousData });
  const { data: categoriesData } = useAllCategories();
  // the header may fill the categories cache before this Suspense boundary hydrates
  const mounted = useMounted();
  const { data: brandsData } = useAllBrands();

  const products = data?.data || [];
  const pagination = data?.pagination;
  const categories = mounted ? categoriesData?.data || [] : [];
  const brands = mounted ? brandsData?.data || [] : [];

  const selectedCategory = categories.find((c) => c._id === filters.category);
  const selectedBrand = brands.find((b) => b._id === filters.brand);

  const activeChips = [
    filters.q && { key: "q", label: `"${filters.q}"`, clear: { q: "" } },
    selectedCategory && { key: "category", label: selectedCategory.categoryName, clear: { category: "", subcategory: "" } },
    filters.subcategory && { key: "subcategory", label: filters.subcategory, clear: { subcategory: "" } },
    selectedBrand && { key: "brand", label: selectedBrand.brandName, clear: { brand: "" } },
    (filters.minPrice || filters.maxPrice) && {
      key: "price",
      label: `${filters.minPrice ? formatTaka(filters.minPrice) : "৳0"} – ${filters.maxPrice ? formatTaka(filters.maxPrice) : "any"}`,
      clear: { minPrice: "", maxPrice: "" },
    },
    filters.inStock && { key: "inStock", label: "In stock", clear: { inStock: "" } },
  ].filter(Boolean);

  const clearAll = () => {
    setSearchDraft("");
    router.push(pathname, { scroll: false });
  };

  const title = filters.subcategory || selectedCategory?.categoryName || selectedBrand?.brandName || "All Products";

  const filterPanel = (
    // key resets the price inputs when the URL changes them
    <FilterPanel
      key={`${filters.minPrice}-${filters.maxPrice}`}
      filters={filters}
      setFilters={setFilters}
      categories={categories}
      brands={brands}
    />
  );

  return (
    <div className="min-h-screen">
      {/* page header */}
      <div className="border-b border-gray-100 bg-white">
        <div className="container mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
          <nav className="flex items-center gap-1.5 text-xs text-gray-500" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-brand">Home</Link>
            <ChevronRight className="h-3 w-3" />
            <Link href="/products" className="hover:text-brand">Products</Link>
            {title !== "All Products" && (
              <>
                <ChevronRight className="h-3 w-3" />
                <span className="text-gray-900">{title}</span>
              </>
            )}
          </nav>
          <h1 className="mt-2 text-2xl font-bold text-gray-900 sm:text-3xl">{title}</h1>
          <p className="mt-1 text-sm text-gray-500">
            {pagination ? `${pagination.totalProducts} products found` : "Discover the latest gadgets at the best prices"}
          </p>

          {/* category quick links */}
          {categories.length > 0 && (
            <div className="no-scrollbar -mx-4 mt-5 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:px-0">
              <button
                onClick={() => setFilters({ category: "", subcategory: "" })}
                className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition ${
                  !filters.category ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                All
              </button>
              {categories.map((category) => (
                <button
                  key={category._id}
                  onClick={() => setFilters({ category: category._id, subcategory: "" })}
                  className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition ${
                    filters.category === category._id ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {category.categoryName}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="container mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex gap-6">
          {/* desktop sidebar */}
          <aside className="hidden w-64 shrink-0 lg:block">
            <div className="sticky top-36 rounded-2xl border border-gray-100 bg-white px-4">
              <div className="flex items-center justify-between border-b border-gray-100 py-4">
                <h2 className="font-bold text-gray-900">Filters</h2>
                {activeChips.length > 0 && (
                  <button onClick={clearAll} className="text-xs font-semibold text-brand hover:underline">
                    Clear all
                  </button>
                )}
              </div>
              {filterPanel}
            </div>
          </aside>

          <div className="min-w-0 flex-1">
            {/* toolbar */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  value={searchDraft}
                  onChange={(e) => setSearchDraft(e.target.value)}
                  placeholder="Search phones, laptops, headphones…"
                  className="h-11 w-full rounded-xl border border-gray-200 bg-white pl-10 pr-10 text-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
                />
                {searchDraft && (
                  <button
                    onClick={() => setSearchDraft("")}
                    aria-label="Clear search"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setDrawerOpen(true)}
                  className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 text-sm font-semibold text-gray-700 lg:hidden"
                >
                  <SlidersHorizontal className="h-4 w-4" />
                  Filters
                  {activeChips.length > 0 && (
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand text-xs text-white">
                      {activeChips.length}
                    </span>
                  )}
                </button>
                <DropdownSelect
                  label="Sort products"
                  size="lg"
                  icon={ArrowUpDown}
                  value={sort.value}
                  onChange={(v) => setFilters({ sort: v === "newest" ? "" : v })}
                  options={sortOptions.map((o) => ({ value: o.value, label: o.label }))}
                  className="flex-1 sm:w-56 sm:flex-none"
                  align="end"
                />
              </div>
            </div>

            {/* active filters */}
            {activeChips.length > 0 && (
              <div className="mt-4 flex flex-wrap items-center gap-2">
                {activeChips.map((chip) => (
                  <button
                    key={chip.key}
                    onClick={() => {
                      if (chip.key === "q") setSearchDraft("");
                      setFilters(chip.clear);
                    }}
                    className="inline-flex items-center gap-1.5 rounded-full bg-brand-light px-3 py-1.5 text-xs font-semibold text-brand-dark hover:bg-brand hover:text-white"
                  >
                    {chip.label}
                    <X className="h-3 w-3" />
                  </button>
                ))}
                <button onClick={clearAll} className="text-xs font-semibold text-gray-500 hover:text-gray-900">
                  Clear all
                </button>
              </div>
            )}

            {/* results */}
            <div className={`mt-5 transition-opacity ${isFetching && !isLoading ? "opacity-60" : ""}`}>
              {isLoading ? (
                <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-4">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <ProductTileSkeleton key={i} />
                  ))}
                </div>
              ) : isError ? (
                <div className="rounded-2xl border border-red-100 bg-red-50 p-8 text-center text-sm text-red-600">
                  Couldn&apos;t load products. Make sure the API server is running and try again.
                </div>
              ) : products.length === 0 ? (
                <div className="flex flex-col items-center rounded-3xl border border-dashed border-gray-200 bg-white py-20 text-center">
                  <PackageSearch className="h-14 w-14 text-gray-300" />
                  <p className="mt-4 text-lg font-semibold text-gray-800">No products match your filters</p>
                  <p className="mt-1 text-sm text-gray-500">Try removing a filter or searching for something else.</p>
                  <button onClick={clearAll} className="mt-5 rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-dark">
                    Clear all filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-4">
                  {products.map((product, i) => <ProductTile key={product._id} product={product} index={i} />)}
                </div>
              )}
            </div>

            {/* pagination */}
            {pagination?.totalPages > 1 && (
              <nav className="mt-10 flex items-center justify-center gap-1.5" aria-label="Pagination">
                <button
                  disabled={!pagination.hasPrevPage}
                  onClick={() => {
                    setFilters({ page: String(page - 1) });
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  aria-label="Previous page"
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-700 hover:border-brand disabled:pointer-events-none disabled:opacity-40"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                {pageList(page, pagination.totalPages).map((p, i) =>
                  p === "…" ? (
                    <span key={`gap-${i}`} className="px-1 text-gray-400">…</span>
                  ) : (
                    <button
                      key={p}
                      onClick={() => {
                        setFilters({ page: p === 1 ? "" : String(p) });
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      aria-current={p === page ? "page" : undefined}
                      className={`h-10 min-w-10 rounded-xl px-3 text-sm font-semibold transition ${
                        p === page ? "bg-gray-900 text-white" : "border border-gray-200 bg-white text-gray-700 hover:border-brand"
                      }`}
                    >
                      {p}
                    </button>
                  )
                )}
                <button
                  disabled={!pagination.hasNextPage}
                  onClick={() => {
                    setFilters({ page: String(page + 1) });
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  aria-label="Next page"
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-700 hover:border-brand disabled:pointer-events-none disabled:opacity-40"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </nav>
            )}
          </div>
        </div>
      </div>

      {/* mobile filter drawer */}
      <div className={`fixed inset-0 z-[60] lg:hidden ${drawerOpen ? "" : "pointer-events-none"}`} aria-hidden={!drawerOpen}>
        <div
          onClick={() => setDrawerOpen(false)}
          className={`absolute inset-0 bg-black/40 transition-opacity ${drawerOpen ? "opacity-100" : "opacity-0"}`}
        />
        <div
          className={`absolute inset-y-0 left-0 flex w-[85%] max-w-sm flex-col bg-white shadow-2xl transition-transform duration-300 ${
            drawerOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between border-b border-gray-100 px-4 py-4">
            <h2 className="text-lg font-bold text-gray-900">Filters</h2>
            <button onClick={() => setDrawerOpen(false)} aria-label="Close filters" className="rounded-full p-2 hover:bg-gray-100">
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto px-4">{filterPanel}</div>
          <div className="flex gap-3 border-t border-gray-100 p-4">
            <button onClick={clearAll} className="h-11 flex-1 rounded-xl border border-gray-200 text-sm font-semibold text-gray-700">
              Clear all
            </button>
            <button onClick={() => setDrawerOpen(false)} className="h-11 flex-1 rounded-xl bg-brand text-sm font-semibold text-white">
              Show {pagination?.totalProducts ?? ""} results
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
