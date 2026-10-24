"use client";

import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { accountService } from "../services/accountService";

// the signed-in user's own data, cached per user
const useAccountQuery = (key, fn, options = {}) =>
  useQuery({ queryKey: ["account", ...key], queryFn: fn, staleTime: 30 * 1000, ...options });

export const useAccountSummary = (options) => useAccountQuery(["summary"], accountService.summary, options);
export const useMyOrders = () => useAccountQuery(["orders"], accountService.orders);
export const useMyOrder = (id) => useAccountQuery(["order", id], () => accountService.order(id), { enabled: !!id });
export const useMyReviews = (userId) => useAccountQuery(["reviews", userId], () => accountService.reviews(userId), { enabled: !!userId });

const errorToast = (fallback) => (error) => toast.error(error?.response?.data?.message || fallback);

// edit/delete the user's own reviews
export const useMyReviewActions = () => {
  const queryClient = useQueryClient();
  const refresh = () => queryClient.invalidateQueries({ queryKey: ["account", "reviews"] });
  const update = useMutation({ mutationFn: accountService.updateReview, onSuccess: refresh, onError: errorToast("Couldn't save your review") });
  const remove = useMutation({ mutationFn: accountService.deleteReview, onSuccess: refresh, onError: errorToast("Couldn't delete your review") });
  return { update, remove };
};

export const useAddresses = (options) => useAccountQuery(["addresses"], accountService.addresses, options);

export const useAddressActions = () => {
  const queryClient = useQueryClient();
  const refresh = () => queryClient.invalidateQueries({ queryKey: ["account", "addresses"] });
  const onError = errorToast("Couldn't save the address");
  return {
    create: useMutation({ mutationFn: accountService.createAddress, onSuccess: refresh, onError }),
    update: useMutation({ mutationFn: accountService.updateAddress, onSuccess: refresh, onError }),
    remove: useMutation({ mutationFn: accountService.deleteAddress, onSuccess: refresh, onError }),
    setDefault: useMutation({ mutationFn: accountService.setDefaultAddress, onSuccess: refresh, onError }),
  };
};

// notifications refresh every 30 seconds and when the tab regains focus
export const useNotifications = (params = { limit: 20 }) =>
  useQuery({
    queryKey: ["notifications", params],
    queryFn: () => accountService.notifications(params),
    refetchInterval: 30 * 1000,
    refetchOnWindowFocus: true,
    staleTime: 10 * 1000,
  });

export const useNotificationActions = () => {
  const queryClient = useQueryClient();
  const refresh = () => queryClient.invalidateQueries({ queryKey: ["notifications"] });
  const onError = (error) => toast.error(error?.response?.data?.message || "Couldn't update notifications");
  const markRead = useMutation({ mutationFn: accountService.markNotificationRead, onSuccess: refresh, onError });
  const markAllRead = useMutation({ mutationFn: accountService.markAllNotificationsRead, onSuccess: refresh, onError });
  return { markRead, markAllRead };
};

// debounced role-aware search; empty until at least 2 characters are typed
export const useGlobalSearch = (query, delay = 250) => {
  const [debounced, setDebounced] = useState(query);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(query.trim()), delay);
    return () => clearTimeout(t);
  }, [query, delay]);

  return useQuery({
    queryKey: ["search", debounced],
    queryFn: ({ signal }) => accountService.search(debounced, signal),
    enabled: debounced.length >= 2,
    staleTime: 30 * 1000,
    placeholderData: (prev) => prev,
  });
};
