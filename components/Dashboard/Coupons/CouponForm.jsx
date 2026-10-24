"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Banknote, Gift, Layers, Package, Percent, Shapes, BadgeCheck, Shuffle, Store, Truck } from "lucide-react";
import { adminService } from "@/lib/services/adminService";
import { useAdminBrands, useAdminCategories, useAdminMutation, useAdminProducts } from "@/lib/hooks/useAdmin";
import { conditionsLabel, describeCoupon, scopeLabel } from "@/lib/coupons";
import { MultiSelect } from "@/components/ui/multi-select";
import { DatePicker } from "@/components/ui/date-picker";
import { toDateValue, parseDateValue } from "@/components/ui/date-range-picker";
import { Button, Field, Panel, Toggle, cx, formatTaka, inputClass } from "@/components/Dashboard/Kit";

const TYPES = [
  { key: "percentage", label: "Percentage", hint: "e.g. 10% off", icon: Percent },
  { key: "fixed", label: "Fixed amount", hint: "e.g. ৳500 off", icon: Banknote },
  { key: "bogo", label: "Buy X get Y", hint: "e.g. buy 1 get 1 free", icon: Gift },
  { key: "free_shipping", label: "Free delivery", hint: "No delivery charge", icon: Truck },
];

const SCOPES = [
  { key: "all", label: "All products", icon: Store },
  { key: "products", label: "Specific products", icon: Package },
  { key: "categories", label: "Categories", icon: Shapes },
  { key: "brands", label: "Brands", icon: BadgeCheck },
];

const blank = {
  code: "",
  title: "",
  description: "",
  type: "percentage",
  value: "10",
  maxDiscount: "",
  bogo: { buyQty: "1", getQty: "1", getDiscountPercent: "100" },
  appliesTo: "all",
  products: [],
  categories: [],
  brands: [],
  excludeDiscountedItems: false,
  minOrderAmount: "",
  minQuantity: "",
  usageLimit: "",
  usageLimitPerUser: "",
  firstOrderOnly: false,
  startDate: "",
  endDate: "",
  isActive: true,
  isPublic: true,
};

const ids = (list = []) => list.map((x) => x?._id || x);
const numStr = (n) => (n ? String(n) : "");

export const couponToForm = (c, { duplicate = false } = {}) => ({
  ...blank,
  code: duplicate ? `${c.code}-COPY` : c.code,
  title: c.title || "",
  description: c.description || "",
  type: c.type,
  value: numStr(c.value),
  maxDiscount: numStr(c.maxDiscount),
  bogo: { buyQty: String(c.bogo?.buyQty ?? 1), getQty: String(c.bogo?.getQty ?? 1), getDiscountPercent: String(c.bogo?.getDiscountPercent ?? 100) },
  appliesTo: c.appliesTo || "all",
  products: ids(c.products),
  categories: ids(c.categories),
  brands: ids(c.brands),
  excludeDiscountedItems: !!c.excludeDiscountedItems,
  minOrderAmount: numStr(c.minOrderAmount),
  minQuantity: numStr(c.minQuantity),
  usageLimit: numStr(c.usageLimit),
  usageLimitPerUser: numStr(c.usageLimitPerUser),
  firstOrderOnly: !!c.firstOrderOnly,
  startDate: c.startDate ? toDateValue(new Date(c.startDate)) : "",
  endDate: c.endDate ? toDateValue(new Date(c.endDate)) : "",
  isActive: duplicate ? true : c.isActive,
  isPublic: c.isPublic !== false,
});

const randomCode = () => {
  const words = ["GADGET", "SAVE", "DEAL", "TECH", "SMART", "MEGA"];
  return `${words[Math.floor(Math.random() * words.length)]}${Math.floor(10 + Math.random() * 90)}`;
};

function Choice({ active, onClick, icon: Icon, label, hint }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cx(
        "flex items-start gap-3 rounded-xl border p-3.5 text-left transition",
        active ? "border-gray-900 bg-gray-900 text-white shadow-sm" : "border-gray-200 bg-surface text-gray-700 hover:border-gray-300"
      )}
    >
      <Icon className={cx("mt-0.5 h-5 w-5 shrink-0", active ? "text-emerald-300" : "text-gray-400")} />
      <span>
        <span className="block text-sm font-semibold">{label}</span>
        {hint && <span className={cx("block text-xs", active ? "text-gray-300" : "text-gray-500")}>{hint}</span>}
      </span>
    </button>
  );
}

