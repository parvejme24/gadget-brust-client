// Formatting helpers shared by the storefront and the dashboard.

export const cx = (...classes) => classes.filter(Boolean).join(" ");

export const formatTaka = (amount) => `৳${Math.round(Number(amount) || 0).toLocaleString("en-IN")}`;
export const formatCompact = (amount) => {
  const n = Number(amount) || 0;
  if (n >= 10000000) return `৳${(n / 10000000).toFixed(2)}Cr`;
  if (n >= 100000) return `৳${(n / 100000).toFixed(1)}L`;
  if (n >= 1000) return `৳${(n / 1000).toFixed(1)}K`;
  return `৳${Math.round(n)}`;
};
export const formatDate = (value, withTime = false) =>
  value
    ? new Date(value).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
        ...(withTime && { hour: "2-digit", minute: "2-digit" }),
      })
    : "—";

// selling price after any discount
export const getFinalPrice = (product) => {
  if (product?.discountPrice && product.discountPrice < product.price) {
    return product.discountPrice;
  }
  if (product?.discount > 0) {
    return product.price - (product.price * product.discount) / 100;
  }
  return product?.price || 0;
};

export const paymentLabels = { ssl_commerz: "SSLCommerz", stripe: "Stripe", shurjopay: "ShurjoPay", cash_on_delivery: "Cash on delivery", cash: "Cash", card: "Card", bkash: "bKash", nagad: "Nagad" };

// account holder, or the walk-in name typed at the POS
export const customerName = (o) => o?.user_id?.fullName || o?.customer?.name || "Walk-in customer";
export const isGuestOrder = (o) => o?.source !== "pos" && !o?.user_id;

export const trackingLink = (courier, trackingNumber) =>
  courier?.trackingUrl && trackingNumber ? courier.trackingUrl.replace("{tracking}", encodeURIComponent(trackingNumber)) : null;

export const stockStatus = (stock, threshold = 10) => (stock === 0 ? "out-of-stock" : stock <= threshold ? "low-stock" : "in-stock");

// what a shipping method charges for a subtotal (matches the server's calculation without weight)
export const deliveryCharge = (method, subtotal) =>
  !method ? 0 : method.freeShippingThreshold > 0 && subtotal >= method.freeShippingThreshold ? 0 : method.baseCharge;
