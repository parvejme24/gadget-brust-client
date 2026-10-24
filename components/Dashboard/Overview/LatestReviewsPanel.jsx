import Link from "next/link";
import { Star } from "lucide-react";
import { useAdminReviews } from "@/lib/hooks/useAdmin";
import { EmptyState, Panel, formatDate } from "@/components/Dashboard/Kit";

export default function LatestReviewsPanel({ limit = 4, className }) {
  const { data: reviews = [] } = useAdminReviews();
  const latest = [...reviews].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, limit);

  return (
    <Panel
      className={className}
      title="Latest reviews"
      action={<Link href="/dashboard/reviews" className="text-xs font-semibold text-gray-500 hover:text-gray-900">Moderate</Link>}
    >
      {latest.length === 0 ? (
        <EmptyState icon={Star} title="No reviews yet" className="py-8" />
      ) : (
        <ul className="grid gap-4 md:grid-cols-2">
          {latest.map((r) => (
            <li key={r._id} className="rounded-xl border border-gray-100 p-4">
              <div className="flex items-center justify-between gap-3">
                <span className="truncate text-sm font-semibold text-gray-900">{r.productID?.title || "Product"}</span>
                <span className="flex shrink-0 items-center gap-1 text-sm font-semibold text-gray-700">
                  <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" /> {r.rating}
                </span>
              </div>
              <p className="mt-1.5 line-clamp-2 text-sm text-gray-600">{r.reviewText}</p>
              <p className="mt-2 truncate text-xs text-gray-400">{r.customerEmail} · {formatDate(r.createdAt)}</p>
            </li>
          ))}
        </ul>
      )}
    </Panel>
  );
}
