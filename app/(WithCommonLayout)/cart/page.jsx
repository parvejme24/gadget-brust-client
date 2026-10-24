"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ArrowLeft, ArrowRight, Heart, Lock, Minus, Package, Plus, RotateCcw, ShieldCheck, ShoppingBag, Trash2, Truck } from "lucide-react";
import paymentSystem from "@/assets/payment-system.svg";
import { useShopCart, useShopWishlist } from "@/lib/hooks/useShop";
import { useSession } from "@/lib/hooks/useSession";
import { useShippingMethods } from "@/lib/hooks/useStorefront";
import { deliveryCharge, formatTaka } from "@/lib/format";
import PageHero from "@/components/Module/Shop/PageHero";
import ProductSuggestions from "@/components/Module/Shop/ProductSuggestions";
import Reveal, { stagger } from "@/components/Shared/Motion/Reveal";

export default function CartPage() {
  const router = useRouter();
  const { user } = useSession();
  const cart = useShopCart();
  const wishlist = useShopWishlist();
  const { data: methods = [] } = useShippingMethods();
  const [methodId, setMethodId] = useState("");
  const method = methods.find((m) => m._id === methodId) || methods[0];

  // delivery options and charges come from the store's shipping methods
  const deliveryFee = cart.items.length ? deliveryCharge(method, cart.subtotal) : 0;
  const total = cart.subtotal + deliveryFee;
  const freeDelivery = cart.freeDeliveryThreshold > 0 && cart.freeDeliveryRemaining === 0;

  const moveToWishlist = (item) => {
    if (!wishlist.isWishlisted(item._id)) wishlist.toggle(item);
    cart.remove(item._id);
  };

  // guests can check out too; signed-in customers get the order in their account
  const checkout = () => router.push("/checkout");

  if (!cart.hydrated) {
    return <div className="min-h-[60vh]" />;
  }

  return (
    <div className="pb-16">
      <PageHero
        title="Shopping Cart"
        subtitle={cart.count ? `${cart.count} item${cart.count > 1 ? "s" : ""} in your cart` : "Your cart is waiting to be filled"}
        crumbs={[{ label: "Cart" }]}
      >
        <Link href="/products" className="inline-flex items-center gap-2 rounded-full border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 hover:border-brand hover:text-brand">
          <ArrowLeft className="h-4 w-4" /> Continue shopping
        </Link>
      </PageHero>

      <div className="container mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
        {cart.items.length === 0 ? (
          <div className="flex flex-col items-center rounded-3xl border border-dashed border-gray-200 bg-gray-50/60 px-6 py-16 text-center">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-brand-light">
              <ShoppingBag className="h-11 w-11 text-brand" />
            </div>
            <h2 className="mt-6 text-2xl font-bold text-gray-900">Your cart is empty</h2>
            <p className="mt-2 max-w-sm text-gray-500">Browse our latest gadgets and add your favourites. No account needed.</p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link href="/products" className="rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white hover:bg-brand-dark">
                Start shopping
              </Link>
              {wishlist.count > 0 && (
                <Link href="/wishlist" className="rounded-full border border-gray-200 bg-white px-6 py-3 text-sm font-semibold text-gray-800 hover:border-brand">
                  View wishlist ({wishlist.count})
                </Link>
              )}
            </div>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-3">
            {/* items */}
            <div className="lg:col-span-2">
              {cart.freeDeliveryThreshold > 0 && (
              <div className="mb-4 rounded-2xl bg-brand-light/60 p-4">
                <p className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <Truck className="h-4 w-4 text-brand" />
                  {freeDelivery ? (
                    <span className="font-semibold text-brand-dark">Nice! Your order qualifies for free delivery.</span>
                  ) : (
                    <>Add <span className="font-bold text-gray-900">{formatTaka(cart.freeDeliveryRemaining)}</span> more to get free delivery</>
                  )}
                </p>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-white">
                  <div className="h-full rounded-full bg-brand transition-all duration-500" style={{ width: `${cart.freeDeliveryProgress}%` }} />
                </div>
              </div>
              )}

              <ul className="divide-y divide-gray-100 rounded-2xl border border-gray-200/70 bg-surface shadow-sm shadow-gray-900/[0.03]">
                {cart.items.map((item, i) => (
                  <Reveal as="li" variant="left" delay={stagger(i, 60)} key={item._id} className="flex gap-4 p-4 sm:p-5">
                    <Link href={`/products/${item._id}`} className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gray-50 sm:h-28 sm:w-28">
                      {item.image ? <img src={item.image} alt="" className="h-full w-full object-contain p-2" /> : <Package className="h-8 w-8 text-gray-300" />}
                    </Link>
                    <div className="flex min-w-0 flex-1 flex-col">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          {item.brandName && <p className="text-xs font-medium text-gray-500">{item.brandName}</p>}
                          <Link href={`/products/${item._id}`} className="line-clamp-2 font-semibold text-gray-900 hover:text-brand">
                            {item.title}
                          </Link>
                          <p className="mt-1 text-sm text-gray-500">
                            {formatTaka(item.finalPrice)} each
                            {item.finalPrice < item.price && <span className="ml-2 text-xs text-gray-400 line-through">{formatTaka(item.price)}</span>}
                          </p>
                        </div>
                        <p className="hidden shrink-0 text-right text-lg font-bold text-gray-900 sm:block">{formatTaka(item.finalPrice * item.qty)}</p>
                      </div>

                      <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-3">
                        <div className="flex h-10 items-center rounded-xl border border-gray-200">
                          <button onClick={() => cart.updateQty(item._id, item.qty - 1)} disabled={item.qty <= 1} aria-label="Decrease quantity" className="flex h-full w-10 items-center justify-center text-gray-500 hover:text-gray-900 disabled:opacity-30">
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="w-8 text-center font-semibold tabular-nums">{item.qty}</span>
                          <button onClick={() => cart.updateQty(item._id, item.qty + 1)} disabled={item.stock > 0 && item.qty >= item.stock} aria-label="Increase quantity" className="flex h-full w-10 items-center justify-center text-gray-500 hover:text-gray-900 disabled:opacity-30">
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                        <p className="text-base font-bold text-gray-900 sm:hidden">{formatTaka(item.finalPrice * item.qty)}</p>
                        <div className="flex items-center gap-1 text-sm">
                          <button onClick={() => moveToWishlist(item)} className="flex items-center gap-1.5 rounded-lg px-3 py-2 font-medium text-gray-600 hover:bg-gray-50 hover:text-brand">
                            <Heart className="h-4 w-4" /> <span className="hidden sm:inline">Save for later</span>
                          </button>
                          <button onClick={() => cart.remove(item._id)} className="flex items-center gap-1.5 rounded-lg px-3 py-2 font-medium text-gray-600 hover:bg-red-50 hover:text-red-600">
                            <Trash2 className="h-4 w-4" /> <span className="hidden sm:inline">Remove</span>
                          </button>
                        </div>
                      </div>
                      {item.stock > 0 && item.stock <= 10 && (
                        <p className="mt-2 text-xs font-medium text-orange-600">Only {item.stock} left in stock</p>
                      )}
                    </div>
                  </Reveal>
                ))}
              </ul>

              <div className="mt-4 flex justify-end">
                <button
                  onClick={() => {
                    cart.clear();
                    toast("Cart cleared");
                  }}
                  className="text-sm font-medium text-gray-500 hover:text-red-600"
                >
                  Clear cart
                </button>
              </div>
            </div>

            {/* summary */}
            <aside id="summary" className="lg:sticky lg:top-40 lg:self-start">
              <div className="rounded-2xl border border-gray-200/70 bg-surface p-6 shadow-sm shadow-gray-900/[0.03]">
                <h2 className="text-lg font-bold text-gray-900">Order summary</h2>

                {methods.length > 0 && (
                  <fieldset className="mt-5">
                    <legend className="text-sm font-medium text-gray-700">Delivery</legend>
                    <div className="mt-2 grid grid-cols-2 gap-2">
                      {methods.map((option) => {
                        const fee = deliveryCharge(option, cart.subtotal);
                        return (
                          <label
                            key={option._id}
                            className={`cursor-pointer rounded-xl border p-3 text-sm transition ${
                              method?._id === option._id ? "border-brand bg-white ring-2 ring-brand/20" : "border-gray-200 bg-white hover:border-gray-300"
                            }`}
                          >
                            <input type="radio" name="delivery" value={option._id} checked={method?._id === option._id} onChange={() => setMethodId(option._id)} className="sr-only" />
                            <span className="block font-semibold text-gray-900">{option.name}</span>
                            <span className="text-xs text-gray-500">
                              {fee ? formatTaka(fee) : "Free"} · {option.estimatedDays?.min}-{option.estimatedDays?.max} days
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  </fieldset>
                )}

                <dl className="mt-6 space-y-3 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-gray-600">Subtotal ({cart.count} items)</dt>
                    <dd className="font-semibold text-gray-900">{formatTaka(cart.subtotal)}</dd>
                  </div>
                  {cart.savings > 0 && (
                    <div className="flex justify-between">
                      <dt className="text-gray-600">You save</dt>
                      <dd className="font-semibold text-red-600">-{formatTaka(cart.savings)}</dd>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <dt className="text-gray-600">Delivery</dt>
                    <dd className={`font-semibold ${deliveryFee === 0 ? "text-brand-dark" : "text-gray-900"}`}>
                      {deliveryFee === 0 ? "Free" : formatTaka(deliveryFee)}
                    </dd>
                  </div>
                  <div className="flex items-baseline justify-between border-t border-gray-200 pt-4">
                    <dt className="text-base font-bold text-gray-900">Total</dt>
                    <dd className="text-2xl font-extrabold text-gray-900">{formatTaka(total)}</dd>
                  </div>
                </dl>

                <button onClick={checkout} className="mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-brand font-semibold text-white shadow-lg shadow-brand/25 transition hover:bg-brand-dark">
                  <Lock className="h-4 w-4" /> Proceed to checkout <ArrowRight className="h-4 w-4" />
                </button>
                {!user && (
                  <p className="mt-3 text-center text-xs text-gray-500">
                    No account needed. <Link href="/login?redirect=/checkout" className="font-semibold text-brand hover:underline">Sign in</Link> to save the order to your account.
                  </p>
                )}

                <div className="mt-6 space-y-2 border-t border-gray-200 pt-5 text-xs text-gray-600">
                  <p className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-brand" /> 100% genuine products with official warranty</p>
                  <p className="flex items-center gap-2"><RotateCcw className="h-4 w-4 text-brand" /> 7-day easy replacement policy</p>
                </div>
                <div className="mt-4 flex justify-center rounded-xl bg-gray-50 p-3">
                  <Image src={paymentSystem} alt="Accepted payment methods" className="h-5 w-auto" />
                </div>
              </div>
            </aside>
          </div>
        )}

        <ProductSuggestions excludeIds={cart.items.map((i) => i._id)} />
      </div>
    </div>
  );
}
