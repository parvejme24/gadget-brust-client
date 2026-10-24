import Link from "next/link";
import { Users } from "lucide-react";
import { useAdminCustomerAnalytics } from "@/lib/hooks/useAdmin";
import { EmptyState, Panel, formatCompact } from "@/components/Dashboard/Kit";

export default function TopCustomersPanel({ className }) {
  const { data } = useAdminCustomerAnalytics();
  const customers = (data?.topCustomers || []).slice(0, 5);
  return (
    <Panel className={className} title="Top customers" description="By total spend">
      {customers.length === 0 ? (
        <EmptyState icon={Users} title="No customers yet" className="py-8" />
      ) : (
        <ul className="space-y-3">
          {customers.map((c, i) => (
            <li key={c._id}>
              <Link href={`/dashboard/customers/${c._id}`} className="flex items-center gap-3 rounded-xl p-1.5 hover:bg-gray-50">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-xs font-bold text-gray-600">{i + 1}</span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium text-gray-900">{c.customerName}</span>
                  <span className="text-xs text-gray-500">{c.totalOrders} orders</span>
                </span>
                <span className="text-sm font-semibold tabular-nums text-gray-900">{formatCompact(c.totalSpent)}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </Panel>
  );
}
