"use client";

import { useMemo, useState } from "react";
import { Package, ScanBarcode, Search } from "lucide-react";
import { useAdminCategories, useAdminProducts } from "@/lib/hooks/useAdmin";
import { cx, formatTaka, inputClass } from "@/components/Dashboard/Kit";
import { unitPrice } from "./usePosSale";

// searchable, filterable grid of products; tap to add to the sale
export default function PosProductGrid({ qtyOf, onAdd }) {
  const { data: catalog, isLoading } = useAdminProducts({ limit: 1000, sortBy: "title", sortOrder: "asc" });
  const { data: categories = [] } = useAdminCategories();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");

  const products = catalog?.products || [];
  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter(
      (p) => (!category || (p.category?._id || p.category) === category) && (!q || `${p.title} ${p.brand?.brandName || ""} ${p.subcategory}`.toLowerCase().includes(q))
    );
  }, [products, query, category]);

  return (
    <section className="min-w-0 px-4 py-6 sm:px-6 lg:px-8">
      <h1 className="flex items-center gap-2 text-2xl font-bold tracking-tight text-gray-900">
        <ScanBarcode className="h-6 w-6 text-brand-dark" /> Point of sale
      </h1>
      <p className="mt-1 text-sm text-gray-500">Sell at the counter. Stock updates automatically and you get a printable cash memo.</p>

      <div className="relative mt-5">
        <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && visible.length === 1 && onAdd(visible[0])}
          placeholder="Search product, brand or type… (Enter adds when one match)"
          className={cx(inputClass, "h-12 pl-11 text-base")}
        />
      </div>

      <div className="no-scrollbar -mx-4 mt-3 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:px-0">
        {[{ _id: "", categoryName: "All" }, ...categories].map((c) => (
          <button
            key={c._id || "all"}
            onClick={() => setCategory(c._id)}
            className={cx("shrink-0 rounded-full px-4 py-1.5 text-sm font-semibold transition", category === c._id ? "bg-gray-900 text-white" : "bg-surface text-gray-600 ring-1 ring-gray-200 hover:bg-gray-100")}
          >
            {c.categoryName}
          </button>
        ))}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
        {isLoading
          ? Array.from({ length: 12 }).map((_, i) => <div key={i} className="h-52 animate-pulse rounded-2xl bg-gray-100" />)
          : visible.map((p) => {
              const inCart = qtyOf(p._id);
              const maxed = inCart >= p.stock;
              return (
                <button
                  key={p._id}
                  onClick={() => onAdd(p)}
                  disabled={p.stock === 0}
                  className={cx(
                    "group relative flex flex-col overflow-hidden rounded-2xl border bg-surface text-left transition",
                    inCart ? "border-brand ring-2 ring-brand/20" : "border-gray-200/70 hover:border-gray-300 hover:shadow-md",
                    p.stock === 0 && "opacity-50"
                  )}
                >
                  <span className="flex h-28 items-center justify-center bg-gray-50">
                    {p.image?.url ? <img src={p.image.url} alt="" className="h-full w-full object-contain p-3" /> : <Package className="h-8 w-8 text-gray-300" />}
                  </span>
                  {inCart > 0 && <span className="absolute right-2 top-2 flex h-6 min-w-6 items-center justify-center rounded-full bg-brand px-1.5 text-xs font-bold text-white">{inCart}</span>}
                  <span className="flex flex-1 flex-col p-3">
                    <span className="line-clamp-2 text-[13px] font-semibold leading-snug text-gray-900">{p.title}</span>
                    <span className="mt-auto flex items-end justify-between gap-2 pt-2">
                      <span className="text-sm font-bold text-gray-900">{formatTaka(unitPrice(p))}</span>
                      <span className={cx("text-[11px] font-medium", p.stock === 0 ? "text-red-600" : p.stock <= 10 ? "text-orange-600" : "text-gray-500")}>
                        {p.stock === 0 ? "Out" : maxed ? "Max" : `${p.stock} left`}
                      </span>
                    </span>
                  </span>
                </button>
              );
            })}
      </div>
      {!isLoading && visible.length === 0 && <p className="py-16 text-center text-sm text-gray-500">No products match “{query}”.</p>}
    </section>
  );
}
