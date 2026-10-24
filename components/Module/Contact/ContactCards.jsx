"use client";

import { Clock, Mail, MapPin, Phone } from "lucide-react";
import Reveal, { stagger } from "@/components/Shared/Motion/Reveal";

// phone, email, address and hours from store settings
export default function ContactCards({ store }) {
  const cards = [
    { icon: Phone, title: "Call us", value: store.phone, href: store.phoneHref, tint: "bg-emerald-50 text-emerald-600" },
    { icon: Mail, title: "Email us", value: store.email, href: store.email && `mailto:${store.email}`, tint: "bg-sky-50 text-sky-600" },
    { icon: MapPin, title: "Visit our store", value: store.address, href: store.address && `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(store.address)}`, tint: "bg-violet-50 text-violet-600" },
    { icon: Clock, title: "Opening hours", value: store.hours, tint: "bg-amber-50 text-amber-600" },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map(({ icon: Icon, title, value, href, tint }, i) => {
        const content = (
          <>
            <div className={`flex h-12 w-12 items-center justify-center rounded-2xl transition-transform duration-500 group-hover:rotate-6 group-hover:scale-110 ${tint}`}>
              <Icon className="h-5 w-5" />
            </div>
            <p className="mt-4 text-sm font-semibold text-gray-900">{title}</p>
            {store.loading ? <span className="mt-2 block h-4 w-3/4 animate-pulse rounded bg-gray-100" /> : <p className="mt-1 text-sm text-gray-500">{value || "—"}</p>}
          </>
        );
        const className = "group block h-full rounded-2xl border border-gray-200/70 bg-surface p-5 shadow-sm shadow-gray-900/[0.03]";
        return (
          <Reveal key={title} delay={stagger(i)} className="h-full">
            {href && value ? (
              <a href={href} target={title === "Visit our store" ? "_blank" : undefined} rel="noopener noreferrer" className={`${className} hover-lift hover:border-brand/30`}>
                {content}
              </a>
            ) : (
              <div className={className}>{content}</div>
            )}
          </Reveal>
        );
      })}
    </div>
  );
}
