"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import CouponForm, { couponToForm } from "@/components/Dashboard/Coupons/CouponForm";
import { useAdminCoupon } from "@/lib/hooks/useAdmin";
import { PageHeader } from "@/components/Dashboard/Kit";

function NewCoupon() {
  const fromId = useSearchParams().get("from");
  const { data: source, isLoading } = useAdminCoupon(fromId);

  return (
    <>
      <PageHeader
        title={fromId ? "Duplicate coupon" : "Create coupon"}
        description="Percentage, fixed amount, buy X get Y or free delivery, for any products you choose."
        back={{ href: "/dashboard/coupons", label: "Coupons" }}
      />
      {fromId && isLoading ? (
        <div className="flex justify-center py-20"><Loader2 className="h-6 w-6 animate-spin text-gray-400" /></div>
      ) : (
        <CouponForm key={source?._id || "new"} initial={source ? couponToForm(source, { duplicate: true }) : undefined} />
      )}
    </>
  );
}

export default function NewCouponPage() {
  return (
    <Suspense fallback={null}>
      <NewCoupon />
    </Suspense>
  );
}
