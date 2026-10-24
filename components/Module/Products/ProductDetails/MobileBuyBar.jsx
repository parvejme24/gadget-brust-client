import { ShoppingCart } from "lucide-react";
import { formatTaka } from "@/lib/format";

// fixed bottom bar on phones and tablets
export default function MobileBuyBar({ product, finalPrice, hasDiscount, onAddToCart, onBuyNow }) {
  const outOfStock = product.stock === 0;
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-gray-100 bg-white/95 p-3 backdrop-blur lg:hidden">
      <div className="flex items-center gap-3">
        <div className="min-w-0">
          <p className="text-lg font-extrabold leading-tight text-gray-900">{formatTaka(finalPrice)}</p>
          {hasDiscount && <p className="text-xs text-gray-400 line-through">{formatTaka(product.price)}</p>}
        </div>
        <button onClick={onAddToCart} disabled={outOfStock} className="ml-auto flex h-11 items-center gap-2 rounded-xl border-2 border-gray-900 px-4 text-sm font-semibold text-gray-900 disabled:border-gray-200 disabled:text-gray-400">
          <ShoppingCart className="h-4 w-4" /> Add
        </button>
        <button onClick={onBuyNow} disabled={outOfStock} className="flex h-11 items-center gap-2 rounded-xl bg-brand px-5 text-sm font-semibold text-white disabled:bg-gray-200 disabled:text-gray-400">
          Buy Now
        </button>
      </div>
    </div>
  );
}
