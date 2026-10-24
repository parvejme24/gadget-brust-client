"use client";

import { Package, ShoppingCart, Trash2 } from "lucide-react";
import ProductPicker from "@/components/Dashboard/Products/ProductPicker";
import { QtyStepper, cx, formatTaka, getFinalPrice, inputClass } from "@/components/Dashboard/Kit";

// line from a product picked in ProductPicker
export const lineFromProduct = (p) => ({ product: p._id, title: p.title, image: p.image?.url, price: Math.round(getFinalPrice(p)), qty: 1, stock: p.stock });

// Editable order lines: change quantity and unit price, remove lines, add products.
// lines: [{ product, title, image, price, qty, stock? }]
export default function LineItemsEditor({ lines, onChange, editablePrice = true }) {
  const update = (id, patch) => onChange(lines.map((l) => (l.product === id ? { ...l, ...patch } : l)));
  const remove = (id) => onChange(lines.filter((l) => l.product !== id));
  const add = (p) => {
    const existing = lines.find((l) => l.product === p._id);
    if (existing) update(p._id, { qty: existing.qty + 1 });
    else onChange([...lines, lineFromProduct(p)]);
  };
  const subtotal = lines.reduce((s, l) => s + (Number(l.price) || 0) * l.qty, 0);

  return (
    <div className="space-y-3">
      <ProductPicker onPick={add} />
      {lines.length === 0 ? (
        <div className="flex flex-col items-center rounded-2xl border border-dashed border-gray-200 py-8 text-center">
          <ShoppingCart className="h-7 w-7 text-gray-300" />
          <p className="mt-2 text-sm text-gray-500">Search above to add products</p>
        </div>
      ) : (
        <ul className="divide-y divide-gray-100 rounded-2xl border border-gray-100">
          {lines.map((l) => (
            <li key={l.product} className="flex flex-wrap items-center gap-3 p-3 sm:flex-nowrap">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-gray-50">
                {l.image ? <img src={l.image} alt="" className="h-full w-full object-contain p-1" /> : <Package className="h-4 w-4 text-gray-300" />}
              </span>
              <div className="min-w-0 flex-1 basis-40">
                <p className="line-clamp-2 text-sm font-medium text-gray-900">{l.title}</p>
                {l.stock !== undefined && <p className={cx("text-xs", l.stock < l.qty ? "text-red-600" : "text-gray-500")}>{l.stock} in stock</p>}
              </div>
              <div className="flex w-full items-center gap-2 sm:w-auto">
                {editablePrice ? (
                  <label className="relative w-28 shrink-0">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">৳</span>
                    <input
                      type="number"
                      min="0"
                      value={l.price}
                      onChange={(e) => update(l.product, { price: e.target.value === "" ? "" : Math.max(0, Number(e.target.value)) })}
                      aria-label={`Unit price for ${l.title}`}
                      className={cx(inputClass, "h-9 pl-7 pr-2 text-right tabular-nums")}
                    />
                  </label>
                ) : (
                  <span className="w-24 text-sm text-gray-600">{formatTaka(l.price)}</span>
                )}
                <QtyStepper value={l.qty} onChange={(qty) => update(l.product, { qty: Math.max(1, qty) })} label={`Quantity for ${l.title}`} />
                <span className="ml-auto w-24 text-right text-sm font-semibold tabular-nums text-gray-900 sm:ml-0">{formatTaka((Number(l.price) || 0) * l.qty)}</span>
                <button type="button" onClick={() => remove(l.product)} aria-label={`Remove ${l.title}`} className="rounded-lg p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </li>
          ))}
          <li className="flex justify-between bg-gray-50/60 px-4 py-3 text-sm">
            <span className="text-gray-600">Items subtotal</span>
            <span className="font-semibold text-gray-900">{formatTaka(subtotal)}</span>
          </li>
        </ul>
      )}
    </div>
  );
}
