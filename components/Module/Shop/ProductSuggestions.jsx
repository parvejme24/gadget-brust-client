"use client";

import { useAllProducts } from "@/lib/hooks/useStorefront";
import SectionHeader from "@/components/Module/Home/SectionHeader/SectionHeader";
import ProductTile, { ProductTileSkeleton } from "@/components/Module/Home/ProductTile/ProductTile";

export default function ProductSuggestions({ title = "You might also like", eyebrow = "Recommended", excludeIds = [] }) {
  const { data, isLoading } = useAllProducts({ limit: 10, sortBy: "star", sortOrder: "desc", inStock: "true" });
  const products = (data?.data || []).filter((p) => !excludeIds.includes(p._id)).slice(0, 5);

  if (!isLoading && products.length === 0) return null;

  return (
    <section className="mt-16">
      <SectionHeader eyebrow={eyebrow} title={title} href="/products?sort=rating" />
      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-5">
        {isLoading
          ? Array.from({ length: 5 }).map((_, i) => <ProductTileSkeleton key={i} />)
          : products.map((product, i) => <ProductTile key={product._id} product={product} index={i} />)}
      </div>
    </section>
  );
}
