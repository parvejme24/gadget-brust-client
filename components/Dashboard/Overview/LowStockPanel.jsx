import Link from "next/link";
import { Package, PackageX } from "lucide-react";
import { useAdminProducts } from "@/lib/hooks/useAdmin";
import { EmptyState, Panel, StatusPill } from "@/components/Dashboard/Kit";

// products with the least stock first
export default function LowStockPanel({ limit = 6, className, editHref = (p) => `/dashboard/products/edit/${p._id}` }) {
  const { data } = useAdminProducts({ limit, sortBy: "stock", sortOrder: "asc" });
  const products = (data?.products || data?.data || []).filter((p) => p.stock <= 10);

  return (
    <Panel
      className={className}
      title="Low stock"
      description="Restock these soon"
      action={<Link href="/dashboard/products?stock=low" className="text-xs font-semibold text-gray-500 hover:text-gray-900">View all</Link>}
    >
      {products.length === 0 ? (
        <EmptyState icon={PackageX} title="Stock levels look healthy" className="py-8" />
      ) : (
        <ul className="space-y-3">
          {products.map((p) => (
            <li key={p._id}>
              <Link href={editHref(p)} className="flex items-center gap-3 rounded-xl p-1.5 hover:bg-gray-50">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-gray-50">
                  {p.image?.url ? <img src={p.image.url} alt="" className="h-full w-full object-contain p-1" /> : <Package className="h-4 w-4 text-gray-300" />}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium text-gray-900">{p.title}</span>
                  <span className="text-xs text-gray-500">{p.brand?.brandName}</span>
                </span>
                <StatusPill status={p.stock === 0 ? "out-of-stock" : "low-stock"} label={p.stock === 0 ? "Out" : `${p.stock} left`} />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </Panel>
  );
}
