"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { ClipboardPlus, Loader2 } from "lucide-react";
import { adminService } from "@/lib/services/adminService";
import { checkoutService } from "@/lib/services/checkoutService";
import { useAdminMutation, useAdminShipping } from "@/lib/hooks/useAdmin";
import { Button, Field, Panel, cx, formatTaka, inputClass } from "@/components/Dashboard/Kit";
import { DropdownSelect } from "@/components/ui/dropdown-select";
import CustomerPicker from "@/components/Dashboard/Customers/CustomerPicker";
import LineItemsEditor from "./LineItemsEditor";
import CustomerFields, { contactPayload, emptyContact } from "./CustomerFields";

// a phone or walk-in delivery order entered by staff; priced by the server like a storefront checkout
export default function NewOrderForm() {
  const router = useRouter();
  const [mode, setMode] = useState("guest"); // guest | account
  const [account, setAccount] = useState(null);
  const [contact, setContact] = useState(emptyContact);
  const [lines, setLines] = useState([]);
  const [shippingMethod, setShippingMethod] = useState("");
  const [notes, setNotes] = useState("");
  const { data: methods = [] } = useAdminShipping();
  const active = methods.filter((m) => m.isActive);

  useEffect(() => {
    if (!shippingMethod && active[0]) setShippingMethod(active[0]._id);
  }, [active, shippingMethod]);

  // prefill contact details from the chosen account
  useEffect(() => {
    if (account) setContact((c) => ({ ...c, name: account.fullName || c.name, email: account.email || c.email, phone: account.phone || c.phone }));
  }, [account]);

  const items = lines.map((l) => ({ product: l.product, qty: l.qty }));
  const quote = useQuery({
    queryKey: ["admin", "order-quote", items, shippingMethod],
    queryFn: () => checkoutService.quote({ items, shippingMethod }),
    enabled: items.length > 0 && !!shippingMethod,
    retry: false,
  });

  const create = useAdminMutation(
    () =>
      adminService.createOrder({
        ...contactPayload(contact),
        customer: { ...contactPayload(contact).customer, userId: mode === "account" ? account?._id : undefined },
        items,
        shippingMethod,
        notes,
      }),
    { success: (o) => `Order ${o.invoiceNumber} created`, onSuccess: (o) => router.push(`/dashboard/orders/${o._id}`) }
  );

  return (
    <div className="grid gap-6 xl:grid-cols-3">
      <div className="min-w-0 space-y-6 xl:col-span-2">
        <Panel title="Products" description="Prices come from the catalog. You can change them after the order is created.">
          <LineItemsEditor lines={lines} onChange={setLines} editablePrice={false} />
        </Panel>

        <Panel
          title="Customer"
          action={
            <div className="flex rounded-lg bg-gray-100 p-0.5 text-xs font-semibold">
              {[
                ["guest", "New / guest"],
                ["account", "Existing account"],
              ].map(([key, label]) => (
                <button key={key} type="button" onClick={() => setMode(key)} className={cx("rounded-md px-2.5 py-1 transition", mode === key ? "bg-surface text-gray-900 shadow-sm" : "text-gray-500")}>
                  {label}
                </button>
              ))}
            </div>
          }
        >
          {mode === "account" && (
            <Field label="Customer account" className="mb-4">
              <CustomerPicker value={account} onChange={setAccount} />
            </Field>
          )}
          <CustomerFields value={contact} onChange={setContact} idPrefix="new-order" />
        </Panel>
      </div>

      <div className="min-w-0 space-y-6">
        <Panel title="Delivery">
          <div className="space-y-4">
            <Field label="Delivery method">
              <DropdownSelect
                value={shippingMethod}
                onChange={setShippingMethod}
                placeholder="Choose a delivery method"
                options={active.map((m) => ({ value: m._id, label: m.name, description: `${formatTaka(m.baseCharge)} · ${m.estimatedDays?.min}-${m.estimatedDays?.max} days` }))}
              />
            </Field>
            <Field label="Note (optional)" htmlFor="order-note">
              <textarea id="order-note" rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Delivery time, gift wrap…" className={`${inputClass} h-auto py-2.5`} />
            </Field>
          </div>
        </Panel>

        <Panel title="Summary">
          {!items.length ? (
            <p className="text-sm text-gray-500">Add products to see the total.</p>
          ) : quote.isLoading ? (
            <Loader2 className="mx-auto h-5 w-5 animate-spin text-gray-400" />
          ) : quote.isError ? (
            <p className="rounded-xl bg-red-50 px-3 py-2.5 text-sm text-red-700">{quote.error?.response?.data?.message || "Couldn't price this order"}</p>
          ) : (
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between text-gray-600"><dt>Subtotal</dt><dd className="font-medium text-gray-900">{formatTaka(quote.data?.subtotal)}</dd></div>
              <div className="flex justify-between text-gray-600"><dt>Delivery</dt><dd className="font-medium text-gray-900">{quote.data?.shippingCharge ? formatTaka(quote.data.shippingCharge) : "Free"}</dd></div>
              <div className="flex justify-between border-t border-gray-100 pt-2 text-base"><dt className="font-semibold text-gray-900">Total</dt><dd className="font-bold text-gray-900">{formatTaka(quote.data?.total)}</dd></div>
              <p className="pt-1 text-xs text-gray-500">Cash on delivery</p>
            </dl>
          )}
          <Button className="mt-5 w-full justify-center" loading={create.isPending} disabled={!items.length || quote.isError || (mode === "account" && !account)} onClick={() => create.mutate()}>
            <ClipboardPlus className="h-4 w-4" /> Create order
          </Button>
        </Panel>
      </div>
    </div>
  );
}
