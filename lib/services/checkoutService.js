import api from "../api";

const unwrap = (promise) => promise.then((res) => res.data?.data);

// storefront checkout; works for guests and signed-in customers
export const checkoutService = {
  // items: [{ product, qty }]
  quote: ({ items, shippingMethod, couponCode }) => unwrap(api.post("/invoices/quote", { items, shippingMethod, couponCode })),
  placeOrder: (order) => unwrap(api.post("/invoices/checkout", order)),
  track: ({ number, phone }) => unwrap(api.get("/invoices/track", { params: { number, phone } })),
};
