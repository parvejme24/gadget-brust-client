"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import Reveal from "@/components/Shared/Motion/Reveal";

// compact page header with breadcrumb, used by cart, wishlist, categories, brands and contact
export default function PageHero({ title, subtitle, crumbs = [], children }) {
  return (
    <div className="border-b border-gray-100 bg-gradient-to-b from-surface to-canvas">
      <div className="container mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <nav className="flex flex-wrap items-center gap-1.5 text-xs text-gray-500" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-brand">Home</Link>
          {crumbs.map((crumb) => (
            <span key={crumb.label} className="flex items-center gap-1.5">
              <ChevronRight className="h-3 w-3" />
              {crumb.href ? (
                <Link href={crumb.href} className="hover:text-brand">{crumb.label}</Link>
              ) : (
                <span className="text-gray-900">{crumb.label}</span>
              )}
            </span>
          ))}
        </nav>
        <Reveal variant="blur" className="mt-3 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">{title}</h1>
            {subtitle && <p className="mt-2 max-w-2xl text-gray-500">{subtitle}</p>}
          </div>
          {children}
        </Reveal>
      </div>
    </div>
  );
}
