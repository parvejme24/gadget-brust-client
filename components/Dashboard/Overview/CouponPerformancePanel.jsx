import Link from "next/link";
import { TicketPercent } from "lucide-react";
import { useAdminCoupons } from "@/lib/hooks/useAdmin";
import { BarList, EmptyState, Panel } from "@/components/Dashboard/Kit";

// most redeemed coupons
export default function CouponPerformancePanel({ className }) {
  const { data: coupons = [] } = useAdminCoupons();
  const items = [...coupons]
    .sort((a, b) => b.usedCount - a.usedCount)
    .slice(0, 6)
    .map((c) => ({ key: c._id, label: `${c.code} · ${c.title}`, value: c.usedCount }));

  return (
    <Panel
      className={className}
      title="Coupon redemptions"
      description="Times each coupon was used"
      action={<Link href="/dashboard/coupons" className="text-xs font-semibold text-gray-500 hover:text-gray-900">Manage</Link>}
    >
      {coupons.length === 0 ? <EmptyState icon={TicketPercent} title="No coupons yet" className="py-8" /> : <BarList items={items} valueFormat={(v) => `${v}×`} />}
    </Panel>
  );
}
