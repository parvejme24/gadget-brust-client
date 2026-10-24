"use client";

import { useCallback, useEffect, useState } from "react";
import { Loader2, Package, Plus, Search } from "lucide-react";
import { useAdminProducts } from "@/lib/hooks/useAdmin";
import { useClickOutside } from "@/lib/hooks/useClickOutside";
import { cx, formatTaka, getFinalPrice, inputClass } from "@/components/Dashboard/Kit";

// type to find a product, pick one to add it; out-of-stock products can't be picked unless allowOutOfStock
export default function ProductPicker({ onPick, excludeIds = [], placeholder = "Search products to add…", allowOutOfStock = false, autoFocus = false }) {
  const [query, setQuery] = useState("");
  const [debounced, setDebounced] = useState("");
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);
  const ref = useClickOutside(close);

  useEffect(() => {
    const t = setTimeout(() => setDebounced(query.trim()), 250);
    return () => clearTimeout(t);
  }, [query]);

  const { data, isFetching } = useAdminProducts({ limit: 8, ...(debounced && { search: debounced }), sortBy: "title", sortOrder: "asc" });
  const products = (data?.products || []).filter((p) => !excludeIds.includes(p._id));

  const pick = (p) => {
    onPick(p);
    setQuery("");
    setOpen(false);
  };

  return (
    <div ref={ref} className="relative">
      <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
      <input
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        autoFocus={autoFocus}
        placeholder={placeholder}
        aria-label={placeholder}
        className={cx(inputClass, "pl-10")}
      />
      {isFetching && open && <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-gray-400" />}
      {open && (
        <ul className="absolute inset-x-0 top-full z-30 mt-1 max-h-72 overflow-y-auto rounded-xl border border-gray-200 bg-surface p-1 shadow-xl">
          {products.length === 0 && !isFetching && <li className="px-3 py-4 text-center text-sm text-gray-500">No products found</li>}
          {products.map((p) => (
            <li key={p._id}>
              <button
                type="button"
                disabled={p.stock === 0 && !allowOutOfStock}
                onClick={() => pick(p)}
                className="flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-left hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-gray-50">
                  {p.image?.url ? <img src={p.image.url} alt="" className="h-full w-full object-contain p-0.5" /> : <Package className="h-4 w-4 text-gray-300" />}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium text-gray-900">{p.title}</span>
                  <span className={cx("text-xs", p.stock === 0 ? "text-red-600" : p.stock <= 10 ? "text-orange-600" : "text-gray-500")}>
                    {formatTaka(getFinalPrice(p))} · {p.stock === 0 ? "Out of stock" : `${p.stock} in stock`}
                  </span>
                </span>
                {(p.stock > 0 || allowOutOfStock) && <Plus className="h-4 w-4 shrink-0 text-gray-400" />}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
