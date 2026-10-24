import Link from "next/link";
import { getCategoryIcon } from "@/lib/categoryIcons";

export default function CategoryCard({ category, count, actions }) {
  const Icon = getCategoryIcon(category.categoryName);
  return (
    <div className="flex flex-col rounded-2xl border border-gray-200/70 bg-surface p-5 shadow-sm shadow-gray-900/[0.02]">
      <div className="flex items-start gap-4">
        <span className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-gray-50 ring-1 ring-gray-100">
          {category.categoryImg?.url ? <img src={category.categoryImg.url} alt="" className="h-full w-full object-contain p-1.5" /> : <Icon className="h-6 w-6 text-gray-400" />}
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="truncate font-semibold text-gray-900">{category.categoryName}</h3>
          <Link href={`/dashboard/products?category=${category._id}`} className="text-sm text-gray-500 hover:text-gray-900 hover:underline">
            {count} product{count === 1 ? "" : "s"}
          </Link>
        </div>
        {actions}
      </div>
      <div className="mt-4 flex flex-wrap gap-1.5">
        {category.subcategories?.length ? (
          category.subcategories.map((s) => <span key={s} className="rounded-lg bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600">{s}</span>)
        ) : (
          <span className="text-xs text-gray-400">No types yet</span>
        )}
      </div>
    </div>
  );
}
