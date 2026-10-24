"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { adminService } from "../services/adminService";

const errorMessage = (error) => error?.response?.data?.message || error?.message || "Something went wrong";

// read hooks
export const useAdminQuery = (key, fn, options = {}) =>
  useQuery({ queryKey: ["admin", ...key], queryFn: fn, staleTime: 60 * 1000, ...options });

export const useAdminStats = (options = {}) => useAdminQuery(["stats"], adminService.stats, options);
export const useAdminRevenue = () => useAdminQuery(["revenue"], adminService.revenue);
export const useAdminProductAnalytics = () => useAdminQuery(["product-analytics"], adminService.productAnalytics);
export const useAdminCustomerAnalytics = (options = {}) => useAdminQuery(["customer-analytics"], adminService.customerAnalytics, options);
export const useAdminActivities = () => useAdminQuery(["activities"], () => adminService.activities(8));
export const useAdminProducts = (params) => useAdminQuery(["products", params], () => adminService.products(params), { placeholderData: (prev) => prev });
export const useAdminProduct = (id) => useAdminQuery(["product", id], () => adminService.product(id), { enabled: !!id });
export const useAdminCategories = () => useAdminQuery(["categories"], adminService.categories);
export const useAdminBrands = () => useAdminQuery(["brands"], adminService.brands);
export const useAdminOrders = (params = {}, options = {}) => useAdminQuery(["orders", params], () => adminService.orders(params), options);
export const useAdminOrder = (id) => useAdminQuery(["order", id], () => adminService.order(id), { enabled: !!id });
export const useAdminPayments = () => useAdminQuery(["payments"], adminService.payments);
export const useAdminPaymentStats = (options = {}) => useAdminQuery(["payment-stats"], adminService.paymentStats, options);
export const useAdminUsers = (options = {}) => useAdminQuery(["users"], adminService.users, options);
export const useAdminUser = (id) => useAdminQuery(["user", id], () => adminService.user(id), { enabled: !!id });
export const useAdminReviews = () => useAdminQuery(["reviews"], adminService.reviews);
export const useAdminShipping = () => useAdminQuery(["shipping"], adminService.shipping);
export const useAdminCouriers = (options = {}) => useAdminQuery(["couriers"], () => adminService.couriers(), options);
export const useAdminCoupons = () => useAdminQuery(["coupons"], adminService.coupons);
export const useAdminCoupon = (id) => useAdminQuery(["coupon", id], () => adminService.coupon(id), { enabled: !!id });
export const useInventorySummary = () => useAdminQuery(["inventory-summary"], adminService.inventorySummary);
export const useStockMovements = (params) => useAdminQuery(["stock-movements", params], () => adminService.stockMovements(params), { placeholderData: (prev) => prev });
export const useAdminSettings = () => useAdminQuery(["settings"], adminService.settings);
export const useAdminProfile = () => useAdminQuery(["profile"], adminService.profile);

// write hook: runs a mutation, toasts the result and refreshes admin (and storefront) data
export const useAdminMutation = (fn, { success, invalidate = [["admin"]], onSuccess } = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: fn,
    onSuccess: (data, variables) => {
      invalidate.forEach((queryKey) => queryClient.invalidateQueries({ queryKey }));
      // storefront caches (products, categories, brands, reviews) share the same data
      ["products", "categories", "brands", "reviews"].forEach((key) => queryClient.invalidateQueries({ queryKey: [key] }));
      if (success) toast.success(typeof success === "function" ? success(data, variables) : success);
      onSuccess?.(data, variables);
    },
    onError: (error) => toast.error(errorMessage(error)),
  });
};
