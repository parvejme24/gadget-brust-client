import Link from "next/link";
import { Mail, MapPin, Pencil, Phone, User } from "lucide-react";
import { Panel, StatusPill, customerName, isGuestOrder } from "@/components/Dashboard/Kit";
import OrderAddress from "@/components/Shared/Order/OrderAddress";

export default function CustomerPanel({ order, onEdit, editable = true }) {
  const email = order.customer?.email || order.user_id?.email;
  const guest = isGuestOrder(order);
  return (
    <Panel
      title="Customer"
      action={
        editable && (
          <button onClick={onEdit} className="inline-flex items-center gap-1 text-xs font-semibold text-gray-500 hover:text-gray-900 print:hidden">
            <Pencil className="h-3 w-3" /> Edit
          </button>
        )
      }
    >
      <div className="space-y-2.5 text-sm">
        <p className="flex flex-wrap items-center gap-2 font-medium text-gray-900">
          <User className="h-4 w-4 text-gray-400" /> {customerName(order)}
          {guest && <StatusPill status="guest" label="Guest checkout" />}
        </p>
        {email && <a href={`mailto:${email}`} className="flex items-center gap-2 break-all text-gray-600 hover:text-gray-900"><Mail className="h-4 w-4 shrink-0 text-gray-400" /> {email}</a>}
        {order.phone && <a href={`tel:${order.phone}`} className="flex items-center gap-2 text-gray-600 hover:text-gray-900"><Phone className="h-4 w-4 text-gray-400" /> {order.phone}</a>}
        {order.source !== "pos" && (
          <div className="flex gap-2 border-t border-gray-100 pt-3">
            <MapPin className="mt-1 h-4 w-4 shrink-0 text-gray-400" />
            <div>
              <p className="text-xs font-medium text-gray-500">Deliver to{order.shippingMethod?.name ? ` · ${order.shippingMethod.name}` : ""}</p>
              <OrderAddress address={order.shippingAddress} />
            </div>
          </div>
        )}
        {order.user_id?._id && (
          <Link href={`/dashboard/customers/${order.user_id._id}`} className="inline-block pt-1 text-xs font-semibold text-gray-500 hover:text-gray-900 print:hidden">
            View customer profile →
          </Link>
        )}
      </div>
    </Panel>
  );
}
