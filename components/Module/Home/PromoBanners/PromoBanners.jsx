"use client";

import Link from "next/link";
import { toast } from "sonner";
import { ArrowRight, Banknote, Copy, Gift, Percent, TicketPercent, Truck } from "lucide-react";
import { useOffers } from "@/lib/hooks/useStorefront";
import { formatDate } from "@/lib/format";
import Reveal, { stagger } from "@/components/Shared/Motion/Reveal";

const typeIcons = { percentage: Percent, fixed: Banknote, bogo: Gift, free_shipping: Truck };
const backgrounds = [
  "bg-gradient-to-br from-violet-600 via-indigo-600 to-blue-700",
  "bg-gradient-to-br from-gray-900 via-slate-800 to-slate-700",
  "bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-700",
  "bg-gradient-to-br from-rose-600 via-pink-600 to-fuchsia-700",
];

// where a coupon can be used
const offerHref = (offer) => {
  const first = (list) => list?.[0]?._id || list?.[0];
  if (offer.appliesTo === "categories" && first(offer.categories)) return `/products?category=${first(offer.categories)}`;
  if (offer.appliesTo === "brands" && first(offer.brands)) return `/products?brand=${first(offer.brands)}`;
  if (offer.appliesTo === "products" && first(offer.products)) return `/products/${first(offer.products)}`;
  return "/products";
};

const copy = async (e, code) => {
  e.preventDefault();
  try {
    await navigator.clipboard.writeText(code);
    toast.success(`Copied ${code}`, { description: "Use it at checkout." });
  } catch {
    toast.error("Couldn't copy the code");
  }
};

// live public coupons from the dashboard; the section hides when there are none
export default function PromoBanners() {
  const { data: offers = [], isLoading } = useOffers();
  if (!isLoading && !offers.length) return null;
  const shown = offers.slice(0, 2);

  return (
    <section className="py-6 sm:py-10">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {isLoading
            ? [0, 1].map((i) => <div key={i} className="min-h-[220px] animate-pulse rounded-3xl bg-gray-200/70" />)
            : shown.map((offer, i) => {
                const Icon = typeIcons[offer.type] || TicketPercent;
                return (
                  <Reveal key={offer._id} variant={i % 2 ? "right" : "left"} delay={stagger(i, 120)}>
                    <Link href={offerHref(offer)} className={`hover-lift animate-shine group relative flex min-h-[220px] overflow-hidden rounded-3xl p-6 sm:p-8 ${backgrounds[i % backgrounds.length]}`}>
                      <div className="relative z-10 flex max-w-[70%] flex-col">
                        <span className="text-xs font-semibold uppercase tracking-wider text-white/70">{offer.summary}</span>
                        <h3 className="mt-2 text-2xl font-bold text-white sm:text-3xl">{offer.title}</h3>
                        {offer.description && <p className="mt-2 text-sm text-white/75">{offer.description}</p>}
                        <div className="mt-auto flex flex-wrap items-center gap-2 pt-5">
                          <button
                            type="button"
                            onClick={(e) => copy(e, offer.code)}
                            className="press inline-flex items-center gap-2 rounded-full border border-dashed border-white/50 bg-white/10 px-4 py-2 font-mono text-sm font-bold tracking-wide text-white backdrop-blur hover:bg-white/20"
                            aria-label={`Copy coupon code ${offer.code}`}
                          >
                            {offer.code} <Copy className="h-3.5 w-3.5" />
                          </button>
                          <span className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-gray-900 transition-all group-hover:gap-3">
                            Shop now <ArrowRight className="h-4 w-4" />
                          </span>
                        </div>
                        {offer.endDate && <p className="mt-3 text-xs text-white/60">Ends {formatDate(offer.endDate)}</p>}
                      </div>
                      <Icon
                        strokeWidth={1}
                        className="absolute -bottom-6 -right-6 h-48 w-48 text-white/15 transition-transform duration-500 group-hover:-rotate-6 group-hover:scale-110 sm:h-56 sm:w-56"
                      />
                    </Link>
                  </Reveal>
                );
              })}
        </div>
      </div>
    </section>
  );
}
