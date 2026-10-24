import { TicketPercent, X } from "lucide-react";
import { Button, Field, Toggle, cx, formatTaka, inputClass } from "@/components/Dashboard/Kit";

// coupon code, extra discount and VAT
export default function PosDiscounts({ sale }) {
  const { coupon, couponInput, setCouponInput, couponChecking, applyCoupon, removeCoupon, cart, manualDiscount, setManualDiscount, includeVat, setIncludeVat, taxRate } = sale;
  return (
    <div className="space-y-3">
      {coupon ? (
        <div className="flex items-center gap-3 rounded-xl bg-emerald-50 px-3 py-2.5 ring-1 ring-emerald-200">
          <TicketPercent className="h-4 w-4 text-emerald-700" />
          <div className="min-w-0 flex-1">
            <p className="font-mono text-sm font-bold text-emerald-900">{coupon.code}</p>
            <p className="text-xs text-emerald-800">{coupon.summary} · −{formatTaka(coupon.discount)}</p>
          </div>
          <button type="button" onClick={removeCoupon} aria-label="Remove coupon" className="rounded-md p-1 text-emerald-700 hover:bg-emerald-100"><X className="h-4 w-4" /></button>
        </div>
      ) : (
        <div className="flex gap-2">
          <input value={couponInput} onChange={(e) => setCouponInput(e.target.value.toUpperCase())} onKeyDown={(e) => e.key === "Enter" && applyCoupon()} placeholder="Coupon code" aria-label="Coupon code" className={cx(inputClass, "font-mono")} />
          <Button type="button" variant="secondary" loading={couponChecking} disabled={!couponInput.trim() || !cart.length} onClick={() => applyCoupon()}>Apply</Button>
        </div>
      )}
      <div className="grid grid-cols-2 gap-2">
        <Field label="Extra discount (৳)" htmlFor="manual">
          <input id="manual" type="number" min="0" value={manualDiscount} onChange={(e) => setManualDiscount(e.target.value)} placeholder="0" className={inputClass} />
        </Field>
        <label className="flex items-end justify-between gap-2 rounded-xl bg-gray-50 px-3 py-2">
          <span className="text-[13px] font-medium text-gray-700">Add VAT ({taxRate}%)</span>
          <Toggle checked={includeVat} onChange={setIncludeVat} label="Add VAT" />
        </label>
      </div>
    </div>
  );
}
