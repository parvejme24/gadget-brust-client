"use client";

import Link from "next/link";
import { toast } from "sonner";
import { Heart, Package, ShoppingCart, Trash2, X } from "lucide-react";
import { useShopCart, useShopWishlist } from "@/lib/hooks/useShop";
import { formatTaka } from "@/lib/format";
import PageHero from "@/components/Module/Shop/PageHero";
import ProductSuggestions from "@/components/Module/Shop/ProductSuggestions";
import Reveal, { stagger } from "@/components/Shared/Motion/Reveal";

export default function WishlistPage() {
  const wishlist = useShopWishlist();
  const cart = useShopCart();
  const inStockItems = wishlist.items.filter((item) => item.stock > 0);

  const moveToCart = (item) => {
    cart.add(item, 1, { openDrawer: false });
    wishlist.remove(item._id);
  };

  const addAllToCart = () => {
    inStockItems.forEach((item) => cart.add(item, 1, { openDrawer: false, silent: true }));
    toast.success(`${inStockItems.length} item${inStockItems.length > 1 ? "s" : ""} added to cart`);
    cart.open();
  };

  if (!cart.hydrated) {
    return <div className="min-h-[60vh]" />;
  }

  return (
    <div className="pb-16">
      <PageHero
        title="My Wishlist"
        subtitle={wishlist.count ? `${wishlist.count} saved item${wishlist.count > 1 ? "s" : ""}. Saved on this device, no account needed.` : "Save products you love and come back to them anytime."}
        crumbs={[{ label: "Wishlist" }]}
      >
        {wishlist.count > 0 && (
          <div className="flex flex-wrap gap-2">
            {inStockItems.length > 0 && (
              <button onClick={addAllToCart} className="inline-flex items-center gap-2 rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-dark">
                <ShoppingCart className="h-4 w-4" /> Add all to cart
              </button>
            )}
            <button
              onClick={() => {
                wishlist.clear();
                toast("Wishlist cleared");
              }}
              className="inline-flex items-center gap-2 rounded-full border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-700 hover:border-red-300 hover:text-red-600"
            >
              <Trash2 className="h-4 w-4" /> Clear all
            </button>
          </div>
        )}
      </PageHero>

      <div className="container mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
        {wishlist.count === 0 ? (
          <div className="flex flex-col items-center rounded-3xl border border-dashed border-gray-200 bg-gray-50/60 px-6 py-16 text-center">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-red-50">
              <Heart className="h-11 w-11 text-red-400" />
            </div>
            <h2 className="mt-6 text-2xl font-bold text-gray-900">Your wishlist is empty</h2>
            <p className="mt-2 max-w-sm text-gray-500">Tap the heart on any product to save it here for later.</p>
            <Link href="/products" className="mt-6 rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white hover:bg-brand-dark">
              Explore products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {wishlist.items.map((item, i) => {
              const outOfStock = item.stock === 0;
              return (
                <Reveal variant="zoom" delay={stagger(i, 60)} key={item._id} className="group relative flex flex-col rounded-2xl border border-gray-100 bg-white p-3 transition hover:border-brand/30 hover:shadow-xl hover:shadow-brand/10">
                  <button
                    onClick={() => wishlist.remove(item._id)}
                    aria-label={`Remove ${item.title} from wishlist`}
                    className="absolute right-5 top-5 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white text-gray-500 shadow-sm ring-1 ring-gray-100 hover:text-red-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                  <Link href={`/products/${item._id}`} className="relative flex aspect-square items-center justify-center overflow-hidden rounded-xl bg-gray-50">
                    {item.image ? (
                      <img src={item.image} alt={item.title} className="h-full w-full object-contain p-5 transition-transform duration-500 group-hover:scale-110" />
                    ) : (
                      <Package className="h-10 w-10 text-gray-300" />
                    )}
                    {item.discount > 0 && (
                      <span className="absolute left-2 top-2 rounded-full bg-red-500 px-2 py-0.5 text-[11px] font-bold text-white">-{item.discount}%</span>
                    )}
                  </Link>
                  <div className="flex flex-1 flex-col pt-3">
                    {item.brandName && <p className="text-xs text-gray-500">{item.brandName}</p>}
                    <Link href={`/products/${item._id}`} className="mt-1 line-clamp-2 min-h-[2.5rem] text-sm font-semibold text-gray-900 hover:text-brand">
                      {item.title}
                    </Link>
                    <p className="mt-2 text-lg font-bold text-gray-900">
                      {formatTaka(item.finalPrice)}
                      {item.finalPrice < item.price && <span className="ml-2 text-xs font-normal text-gray-400 line-through">{formatTaka(item.price)}</span>}
                    </p>
                    <p className={`text-xs font-medium ${outOfStock ? "text-red-600" : "text-brand-dark"}`}>{outOfStock ? "Out of stock" : "In stock"}</p>
                    <button
                      onClick={() => moveToCart(item)}
                      disabled={outOfStock}
                      className="mt-3 flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-gray-900 text-sm font-semibold text-white transition hover:bg-brand disabled:bg-gray-100 disabled:text-gray-400"
                    >
                      <ShoppingCart className="h-4 w-4" /> Move to cart
                    </button>
                  </div>
                </Reveal>
              );
            })}
          </div>
        )}

        <ProductSuggestions excludeIds={wishlist.items.map((i) => i._id)} />
      </div>
    </div>
  );
}
