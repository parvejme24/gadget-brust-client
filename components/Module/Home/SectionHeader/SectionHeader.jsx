import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Reveal from "@/components/Shared/Motion/Reveal";

export default function SectionHeader({ eyebrow, title, href, linkText = "View all", children }) {
  return (
    <Reveal className="flex flex-wrap items-end justify-between gap-4 mb-6 sm:mb-8">
      <div>
        {eyebrow && (
          <p className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-brand mb-1">
            {eyebrow}
          </p>
        )}
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">{title}</h2>
      </div>
      <div className="flex items-center gap-3">
        {children}
        {href && (
          <Link
            href={href}
            className="group inline-flex items-center gap-1 text-sm font-semibold text-gray-700 hover:text-brand transition-colors"
          >
            {linkText}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        )}
      </div>
    </Reveal>
  );
}
