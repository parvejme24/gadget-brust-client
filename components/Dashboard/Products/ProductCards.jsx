import Link from "next/link";
import { Package, Star } from "lucide-react";
import { EmptyState, StatusPill, Toggle, formatTaka, stockStatus } from "@/components/Dashboard/Kit";
import ProductRowActions from "./ProductRowActions";

// grid layout: 1 column on phones, 2 on tablets, up to 4 on wide screens
export default function ProductCards({ products, loading, filtersActive, onDelete, onToggleSlider, sliderBusy }) {
  if (loading) {
    return (
      <div className="grid gap-4 p-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => <div key={i} className="h-80 animate-pulse rounded-2xl bg-gray-100" />)}
      </div>
    );
  }
  if (!products.length) {
    return (
      <EmptyState
        icon={Package}
        title={filtersActive ? "No products match these filters" : "No products yet"}
        text={filtersActive ? "Try a different search or clear the filters." : "Add your first product to start selling."}
      />
    );
  }
  return (
    <div className="grid gap-4 p-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
      {products.map((p) => (
        <article key={p._id} className="group flex flex-col overflow-hidden rounded-2xl border border-gray-200/70 bg-surface transition hover:border-gray-300 hover:shadow-lg hover:shadow-gray-900/5">
          <Link href={`/dashboard/products/${p._id}`} className="relative flex h-44 items-center justify-center bg-gray-50">
            {p.image?.url ? (
              <img src={p.image.url} alt="" className="h-full w-full object-contain p-5 transition-transform duration-300 group-hover:scale-105" />
            ) : (
              <Package className="h-10 w-10 text-gray-300" />
            )}
            <span className="absolute left-3 top-3">
              <StatusPill status={stockStatus(p.stock)} label={p.stock === 0 ? "Out of stock" : `${p.stock} in stock`} />
            </span>
            {p.discount > 0 && <span className="absolute right-3 top-3 rounded-full bg-red-500 px-2 py-0.5 text-[11px] font-bold text-white">-{p.discount}%</span>}
          </Link>
          <div className="flex flex-1 flex-col p-4">
            <p className="text-xs text-gray-500">{[p.category?.categoryName, p.brand?.brandName].filter(Boolean).join(" · ")}</p>
            <Link href={`/dashboard/products/${p._id}`} className="mt-1 line-clamp-2 font-semibold text-gray-900 hover:underline">{p.title}</Link>
            <div className="mt-2 flex items-baseline justify-between gap-2">
              <p className="text-lg font-bold text-gray-900">
                {formatTaka(p.discountPrice || p.price)}
                {p.discount > 0 && <span className="ml-1.5 text-xs font-normal text-gray-400 line-through">{formatTaka(p.price)}</span>}
              </p>
              <span className="inline-flex items-center gap-1 text-sm font-medium text-gray-700">
                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" /> {Number(p.star || 0).toFixed(1)}
              </span>
            </div>
            <div className="mt-auto flex items-center justify-between gap-2 border-t border-gray-100 pt-3">
              <label className="flex items-center gap-2 text-xs font-medium text-gray-600">
                <Toggle checked={!!p.isSlider} label={`Show ${p.title} in the home page slider`} disabled={sliderBusy} onChange={(v) => onToggleSlider(p, v)} />
                Slider
              </label>
              <ProductRowActions product={p} onDelete={onDelete} />
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
