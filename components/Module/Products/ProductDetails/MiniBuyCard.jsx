import { Package, ShieldCheck, ShoppingCart, Zap } from "lucide-react";
import { formatTaka } from "@/lib/format";

// sticky buy card beside the details on desktop
export default function MiniBuyCard({ product, finalPrice, hasDiscount, onAddToCart, onBuyNow }) {
  const outOfStock = product.stock === 0;
  return (
    <aside className="hidden lg:col-span-4 lg:block">
      <div className="sticky top-[13rem] mt-10 rounded-2xl border border-gray-200/70 bg-surface shadow-sm shadow-gray-900/[0.03] p-5 shadow-xl shadow-gray-900/5">
        <div className="flex gap-4">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gray-50">
            {product.image?.url ? <img src={product.image.url} alt="" className="h-full w-full object-contain p-2" /> : <Package className="h-6 w-6 text-gray-300" />}
          </div>
          <div className="min-w-0">
            <p className="line-clamp-2 text-sm font-semibold text-gray-900">{product.title}</p>
            <p className="mt-1 text-xl font-extrabold text-gray-900">{formatTaka(finalPrice)}</p>
            {hasDiscount && <p className="text-xs text-gray-400 line-through">{formatTaka(product.price)}</p>}
          </div>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2">
          <button onClick={onAddToCart} disabled={outOfStock} className="flex h-11 items-center justify-center gap-2 rounded-xl border-2 border-gray-900 text-sm font-semibold text-gray-900 transition hover:bg-gray-900 hover:text-white disabled:border-gray-200 disabled:text-gray-400 disabled:hover:bg-transparent">
            <ShoppingCart className="h-4 w-4" /> Add
          </button>
          <button onClick={onBuyNow} disabled={outOfStock} className="flex h-11 items-center justify-center gap-2 rounded-xl bg-brand text-sm font-semibold text-white transition hover:bg-brand-dark disabled:bg-gray-200 disabled:text-gray-400">
            <Zap className="h-4 w-4" /> Buy Now
          </button>
        </div>
        <p className="mt-3 flex items-center gap-1.5 text-xs text-gray-500">
          <ShieldCheck className="h-3.5 w-3.5 text-brand" /> Official warranty · 7-day replacement
        </p>
      </div>
    </aside>
  );
}
