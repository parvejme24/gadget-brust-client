"use client";

import { useState } from "react";
import { Check, ChevronDown, Search } from "lucide-react";

export const pricePresets = [
  { label: "Under ৳5,000", min: "", max: "5000" },
  { label: "৳5,000 - ৳20,000", min: "5000", max: "20000" },
  { label: "৳20,000 - ৳50,000", min: "20000", max: "50000" },
  { label: "৳50,000 - ৳1,00,000", min: "50000", max: "100000" },
  { label: "Above ৳1,00,000", min: "100000", max: "" },
];

function FilterGroup({ title, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-gray-100 py-5 last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between text-sm font-semibold text-gray-900"
        aria-expanded={open}
      >
        {title}
        <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && <div className="mt-3">{children}</div>}
    </div>
  );
}

function OptionRow({ active, onClick, label, count }) {
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center gap-2.5 rounded-lg px-2 py-1.5 text-left text-sm transition-colors ${
        active ? "bg-brand-light font-semibold text-brand-dark" : "text-gray-600 hover:bg-gray-50"
      }`}
    >
      <span
        className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border ${
          active ? "border-brand bg-brand text-white" : "border-gray-300"
        }`}
      >
        {active && <Check className="h-3 w-3" strokeWidth={3} />}
      </span>
      <span className="flex-1 truncate">{label}</span>
      {count !== undefined && <span className="text-xs text-gray-400">{count}</span>}
    </button>
  );
}

export default function FilterPanel({ filters, setFilters, categories, brands }) {
  const [brandQuery, setBrandQuery] = useState("");
  const [priceDraft, setPriceDraft] = useState({ min: filters.minPrice, max: filters.maxPrice });
  const selectedCategory = categories.find((c) => c._id === filters.category);
  const visibleBrands = brands.filter((b) => b.brandName.toLowerCase().includes(brandQuery.toLowerCase()));

  const applyPrice = (min, max) => {
    setPriceDraft({ min, max });
    setFilters({ minPrice: min, maxPrice: max });
  };

  return (
    <div>
      <FilterGroup title="Category">
        <div className="max-h-72 space-y-0.5 overflow-y-auto pr-1">
          <OptionRow active={!filters.category} onClick={() => setFilters({ category: "", subcategory: "" })} label="All categories" />
          {categories.map((category) => (
            <OptionRow
              key={category._id}
              active={filters.category === category._id}
              onClick={() => setFilters({ category: category._id, subcategory: "" })}
              label={category.categoryName}
            />
          ))}
        </div>
      </FilterGroup>

      {selectedCategory?.subcategories?.length > 0 && (
        <FilterGroup title={`${selectedCategory.categoryName} type`}>
          <div className="flex flex-wrap gap-2">
            {selectedCategory.subcategories.map((sub) => {
              const active = filters.subcategory === sub;
              return (
                <button
                  key={sub}
                  onClick={() => setFilters({ subcategory: active ? "" : sub })}
                  className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                    active ? "border-brand bg-brand text-white" : "border-gray-200 text-gray-600 hover:border-brand hover:text-brand"
                  }`}
                >
                  {sub}
                </button>
              );
            })}
          </div>
        </FilterGroup>
      )}

      <FilterGroup title="Price">
        <div className="space-y-0.5">
          {pricePresets.map((preset) => (
            <OptionRow
              key={preset.label}
              active={filters.minPrice === preset.min && filters.maxPrice === preset.max}
              onClick={() =>
                filters.minPrice === preset.min && filters.maxPrice === preset.max
                  ? applyPrice("", "")
                  : applyPrice(preset.min, preset.max)
              }
              label={preset.label}
            />
          ))}
        </div>
        <form
          className="mt-3 flex items-center gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            applyPrice(priceDraft.min, priceDraft.max);
          }}
        >
          <input
            type="number"
            min="0"
            inputMode="numeric"
            placeholder="Min"
            value={priceDraft.min}
            onChange={(e) => setPriceDraft({ ...priceDraft, min: e.target.value })}
            className="h-9 w-full min-w-0 rounded-lg border border-gray-200 px-2.5 text-sm outline-none focus:border-brand"
          />
          <span className="text-gray-400">-</span>
          <input
            type="number"
            min="0"
            inputMode="numeric"
            placeholder="Max"
            value={priceDraft.max}
            onChange={(e) => setPriceDraft({ ...priceDraft, max: e.target.value })}
            className="h-9 w-full min-w-0 rounded-lg border border-gray-200 px-2.5 text-sm outline-none focus:border-brand"
          />
          <button type="submit" className="h-9 shrink-0 rounded-lg bg-gray-900 px-3 text-sm font-semibold text-white hover:bg-gray-700">
            Go
          </button>
        </form>
      </FilterGroup>

      <FilterGroup title="Brand">
        <div className="relative mb-2">
          <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
          <input
            value={brandQuery}
            onChange={(e) => setBrandQuery(e.target.value)}
            placeholder="Search brand"
            className="h-9 w-full rounded-lg border border-gray-200 pl-8 pr-3 text-sm outline-none focus:border-brand"
          />
        </div>
        <div className="max-h-64 space-y-0.5 overflow-y-auto pr-1">
          <OptionRow active={!filters.brand} onClick={() => setFilters({ brand: "" })} label="All brands" />
          {visibleBrands.map((brand) => (
            <OptionRow
              key={brand._id}
              active={filters.brand === brand._id}
              onClick={() => setFilters({ brand: brand._id })}
              label={brand.brandName}
            />
          ))}
        </div>
      </FilterGroup>

      <FilterGroup title="Availability">
        <label className="flex cursor-pointer items-center justify-between rounded-lg px-2 py-1.5 text-sm text-gray-600">
          In stock only
          <input
            type="checkbox"
            checked={filters.inStock === "true"}
            onChange={(e) => setFilters({ inStock: e.target.checked ? "true" : "" })}
            className="h-4 w-4 accent-brand"
          />
        </label>
      </FilterGroup>
    </div>
  );
}
