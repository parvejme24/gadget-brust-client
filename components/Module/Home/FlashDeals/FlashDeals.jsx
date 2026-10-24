"use client";

import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { ChevronLeft, ChevronRight, Flame } from "lucide-react";
import Link from "next/link";
import { useDiscountedProducts } from "@/lib/hooks/useStorefront";
import ProductTile, { ProductTileSkeleton } from "@/components/Module/Home/ProductTile/ProductTile";

import "swiper/css";
import Reveal from "@/components/Shared/Motion/Reveal";

// deals reset every night at midnight
const getTimeLeft = () => {
  const now = new Date();
  const end = new Date(now);
  end.setHours(24, 0, 0, 0);
  const diff = Math.max(0, end - now);
  return {
    hours: Math.floor(diff / 3600000),
    minutes: Math.floor((diff / 60000) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
};

function Countdown() {
  const [timeLeft, setTimeLeft] = useState(null);

  useEffect(() => {
    setTimeLeft(getTimeLeft());
    const timer = setInterval(() => setTimeLeft(getTimeLeft()), 1000);
    return () => clearInterval(timer);
  }, []);

  const units = [
    ["hrs", timeLeft?.hours],
    ["min", timeLeft?.minutes],
    ["sec", timeLeft?.seconds],
  ];

  return (
    <div className="flex items-center gap-1.5" aria-label="Time left for today's deals">
      {units.map(([label, value], i) => (
        <div key={label} className="flex items-center gap-1.5">
          <div className="flex min-w-[3rem] flex-col items-center rounded-xl bg-white/15 px-2 py-1.5 backdrop-blur">
            <span className="text-lg font-bold tabular-nums leading-none text-white">
              {value === undefined ? "--" : String(value).padStart(2, "0")}
            </span>
            <span className="mt-0.5 text-[10px] uppercase text-white/70">{label}</span>
          </div>
          {i < units.length - 1 && <span className="font-bold text-white/70">:</span>}
        </div>
      ))}
    </div>
  );
}

export default function FlashDeals() {
  const { data, isLoading } = useDiscountedProducts();
  const products = (data?.data || [])
    .slice()
    .sort((a, b) => (b.discount || 0) - (a.discount || 0))
    .slice(0, 12);

  if (!isLoading && products.length === 0) return null;

  return (
    <section className="py-6 sm:py-10">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal variant="zoom" className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand via-emerald-600 to-teal-700 p-4 sm:p-6 lg:p-8">
          <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/10 blur-2xl" />

          <div className="relative mb-6 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="animate-pulse-ring flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15">
                <Flame className="h-6 w-6 text-amber-300" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white sm:text-3xl">Flash Deals</h2>
                <p className="text-sm text-white/80">Biggest discounts, ending soon</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Countdown />
              <div className="hidden gap-2 md:flex">
                <button
                  aria-label="Previous deals"
                  className="flash-prev flex h-10 w-10 items-center justify-center rounded-full bg-white text-gray-900 transition hover:bg-gray-100 disabled:opacity-40"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  aria-label="Next deals"
                  className="flash-next flex h-10 w-10 items-center justify-center rounded-full bg-white text-gray-900 transition hover:bg-gray-100 disabled:opacity-40"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="relative grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-5">
              {Array.from({ length: 5 }).map((_, i) => (
                <ProductTileSkeleton key={i} />
              ))}
            </div>
          ) : (
            <Swiper
              modules={[Navigation]}
              navigation={{ prevEl: ".flash-prev", nextEl: ".flash-next" }}
              spaceBetween={12}
              slidesPerView={2}
              breakpoints={{
                640: { slidesPerView: 3, spaceBetween: 16 },
                1024: { slidesPerView: 4, spaceBetween: 16 },
                1280: { slidesPerView: 5, spaceBetween: 16 },
              }}
              className="relative pb-1!"
            >
              {products.map((product, i) => (
                <SwiperSlide key={product._id} className="h-auto!">
                  <ProductTile product={product} index={i} />
                </SwiperSlide>
              ))}
            </Swiper>
          )}

          <div className="relative mt-6 text-center">
            <Link
              href="/products?sort=discount"
              className="inline-flex rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-brand-dark transition hover:bg-gray-100"
            >
              See all deals
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
