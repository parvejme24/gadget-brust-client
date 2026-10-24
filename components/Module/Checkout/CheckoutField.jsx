import { cx } from "@/lib/format";

export const fieldClass =
  "h-12 w-full rounded-xl border border-gray-200 bg-canvas/50 px-4 text-sm outline-none transition focus:border-brand focus:bg-surface focus:ring-4 focus:ring-brand/10";

// storefront form field with label and error
export default function CheckoutField({ label, id, error, hint, className, as = "input", ...props }) {
  const Tag = as;
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-gray-700">{label}</label>
      <Tag id={id} aria-invalid={!!error} className={cx(fieldClass, as === "textarea" && "h-auto py-3", error && "border-red-300 focus:border-red-400 focus:ring-red-100")} {...props} />
      {error ? <p className="mt-1.5 text-xs text-red-600">{error}</p> : hint ? <p className="mt-1.5 text-xs text-gray-500">{hint}</p> : null}
    </div>
  );
}
