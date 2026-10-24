"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Loader2, MessageSquarePlus, Star } from "lucide-react";
import { useCreateReview } from "@/lib/hooks/useStorefront";
import { useSession } from "@/lib/hooks/useSession";

export function Stars({ value, size = "h-4 w-4" }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`${Number(value).toFixed(1)} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} className={`${size} ${i <= Math.round(value) ? "fill-amber-400 text-amber-400" : "fill-gray-200 text-gray-200"}`} />
      ))}
    </div>
  );
}

function ReviewForm({ productId, onDone }) {
  const { user } = useSession();
  const createReview = useCreateReview();
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [text, setText] = useState("");

  if (!user) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-200 p-5 text-center text-sm text-gray-600">
        <Link href={`/login?redirect=/products/${productId}`} className="font-semibold text-brand hover:underline">Sign in</Link> to write a review.
      </div>
    );
  }

  const submit = async (e) => {
    e.preventDefault();
    if (!rating) return toast.error("Please choose a star rating");
    if (text.trim().length < 5) return toast.error("Please write a few words about the product");
    try {
      await createReview.mutateAsync({
        productID: productId,
        rating,
        reviewText: text.trim(),
      });
      toast.success("Thanks for your review!");
      setRating(0);
      setText("");
      onDone?.();
    } catch (error) {
      toast.error(error.response?.data?.message || "Couldn't post your review. Please try again.");
    }
  };

  return (
    <form onSubmit={submit} className="rounded-2xl border border-gray-200/70 bg-surface p-5 shadow-sm shadow-gray-900/[0.03]">
      <p className="text-sm font-semibold text-gray-900">Your rating</p>
      <div className="mt-2 flex gap-1" onMouseLeave={() => setHover(0)}>
        {[1, 2, 3, 4, 5].map((i) => (
          <button key={i} type="button" onClick={() => setRating(i)} onMouseEnter={() => setHover(i)} aria-label={`${i} star${i > 1 ? "s" : ""}`}>
            <Star className={`h-7 w-7 transition ${i <= (hover || rating) ? "fill-amber-400 text-amber-400" : "fill-gray-200 text-gray-200"}`} />
          </button>
        ))}
      </div>
      <label htmlFor="review-text" className="mt-4 block text-sm font-semibold text-gray-900">Your review</label>
      <textarea
        id="review-text"
        rows={4}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="What did you like or dislike? How are you using it?"
        className="mt-2 w-full rounded-xl border border-gray-200 bg-white p-3 text-sm outline-none focus:border-brand focus:ring-4 focus:ring-brand/10"
      />
      <button type="submit" disabled={createReview.isPending} className="mt-3 inline-flex h-10 items-center gap-2 rounded-xl bg-gray-900 px-5 text-sm font-semibold text-white hover:bg-gray-800 disabled:opacity-60">
        {createReview.isPending && <Loader2 className="h-4 w-4 animate-spin" />} Post review
      </button>
    </form>
  );
}

export default function ReviewsSection({ productId, reviews, avgRating }) {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
      <div className="h-fit rounded-2xl bg-gray-50 p-6 text-center">
        <p className="text-5xl font-extrabold text-gray-900">{avgRating.toFixed(1)}</p>
        <div className="mt-2 flex justify-center">
          <Stars value={avgRating} size="h-5 w-5" />
        </div>
        <p className="mt-1 text-sm text-gray-500">Based on {reviews.length} review{reviews.length === 1 ? "" : "s"}</p>
        <div className="mt-5 space-y-1.5">
          {[5, 4, 3, 2, 1].map((stars) => {
            const count = reviews.filter((r) => r.rating === stars).length;
            const pct = reviews.length ? (count / reviews.length) * 100 : 0;
            return (
              <div key={stars} className="flex items-center gap-2 text-xs text-gray-500">
                <span className="w-3">{stars}</span>
                <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-200">
                  <div className="h-full rounded-full bg-amber-400" style={{ width: `${pct}%` }} />
                </div>
                <span className="w-5 text-right">{count}</span>
              </div>
            );
          })}
        </div>
        <button
          onClick={() => setShowForm((s) => !s)}
          className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white py-2.5 text-sm font-semibold text-gray-800 hover:border-brand hover:text-brand"
        >
          <MessageSquarePlus className="h-4 w-4" /> Write a review
        </button>
      </div>

      <div className="space-y-4">
        {showForm && <ReviewForm productId={productId} onDone={() => setShowForm(false)} />}
        {reviews.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-gray-200 p-8 text-center text-sm text-gray-500">
            No reviews yet. Be the first to share your experience.
          </p>
        ) : (
          reviews.map((review) => {
            const name = review.customerName || "Customer";
            return (
              <article key={review._id} className="rounded-2xl border border-gray-200/70 bg-surface shadow-sm shadow-gray-900/[0.03] p-5">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-light font-bold uppercase text-brand-dark">{name[0]}</div>
                    <div>
                      <p className="text-sm font-semibold capitalize text-gray-900">{name}</p>
                      <p className="text-xs text-gray-400">
                        {new Date(review.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                      </p>
                    </div>
                  </div>
                  <Stars value={review.rating} size="h-3.5 w-3.5" />
                </div>
                <p className="mt-3 text-sm leading-6 text-gray-600">{review.reviewText}</p>
              </article>
            );
          })
        )}
      </div>
    </div>
  );
}
