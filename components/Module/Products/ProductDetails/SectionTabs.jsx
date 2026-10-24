"use client";

import { useEffect, useState } from "react";

export const sections = [
  { id: "overview", label: "Overview" },
  { id: "specifications", label: "Specifications" },
  { id: "reviews", label: "Reviews" },
  { id: "delivery", label: "Delivery & Returns" },
];

export const jumpTo = (sectionId) => document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });

// sticky tab bar that highlights the section in view
export default function SectionTabs({ reviewCount }) {
  const [activeSection, setActiveSection] = useState("overview");
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => entry.isIntersecting && setActiveSection(entry.target.id)),
      { rootMargin: "-45% 0px -50% 0px" }
    );
    sections.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <div className="sticky top-16 z-30 mt-10 border-y border-gray-100 bg-white/95 backdrop-blur lg:top-[8.5rem]">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <nav className="no-scrollbar -mb-px flex gap-6 overflow-x-auto" aria-label="Product sections">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => jumpTo(section.id)}
              className={`shrink-0 border-b-2 py-4 text-sm font-semibold transition ${
                activeSection === section.id ? "border-brand text-gray-900" : "border-transparent text-gray-500 hover:text-gray-800"
              }`}
            >
              {section.label}
              {section.id === "reviews" && <span className="ml-1.5 rounded-full bg-gray-100 px-2 py-0.5 text-xs">{reviewCount}</span>}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}
