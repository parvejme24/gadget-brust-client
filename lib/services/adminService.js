import api from "../api";

// All admin dashboard API calls. Every function returns the `data` field of the API envelope.
const unwrap = (promise) => promise.then((res) => res.data?.data);

export const adminService = {
  // dashboard analytics
  stats: () => unwrap(api.get("/dashboard/stats")),
  revenue: () => unwrap(api.get("/dashboard/revenue")),
  productAnalytics: () => unwrap(api.get("/dashboard/products")),
  customerAnalytics: () => unwrap(api.get("/dashboard/customers")),
  salesAnalytics: () => unwrap(api.get("/dashboard/sales")),
  activities: (limit = 8) => unwrap(api.get("/dashboard/activities", { params: { limit } })),

  // products
  products: (params) => unwrap(api.get("/products", { params })),
  product: (id) => unwrap(api.get(`/products/${id}`)),
  createProduct: (data) => unwrap(api.post("/products", data)),
  updateProduct: (id, data) => unwrap(api.put(`/products/${id}`, data)),
  deleteProduct: (id) => unwrap(api.delete(`/products/${id}`)),

  // catalog
  categories: () => unwrap(api.get("/categories")),
  createCategory: (data) => unwrap(api.post("/categories", data)),
  updateCategory: (id, data) => unwrap(api.put(`/categories/${id}`, data)),
  deleteCategory: (id) => unwrap(api.delete(`/categories/${id}`)),
  brands: () => unwrap(api.get("/brands")),
  createBrand: (data) => unwrap(api.post("/brands", data)),
  updateBrand: (id, data) => unwrap(api.put(`/brands/${id}`, data)),
  deleteBrand: (id) => unwrap(api.delete(`/brands/${id}`)),

  // orders (invoices)
  orders: (params) => unwrap(api.get("/invoices", { params })),
  order: (id) => unwrap(api.get(`/invoices/${id}`)),
  createOrder: (data) => unwrap(api.post("/invoices", data)),
  // { items?, customer?, shippingAddress?, shippingCharge?, discount?, notes?, userId? }
  editOrder: (id, data) => unwrap(api.put(`/invoices/${id}`, data)),
  updateOrderStatus: (id, orderStatus, note) => unwrap(api.patch(`/invoices/${id}/order-status`, { orderStatus, note })),
  updateOrderPayment: (id, paymentStatus) => unwrap(api.patch(`/invoices/${id}/payment-status`, { paymentStatus })),
  deleteOrder: (id) => unwrap(api.delete(`/invoices/${id}`)),

  updateShipment: (id, data) => unwrap(api.patch(`/invoices/${id}/shipment`, data)),

  // couriers
  couriers: (params) => unwrap(api.get("/couriers", { params })),
  createCourier: (data) => unwrap(api.post("/couriers", data)),
  updateCourier: (id, data) => unwrap(api.put(`/couriers/${id}`, data)),
  toggleCourier: (id) => unwrap(api.patch(`/couriers/${id}/toggle-status`)),
  setDefaultCourier: (id) => unwrap(api.patch(`/couriers/${id}/default`)),
  deleteCourier: (id) => unwrap(api.delete(`/couriers/${id}`)),

  // coupons
  coupons: () => unwrap(api.get("/coupons")),
  coupon: (id) => unwrap(api.get(`/coupons/${id}`)),
  createCoupon: (data) => unwrap(api.post("/coupons", data)),
  updateCoupon: (id, data) => unwrap(api.put(`/coupons/${id}`, data)),
  toggleCoupon: (id) => unwrap(api.patch(`/coupons/${id}/toggle`)),
  deleteCoupon: (id) => unwrap(api.delete(`/coupons/${id}`)),
  applyCoupon: (data) => unwrap(api.post("/coupons/apply", data)),

  // inventory
  inventorySummary: () => unwrap(api.get("/inventory/summary")),
  stockMovements: (params) => unwrap(api.get("/inventory/movements", { params })),
  adjustStock: (data) => unwrap(api.post("/inventory/adjust", data)),

  // point of sale
  createSale: (data) => unwrap(api.post("/pos/orders", data)),

  // staff
  createUser: (data) => unwrap(api.post("/users", data)),
  updateUser: (id, data) => unwrap(api.put(`/users/${id}`, data)),

  // payments
  payments: () => unwrap(api.get("/payments/admin/all")),
  paymentStats: () => unwrap(api.get("/payments/admin/stats")),

  // customers
  users: () => unwrap(api.get("/users")),
  user: (id) => unwrap(api.get(`/users/${id}`)),
  updateUserRole: (id, role) => unwrap(api.put(`/users/${id}/role`, { role })),
  deleteUser: (id) => unwrap(api.delete(`/users/${id}`)),

  // reviews
  reviews: () => unwrap(api.get("/reviews")),
  deleteReview: (id) => unwrap(api.delete(`/reviews/${id}`)),

  // shipping
  shipping: () => unwrap(api.get("/shipping")),
  createShipping: (data) => unwrap(api.post("/shipping", data)),
  updateShipping: (id, data) => unwrap(api.put(`/shipping/${id}`, data)),
  toggleShipping: (id) => unwrap(api.patch(`/shipping/${id}/toggle-status`)),
  deleteShipping: (id) => unwrap(api.delete(`/shipping/${id}`)),

  // settings & profile
  settings: () => unwrap(api.get("/store-settings")),

  // contact form inbox: { status, search, page, limit } -> { messages, total, page, pages, counts }
  messages: (params) => unwrap(api.get("/contact", { params })),
  updateMessageStatus: (id, status) => unwrap(api.patch(`/contact/${id}/status`, { status })),
  updateSettings: (data) => unwrap(api.put("/store-settings", data)),
  profile: () => unwrap(api.get("/profile")),
  updateProfile: (data) => unwrap(api.put("/profile", data)),
  changePassword: (data) => unwrap(api.put("/change-password", data)),

  // images: upload a file, get back its hosted URL
  uploadImage: (file) => {
    const form = new FormData();
    form.append("image", file);
    return unwrap(api.post("/upload/single", form)).then((data) => data?.url);
  },
};
