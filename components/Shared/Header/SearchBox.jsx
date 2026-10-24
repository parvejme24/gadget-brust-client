"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Loader2, Package, Search, X } from "lucide-react";
import { useAllProducts } from "@/lib/hooks/useStorefront";
import { useAllCategories } from "@/lib/hooks/useStorefront";
import { formatTaka, getFinalPrice } from "@/lib/format";
import { DropdownSelect } from "@/components/ui/dropdown-select";

export default function SearchBox({ autoFocus = false, onNavigate, showCategory = true }) {
  const router = useRouter();
  const wrapperRef = useRef(null);
  const [query, setQuery] = useState("");
  const [debounced, setDebounced] = useState("");
  const [category, setCategory] = useState("");
  const [open, setOpen] = useState(false);

  const { data: categoriesData } = useAllCategories();
  const categories = categoriesData?.data || [];

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(query.trim()), 250);
    return () => clearTimeout(timer);
  }, [query]);

  const enabled = debounced.length >= 2;
  const { data, isFetching } = useAllProducts(
    { search: debounced, limit: 6, ...(category && { category }) },
    { enabled }
  );
  const suggestions = enabled ? data?.data || [] : [];
  const total = data?.pagination?.totalProducts || 0;
  const matchingCategories = enabled
    ? categories.filter((c) => c.categoryName.toLowerCase().includes(debounced.toLowerCase())).slice(0, 3)
    : [];

  useEffect(() => {
    const onClick = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const done = () => {
    setOpen(false);
    onNavigate?.();
  };

  const submit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query.trim()) params.set("q", query.trim());
    if (category) params.set("category", category);
    router.push(`/products${params.toString() ? `?${params}` : ""}`);
    done();
  };

  return (
    <div ref={wrapperRef} className="relative w-full">
      <form
        onSubmit={submit}
        role="search"
        className="flex h-11 items-center overflow-hidden rounded-full border border-gray-200 bg-gray-50 transition focus-within:border-brand focus-within:bg-white focus-within:ring-4 focus-within:ring-brand/10"
      >
        {showCategory && (
          <div className="hidden h-full max-w-[10.5rem] shrink-0 items-center border-r border-gray-200 pl-2 xl:flex">
            <DropdownSelect
              label="Search in category"
              variant="ghost"
              size="sm"
              value={category}
              onChange={setCategory}
              options={[{ value: "", label: "All categories" }, ...categories.map((c) => ({ value: c._id, label: c.categoryName }))]}
            />
          </div>
        )}
        <Search className="ml-4 h-4 w-4 shrink-0 text-gray-400" />
        <input
          type="search"
          value={query}
          autoFocus={autoFocus}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={(e) => e.key === "Escape" && setOpen(false)}
          placeholder="Search phones, laptops, earbuds…"
          aria-label="Search products"
          className="h-full min-w-0 flex-1 bg-transparent px-3 text-sm text-gray-900 outline-none placeholder:text-gray-400 [&::-webkit-search-cancel-button]:hidden"
        />
        {query && (
          <button type="button" onClick={() => setQuery("")} aria-label="Clear search" className="p-1 text-gray-400 hover:text-gray-700">
            <X className="h-4 w-4" />
          </button>
        )}
        <button type="submit" className="m-1 flex h-9 shrink-0 items-center gap-2 rounded-full bg-brand px-4 text-sm font-semibold text-white transition hover:bg-brand-dark">
          <Search className="h-4 w-4 sm:hidden" />
          <span className="hidden sm:inline">Search</span>
        </button>
      </form>

      {open && enabled && (
        <div className="absolute inset-x-0 top-full z-50 mt-2 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-2xl shadow-gray-900/10">
          {matchingCategories.length > 0 && (
            <div className="border-b border-gray-100 p-3">
              <p className="px-2 pb-2 text-[11px] font-semibold uppercase tracking-wider text-gray-400">Categories</p>
              <div className="flex flex-wrap gap-2 px-2">
                {matchingCategories.map((c) => (
                  <Link
                    key={c._id}
                    href={`/products?category=${c._id}`}
                    onClick={done}
                    className="rounded-full bg-brand-light px-3 py-1 text-xs font-semibold text-brand-dark hover:bg-brand hover:text-white"
                  >
                    {c.categoryName}
                  </Link>
                ))}
              </div>
            </div>
          )}

          <div className="max-h-[60vh] overflow-y-auto p-2">
            {isFetching && suggestions.length === 0 ? (
              <div className="flex items-center gap-2 p-4 text-sm text-gray-500">
                <Loader2 className="h-4 w-4 animate-spin" /> Searching…
              </div>
            ) : suggestions.length === 0 ? (
              <div className="p-6 text-center text-sm text-gray-500">
                No products found for <span className="font-semibold text-gray-800">“{debounced}”</span>
              </div>
            ) : (
              suggestions.map((product) => {
                const price = getFinalPrice(product);
                return (
                  <Link
                    key={product._id}
                    href={`/products/${product._id}`}
                    onClick={done}
                    className="flex items-center gap-3 rounded-xl p-2 transition hover:bg-gray-50"
                  >
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-gray-50">
                      {product.image?.url ? (
                        <img src={product.image.url} alt="" className="h-full w-full object-contain p-1" />
                      ) : (
                        <Package className="h-5 w-5 text-gray-300" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-gray-900">{product.title}</p>
                      <p className="text-xs text-gray-500">
                        {product.brand?.brandName || product.subcategory}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-gray-900">{formatTaka(price)}</p>
                      {price < product.price && (
                        <p className="text-[11px] text-gray-400 line-through">{formatTaka(product.price)}</p>
                      )}
                    </div>
                  </Link>
                );
              })
            )}
          </div>

          {suggestions.length > 0 && (
            <button
              onClick={submit}
              className="flex w-full items-center justify-center gap-2 border-t border-gray-100 bg-gray-50 px-4 py-3 text-sm font-semibold text-brand-dark hover:bg-brand-light"
            >
              See all {total} results for “{debounced}”
              <ArrowRight className="h-4 w-4" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
