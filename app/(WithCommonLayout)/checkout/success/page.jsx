import { Suspense } from "react";
import OrderPlaced from "@/components/Module/Checkout/OrderPlaced";

export const metadata = { title: "Order placed | Gadget Brust" };

export default function OrderPlacedPage() {
  return (
    <Suspense fallback={null}>
      <OrderPlaced />
    </Suspense>
  );
}
