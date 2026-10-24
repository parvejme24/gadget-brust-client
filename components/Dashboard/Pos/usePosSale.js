"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { adminService } from "@/lib/services/adminService";
import { useAdminMutation, useAdminSettings } from "@/lib/hooks/useAdmin";
import { getFinalPrice } from "@/lib/format";

export const unitPrice = (p) => getFinalPrice(p);

// Everything about the sale being rung up: lines, customer, coupon, discount, VAT and payment.
export function usePosSale() {
  const { data: settings } = useAdminSettings();
  const [cart, setCart] = useState([]); // [{ product, qty }]
  const [customerMode, setCustomerMode] = useState("walkin");
  const [walkin, setWalkin] = useState({ name: "", phone: "" });
  const [customer, setCustomer] = useState(null);
  const [couponInput, setCouponInput] = useState("");
  const [coupon, setCoupon] = useState(null); // { code, discount, summary }
  const [couponChecking, setCouponChecking] = useState(false);
  const [manualDiscount, setManualDiscount] = useState("");
  const [includeVat, setIncludeVat] = useState(false);
  const [method, setMethod] = useState("cash");
  const [received, setReceived] = useState("");
  const [note, setNote] = useState("");
  const [completed, setCompleted] = useState(null);

  const qtyOf = (id) => cart.find((l) => l.product._id === id)?.qty || 0;
  const add = (product) => {
    if (qtyOf(product._id) >= product.stock) {
      toast.error(`Only ${product.stock} in stock`);
      return;
    }
    setCart((c) => (c.some((l) => l.product._id === product._id) ? c.map((l) => (l.product._id === product._id ? { ...l, qty: l.qty + 1 } : l)) : [...c, { product, qty: 1 }]));
  };
  const setQty = (id, qty) => setCart((c) => c.map((l) => (l.product._id === id ? { ...l, qty: Math.max(1, Math.min(qty, l.product.stock)) } : l)));
  const removeLine = (id) => setCart((c) => c.filter((l) => l.product._id !== id));

  const subtotal = cart.reduce((s, l) => s + unitPrice(l.product) * l.qty, 0);
  const couponDiscount = coupon?.discount || 0;
  const manual = Math.max(0, Math.min(Math.round(Number(manualDiscount) || 0), subtotal - couponDiscount));
  const afterDiscount = subtotal - couponDiscount - manual;
  const taxRate = settings?.taxRate || 0;
  const vat = includeVat ? Math.round((afterDiscount * taxRate) / 100) : 0;
  const total = afterDiscount + vat;
  const receivedAmount = method === "cash" ? Math.round(Number(received) || 0) : total;
  const change = receivedAmount - total;
  const items = cart.map((l) => ({ product: l.product._id, qty: l.qty }));

  const applyCoupon = async (code = couponInput) => {
    if (!code.trim() || !cart.length) return false;
    setCouponChecking(true);
    try {
      const result = await adminService.applyCoupon({ code: code.trim(), items, forUser: customer?._id });
      setCoupon(result);
      setCouponInput(result.code);
      return true;
    } catch (error) {
      setCoupon(null);
      toast.error(error?.response?.data?.message || "Couldn't apply this coupon");
      return false;
    } finally {
      setCouponChecking(false);
    }
  };
  const removeCoupon = () => {
    setCoupon(null);
    setCouponInput("");
  };

  // re-check the coupon whenever the cart or customer changes
  const cartKey = JSON.stringify(items) + (customer?._id || "");
  useEffect(() => {
    if (!coupon) return;
    if (!cart.length) {
      setCoupon(null);
      return;
    }
    const t = setTimeout(() => applyCoupon(coupon.code), 400);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cartKey]);

  const reset = () => {
    setCart([]);
    setCustomer(null);
    setWalkin({ name: "", phone: "" });
    removeCoupon();
    setManualDiscount("");
    setIncludeVat(false);
    setMethod("cash");
    setReceived("");
    setNote("");
  };

  const sale = useAdminMutation((payload) => adminService.createSale(payload), {
    onSuccess: (invoice) => {
      setCompleted(invoice);
      reset();
    },
  });

  const checkout = () => {
    if (!cart.length) return toast.error("Add products to the sale");
    if (method === "cash" && change < 0) return toast.error("Amount received is less than the total");
    sale.mutate({
      customer: customerMode === "registered" && customer ? { userId: customer._id } : { name: walkin.name.trim() || "Walk-in customer", phone: walkin.phone.trim() },
      items,
      couponCode: coupon?.code,
      manualDiscount: manual,
      includeVat,
      paymentMethod: method,
      amountPaid: method === "cash" ? receivedAmount : total,
      note: note.trim(),
    });
  };

  const quickCash = [...new Set([total, Math.ceil(total / 500) * 500, Math.ceil(total / 1000) * 1000, Math.ceil(total / 1000) * 1000 + 1000])].filter((v) => v > 0).slice(0, 4);

  return {
    settings,
    cart, qtyOf, add, setQty, removeLine, clearCart: () => setCart([]),
    customerMode, setCustomerMode, walkin, setWalkin, customer, setCustomer,
    couponInput, setCouponInput, coupon, couponChecking, applyCoupon, removeCoupon,
    manualDiscount, setManualDiscount, includeVat, setIncludeVat, taxRate,
    method, setMethod, received, setReceived, note, setNote, quickCash,
    subtotal, couponDiscount, manual, vat, total, change,
    sale, checkout, completed, setCompleted,
  };
}
