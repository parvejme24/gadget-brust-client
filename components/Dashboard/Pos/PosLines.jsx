import { Package, ShoppingCart, Trash2 } from "lucide-react";
import { QtyStepper, formatTaka } from "@/components/Dashboard/Kit";
import { unitPrice } from "./usePosSale";

export default function PosLines({ cart, onQty, onRemove, onClear }) {
  return (
    <div>
      <p className="flex items-center justify-between text-sm font-semibold text-gray-900">
        <span>Items ({cart.reduce((s, l) => s + l.qty, 0)})</span>
        {cart.length > 0 && <button type="button" onClick={onClear} className="text-xs font-semibold text-gray-500 hover:text-red-600">Clear</button>}
      </p>
      {cart.length === 0 ? (
        <div className="mt-2 flex flex-col items-center rounded-2xl border border-dashed border-gray-200 py-8 text-center">
          <ShoppingCart className="h-7 w-7 text-gray-300" />
          <p className="mt-2 text-sm text-gray-500">Tap products to add them</p>
        </div>
      ) : (
        <ul className="mt-2 divide-y divide-gray-100">
          {cart.map(({ product, qty }) => (
            <li key={product._id} className="flex items-center gap-3 py-2.5">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-gray-50">
                {product.image?.url ? <img src={product.image.url} alt="" className="h-full w-full object-contain p-1" /> : <Package className="h-4 w-4 text-gray-300" />}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-gray-900">{product.title}</p>
                <p className="text-xs text-gray-500">{formatTaka(unitPrice(product))} each</p>
              </div>
              <QtyStepper size="sm" value={qty} onChange={(q) => onQty(product._id, q)} max={product.stock} label={`Quantity for ${product.title}`} />
              <span className="w-20 text-right text-sm font-semibold tabular-nums text-gray-900">{formatTaka(unitPrice(product) * qty)}</span>
              <button type="button" onClick={() => onRemove(product._id)} aria-label={`Remove ${product.title}`} className="rounded-md p-1 text-gray-400 hover:bg-red-50 hover:text-red-600"><Trash2 className="h-4 w-4" /></button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
