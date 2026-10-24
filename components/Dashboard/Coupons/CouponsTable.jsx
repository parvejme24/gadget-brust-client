"use client";

import { useRouter } from "next/navigation";
import { couponStatus, describeCoupon, scopeLabel } from "@/lib/coupons";
import { DataTable, StatusPill } from "@/components/Dashboard/Kit";
import { statusPill, validity } from "./couponDisplay";

export default function CouponsTable({ coupons, categories, brands, actions }) {
  const router = useRouter();
  return (
    <div className="min-w-0 rounded-2xl border border-gray-200/70 bg-surface shadow-sm shadow-gray-900/[0.02]">
      <DataTable
        rows={coupons}
        onRowClick={(c) => router.push(`/dashboard/coupons/${c._id}`)}
        columns={[
          {
            key: "code",
            header: "Coupon",
            render: (c) => (
              <div className="min-w-[180px]">
                <p className="font-mono text-sm font-bold text-gray-900">{c.code}</p>
                <p className="truncate text-xs text-gray-500">{c.title}</p>
              </div>
            ),
          },
          { key: "offer", header: "Offer", render: (c) => <span className="font-medium text-gray-900">{describeCoupon(c)}</span> },
          { key: "scope", header: "Applies to", hideBelow: "lg", render: (c) => <span className="line-clamp-1 max-w-[220px]">{scopeLabel(c, { categories, brands })}</span> },
          { key: "used", header: "Used", hideBelow: "md", render: (c) => `${c.usedCount}${c.usageLimit ? ` / ${c.usageLimit}` : ""}` },
          { key: "valid", header: "Valid", hideBelow: "xl", render: (c) => <span className="whitespace-nowrap text-xs">{validity(c)}</span> },
          { key: "status", header: "Status", render: (c) => <StatusPill {...statusPill[couponStatus(c)]} /> },
          {
            key: "actions",
            header: <span className="sr-only">Actions</span>,
            className: "text-right",
            render: (c) => (
              <div className="flex justify-end" onClick={(e) => e.stopPropagation()}>
                {actions(c)}
              </div>
            ),
          },
        ]}
      />
    </div>
  );
}
