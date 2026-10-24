"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Search, X } from "lucide-react";
import { useAllBrands } from "@/lib/hooks/useStorefront";
import PageHero from "@/components/Module/Shop/PageHero";
import Reveal, { stagger } from "@/components/Shared/Motion/Reveal";

export default function BrandsPage() {
  const { data, isLoading, isError } = useAllBrands();
  const [query, setQuery] = useState("");
  const brands = data?.data || [];

  // group A-Z after filtering
  const groups = useMemo(() => {
    const filtered = brands
      .filter((b) => b.brandName.toLowerCase().includes(query.trim().toLowerCase()))
      .sort((a, b) => a.brandName.localeCompare(b.brandName));
    return filtered.reduce((acc, brand) => {
      const letter = /[a-z]/i.test(brand.brandName[0]) ? brand.brandName[0].toUpperCase() : "#";
      (acc[letter] ||= []).push(brand);
      return acc;
    }, {});
  }, [brands, query]);

  const letters = Object.keys(groups);

  return (
    <div className="pb-16">
      <PageHero
        title="Top Brands"
        subtitle={`${brands.length || ""} trusted brands, all with official warranty. Pick one to see every product we carry.`.trim()}
        crumbs={[{ label: "Brands" }]}
      >
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search brands"
            aria-label="Search brands"
            className="h-11 w-full rounded-full border border-gray-200 bg-white pl-10 pr-10 text-sm outline-none focus:border-brand focus:ring-4 focus:ring-brand/10"
          />
          {query && (
            <button onClick={() => setQuery("")} aria-label="Clear search" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700">
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </PageHero>

      <div className="container mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
        {/* letter jump */}
        {letters.length > 1 && (
          <div className="no-scrollbar sticky top-16 z-20 -mx-4 flex gap-1 overflow-x-auto border-b border-gray-100 bg-white/95 px-4 py-3 backdrop-blur sm:mx-0 sm:px-0 lg:top-[8.5rem]">
            {letters.map((letter) => (
              <a key={letter} href={`#brand-${letter}`} className="flex h-9 min-w-9 items-center justify-center rounded-lg text-sm font-semibold text-gray-600 hover:bg-brand-light hover:text-brand-dark">
                {letter}
              </a>
            ))}
          </div>
        )}

        {isError ? (
          <p className="mt-6 rounded-2xl bg-red-50 p-6 text-center text-sm text-red-600">Couldn&apos;t load brands. Make sure the API is running.</p>
        ) : isLoading ? (
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {Array.from({ length: 10 }).map((_, i) => <div key={i} className="h-36 animate-pulse rounded-2xl bg-gray-100" />)}
          </div>
        ) : letters.length === 0 ? (
          <p className="mt-10 text-center text-gray-500">No brands match “{query}”.</p>
        ) : (
          letters.map((letter) => (
            <section key={letter} id={`brand-${letter}`} className="scroll-mt-52 pt-8">
              <Reveal as="h2" variant="left" className="mb-4 flex items-center gap-3 text-lg font-bold text-gray-900">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gray-900 text-white">{letter}</span>
                <span className="h-px flex-1 bg-gray-100" />
              </Reveal>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-5">
                {groups[letter].map((brand, i) => (
                  <Reveal key={brand._id} variant="zoom" delay={stagger(i, 50)}>
                  <Link
                    href={`/products?brand=${brand._id}`}
                    className="group flex h-full flex-col items-center rounded-2xl border border-gray-100 bg-white p-5 text-center transition hover:-translate-y-1 hover:border-brand/30 hover:shadow-xl hover:shadow-brand/10"
                  >
                    <div className="flex h-16 w-full items-center justify-center">
                      {brand.brandImg ? (
                        <img src={brand.brandImg} alt={brand.brandName} loading="lazy" className="max-h-10 max-w-[80%] object-contain transition group-hover:scale-110" />
                      ) : (
                        <span className="text-2xl font-black text-gray-300">{brand.brandName[0]}</span>
                      )}
                    </div>
                    <p className="mt-3 font-semibold text-gray-900">{brand.brandName}</p>
                    <span className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-gray-500 group-hover:text-brand">
                      View products <ArrowRight className="h-3 w-3" />
                    </span>
                  </Link>
                  </Reveal>
                ))}
              </div>
            </section>
          ))
        )}
      </div>
    </div>
  );
}
