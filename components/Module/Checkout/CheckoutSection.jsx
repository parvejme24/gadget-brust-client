"use client";

import Reveal from "@/components/Shared/Motion/Reveal";

// numbered card used for each checkout step
export default function CheckoutSection({ step, title, description, children }) {
  return (
    <Reveal as="section" delay={step * 90} className="rounded-3xl border border-gray-200/70 bg-surface p-5 shadow-sm shadow-gray-900/[0.03] sm:p-7">
      <div className="flex items-center gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gray-900 text-sm font-bold text-white">{step}</span>
        <div>
          <h2 className="text-lg font-bold text-gray-900">{title}</h2>
          {description && <p className="text-sm text-gray-500">{description}</p>}
        </div>
      </div>
      <div className="mt-5">{children}</div>
    </Reveal>
  );
}
