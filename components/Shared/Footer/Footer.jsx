"use client";

import Image from "next/image";
import Link from "next/link";
import { FaFacebookF, FaYoutube, FaInstagram } from "react-icons/fa";
import { Clock, Headset, Mail, MapPin, Phone, RotateCcw, ShieldCheck, Truck } from "lucide-react";
import logo from "@/assets/logo.svg";
import paymentSystem from "@/assets/payment-system.svg";
import { useStoreInfo } from "@/lib/hooks/useStorefront";
import Reveal, { stagger } from "@/components/Shared/Motion/Reveal";

const linkGroups = [
  {
    title: "Shop",
    links: [
      { label: "All products", href: "/products" },
      { label: "Hot deals", href: "/products?sort=discount" },
      { label: "New arrivals", href: "/products?sort=newest" },
      { label: "Top rated", href: "/products?sort=rating" },
      { label: "Categories", href: "/categories" },
      { label: "Brands", href: "/brands" },
    ],
  },
  {
    title: "Customer care",
    links: [
      { label: "Contact us", href: "/contact" },
      { label: "My account", href: "/dashboard/dashboard" },
      { label: "Track your order", href: "/track-order" },
      { label: "Wishlist", href: "/wishlist" },
      { label: "Shopping cart", href: "/cart" },
      { label: "Sign in", href: "/login" },
    ],
  },
];

const perks = [
  { icon: Truck, title: "Nationwide delivery", text: "1-5 days across Bangladesh" },
  { icon: ShieldCheck, title: "Official warranty", text: "100% genuine products" },
  { icon: RotateCcw, title: "7-day returns", text: "Hassle-free replacement" },
  { icon: Headset, title: "Expert support", text: "Friendly help before and after you buy" },
];

const socialIcons = [
  { key: "facebook", label: "Facebook", icon: FaFacebookF },
  { key: "instagram", label: "Instagram", icon: FaInstagram },
  { key: "youtube", label: "YouTube", icon: FaYoutube },
];

export default function Footer() {
  const store = useStoreInfo();
  // only the social links set in store settings
  const socials = socialIcons.filter((s) => store.socials[s.key]).map((s) => ({ ...s, href: store.socials[s.key] }));
  return (
    <footer className="mt-auto bg-gray-950 text-gray-400">
      {/* perks */}
      <div className="border-b border-white/10">
        <div className="container mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 py-8 sm:px-6 lg:grid-cols-4 lg:px-8">
          {perks.map(({ icon: Icon, title, text }, i) => (
            <Reveal variant="up" delay={stagger(i, 80)} key={title} className="flex items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand/15 text-brand">
                <Icon className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-white">{title}</p>
                <p className="truncate text-xs">{text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      <div className="container mx-auto grid max-w-7xl grid-cols-2 gap-10 px-4 py-12 sm:px-6 lg:grid-cols-12 lg:px-8">
        <div className="col-span-2 lg:col-span-4">
          <Link href="/" className="inline-block rounded-xl bg-white px-3 py-2">
            <Image src={logo} alt={store.name} className="h-9 w-auto" />
          </Link>
          <p className="mt-4 max-w-sm text-sm leading-6">
            {store.tagline} Phones, laptops, audio, gaming and smart accessories from the brands you trust.
          </p>
          <div className="mt-5 flex gap-2">
            {socials.map(({ label, href, icon: Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-gray-300 transition hover:bg-brand hover:text-white"
              >
                <Icon size={15} />
              </a>
            ))}
          </div>
        </div>

        {linkGroups.map((group) => (
          <div key={group.title} className="lg:col-span-2">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">{group.title}</h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              {group.links.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="transition hover:text-brand">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div className="col-span-2 lg:col-span-4">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-white">Get in touch</h3>
          <ul className="mt-4 space-y-3 text-sm">
            {store.address && (
              <li className="flex gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                {store.address}
              </li>
            )}
            {store.phone && (
              <li>
                <a href={store.phoneHref} className="flex gap-3 transition hover:text-brand">
                  <Phone className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                  {store.phone}
                </a>
              </li>
            )}
            {store.email && (
              <li>
                <a href={`mailto:${store.email}`} className="flex gap-3 transition hover:text-brand">
                  <Mail className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                  {store.email}
                </a>
              </li>
            )}
            {store.hours && (
              <li className="flex gap-3">
                <Clock className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                {store.hours}
              </li>
            )}
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-6 text-xs sm:flex-row sm:px-6 lg:px-8">
          <p>© {new Date().getFullYear()} {store.name}. All rights reserved.</p>
          <div className="flex items-center gap-3">
            <span>We accept</span>
            <span className="rounded-lg bg-white px-3 py-1.5">
              <Image src={paymentSystem} alt="Accepted payment methods" className="h-5 w-auto" />
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
