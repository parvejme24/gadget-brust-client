"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, Copy, PackageSearch, Phone, ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import { useSession } from "@/lib/hooks/useSession";
import { formatTaka } from "@/lib/format";
import { useStoreInfo } from "@/lib/hooks/useStorefront";
import Reveal from "@/components/Shared/Motion/Reveal";

export default function OrderPlaced() {
  const searchParams = useSearchParams();
  const { user } = useSession();
  const store = useStoreInfo();
  const number = searchParams.get("number") || "";
  const [last, setLast] = useState(null);

  useEffect(() => {
    try {
      const saved = JSON.parse(sessionStorage.getItem("gbLastOrder") || "null");
      if (saved?.number === number) setLast(saved);
    } catch {
      // storage blocked
    }
  }, [number]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(number);
      toast.success("Order number copied");
    } catch {
      toast.error("Couldn't copy");
    }
  };

  const trackHref = `/track-order?number=${encodeURIComponent(number)}${last?.phone ? `&phone=${encodeURIComponent(last.phone)}` : ""}`;

  return (
    <div className="container mx-auto max-w-2xl px-4 py-12 sm:py-16">
      <Reveal variant="zoom" className="rounded-3xl border border-gray-200/70 bg-surface p-6 text-center shadow-sm shadow-gray-900/[0.03] sm:p-10">
        <span className="animate-pop animate-pulse-ring mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-700"><CheckCircle2 className="h-8 w-8" /></span>
        <h1 className="mt-5 text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">Thank you! Your order is placed.</h1>
        <p className="mt-2 text-gray-500">We&apos;ll call {last?.phone ? <span className="font-semibold text-gray-700">{last.phone}</span> : "you"} shortly to confirm it.</p>

        {number && (
          <div className="mx-auto mt-6 flex max-w-sm items-center justify-between gap-3 rounded-2xl bg-gray-50 px-4 py-3">
            <div className="text-left">
              <p className="text-xs text-gray-500">Order number</p>
              <p className="font-mono text-lg font-bold text-gray-900">{number}</p>
            </div>
            <button onClick={copy} aria-label="Copy order number" className="rounded-lg p-2 text-gray-500 hover:bg-gray-200 hover:text-gray-900"><Copy className="h-4 w-4" /></button>
          </div>
        )}
        {last?.total && <p className="mt-3 text-sm text-gray-600">Pay <span className="font-bold text-gray-900">{formatTaka(last.total)}</span> in cash when it arrives.</p>}

        <ol className="mx-auto mt-8 max-w-sm space-y-3 text-left text-sm text-gray-600">
          <li className="flex gap-3"><span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gray-900 text-xs font-bold text-white">1</span> We confirm your order by phone.</li>
          <li className="flex gap-3"><span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gray-900 text-xs font-bold text-white">2</span> We pack it and hand it to our courier partner.</li>
          <li className="flex gap-3"><span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gray-900 text-xs font-bold text-white">3</span> Track it any time with your order number and phone.</li>
        </ol>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          {user ? (
            <Link href="/dashboard/my-orders" className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-gray-900 px-6 font-semibold text-white hover:bg-gray-800"><ShoppingBag className="h-4 w-4" /> View my orders</Link>
          ) : (
            <Link href={trackHref} className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-gray-900 px-6 font-semibold text-white hover:bg-gray-800"><PackageSearch className="h-4 w-4" /> Track this order</Link>
          )}
          <Link href="/products" className="inline-flex h-12 items-center justify-center rounded-xl border border-gray-200 px-6 font-semibold text-gray-800 hover:border-gray-300">Continue shopping</Link>
        </div>
        {!user && (
          <p className="mt-6 text-xs text-gray-500">
            <Link href="/register" className="font-semibold text-brand hover:underline">Create an account</Link> to see all your orders in one place.
          </p>
        )}
      </Reveal>
      {store.phone && (
        <p className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-500">
          <Phone className="h-4 w-4" /> Questions? Call <a href={store.phoneHref} className="font-semibold text-gray-700 hover:underline">{store.phone}</a>
        </p>
      )}
    </div>
  );
}
