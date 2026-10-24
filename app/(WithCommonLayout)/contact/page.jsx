"use client";

import { useStoreInfo } from "@/lib/hooks/useStorefront";
import PageHero from "@/components/Module/Shop/PageHero";
import Reveal from "@/components/Shared/Motion/Reveal";
import ContactCards from "@/components/Module/Contact/ContactCards";
import ContactForm from "@/components/Module/Contact/ContactForm";
import ContactFaq from "@/components/Module/Contact/ContactFaq";

export default function ContactPage() {
  const store = useStoreInfo();

  return (
    <div className="pb-16">
      <PageHero title="Get in touch" subtitle="Questions about a product, an order or a warranty? Our team is happy to help." crumbs={[{ label: "Contact" }]} />

      <div className="container mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
        <ContactCards store={store} />

        <div className="mt-10 grid gap-8 lg:grid-cols-5">
          <ContactForm email={store.email} />

          <div className="space-y-6 lg:col-span-2">
            {store.address && (
              <Reveal variant="zoom" className="overflow-hidden rounded-3xl border border-gray-200/70 bg-surface shadow-sm shadow-gray-900/[0.03]">
                <iframe
                  title="Store location map"
                  src={`https://www.google.com/maps?q=${encodeURIComponent(store.address)}&output=embed`}
                  className="h-64 w-full"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </Reveal>
            )}
            <ContactFaq />
          </div>
        </div>
      </div>
    </div>
  );
}
