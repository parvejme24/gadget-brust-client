"use client";

import { useState } from "react";
import { useAdminRevenue } from "@/lib/hooks/useAdmin";
import { MonthlyBarChart } from "@/components/Dashboard/Kit/Charts";
import { Panel, cx } from "@/components/Dashboard/Kit";

// paid revenue or order count per month
export default function RevenuePanel({ className }) {
  const [metric, setMetric] = useState("revenue");
  const { data: revenue } = useAdminRevenue();
  const points = (revenue?.revenueChart || []).map((p) => ({ _id: p._id, value: metric === "revenue" ? p.revenue : p.orders }));

  return (
    <Panel
      className={className}
      title={metric === "revenue" ? "Revenue" : "Orders"}
      description="Paid orders per month"
      action={
        <div className="flex rounded-xl bg-gray-100 p-1 text-xs font-semibold" role="tablist" aria-label="Chart metric">
          {[
            ["revenue", "Revenue"],
            ["orders", "Orders"],
          ].map(([key, label]) => (
            <button
              key={key}
              role="tab"
              aria-selected={metric === key}
              onClick={() => setMetric(key)}
              className={cx("rounded-lg px-3 py-1.5 transition", metric === key ? "bg-surface text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-800")}
            >
              {label}
            </button>
          ))}
        </div>
      }
    >
      <MonthlyBarChart points={points} valueLabel={metric === "revenue" ? "Revenue" : "Orders"} money={metric === "revenue"} />
    </Panel>
  );
}
