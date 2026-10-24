"use client";

import { useShippingMethods } from "@/lib/hooks/useStorefront";
import { formatTaka } from "@/lib/format";
import Accordion from "@/components/Shared/Motion/Accordion";
import Reveal from "@/components/Shared/Motion/Reveal";

// delivery answer is built from the store's shipping methods
export default function ContactFaq() {
  const { data: methods = [] } = useShippingMethods();
  const delivery = methods.length
    ? methods.map((m) => `${m.name}: ${m.estimatedDays?.min}-${m.estimatedDays?.max} business days, ${formatTaka(m.baseCharge)}${m.freeShippingThreshold ? ` (free over ${formatTaka(m.freeShippingThreshold)})` : ""}.`).join(" ")
    : "We deliver across Bangladesh. Delivery time and charge are shown at checkout.";

  const faqs = [
    { title: "How long does delivery take?", content: delivery },
    { title: "Are your products genuine?", content: "Yes. Every product is sourced from authorized distributors and comes with the official brand warranty." },
    { title: "Can I return a product?", content: "If an item arrives damaged or faulty, contact us within 7 days and we'll arrange a replacement." },
    { title: "Do I need an account to shop?", content: "No. Add items to your cart and check out as a guest. You can track the order with its number and your phone." },
    { title: "How do I pay?", content: "Cash on delivery: pay the courier when your order arrives. We call to confirm every order first." },
  ];

  return (
    <Reveal variant="right" delay={120}>
      <h2 className="text-lg font-bold text-gray-900">Frequently asked</h2>
      <Accordion
        items={faqs}
        defaultOpen={[0]}
        className="mt-3 divide-y divide-gray-100 overflow-hidden rounded-2xl border border-gray-200/70 bg-surface shadow-sm shadow-gray-900/[0.03]"
      />
    </Reveal>
  );
}
