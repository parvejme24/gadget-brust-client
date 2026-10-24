"use client";

import { useEffect, useState } from "react";
import { Globe, Loader2, Megaphone, Search, Store, Truck } from "lucide-react";
import { adminService } from "@/lib/services/adminService";
import { useAdminMutation, useAdminSettings } from "@/lib/hooks/useAdmin";
import { Button, ErrorState, Field, PageHeader, Panel, Toggle, cx, inputClass } from "@/components/Dashboard/Kit";
import { DropdownSelect } from "@/components/ui/dropdown-select";

const tabs = [
  { key: "general", label: "General", icon: Store },
  { key: "delivery", label: "Delivery & tax", icon: Truck },
  { key: "social", label: "Social links", icon: Globe },
  { key: "seo", label: "SEO", icon: Search },
  { key: "announcement", label: "Announcement", icon: Megaphone },
];

export default function StoreSettingsPage() {
  const { data, isLoading, isError, error, refetch } = useAdminSettings();
  const [tab, setTab] = useState("general");
  const [form, setForm] = useState(null);

  useEffect(() => {
    if (data) setForm(structuredClone(data));
  }, [data]);

  const save = useAdminMutation((payload) => adminService.updateSettings(payload), { success: "Settings saved" });

  if (isLoading || (!form && !isError)) return <div className="flex justify-center py-20"><Loader2 className="h-6 w-6 animate-spin text-gray-400" /></div>;
  if (isError) return <ErrorState error={error} onRetry={refetch} />;

  // set("a.b", value) for nested fields
  const set = (path, value) =>
    setForm((f) => {
      const next = structuredClone(f);
      const keys = path.split(".");
      let obj = next;
      keys.slice(0, -1).forEach((k) => (obj = obj[k] ||= {}));
      obj[keys.at(-1)] = value;
      return next;
    });
  const input = (path, props = {}) => {
    const value = path.split(".").reduce((o, k) => o?.[k], form) ?? "";
    return (
      <input
        id={path}
        value={value}
        onChange={(e) => set(path, props.type === "number" ? (e.target.value === "" ? "" : Number(e.target.value)) : e.target.value)}
        className={inputClass}
        {...props}
      />
    );
  };
  const dirty = JSON.stringify(form) !== JSON.stringify(data);

  const submit = (e) => {
    e.preventDefault();
    const { _id, key, createdAt, updatedAt, ...payload } = form;
    save.mutate(payload);
  };

  return (
    <form onSubmit={submit}>
      <PageHeader
        title="Store settings"
        description="Business details, delivery pricing and how your store appears online."
        actions={
          <>
            {dirty && <span className="text-xs font-medium text-amber-700">Unsaved changes</span>}
            <Button type="button" variant="secondary" disabled={!dirty} onClick={() => setForm(structuredClone(data))}>Discard</Button>
            <Button type="submit" loading={save.isPending} disabled={!dirty}>Save changes</Button>
          </>
        }
      />

      <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
        <nav className="no-scrollbar flex gap-1 overflow-x-auto lg:flex-col" aria-label="Settings sections">
          {tabs.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              type="button"
              onClick={() => setTab(key)}
              aria-current={tab === key ? "page" : undefined}
              className={cx(
                "flex shrink-0 items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition",
                tab === key ? "bg-surface text-gray-900 shadow-sm ring-1 ring-gray-200/70" : "text-gray-600 hover:bg-gray-100"
              )}
            >
              <Icon className={cx("h-4 w-4", tab === key ? "text-brand-dark" : "text-gray-400")} />
              {label}
            </button>
          ))}
        </nav>

        <div className="min-w-0">
          {tab === "general" && (
            <Panel title="Business details" description="Shown in the footer, contact page and invoices.">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Store name" htmlFor="storeName">{input("storeName")}</Field>
                <Field label="Currency" htmlFor="currency">
                  <DropdownSelect id="currency" value={form.currency} onChange={(v) => set("currency", v)} options={[{ value: "BDT", label: "BDT (৳)" }, { value: "USD", label: "USD ($)" }]} />
                </Field>
                <Field label="Tagline" htmlFor="tagline" className="sm:col-span-2">{input("tagline")}</Field>
                <Field label="Support email" htmlFor="email">{input("email", { type: "email" })}</Field>
                <Field label="Phone" htmlFor="phone">{input("phone", { type: "tel" })}</Field>
                <Field label="Address" htmlFor="address" className="sm:col-span-2">{input("address")}</Field>
                <Field label="Opening hours" htmlFor="hours" className="sm:col-span-2">{input("hours")}</Field>
              </div>
            </Panel>
          )}

          {tab === "delivery" && (
            <Panel title="Delivery & tax" description="Default pricing used across the store.">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Inside Dhaka (৳)" htmlFor="deliveryCharges.insideDhaka">{input("deliveryCharges.insideDhaka", { type: "number", min: 0 })}</Field>
                <Field label="Outside Dhaka (৳)" htmlFor="deliveryCharges.outsideDhaka">{input("deliveryCharges.outsideDhaka", { type: "number", min: 0 })}</Field>
                <Field label="Free delivery over (৳)" htmlFor="freeDeliveryThreshold">{input("freeDeliveryThreshold", { type: "number", min: 0 })}</Field>
                <Field label="Tax / VAT (%)" htmlFor="taxRate">{input("taxRate", { type: "number", min: 0, max: 100 })}</Field>
                <Field label="Low stock alert at" htmlFor="lowStockThreshold" hint="Products at or below this quantity are flagged.">{input("lowStockThreshold", { type: "number", min: 0 })}</Field>
              </div>
            </Panel>
          )}

          {tab === "social" && (
            <Panel title="Social links" description="Leave a field empty to hide that icon.">
              <div className="grid gap-4 sm:grid-cols-2">
                {["facebook", "instagram", "youtube", "twitter"].map((network) => (
                  <Field key={network} label={network[0].toUpperCase() + network.slice(1)} htmlFor={`socials.${network}`}>
                    {input(`socials.${network}`, { type: "url", placeholder: `https://${network}.com/yourstore` })}
                  </Field>
                ))}
              </div>
            </Panel>
          )}

          {tab === "seo" && (
            <Panel title="Search engine listing" description="How your home page appears in Google results.">
              <div className="space-y-4">
                <Field label="Meta title" htmlFor="seo.metaTitle" hint={`${form.seo?.metaTitle?.length || 0}/60 characters`}>{input("seo.metaTitle", { maxLength: 70 })}</Field>
                <Field label="Meta description" htmlFor="seo.metaDescription" hint={`${form.seo?.metaDescription?.length || 0}/160 characters`}>
                  <textarea id="seo.metaDescription" rows={3} maxLength={200} value={form.seo?.metaDescription || ""} onChange={(e) => set("seo.metaDescription", e.target.value)} className={cx(inputClass, "h-auto py-2.5")} />
                </Field>
                <Field label="Keywords" htmlFor="seo.keywords" hint="Comma separated">{input("seo.keywords")}</Field>
                <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                  <p className="text-xs text-gray-500">Preview</p>
                  <p className="mt-1 truncate text-lg text-[#1a0dab]">{form.seo?.metaTitle}</p>
                  <p className="text-xs text-emerald-800">gadgetbrust.com</p>
                  <p className="mt-0.5 line-clamp-2 text-sm text-gray-600">{form.seo?.metaDescription}</p>
                </div>
              </div>
            </Panel>
          )}

          {tab === "announcement" && (
            <div className="space-y-6">
              <Panel title="Announcement bar" description="A short message shown above the store header.">
                <div className="space-y-4">
                  <div className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3">
                    <span className="text-sm font-medium text-gray-900">Show announcement</span>
                    <Toggle checked={!!form.announcement?.enabled} onChange={(v) => set("announcement.enabled", v)} label="Show announcement" />
                  </div>
                  <Field label="Message" htmlFor="announcement.text">{input("announcement.text", { maxLength: 120 })}</Field>
                </div>
              </Panel>
              <Panel title="Maintenance mode" description="Saved for when the storefront supports it; it doesn't hide the store yet.">
                <div className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3">
                  <span className="text-sm font-medium text-gray-900">Maintenance mode</span>
                  <Toggle checked={!!form.maintenanceMode} onChange={(v) => set("maintenanceMode", v)} label="Maintenance mode" />
                </div>
              </Panel>
            </div>
          )}
        </div>
      </div>
    </form>
  );
}
