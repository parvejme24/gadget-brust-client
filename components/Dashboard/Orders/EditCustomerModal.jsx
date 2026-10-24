"use client";

import { useEffect, useState } from "react";
import { adminService } from "@/lib/services/adminService";
import { useAdminMutation } from "@/lib/hooks/useAdmin";
import { Button, Modal } from "@/components/Dashboard/Kit";
import CustomerFields, { contactFromOrder, contactPayload, emptyContact } from "./CustomerFields";

export default function EditCustomerModal({ order, open, onClose }) {
  const [contact, setContact] = useState(emptyContact);
  useEffect(() => {
    if (open) setContact(contactFromOrder(order));
  }, [open, order]);

  const save = useAdminMutation(() => adminService.editOrder(order._id, contactPayload(contact)), {
    success: "Customer details updated",
    onSuccess: onClose,
  });

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="lg"
      title="Customer & delivery address"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button loading={save.isPending} onClick={() => save.mutate()}>Save details</Button>
        </>
      }
    >
      <CustomerFields value={contact} onChange={setContact} idPrefix="edit-customer" />
    </Modal>
  );
}
