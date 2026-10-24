"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Bell, ChevronDown, ExternalLink, Heart, LogOut, ReceiptText, Settings, ShoppingBag, Store, UserCircle } from "lucide-react";
import { useAppDispatch } from "@/lib/hooks/redux";
import { useClickOutside } from "@/lib/hooks/useClickOutside";
import { signOutUser } from "@/lib/services/session";
import { ROLE_INFO, can } from "@/lib/permissions";

const initials = (name = "") =>
  name.split(" ").filter(Boolean).slice(0, 2).map((p) => p[0]).join("").toUpperCase() || "U";

const links = [
  { label: "My profile", href: "/dashboard/profile", icon: UserCircle },
  { label: "My orders", href: "/dashboard/my-orders", icon: ShoppingBag, permission: "account" },
  { label: "Wishlist", href: "/dashboard/my-wishlist", icon: Heart, permission: "account" },
  { label: "Orders", href: "/dashboard/orders", icon: ReceiptText, permission: "orders" },
  { label: "Store settings", href: "/dashboard/store-settings", icon: Settings, permission: "settings" },
  { label: "Notifications", href: "/dashboard/notifications", icon: Bell },
  { label: "View storefront", href: "/", icon: Store, external: true },
];

export default function AvatarMenu({ user }) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);
  const ref = useClickOutside(close);
  const roleLabel = ROLE_INFO[user?.role]?.label || "Staff";

  const logout = async () => {
    close();
    await signOutUser(dispatch);
    toast.success("Signed out");
    router.push("/login");
  };

  const avatar = (size) =>
    user?.profileImage?.url ? (
      <img src={user.profileImage.url} alt="" className={`${size} rounded-lg object-cover`} />
    ) : (
      <span className={`flex ${size} items-center justify-center rounded-lg bg-gradient-to-br from-gray-800 to-gray-950 text-xs font-bold text-white`}>
        {initials(user?.fullName)}
      </span>
    );

  return (
    <div ref={ref} className="relative">
      <button onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-haspopup="menu" aria-label="Account menu" className="flex items-center gap-2.5 rounded-xl p-1.5 hover:bg-gray-100 md:pr-2">
        {avatar("h-8 w-8")}
        <span className="hidden text-left leading-tight lg:block">
          <span className="block max-w-[9rem] truncate text-sm font-semibold text-gray-900">{user?.fullName || "Account"}</span>
          <span className="block text-[11px] text-gray-500">{roleLabel}</span>
        </span>
        <ChevronDown className="hidden h-4 w-4 text-gray-400 lg:block" />
      </button>

      {open && (
        <div role="menu" className="absolute right-0 top-full z-50 mt-2 w-64 max-w-[calc(100vw-1rem)] overflow-hidden rounded-2xl border border-gray-200/70 bg-surface shadow-2xl shadow-gray-900/10">
          <div className="flex items-center gap-3 border-b border-gray-100 p-4">
            {avatar("h-10 w-10")}
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-gray-900">{user?.fullName}</p>
              <p className="truncate text-xs text-gray-500">{user?.email}</p>
              <span className="mt-1 inline-block rounded-md bg-gray-100 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-gray-600">{roleLabel}</span>
            </div>
          </div>
          <div className="p-2">
            {links
              .filter((l) => can(user?.role, l.permission))
              .map(({ label, href, icon: Icon, external }) => (
                <Link
                  key={label}
                  href={href}
                  role="menuitem"
                  target={external ? "_blank" : undefined}
                  onClick={close}
                  className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                >
                  <Icon className="h-4 w-4 text-gray-400" />
                  <span className="flex-1">{label}</span>
                  {external && <ExternalLink className="h-3.5 w-3.5 text-gray-300" />}
                </Link>
              ))}
          </div>
          <div className="border-t border-gray-100 p-2">
            <button role="menuitem" onClick={logout} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50">
              <LogOut className="h-4 w-4" />
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
