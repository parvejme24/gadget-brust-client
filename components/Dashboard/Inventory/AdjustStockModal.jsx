"use client";

import { useState } from "react";
import { Package } from "lucide-react";
import { adminService } from "@/lib/services/adminService";
import { useAdminMutation } from "@/lib/hooks/useAdmin";
import { Button, Field, Modal, cx, inputClass } from "@/components/Dashboard/Kit";
import ProductPicker from "@/components/Dashboard/Products/ProductPicker";
import { TYPES } from "./stockTypes";

// restock, return, damage or an exact stock count; asks for a product first when none is given
export default function AdjustStockModal({ product: initial, open, onClose }) {
  const [product, setProduct] = useState(initial);
  const [type, setType] = useState("restock");
  const [qty, setQty] = useState("");
  const [setTo, setSetTo] = useState("");
  const [reference, setReference] = useState("");
  const [unitCost, setUnitCost] = useState("");
  const [note, setNote] = useState("");
  const adjust = useAdminMutation((data) => adminService.adjustStock(data), { success: "Stock updated", onSuccess: onClose });

  if (!open) return null;
  if (!product) {
    return (
      <Modal open onClose={onClose} title="Adjust stock" description="Choose the product to change">
        <ProductPicker onPick={setProduct} allowOutOfStock autoFocus placeholder="Search product…" />
        <p className="mt-3 flex items-center gap-2 text-xs text-gray-500"><Package className="h-3.5 w-3.5" /> Out-of-stock products can be restocked too.</p>
      </Modal>
    );
  }
  const amount = Math.floor(Number(qty) || 0);
  const next = type === "adjustment" ? (setTo === "" ? product.stock : Math.max(0, Math.floor(Number(setTo)))) : product.stock + TYPES[type].sign * amount;
  const invalid = type === "adjustment" ? setTo === "" || next === product.stock : amount < 1 || next < 0;

  return (
    <Modal
      open
      onClose={onClose}
      title="Adjust stock"
      description={product.title}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button
            loading={adjust.isPending}
            disabled={invalid}
            onClick={() => adjust.mutate({ product: product._id, type, quantity: amount, setTo: type === "adjustment" ? Number(setTo) : undefined, reference: reference.trim(), unitCost: unitCost || undefined, note: note.trim() })}
          >
            Save
          </Button>
        </>
      }
    >
      <div className="space-y-5">
        <div className="grid grid-cols-2 gap-2">
          {["restock", "return", "damage", "adjustment"].map((key) => {
            const t = TYPES[key];
            const Icon = t.icon;
            return (
              <button
                key={key}
                type="button"
                onClick={() => setType(key)}
                aria-pressed={type === key}
                className={cx("flex items-start gap-2.5 rounded-xl border p-3 text-left transition", type === key ? "border-gray-900 bg-gray-900 text-white" : "border-gray-200 hover:border-gray-300")}
              >
                <Icon className={cx("mt-0.5 h-4 w-4 shrink-0", type === key ? "text-emerald-300" : "text-gray-400")} />
                <span>
                  <span className="block text-sm font-semibold">{t.label}</span>
                  <span className={cx("block text-[11px]", type === key ? "text-gray-300" : "text-gray-500")}>{t.hint}</span>
                </span>
              </button>
            );
          })}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {type === "adjustment" ? (
            <Field label="Counted quantity" htmlFor="setTo" hint={`System shows ${product.stock}`}>
              <input id="setTo" type="number" min="0" value={setTo} onChange={(e) => setSetTo(e.target.value)} autoFocus className={inputClass} />
            </Field>
          ) : (
            <Field label="Quantity" htmlFor="qty">
              <input id="qty" type="number" min="1" value={qty} onChange={(e) => setQty(e.target.value)} autoFocus className={inputClass} />
            </Field>
          )}
          <Field label="Reference (optional)" htmlFor="ref" hint="Supplier invoice, PO or memo no.">
            <input id="ref" value={reference} onChange={(e) => setReference(e.target.value)} className={inputClass} />
          </Field>
          {type === "restock" && (
            <Field label="Unit cost (৳, optional)" htmlFor="cost">
              <input id="cost" type="number" min="0" value={unitCost} onChange={(e) => setUnitCost(e.target.value)} className={inputClass} />
            </Field>
          )}
          <Field label="Note (optional)" htmlFor="note" className={type === "restock" ? "" : "sm:col-span-2"}>
            <input id="note" value={note} onChange={(e) => setNote(e.target.value)} className={inputClass} />
          </Field>
        </div>

        <div className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3 text-sm">
          <span className="text-gray-600">Stock after saving</span>
          <span className="font-semibold text-gray-900">
            {product.stock} → <span className={cx(next < 0 ? "text-red-600" : next > product.stock ? "text-emerald-700" : next < product.stock ? "text-orange-600" : "")}>{next < 0 ? "not enough stock" : next}</span>
          </span>
        </div>
      </div>
    </Modal>
  );
}
