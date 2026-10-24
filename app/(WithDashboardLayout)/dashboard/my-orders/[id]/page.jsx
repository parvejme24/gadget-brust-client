"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { CreditCard, ExternalLink, Loader2, MapPin, Phone, Truck } from "lucide-react";
import { useMyOrder } from "@/lib/hooks/useAccount";
import { CourierBadge, ErrorState, PageHeader, Panel, StatusPill, buttonClass, formatDate, paymentLabels, trackingLink } from "@/components/Dashboard/Kit";
import OrderProgress from "@/components/Shared/Order/OrderProgress";
import OrderItems from "@/components/Shared/Order/OrderItems";
import OrderHistory from "@/components/Shared/Order/OrderHistory";
import OrderAddress from "@/components/Shared/Order/OrderAddress";
import { CUSTOMER_STATUS_TEXT } from "@/components/Shared/Order/orderStatus";

export default function MyOrderPage() {
  const { id } = useParams();
  const { data: order, isLoading, isError, error, refetch } = useMyOrder(id);

  if (isLoading) return <div className="flex justify-center py-20"><Loader2 className="h-6 w-6 animate-spin text-gray-400" /></div>;
  if (isError || !order) return <ErrorState error={error} onRetry={refetch} />;

  const shipment = order.shipment?.courier ? order.shipment : null;
  const track = trackingLink(shipment?.courier, shipment?.trackingNumber);

  return (
    <>
      <PageHeader
        title={<span className="flex flex-wrap items-center gap-2">Order {order.invoiceNumber} <StatusPill status={order.orderStatus || "pending"} /></span>}
        description={`Placed ${formatDate(order.orderDate, true)}`}
        back={{ href: "/dashboard/my-orders", label: "My orders" }}
        actions={<button onClick={() => window.print()} className={buttonClass("secondary")}>Print</button>}
      />

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="min-w-0 space-y-6 xl:col-span-2">
          <Panel bodyClassName="p-4 sm:p-5">
            <p className="mb-5 text-sm text-gray-600">{CUSTOMER_STATUS_TEXT[order.orderStatus || "pending"]}</p>
            <OrderProgress status={order.orderStatus} history={order.statusHistory} />
          </Panel>
          <Panel title="Items" bodyClassName="">
            <OrderItems order={order} productHref={(item) => `/products/${item.product?._id || item.product}`} />
          </Panel>
          <Panel title="Order updates">
            <OrderHistory history={order.statusHistory} />
          </Panel>
        </div>

        <div className="min-w-0 space-y-6">
          <Panel title="Delivery">
            {shipment ? (
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3">
                  <CourierBadge courier={shipment.courier} />
                  <div className="min-w-0">
                    <p className="font-semibold text-gray-900">{shipment.courier.name}</p>
                    <p className="text-xs text-gray-500">Shipped {formatDate(shipment.shippedAt)}</p>
                  </div>
                </div>
                {shipment.trackingNumber && (
                  <div className="rounded-xl bg-gray-50 px-3 py-2.5">
                    <p className="text-[11px] text-gray-500">Tracking number</p>
                    <p className="font-mono text-sm font-semibold text-gray-900">{shipment.trackingNumber}</p>
                  </div>
                )}
                {track && (
                  <a href={track} target="_blank" rel="noopener noreferrer" className={buttonClass("primary", "md", "w-full justify-center")}>
                    <ExternalLink className="h-4 w-4" /> Track with {shipment.courier.name}
                  </a>
                )}
                {shipment.courier.phone && (
                  <a href={`tel:${shipment.courier.phone}`} className="flex items-center gap-2 text-xs text-gray-600 hover:text-gray-900"><Phone className="h-3.5 w-3.5" /> {shipment.courier.phone}</a>
                )}
              </div>
            ) : (
              <p className="flex items-center gap-2 text-sm text-gray-600"><Truck className="h-4 w-4 text-gray-400" /> {order.orderStatus === "cancelled" ? "Not shipped" : "We'll add courier details once it ships."}</p>
            )}
            <div className="mt-4 flex gap-2 border-t border-gray-100 pt-4">
              <MapPin className="mt-1 h-4 w-4 shrink-0 text-gray-400" />
              <div>
                {order.shippingMethod?.name && <p className="text-xs font-medium text-gray-500">{order.shippingMethod.name}</p>}
                <OrderAddress address={order.shippingAddress} />
              </div>
            </div>
          </Panel>

          <Panel title="Payment">
            <div className="flex items-center justify-between gap-2 text-sm">
              <span className="flex items-center gap-2 text-gray-600"><CreditCard className="h-4 w-4 text-gray-400" /> {paymentLabels[order.paymentMethod] || order.paymentMethod}</span>
              <StatusPill status={order.paymentStatus === "pending" ? "pending" : order.paymentStatus} label={order.paymentStatus === "pending" ? "Unpaid" : undefined} />
            </div>
          </Panel>

          <p className="px-1 text-xs text-gray-500">
            Questions about this order? <Link href="/contact" className="font-semibold text-gray-700 underline">Contact us</Link> with the order number.
          </p>
        </div>
      </div>
    </>
  );
}
