"use client";

import Link from "next/link";
import { Heart, ShoppingCart, Trash2 } from "lucide-react";
import { useShopCart, useShopWishlist } from "@/lib/hooks/useShop";
import { Button, EmptyState, PageHeader, buttonClass, formatTaka } from "@/components/Dashboard/Kit";

export default function MyWishlistPage() {
  const wishlist = useShopWishlist();
  const cart = useShopCart();

  const moveToCart = (item) => {
    cart.add({ ...item, image: { url: item.image }, discountPrice: item.finalPrice }, 1, { openDrawer: false });
    wishlist.remove(item._id);
  };

  return (
    <>
      <PageHeader
        title="Wishlist"
        description={`${wishlist.count} saved item${wishlist.count === 1 ? "" : "s"} on this device`}
        actions={wishlist.count > 0 && <Button variant="secondary" onClick={wishlist.clear}>Clear all</Button>}
      />
      {wishlist.count === 0 ? (
        <EmptyState icon={Heart} title="Your wishlist is empty" text="Tap the heart on any product to save it for later." action={<Link href="/products" className={buttonClass("brand")}>Browse products</Link>} />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {wishlist.items.map((item) => (
            <article key={item._id} className="flex flex-col overflow-hidden rounded-2xl border border-gray-200/70 bg-surface shadow-sm shadow-gray-900/[0.02]">
              <Link href={`/products/${item._id}`} className="flex h-44 items-center justify-center bg-gray-50">
                {item.image && <img src={item.image} alt="" className="h-full w-full object-contain p-4" />}
              </Link>
              <div className="flex flex-1 flex-col p-4">
                {item.brandName && <p className="text-xs font-medium text-gray-500">{item.brandName}</p>}
                <Link href={`/products/${item._id}`} className="mt-0.5 line-clamp-2 text-sm font-semibold text-gray-900 hover:underline">{item.title}</Link>
                <p className="mt-2 text-base font-bold text-gray-900">
                  {formatTaka(item.finalPrice)}
                  {item.price > item.finalPrice && <span className="ml-2 text-xs font-medium text-gray-400 line-through">{formatTaka(item.price)}</span>}
                </p>
                <div className="mt-auto flex gap-2 pt-4">
                  <Button className="flex-1 justify-center" variant="brand" size="sm" disabled={item.stock === 0} onClick={() => moveToCart(item)}>
                    <ShoppingCart className="h-3.5 w-3.5" /> {item.stock === 0 ? "Out of stock" : "Move to cart"}
                  </Button>
                  <Button variant="secondary" size="icon" aria-label={`Remove ${item.title}`} onClick={() => wishlist.remove(item._id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </>
  );
}
