import { createSlice } from "@reduxjs/toolkit";

// Browser-only cart and wishlist so guests can shop without logging in.
// Items keep a snapshot of the product so the cart and wishlist pages render without API calls.

export const SHOP_STORAGE_KEY = "gadgetBrustShop";

export const toShopItem = (product) => {
  const price = Number(product.price) || 0;
  const discount = Number(product.discount) || 0;
  const finalPrice =
    product.discountPrice && product.discountPrice < price
      ? product.discountPrice
      : discount > 0
      ? Math.round(price - (price * discount) / 100)
      : price;

  return {
    _id: product._id,
    title: product.title,
    image: product.image?.url || product.image || "",
    price,
    finalPrice,
    discount,
    stock: Number(product.stock) || 0,
    brandName: typeof product.brand === "object" ? product.brand?.brandName : product.brandName || "",
    subcategory: product.subcategory || "",
  };
};

const shopSlice = createSlice({
  name: "shop",
  initialState: {
    cart: [],
    wishlist: [],
    hydrated: false,
    cartOpen: false,
  },
  reducers: {
    hydrateShop: (state, action) => {
      state.cart = action.payload?.cart || [];
      state.wishlist = action.payload?.wishlist || [];
      state.hydrated = true;
    },
    addToCart: (state, action) => {
      const { product, qty = 1 } = action.payload;
      const item = toShopItem(product);
      const existing = state.cart.find((i) => i._id === item._id);
      const max = item.stock || 99;
      if (existing) {
        existing.qty = Math.min(existing.qty + qty, max);
        Object.assign(existing, { ...item, qty: existing.qty });
      } else {
        state.cart.unshift({ ...item, qty: Math.min(qty, max) });
      }
    },
    updateCartQty: (state, action) => {
      const { id, qty } = action.payload;
      const item = state.cart.find((i) => i._id === id);
      if (item) item.qty = Math.max(1, Math.min(qty, item.stock || 99));
    },
    removeFromCart: (state, action) => {
      state.cart = state.cart.filter((i) => i._id !== action.payload);
    },
    clearCart: (state) => {
      state.cart = [];
    },
    toggleWishlist: (state, action) => {
      const item = toShopItem(action.payload);
      const exists = state.wishlist.some((i) => i._id === item._id);
      state.wishlist = exists
        ? state.wishlist.filter((i) => i._id !== item._id)
        : [{ ...item, addedAt: new Date().toISOString() }, ...state.wishlist];
    },
    removeFromWishlist: (state, action) => {
      state.wishlist = state.wishlist.filter((i) => i._id !== action.payload);
    },
    clearWishlist: (state) => {
      state.wishlist = [];
    },
    setCartOpen: (state, action) => {
      state.cartOpen = action.payload;
    },
  },
});

export const {
  hydrateShop,
  addToCart,
  updateCartQty,
  removeFromCart,
  clearCart,
  toggleWishlist,
  removeFromWishlist,
  clearWishlist,
  setCartOpen,
} = shopSlice.actions;

export default shopSlice.reducer;
