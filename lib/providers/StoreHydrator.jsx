"use client";

import { useEffect } from "react";
import { useStore } from "react-redux";
import { hydrateShop, SHOP_STORAGE_KEY } from "@/lib/store/slices/shopSlice";
import { sessionRestored } from "@/lib/store/slices/authSlice";
import { tokenStorage } from "@/lib/session/tokenStorage";

const readJSON = (key) => {
  try {
    return JSON.parse(localStorage.getItem(key) || "null");
  } catch {
    return null;
  }
};

// Restores the signed-in user and the browser cart/wishlist after load, then keeps the cart/wishlist saved.
export default function StoreHydrator() {
  const store = useStore();

  useEffect(() => {
    store.dispatch(sessionRestored(tokenStorage.readUser()));
    store.dispatch(hydrateShop(readJSON(SHOP_STORAGE_KEY)));

    let last = null;
    const unsubscribe = store.subscribe(() => {
      const { cart, wishlist, hydrated } = store.getState().shop;
      if (!hydrated) return;
      const next = JSON.stringify({ cart, wishlist });
      if (next === last) return;
      last = next;
      try {
        localStorage.setItem(SHOP_STORAGE_KEY, next);
      } catch {
        // storage full or blocked: cart still works for this session
      }
    });

    // keep multiple tabs in sync (cart, wishlist and sign-in/out)
    const onStorage = (e) => {
      if (e.key === SHOP_STORAGE_KEY) store.dispatch(hydrateShop(readJSON(SHOP_STORAGE_KEY)));
      if (e.key === "accessToken" || e.key === "userData") store.dispatch(sessionRestored(tokenStorage.readUser()));
    };
    window.addEventListener("storage", onStorage);

    return () => {
      unsubscribe();
      window.removeEventListener("storage", onStorage);
    };
  }, [store]);

  return null;
}
