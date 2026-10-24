"use client";

import { Truck, ShieldCheck, Banknote, Headset } from "lucide-react";
import { useStoreInfo } from "@/lib/hooks/useStorefront";
import { formatTaka } from "@/lib/format";
import Reveal, { stagger } from "@/components/Shared/Motion/Reveal";

export default function Speciality() {
  const store = useStoreInfo();
  const features = [
    { icon: Truck, title: "Fast Delivery", text: store.freeDeliveryThreshold ? `Free on orders over ${formatTaka(store.freeDeliveryThreshold)}` : "Nationwide, to your door" },
    { icon: ShieldCheck, title: "Genuine Products", text: "Official brand warranty" },
    { icon: Banknote, title: "Cash on Delivery", text: "Pay when it arrives" },
    { icon: Headset, title: "Friendly Support", text: store.hours || "Real people, ready to help" },
  ];

  return (
    <section className="pb-6">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-gray-100 bg-gray-100 lg:grid-cols-4">
          {features.map(({ icon: Icon, title, text }, i) => (
            <Reveal key={title} variant="fade" delay={stagger(i, 90)} className="group flex items-center gap-3 bg-white p-4 sm:gap-4 sm:p-5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-light text-brand transition-all duration-300 group-hover:scale-110 group-hover:bg-brand group-hover:text-white sm:h-12 sm:w-12">
                <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
              </div>
              <div className="min-w-0">
                <h3 className="text-sm font-semibold text-gray-900 sm:text-base">{title}</h3>
                <p className="truncate text-xs text-gray-500 sm:text-sm">{text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
