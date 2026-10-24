import Link from "next/link";
import { getCategoryIcon } from "@/lib/categoryIcons";
import { DataTable } from "@/components/Dashboard/Kit";

export default function CategoriesTable({ categories, counts, actions }) {
  return (
    <div className="min-w-0 rounded-2xl border border-gray-200/70 bg-surface shadow-sm shadow-gray-900/[0.02]">
      <DataTable
        rows={categories}
        columns={[
          {
            key: "name",
            header: "Category",
            render: (c) => {
              const Icon = getCategoryIcon(c.categoryName);
              return (
                <div className="flex min-w-[180px] items-center gap-3">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gray-50 ring-1 ring-gray-100">
                    {c.categoryImg?.url ? <img src={c.categoryImg.url} alt="" className="h-full w-full object-contain p-1" /> : <Icon className="h-5 w-5 text-gray-400" />}
                  </span>
                  <span className="font-semibold text-gray-900">{c.categoryName}</span>
                </div>
              );
            },
          },
          {
            key: "types",
            header: "Types",
            hideBelow: "md",
            render: (c) => (
              <div className="flex max-w-md flex-wrap gap-1">
                {(c.subcategories || []).slice(0, 4).map((t) => <span key={t} className="rounded-md bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">{t}</span>)}
                {c.subcategories?.length > 4 && <span className="px-1 text-xs text-gray-500">+{c.subcategories.length - 4}</span>}
              </div>
            ),
          },
          {
            key: "products",
            header: "Products",
            render: (c) => (
              <Link href={`/dashboard/products?category=${c._id}`} className="font-medium text-gray-700 hover:underline">
                {counts.byCategory[c._id] || 0}
              </Link>
            ),
          },
          {
            key: "actions",
            header: <span className="sr-only">Actions</span>,
            className: "text-right",
            render: (c) => actions(c),
          },
        ]}
      />
    </div>
  );
}
