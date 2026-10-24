import { Pencil, Star, Trash2 } from "lucide-react";
import { buttonClass } from "@/components/Dashboard/Kit";

export default function CourierActions({ courier, onDefault, onEdit, onDelete }) {
  return (
    <div className="flex items-center gap-0.5">
      {!courier.isDefault && (
        <button onClick={onDefault} title="Make default" aria-label={`Make ${courier.name} the default courier`} className={buttonClass("ghost", "icon")}>
          <Star className="h-4 w-4" />
        </button>
      )}
      <button onClick={onEdit} title="Edit" aria-label={`Edit ${courier.name}`} className={buttonClass("ghost", "icon")}><Pencil className="h-4 w-4" /></button>
      <button onClick={onDelete} title="Delete" aria-label={`Delete ${courier.name}`} className={buttonClass("danger-ghost", "icon")}><Trash2 className="h-4 w-4" /></button>
    </div>
  );
}
