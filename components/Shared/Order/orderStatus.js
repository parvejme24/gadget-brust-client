// Order lifecycle wording shared by the dashboard, the customer area and public tracking.
export const ORDER_STEPS = ["pending", "processing", "shipped", "delivered"];

export const STEP_LABEL = {
  pending: "Placed",
  processing: "Accepted",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

// what the customer reads about their order
export const CUSTOMER_STATUS_TEXT = {
  pending: "We've received your order and will call you to confirm it.",
  processing: "Your order is confirmed and being packed.",
  shipped: "Your order is on its way with our courier partner.",
  delivered: "Your order was delivered. Enjoy!",
  cancelled: "This order was cancelled.",
};

export const HISTORY_LABEL = {
  pending: "Order placed",
  processing: "Order accepted",
  shipped: "Handed to courier",
  delivered: "Delivered",
  cancelled: "Cancelled",
};
