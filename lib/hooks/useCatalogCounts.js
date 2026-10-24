"use client";

import { useMemo } from "react";
import { useAdminProducts } from "@/lib/hooks/useAdmin";

// product counts per category and brand, from one catalog-wide query
export default function useCatalogCounts() {
  const { data } = useAdminProducts({ limit: 1000 });
  return useMemo(() => {
    const byCategory = {};
    const byBrand = {};
    (data?.products || []).forEach((p) => {
      const c = p.category?._id || p.category;
      const b = p.brand?._id || p.brand;
      if (c) byCategory[c] = (byCategory[c] || 0) + 1;
      if (b) byBrand[b] = (byBrand[b] || 0) + 1;
    });
    return { byCategory, byBrand };
  }, [data]);
}
