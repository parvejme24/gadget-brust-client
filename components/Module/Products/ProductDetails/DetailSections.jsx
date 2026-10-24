"use client";

import { Clock, MapPin, RotateCcw, Truck } from "lucide-react";
import { useShippingMethods } from "@/lib/hooks/useStorefront";
import { formatTaka } from "@/lib/format";
import ReviewsSection from "./ReviewsSection";
import Reveal, { stagger } from "@/components/Shared/Motion/Reveal";

function Section({ id, title, children }) {
  return (
    <Reveal as="section" id={id} className="scroll-mt-48 border-b border-gray-100 py-10 last:border-0">
      <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">{title}</h2>
      <div className="mt-5">{children}</div>
    </Reveal>
  );
}

// overview, specifications, reviews and delivery information
export default function DetailSections({ product, brand, category, reviews, avgRating }) {
  const { data: methods = [] } = useShippingMethods();
  // delivery cards from the store's shipping methods, plus the returns policy
  const deliveryCards = [
    ...methods.map((m, i) => [
      i === 0 ? MapPin : i === 1 ? Truck : Clock,
      m.name,
      `${formatTaka(m.baseCharge)} · ${m.estimatedDays?.min}-${m.estimatedDays?.max} business days${m.freeShippingThreshold ? ` · free over ${formatTaka(m.freeShippingThreshold)}` : ""}`,
    ]),
    [RotateCcw, "7-day replacement", "If the product arrives damaged or faulty"],
  ];
  return (
    <>
      <Section id="overview" title="Overview">
        <p className="leading-7 text-gray-600">{product.shortDescription}</p>
        {product.keyFeatures?.length > 0 && (
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {product.keyFeatures.map((feature) => (
              <div key={feature.key} className="rounded-2xl border border-gray-200/70 bg-surface shadow-sm shadow-gray-900/[0.03] p-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">{feature.key}</p>
                <p className="mt-1 font-semibold text-gray-900">{feature.values?.join(", ")}</p>
              </div>
            ))}
          </div>
        )}
      </Section>

      <Section id="specifications" title="Specifications">
        <div className="overflow-hidden rounded-2xl border border-gray-200/70 bg-surface shadow-sm shadow-gray-900/[0.03]">
          <table className="w-full text-sm">
            <tbody>
              {[
                ["Brand", brand?.brandName],
                ["Category", category?.categoryName],
                ["Type", product.subcategory],
                ...(product.keyFeatures || []).map((f) => [f.key, f.values?.join(", ")]),
              ]
                .filter(([, value]) => value)
                .map(([label, value], i) => (
                  <tr key={label} className={i % 2 ? "bg-white" : "bg-gray-50"}>
                    <th scope="row" className="w-2/5 px-5 py-3.5 text-left font-medium text-gray-500 sm:w-1/3">{label}</th>
                    <td className="px-5 py-3.5 font-medium text-gray-900">{value}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section id="reviews" title="Customer reviews">
        <ReviewsSection productId={product._id} reviews={reviews} avgRating={avgRating} />
      </Section>

      <Section id="delivery" title="Delivery & Returns">
        <div className="grid gap-4 sm:grid-cols-2">
          {deliveryCards.map(([Icon, title, text], i) => (
            <Reveal key={title} delay={stagger(i, 90)} className="hover-lift flex gap-4 rounded-2xl border border-gray-200/70 bg-surface shadow-sm shadow-gray-900/[0.03] p-5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-light text-brand">
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">{title}</p>
                <p className="mt-0.5 text-sm text-gray-500">{text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>
    </>
  );
}
