import api from "../api";

const unwrap = (promise) => promise.then((res) => res.data?.data);

// the signed-in user's own data (any role)
export const accountService = {
  summary: () => unwrap(api.get("/dashboard/me")),
  orders: () => unwrap(api.get("/invoices/mine")),
  order: (id) => unwrap(api.get(`/invoices/${id}`)),
  reviews: (userId) => unwrap(api.get(`/reviews/customer/${userId}`)),

  notifications: (params) => unwrap(api.get("/notifications", { params })),
  markNotificationRead: (id) => unwrap(api.patch(`/notifications/${id}/read`)),
  markAllNotificationsRead: () => unwrap(api.patch("/notifications/read-all")),

  // role-aware search across products, orders, customers, coupons and staff
  search: (q, signal) => unwrap(api.get("/search", { params: { q }, signal })),
};
