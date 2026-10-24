"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { Gift, Loader2 } from "lucide-react";
import CouponForm, { couponToForm } from "@/components/Dashboard/Coupons/CouponForm";
import { useAdminCoupon } from "@/lib/hooks/useAdmin";
import { DataTable, EmptyState, ErrorState, PageHeader, Panel, formatDate, formatTaka } from "@/components/Dashboard/Kit";

export default function EditCouponPage() {
  const { id } = useParams();
  const { data: coupon, isLoading, isError, error, refetch } = useAdminCoupon(id);

  if (isLoading) return <div className="flex justify-center py-20"><Loader2 className="h-6 w-6 animate-spin text-gray-400" /></div>;
  if (isError || !coupon) return <ErrorState error={error} onRetry={refetch} />;

  const redemptions = [...(coupon.redemptions || [])].reverse();
  const saved = redemptions.reduce((s, r) => s + (r.discount || 0), 0);

  return (
    <>
      <PageHeader title={`Edit ${coupon.code}`} description={`Used ${coupon.usedCount} times · ${formatTaka(saved)} given in discounts`} back={{ href: "/dashboard/coupons", label: "Coupons" }} />
      <CouponForm key={coupon._id} couponId={coupon._id} initial={couponToForm(coupon)} />

      <Panel title="Redemptions" description="Orders that used this coupon" bodyClassName="" className="mb-24">
        <DataTable
          rows={redemptions}
          rowKey="_id"
          empty={<EmptyState icon={Gift} title="Not used yet" className="py-8" />}
          columns={[
            { key: "order", header: "Order", render: (r) => (r.invoice ? <Link href={`/dashboard/orders/${r.invoice._id}`} className="font-semibold text-gray-900 hover:underline">{r.invoice.invoiceNumber}</Link> : "—") },
            { key: "customer", header: "Customer", hideBelow: "sm", render: (r) => r.user?.fullName || "Walk-in customer" },
            { key: "date", header: "Date", hideBelow: "md", render: (r) => formatDate(r.at) },
            { key: "discount", header: "Discount", className: "text-right font-semibold text-gray-900", headerClassName: "text-right", render: (r) => formatTaka(r.discount) },
          ]}
        />
      </Panel>
    </>
  );
}
