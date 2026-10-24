"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ChevronDown, Heart, LayoutDashboard, LogIn, LogOut, Package, ShoppingBag, User, UserPlus } from "lucide-react";
import { useAppDispatch } from "@/lib/hooks/redux";
import { useSession } from "@/lib/hooks/useSession";
import { signOutUser } from "@/lib/services/session";
import { ROLE_INFO, isStaff } from "@/lib/permissions";

export const getInitials = (name = "") =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase() || "U";

export default function AccountMenu() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user } = useSession();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const onClick = (e) => ref.current && !ref.current.contains(e.target) && setOpen(false);
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const handleLogout = async () => {
    setOpen(false);
    await signOutUser(dispatch);
    toast.success("You have been signed out");
    router.push("/");
  };

  const close = () => setOpen(false);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label="Account menu"
        className="flex h-11 items-center gap-2 rounded-full px-1 transition hover:bg-gray-100 sm:pr-3"
      >
        {user ? (
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-brand to-emerald-700 text-sm font-bold text-white">
            {getInitials(user.fullName || user.email)}
          </span>
        ) : (
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-700">
            <User className="h-5 w-5" />
          </span>
        )}
        <span className="hidden text-left leading-tight lg:block">
          <span className="block text-[11px] text-gray-500">{user ? "Hello," : "Welcome"}</span>
          <span className="block max-w-[7rem] truncate text-sm font-semibold text-gray-900">
            {user ? user.fullName?.split(" ")[0] || "Account" : "Sign in"}
          </span>
        </span>
        <ChevronDown className="hidden h-4 w-4 text-gray-400 lg:block" />
      </button>

      {open && (
        <div role="menu" className="absolute right-0 top-full z-50 mt-2 w-64 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-2xl shadow-gray-900/10">
          {user ? (
            <>
              <div className="border-b border-gray-100 bg-gray-50 p-4">
                <p className="truncate font-semibold text-gray-900">{user.fullName}</p>
                <p className="truncate text-xs text-gray-500">{user.email}</p>
                {ROLE_INFO[user.role] && (
                  <span className="mt-2 inline-block rounded-full bg-gray-900 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                    {ROLE_INFO[user.role].label}
                  </span>
                )}
              </div>
              <div className="p-2">
                <MenuLink href="/dashboard/dashboard" icon={LayoutDashboard} onClick={close}>{isStaff(user.role) ? "Dashboard" : "My account"}</MenuLink>
                {!isStaff(user.role) && <MenuLink href="/dashboard/my-orders" icon={Package} onClick={close}>My orders</MenuLink>}
                <MenuLink href="/dashboard/profile" icon={User} onClick={close}>My profile</MenuLink>
                <MenuLink href="/wishlist" icon={Heart} onClick={close}>Wishlist</MenuLink>
                <MenuLink href="/cart" icon={ShoppingBag} onClick={close}>Cart</MenuLink>
              </div>
              <div className="border-t border-gray-100 p-2">
                <button
                  role="menuitem"
                  onClick={handleLogout}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50"
                >
                  <LogOut className="h-4 w-4" />
                  Sign out
                </button>
              </div>
            </>
          ) : (
            <div className="p-4">
              <p className="font-semibold text-gray-900">Welcome to Gadget Brust</p>
              <p className="mt-1 text-xs text-gray-500">Sign in to track orders and sync your account.</p>
              <div className="mt-4 grid gap-2">
                <Link href="/login" onClick={close} className="flex h-10 items-center justify-center gap-2 rounded-xl bg-brand text-sm font-semibold text-white hover:bg-brand-dark">
                  <LogIn className="h-4 w-4" /> Sign in
                </Link>
                <Link href="/register" onClick={close} className="flex h-10 items-center justify-center gap-2 rounded-xl border border-gray-200 text-sm font-semibold text-gray-800 hover:bg-gray-50">
                  <UserPlus className="h-4 w-4" /> Create account
                </Link>
              </div>
              <div className="mt-3 border-t border-gray-100 pt-3">
                <MenuLink href="/wishlist" icon={Heart} onClick={close}>Wishlist</MenuLink>
                <MenuLink href="/cart" icon={ShoppingBag} onClick={close}>Cart</MenuLink>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function MenuLink({ href, icon: Icon, children, onClick }) {
  return (
    <Link
      href={href}
      role="menuitem"
      onClick={onClick}
      className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 hover:text-brand-dark"
    >
      <Icon className="h-4 w-4 text-gray-400" />
      {children}
    </Link>
  );
}
