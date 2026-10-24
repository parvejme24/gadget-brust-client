// Shared coupon helpers for the dashboard and storefront

const taka = (n) => `৳${Math.round(Number(n) || 0).toLocaleString("en-IN")}`;

export const COUPON_TYPES = {
  percentage: { label: "Percentage off", short: "% off" },
  fixed: { label: "Fixed amount off", short: "৳ off" },
  bogo: { label: "Buy X get Y", short: "BOGO" },
  free_shipping: { label: "Free delivery", short: "Free delivery" },
};

export const describeCoupon = (c) => {
  if (!c) return "";
  if (c.type === "percentage") return `${c.value}% off${c.maxDiscount ? `, up to ${taka(c.maxDiscount)}` : ""}`;
  if (c.type === "fixed") return `${taka(c.value)} off`;
  if (c.type === "free_shipping") return "Free delivery";
  if (c.type === "bogo") {
    const { buyQty = 1, getQty = 1, getDiscountPercent = 100 } = c.bogo || {};
    return `Buy ${buyQty} get ${getQty} ${getDiscountPercent >= 100 ? "free" : `${getDiscountPercent}% off`}`;
  }
  return "";
};

// active | scheduled | expired | paused | used-up
export const couponStatus = (c, now = new Date()) => {
  if (!c.isActive) return "paused";
  if (c.endDate && new Date(c.endDate) < now) return "expired";
  if (c.startDate && new Date(c.startDate) > now) return "scheduled";
  if (c.usageLimit && c.usedCount >= c.usageLimit) return "used-up";
  return "active";
};

export const scopeLabel = (c, { categories = [], brands = [] } = {}) => {
  const names = (ids, list, key) => ids.map((id) => list.find((x) => x._id === (id?._id || id))?.[key]).filter(Boolean);
  if (c.appliesTo === "products") return `${c.products?.length || 0} selected product${c.products?.length === 1 ? "" : "s"}`;
  if (c.appliesTo === "categories") return names(c.categories || [], categories, "categoryName").join(", ") || "Selected categories";
  if (c.appliesTo === "brands") return names(c.brands || [], brands, "brandName").join(", ") || "Selected brands";
  return "All products";
};

export const conditionsLabel = (c) =>
  [
    c.minOrderAmount ? `Min. order ${taka(c.minOrderAmount)}` : null,
    c.minQuantity ? `Min. ${c.minQuantity} items` : null,
    c.firstOrderOnly ? "First order only" : null,
    c.excludeDiscountedItems ? "Not on sale items" : null,
    c.usageLimitPerUser ? `${c.usageLimitPerUser}× per customer` : null,
  ]
    .filter(Boolean)
    .join(" · ");

// does an offer apply to this product? (storefront)
export const offerAppliesTo = (offer, product) => {
  const id = (v) => String(v?._id || v || "");
  if (offer.excludeDiscountedItems && product.discount > 0) return false;
  if (offer.appliesTo === "products") return (offer.products || []).some((p) => id(p) === id(product._id));
  if (offer.appliesTo === "categories") return (offer.categories || []).some((c) => id(c) === id(product.category));
  if (offer.appliesTo === "brands") return (offer.brands || []).some((b) => id(b) === id(product.brand));
  return true;
};
