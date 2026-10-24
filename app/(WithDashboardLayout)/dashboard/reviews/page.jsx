"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { MessageSquareText, Star, Trash2 } from "lucide-react";
import { adminService } from "@/lib/services/adminService";
import { useAdminMutation, useAdminReviews } from "@/lib/hooks/useAdmin";
import {
  BarList,
  ConfirmDialog,
  EmptyState,
  ErrorState,
  PageHeader,
  Pagination,
  Panel,
  SearchInput,
  StatCard,
  buttonClass,
  cx,
  formatDate,
} from "@/components/Dashboard/Kit";

const PAGE_SIZE = 10;

const Stars = ({ value }) => (
  <span className="flex" aria-label={`${value} out of 5 stars`}>
    {[1, 2, 3, 4, 5].map((i) => (
      <Star key={i} className={cx("h-3.5 w-3.5", i <= value ? "fill-amber-400 text-amber-400" : "fill-gray-200 text-gray-200")} />
    ))}
  </span>
);

export default function ReviewsPage() {
  const { data: reviews = [], isLoading, isError, error, refetch } = useAdminReviews();
  const [search, setSearch] = useState("");
  const [rating, setRating] = useState(0);
  const [page, setPage] = useState(1);
  const [toDelete, setToDelete] = useState(null);

  const remove = useAdminMutation((id) => adminService.deleteReview(id), { success: "Review deleted", onSuccess: () => setToDelete(null) });

  const sorted = useMemo(() => [...reviews].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)), [reviews]);
  const filtered = sorted.filter((r) => {
    const q = search.trim().toLowerCase();
    return (!rating || r.rating === rating) && (!q || [r.reviewText, r.customerEmail, r.productID?.title].some((v) => v?.toLowerCase().includes(q)));
  });
  const avg = reviews.length ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0;
  const low = reviews.filter((r) => r.rating <= 2).length;

  return (
    <>
      <PageHeader title="Reviews" description="Read what customers say and remove spam or abusive reviews." />

      <div className="mb-6 grid gap-4 lg:grid-cols-3">
        <StatCard loading={isLoading} label="Average rating" value={avg.toFixed(2)} icon={Star} tone="amber" hint={`${reviews.length} reviews`} />
        <StatCard loading={isLoading} label="Needs attention" value={low} icon={MessageSquareText} tone="red" hint="Reviews rated 1-2 stars" />
        <Panel title="Rating distribution" bodyClassName="px-5 pb-5 pt-4">
          <BarList items={[5, 4, 3, 2, 1].map((n) => ({ key: n, label: `${n} star${n > 1 ? "s" : ""}`, value: reviews.filter((r) => r.rating === n).length }))} />
        </Panel>
      </div>

      <Panel bodyClassName="">
        <div className="flex flex-col gap-3 border-b border-gray-100 p-4 sm:flex-row sm:items-center">
          <SearchInput value={search} onChange={(v) => { setSearch(v); setPage(1); }} placeholder="Search review, product or email…" className="sm:w-80" />
          <div className="flex flex-wrap gap-1" role="tablist" aria-label="Filter by rating">
            {[0, 5, 4, 3, 2, 1].map((n) => (
              <button
                key={n}
                role="tab"
                aria-selected={rating === n}
                onClick={() => { setRating(n); setPage(1); }}
                className={cx("flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm font-semibold transition", rating === n ? "bg-gray-900 text-white" : "text-gray-600 hover:bg-gray-100")}
              >
                {n === 0 ? "All" : <>{n} <Star className={cx("h-3.5 w-3.5", rating === n ? "fill-white" : "fill-amber-400 text-amber-400")} /></>}
              </button>
            ))}
          </div>
        </div>

        {isError ? (
          <ErrorState error={error} onRetry={refetch} />
        ) : isLoading ? (
          <div className="space-y-3 p-5">{Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-16 animate-pulse rounded-xl bg-gray-100" />)}</div>
        ) : filtered.length === 0 ? (
          <EmptyState icon={MessageSquareText} title="No reviews found" />
        ) : (
          <ul className="divide-y divide-gray-100">
            {filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE).map((r) => (
              <li key={r._id} className="flex gap-4 px-5 py-4">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                    <Stars value={r.rating} />
                    {r.productID?._id ? (
                      <Link href={`/dashboard/products/${r.productID._id}`} className="truncate text-sm font-semibold text-gray-900 hover:underline">{r.productID.title}</Link>
                    ) : (
                      <span className="text-sm text-gray-400">Deleted product</span>
                    )}
                  </div>
                  <p className="mt-1.5 text-sm leading-6 text-gray-700">{r.reviewText}</p>
                  <p className="mt-1 text-xs text-gray-500">
                    {r.customerID?._id ? <Link href={`/dashboard/customers/${r.customerID._id}`} className="hover:underline">{r.customerEmail}</Link> : r.customerEmail} · {formatDate(r.createdAt)}
                  </p>
                </div>
                <button onClick={() => setToDelete(r)} aria-label="Delete review" className={buttonClass("danger-ghost", "icon")}>
                  <Trash2 className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>
        )}
        <Pagination page={page} totalPages={Math.ceil(filtered.length / PAGE_SIZE)} total={filtered.length} pageSize={PAGE_SIZE} onChange={setPage} />
      </Panel>

      <ConfirmDialog
        open={!!toDelete}
        onClose={() => setToDelete(null)}
        onConfirm={() => remove.mutate(toDelete._id)}
        loading={remove.isPending}
        title="Delete review?"
        message="The review will be removed from the product page. This can't be undone."
      />
    </>
  );
}
