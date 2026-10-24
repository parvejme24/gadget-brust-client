"use client";

import Link from "next/link";
import { Package, Star } from "lucide-react";
import { useMyReviews } from "@/lib/hooks/useAccount";
import { useDashboardUser } from "@/components/Dashboard/Layout/DashboardUser";
import { EmptyState, ErrorState, PageHeader, buttonClass, cx, formatDate } from "@/components/Dashboard/Kit";

const Stars = ({ rating }) => (
  <span className="flex" aria-label={`${rating} out of 5`}>
    {[1, 2, 3, 4, 5].map((n) => <Star key={n} className={cx("h-4 w-4", n <= rating ? "fill-amber-400 text-amber-400" : "text-gray-200")} />)}
  </span>
);

export default function MyReviewsPage() {
  const user = useDashboardUser();
  const { data: reviews = [], isLoading, isError, error, refetch } = useMyReviews(user?._id);

  return (
    <>
      <PageHeader title="My reviews" description="Reviews you've written for products you bought." />
      {isError ? (
        <ErrorState error={error} onRetry={refetch} />
      ) : isLoading ? (
        <div className="grid gap-4 md:grid-cols-2">{[0, 1, 2, 3].map((i) => <div key={i} className="h-36 animate-pulse rounded-2xl bg-gray-100" />)}</div>
      ) : reviews.length === 0 ? (
        <EmptyState icon={Star} title="No reviews yet" text="Open a product you bought and share what you think." action={<Link href="/dashboard/my-orders" className={buttonClass("secondary")}>Go to my orders</Link>} />
      ) : (
        <ul className="grid gap-4 md:grid-cols-2">
          {reviews.map((r) => (
            <li key={r._id} className="rounded-2xl border border-gray-200/70 bg-surface p-5 shadow-sm shadow-gray-900/[0.02]">
              <Link href={`/products/${r.productID?._id}`} className="flex items-center gap-3">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gray-50">
                  {r.productID?.image?.url ? <img src={r.productID.image.url} alt="" className="h-full w-full object-contain p-1" /> : <Package className="h-5 w-5 text-gray-300" />}
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-sm font-semibold text-gray-900 hover:underline">{r.productID?.title || "Product"}</span>
                  <span className="text-xs text-gray-500">{formatDate(r.createdAt)}</span>
                </span>
              </Link>
              <div className="mt-3"><Stars rating={r.rating} /></div>
              <p className="mt-2 text-sm leading-6 text-gray-700">{r.reviewText}</p>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
