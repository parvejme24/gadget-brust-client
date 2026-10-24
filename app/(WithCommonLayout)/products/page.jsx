import { Suspense } from "react";
import ProductBrowser from "@/components/Module/Products/ProductBrowser/ProductBrowser";

export const metadata = {
  title: "Shop Gadgets | Gadget Brust",
  description: "Browse phones, laptops, audio, gaming gear and more at Gadget Brust.",
};

// useSearchParams in ProductBrowser needs a Suspense boundary
export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50/60" />}>
      <ProductBrowser />
    </Suspense>
  );
}
