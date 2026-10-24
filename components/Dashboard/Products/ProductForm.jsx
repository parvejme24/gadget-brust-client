"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2 } from "lucide-react";
import { adminService } from "@/lib/services/adminService";
import { useAdminBrands, useAdminCategories, useAdminMutation } from "@/lib/hooks/useAdmin";
import { Button, Field, ImageInput, Panel, Toggle, formatTaka, inputClass } from "@/components/Dashboard/Kit";
import { DropdownSelect } from "@/components/ui/dropdown-select";

const remarks = [
  ["regular", "Regular"],
  ["new", "New arrival"],
  ["trending", "Trending"],
  ["popular", "Popular"],
  ["best", "Best seller"],
  ["top", "Top pick"],
];

const emptyProduct = {
  title: "",
  shortDescription: "",
  image: "",
  price: "",
  discount: "0",
  stock: "",
  category: "",
  subcategory: "",
  brand: "",
  remark: "regular",
  isSlider: false,
  keyFeatures: [{ key: "", values: "" }],
};

export const productToForm = (p) => ({
  title: p.title || "",
  shortDescription: p.shortDescription || "",
  image: p.image?.url || "",
  price: String(p.price ?? ""),
  discount: String(p.discount ?? 0),
  stock: String(p.stock ?? ""),
  category: typeof p.category === "object" ? p.category?._id || "" : p.category || "",
  subcategory: p.subcategory || "",
  brand: typeof p.brand === "object" ? p.brand?._id || "" : p.brand || "",
  remark: p.remark || "regular",
  isSlider: !!p.isSlider,
  keyFeatures: p.keyFeatures?.length ? p.keyFeatures.map((f) => ({ key: f.key, values: (f.values || []).join(", ") })) : [{ key: "", values: "" }],
});

