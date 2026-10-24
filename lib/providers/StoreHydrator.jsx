"use client";

import { useEffect } from "react";
import { useStore } from "react-redux";
import { hydrateShop, SHOP_STORAGE_KEY } from "@/lib/store/slices/shopSlice";
import { sessionRestored } from "@/lib/store/slices/authSlice";
import { tokenStorage } from "@/lib/session/tokenStorage";
import { mergeShopOnSignIn, saveCart, saveWishlist } from "@/lib/services/shopSync";

const SAVE_DELAY_MS = 600;

const readJSON = (key) => {
  try {
    return JSON.parse(localStorage.getItem(key) || "null");
  } catch {
    return null;
  }
};

// Restores the signed-in user and the browser cart/wishlist after load, then keeps the cart/wishlist saved:
// in the browser always, and on the server while signed in (merged at sign-in, cleared locally at sign-out).
export default function StoreHydrator() {
  const store = useStore();

  useEffect(() => {
    store.dispatch(sessionRestored(tokenStorage.readUser()));
    store.dispatch(hydrateShop(readJSON(SHOP_STORAGE_KEY)));

    let last = null;
    let userId = null;
    let merging = false;
    let saved = { cart: null, wishlist: null }; // what the server has, as JSON
    let saveTimer = null;

    const snapshot = () => {
      const { cart, wishlist } = store.getState().shop;
      return { cart: JSON.stringify(cart.map((i) => [i._id, i.qty])), wishlist: JSON.stringify(wishlist.map((i) => i._id)) };
    };

    const merge = async () => {
      merging = true;
      try {
        const { cart, wishlist } = store.getState().shop;
        store.dispatch(hydrateShop(await mergeShopOnSignIn({ cart, wishlist })));
        saved = snapshot();
      } catch {
        // offline or session expired: keep the browser copy, it is merged on the next sign-in
      } finally {
        merging = false;
      }
    };

    const saveChanges = () => {
      clearTimeout(saveTimer);
      saveTimer = setTimeout(() => {
        if (!userId || merging) return;
        const now = snapshot();
        const { cart, wishlist } = store.getState().shop;
        if (now.cart !== saved.cart) saveCart(cart).then(() => (saved.cart = now.cart)).catch(() => {});
        if (now.wishlist !== saved.wishlist) saveWishlist(wishlist).then(() => (saved.wishlist = now.wishlist)).catch(() => {});
      }, SAVE_DELAY_MS);
    };

    const onChange = () => {
      const { shop, auth } = store.getState();
      if (!shop.hydrated) return;

      const nextUserId = auth.user?._id || null;
      if (nextUserId !== userId) {
        const signedOut = userId && !nextUserId;
        userId = nextUserId;
        saved = { cart: null, wishlist: null };
        if (signedOut) store.dispatch(hydrateShop({})); // the next shopper on this browser starts empty
        else if (userId) merge();
      } else if (userId && !merging) {
        saveChanges();
      }

      const next = JSON.stringify({ cart: shop.cart, wishlist: shop.wishlist });
      if (next === last) return;
      last = next;
      try {
        localStorage.setItem(SHOP_STORAGE_KEY, next);
      } catch {
        // storage full or blocked: cart still works for this session
      }
    };
    const unsubscribe = store.subscribe(onChange);
    onChange();

    // keep multiple tabs in sync (cart, wishlist and sign-in/out)
    const onStorage = (e) => {
      if (e.key === SHOP_STORAGE_KEY) store.dispatch(hydrateShop(readJSON(SHOP_STORAGE_KEY)));
      if (e.key === "accessToken" || e.key === "userData") store.dispatch(sessionRestored(tokenStorage.readUser()));
    };
    window.addEventListener("storage", onStorage);

    return () => {
      unsubscribe();
      clearTimeout(saveTimer);
      window.removeEventListener("storage", onStorage);
    };
  }, [store]);

  return null;
}
