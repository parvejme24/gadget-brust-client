import { Ban, Check, PackageCheck, Printer, RotateCcw, Truck } from "lucide-react";
import { Button, buttonClass } from "@/components/Dashboard/Kit";

// the next step in the workflow is the primary button: accept → ship → deliver
export default function OrderActions({ order, onStatus, onShip }) {
  const status = order.orderStatus || "pending";
  const pos = order.source === "pos";

  return (
    <>
      <button onClick={() => window.print()} className={buttonClass("secondary")}>
        <Printer className="h-4 w-4" /> <span className="hidden sm:inline">Print invoice</span>
      </button>
      {!pos && status === "cancelled" && (
        <Button variant="secondary" onClick={() => onStatus("pending")}>
          <RotateCcw className="h-4 w-4" /> Reopen
        </Button>
      )}
      {!pos && !["cancelled", "delivered"].includes(status) && (
        <button onClick={() => onStatus("cancelled")} className={buttonClass("secondary", "md", "text-red-600")}>
          <Ban className="h-4 w-4" /> Cancel
        </button>
      )}
      {!pos && status === "pending" && (
        <Button onClick={() => onStatus("processing")}>
          <Check className="h-4 w-4" /> Accept order
        </Button>
      )}
      {!pos && status === "processing" && (
        <Button onClick={onShip}>
          <Truck className="h-4 w-4" /> Ship with courier
        </Button>
      )}
      {!pos && status === "shipped" && (
        <Button onClick={() => onStatus("delivered")}>
          <PackageCheck className="h-4 w-4" /> Mark delivered
        </Button>
      )}
    </>
  );
}
