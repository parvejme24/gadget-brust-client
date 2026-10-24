import Link from "next/link";
import { Package, Plus, Star } from "lucide-react";
import { DataTable, EmptyState, StatusPill, Toggle, buttonClass, formatTaka, stockStatus } from "@/components/Dashboard/Kit";
import ProductRowActions from "./ProductRowActions";

export default function ProductsTable({ products, loading, filtersActive, onDelete, onToggleSlider, sliderBusy }) {
  return (
    <DataTable
      loading={loading}
      rows={products}
      empty={
        <EmptyState
          icon={Package}
          title={filtersActive ? "No products match these filters" : "No products yet"}
          text={filtersActive ? "Try a different search or clear the filters." : "Add your first product to start selling."}
          action={!filtersActive && <Link href="/dashboard/products/add" className={buttonClass("primary")}><Plus className="h-4 w-4" /> Add product</Link>}
        />
      }
      columns={[
        {
          key: "product",
          header: "Product",
          render: (p) => (
            <Link href={`/dashboard/products/${p._id}`} className="flex min-w-[220px] items-center gap-3">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gray-50 ring-1 ring-gray-100">
                {p.image?.url ? <img src={p.image.url} alt="" className="h-full w-full object-contain p-1" /> : <Package className="h-5 w-5 text-gray-300" />}
              </span>
              <span className="min-w-0">
                <span className="line-clamp-1 font-semibold text-gray-900 hover:underline">{p.title}</span>
                <span className="text-xs text-gray-500">{p.subcategory}</span>
              </span>
            </Link>
          ),
        },
        { key: "category", header: "Category", hideBelow: "lg", render: (p) => p.category?.categoryName || "—" },
        { key: "brand", header: "Brand", hideBelow: "xl", render: (p) => p.brand?.brandName || "—" },
        {
          key: "price",
          header: "Price",
          render: (p) => (
            <div className="whitespace-nowrap">
              <p className="font-semibold text-gray-900">{formatTaka(p.discountPrice || p.price)}</p>
              {p.discount > 0 && <p className="text-xs text-gray-400"><span className="line-through">{formatTaka(p.price)}</span> -{p.discount}%</p>}
            </div>
          ),
        },
        { key: "stock", header: "Stock", render: (p) => <StatusPill status={stockStatus(p.stock)} label={p.stock === 0 ? "Out of stock" : `${p.stock} in stock`} /> },
        {
          key: "rating",
          header: "Rating",
          hideBelow: "md",
          render: (p) => (
            <span className="inline-flex items-center gap-1 font-medium">
              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" /> {Number(p.star || 0).toFixed(1)}
            </span>
          ),
        },
        {
          key: "featured",
          header: "Slider",
          hideBelow: "md",
          render: (p) => (
            <Toggle checked={!!p.isSlider} label={`Show ${p.title} in the home page slider`} disabled={sliderBusy} onChange={(v) => onToggleSlider(p, v)} />
          ),
        },
        {
          key: "actions",
          header: <span className="sr-only">Actions</span>,
          className: "text-right",
          render: (p) => <ProductRowActions product={p} onDelete={onDelete} />,
        },
      ]}
    />
  );
}
