import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { cx } from "@/lib/format";

export function PageHeader({ title, description, actions, back }) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        {back && (
          <Link href={back.href} className="mb-2 inline-flex items-center gap-1 text-sm font-medium text-gray-500 hover:text-gray-900">
            <ChevronLeft className="h-4 w-4" /> {back.label}
          </Link>
        )}
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{title}</h1>
        {description && <p className="mt-1 text-sm text-gray-500">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}

export function Panel({ title, description, action, children, className = "", bodyClassName = "p-5" }) {
  return (
    <section className={cx("min-w-0 rounded-2xl border border-gray-200/70 bg-surface shadow-sm shadow-gray-900/[0.02]", className)}>
      {(title || action) && (
        <div className="flex items-start justify-between gap-4 border-b border-gray-100 px-5 py-4">
          <div>
            {title && <h2 className="text-[15px] font-semibold text-gray-900">{title}</h2>}
            {description && <p className="mt-0.5 text-xs text-gray-500">{description}</p>}
          </div>
          {action}
        </div>
      )}
      <div className={bodyClassName}>{children}</div>
    </section>
  );
}

export function StatCard({ label, value, icon: Icon, hint, href, tone = "gray", loading }) {
  const tones = {
    gray: "bg-gray-100 text-gray-700",
    brand: "bg-brand-light text-brand-dark",
    sky: "bg-sky-100 text-sky-700",
    violet: "bg-violet-100 text-violet-700",
    amber: "bg-amber-100 text-amber-700",
    red: "bg-red-100 text-red-700",
  };
  const body = (
    <div className="flex items-start justify-between gap-3">
      <div className="min-w-0">
        <p className="text-[13px] font-medium text-gray-500">{label}</p>
        {loading ? (
          <div className="mt-2 h-7 w-24 animate-pulse rounded-lg bg-gray-100" />
        ) : (
          <p className="mt-1.5 truncate text-xl font-bold tracking-tight text-gray-900 sm:text-2xl">{value}</p>
        )}
        {hint && <p className="mt-1 truncate text-xs text-gray-500">{hint}</p>}
      </div>
      {Icon && (
        <span className={cx("flex h-9 w-9 shrink-0 items-center justify-center rounded-xl sm:h-10 sm:w-10", tones[tone])}>
          <Icon className="h-[18px] w-[18px] sm:h-5 sm:w-5" />
        </span>
      )}
    </div>
  );
  const className = "animate-rise block min-w-0 rounded-2xl border border-gray-200/70 bg-surface p-4 shadow-sm shadow-gray-900/[0.02] sm:p-5";
  return href ? (
    <Link href={href} className={cx(className, "hover-lift transition hover:border-gray-300")}>
      {body}
    </Link>
  ) : (
    <div className={className}>{body}</div>
  );
}
