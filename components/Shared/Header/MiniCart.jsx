"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Minus, Package, Plus, ShoppingBag, Trash2, Truck, X } from "lucide-react";
import { useShopCart } from "@/lib/hooks/useShop";
import { formatTaka } from "@/lib/format";

export default function MiniCart() {
  const { items, count, subtotal, isOpen, close, updateQty, remove, freeDeliveryThreshold, freeDeliveryRemaining, freeDeliveryProgress } = useShopCart();

  useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = "hidden";
    const onKey = (e) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  return (
    <div className={`fixed inset-0 z-[70] ${isOpen ? "" : "pointer-events-none"}`} aria-hidden={!isOpen}>
      <div
        onClick={close}
        className={`absolute inset-0 bg-gray-900/40 backdrop-blur-[2px] transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0"}`}
      />
      <aside
        role="dialog"
        aria-label="Shopping cart"
        className={`absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-white shadow-2xl transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
          <h2 className="flex items-center gap-2 text-lg font-bold text-gray-900">
            <ShoppingBag className="h-5 w-5" />
            Your Cart
            <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-semibold text-gray-600">{count}</span>
          </h2>
          <button onClick={close} aria-label="Close cart" className="rounded-full p-2 hover:bg-gray-100">
            <X className="h-5 w-5" />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-brand-light">
              <ShoppingBag className="h-9 w-9 text-brand" />
            </div>
            <p className="mt-4 text-lg font-semibold text-gray-900">Your cart is empty</p>
            <p className="mt-1 text-sm text-gray-500">Find something you love and it will show up here.</p>
            <Link href="/products" onClick={close} className="mt-6 rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white hover:bg-brand-dark">
              Start shopping
            </Link>
          </div>
        ) : (
          <>
            {freeDeliveryThreshold > 0 && (
            <div className="border-b border-gray-100 px-5 py-3">
              <p className="flex items-center gap-2 text-xs font-medium text-gray-600">
                <Truck className="h-4 w-4 text-brand" />
                {freeDeliveryRemaining > 0 ? (
                  <>Add <span className="font-bold text-gray-900">{formatTaka(freeDeliveryRemaining)}</span> more for free delivery</>
                ) : (
                  <span className="font-semibold text-brand-dark">You&apos;ve unlocked free delivery!</span>
                )}
              </p>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-gray-100">
                <div className="h-full rounded-full bg-brand transition-all duration-500" style={{ width: `${freeDeliveryProgress}%` }} />
              </div>
            </div>
            )}

            <ul className="flex-1 divide-y divide-gray-100 overflow-y-auto px-5">
              {items.map((item) => (
                <li key={item._id} className="flex gap-3 py-4">
                  <Link href={`/products/${item._id}`} onClick={close} className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gray-50">
                    {item.image ? <img src={item.image} alt="" className="h-full w-full object-contain p-2" /> : <Package className="h-6 w-6 text-gray-300" />}
                  </Link>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <Link href={`/products/${item._id}`} onClick={close} className="line-clamp-2 text-sm font-medium text-gray-900 hover:text-brand">
                      {item.title}
                    </Link>
                    <p className="mt-1 text-sm font-bold text-gray-900">
                      {formatTaka(item.finalPrice)}
                      {item.finalPrice < item.price && (
                        <span className="ml-1.5 text-xs font-normal text-gray-400 line-through">{formatTaka(item.price)}</span>
                      )}
                    </p>
                    <div className="mt-auto flex items-center justify-between pt-2">
                      <div className="flex h-8 items-center rounded-lg border border-gray-200">
                        <button onClick={() => updateQty(item._id, item.qty - 1)} disabled={item.qty <= 1} aria-label="Decrease quantity" className="flex h-full w-8 items-center justify-center text-gray-500 hover:text-gray-900 disabled:opacity-30">
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="w-6 text-center text-sm font-semibold tabular-nums">{item.qty}</span>
                        <button onClick={() => updateQty(item._id, item.qty + 1)} disabled={item.stock > 0 && item.qty >= item.stock} aria-label="Increase quantity" className="flex h-full w-8 items-center justify-center text-gray-500 hover:text-gray-900 disabled:opacity-30">
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <button onClick={() => remove(item._id)} aria-label={`Remove ${item.title}`} className="rounded-lg p-2 text-gray-400 hover:bg-red-50 hover:text-red-500">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <div className="border-t border-gray-100 bg-gray-50/80 p-5">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Subtotal</span>
                <span className="text-xl font-extrabold text-gray-900">{formatTaka(subtotal)}</span>
              </div>
              <p className="mt-1 text-xs text-gray-500">Delivery calculated in the cart.</p>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <Link href="/cart" onClick={close} className="flex h-12 items-center justify-center rounded-xl border border-gray-300 bg-white text-sm font-semibold text-gray-900 hover:bg-gray-100">
                  View cart
                </Link>
                <Link href="/checkout" onClick={close} className="flex h-12 items-center justify-center rounded-xl bg-brand text-sm font-semibold text-white shadow-lg shadow-brand/25 hover:bg-brand-dark">
                  Checkout
                </Link>
              </div>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
