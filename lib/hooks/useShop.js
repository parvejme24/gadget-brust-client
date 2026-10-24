"use client";

import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "./redux";
import {
  addToCart,
  clearCart,
  clearWishlist,
  removeFromCart,
  removeFromWishlist,
  setCartOpen,
  toggleWishlist,
  updateCartQty,
} from "../store/slices/shopSlice";
import { useStoreSettings } from "./useStorefront";

// browser cart: works for guests and signed-in users alike
export const useShopCart = () => {
  const dispatch = useAppDispatch();
  const { cart, cartOpen, hydrated } = useAppSelector((state) => state.shop);
  const freeDeliveryThreshold = useStoreSettings().settings.freeDeliveryThreshold || 0;

  const count = cart.reduce((sum, item) => sum + item.qty, 0);
  const subtotal = cart.reduce((sum, item) => sum + item.finalPrice * item.qty, 0);
  const savings = cart.reduce((sum, item) => sum + (item.price - item.finalPrice) * item.qty, 0);

  return {
    items: cart,
    count,
    subtotal,
    savings,
    hydrated,
    isOpen: cartOpen,
    // free-delivery progress from store settings (0 threshold = no free-delivery offer)
    freeDeliveryThreshold,
    freeDeliveryRemaining: freeDeliveryThreshold ? Math.max(0, freeDeliveryThreshold - subtotal) : 0,
    freeDeliveryProgress: freeDeliveryThreshold ? Math.min(100, (subtotal / freeDeliveryThreshold) * 100) : 0,
    isInCart: (id) => cart.some((item) => item._id === id),
    add: (product, qty = 1, { openDrawer = true, silent = false } = {}) => {
      if (product.stock === 0) {
        toast.error("This product is out of stock");
        return;
      }
      dispatch(addToCart({ product, qty }));
      if (!silent) toast.success("Added to cart", { description: product.title });
      if (openDrawer) dispatch(setCartOpen(true));
    },
    updateQty: (id, qty) => dispatch(updateCartQty({ id, qty })),
    remove: (id) => dispatch(removeFromCart(id)),
    clear: () => dispatch(clearCart()),
    open: () => dispatch(setCartOpen(true)),
    close: () => dispatch(setCartOpen(false)),
  };
};

export const useShopWishlist = () => {
  const dispatch = useAppDispatch();
  const wishlist = useAppSelector((state) => state.shop.wishlist);

  return {
    items: wishlist,
    count: wishlist.length,
    isWishlisted: (id) => wishlist.some((item) => item._id === id),
    toggle: (product) => {
      const exists = wishlist.some((item) => item._id === product._id);
      dispatch(toggleWishlist(product));
      toast(exists ? "Removed from wishlist" : "Saved to wishlist", { description: product.title });
    },
    remove: (id) => dispatch(removeFromWishlist(id)),
    clear: () => dispatch(clearWishlist()),
  };
};
