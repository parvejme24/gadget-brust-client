import { Star } from "lucide-react";
import { CourierBadge, DataTable, Toggle, formatTaka } from "@/components/Dashboard/Kit";
import { hostname } from "./courierForm";

export default function CouriersTable({ couriers, onToggle, toggling, actions }) {
  return (
    <div className="min-w-0 rounded-2xl border border-gray-200/70 bg-surface shadow-sm shadow-gray-900/[0.02]">
      <DataTable
        rows={couriers}
        columns={[
          {
            key: "name",
            header: "Courier",
            render: (c) => (
              <div className="flex min-w-[200px] items-center gap-3">
                <CourierBadge courier={c} />
                <div className="min-w-0">
                  <p className="flex items-center gap-1.5 font-semibold text-gray-900">
                    {c.name}
                    {c.isDefault && <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" aria-label="Default courier" />}
                  </p>
                  {c.website && <p className="truncate text-xs text-gray-500">{hostname(c.website)}</p>}
                </div>
              </div>
            ),
          },
          { key: "inside", header: "Inside Dhaka", hideBelow: "md", render: (c) => formatTaka(c.charges?.insideDhaka) },
          { key: "outside", header: "Outside Dhaka", hideBelow: "md", render: (c) => formatTaka(c.charges?.outsideDhaka) },
          { key: "cod", header: "COD", hideBelow: "lg", render: (c) => `${c.codChargePercent}%` },
          { key: "parcels", header: "Parcels", hideBelow: "sm", render: (c) => `${c.parcels} · ${c.delivered} delivered` },
          { key: "status", header: "Status", render: (c) => <Toggle checked={c.isActive} onChange={() => onToggle(c._id)} label={`${c.name} active`} disabled={toggling} /> },
          { key: "actions", header: <span className="sr-only">Actions</span>, className: "text-right", render: (c) => <div className="flex justify-end">{actions(c)}</div> },
        ]}
      />
    </div>
  );
}
