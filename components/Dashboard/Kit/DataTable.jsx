import { ChevronLeft, ChevronRight } from "lucide-react";
import { cx } from "@/lib/format";
import { buttonClass } from "./Button";

// columns: [{ key, header, render(row), className, hideBelow: "sm"|"md"|"lg" }]
const hideClass = { sm: "hidden sm:table-cell", md: "hidden md:table-cell", lg: "hidden lg:table-cell", xl: "hidden xl:table-cell", "2xl": "hidden 2xl:table-cell" };

export function DataTable({ columns, rows, loading, rowKey = "_id", empty, onRowClick, skeletonRows = 6 }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-gray-100 text-xs font-medium uppercase tracking-wider text-gray-500">
            {columns.map((col) => (
              <th key={col.key} scope="col" className={cx("whitespace-nowrap px-5 py-3 font-medium", col.hideBelow && hideClass[col.hideBelow], col.headerClassName)}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {loading
            ? Array.from({ length: skeletonRows }).map((_, i) => (
                <tr key={i}>
                  {columns.map((col) => (
                    <td key={col.key} className={cx("px-5 py-4", col.hideBelow && hideClass[col.hideBelow])}>
                      <div className="h-4 w-full max-w-[10rem] animate-pulse rounded bg-gray-100" />
                    </td>
                  ))}
                </tr>
              ))
            : rows.map((row) => (
                <tr
                  key={row[rowKey]}
                  onClick={onRowClick ? () => onRowClick(row) : undefined}
                  className={cx("transition-colors hover:bg-gray-50/80", onRowClick && "cursor-pointer")}
                >
                  {columns.map((col) => (
                    <td key={col.key} className={cx("px-5 py-3.5 align-middle text-gray-700", col.hideBelow && hideClass[col.hideBelow], col.className)}>
                      {col.render ? col.render(row) : row[col.key]}
                    </td>
                  ))}
                </tr>
              ))}
        </tbody>
      </table>
      {!loading && rows.length === 0 && empty}
    </div>
  );
}

export function Pagination({ page, totalPages, onChange, total, pageSize }) {
  if (!totalPages || totalPages <= 1) return null;
  const from = (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);
  return (
    <div className="flex items-center justify-between gap-3 border-t border-gray-100 px-5 py-3 text-sm text-gray-500">
      <span className="hidden sm:inline">
        Showing <span className="font-medium text-gray-900">{from}-{to}</span> of <span className="font-medium text-gray-900">{total}</span>
      </span>
      <div className="ml-auto flex items-center gap-1.5">
        <button onClick={() => onChange(page - 1)} disabled={page <= 1} aria-label="Previous page" className={buttonClass("secondary", "icon")}>
          <ChevronLeft className="h-4 w-4" />
        </button>
        <span className="px-2 font-medium text-gray-700">
          {page} / {totalPages}
        </span>
        <button onClick={() => onChange(page + 1)} disabled={page >= totalPages} aria-label="Next page" className={buttonClass("secondary", "icon")}>
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
