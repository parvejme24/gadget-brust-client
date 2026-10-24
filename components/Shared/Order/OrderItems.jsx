import Link from "next/link";
import { Package } from "lucide-react";
import { formatTaka } from "@/lib/format";

// line items plus the money summary; productHref(item) makes titles clickable
export default function OrderItems({ order, productHref }) {
  const items = order.items || [];
  const rows = [
    ["Subtotal", order.subtotal],
    ...(order.discount ? [[order.coupon?.code ? `Discount (${order.coupon.code})` : "Discount", -order.discount]] : []),
    ["Delivery", order.shippingCharge || 0],
    ...(order.tax ? [["VAT", order.tax]] : []),
  ];

  return (
    <>
      <ul className="divide-y divide-gray-100">
        {items.map((item, i) => {
          const href = productHref && item.product ? productHref(item) : null;
          return (
            <li key={item._id || i} className="flex items-center gap-3 px-4 py-3.5 sm:gap-4 sm:px-5">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gray-50 ring-1 ring-gray-100 sm:h-14 sm:w-14">
                {item.image ? <img src={item.image} alt="" className="h-full w-full object-contain p-1" /> : <Package className="h-5 w-5 text-gray-300" />}
              </span>
              <div className="min-w-0 flex-1">
                {href ? (
                  <Link href={href} className="line-clamp-2 text-sm font-medium text-gray-900 hover:underline sm:line-clamp-1">{item.title}</Link>
                ) : (
                  <p className="line-clamp-2 text-sm font-medium text-gray-900 sm:line-clamp-1">{item.title}</p>
                )}
                <p className="text-xs text-gray-500 sm:text-sm">{formatTaka(item.price)} × {item.qty}</p>
              </div>
              <p className="shrink-0 text-sm font-semibold text-gray-900">{formatTaka(item.price * item.qty)}</p>
            </li>
          );
        })}
        {!items.length && <li className="px-5 py-8 text-center text-sm text-gray-500">No line items recorded for this order.</li>}
      </ul>
      <dl className="space-y-2 border-t border-gray-100 bg-gray-50/60 px-4 py-4 text-sm sm:px-5">
        {rows.map(([label, value]) => (
          <div key={label} className="flex justify-between text-gray-600">
            <dt>{label}</dt>
            <dd className="font-medium text-gray-900">{value < 0 ? `−${formatTaka(-value)}` : value === 0 && label === "Delivery" ? "Free" : formatTaka(value)}</dd>
          </div>
        ))}
        <div className="flex justify-between border-t border-gray-200 pt-2 text-base">
          <dt className="font-semibold text-gray-900">Total</dt>
          <dd className="font-bold text-gray-900">{formatTaka(order.total)}</dd>
        </div>
      </dl>
    </>
  );
}
