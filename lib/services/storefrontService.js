import api from "../api";

const body = (promise) => promise.then((res) => res.data);
// product list endpoints answer { data: { products } } or { data: [...] }
const productList = (promise) => promise.then((res) => ({ data: res.data?.data?.products || res.data?.data || [] }));

// public storefront data (no sign-in needed)
export const storefrontService = {
  products: (params) => api.get("/products", { params }).then((res) => ({ data: res.data.data.products, pagination: res.data.data.pagination })),
  sliderProducts: () => productList(api.get("/products/slider")),
  discountedProducts: () => productList(api.get("/products/discounted")),
  productsByCategory: (categoryId) => productList(api.get(`/products/category/${categoryId}`)),
  product: (id) => api.get(`/products/${id}`).then((res) => ({ data: res.data?.data?.product || res.data?.data })),

  categories: () => body(api.get("/categories")),
  brands: () => body(api.get("/brands")),

  productReviews: (productId) => body(api.get(`/reviews/product/${productId}`)),
  createReview: (data) => body(api.post("/reviews", data)),

  // store details, delivery options and live coupon offers managed from the dashboard
  settings: () => api.get("/store-settings").then((res) => res.data?.data || {}),
  shippingMethods: () => api.get("/shipping").then((res) => (res.data?.data || []).filter((m) => m.isActive)),
  offers: () => api.get("/coupons/offers").then((res) => res.data?.data || []),
};
