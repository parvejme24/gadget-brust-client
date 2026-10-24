import { useAdminPaymentStats } from "@/lib/hooks/useAdmin";
import { BarList, Panel, formatCompact, formatTaka, paymentLabels } from "@/components/Dashboard/Kit";

export default function PaymentMethodsPanel({ className }) {
  const { data } = useAdminPaymentStats();
  return (
    <Panel className={className} title="Payment methods" description="Completed payments">
      <BarList
        items={(data?.payment_methods || []).map((m) => ({ label: paymentLabels[m._id] || m._id, value: m.total_amount }))}
        valueFormat={formatCompact}
        emptyText="No payments yet"
      />
      <p className="mt-5 border-t border-gray-100 pt-4 text-xs text-gray-500">
        {data?.total_payments || 0} payments · {formatTaka(data?.total_completed_amount)} collected
      </p>
    </Panel>
  );
}
