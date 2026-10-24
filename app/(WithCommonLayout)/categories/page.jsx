"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useAllCategories } from "@/lib/hooks/useStorefront";
import { useAllBrands } from "@/lib/hooks/useStorefront";
import { getCategoryIcon } from "@/lib/categoryIcons";
import PageHero from "@/components/Module/Shop/PageHero";
import Reveal, { stagger } from "@/components/Shared/Motion/Reveal";

const tints = [
  "from-emerald-50 to-teal-100/60 text-emerald-600",
  "from-sky-50 to-blue-100/60 text-sky-600",
  "from-violet-50 to-purple-100/60 text-violet-600",
  "from-amber-50 to-orange-100/60 text-amber-600",
  "from-rose-50 to-pink-100/60 text-rose-600",
  "from-indigo-50 to-indigo-100/60 text-indigo-600",
];

export default function CategoriesPage() {
  const { data, isLoading, isError } = useAllCategories();
  const { data: brandsData } = useAllBrands();
  const categories = data?.data || [];
  const brands = (brandsData?.data || []).slice(0, 10);

  return (
    <div className="pb-16">
      <PageHero
        title="Shop by Category"
        subtitle="Everything from flagship phones to the cables that power them, organized so you can find it fast."
        crumbs={[{ label: "Categories" }]}
      />

      <div className="container mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
        {isError ? (
          <p className="rounded-2xl bg-red-50 p-6 text-center text-sm text-red-600">Couldn&apos;t load categories. Make sure the API is running.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {isLoading
              ? Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-64 animate-pulse rounded-3xl bg-gray-100" />)
              : categories.map((category, index) => {
                  const Icon = getCategoryIcon(category.categoryName);
                  const tint = tints[index % tints.length];
                  return (
                    <Reveal key={category._id} delay={stagger(index % 6, 80)} className="group flex flex-col rounded-3xl border border-gray-100 bg-white p-5 transition hover:-translate-y-1 hover:border-brand/30 hover:shadow-xl hover:shadow-brand/10">
                      <Link href={`/products?category=${category._id}`} className={`relative flex h-36 items-center justify-between overflow-hidden rounded-2xl bg-gradient-to-br p-5 ${tint}`}>
                        <div>
                          <h2 className="text-xl font-bold text-gray-900">{category.categoryName}</h2>
                          <p className="mt-1 text-sm text-gray-600">{category.subcategories?.length || 0} types</p>
                        </div>
                        {category.categoryImg?.url ? (
                          <img src={category.categoryImg.url} alt="" className="h-28 w-28 object-contain drop-shadow-xl transition-transform duration-500 group-hover:scale-110" />
                        ) : (
                          <Icon strokeWidth={1.25} className="h-24 w-24 opacity-80 transition-transform duration-500 group-hover:scale-110" />
                        )}
                      </Link>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {category.subcategories?.map((sub) => (
                          <Link
                            key={sub}
                            href={`/products?category=${category._id}&subcategory=${encodeURIComponent(sub)}`}
                            className="rounded-full border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 transition hover:border-brand hover:bg-brand-light hover:text-brand-dark"
                          >
                            {sub}
                          </Link>
                        ))}
                      </div>
                      <Link href={`/products?category=${category._id}`} className="mt-auto inline-flex items-center gap-1 pt-5 text-sm font-semibold text-gray-900 hover:text-brand">
                        Shop all {category.categoryName}
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </Link>
                    </Reveal>
                  );
                })}
          </div>
        )}

        {brands.length > 0 && (
          <Reveal variant="zoom" className="mt-16 overflow-hidden rounded-3xl bg-gray-900 p-6 sm:p-10">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wider text-emerald-300">Prefer a brand?</p>
                <h2 className="mt-1 text-2xl font-bold text-white sm:text-3xl">Shop by your favourite brand</h2>
              </div>
              <Link href="/brands" className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-gray-900 hover:bg-gray-100">
                All brands <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="mt-8 grid grid-cols-3 gap-3 sm:grid-cols-5">
              {brands.map((brand, i) => (
                <Link key={brand._id} href={`/products?brand=${brand._id}`} title={brand.brandName} style={{ animationDelay: `${i * 60}ms` }} className="animate-pop flex h-16 items-center justify-center rounded-2xl bg-white px-4 transition hover:scale-105">
                  {brand.brandImg ? (
                    <img src={brand.brandImg} alt={brand.brandName} className="max-h-7 max-w-full object-contain" />
                  ) : (
                    <span className="text-sm font-bold text-gray-800">{brand.brandName}</span>
                  )}
                </Link>
              ))}
            </div>
          </Reveal>
        )}
      </div>
    </div>
  );
}
