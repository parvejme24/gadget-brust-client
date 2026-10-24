"use client";

import { Loader2 } from "lucide-react";
import { cx } from "@/lib/format";

const buttonVariants = {
  primary: "bg-gray-900 text-white hover:bg-gray-800",
  brand: "bg-brand text-white hover:bg-brand-dark",
  secondary: "border border-gray-200 bg-surface text-gray-700 hover:border-gray-300 hover:bg-gray-50",
  ghost: "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
  danger: "bg-red-600 text-white hover:bg-red-700",
  "danger-ghost": "text-red-600 hover:bg-red-50",
};
const buttonSizes = { sm: "h-8 px-3 text-xs gap-1.5", md: "h-10 px-4 text-sm gap-2", icon: "h-9 w-9 justify-center" };

export const buttonClass = (variant = "primary", size = "md", extra = "") =>
  cx("inline-flex shrink-0 items-center rounded-xl font-semibold transition disabled:pointer-events-none disabled:opacity-50", buttonVariants[variant], buttonSizes[size], extra);

export function Button({ variant = "primary", size = "md", loading, children, className = "", ...props }) {
  return (
    <button className={buttonClass(variant, size, className)} disabled={loading || props.disabled} {...props}>
      {loading && <Loader2 className="h-4 w-4 animate-spin" />}
      {children}
    </button>
  );
}
