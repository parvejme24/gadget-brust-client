"use client";

import { useState } from "react";
import { PackageSearch } from "lucide-react";
import { useAllProducts } from "@/lib/hooks/useStorefront";
import SectionHeader from "@/components/Module/Home/SectionHeader/SectionHeader";
import ProductTile, { ProductTileSkeleton } from "@/components/Module/Home/ProductTile/ProductTile";

// "new" uses the default newest-first sort instead of a remark filter
const tabs = [
  { key: "new", label: "New Arrivals", params: { limit: 10 } },
  { key: "trending", label: "Trending", params: { limit: 10, remark: "trending" } },
  { key: "popular", label: "Popular", params: { limit: 10, remark: "popular" } },
  { key: "best", label: "Best Sellers", params: { limit: 10, remark: "best" } },
];

export default function ProductTabs() {
  const [activeKey, setActiveKey] = useState(tabs[0].key);
  const activeTab = tabs.find((tab) => tab.key === activeKey);
  const { data, isLoading } = useAllProducts(activeTab.params);
  const products = data?.data || [];

  return (
    <section className="py-10 sm:py-14">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader eyebrow="Handpicked" title="Explore Our Products" href="/products" />

        <div role="tablist" className="no-scrollbar -mx-4 mb-6 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:px-0">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              role="tab"
              aria-selected={tab.key === activeKey}
              onClick={() => setActiveKey(tab.key)}
              className={`shrink-0 rounded-full px-5 py-2 text-sm font-semibold transition-all ${
                tab.key === activeKey
                  ? "bg-gray-900 text-white shadow-md"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-5">
            {Array.from({ length: 10 }).map((_, i) => (
              <ProductTileSkeleton key={i} />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-gray-200 py-16 text-center">
            <PackageSearch className="h-12 w-12 text-gray-300" />
            <p className="mt-3 font-semibold text-gray-700">No products here yet</p>
            <p className="text-sm text-gray-500">Check back soon or explore another collection.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-5">
            {products.map((product, i) => <ProductTile key={product._id} product={product} index={i} />)}
          </div>
        )}
      </div>
    </section>
  );
}
