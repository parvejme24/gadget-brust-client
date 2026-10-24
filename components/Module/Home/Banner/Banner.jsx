"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import Link from "next/link";
import { ArrowRight, Zap } from "lucide-react";
import { useAllCategories, useDiscountedProducts, useSliderProducts } from "@/lib/hooks/useStorefront";
import { getCategoryIcon } from "@/lib/categoryIcons";
import Reveal from "@/components/Shared/Motion/Reveal";
import { formatTaka, getFinalPrice } from "@/lib/format";

import "swiper/css";
import "swiper/css/pagination";

const tileStyles = [
  { className: "from-amber-100 to-orange-200", iconClass: "text-orange-500/70" },
  { className: "from-sky-100 to-indigo-200", iconClass: "text-indigo-500/70" },
];

export default function Banner() {
  const { data, isLoading } = useSliderProducts();
  const { data: discounted, isLoading: discountedLoading } = useDiscountedProducts();
  const { data: categoriesData } = useAllCategories();
  // products the admin put in the slider, otherwise the best current deals
  const sliderProducts = data?.data?.length ? data.data : (discounted?.data || []).slice(0, 5);
  const loading = isLoading || (!data?.data?.length && discountedLoading);
  // the two biggest categories become the side tiles
  const sideTiles = [...(categoriesData?.data || [])]
    .sort((a, b) => (b.subcategories?.length || 0) - (a.subcategories?.length || 0))
    .slice(0, 2)
    .map((c, i) => ({
      title: c.categoryName,
      subtitle: c.subcategories?.length ? `${c.subcategories.length} types to explore` : "Shop the range",
      href: `/products?category=${c._id}`,
      icon: getCategoryIcon(c.categoryName),
      ...tileStyles[i],
    }));

  return (
    <section className="pt-4 sm:pt-6 pb-6">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {/* main slider */}
          <Reveal variant="zoom" className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-900 via-gray-900 to-emerald-950 lg:col-span-2">
            <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-brand/30 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-24 left-1/3 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl" />

            {loading ? (
              <div className="h-[500px] sm:h-[420px] lg:h-[460px] animate-pulse" />
            ) : sliderProducts.length === 0 ? (
              <div className="relative flex h-[500px] flex-col items-center justify-center px-6 text-center sm:h-[420px] lg:h-[460px]">
                <h1 className="text-3xl font-extrabold text-white sm:text-5xl">Smart gadgets, genuine warranty</h1>
                <Link href="/products" className="mt-6 inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white">
                  Browse products <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            ) : (
              <Swiper
                modules={[Pagination, Autoplay]}
                speed={700}
                slidesPerView={1}
                loop={sliderProducts.length > 1}
                autoplay={{ delay: 5000, disableOnInteraction: false, pauseOnMouseEnter: true }}
                pagination={{ clickable: true }}
                className="hero-swiper h-[500px] sm:h-[420px] lg:h-[460px]"
              >
                {sliderProducts.map((item) => {
                  const href = `/products/${item._id}`;
                  const price = item.price ? getFinalPrice(item) : null;
                  return (
                    <SwiperSlide key={item._id}>
                      <div className="relative grid h-full grid-cols-1 items-center gap-4 px-6 pb-14 pt-6 sm:grid-cols-2 sm:px-10 sm:py-10">
                        <div className="hero-copy relative z-10 order-2 text-center sm:order-1 sm:text-left">
                          {item.discount > 0 && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-brand/15 px-3 py-1 text-xs font-semibold text-emerald-300 ring-1 ring-brand/40">
                              <Zap className="h-3.5 w-3.5" />
                              Save {item.discount}% today
                            </span>
                          )}
                          <h1 className="mt-3 line-clamp-2 text-2xl font-extrabold leading-tight text-white sm:text-4xl lg:text-5xl">
                            {item.title}
                          </h1>
                          {item.shortDescription && (
                            <p className="mt-3 line-clamp-2 text-sm text-gray-300 sm:text-base">
                              {item.shortDescription}
                            </p>
                          )}
                          {price !== null && (
                            <p className="mt-4 text-2xl font-bold text-white">
                              {formatTaka(price)}
                              {price < item.price && (
                                <span className="ml-2 text-base font-normal text-gray-400 line-through">
                                  {formatTaka(item.price)}
                                </span>
                              )}
                            </p>
                          )}
                          <div className="mt-5 flex justify-center gap-3 sm:justify-start">
                            <Link
                              href={href}
                              className="group inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-brand/30 transition hover:bg-brand-dark"
                            >
                              Shop Now
                              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                            </Link>
                            <Link
                              href="/products"
                              className="inline-flex rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                            >
                              Explore
                            </Link>
                          </div>
                        </div>

                        <div className="relative order-1 flex h-44 items-center justify-center sm:order-2 sm:h-full">
                          <div className="absolute h-36 w-36 rounded-full bg-brand/20 blur-2xl sm:h-64 sm:w-64" />
                          {item.image?.url && (
                            <img
                              src={item.image.url}
                              alt={item.title}
                              className="hero-image relative max-h-full w-auto object-contain drop-shadow-2xl sm:max-h-[320px]"
                            />
                          )}
                        </div>
                      </div>
                    </SwiperSlide>
                  );
                })}
              </Swiper>
            )}
          </Reveal>

          {/* side promo tiles */}
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-1">
            {sideTiles.map(({ title, subtitle, href, icon: Icon, className, iconClass }, i) => (
              <Reveal key={title} variant="right" delay={150 + i * 120} className="h-full">
                <Link
                  href={href}
                  className={`hover-lift group relative flex h-full min-h-[150px] overflow-hidden rounded-3xl bg-gradient-to-br p-5 sm:p-6 ${className}`}
                >
                  <div className="relative z-10 flex flex-col">
                    <span className="text-xs font-semibold uppercase tracking-wider text-gray-600">
                      {subtitle}
                    </span>
                    <h3 className="mt-1 text-lg font-bold text-gray-900 sm:text-2xl">{title}</h3>
                    <span className="mt-auto inline-flex items-center gap-1 pt-4 text-sm font-semibold text-gray-900">
                      Shop now
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                  <Icon
                    strokeWidth={1.25}
                    className={`absolute -bottom-4 -right-4 h-28 w-28 transition-transform duration-500 group-hover:-rotate-12 group-hover:scale-110 sm:h-36 sm:w-36 ${iconClass}`}
                  />
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
