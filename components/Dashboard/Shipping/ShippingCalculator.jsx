"use client";

import { useState } from "react";
import { Calculator } from "lucide-react";
import api from "@/lib/api";
import { Button, Field, Panel, formatTaka, inputClass } from "@/components/Dashboard/Kit";
import { DropdownSelect } from "@/components/ui/dropdown-select";

// preview the delivery charge for an order value and weight
export default function ShippingCalculator({ methods }) {
  const [input, setInput] = useState({ orderAmount: "3000", totalWeight: "1", shippingId: "" });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const shippingId = input.shippingId || methods[0]?._id || "";

  const calculate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post("/shipping/calculate", { orderAmount: Number(input.orderAmount), totalWeight: Number(input.totalWeight), shippingId });
      setResult(res.data?.data);
    } catch {
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Panel title="Rate calculator" description="Preview what a customer pays for delivery.">
      <form onSubmit={calculate} className="space-y-4">
        <Field label="Method" htmlFor="calc-method">
          <DropdownSelect id="calc-method" value={shippingId} onChange={(v) => setInput({ ...input, shippingId: v })} options={methods.map((m) => ({ value: m._id, label: m.name }))} />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Order value (৳)" htmlFor="calc-amount">
            <input id="calc-amount" type="number" min="0" value={input.orderAmount} onChange={(e) => setInput({ ...input, orderAmount: e.target.value })} className={inputClass} />
          </Field>
          <Field label="Weight (kg)" htmlFor="calc-weight">
            <input id="calc-weight" type="number" min="0" step="0.1" value={input.totalWeight} onChange={(e) => setInput({ ...input, totalWeight: e.target.value })} className={inputClass} />
          </Field>
        </div>
        <Button type="submit" variant="secondary" loading={loading} className="w-full justify-center" disabled={!shippingId}>
          <Calculator className="h-4 w-4" /> Calculate
        </Button>
      </form>
      {result && (
        <div className="mt-4 rounded-xl bg-gray-50 p-4 text-sm">
          <div className="flex justify-between"><span className="text-gray-500">Delivery charge</span><span className="font-semibold text-gray-900">{result.qualifiesForFreeShipping ? "Free" : formatTaka(result.shippingCharge)}</span></div>
          <div className="mt-1 flex justify-between"><span className="text-gray-500">Customer pays</span><span className="font-bold text-gray-900">{formatTaka(result.finalAmount)}</span></div>
          <p className="mt-2 text-xs text-gray-500">Arrives in {result.shippingConfig?.estimatedDays?.min}-{result.shippingConfig?.estimatedDays?.max} days.</p>
        </div>
      )}
    </Panel>
  );
}
