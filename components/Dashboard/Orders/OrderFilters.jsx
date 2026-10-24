import { SearchInput, paymentLabels } from "@/components/Dashboard/Kit";
import { DropdownSelect } from "@/components/ui/dropdown-select";
import { DateRangePicker } from "@/components/ui/date-range-picker";

export const SOURCES = [
  { value: "", label: "All sources" },
  { value: "account", label: "Customer accounts" },
  { value: "guest", label: "Guest checkout" },
  { value: "pos", label: "Counter (POS)" },
];

// filters: { search, source, payment, method, courier, from, to }
export default function OrderFilters({ filters, onChange, couriers = [] }) {
  const set = (key) => (value) => onChange({ ...filters, [key]: value });
  return (
    <div className="grid gap-3 border-b border-gray-100 p-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6">
      <SearchInput value={filters.search} onChange={set("search")} placeholder="Order #, customer, phone or tracking…" className="sm:col-span-2 lg:col-span-3 2xl:col-span-1" />
      <DropdownSelect label="Order source" value={filters.source} onChange={set("source")} options={SOURCES} />
      <DropdownSelect label="Payment status" value={filters.payment} onChange={set("payment")} options={[{ value: "", label: "Any payment status" }, { value: "completed", label: "Paid" }, { value: "pending", label: "Unpaid" }, { value: "failed", label: "Failed" }]} />
      <DropdownSelect label="Payment method" value={filters.method} onChange={set("method")} options={[{ value: "", label: "Any method" }, ...Object.entries(paymentLabels).map(([value, label]) => ({ value, label }))]} />
      <DropdownSelect label="Courier" value={filters.courier} onChange={set("courier")} options={[{ value: "", label: "Any courier" }, ...couriers.map((c) => ({ value: c._id, label: c.name }))]} />
      <DateRangePicker
        label="Order date range"
        placeholder="Any date"
        align="end"
        value={{ from: filters.from, to: filters.to }}
        onChange={(range) => onChange({ ...filters, from: range.from, to: range.to })}
      />
    </div>
  );
}
