import Link from "next/link";
import { ExternalLink, Pencil, Trash2 } from "lucide-react";
import { buttonClass } from "@/components/Dashboard/Kit";

// view in store, edit, delete
export default function ProductRowActions({ product: p, onDelete }) {
  return (
    <div className="flex justify-end gap-0.5">
      <Link href={`/products/${p._id}`} target="_blank" title="View in store" aria-label={`View ${p.title} in the store`} className={buttonClass("ghost", "icon")}>
        <ExternalLink className="h-4 w-4" />
      </Link>
      <Link href={`/dashboard/products/edit/${p._id}`} title="Edit" aria-label={`Edit ${p.title}`} className={buttonClass("ghost", "icon")}>
        <Pencil className="h-4 w-4" />
      </Link>
      <button onClick={() => onDelete(p)} title="Delete" aria-label={`Delete ${p.title}`} className={buttonClass("danger-ghost", "icon")}>
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );
}
