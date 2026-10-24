import { ReceiptText } from "lucide-react";
import { Button, cx, formatTaka } from "@/components/Dashboard/Kit";

export default function PosTotals({ sale }) {
  const { subtotal, couponDiscount, manual, vat, total, method, received, change, cart, checkout } = sale;
  const short = method === "cash" && received !== "" && change < 0;
  return (
    <div className="border-t border-gray-200/70 bg-gray-50/80 p-5">
      <dl className="space-y-1.5 text-sm">
        <div className="flex justify-between"><dt className="text-gray-500">Subtotal</dt><dd className="font-medium text-gray-900">{formatTaka(subtotal)}</dd></div>
        {couponDiscount > 0 && <div className="flex justify-between"><dt className="text-gray-500">Coupon</dt><dd className="font-medium text-emerald-700">−{formatTaka(couponDiscount)}</dd></div>}
        {manual > 0 && <div className="flex justify-between"><dt className="text-gray-500">Discount</dt><dd className="font-medium text-emerald-700">−{formatTaka(manual)}</dd></div>}
        {vat > 0 && <div className="flex justify-between"><dt className="text-gray-500">VAT</dt><dd className="font-medium text-gray-900">{formatTaka(vat)}</dd></div>}
        <div className="flex items-baseline justify-between pt-1.5"><dt className="font-semibold text-gray-900">Total</dt><dd className="text-2xl font-extrabold text-gray-900">{formatTaka(total)}</dd></div>
        {method === "cash" && received !== "" && (
          <div className="flex justify-between">
            <dt className="text-gray-500">Change</dt>
            <dd className={cx("font-bold", change < 0 ? "text-red-600" : "text-gray-900")}>{change < 0 ? `${formatTaka(-change)} short` : formatTaka(change)}</dd>
          </div>
        )}
      </dl>
      <Button className="mt-4 h-12 w-full justify-center text-base" variant="brand" loading={sale.sale.isPending} disabled={!cart.length || short} onClick={checkout}>
        <ReceiptText className="h-5 w-5" /> Complete sale · {formatTaka(total)}
      </Button>
    </div>
  );
}
