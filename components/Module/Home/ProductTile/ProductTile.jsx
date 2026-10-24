"use client";

import Link from "next/link";
import { Check, Heart, Package, ShoppingCart, Star } from "lucide-react";
import { useShopCart, useShopWishlist } from "@/lib/hooks/useShop";
import { formatTaka, getFinalPrice } from "@/lib/format";
import Reveal, { stagger } from "@/components/Shared/Motion/Reveal";

export function ProductTileSkeleton() {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-3 animate-pulse">
      <div className="aspect-square rounded-xl bg-gray-100" />
      <div className="mt-4 h-3 w-1/3 rounded bg-gray-100" />
      <div className="mt-3 h-4 w-full rounded bg-gray-100" />
      <div className="mt-2 h-4 w-2/3 rounded bg-gray-100" />
      <div className="mt-4 h-9 w-full rounded-lg bg-gray-100" />
    </div>
  );
}

export function WishlistHeart({ product, className = "" }) {
  const { isWishlisted, toggle } = useShopWishlist();
  const active = isWishlisted(product._id);

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        toggle(product);
      }}
      aria-label={active ? "Remove from wishlist" : "Add to wishlist"}
      aria-pressed={active}
      className={`flex h-9 w-9 items-center justify-center rounded-full bg-white/95 shadow-sm ring-1 ring-gray-100 transition hover:scale-110 ${className}`}
    >
      <Heart className={`h-4 w-4 transition-colors ${active ? "fill-red-500 text-red-500" : "text-gray-600"}`} />
    </button>
  );
}

// index (position in a grid) staggers the reveal animation
export default function ProductTile({ product, index = 0 }) {
  const { add, isInCart } = useShopCart();
  const finalPrice = getFinalPrice(product);
  const hasDiscount = finalPrice < product.price;
  const outOfStock = product?.stock === 0;
  const lowStock = !outOfStock && product?.stock > 0 && product.stock <= 10;
  const rating = Number(product?.star) || 0;
  const href = `/products/${product._id}`;
  const brandName = typeof product.brand === "object" ? product.brand?.brandName : null;
  const inCart = isInCart(product._id);

  return (
    <Reveal variant="up" delay={stagger(index % 10, 60)} className="h-full">
      <div className="group relative flex h-full flex-col rounded-2xl border border-gray-100 bg-white p-3 transition-all duration-300 hover:-translate-y-1 hover:border-brand/30 hover:shadow-xl hover:shadow-brand/10">
        <Link href={href} className="relative block aspect-square overflow-hidden rounded-xl bg-gray-50">
          {product?.image?.url ? (
            <img
              src={product.image.url}
              alt={product.title}
              loading="lazy"
              className="h-full w-full object-contain p-5 transition-transform duration-500 group-hover:scale-110"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <Package className="h-12 w-12 text-gray-300" />
            </div>
          )}

          <div className="absolute left-2 top-2 flex flex-col gap-1">
            {hasDiscount && (
              <span className="rounded-full bg-red-500 px-2 py-0.5 text-[11px] font-bold text-white">
                -{product.discount}%
              </span>
            )}
            {product?.remark === "new" && (
              <span className="rounded-full bg-brand px-2 py-0.5 text-[11px] font-bold text-white">
                NEW
              </span>
            )}
          </div>

          {outOfStock && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/60 backdrop-blur-[1px]">
              <span className="rounded-full bg-gray-900 px-3 py-1 text-xs font-semibold text-white">
                Out of stock
              </span>
            </div>
          )}
        </Link>

        <WishlistHeart product={product} className="absolute right-5 top-5" />

        <div className="flex flex-1 flex-col pt-3">
          <div className="flex items-center justify-between gap-2 text-xs text-gray-500">
            <span className="truncate">{brandName || product.subcategory || "Gadget"}</span>
            {rating > 0 && (
              <span className="inline-flex shrink-0 items-center gap-0.5 font-medium text-gray-700">
                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                {rating.toFixed(1)}
              </span>
            )}
          </div>

          <Link href={href}>
            <h3 className="mt-1 line-clamp-2 min-h-[2.5rem] text-sm font-semibold leading-5 text-gray-900 transition-colors hover:text-brand">
              {product.title}
            </h3>
          </Link>

          <div className="mt-2 flex flex-wrap items-baseline gap-x-2">
            <span className="text-lg font-bold text-gray-900">{formatTaka(finalPrice)}</span>
            {hasDiscount && (
              <span className="text-xs text-gray-400 line-through">{formatTaka(product.price)}</span>
            )}
          </div>
          {lowStock && (
            <p className="mt-1 text-xs font-medium text-orange-500">Only {product.stock} left</p>
          )}

          <div className="mt-auto pt-3">
            <button
              type="button"
              onClick={() => add(product)}
              disabled={outOfStock}
              className={`flex h-10 w-full items-center justify-center gap-2 rounded-xl text-sm font-semibold transition-colors ${
                outOfStock
                  ? "bg-gray-100 text-gray-400"
                  : inCart
                  ? "bg-brand text-white hover:bg-brand-dark"
                  : "bg-brand-light text-brand-dark hover:bg-brand hover:text-white"
              }`}
            >
              {inCart ? <Check className="h-4 w-4" /> : <ShoppingCart className="h-4 w-4" />}
              {outOfStock ? "Unavailable" : inCart ? "In Cart" : "Add to Cart"}
            </button>
          </div>
        </div>
      </div>
    </Reveal>
  );
}
