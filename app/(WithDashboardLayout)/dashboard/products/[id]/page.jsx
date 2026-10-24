"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Banknote, ExternalLink, Loader2, Package, Pencil, ShoppingBag, Star, Trash2 } from "lucide-react";
import { adminService } from "@/lib/services/adminService";
import { storefrontService } from "@/lib/services/storefrontService";
import { useAdminMutation, useAdminOrders, useAdminProduct } from "@/lib/hooks/useAdmin";
import {
  ConfirmDialog,
  DataTable,
  EmptyState,
  ErrorState,
  PageHeader,
  Panel,
  StatCard,
  StatusPill,
  buttonClass,
  formatDate,
  formatTaka,
  stockStatus,
  customerName,
} from "@/components/Dashboard/Kit";

export default function AdminProductDetails() {
  const { id } = useParams();
  const router = useRouter();
  const [confirm, setConfirm] = useState(null);
  const { data: product, isLoading, isError, error, refetch } = useAdminProduct(id);
  const { data: orders = [] } = useAdminOrders();
  const { data: reviewsData, refetch: refetchReviews } = useQuery({
    queryKey: ["reviews", "product", id],
    queryFn: () => storefrontService.productReviews(id),
    enabled: !!id,
  });
  const reviews = reviewsData?.data || [];

  const sales = useMemo(() => {
    const lines = orders
      .filter((o) => o.orderStatus !== "cancelled")
      .flatMap((o) => (o.items || []).filter((it) => it.product === id || it.product?._id === id).map((it) => ({ ...it, order: o })));
    return {
      units: lines.reduce((s, l) => s + l.qty, 0),
      revenue: lines.reduce((s, l) => s + l.qty * l.price, 0),
      orders: [...new Map(lines.map((l) => [l.order._id, l.order])).values()],
    };
  }, [orders, id]);

  const deleteProduct = useAdminMutation(() => adminService.deleteProduct(id), {
    success: "Product deleted",
    onSuccess: () => router.push("/dashboard/products"),
  });
  const deleteReview = useAdminMutation((reviewId) => adminService.deleteReview(reviewId), {
    success: "Review removed",
    onSuccess: () => {
      setConfirm(null);
      refetchReviews();
    },
  });

  if (isLoading) return <div className="flex justify-center py-20"><Loader2 className="h-6 w-6 animate-spin text-gray-400" /></div>;
  if (isError || !product) return <ErrorState error={error} onRetry={refetch} />;

  const avg = reviews.length ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : Number(product.star) || 0;

  return (
    <>
      <PageHeader
        title={product.title}
        description={`${product.category?.categoryName || ""} · ${product.subcategory} · ${product.brand?.brandName || ""}`}
        back={{ href: "/dashboard/products", label: "Products" }}
        actions={
          <>
            <Link href={`/products/${id}`} target="_blank" className={buttonClass("secondary")}>
              <ExternalLink className="h-4 w-4" /> View in store
            </Link>
            <button onClick={() => setConfirm({ type: "product" })} className={buttonClass("secondary", "md", "text-red-600")}>
              <Trash2 className="h-4 w-4" /> Delete
            </button>
            <Link href={`/dashboard/products/edit/${id}`} className={buttonClass("primary")}>
              <Pencil className="h-4 w-4" /> Edit product
            </Link>
          </>
        }
      />

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="space-y-6">
          <Panel>
            <div className="flex aspect-square items-center justify-center overflow-hidden rounded-xl bg-gray-50">
              {product.image?.url ? <img src={product.image.url} alt={product.title} className="h-full w-full object-contain p-6" /> : <Package className="h-14 w-14 text-gray-300" />}
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              <StatusPill status={stockStatus(product.stock)} label={product.stock === 0 ? "Out of stock" : `${product.stock} in stock`} />
              {product.isSlider && <StatusPill status="active" label="In slider" />}
              <StatusPill status="processing" label={product.remark.charAt(0).toUpperCase() + product.remark.slice(1)} />
            </div>
            <p className="mt-4 text-sm leading-6 text-gray-600">{product.shortDescription}</p>
          </Panel>

          <Panel title="Specifications" bodyClassName="">
            <dl className="divide-y divide-gray-100 text-sm">
              {(product.keyFeatures || []).map((f) => (
                <div key={f.key} className="flex justify-between gap-4 px-5 py-3">
                  <dt className="text-gray-500">{f.key}</dt>
                  <dd className="text-right font-medium text-gray-900">{f.values?.join(", ")}</dd>
                </div>
              ))}
              {!product.keyFeatures?.length && <p className="px-5 py-6 text-center text-gray-500">No specifications added.</p>}
            </dl>
          </Panel>
        </div>

        <div className="space-y-6 xl:col-span-2">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard label="Price" value={formatTaka(product.discountPrice || product.price)} hint={product.discount > 0 ? `${product.discount}% off ${formatTaka(product.price)}` : "No discount"} />
            <StatCard label="Units sold" value={sales.units} hint={`${sales.orders.length} orders`} icon={ShoppingBag} tone="sky" />
            <StatCard label="Revenue" value={formatTaka(sales.revenue)} icon={Banknote} tone="brand" />
            <StatCard label="Rating" value={avg.toFixed(1)} hint={`${reviews.length} reviews`} icon={Star} tone="amber" />
          </div>

          <Panel title="Orders with this product" bodyClassName="">
            <DataTable
              rows={sales.orders.slice(0, 8)}
              onRowClick={(o) => router.push(`/dashboard/orders/${o._id}`)}
              empty={<EmptyState icon={ShoppingBag} title="No orders yet" className="py-8" />}
              columns={[
                { key: "inv", header: "Order", render: (o) => <span className="font-semibold text-gray-900">{o.invoiceNumber}</span> },
                { key: "customer", header: "Customer", hideBelow: "sm", render: (o) => customerName(o) },
                { key: "date", header: "Date", hideBelow: "md", render: (o) => formatDate(o.orderDate) },
                { key: "status", header: "Status", render: (o) => <StatusPill status={o.orderStatus} /> },
              ]}
            />
          </Panel>

          <Panel title="Reviews" description="Remove reviews that are spam or abusive.">
            {reviews.length === 0 ? (
              <EmptyState icon={Star} title="No reviews yet" className="py-8" />
            ) : (
              <ul className="divide-y divide-gray-100">
                {reviews.map((r) => (
                  <li key={r._id} className="flex gap-4 py-3.5 first:pt-0 last:pb-0">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 text-sm">
                        <span className="flex items-center gap-1 font-semibold text-gray-900">
                          <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" /> {r.rating}
                        </span>
                        <span className="truncate text-gray-500">{r.customerEmail} · {formatDate(r.createdAt)}</span>
                      </div>
                      <p className="mt-1 text-sm text-gray-700">{r.reviewText}</p>
                    </div>
                    <button onClick={() => setConfirm({ type: "review", review: r })} aria-label="Delete review" className={buttonClass("danger-ghost", "icon")}>
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </Panel>
        </div>
      </div>

      <ConfirmDialog
        open={!!confirm}
        onClose={() => setConfirm(null)}
        loading={deleteProduct.isPending || deleteReview.isPending}
        onConfirm={() => (confirm?.type === "product" ? deleteProduct.mutate() : deleteReview.mutate(confirm.review._id))}
        title={confirm?.type === "product" ? "Delete product?" : "Delete review?"}
        message={confirm?.type === "product" ? `"${product.title}" will be removed from your store. This can't be undone.` : "This review will be removed from the product page."}
      />
    </>
  );
}
