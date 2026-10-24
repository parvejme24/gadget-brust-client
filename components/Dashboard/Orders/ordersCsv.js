import { customerName, formatDate, isGuestOrder, paymentLabels } from "@/lib/format";

const SOURCE = (o) => (o.source === "pos" ? "Counter" : isGuestOrder(o) ? "Guest" : "Account");

export const ordersToCSV = (orders) =>
  [
    ["Order", "Date", "Source", "Customer", "Email", "Phone", "City", "Items", "Subtotal", "Delivery", "Tax", "Discount", "Total", "Payment method", "Payment status", "Order status", "Courier", "Tracking"],
    ...orders.map((o) => [
      o.invoiceNumber,
      formatDate(o.orderDate),
      SOURCE(o),
      customerName(o),
      o.customer?.email || o.user_id?.email,
      o.phone,
      o.shippingAddress?.city,
      (o.items || []).map((i) => `${i.qty}x ${i.title}`).join("; "),
      o.subtotal,
      o.shippingCharge || 0,
      o.tax,
      o.discount,
      o.total,
      paymentLabels[o.paymentMethod] || o.paymentMethod,
      o.paymentStatus,
      o.orderStatus,
      o.shipment?.courier?.name,
      o.shipment?.trackingNumber,
    ]),
  ]
    .map((r) => r.map((v) => `"${String(v ?? "").replace(/"/g, '""')}"`).join(","))
    .join("\n");

export const downloadCSV = (csv, name) => {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
  a.download = `${name}-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(a.href);
};
