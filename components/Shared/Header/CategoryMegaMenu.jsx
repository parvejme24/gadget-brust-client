"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, ChevronDown, ChevronRight, LayoutGrid } from "lucide-react";
import { useAllCategories } from "@/lib/hooks/useStorefront";
import { useAllBrands } from "@/lib/hooks/useStorefront";
import { getCategoryIcon } from "@/lib/categoryIcons";

export default function CategoryMegaMenu() {
  const [open, setOpen] = useState(false);
  const [activeId, setActiveId] = useState(null);
  const closeTimer = useRef(null);
  const { data: categoriesData } = useAllCategories();
  const { data: brandsData } = useAllBrands();
  const categories = categoriesData?.data || [];
  const brands = (brandsData?.data || []).slice(0, 8);
  const active = categories.find((c) => c._id === activeId) || categories[0];

  const show = () => {
    clearTimeout(closeTimer.current);
    setOpen(true);
  };
  const hide = () => {
    closeTimer.current = setTimeout(() => setOpen(false), 150);
  };

  useEffect(() => () => clearTimeout(closeTimer.current), []);

  return (
    <div className="relative" onMouseEnter={show} onMouseLeave={hide}>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="true"
        className="flex h-10 items-center gap-2 rounded-xl bg-gray-900 px-4 text-sm font-semibold text-white transition hover:bg-gray-800"
      >
        <LayoutGrid className="h-4 w-4" />
        All Categories
        <ChevronDown className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && categories.length > 0 && (
        <div className="absolute left-0 top-full z-50 pt-2" onKeyDown={(e) => e.key === "Escape" && setOpen(false)}>
          <div className="flex w-[860px] max-w-[calc(100vw-4rem)] overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-2xl shadow-gray-900/10">
            {/* category list */}
            <ul className="w-60 shrink-0 border-r border-gray-100 bg-gray-50/70 py-2">
              {categories.map((category) => {
                const Icon = getCategoryIcon(category.categoryName);
                const isActive = active?._id === category._id;
                return (
                  <li key={category._id}>
                    <Link
                      href={`/products?category=${category._id}`}
                      onMouseEnter={() => setActiveId(category._id)}
                      onFocus={() => setActiveId(category._id)}
                      onClick={() => setOpen(false)}
                      className={`flex items-center gap-3 px-4 py-2 text-sm transition ${
                        isActive ? "bg-white font-semibold text-brand-dark" : "text-gray-700 hover:bg-white"
                      }`}
                    >
                      <Icon className={`h-4 w-4 ${isActive ? "text-brand" : "text-gray-400"}`} />
                      <span className="flex-1">{category.categoryName}</span>
                      <ChevronRight className="h-3.5 w-3.5 text-gray-300" />
                    </Link>
                  </li>
                );
              })}
            </ul>

            {/* subcategories */}
            <div className="flex-1 p-6">
              {active && (
                <>
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-gray-900">{active.categoryName}</h3>
                    <Link
                      href={`/products?category=${active._id}`}
                      onClick={() => setOpen(false)}
                      className="inline-flex items-center gap-1 text-sm font-semibold text-brand hover:underline"
                    >
                      Shop all <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-2">
                    {active.subcategories?.map((sub) => (
                      <Link
                        key={sub}
                        href={`/products?category=${active._id}&subcategory=${encodeURIComponent(sub)}`}
                        onClick={() => setOpen(false)}
                        className="rounded-xl border border-gray-100 px-4 py-3 text-sm font-medium text-gray-700 transition hover:border-brand/40 hover:bg-brand-light hover:text-brand-dark"
                      >
                        {sub}
                      </Link>
                    ))}
                  </div>
                  {active.categoryImg?.url && (
                    <div className="mt-5 flex items-center gap-4 rounded-2xl bg-gradient-to-r from-brand-light to-white p-4">
                      <img src={active.categoryImg.url} alt="" className="h-16 w-16 object-contain" />
                      <div>
                        <p className="text-sm font-semibold text-gray-900">Top picks in {active.categoryName}</p>
                        <p className="text-xs text-gray-500">Genuine products with official warranty</p>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* brands */}
            <div className="w-56 shrink-0 border-l border-gray-100 p-6">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400">Popular brands</h3>
              <div className="mt-3 grid grid-cols-2 gap-2">
                {brands.map((brand) => (
                  <Link
                    key={brand._id}
                    href={`/products?brand=${brand._id}`}
                    onClick={() => setOpen(false)}
                    title={brand.brandName}
                    className="flex h-12 items-center justify-center rounded-xl border border-gray-100 px-2 transition hover:border-brand/40 hover:shadow-sm"
                  >
                    {brand.brandImg ? (
                      <img src={brand.brandImg} alt={brand.brandName} className="max-h-6 max-w-full object-contain" />
                    ) : (
                      <span className="text-xs font-bold text-gray-600">{brand.brandName}</span>
                    )}
                  </Link>
                ))}
              </div>
              <div className="mt-4 space-y-1">
                <Link href="/brands" onClick={() => setOpen(false)} className="flex items-center justify-between rounded-lg px-2 py-1.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:text-brand">
                  All brands <ArrowRight className="h-3.5 w-3.5" />
                </Link>
                <Link href="/categories" onClick={() => setOpen(false)} className="flex items-center justify-between rounded-lg px-2 py-1.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:text-brand">
                  All categories <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
