"use client";

import Link from "next/link";
import { ArrowRight, Heart, PackageCheck, PackageSearch, ShoppingBag, Star, Truck, Wallet } from "lucide-react";
import { useAccountSummary } from "@/lib/hooks/useAccount";
import { useShopWishlist } from "@/lib/hooks/useShop";
import { EmptyState, Panel, StatCard, buttonClass, formatTaka } from "@/components/Dashboard/Kit";
import OverviewHeader from "@/components/Dashboard/Overview/OverviewHeader";
import MyOrderCard from "./MyOrderCard";

// customer: their orders, spend, wishlist and shortcuts
export default function CustomerOverview({ user }) {
  const { data, isLoading } = useAccountSummary();
  const wishlist = useShopWishlist();
  const orders = data?.recentOrders || [];

  return (
    <div className="space-y-6">
      <OverviewHeader user={user} description="Your orders, wishlist and reviews in one place." />

      <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        <StatCard loading={isLoading} label="Orders" value={data?.orders?.total ?? "—"} hint={`${data?.orders?.delivered || 0} delivered`} icon={ShoppingBag} tone="brand" href="/dashboard/my-orders" />
        <StatCard loading={isLoading} label="In progress" value={data?.orders?.active ?? "—"} hint="Placed, accepted or shipped" icon={Truck} tone="sky" href="/dashboard/my-orders?status=active" />
        <StatCard loading={isLoading} label="Total spent" value={formatTaka(data?.spent)} hint="Excluding cancelled orders" icon={Wallet} tone="violet" />
        <StatCard label="Wishlist" value={wishlist.count} hint={`${data?.reviews || 0} reviews written`} icon={Heart} tone="red" href="/dashboard/my-wishlist" />
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <Panel
          className="xl:col-span-2"
          title="Recent orders"
          action={
            <Link href="/dashboard/my-orders" className="inline-flex items-center gap-1 text-xs font-semibold text-gray-500 hover:text-gray-900">
              All orders <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          }
        >
          {isLoading ? (
            <div className="space-y-3">{[0, 1].map((i) => <div key={i} className="h-36 animate-pulse rounded-2xl bg-gray-100" />)}</div>
          ) : orders.length === 0 ? (
            <EmptyState
              icon={PackageCheck}
              title="No orders yet"
              text="When you place an order it shows up here, with live delivery status."
              action={<Link href="/products" className={buttonClass("brand")}>Start shopping</Link>}
            />
          ) : (
            <div className="grid gap-3 lg:grid-cols-2">
              {orders.slice(0, 4).map((o) => <MyOrderCard key={o._id} order={o} />)}
            </div>
          )}
        </Panel>

        <div className="space-y-6">
          <Panel title="Need help with an order?">
            <div className="space-y-2">
              <Link href="/track-order" className="flex items-center gap-3 rounded-xl border border-gray-100 p-3 text-sm font-medium text-gray-700 hover:bg-gray-50">
                <PackageSearch className="h-5 w-5 text-brand-dark" /> Track an order by number
              </Link>
              <Link href="/dashboard/my-reviews" className="flex items-center gap-3 rounded-xl border border-gray-100 p-3 text-sm font-medium text-gray-700 hover:bg-gray-50">
                <Star className="h-5 w-5 text-amber-500" /> Your reviews
              </Link>
              <Link href="/contact" className="flex items-center gap-3 rounded-xl border border-gray-100 p-3 text-sm font-medium text-gray-700 hover:bg-gray-50">
                <ShoppingBag className="h-5 w-5 text-sky-600" /> Contact support
              </Link>
            </div>
          </Panel>

          <Panel
            title="From your wishlist"
            action={<Link href="/dashboard/my-wishlist" className="text-xs font-semibold text-gray-500 hover:text-gray-900">View all</Link>}
          >
            {wishlist.count === 0 ? (
              <p className="text-sm text-gray-500">Tap the heart on any product to save it here.</p>
            ) : (
              <ul className="space-y-2">
                {wishlist.items.slice(0, 3).map((item) => (
                  <li key={item._id}>
                    <Link href={`/products/${item._id}`} className="flex items-center gap-3 rounded-xl p-1.5 hover:bg-gray-50">
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-gray-50">
                        {item.image && <img src={item.image} alt="" className="h-full w-full object-contain p-1" />}
                      </span>
                      <span className="min-w-0 flex-1 truncate text-sm font-medium text-gray-900">{item.title}</span>
                      <span className="text-sm font-semibold text-gray-900">{formatTaka(item.finalPrice)}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </Panel>
        </div>
      </div>
    </div>
  );
}
