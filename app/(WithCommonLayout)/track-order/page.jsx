import { Suspense } from "react";
import TrackOrder from "@/components/Module/Checkout/TrackOrder";

export const metadata = { title: "Track your order | Gadget Brust" };

export default function TrackOrderPage() {
  return (
    <Suspense fallback={null}>
      <TrackOrder />
    </Suspense>
  );
}
