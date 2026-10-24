import api from "../api";
import { toShopItem } from "../store/slices/shopSlice";

// Signed-in users keep their cart and wishlist on the server, so they follow them across devices.
// The browser copy (Redux + localStorage) stays the source for the UI; these calls keep the server in step.

const fromCartLine = (line) => ({ ...toShopItem(line.product_id), qty: line.qty });
const fromWishlistRow = (row) => ({ ...toShopItem(row.productID), addedAt: row.createdAt });

const cartBody = (cart) => ({ items: cart.map((i) => ({ product_id: i._id, qty: i.qty || 1 })) });
const wishlistBody = (wishlist) => ({ productIDs: wishlist.map((i) => i._id) });

// After sign-in: merge the guest cart/wishlist into the saved ones and return the merged lists
export const mergeShopOnSignIn = async ({ cart = [], wishlist = [] }) => {
  const [c, w] = await Promise.all([api.post("/cart/sync", cartBody(cart)), api.post("/wishlist/sync", wishlistBody(wishlist))]);
  return {
    cart: (c.data?.data?.cartItems || []).map(fromCartLine),
    wishlist: (w.data?.data?.items || []).map(fromWishlistRow),
  };
};

// After a change while signed in: save the whole list
export const saveCart = (cart) => api.put("/cart/me", cartBody(cart));
export const saveWishlist = (wishlist) => api.put("/wishlist/me", wishlistBody(wishlist));
