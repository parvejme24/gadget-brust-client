import { cx, inputClass } from "@/components/Dashboard/Kit";
import CustomerPicker from "@/components/Dashboard/Customers/CustomerPicker";

export default function PosCustomer({ mode, onModeChange, walkin, onWalkinChange, customer, onCustomerChange }) {
  return (
    <div>
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-gray-900">Customer</p>
        <div className="flex rounded-lg bg-gray-100 p-0.5 text-xs font-semibold">
          {[
            ["walkin", "Walk-in"],
            ["registered", "Registered"],
          ].map(([key, label]) => (
            <button key={key} type="button" onClick={() => onModeChange(key)} className={cx("rounded-md px-2.5 py-1 transition", mode === key ? "bg-surface text-gray-900 shadow-sm" : "text-gray-500")}>
              {label}
            </button>
          ))}
        </div>
      </div>
      {mode === "walkin" ? (
        <div className="mt-2 grid grid-cols-2 gap-2">
          <input value={walkin.name} onChange={(e) => onWalkinChange({ ...walkin, name: e.target.value })} placeholder="Name (optional)" aria-label="Customer name" className={inputClass} />
          <input value={walkin.phone} onChange={(e) => onWalkinChange({ ...walkin, phone: e.target.value })} placeholder="Phone" aria-label="Customer phone" inputMode="tel" className={inputClass} />
        </div>
      ) : (
        <div className="mt-2">
          <CustomerPicker value={customer} onChange={onCustomerChange} />
        </div>
      )}
    </div>
  );
}
