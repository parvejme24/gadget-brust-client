"use client";

import { useState } from "react";
import { Plus, Shapes } from "lucide-react";
import { adminService } from "@/lib/services/adminService";
import { useAdminCategories, useAdminMutation } from "@/lib/hooks/useAdmin";
import useCatalogCounts from "@/lib/hooks/useCatalogCounts";
import { Button, ConfirmDialog, EmptyState, ErrorState, PageHeader, SearchInput, ViewToggle, useViewMode } from "@/components/Dashboard/Kit";
import CategoryCard from "@/components/Dashboard/Categories/CategoryCard";
import CategoriesTable from "@/components/Dashboard/Categories/CategoriesTable";
import CategoryActions from "@/components/Dashboard/Categories/CategoryActions";
import CategoryFormModal from "@/components/Dashboard/Categories/CategoryFormModal";

export default function CategoriesPage() {
  const { data: categories = [], isLoading, isError, error, refetch } = useAdminCategories();
  const counts = useCatalogCounts();
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState(null); // null | "new" | category
  const [toDelete, setToDelete] = useState(null);
  const [view, setView] = useViewMode("categories", "grid");
  const remove = useAdminMutation((id) => adminService.deleteCategory(id), { success: "Category deleted", onSuccess: () => setToDelete(null) });

  const visible = categories.filter((c) => c.categoryName.toLowerCase().includes(search.toLowerCase()));
  const actions = (c) => <CategoryActions category={c} onEdit={() => setEditing(c)} onDelete={() => setToDelete(c)} />;

  return (
    <>
      <PageHeader
        title="Categories"
        description={`${categories.length} categories organize your catalog and power the store's navigation.`}
        actions={
          <>
            <ViewToggle value={view} onChange={setView} />
            <Button onClick={() => setEditing("new")}><Plus className="h-4 w-4" /> New category</Button>
          </>
        }
      />

      <SearchInput value={search} onChange={setSearch} placeholder="Search categories…" className="mb-5 max-w-sm" />

      {isError ? (
        <ErrorState error={error} onRetry={refetch} />
      ) : isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-44 animate-pulse rounded-2xl bg-gray-100" />)}</div>
      ) : visible.length === 0 ? (
        <EmptyState icon={Shapes} title={search ? "No categories match" : "No categories yet"} action={!search && <Button onClick={() => setEditing("new")}><Plus className="h-4 w-4" /> New category</Button>} />
      ) : view === "table" ? (
        <CategoriesTable categories={visible} counts={counts} actions={actions} />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {visible.map((c) => <CategoryCard key={c._id} category={c} count={counts.byCategory[c._id] || 0} actions={actions(c)} />)}
        </div>
      )}

      <CategoryFormModal editing={editing} onClose={() => setEditing(null)} />
      <ConfirmDialog
        open={!!toDelete}
        onClose={() => setToDelete(null)}
        onConfirm={() => remove.mutate(toDelete._id)}
        loading={remove.isPending}
        title="Delete category?"
        message={
          counts.byCategory[toDelete?._id]
            ? `"${toDelete?.categoryName}" still has ${counts.byCategory[toDelete._id]} products. They will be left without a category until you reassign them.`
            : `"${toDelete?.categoryName}" will be removed. This can't be undone.`
        }
      />
    </>
  );
}
