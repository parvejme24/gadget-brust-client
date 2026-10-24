"use client";

import { Loader2, Lock, Package } from "lucide-react";
import { formatTaka } from "@/lib/format";
import CouponBox from "./CouponBox";
import Reveal from "@/components/Shared/Motion/Reveal";

// cart lines with server-calculated totals and the place-order button
export default function CheckoutSummary({ items, quote, quoting, quoteError, coupon, couponError, onApplyCoupon, onRemoveCoupon, placing, onPlace, canPlace }) {
  return (
    <Reveal as="aside" variant="right" delay={150} className="rounded-3xl border border-gray-200/70 bg-surface p-5 shadow-sm shadow-gray-900/[0.03] sm:p-6 lg:sticky lg:top-40">
      <h2 className="text-lg font-bold text-gray-900">Your order</h2>
      <ul className="mt-4 max-h-72 space-y-3 overflow-y-auto pr-1">
        {items.map((item) => (
          <li key={item._id} className="flex items-center gap-3">
            <span className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gray-50 ring-1 ring-gray-100">
              {item.image ? <img src={item.image} alt="" className="h-full w-full object-contain p-1" /> : <Package className="h-5 w-5 text-gray-300" />}
              <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-gray-900 px-1 text-[11px] font-bold text-white">{item.qty}</span>
            </span>
            <span className="line-clamp-2 min-w-0 flex-1 text-sm font-medium text-gray-900">{item.title}</span>
            <span className="shrink-0 text-sm font-semibold text-gray-900">{formatTaka(item.finalPrice * item.qty)}</span>
          </li>
        ))}
      </ul>

      <div className="mt-5 border-t border-gray-100 pt-5">
        <CouponBox applied={coupon} error={couponError} checking={quoting} onApply={onApplyCoupon} onRemove={onRemoveCoupon} />
      </div>

      <dl className="mt-5 space-y-2.5 text-sm">
        <div className="flex justify-between"><dt className="text-gray-600">Subtotal</dt><dd className="font-semibold text-gray-900">{formatTaka(quote?.subtotal ?? items.reduce((s, i) => s + i.finalPrice * i.qty, 0))}</dd></div>
        {quote?.discount > 0 && <div className="flex justify-between"><dt className="text-gray-600">Discount{quote.coupon ? ` (${quote.coupon.code})` : ""}</dt><dd className="font-semibold text-red-600">−{formatTaka(quote.discount)}</dd></div>}
        <div className="flex justify-between">
          <dt className="text-gray-600">Delivery</dt>
          <dd className="font-semibold text-gray-900">{quote ? (quote.shippingCharge ? formatTaka(quote.shippingCharge) : "Free") : "—"}</dd>
        </div>
        <div className="flex items-baseline justify-between border-t border-gray-200 pt-4">
          <dt className="text-base font-bold text-gray-900">Total</dt>
          <dd className="flex items-center gap-2 text-2xl font-extrabold text-gray-900">
            {quoting && <Loader2 className="h-4 w-4 animate-spin text-gray-400" />}
            {quote ? formatTaka(quote.total) : "—"}
          </dd>
        </div>
      </dl>
      {quoteError && <p className="mt-3 rounded-xl bg-red-50 px-3 py-2.5 text-sm text-red-700">{quoteError}</p>}

      <p className="mt-5 rounded-xl bg-gray-50 px-4 py-3 text-sm text-gray-600">
        <span className="font-semibold text-gray-900">Cash on delivery.</span> Pay when your order arrives.
      </p>

      <button
        type="button"
        onClick={onPlace}
        disabled={!canPlace || placing}
        className="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-brand font-semibold text-white shadow-lg shadow-brand/25 transition hover:bg-brand-dark disabled:opacity-60"
      >
        {placing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Lock className="h-4 w-4" />}
        Place order{quote ? ` · ${formatTaka(quote.total)}` : ""}
      </button>
      <p className="mt-3 text-center text-xs text-gray-500">No account needed. We&apos;ll call you to confirm.</p>
    </Reveal>
  );
}
