"use client";

import Link from "next/link";
import { BadgeCheck, Check, Minus, Plus, RotateCcw, ShieldCheck, ShoppingCart, Truck, Zap } from "lucide-react";
import { useShippingMethods } from "@/lib/hooks/useStorefront";
import { deliveryCharge, formatTaka } from "@/lib/format";
import { Stars } from "./ReviewsSection";
import Reveal from "@/components/Shared/Motion/Reveal";

// title, rating, price, highlights, quantity and the buy buttons
export default function BuyBox({ product, brand, category, finalPrice, hasDiscount, avgRating, reviewCount, qty, onQty, inCart, onAddToCart, onBuyNow, onJump }) {
  const outOfStock = product.stock === 0;
  const lowStock = !outOfStock && product.stock <= 10;
  const { data: methods = [] } = useShippingMethods();
  // cheapest delivery option for this quantity
  const cheapest = methods.length ? Math.min(...methods.map((m) => deliveryCharge(m, finalPrice * qty))) : null;
  return (
    <Reveal variant="right" delay={120} className="lg:col-span-6">
      <div className="flex flex-wrap items-center gap-2">
        {brand && (
          <Link href={`/products?brand=${brand._id}`} className="inline-flex items-center gap-2 rounded-full border border-gray-200 px-3 py-1 text-xs font-semibold text-gray-700 hover:border-brand hover:text-brand">
            {brand.brandImg && <img src={brand.brandImg} alt="" className="h-3.5 w-auto" />}
            {brand.brandName}
          </Link>
        )}
        {category && (
          <Link href={`/products?category=${category._id}`} className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600 hover:bg-gray-200">
            {category.categoryName}
          </Link>
        )}
      </div>

      <h1 className="mt-3 text-2xl font-extrabold leading-tight tracking-tight text-gray-900 sm:text-3xl lg:text-4xl">{product.title}</h1>

      <button onClick={() => onJump("reviews")} className="mt-3 flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800">
        <Stars value={avgRating} />
        <span className="font-semibold text-gray-800">{avgRating.toFixed(1)}</span>
        <span className="underline-offset-2 hover:underline">{reviewCount} review{reviewCount === 1 ? "" : "s"}</span>
      </button>

      <p className="mt-4 leading-7 text-gray-600">{product.shortDescription}</p>

      {/* price */}
      <div className="mt-6 rounded-2xl border border-gray-200/70 bg-surface p-5 shadow-sm shadow-gray-900/[0.03]">
        <div className="flex flex-wrap items-baseline gap-3">
          <span className="text-3xl font-extrabold text-gray-900 sm:text-4xl">{formatTaka(finalPrice)}</span>
          {hasDiscount && (
            <>
              <span className="text-lg text-gray-400 line-through">{formatTaka(product.price)}</span>
              <span className="rounded-full bg-red-50 px-2.5 py-0.5 text-sm font-semibold text-red-600">Save {formatTaka(product.price - finalPrice)}</span>
            </>
          )}
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
          <span className={`inline-flex items-center gap-1.5 font-medium ${outOfStock ? "text-red-600" : lowStock ? "text-orange-600" : "text-brand-dark"}`}>
            <span className={`h-2 w-2 rounded-full ${outOfStock ? "bg-red-500" : lowStock ? "bg-orange-500" : "bg-brand"}`} />
            {outOfStock ? "Out of stock" : lowStock ? `Only ${product.stock} left` : "In stock"}
          </span>
          <span className="inline-flex items-center gap-1.5 text-gray-600">
            <Truck className="h-4 w-4 text-gray-400" />
            {cheapest === null ? "Delivery across Bangladesh" : cheapest === 0 ? "Free delivery" : `Delivery from ${formatTaka(cheapest)}`}
          </span>
        </div>
      </div>

      {/* quick highlights */}
      {product.keyFeatures?.length > 0 && (
        <ul className="mt-6 grid gap-x-6 gap-y-2.5 sm:grid-cols-2">
          {product.keyFeatures.slice(0, 4).map((feature) => (
            <li key={feature.key} className="flex items-start gap-2 text-sm">
              <BadgeCheck className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
              <span>
                <span className="text-gray-500">{feature.key}:</span>{" "}
                <span className="font-medium text-gray-900">{feature.values?.join(", ")}</span>
              </span>
            </li>
          ))}
        </ul>
      )}
      {product.keyFeatures?.length > 4 && (
        <button onClick={() => onJump("specifications")} className="mt-2 text-sm font-semibold text-brand hover:underline">
          See all specifications
        </button>
      )}

      {/* actions */}
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <div className="flex h-12 items-center justify-between rounded-xl border border-gray-200 sm:w-36">
          <button onClick={() => onQty(Math.max(1, qty - 1))} disabled={qty <= 1 || outOfStock} aria-label="Decrease quantity" className="flex h-full w-12 items-center justify-center text-gray-600 hover:text-gray-900 disabled:opacity-30">
            <Minus className="h-4 w-4" />
          </button>
          <span className="font-semibold tabular-nums" aria-live="polite">{qty}</span>
          <button onClick={() => onQty(Math.min(product.stock, qty + 1))} disabled={qty >= product.stock || outOfStock} aria-label="Increase quantity" className="flex h-full w-12 items-center justify-center text-gray-600 hover:text-gray-900 disabled:opacity-30">
            <Plus className="h-4 w-4" />
          </button>
        </div>
        <button
          onClick={onAddToCart}
          disabled={outOfStock}
          className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl border-2 border-gray-900 font-semibold text-gray-900 transition hover:bg-gray-900 hover:text-white disabled:border-gray-200 disabled:text-gray-400 disabled:hover:bg-transparent sm:w-auto sm:flex-1"
        >
          {inCart ? <Check className="h-5 w-5" /> : <ShoppingCart className="h-5 w-5" />}
          {inCart ? "Add more" : "Add to Cart"}
        </button>
        <button
          onClick={onBuyNow}
          disabled={outOfStock}
          className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-brand font-semibold text-white shadow-lg shadow-brand/25 transition hover:bg-brand-dark disabled:bg-gray-200 disabled:text-gray-400 disabled:shadow-none sm:w-auto sm:flex-1"
        >
          <Zap className="h-5 w-5" /> Buy Now
        </button>
      </div>

      {/* trust */}
      <div className="mt-6 grid grid-cols-3 gap-3 rounded-2xl border border-gray-200/70 bg-surface shadow-sm shadow-gray-900/[0.03] p-4">
        {[
          [Truck, "Fast delivery", "1-5 days"],
          [ShieldCheck, "Official warranty", "100% genuine"],
          [RotateCcw, "Easy returns", "7-day policy"],
        ].map(([Icon, title, text]) => (
          <div key={title} className="text-center">
            <Icon className="mx-auto h-5 w-5 text-brand" />
            <p className="mt-1.5 text-xs font-semibold text-gray-900 sm:text-sm">{title}</p>
            <p className="text-[11px] text-gray-500 sm:text-xs">{text}</p>
          </div>
        ))}
      </div>
    </Reveal>
  );
}
