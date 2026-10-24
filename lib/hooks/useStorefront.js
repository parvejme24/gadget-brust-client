"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { storefrontService as api } from "../services/storefrontService";
import { BRAND_NAME } from "../config/brand";

const MIN = 60 * 1000;

// products
export const useAllProducts = (params = {}, options = {}) =>
  useQuery({ queryKey: ["products", params], queryFn: () => api.products(params), staleTime: 2 * MIN, ...options });
export const useSliderProducts = () => useQuery({ queryKey: ["products", "slider"], queryFn: api.sliderProducts, staleTime: 5 * MIN });
export const useDiscountedProducts = () => useQuery({ queryKey: ["products", "discounted"], queryFn: api.discountedProducts, staleTime: 5 * MIN });
export const useProductsByCategory = (categoryId) =>
  useQuery({ queryKey: ["products", "category", categoryId], queryFn: () => api.productsByCategory(categoryId), enabled: !!categoryId, staleTime: 3 * MIN });
export const useProductById = (id) => useQuery({ queryKey: ["products", id], queryFn: () => api.product(id), enabled: !!id, staleTime: 5 * MIN });

// catalog
export const useAllCategories = () => useQuery({ queryKey: ["categories"], queryFn: api.categories, staleTime: 10 * MIN });
export const useAllBrands = () => useQuery({ queryKey: ["brands"], queryFn: api.brands, staleTime: 10 * MIN });

// reviews
export const useReviewsByProduct = (productId) =>
  useQuery({ queryKey: ["reviews", "product", productId], queryFn: () => api.productReviews(productId), enabled: !!productId, staleTime: 3 * MIN });
export const useCreateReview = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.createReview,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["reviews"] }),
  });
};

// store settings: contact details, hours, socials, free-delivery threshold, announcement
export const useStoreSettings = () => {
  const query = useQuery({ queryKey: ["store-settings"], queryFn: api.settings, staleTime: 10 * MIN });
  return { ...query, settings: query.data || {} };
};
export const useShippingMethods = () => useQuery({ queryKey: ["shipping-methods"], queryFn: api.shippingMethods, staleTime: 10 * MIN });
export const useOffers = () => useQuery({ queryKey: ["offers"], queryFn: api.offers, staleTime: 5 * MIN });

// store details ready to render; empty until loaded (nothing is made up on the client)
export const useStoreInfo = () => {
  const { settings, isLoading } = useStoreSettings();
  const phone = settings.phone || "";
  return {
    loading: isLoading,
    name: settings.storeName || BRAND_NAME,
    tagline: settings.tagline || "",
    phone,
    phoneHref: phone ? `tel:${phone.replace(/[\s-]/g, "")}` : undefined,
    email: settings.email || "",
    address: settings.address || "",
    hours: settings.hours || "",
    socials: settings.socials || {},
    freeDeliveryThreshold: settings.freeDeliveryThreshold || 0,
    announcement: settings.announcement?.enabled ? settings.announcement.text : "",
  };
};
