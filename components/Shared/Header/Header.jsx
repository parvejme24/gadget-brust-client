"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Flame, Heart, Menu, Phone, Search, ShoppingBag, Truck, X } from "lucide-react";
import logo from "@/assets/logo.svg";
import { useAllCategories, useStoreInfo } from "@/lib/hooks/useStorefront";
import { useShopCart, useShopWishlist } from "@/lib/hooks/useShop";
import { formatTaka } from "@/lib/format";
import SearchBox from "./SearchBox";
import AccountMenu from "./AccountMenu";
import CategoryMegaMenu from "./CategoryMegaMenu";
import MobileMenu from "./MobileMenu";
import MiniCart from "./MiniCart";

function CountBadge({ count, className = "-right-0.5 -top-0.5" }) {
  if (!count) return null;
  return (
    <span className={`absolute ${className} flex h-5 min-w-5 items-center justify-center rounded-full bg-brand px-1 text-[11px] font-bold text-white ring-2 ring-white`}>
      {count > 99 ? "99+" : count}
    </span>
  );
}

export default function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const closeMenu = useCallback(() => setMenuOpen(false), []);
  const cart = useShopCart();
  const wishlist = useShopWishlist();
  const { data } = useAllCategories();
  const store = useStoreInfo();
  const topCategories = (data?.data || []).slice(0, 5);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // close overlays after navigating
  useEffect(() => {
    setMenuOpen(false);
    setSearchOpen(false);
    cart.close();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const isActive = (href) => (href === "/" ? pathname === "/" : pathname.startsWith(href.split("?")[0]));

  return (
    <>
      {/* announcement bar */}
      <div className="bg-gray-900 text-xs text-gray-300">
        <div className="container mx-auto flex h-9 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <p className="flex min-w-0 items-center gap-2">
            <Truck className="h-3.5 w-3.5 shrink-0 text-brand" />
            <span className="truncate">
              {store.announcement ||
                (store.freeDeliveryThreshold > 0 && (
                  <>
                    Free delivery on orders over <span className="font-semibold text-white">{formatTaka(store.freeDeliveryThreshold)}</span>
                  </>
                ))}
            </span>
          </p>
          <div className="hidden items-center gap-5 sm:flex">
            {store.phone && (
              <a href={store.phoneHref} className="flex items-center gap-1.5 hover:text-white">
                <Phone className="h-3.5 w-3.5" /> {store.phone}
              </a>
            )}
            <Link href="/contact" className="hover:text-white">Help & Support</Link>
          </div>
        </div>
      </div>

      <header className={`sticky top-0 z-50 bg-white/95 backdrop-blur transition-shadow ${scrolled ? "shadow-lg shadow-gray-900/5" : ""}`}>
        {/* main bar */}
        <div className="border-b border-gray-100">
          <div className="container mx-auto flex h-16 max-w-7xl items-center gap-2 px-4 sm:gap-4 sm:px-6 lg:h-20 lg:px-8">
            <button onClick={() => setMenuOpen(true)} aria-label="Open menu" className="-ml-2 rounded-full p-2 text-gray-700 hover:bg-gray-100 lg:hidden">
              <Menu className="h-6 w-6" />
            </button>

            <Link href="/" className="shrink-0" aria-label={`${store.name} home`}>
              <Image src={logo} alt={store.name} className="h-9 w-auto lg:h-11" priority />
            </Link>

            <div className="mx-auto hidden max-w-2xl flex-1 md:block lg:px-6">
              <SearchBox />
            </div>

            <div className="ml-auto flex items-center gap-0.5 sm:gap-1 md:ml-0">
              <button
                onClick={() => setSearchOpen((o) => !o)}
                aria-label={searchOpen ? "Close search" : "Open search"}
                className="rounded-full p-2.5 text-gray-700 hover:bg-gray-100 md:hidden"
              >
                {searchOpen ? <X className="h-5 w-5" /> : <Search className="h-5 w-5" />}
              </button>

              <div className="hidden sm:block">
                <AccountMenu />
              </div>

              <Link href="/wishlist" aria-label={`Wishlist (${wishlist.count} items)`} className="relative rounded-full p-2.5 text-gray-700 hover:bg-gray-100">
                <Heart className="h-5 w-5 lg:h-6 lg:w-6" />
                <CountBadge count={wishlist.count} />
              </Link>

              <button
                onClick={cart.open}
                aria-label={`Open cart (${cart.count} items)`}
                className="flex items-center gap-3 rounded-full p-2.5 text-gray-700 hover:bg-gray-100 lg:pr-4"
              >
                <span className="relative">
                  <ShoppingBag className="h-5 w-5 lg:h-6 lg:w-6" />
                  <CountBadge count={cart.count} className="-right-3 -top-3" />
                </span>
                <span className="hidden text-left leading-tight lg:block">
                  <span className="block text-[11px] text-gray-500">My cart</span>
                  <span className="block text-sm font-bold text-gray-900">{formatTaka(cart.subtotal)}</span>
                </span>
              </button>
            </div>
          </div>

          {searchOpen && (
            <div className="border-t border-gray-100 px-4 py-3 md:hidden">
              <SearchBox autoFocus showCategory={false} onNavigate={() => setSearchOpen(false)} />
            </div>
          )}
        </div>

        {/* desktop nav */}
        <nav aria-label="Main navigation" className="hidden border-b border-gray-100 lg:block">
          <div className="container mx-auto flex h-14 max-w-7xl items-center gap-6 px-4 sm:px-6 lg:px-8">
            <CategoryMegaMenu />

            <ul className="flex items-center gap-1 text-sm font-semibold text-gray-700">
              <li>
                <Link href="/" className={`rounded-lg px-3 py-2 transition hover:text-brand ${isActive("/") ? "text-brand" : ""}`}>
                  Home
                </Link>
              </li>
              <li>
                <Link href="/products" className={`rounded-lg px-3 py-2 transition hover:text-brand ${isActive("/products") ? "text-brand" : ""}`}>
                  Shop
                </Link>
              </li>
              {topCategories.map((category, index) => (
                <li key={category._id} className={`group relative ${index >= 3 ? "hidden xl:block" : ""}`}>
                  <Link
                    href={`/products?category=${category._id}`}
                    className="flex items-center gap-1 rounded-lg px-3 py-2 transition hover:text-brand"
                    aria-haspopup="true"
                  >
                    {category.categoryName}
                    {category.subcategories?.length > 0 && (
                      <ChevronDown className="h-3.5 w-3.5 text-gray-400 transition-transform group-hover:rotate-180" />
                    )}
                  </Link>
                  {category.subcategories?.length > 0 && (
                    <div className="invisible absolute left-0 top-full z-50 pt-2 opacity-0 transition-all duration-150 group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
                      <div className="w-56 rounded-2xl border border-gray-100 bg-white p-2 shadow-2xl shadow-gray-900/10">
                        {category.subcategories.map((sub) => (
                          <Link
                            key={sub}
                            href={`/products?category=${category._id}&subcategory=${encodeURIComponent(sub)}`}
                            className="block rounded-xl px-3 py-2 text-sm font-medium text-gray-600 transition hover:bg-brand-light hover:text-brand-dark"
                          >
                            {sub}
                          </Link>
                        ))}
                        <Link
                          href={`/products?category=${category._id}`}
                          className="mt-1 block rounded-xl border-t border-gray-100 px-3 py-2 text-sm font-semibold text-brand"
                        >
                          Shop all {category.categoryName} →
                        </Link>
                      </div>
                    </div>
                  )}
                </li>
              ))}
            </ul>

            <div className="ml-auto flex items-center gap-1 text-sm font-semibold">
              <Link href="/products?sort=discount" className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-red-600 transition hover:bg-red-50">
                <Flame className="h-4 w-4" /> Hot Deals
              </Link>
              <Link href="/contact" className={`rounded-lg px-3 py-2 text-gray-700 transition hover:text-brand ${isActive("/contact") ? "text-brand" : ""}`}>
                Contact
              </Link>
            </div>
          </div>
        </nav>
      </header>

      <MobileMenu open={menuOpen} onClose={closeMenu} />
      <MiniCart />
    </>
  );
}