function SwitchRow({ label, hint, checked, onChange }) {
  return (
    <label className="flex items-center justify-between gap-4 rounded-xl bg-gray-50 px-4 py-3">
      <span>
        <span className="block text-sm font-medium text-gray-900">{label}</span>
        {hint && <span className="block text-xs text-gray-500">{hint}</span>}
      </span>
      <Toggle checked={checked} onChange={onChange} label={label} />
    </label>
  );
}

export default function CouponForm({ initial, couponId }) {
  const router = useRouter();
  const [form, setForm] = useState(initial || blank);
  const [error, setError] = useState("");
  const { data: catalog } = useAdminProducts({ limit: 1000, sortBy: "title", sortOrder: "asc" });
  const { data: categories = [] } = useAdminCategories();
  const { data: brands = [] } = useAdminBrands();

  const set = (field) => (v) => setForm((f) => ({ ...f, [field]: v?.target ? v.target.value : v }));
  const setBogo = (field) => (e) => setForm((f) => ({ ...f, bogo: { ...f.bogo, [field]: e.target.value } }));

  const save = useAdminMutation((payload) => (couponId ? adminService.updateCoupon(couponId, payload) : adminService.createCoupon(payload)), {
    success: couponId ? "Coupon updated" : "Coupon created",
    onSuccess: () => router.push("/dashboard/coupons"),
  });

  const productOptions = (catalog?.products || []).map((p) => ({
    value: p._id,
    label: p.title,
    image: p.image?.url,
    description: `${formatTaka(p.discountPrice || p.price)} · ${p.brand?.brandName || ""}`,
  }));

  const n = (v) => (v === "" || v === undefined ? 0 : Number(v));
  const preview = {
    ...form,
    value: n(form.value),
    maxDiscount: n(form.maxDiscount),
    minOrderAmount: n(form.minOrderAmount),
    minQuantity: n(form.minQuantity),
    usageLimitPerUser: n(form.usageLimitPerUser),
    bogo: { buyQty: n(form.bogo.buyQty), getQty: n(form.bogo.getQty), getDiscountPercent: n(form.bogo.getDiscountPercent) },
  };

  const submit = (e) => {
    e.preventDefault();
    const code = form.code.trim().toUpperCase();
    if (!/^[A-Z0-9_-]{3,30}$/.test(code)) return setError("Code must be 3-30 letters, numbers, - or _ (no spaces).");
    if (form.title.trim().length < 3) return setError("Add a short title, e.g. “Eid sale”.");
    if (form.type === "percentage" && !(n(form.value) > 0 && n(form.value) <= 100)) return setError("Percentage must be between 1 and 100.");
    if (form.type === "fixed" && !(n(form.value) > 0)) return setError("Enter how much to take off.");
    if (form.appliesTo !== "all" && !form[form.appliesTo].length) return setError(`Choose at least one of the ${form.appliesTo}.`);
    if (form.startDate && form.endDate && form.startDate > form.endDate) return setError("The end date must be after the start date.");
    setError("");

    const start = parseDateValue(form.startDate);
    const end = parseDateValue(form.endDate);
    save.mutate({
      code,
      title: form.title.trim(),
      description: form.description.trim(),
      type: form.type,
      value: ["percentage", "fixed"].includes(form.type) ? n(form.value) : 0,
      maxDiscount: form.type === "percentage" ? n(form.maxDiscount) : 0,
      bogo: preview.bogo,
      appliesTo: form.appliesTo,
      products: form.products,
      categories: form.categories,
      brands: form.brands,
      excludeDiscountedItems: form.excludeDiscountedItems,
      minOrderAmount: n(form.minOrderAmount),
      minQuantity: n(form.minQuantity),
      usageLimit: n(form.usageLimit),
      usageLimitPerUser: n(form.usageLimitPerUser),
      firstOrderOnly: form.firstOrderOnly,
      startDate: start ? start.toISOString() : null,
      endDate: end ? new Date(end.getFullYear(), end.getMonth(), end.getDate(), 23, 59, 59).toISOString() : null,
      isActive: form.isActive,
      isPublic: form.isPublic,
    });
  };

  return (
    <form onSubmit={submit} noValidate className="pb-24">
      <div className="grid gap-6 xl:grid-cols-3">
        <div className="space-y-6 xl:col-span-2">
          <Panel title="Coupon details">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Coupon code" htmlFor="code" hint="Customers type this at checkout.">
                <div className="flex gap-2">
                  <input id="code" value={form.code} onChange={(e) => set("code")(e.target.value.toUpperCase().replace(/\s/g, ""))} placeholder="SUMMER10" className={`${inputClass} font-mono font-semibold tracking-wide`} />
                  <Button type="button" variant="secondary" onClick={() => set("code")(randomCode())} title="Generate a code"><Shuffle className="h-4 w-4" /></Button>
                </div>
              </Field>
              <Field label="Title" htmlFor="title" hint="Shown to customers, e.g. “Laptop week”.">
                <input id="title" value={form.title} onChange={set("title")} placeholder="Laptop week" className={inputClass} />
              </Field>
              <Field label="Description (optional)" htmlFor="description" className="sm:col-span-2">
                <input id="description" value={form.description} onChange={set("description")} placeholder="৳5,000 off any laptop this week" className={inputClass} />
              </Field>
            </div>
          </Panel>

          <Panel title="Discount type">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {TYPES.map((t) => (
                <Choice key={t.key} active={form.type === t.key} onClick={() => set("type")(t.key)} icon={t.icon} label={t.label} hint={t.hint} />
              ))}
            </div>

            <div className="mt-5">
              {form.type === "percentage" && (
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Discount (%)" htmlFor="value"><input id="value" type="number" min="1" max="100" value={form.value} onChange={set("value")} className={inputClass} /></Field>
                  <Field label="Maximum discount (৳)" htmlFor="maxDiscount" hint="Optional cap, e.g. up to ৳2,000. Leave empty for no cap."><input id="maxDiscount" type="number" min="0" value={form.maxDiscount} onChange={set("maxDiscount")} className={inputClass} /></Field>
                </div>
              )}
              {form.type === "fixed" && (
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Amount off (৳)" htmlFor="value" hint="Never more than the eligible items' total."><input id="value" type="number" min="1" value={form.value} onChange={set("value")} className={inputClass} /></Field>
                </div>
              )}
              {form.type === "bogo" && (
                <div className="space-y-3">
                  <div className="grid gap-4 sm:grid-cols-3">
                    <Field label="Customer buys" htmlFor="buyQty"><input id="buyQty" type="number" min="1" value={form.bogo.buyQty} onChange={setBogo("buyQty")} className={inputClass} /></Field>
                    <Field label="Customer gets" htmlFor="getQty"><input id="getQty" type="number" min="1" value={form.bogo.getQty} onChange={setBogo("getQty")} className={inputClass} /></Field>
                    <Field label="Discount on those (%)" htmlFor="getPct" hint="100 = free, 50 = half price"><input id="getPct" type="number" min="1" max="100" value={form.bogo.getDiscountPercent} onChange={setBogo("getDiscountPercent")} className={inputClass} /></Field>
                  </div>
                  <p className="rounded-xl bg-violet-50 px-4 py-3 text-sm text-violet-900">
                    In every group of {n(form.bogo.buyQty) + n(form.bogo.getQty)} eligible items, the {n(form.bogo.getQty) === 1 ? "cheapest one is" : `${form.bogo.getQty} cheapest are`} {n(form.bogo.getDiscountPercent) >= 100 ? "free" : `${form.bogo.getDiscountPercent}% off`}.
                  </p>
                </div>
              )}
              {form.type === "free_shipping" && <p className="rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-900">The delivery charge is removed when this code is applied.</p>}
            </div>
          </Panel>

          <Panel title="Applies to" description="Pick a single product, a group of products, one or more categories or brands.">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {SCOPES.map((s) => (
                <Choice key={s.key} active={form.appliesTo === s.key} onClick={() => set("appliesTo")(s.key)} icon={s.icon} label={s.label} />
              ))}
            </div>
            <div className="mt-5 space-y-4">
              {form.appliesTo === "products" && (
                <Field label="Products">
                  <MultiSelect label="Products" options={productOptions} value={form.products} onChange={set("products")} placeholder="Choose products…" searchPlaceholder="Search products…" />
                </Field>
              )}
              {form.appliesTo === "categories" && (
                <Field label="Categories">
                  <MultiSelect label="Categories" options={categories.map((c) => ({ value: c._id, label: c.categoryName, image: c.categoryImg?.url }))} value={form.categories} onChange={set("categories")} placeholder="Choose categories…" maxChips={5} />
                </Field>
              )}
              {form.appliesTo === "brands" && (
                <Field label="Brands">
                  <MultiSelect label="Brands" options={brands.map((b) => ({ value: b._id, label: b.brandName, image: b.brandImg }))} value={form.brands} onChange={set("brands")} placeholder="Choose brands…" maxChips={5} />
                </Field>
              )}
              <SwitchRow label="Skip items already on sale" hint="Products with their own discount won't get the coupon too." checked={form.excludeDiscountedItems} onChange={set("excludeDiscountedItems")} />
            </div>
          </Panel>

          <Panel title="Conditions & limits">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Minimum order (৳)" htmlFor="minOrder" hint="Cart total before discount."><input id="minOrder" type="number" min="0" value={form.minOrderAmount} onChange={set("minOrderAmount")} placeholder="No minimum" className={inputClass} /></Field>
              <Field label="Minimum eligible items" htmlFor="minQty"><input id="minQty" type="number" min="0" value={form.minQuantity} onChange={set("minQuantity")} placeholder="No minimum" className={inputClass} /></Field>
              <Field label="Total uses" htmlFor="usageLimit" hint="Across all customers."><input id="usageLimit" type="number" min="0" value={form.usageLimit} onChange={set("usageLimit")} placeholder="Unlimited" className={inputClass} /></Field>
              <Field label="Uses per customer" htmlFor="perUser" hint="Customers must sign in."><input id="perUser" type="number" min="0" value={form.usageLimitPerUser} onChange={set("usageLimitPerUser")} placeholder="Unlimited" className={inputClass} /></Field>
            </div>
            <div className="mt-4">
              <SwitchRow label="First order only" hint="Only customers who haven't ordered before." checked={form.firstOrderOnly} onChange={set("firstOrderOnly")} />
            </div>
          </Panel>

          <Panel title="Schedule" description="Leave empty to start now and never expire.">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Starts"><DatePicker label="Start date" value={form.startDate} onChange={set("startDate")} placeholder="Immediately" /></Field>
              <Field label="Ends"><DatePicker label="End date" value={form.endDate} onChange={set("endDate")} placeholder="No end date" disabled={form.startDate ? { before: parseDateValue(form.startDate) } : undefined} /></Field>
            </div>
          </Panel>
        </div>

        {/* preview */}
        <div className="space-y-6">
          <div className="xl:sticky xl:top-24 space-y-6">
            <Panel title="Preview">
              <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900 to-emerald-950 p-5 text-white">
                <p className="text-xs font-semibold uppercase tracking-wider text-emerald-300">{form.title || "Coupon title"}</p>
                <p className="mt-1 text-2xl font-extrabold">{describeCoupon(preview) || "—"}</p>
                <p className="mt-1 text-sm text-white/70">{scopeLabel({ ...preview, products: form.products }, { categories, brands })}</p>
                <div className="mt-4 inline-flex rounded-lg border border-dashed border-white/40 px-3 py-1.5 font-mono text-sm font-bold tracking-wider">
                  {form.code || "CODE"}
                </div>
                {conditionsLabel(preview) && <p className="mt-3 text-xs text-white/60">{conditionsLabel(preview)}</p>}
                {(form.startDate || form.endDate) && (
                  <p className="mt-1 text-xs text-white/60">
                    {form.startDate ? `From ${parseDateValue(form.startDate).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}` : "Starts now"}
                    {form.endDate ? ` · until ${parseDateValue(form.endDate).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}` : ""}
                  </p>
                )}
              </div>
            </Panel>
            <Panel title="Status">
              <div className="space-y-3">
                <SwitchRow label="Active" hint="Paused coupons can't be used." checked={form.isActive} onChange={set("isActive")} />
                <SwitchRow label="Show in store" hint="Listed as an offer on matching product pages." checked={form.isPublic} onChange={set("isPublic")} />
              </div>
            </Panel>
            <p className="flex items-start gap-2 px-1 text-xs text-gray-500">
              <Layers className="mt-0.5 h-3.5 w-3.5 shrink-0" /> One coupon per order. The discount is checked again with live prices when it is applied.
            </p>
          </div>
        </div>
      </div>

      {error && (
        <p className="fixed bottom-20 left-1/2 z-30 -translate-x-1/2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-medium text-white shadow-lg" role="alert">
          {error}
        </p>
      )}

      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-gray-200/70 bg-canvas/90 backdrop-blur-xl lg:left-[var(--admin-sidebar,16rem)]">
        <div className="mx-auto flex max-w-[1400px] items-center justify-end gap-2 px-4 py-3 sm:px-6 lg:px-8">
          <Button type="button" variant="secondary" onClick={() => router.push("/dashboard/coupons")}>Cancel</Button>
          <Button type="submit" loading={save.isPending}>{couponId ? "Save changes" : "Create coupon"}</Button>
        </div>
      </div>
    </form>
  );
}
