"use client";

import { useEffect, useState } from "react";
import { adminService } from "@/lib/services/adminService";
import { useAdminMutation } from "@/lib/hooks/useAdmin";
import { Button, Field, ImageInput, Modal, TagInput, inputClass } from "@/components/Dashboard/Kit";

const emptyForm = { categoryName: "", image: "", subcategories: [] };

// editing: a category, "new", or null (closed)
export default function CategoryFormModal({ editing, onClose }) {
  const [form, setForm] = useState(emptyForm);
  const [formError, setFormError] = useState("");
  useEffect(() => {
    if (!editing) return;
    setFormError("");
    setForm(editing === "new" ? emptyForm : { categoryName: editing.categoryName, image: editing.categoryImg?.url || "", subcategories: editing.subcategories || [] });
  }, [editing]);

  const save = useAdminMutation(
    (payload) => (editing === "new" ? adminService.createCategory(payload) : adminService.updateCategory(editing._id, payload)),
    { success: editing === "new" ? "Category created" : "Category updated", onSuccess: onClose }
  );

  const submit = (e) => {
    e.preventDefault();
    if (form.categoryName.trim().length < 2) return setFormError("Enter a category name.");
    save.mutate({ categoryName: form.categoryName.trim(), categoryImg: { url: form.image.trim() }, subcategories: form.subcategories });
  };

  return (
    <Modal
      open={!!editing}
      onClose={onClose}
      title={editing === "new" ? "New category" : "Edit category"}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button type="submit" form="category-form" loading={save.isPending}>{editing === "new" ? "Create" : "Save changes"}</Button>
        </>
      }
    >
      <form id="category-form" onSubmit={submit} className="space-y-5">
        <Field label="Name" htmlFor="categoryName" error={formError}>
          <input id="categoryName" value={form.categoryName} onChange={(e) => setForm({ ...form, categoryName: e.target.value })} placeholder="e.g. Smartwatch" className={inputClass} autoFocus />
        </Field>
        <ImageInput value={form.image} onChange={(image) => setForm({ ...form, image })} label="Image" hint="Optional. Without an image the store shows a matching icon." />
        <Field label="Types" hint="Used for filtering, e.g. Gaming Laptop, Ultrabook.">
          <TagInput value={form.subcategories} onChange={(subcategories) => setForm({ ...form, subcategories })} placeholder="Type a type and press Enter" label="Add type" />
        </Field>
      </form>
    </Modal>
  );
}
