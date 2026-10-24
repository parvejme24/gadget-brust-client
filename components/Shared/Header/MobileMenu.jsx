"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ChevronDown, LayoutDashboard, LogOut, Mail, Phone, X } from "lucide-react";
import logo from "@/assets/logo.svg";
import { useAllCategories, useStoreInfo } from "@/lib/hooks/useStorefront";
import { useAppDispatch } from "@/lib/hooks/redux";
import { useSession } from "@/lib/hooks/useSession";
import { signOutUser } from "@/lib/services/session";
import { isStaff } from "@/lib/permissions";
import { getCategoryIcon } from "@/lib/categoryIcons";
import SearchBox from "./SearchBox";
import { getInitials } from "./AccountMenu";
import { mainLinks } from "./navLinks";

export default function MobileMenu({ open, onClose }) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user } = useSession();
  const store = useStoreInfo();
  const { data } = useAllCategories();
  const categories = data?.data || [];
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  const logout = async () => {
    onClose();
    await signOutUser(dispatch);
    toast.success("You have been signed out");
    router.push("/");
  };

  return (
    <div className={`fixed inset-0 z-[70] lg:hidden ${open ? "" : "pointer-events-none"}`} aria-hidden={!open}>
      <div onClick={onClose} className={`absolute inset-0 bg-gray-900/40 transition-opacity duration-300 ${open ? "opacity-100" : "opacity-0"}`} />
      <nav
        aria-label="Mobile navigation"
        className={`absolute inset-y-0 left-0 flex w-[88%] max-w-sm flex-col bg-white shadow-2xl transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
          <Link href="/" onClick={onClose}>
            <Image src={logo} alt={store.name} className="h-9 w-auto" priority />
          </Link>
          <button onClick={onClose} aria-label="Close menu" className="rounded-full p-2 hover:bg-gray-100">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {/* account card */}
          <div className="p-4">
            {user ? (
              <div className="flex items-center gap-3 rounded-2xl bg-gradient-to-br from-gray-900 to-emerald-950 p-4 text-white">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-brand text-sm font-bold">
                  {getInitials(user.fullName || user.email)}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold">{user.fullName}</p>
                  <Link href="/dashboard/dashboard" onClick={onClose} className="text-xs text-emerald-300 hover:underline">
                    {isStaff(user.role) ? "Open dashboard" : "My account & orders"}
                  </Link>
                </div>
              </div>
            ) : (
              <div className="rounded-2xl bg-gradient-to-br from-gray-900 to-emerald-950 p-4 text-white">
                <p className="font-semibold">Welcome to {store.name}</p>
                <p className="mt-0.5 text-xs text-gray-300">Sign in for the best experience</p>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <Link href="/login" onClick={onClose} className="flex h-9 items-center justify-center rounded-lg bg-brand text-sm font-semibold">
                    Sign in
                  </Link>
                  <Link href="/register" onClick={onClose} className="flex h-9 items-center justify-center rounded-lg bg-white/10 text-sm font-semibold">
                    Register
                  </Link>
                </div>
              </div>
            )}
            <div className="mt-4">
              <SearchBox showCategory={false} onNavigate={onClose} />
            </div>
          </div>

          {/* main links */}
          <ul className="px-2">
            {mainLinks.map(({ label, href, icon: Icon, highlight }) => (
              <li key={label}>
                <Link
                  href={href}
                  onClick={onClose}
                  className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition hover:bg-gray-50 ${
                    highlight ? "text-red-600" : "text-gray-800"
                  }`}
                >
                  <Icon className="h-5 w-5 opacity-70" />
                  {label}
                </Link>
              </li>
            ))}
            {user && (
              <li>
                <Link href="/dashboard/dashboard" onClick={onClose} className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-gray-800 hover:bg-gray-50">
                  <LayoutDashboard className="h-5 w-5 opacity-70" />
                  {isStaff(user.role) ? "Dashboard" : "My account"}
                </Link>
              </li>
            )}
          </ul>

          {/* categories accordion */}
          <div className="mt-2 border-t border-gray-100 px-2 py-3">
            <p className="px-3 pb-2 text-xs font-semibold uppercase tracking-wider text-gray-400">Shop by category</p>
            <ul>
              {categories.map((category) => {
                const Icon = getCategoryIcon(category.categoryName);
                const isOpen = expanded === category._id;
                return (
                  <li key={category._id}>
                    <button
                      onClick={() => setExpanded(isOpen ? null : category._id)}
                      aria-expanded={isOpen}
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                      <Icon className="h-4 w-4 text-gray-400" />
                      <span className="flex-1 text-left">{category.categoryName}</span>
                      <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                    </button>
                    {isOpen && (
                      <div className="mb-2 ml-10 flex flex-col border-l border-gray-100 pl-3">
                        <Link href={`/products?category=${category._id}`} onClick={onClose} className="py-2 text-sm font-semibold text-brand-dark">
                          Shop all {category.categoryName}
                        </Link>
                        {category.subcategories?.map((sub) => (
                          <Link
                            key={sub}
                            href={`/products?category=${category._id}&subcategory=${encodeURIComponent(sub)}`}
                            onClick={onClose}
                            className="py-2 text-sm text-gray-600 hover:text-brand"
                          >
                            {sub}
                          </Link>
                        ))}
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        <div className="space-y-2 border-t border-gray-100 p-4 text-sm">
          {store.phone && (
            <a href={store.phoneHref} className="flex items-center gap-2 text-gray-600 hover:text-brand">
              <Phone className="h-4 w-4" /> {store.phone}
            </a>
          )}
          {store.email && (
            <a href={`mailto:${store.email}`} className="flex items-center gap-2 text-gray-600 hover:text-brand">
              <Mail className="h-4 w-4" /> {store.email}
            </a>
          )}
          {user && (
            <button onClick={logout} className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl border border-red-100 py-2.5 font-semibold text-red-600 hover:bg-red-50">
              <LogOut className="h-4 w-4" /> Sign out
            </button>
          )}
        </div>
      </nav>
    </div>
  );
}
