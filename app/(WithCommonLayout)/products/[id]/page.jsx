"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ChevronRight, PackageX } from "lucide-react";
import { useProductById, useProductsByCategory } from "@/lib/hooks/useStorefront";
import { useReviewsByProduct } from "@/lib/hooks/useStorefront";
import { useShopCart, useShopWishlist } from "@/lib/hooks/useShop";
import { getFinalPrice } from "@/lib/format";
import ProductTile from "@/components/Module/Home/ProductTile/ProductTile";
import SectionHeader from "@/components/Module/Home/SectionHeader/SectionHeader";
import DetailsSkeleton from "@/components/Module/Products/ProductDetails/DetailsSkeleton";
import ProductGallery from "@/components/Module/Products/ProductDetails/ProductGallery";
import BuyBox from "@/components/Module/Products/ProductDetails/BuyBox";
import SectionTabs, { jumpTo } from "@/components/Module/Products/ProductDetails/SectionTabs";
import DetailSections from "@/components/Module/Products/ProductDetails/DetailSections";
import MiniBuyCard from "@/components/Module/Products/ProductDetails/MiniBuyCard";
import MobileBuyBar from "@/components/Module/Products/ProductDetails/MobileBuyBar";

export default function ProductDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const cart = useShopCart();
  const wishlist = useShopWishlist();
  const [qty, setQty] = useState(1);

  const { data, isLoading, isError } = useProductById(id);
  const product = data?.data;
  const categoryId = typeof product?.category === "object" ? product.category?._id : product?.category;
  const { data: relatedData } = useProductsByCategory(categoryId);
  const { data: reviewsData } = useReviewsByProduct(id);

  if (isLoading) return <DetailsSkeleton />;

  if (isError || !product) {
    return (
      <div className="container mx-auto flex max-w-7xl flex-col items-center px-4 py-24 text-center">
        <PackageX className="h-16 w-16 text-gray-300" />
        <h1 className="mt-4 text-2xl font-bold text-gray-900">Product not found</h1>
        <p className="mt-2 text-gray-500">It may have been removed or the link is incorrect.</p>
        <Link href="/products" className="mt-6 rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white hover:bg-brand-dark">
          Browse products
        </Link>
      </div>
    );
  }

  const category = typeof product.category === "object" ? product.category : null;
  const brand = typeof product.brand === "object" ? product.brand : null;
  const finalPrice = getFinalPrice(product);
  const hasDiscount = finalPrice < product.price;
  const reviews = reviewsData?.data || [];
  const avgRating = reviews.length ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : Number(product.star) || 0;
  const related = (relatedData?.data || []).filter((p) => p._id !== product._id).slice(0, 5);
  const inWishlist = wishlist.isWishlisted(product._id);
  const inCart = cart.isInCart(product._id);

  const addToCart = () => cart.add(product, qty);
  // straight to checkout (works for guests too)
  const buyNow = () => {
    cart.add(product, qty, { openDrawer: false, silent: true });
    router.push("/checkout");
  };
  const buyProps = { product, finalPrice, hasDiscount, onAddToCart: addToCart, onBuyNow: buyNow };

  return (
    <div className="pb-24 lg:pb-0">
      <div className="container mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        {/* breadcrumb */}
        <nav className="flex flex-wrap items-center gap-1.5 text-xs text-gray-500" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-brand">Home</Link>
          <ChevronRight className="h-3 w-3" />
          <Link href="/products" className="hover:text-brand">Products</Link>
          {category && (
            <>
              <ChevronRight className="h-3 w-3" />
              <Link href={`/products?category=${category._id}`} className="hover:text-brand">{category.categoryName}</Link>
              <ChevronRight className="h-3 w-3" />
              <Link href={`/products?category=${category._id}&subcategory=${encodeURIComponent(product.subcategory)}`} className="hover:text-brand">
                {product.subcategory}
              </Link>
            </>
          )}
        </nav>

        <div className="mt-6 grid gap-8 lg:grid-cols-12 lg:gap-10">
          <ProductGallery product={product} hasDiscount={hasDiscount} inWishlist={inWishlist} onToggleWishlist={() => wishlist.toggle(product)} />
          <BuyBox
            {...buyProps}
            brand={brand}
            category={category}
            avgRating={avgRating}
            reviewCount={reviews.length}
            qty={qty}
            onQty={setQty}
            inCart={inCart}
            onJump={jumpTo}
          />
        </div>
      </div>

      <SectionTabs reviewCount={reviews.length} />

      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="min-w-0 lg:col-span-8">
            <DetailSections product={product} brand={brand} category={category} reviews={reviews} avgRating={avgRating} />
          </div>
          <MiniBuyCard {...buyProps} />
        </div>

        {related.length > 0 && (
          <div className="py-12">
            <SectionHeader
              eyebrow="You may also like"
              title={`More in ${category?.categoryName || "this category"}`}
              href={categoryId ? `/products?category=${categoryId}` : "/products"}
            />
            <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-5">
              {related.map((item, i) => <ProductTile key={item._id} product={item} index={i} />)}
            </div>
          </div>
        )}
      </div>

      <MobileBuyBar {...buyProps} />
    </div>
  );
}
