"use client";

import { toast } from "sonner";
import { Heart, Link2, Package } from "lucide-react";
import Reveal from "@/components/Shared/Motion/Reveal";

const copyLink = async () => {
  try {
    await navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied");
  } catch {
    toast.error("Couldn't copy the link");
  }
};

export default function ProductGallery({ product, hasDiscount, inWishlist, onToggleWishlist }) {
  return (
    <Reveal variant="zoom" className="lg:col-span-6 lg:sticky lg:top-40 lg:self-start">
      <div className="group relative aspect-square overflow-hidden rounded-3xl border border-gray-100 bg-gradient-to-br from-gray-50 via-white to-gray-100">
        {product.image?.url ? (
          <img src={product.image.url} alt={product.title} className="h-full w-full object-contain p-10 transition-transform duration-500 group-hover:scale-110 sm:p-14" />
        ) : (
          <div className="flex h-full items-center justify-center">
            <Package className="h-20 w-20 text-gray-300" />
          </div>
        )}
        <div className="absolute left-4 top-4 flex flex-col gap-2">
          {hasDiscount && <span className="rounded-full bg-red-500 px-3 py-1 text-sm font-bold text-white">-{product.discount}% OFF</span>}
          {product.remark && product.remark !== "regular" && (
            <span className="rounded-full bg-gray-900 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white">{product.remark}</span>
          )}
        </div>
        <div className="absolute right-4 top-4 flex flex-col gap-2">
          <button
            onClick={onToggleWishlist}
            aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
            aria-pressed={inWishlist}
            className="flex h-11 w-11 items-center justify-center rounded-full bg-white shadow-md transition hover:scale-110"
          >
            <Heart className={`h-5 w-5 ${inWishlist ? "fill-red-500 text-red-500" : "text-gray-700"}`} />
          </button>
          <button onClick={copyLink} aria-label="Copy product link" className="flex h-11 w-11 items-center justify-center rounded-full bg-white shadow-md transition hover:scale-110">
            <Link2 className="h-5 w-5 text-gray-700" />
          </button>
        </div>
      </div>
    </Reveal>
  );
}
