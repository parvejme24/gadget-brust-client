import Link from "next/link";
import { CopyPlus, Pencil, Trash2 } from "lucide-react";
import { buttonClass } from "@/components/Dashboard/Kit";

// duplicate, edit, delete
export default function CouponActions({ coupon: c, onDelete }) {
  return (
    <div className="flex items-center gap-0.5">
      <Link href={`/dashboard/coupons/new?from=${c._id}`} title="Duplicate" aria-label={`Duplicate ${c.code}`} className={buttonClass("ghost", "icon")}><CopyPlus className="h-4 w-4" /></Link>
      <Link href={`/dashboard/coupons/${c._id}`} title="Edit" aria-label={`Edit ${c.code}`} className={buttonClass("ghost", "icon")}><Pencil className="h-4 w-4" /></Link>
      <button onClick={() => onDelete(c)} title="Delete" aria-label={`Delete ${c.code}`} className={buttonClass("danger-ghost", "icon")}><Trash2 className="h-4 w-4" /></button>
    </div>
  );
}
