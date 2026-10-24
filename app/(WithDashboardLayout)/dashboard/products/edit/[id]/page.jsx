"use client";

import { useParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import ProductForm, { productToForm } from "@/components/Dashboard/Products/ProductForm";
import { useAdminProduct } from "@/lib/hooks/useAdmin";
import { ErrorState, PageHeader } from "@/components/Dashboard/Kit";

export default function EditProductPage() {
  const { id } = useParams();
  const { data: product, isLoading, isError, error, refetch } = useAdminProduct(id);

  return (
    <>
      <PageHeader
        title={product ? `Edit: ${product.title}` : "Edit product"}
        description="Update details, pricing, stock and visibility."
        back={{ href: "/dashboard/products", label: "Products" }}
      />
      {isLoading ? (
        <div className="flex justify-center py-20"><Loader2 className="h-6 w-6 animate-spin text-gray-400" /></div>
      ) : isError || !product ? (
        <ErrorState error={error} onRetry={refetch} />
      ) : (
        <ProductForm key={product._id} productId={product._id} initial={productToForm(product)} />
      )}
    </>
  );
}
