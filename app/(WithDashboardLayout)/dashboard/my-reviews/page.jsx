"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Package, Pencil, Star, Trash2 } from "lucide-react";
import { useMyReviewActions, useMyReviews } from "@/lib/hooks/useAccount";
import { useDashboardUser } from "@/components/Dashboard/Layout/DashboardUser";
import { Button, ConfirmDialog, EmptyState, ErrorState, Field, Modal, PageHeader, buttonClass, cx, formatDate, inputClass } from "@/components/Dashboard/Kit";

const Stars = ({ rating }) => (
  <span className="flex" aria-label={`${rating} out of 5`}>
    {[1, 2, 3, 4, 5].map((n) => <Star key={n} className={cx("h-4 w-4", n <= rating ? "fill-amber-400 text-amber-400" : "text-gray-200")} />)}
  </span>
);

function EditReviewModal({ review, onClose }) {
  const { update } = useMyReviewActions();
  const [rating, setRating] = useState(review.rating);
  const [text, setText] = useState(review.reviewText);

  const save = async () => {
    if (text.trim().length < 5) return toast.error("Please write a few words about the product");
    try {
      await update.mutateAsync({ id: review._id, rating, reviewText: text.trim() });
    } catch {
      return; // the hook shows the error
    }
    toast.success("Review updated");
    onClose();
  };

  return (
    <Modal
      open
      onClose={onClose}
      title="Edit review"
      description={review.productID?.title}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button onClick={save} loading={update.isPending}>Save</Button>
        </>
      }
    >
      <Field label="Rating">
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((n) => (
            <button key={n} type="button" onClick={() => setRating(n)} aria-label={`${n} star${n > 1 ? "s" : ""}`} className="rounded p-0.5">
              <Star className={cx("h-7 w-7 transition", n <= rating ? "fill-amber-400 text-amber-400" : "text-gray-200 hover:text-amber-200")} />
            </button>
          ))}
        </div>
      </Field>
      <Field label="Your review" htmlFor="review-text" className="mt-4">
        <textarea id="review-text" value={text} onChange={(e) => setText(e.target.value)} rows={5} className={cx(inputClass, "h-auto py-2.5")} />
      </Field>
    </Modal>
  );
}

export default function MyReviewsPage() {
  const user = useDashboardUser();
  const { data: reviews = [], isLoading, isError, error, refetch } = useMyReviews(user?._id);
  const { remove } = useMyReviewActions();
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);

  const confirmDelete = async () => {
    try {
      await remove.mutateAsync(deleting._id);
    } catch {
      return;
    }
    toast.success("Review deleted");
    setDeleting(null);
  };

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
              <div className="flex items-start justify-between gap-3">
                <Link href={`/products/${r.productID?._id}`} className="flex min-w-0 items-center gap-3">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gray-50">
                    {r.productID?.image?.url ? <img src={r.productID.image.url} alt="" className="h-full w-full object-contain p-1" /> : <Package className="h-5 w-5 text-gray-300" />}
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-semibold text-gray-900 hover:underline">{r.productID?.title || "Product"}</span>
                    <span className="text-xs text-gray-500">{formatDate(r.updatedAt || r.createdAt)}</span>
                  </span>
                </Link>
                <div className="flex shrink-0 gap-1">
                  <button onClick={() => setEditing(r)} aria-label="Edit review" className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-700">
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button onClick={() => setDeleting(r)} aria-label="Delete review" className="rounded-lg p-2 text-gray-400 hover:bg-red-50 hover:text-red-600">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div className="mt-3"><Stars rating={r.rating} /></div>
              <p className="mt-2 text-sm leading-6 text-gray-700">{r.reviewText}</p>
            </li>
          ))}
        </ul>
      )}

      {editing && <EditReviewModal review={editing} onClose={() => setEditing(null)} />}
      <ConfirmDialog
        open={!!deleting}
        onClose={() => setDeleting(null)}
        onConfirm={confirmDelete}
        loading={remove.isPending}
        title="Delete this review?"
        message={`Your review of ${deleting?.productID?.title || "this product"} will be removed from the store.`}
      />
    </>
  );
}
