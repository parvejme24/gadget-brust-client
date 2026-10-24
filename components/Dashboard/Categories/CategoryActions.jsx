import { Pencil, Trash2 } from "lucide-react";
import { buttonClass } from "@/components/Dashboard/Kit";

export default function CategoryActions({ category, onEdit, onDelete }) {
  return (
    <div className="flex justify-end gap-1">
      <button onClick={onEdit} aria-label={`Edit ${category.categoryName}`} className={buttonClass("ghost", "icon")}><Pencil className="h-4 w-4" /></button>
      <button onClick={onDelete} aria-label={`Delete ${category.categoryName}`} className={buttonClass("danger-ghost", "icon")}><Trash2 className="h-4 w-4" /></button>
    </div>
  );
}
