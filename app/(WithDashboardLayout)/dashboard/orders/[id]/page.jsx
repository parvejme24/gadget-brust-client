"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { Loader2, Pencil, StickyNote } from "lucide-react";
import { useAdminOrder } from "@/lib/hooks/useAdmin";
import { useStoreInfo } from "@/lib/hooks/useStorefront";
import { ErrorState, PageHeader, Panel, StatusPill, formatDate, isGuestOrder } from "@/components/Dashboard/Kit";
import OrderProgress from "@/components/Shared/Order/OrderProgress";
import OrderItems from "@/components/Shared/Order/OrderItems";
import OrderHistory from "@/components/Shared/Order/OrderHistory";
import OrderActions from "@/components/Dashboard/Orders/OrderActions";
import ShipmentPanel from "@/components/Dashboard/Orders/ShipmentPanel";
import CustomerPanel from "@/components/Dashboard/Orders/CustomerPanel";
import PaymentPanel from "@/components/Dashboard/Orders/PaymentPanel";
import ShipmentModal from "@/components/Dashboard/Orders/ShipmentModal";
import StatusChangeModal from "@/components/Dashboard/Orders/StatusChangeModal";
import EditItemsModal from "@/components/Dashboard/Orders/EditItemsModal";
import EditCustomerModal from "@/components/Dashboard/Orders/EditCustomerModal";
import EditChargesModal from "@/components/Dashboard/Orders/EditChargesModal";

const EditLink = ({ onClick, children }) => (
  <button onClick={onClick} className="inline-flex items-center gap-1 text-xs font-semibold text-gray-500 hover:text-gray-900 print:hidden">
    <Pencil className="h-3 w-3" /> {children}
  </button>
);

export default function OrderDetailsPage() {
  const { id } = useParams();
  const { data: order, isLoading, isError, error, refetch } = useAdminOrder(id);
  const store = useStoreInfo();
  const [modal, setModal] = useState(null); // "ship" | "items" | "customer" | "charges"
  const [statusTarget, setStatusTarget] = useState(null);
  const close = () => setModal(null);

  if (isLoading) return <div className="flex justify-center py-20"><Loader2 className="h-6 w-6 animate-spin text-gray-400" /></div>;
  if (isError || !order) return <ErrorState error={error} onRetry={refetch} />;

  const pos = order.source === "pos";
  const itemsEditable = !pos && order.orderStatus !== "cancelled";
  const count = (order.items || []).reduce((s, i) => s + i.qty, 0);

  return (
    <>
      <div className="print:hidden">
        <PageHeader
          title={
            <span className="flex flex-wrap items-center gap-2">
              Order {order.invoiceNumber}
              <StatusPill status={order.orderStatus || "pending"} />
              {isGuestOrder(order) && <StatusPill status="guest" />}
              {pos && <StatusPill status="active" label="Counter sale" />}
            </span>
          }
          description={`Placed ${formatDate(order.orderDate, true)}${order.cashier?.fullName ? ` · by ${order.cashier.fullName}` : ""}`}
          back={{ href: "/dashboard/orders", label: "Orders" }}
          actions={<OrderActions order={order} onStatus={setStatusTarget} onShip={() => setModal("ship")} />}
        />
      </div>

      {/* print-only invoice header */}
      <div className="mb-6 hidden print:block">
        <p className="text-2xl font-bold">{store.name}</p>
        <p className="text-sm">{[store.address, store.phone, store.email].filter(Boolean).join(" · ")}</p>
        <p className="mt-4 text-xl font-semibold">Invoice {order.invoiceNumber}</p>
        <p className="text-sm">Date: {formatDate(order.orderDate)}</p>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="min-w-0 space-y-6 xl:col-span-2">
          {!pos && (
            <Panel className="print:hidden" bodyClassName="p-4 sm:p-5">
              <OrderProgress status={order.orderStatus} history={order.statusHistory} />
            </Panel>
          )}

          <Panel
            title={`Items (${count})`}
            bodyClassName=""
            action={
              <div className="flex items-center gap-3">
                {itemsEditable && <EditLink onClick={() => setModal("charges")}>Charges</EditLink>}
                {itemsEditable && <EditLink onClick={() => setModal("items")}>Edit items</EditLink>}
              </div>
            }
          >
            <OrderItems order={order} productHref={(item) => `/dashboard/products/${item.product?._id || item.product}`} />
          </Panel>

          {order.notes && (
            <Panel title="Note">
              <p className="flex gap-2 text-sm text-gray-700"><StickyNote className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" /> {order.notes}</p>
            </Panel>
          )}

          <Panel title="History" description="Every status change and edit" className="print:hidden">
            <OrderHistory history={order.statusHistory} showActor />
          </Panel>
        </div>

        <div className="min-w-0 space-y-6">
          <CustomerPanel order={order} onEdit={() => setModal("customer")} editable={!pos} />
          {!pos && <ShipmentPanel order={order} onEdit={() => setModal("ship")} />}
          <PaymentPanel order={order} editable={!pos} />
        </div>
      </div>

      <ShipmentModal order={order} open={modal === "ship"} onClose={close} />
      <EditItemsModal order={order} open={modal === "items"} onClose={close} />
      <EditCustomerModal order={order} open={modal === "customer"} onClose={close} />
      <EditChargesModal order={order} open={modal === "charges"} onClose={close} />
      <StatusChangeModal order={order} target={statusTarget} onClose={() => setStatusTarget(null)} />
    </>
  );
}
