"use client";

import { useMemo } from "react";
import { useAdminOrders } from "@/lib/hooks/useAdmin";

// per-customer order count, spend and last order date, derived from all orders
export default function useCustomerStats() {
  const { data: orders = [], isLoading } = useAdminOrders();
  const stats = useMemo(() => {
    const map = {};
    orders.forEach((o) => {
      const id = o.user_id?._id || o.user_id;
      if (!id) return;
      const entry = (map[id] ||= { orders: 0, spent: 0, lastOrder: null, list: [] });
      entry.orders += 1;
      entry.list.push(o);
      if (o.orderStatus !== "cancelled" && o.paymentStatus === "completed") entry.spent += o.total;
      if (!entry.lastOrder || new Date(o.orderDate) > new Date(entry.lastOrder)) entry.lastOrder = o.orderDate;
    });
    return map;
  }, [orders]);
  return { stats, isLoading };
}
