"use client";

import { useEffect, useState } from "react";
import { adminService } from "@/lib/services/adminService";
import { useAdminMutation } from "@/lib/hooks/useAdmin";
import { Button, Modal } from "@/components/Dashboard/Kit";
import LineItemsEditor from "./LineItemsEditor";

const toLines = (order) =>
  (order.items || []).map((i) => ({ product: i.product?._id || i.product, title: i.title, image: i.image, price: i.price, qty: i.qty }));

// add, update and remove products; the server re-prices totals and moves stock if the order holds it
export default function EditItemsModal({ order, open, onClose }) {
  const [lines, setLines] = useState([]);
  useEffect(() => {
    if (open) setLines(toLines(order));
  }, [open, order]);

  const save = useAdminMutation(
    () => adminService.editOrder(order._id, { items: lines.map((l) => ({ product: l.product, qty: l.qty, price: l.price === "" ? undefined : l.price })) }),
    { success: "Order items updated", onSuccess: onClose }
  );

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="lg"
      title="Edit items"
      description={order.stockDeducted ? "Stock is adjusted for any quantity you change." : "Stock is taken when the order is accepted."}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button loading={save.isPending} disabled={!lines.length} onClick={() => save.mutate()}>Save items</Button>
        </>
      }
    >
      <LineItemsEditor lines={lines} onChange={setLines} />
    </Modal>
  );
}
