import { Ban, Check } from "lucide-react";
import { cx } from "@/lib/format";
import { ORDER_STEPS, STEP_LABEL } from "./orderStatus";

// Placed → Accepted → Shipped → Delivered, with the date each step was reached
export default function OrderProgress({ status = "pending", history = [] }) {
  if (status === "cancelled") {
    return (
      <div className="flex items-center gap-3 rounded-xl bg-gray-50 px-4 py-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-200 text-gray-600">
          <Ban className="h-4 w-4" />
        </span>
        <p className="text-sm font-medium text-gray-700">This order was cancelled.</p>
      </div>
    );
  }

  const current = ORDER_STEPS.indexOf(status);
  const reachedAt = (step) => [...history].reverse().find((h) => h.status === step)?.at;

  return (
    <ol className="flex items-start">
      {ORDER_STEPS.map((step, i) => {
        const done = i <= current;
        const at = done && reachedAt(step);
        return (
          <li key={step} className={cx("flex items-start", i < ORDER_STEPS.length - 1 && "flex-1")}>
            <div className="flex w-16 flex-col items-center gap-1.5 text-center sm:w-20">
              <span className={cx("flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold transition", done ? "bg-brand text-white" : "bg-gray-100 text-gray-400", i === current && "ring-4 ring-brand/15")}>
                {done ? <Check className="h-4 w-4" /> : i + 1}
              </span>
              <span className={cx("text-xs font-semibold", done ? "text-gray-900" : "text-gray-400")}>{STEP_LABEL[step]}</span>
              {at && (
                <span className="hidden text-[11px] text-gray-500 sm:block">
                  {new Date(at).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                </span>
              )}
            </div>
            {i < ORDER_STEPS.length - 1 && <span className={cx("mt-[18px] h-0.5 flex-1 rounded-full", i < current ? "bg-brand" : "bg-gray-200")} />}
          </li>
        );
      })}
    </ol>
  );
}
