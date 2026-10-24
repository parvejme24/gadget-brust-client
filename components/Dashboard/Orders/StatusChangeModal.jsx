"use client";

import { useEffect, useState } from "react";
import { adminService } from "@/lib/services/adminService";
import { useAdminMutation } from "@/lib/hooks/useAdmin";
import { Button, Field, Modal, inputClass } from "@/components/Dashboard/Kit";

export const STATUS_ACTIONS = {
  processing: {
    title: "Accept this order?",
    text: "Confirm the order with the customer first. Accepting takes the items out of stock.",
    confirm: "Accept order",
    done: "Order accepted",
    placeholder: "e.g. Confirmed by phone",
  },
  delivered: {
    title: "Mark as delivered?",
    text: "Cash on delivery orders are marked as paid.",
    confirm: "Mark delivered",
    done: "Marked as delivered",
    placeholder: "e.g. Received by the customer",
  },
  cancelled: {
    title: "Cancel this order?",
    text: "Any stock taken for this order is returned. The customer is notified if they have an account.",
    confirm: "Cancel order",
    done: "Order cancelled",
    placeholder: "Reason, e.g. customer didn't answer",
    danger: true,
  },
  pending: {
    title: "Reopen this order?",
    text: "The order goes back to pending so it can be confirmed again.",
    confirm: "Reopen order",
    done: "Order reopened",
    placeholder: "Reason (optional)",
  },
};

// confirm a status change with an optional note that's saved in the order history
export default function StatusChangeModal({ order, target, onClose }) {
  const [note, setNote] = useState("");
  const action = STATUS_ACTIONS[target];
  useEffect(() => setNote(""), [target]);

  const save = useAdminMutation(() => adminService.updateOrderStatus(order._id, target, note.trim()), {
    success: action?.done,
    onSuccess: onClose,
  });

  if (!action) return null;
  return (
    <Modal
      open={!!target}
      onClose={onClose}
      size="sm"
      title={action.title}
      description={`Order ${order.invoiceNumber}`}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Back</Button>
          <Button variant={action.danger ? "danger" : "primary"} loading={save.isPending} onClick={() => save.mutate()}>
            {action.confirm}
          </Button>
        </>
      }
    >
      <p className="text-sm leading-6 text-gray-600">{action.text}</p>
      <Field label="Note (optional)" htmlFor="status-note" className="mt-4">
        <input id="status-note" value={note} onChange={(e) => setNote(e.target.value)} placeholder={action.placeholder} className={inputClass} />
      </Field>
    </Modal>
  );
}
