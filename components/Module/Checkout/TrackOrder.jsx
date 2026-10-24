"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { ExternalLink, Loader2, PackageSearch, Phone, Truck } from "lucide-react";
import { checkoutService } from "@/lib/services/checkoutService";
import { formatDate, paymentLabels } from "@/lib/format";
import PageHero from "@/components/Module/Shop/PageHero";
import OrderProgress from "@/components/Shared/Order/OrderProgress";
import OrderItems from "@/components/Shared/Order/OrderItems";
import OrderHistory from "@/components/Shared/Order/OrderHistory";
import { CUSTOMER_STATUS_TEXT } from "@/components/Shared/Order/orderStatus";
import CheckoutField from "./CheckoutField";
import Reveal, { stagger } from "@/components/Shared/Motion/Reveal";

const card = "rounded-3xl border border-gray-200/70 bg-surface shadow-sm shadow-gray-900/[0.03]";

// public order tracking with order number + phone (works for guest orders)
export default function TrackOrder() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [form, setForm] = useState({ number: "", phone: "" });
  const lookup = { number: searchParams.get("number") || "", phone: searchParams.get("phone") || "" };

  useEffect(() => setForm({ number: lookup.number, phone: lookup.phone }), [lookup.number, lookup.phone]);

  const result = useQuery({
    queryKey: ["track", lookup.number, lookup.phone],
    queryFn: () => checkoutService.track(lookup),
    enabled: !!lookup.number && !!lookup.phone,
    retry: false,
  });

  const submit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams({ number: form.number.trim().toUpperCase(), phone: form.phone.trim() });
    router.push(`/track-order?${params}`);
  };

  const order = result.data;
  const shipment = order?.shipment;
  const trackUrl = shipment?.trackingUrl && shipment.trackingNumber ? shipment.trackingUrl.replace("{tracking}", encodeURIComponent(shipment.trackingNumber)) : null;

  return (
    <div className="pb-16">
      <PageHero title="Track your order" subtitle="Enter your order number and the phone number used at checkout." crumbs={[{ label: "Track order" }]} />
      <div className="container mx-auto max-w-5xl px-4 pt-8 sm:px-6 lg:px-8">
        <Reveal as="form" variant="blur" onSubmit={submit} className={`${card} grid gap-4 p-5 sm:grid-cols-[1fr_1fr_auto] sm:items-end sm:p-6`}>
          <CheckoutField label="Order number" id="track-number" value={form.number} onChange={(e) => setForm({ ...form, number: e.target.value })} placeholder="INV-20261024-0001" autoComplete="off" />
          <CheckoutField label="Phone number" id="track-phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} type="tel" inputMode="tel" placeholder="01XXXXXXXXX" />
          <button type="submit" disabled={!form.number.trim() || !form.phone.trim()} className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-gray-900 px-6 font-semibold text-white hover:bg-gray-800 disabled:opacity-50">
            <PackageSearch className="h-4 w-4" /> Track
          </button>
        </Reveal>

        {result.isFetching && !order && <div className="flex justify-center py-16"><Loader2 className="h-6 w-6 animate-spin text-gray-400" /></div>}
        {result.isError && (
          <div className={`${card} mt-6 p-8 text-center`}>
            <p className="font-semibold text-gray-900">{result.error?.response?.data?.message || "We couldn't look up that order."}</p>
            <p className="mt-1 text-sm text-gray-500">Check the order number in your confirmation and use the same phone number.</p>
          </div>
        )}

        {order && (
          <Reveal variant="up" className="mt-6 grid gap-6 lg:grid-cols-3">
            <div className="min-w-0 space-y-6 lg:col-span-2">
              <section className={`${card} p-5 sm:p-6`}>
                <div className="mb-5 flex flex-wrap items-baseline justify-between gap-2">
                  <h2 className="font-mono text-lg font-bold text-gray-900">{order.invoiceNumber}</h2>
                  <p className="text-sm text-gray-500">Placed {formatDate(order.orderDate)}</p>
                </div>
                <p className="mb-5 text-sm text-gray-600">{CUSTOMER_STATUS_TEXT[order.orderStatus]}</p>
                <OrderProgress status={order.orderStatus} history={order.statusHistory} />
              </section>
              <section className={`${card} overflow-hidden`}>
                <h2 className="px-5 pt-5 text-lg font-bold text-gray-900">Items</h2>
                <OrderItems order={order} productHref={null} />
              </section>
            </div>
            <div className="min-w-0 space-y-6">
              <section className={`${card} p-5`}>
                <h2 className="flex items-center gap-2 font-bold text-gray-900"><Truck className="h-4 w-4 text-gray-400" /> Delivery</h2>
                {shipment ? (
                  <div className="mt-3 space-y-3 text-sm">
                    <p className="font-semibold text-gray-900">{shipment.courier}</p>
                    {shipment.trackingNumber && <p className="rounded-xl bg-gray-50 px-3 py-2 font-mono font-semibold text-gray-900">{shipment.trackingNumber}</p>}
                    {trackUrl && (
                      <a href={trackUrl} target="_blank" rel="noopener noreferrer" className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-gray-900 font-semibold text-white hover:bg-gray-800">
                        <ExternalLink className="h-4 w-4" /> Track with courier
                      </a>
                    )}
                    {shipment.phone && <a href={`tel:${shipment.phone}`} className="flex items-center gap-2 text-xs text-gray-600"><Phone className="h-3.5 w-3.5" /> {shipment.phone}</a>}
                  </div>
                ) : (
                  <p className="mt-3 text-sm text-gray-600">{order.orderStatus === "cancelled" ? "This order won't be shipped." : `Courier details appear here once it ships${order.city ? ` to ${order.city}` : ""}.`}</p>
                )}
                <p className="mt-4 border-t border-gray-100 pt-4 text-sm text-gray-600">
                  {paymentLabels[order.paymentMethod] || order.paymentMethod} · {order.paymentStatus === "completed" ? "Paid" : "Unpaid"}
                </p>
              </section>
              <section className={`${card} p-5`}>
                <h2 className="mb-4 font-bold text-gray-900">Updates</h2>
                <OrderHistory history={order.statusHistory} />
              </section>
            </div>
          </Reveal>
        )}
      </div>
    </div>
  );
}
