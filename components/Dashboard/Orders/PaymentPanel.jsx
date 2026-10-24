"use client";

import { CheckCircle2, Clock, CreditCard, XCircle } from "lucide-react";
import { adminService } from "@/lib/services/adminService";
import { useAdminMutation } from "@/lib/hooks/useAdmin";
import { Panel, StatusPill, formatDate, formatTaka, paymentLabels } from "@/components/Dashboard/Kit";
import { DropdownSelect } from "@/components/ui/dropdown-select";

export default function PaymentPanel({ order, editable = true }) {
  const setPayment = useAdminMutation((paymentStatus) => adminService.updateOrderPayment(order._id, paymentStatus), { success: "Payment status updated" });
  return (
    <Panel title="Payment">
      <div className="space-y-3 text-sm">
        <div className="flex items-center justify-between gap-2">
          <span className="flex items-center gap-2 text-gray-600"><CreditCard className="h-4 w-4 text-gray-400" /> {paymentLabels[order.paymentMethod] || order.paymentMethod}</span>
          <StatusPill status={order.paymentStatus === "pending" ? "pending" : order.paymentStatus} label={order.paymentStatus === "pending" ? "Unpaid" : undefined} />
        </div>
        {order.payment?.amountPaid > 0 && (
          <p className="text-xs text-gray-500">Received {formatTaka(order.payment.amountPaid)}{order.payment.change ? ` · change ${formatTaka(order.payment.change)}` : ""}</p>
        )}
        {editable && (
          <label className="block print:hidden">
            <span className="mb-1.5 block text-xs font-medium text-gray-500">Update payment status</span>
            <DropdownSelect
              value={order.paymentStatus}
              onChange={(v) => setPayment.mutate(v)}
              disabled={setPayment.isPending}
              options={[
                { value: "pending", label: "Unpaid", icon: Clock },
                { value: "completed", label: "Paid", icon: CheckCircle2 },
                { value: "failed", label: "Failed", icon: XCircle },
              ]}
            />
          </label>
        )}
        {order.source !== "pos" && <p className="text-xs text-gray-500">Due {formatDate(order.dueDate)}</p>}
      </div>
    </Panel>
  );
}
