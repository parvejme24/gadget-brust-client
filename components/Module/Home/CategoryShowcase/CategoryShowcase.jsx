"use client";

import Link from "next/link";
import { useAllCategories } from "@/lib/hooks/useStorefront";
import SectionHeader from "@/components/Module/Home/SectionHeader/SectionHeader";
import { getCategoryIcon } from "@/lib/categoryIcons";
import Reveal, { stagger } from "@/components/Shared/Motion/Reveal";

const tints = [
  "bg-emerald-50 text-emerald-600",
  "bg-sky-50 text-sky-600",
  "bg-violet-50 text-violet-600",
  "bg-amber-50 text-amber-600",
  "bg-rose-50 text-rose-600",
  "bg-indigo-50 text-indigo-600",
];

export default function CategoryShowcase() {
  const { data, isLoading } = useAllCategories();
  const categories = data?.data || [];

  if (!isLoading && categories.length === 0) return null;

  return (
    <section className="py-10 sm:py-14">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader eyebrow="Browse" title="Shop by Category" href="/categories" />

        <div className="no-scrollbar -mx-4 flex snap-x gap-3 overflow-x-auto px-4 sm:mx-0 sm:grid sm:grid-cols-4 sm:gap-4 sm:overflow-visible sm:px-0 md:grid-cols-6 lg:grid-cols-8">
          {isLoading
            ? Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="w-28 shrink-0 animate-pulse rounded-2xl border border-gray-100 p-4 sm:w-auto">
                  <div className="mx-auto h-16 w-16 rounded-2xl bg-gray-100" />
                  <div className="mx-auto mt-3 h-3 w-16 rounded bg-gray-100" />
                </div>
              ))
            : categories.slice(0, 16).map((category, index) => {
                const Icon = getCategoryIcon(category.categoryName);
                const image = category.categoryImg?.url;
                return (
                  <Reveal key={category._id} variant="zoom" delay={stagger(index, 50)} className="w-28 shrink-0 snap-start sm:w-auto">
                  <Link
                    href={`/products?category=${category._id}`}
                    className="group block h-full rounded-2xl border border-gray-100 bg-white p-3 text-center transition-all duration-300 hover:-translate-y-1 hover:border-brand/40 hover:shadow-lg hover:shadow-brand/10 sm:p-4"
                  >
                    <div
                      className={`mx-auto flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl transition-transform duration-300 group-hover:scale-110 ${
                        image ? "bg-gray-50" : tints[index % tints.length]
                      }`}
                    >
                      {image ? (
                        <img src={image} alt={category.categoryName} loading="lazy" className="h-full w-full object-contain p-2" />
                      ) : (
                        <Icon className="h-7 w-7" strokeWidth={1.75} />
                      )}
                    </div>
                    <p className="mt-3 truncate text-sm font-semibold text-gray-800 group-hover:text-brand">
                      {category.categoryName}
                    </p>
                    {category.subcategories?.length > 0 && (
                      <p className="text-xs text-gray-400">{category.subcategories.length} types</p>
                    )}
                  </Link>
                  </Reveal>
                );
              })}
        </div>
      </div>
    </section>
  );
}
