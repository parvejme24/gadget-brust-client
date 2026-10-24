"use client";

import { useState } from "react";
import Link from "next/link";
import { BadgeCheck, Pencil, Plus, Trash2 } from "lucide-react";
import { adminService } from "@/lib/services/adminService";
import { useAdminBrands, useAdminMutation } from "@/lib/hooks/useAdmin";
import useCatalogCounts from "@/lib/hooks/useCatalogCounts";
import {
  Button,
  ConfirmDialog,
  EmptyState,
  ErrorState,
  Field,
  ImageInput,
  Modal,
  PageHeader,
  SearchInput,
  DataTable,
  ViewToggle,
  buttonClass,
  formatDate,
  inputClass,
  useViewMode,
} from "@/components/Dashboard/Kit";

export default function BrandsPage() {
  const { data: brands = [], isLoading, isError, error, refetch } = useAdminBrands();
  const counts = useCatalogCounts();
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ brandName: "", brandImg: "" });
  const [errors, setErrors] = useState({});
  const [toDelete, setToDelete] = useState(null);
  const [view, setView] = useViewMode("brands", "grid");

  const open = (brand) => {
    setEditing(brand || "new");
    setErrors({});
    setForm(brand ? { brandName: brand.brandName, brandImg: brand.brandImg || "" } : { brandName: "", brandImg: "" });
  };
  const close = () => setEditing(null);

  const save = useAdminMutation(
    (payload) => (editing === "new" ? adminService.createBrand(payload) : adminService.updateBrand(editing._id, payload)),
    { success: editing === "new" ? "Brand created" : "Brand updated", onSuccess: close }
  );
  const remove = useAdminMutation((id) => adminService.deleteBrand(id), { success: "Brand deleted", onSuccess: () => setToDelete(null) });

  const submit = (e) => {
    e.preventDefault();
    const next = {};
    if (form.brandName.trim().length < 2) next.brandName = "Enter a brand name.";
    if (!form.brandImg.trim()) next.brandImg = "A logo is required.";
    setErrors(next);
    if (Object.keys(next).length) return;
    save.mutate({ brandName: form.brandName.trim(), brandImg: form.brandImg.trim() });
  };

  const visible = brands
    .filter((b) => b.brandName.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => a.brandName.localeCompare(b.brandName));

  return (
    <>
      <PageHeader
        title="Brands"
        description={`${brands.length} brands in your store.`}
        actions={
          <>
            <ViewToggle value={view} onChange={setView} />
            <Button onClick={() => open()}><Plus className="h-4 w-4" /> New brand</Button>
          </>
        }
      />

      <SearchInput value={search} onChange={setSearch} placeholder="Search brands…" className="mb-5 max-w-sm" />

      {isError ? (
        <ErrorState error={error} onRetry={refetch} />
      ) : isLoading ? (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-5">{Array.from({ length: 10 }).map((_, i) => <div key={i} className="h-40 animate-pulse rounded-2xl bg-gray-100" />)}</div>
      ) : visible.length > 0 && view === "table" ? (
        <div className="min-w-0 rounded-2xl border border-gray-200/70 bg-surface shadow-sm shadow-gray-900/[0.02]">
          <DataTable
            rows={visible}
            columns={[
              {
                key: "brand",
                header: "Brand",
                render: (b) => (
                  <div className="flex min-w-[180px] items-center gap-3">
                    <span className="flex h-11 w-16 shrink-0 items-center justify-center rounded-xl bg-gray-50 px-2 ring-1 ring-gray-100">
                      {b.brandImg ? <img src={b.brandImg} alt="" className="max-h-6 max-w-full object-contain" /> : <BadgeCheck className="h-5 w-5 text-gray-300" />}
                    </span>
                    <span className="font-semibold text-gray-900">{b.brandName}</span>
                  </div>
                ),
              },
              {
                key: "products",
                header: "Products",
                render: (b) => (
                  <Link href={`/dashboard/products?brand=${b._id}`} className="font-medium text-gray-700 hover:underline">
                    {counts.byBrand[b._id] || 0}
                  </Link>
                ),
              },
              { key: "added", header: "Added", hideBelow: "md", render: (b) => formatDate(b.createdAt) },
              {
                key: "actions",
                header: <span className="sr-only">Actions</span>,
                className: "text-right",
                render: (b) => (
                  <div className="flex justify-end gap-1">
                    <button onClick={() => open(b)} aria-label={`Edit ${b.brandName}`} className={buttonClass("ghost", "icon")}><Pencil className="h-4 w-4" /></button>
                    <button onClick={() => setToDelete(b)} aria-label={`Delete ${b.brandName}`} className={buttonClass("danger-ghost", "icon")}><Trash2 className="h-4 w-4" /></button>
                  </div>
                ),
              },
            ]}
          />
        </div>
      ) : visible.length === 0 ? (
        <EmptyState icon={BadgeCheck} title={search ? "No brands match" : "No brands yet"} />
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-5">
          {visible.map((brand) => {
            const count = counts.byBrand[brand._id] || 0;
            return (
              <div key={brand._id} className="group relative flex flex-col items-center rounded-2xl border border-gray-200/70 bg-surface p-5 text-center shadow-sm shadow-gray-900/[0.02]">
                <div className="absolute right-2 top-2 flex gap-0.5 opacity-100 transition sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100">
                  <button onClick={() => open(brand)} aria-label={`Edit ${brand.brandName}`} className={buttonClass("ghost", "icon")}>
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button onClick={() => setToDelete(brand)} aria-label={`Delete ${brand.brandName}`} className={buttonClass("danger-ghost", "icon")}>
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <div className="mt-4 flex h-14 w-full items-center justify-center">
                  {brand.brandImg ? <img src={brand.brandImg} alt={brand.brandName} className="max-h-10 max-w-[75%] object-contain" /> : <BadgeCheck className="h-8 w-8 text-gray-300" />}
                </div>
                <p className="mt-3 truncate font-semibold text-gray-900">{brand.brandName}</p>
                <Link href={`/dashboard/products?brand=${brand._id}`} className="text-xs text-gray-500 hover:text-gray-900 hover:underline">
                  {count} product{count === 1 ? "" : "s"}
                </Link>
              </div>
            );
          })}
        </div>
      )}

      <Modal
        open={!!editing}
        onClose={close}
        title={editing === "new" ? "New brand" : "Edit brand"}
        footer={
          <>
            <Button variant="secondary" onClick={close}>Cancel</Button>
            <Button type="submit" form="brand-form" loading={save.isPending}>{editing === "new" ? "Create" : "Save changes"}</Button>
          </>
        }
      >
        <form id="brand-form" onSubmit={submit} className="space-y-5">
          <Field label="Brand name" htmlFor="brandName" error={errors.brandName}>
            <input id="brandName" value={form.brandName} onChange={(e) => setForm({ ...form, brandName: e.target.value })} placeholder="e.g. Samsung" className={inputClass} autoFocus />
          </Field>
          <ImageInput value={form.brandImg} onChange={(brandImg) => setForm({ ...form, brandImg })} label="Logo" hint={errors.brandImg || "SVG or transparent PNG works best."} />
        </form>
      </Modal>

      <ConfirmDialog
        open={!!toDelete}
        onClose={() => setToDelete(null)}
        onConfirm={() => remove.mutate(toDelete._id)}
        loading={remove.isPending}
        title="Delete brand?"
        message={
          counts.byBrand[toDelete?._id]
            ? `"${toDelete?.brandName}" still has ${counts.byBrand[toDelete._id]} products. They will be left without a brand until you reassign them.`
            : `"${toDelete?.brandName}" will be removed. This can't be undone.`
        }
      />
    </>
  );
}