export default function ProductForm({ initial, productId }) {
  const router = useRouter();
  const [form, setForm] = useState(initial || emptyProduct);
  const [errors, setErrors] = useState({});
  const { data: categories = [] } = useAdminCategories();
  const { data: brands = [] } = useAdminBrands();

  const set = (field) => (value) => setForm((f) => ({ ...f, [field]: value }));
  const setInput = (field) => (e) => set(field)(e.target.value);
  const selectedCategory = categories.find((c) => c._id === form.category);
  const price = Number(form.price) || 0;
  const discount = Number(form.discount) || 0;
  const finalPrice = Math.round(price - (price * discount) / 100);

  const save = useAdminMutation(
    (payload) => (productId ? adminService.updateProduct(productId, payload) : adminService.createProduct(payload)),
    {
      success: productId ? "Product updated" : "Product created",
      onSuccess: () => router.push("/dashboard/products"),
    }
  );

  const validate = () => {
    const next = {};
    if (form.title.trim().length < 3) next.title = "Enter a product title.";
    if (form.shortDescription.trim().length < 10) next.shortDescription = "Add a short description (10+ characters).";
    if (!(price > 0)) next.price = "Enter a price above 0.";
    if (discount < 0 || discount > 90) next.discount = "Discount must be 0-90%.";
    if (form.stock === "" || Number(form.stock) < 0) next.stock = "Enter the stock quantity.";
    if (!form.category) next.category = "Choose a category.";
    if (!form.subcategory) next.subcategory = "Choose a type.";
    if (!form.brand) next.brand = "Choose a brand.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const submit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    save.mutate({
      title: form.title.trim(),
      shortDescription: form.shortDescription.trim(),
      ...(form.image && { image: { url: form.image.trim() } }),
      price,
      discount,
      stock: Number(form.stock),
      category: form.category,
      subcategory: form.subcategory,
      brand: form.brand,
      remark: form.remark,
      isSlider: form.isSlider,
      keyFeatures: form.keyFeatures
        .filter((f) => f.key.trim() && f.values.trim())
        .map((f) => ({ key: f.key.trim(), values: f.values.split(",").map((v) => v.trim()).filter(Boolean) })),
    });
  };

  const updateFeature = (index, field, value) =>
    setForm((f) => ({ ...f, keyFeatures: f.keyFeatures.map((row, i) => (i === index ? { ...row, [field]: value } : row)) }));

  return (
    <form onSubmit={submit} noValidate className="pb-24">
      <div className="grid gap-6 xl:grid-cols-3">
        <div className="space-y-6 xl:col-span-2">
          <Panel title="Basic information">
            <div className="space-y-4">
              <Field label="Product title" htmlFor="title" error={errors.title}>
                <input id="title" value={form.title} onChange={setInput("title")} placeholder="e.g. iPhone 15 Pro 256GB" className={inputClass} />
              </Field>
              <Field label="Short description" htmlFor="desc" error={errors.shortDescription} hint="Shown on product cards and at the top of the product page.">
                <textarea id="desc" rows={3} value={form.shortDescription} onChange={setInput("shortDescription")} className={`${inputClass} h-auto py-2.5`} />
              </Field>
            </div>
          </Panel>

          <Panel title="Media">
            <ImageInput value={form.image} onChange={set("image")} label="Product image" hint="Square PNG/WebP with a light background looks best." />
          </Panel>

          <Panel
            title="Key features"
            description="Shown as highlights and in the specifications table. Separate multiple values with commas."
            action={
              <Button type="button" variant="secondary" size="sm" onClick={() => setForm((f) => ({ ...f, keyFeatures: [...f.keyFeatures, { key: "", values: "" }] }))}>
                <Plus className="h-3.5 w-3.5" /> Add row
              </Button>
            }
          >
            <div className="space-y-2.5">
              {form.keyFeatures.map((row, i) => (
                <div key={i} className="flex gap-2">
                  <input value={row.key} onChange={(e) => updateFeature(i, "key", e.target.value)} placeholder="Feature (e.g. RAM)" aria-label="Feature name" className={`${inputClass} w-2/5`} />
                  <input value={row.values} onChange={(e) => updateFeature(i, "values", e.target.value)} placeholder="Value (e.g. 8GB)" aria-label="Feature value" className={inputClass} />
                  <button
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, keyFeatures: f.keyFeatures.filter((_, idx) => idx !== i) }))}
                    aria-label="Remove feature"
                    className="shrink-0 rounded-xl px-2.5 text-gray-400 hover:bg-red-50 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </Panel>
        </div>

        <div className="space-y-6">
          <Panel title="Pricing">
            <div className="grid grid-cols-2 gap-4">
              <Field label="Price (৳)" htmlFor="price" error={errors.price}>
                <input id="price" type="number" min="0" inputMode="numeric" value={form.price} onChange={setInput("price")} className={inputClass} />
              </Field>
              <Field label="Discount (%)" htmlFor="discount" error={errors.discount}>
                <input id="discount" type="number" min="0" max="90" inputMode="numeric" value={form.discount} onChange={setInput("discount")} className={inputClass} />
              </Field>
            </div>
            <div className="mt-4 flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3 text-sm">
              <span className="text-gray-500">Customer pays</span>
              <span className="font-bold text-gray-900">
                {formatTaka(finalPrice)}
                {discount > 0 && <span className="ml-2 text-xs font-normal text-gray-400 line-through">{formatTaka(price)}</span>}
              </span>
            </div>
          </Panel>

          <Panel title="Inventory">
            <Field label="Stock quantity" htmlFor="stock" error={errors.stock} hint="Products with 10 or fewer units show as low stock.">
              <input id="stock" type="number" min="0" inputMode="numeric" value={form.stock} onChange={setInput("stock")} className={inputClass} />
            </Field>
          </Panel>

          <Panel title="Organization">
            <div className="space-y-4">
              <Field label="Category" htmlFor="category" error={errors.category}>
                <DropdownSelect id="category" placeholder="Select category" value={form.category} onChange={(v) => setForm((f) => ({ ...f, category: v, subcategory: "" }))} options={categories.map((c) => ({ value: c._id, label: c.categoryName }))} />
              </Field>
              <Field label="Type" htmlFor="subcategory" error={errors.subcategory}>
                <DropdownSelect id="subcategory" placeholder={selectedCategory ? "Select type" : "Choose a category first"} value={form.subcategory} onChange={set("subcategory")} disabled={!selectedCategory} options={(selectedCategory?.subcategories || []).map((s) => ({ value: s, label: s }))} />
              </Field>
              <Field label="Brand" htmlFor="brand" error={errors.brand}>
                <DropdownSelect id="brand" placeholder="Select brand" value={form.brand} onChange={set("brand")} options={brands.map((b) => ({ value: b._id, label: b.brandName }))} />
              </Field>
              <Field label="Label" htmlFor="remark" hint="Controls which home page tab shows this product.">
                <DropdownSelect id="remark" value={form.remark} onChange={set("remark")} options={remarks.map(([value, label]) => ({ value, label }))} />
              </Field>
              <div className="flex items-center justify-between gap-4 rounded-xl bg-gray-50 px-4 py-3">
                <div>
                  <p className="text-sm font-medium text-gray-900">Home page slider</p>
                  <p className="text-xs text-gray-500">Feature this product in the hero.</p>
                </div>
                <Toggle checked={form.isSlider} onChange={set("isSlider")} label="Show in home page slider" />
              </div>
            </div>
          </Panel>
        </div>
      </div>

      {/* sticky actions */}
      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-gray-200/70 bg-canvas/90 backdrop-blur-xl lg:left-[var(--admin-sidebar,16rem)]">
        <div className="mx-auto flex max-w-[1400px] items-center justify-end gap-2 px-4 py-3 sm:px-6 lg:px-8">
          <Button type="button" variant="secondary" onClick={() => router.push("/dashboard/products")}>Cancel</Button>
          <Button type="submit" loading={save.isPending}>{productId ? "Save changes" : "Create product"}</Button>
        </div>
      </div>
    </form>
  );
}
