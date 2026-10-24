"use client";

import ProductForm from "@/components/Dashboard/Products/ProductForm";
import { PageHeader } from "@/components/Dashboard/Kit";

export default function AddProductPage() {
  return (
    <>
      <PageHeader title="Add product" description="Create a new product for your store." back={{ href: "/dashboard/products", label: "Products" }} />
      <ProductForm />
    </>
  );
}
