"use client";

import Link from "next/link";
import { useAllBrands } from "@/lib/hooks/useStorefront";
import SectionHeader from "@/components/Module/Home/SectionHeader/SectionHeader";

function BrandLogo({ brand }) {
  const image = typeof brand.brandImg === "string" ? brand.brandImg : brand.brandImg?.url;

  return (
    <Link
      href={`/products?brand=${brand._id}`}
      className="group flex h-20 w-40 shrink-0 items-center justify-center rounded-2xl border border-gray-100 bg-white px-6 transition hover:border-brand/40 hover:shadow-md sm:h-24 sm:w-48"
    >
      {image ? (
        <img
          src={image}
          alt={brand.brandName}
          loading="lazy"
          className="max-h-10 w-auto object-contain opacity-70 grayscale transition group-hover:opacity-100 group-hover:grayscale-0"
        />
      ) : (
        <span className="text-lg font-bold text-gray-400 transition group-hover:text-gray-900">
          {brand.brandName}
        </span>
      )}
    </Link>
  );
}

export default function BrandMarquee() {
  const { data, isLoading } = useAllBrands();
  const brands = data?.data || [];

  if (isLoading || brands.length === 0) return null;

  return (
    <section className="py-10 sm:py-14 bg-gray-50">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader eyebrow="Trusted" title="Top Brands" href="/brands" />
      </div>
      <div className="group relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
        {/* list is doubled so the -50% translate loops seamlessly */}
        <div className="flex w-max gap-4 animate-marquee group-hover:[animation-play-state:paused] motion-reduce:animate-none">
          {[...brands, ...brands].map((brand, i) => (
            <BrandLogo key={`${brand._id}-${i}`} brand={brand} />
          ))}
        </div>
      </div>
    </section>
  );
}
