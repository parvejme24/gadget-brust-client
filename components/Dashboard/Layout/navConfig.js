import {
  BarChart3,
  Bell,
  Bike,
  BadgeCheck,
  ClipboardPlus,
  CreditCard,
  Heart,
  LayoutDashboard,
  MessageSquareText,
  Package,
  PackagePlus,
  PackageSearch,
  ReceiptText,
  ScanBarcode,
  Settings,
  Shapes,
  ShoppingBag,
  SlidersHorizontal,
  Star,
  TicketPercent,
  Truck,
  UserCircle,
  UserCog,
  Users,
  Warehouse,
} from "lucide-react";
import { can } from "@/lib/permissions";

// Every dashboard page. Each item is shown only to roles with (any of) its permission.
export const dashboardNav = [
  {
    group: "Overview",
    items: [
      { label: "Dashboard", href: "/dashboard/dashboard", icon: LayoutDashboard, permission: ["dashboard", "account"] },
      { label: "Reports", href: "/dashboard/reports", icon: BarChart3, permission: "reports" },
    ],
  },
  {
    group: "My account",
    items: [
      { label: "My orders", href: "/dashboard/my-orders", icon: ShoppingBag, permission: "account", badge: "activeOrders" },
      { label: "Wishlist", href: "/dashboard/my-wishlist", icon: Heart, permission: "account" },
      { label: "My reviews", href: "/dashboard/my-reviews", icon: Star, permission: "account" },
    ],
  },
  {
    group: "Sales",
    items: [
      { label: "Point of sale", href: "/dashboard/pos", icon: ScanBarcode, permission: "pos" },
      { label: "Orders", href: "/dashboard/orders", icon: ReceiptText, badge: "pendingOrders", permission: "orders" },
      { label: "Payments", href: "/dashboard/payments", icon: CreditCard, permission: "payments" },
      { label: "Customers", href: "/dashboard/customers", icon: Users, permission: "customers" },
      { label: "Coupons", href: "/dashboard/coupons", icon: TicketPercent, permission: "coupons" },
    ],
  },
  {
    group: "Catalog",
    items: [
      { label: "Products", href: "/dashboard/products", icon: Package, permission: "catalog" },
      { label: "Inventory", href: "/dashboard/inventory", icon: Warehouse, permission: "inventory" },
      { label: "Categories", href: "/dashboard/categories", icon: Shapes, permission: "catalog" },
      { label: "Brands", href: "/dashboard/brands", icon: BadgeCheck, permission: "catalog" },
      { label: "Reviews", href: "/dashboard/reviews", icon: MessageSquareText, permission: "reviews" },
    ],
  },
  {
    group: "Delivery",
    items: [
      { label: "Couriers", href: "/dashboard/couriers", icon: Bike, permission: "couriers" },
      { label: "Shipping", href: "/dashboard/shipping", icon: Truck, permission: "shipping" },
    ],
  },
  {
    group: "Settings",
    items: [
      { label: "Staff & roles", href: "/dashboard/staff", icon: UserCog, permission: "staff" },
      { label: "Store settings", href: "/dashboard/store-settings", icon: Settings, permission: "settings" },
      { label: "Notifications", href: "/dashboard/notifications", icon: Bell },
      { label: "My profile", href: "/dashboard/profile", icon: UserCircle },
    ],
  },
];

// Shortcuts on the left of the top bar; each role sees the first few it is allowed to use.
export const quickActions = [
  { label: "New sale", href: "/dashboard/pos", icon: ScanBarcode, permission: "pos", roles: ["cashier", "admin", "manager"] },
  { label: "New order", href: "/dashboard/orders/new", icon: ClipboardPlus, permission: "orders" },
  { label: "Add product", href: "/dashboard/products/add", icon: PackagePlus, permission: "catalog", roles: ["admin", "manager", "inventory"] },
  { label: "Adjust stock", href: "/dashboard/inventory?adjust=1", icon: SlidersHorizontal, permission: "inventory", roles: ["inventory"] },
  { label: "New coupon", href: "/dashboard/coupons/new", icon: TicketPercent, permission: "coupons", roles: ["marketing"] },
  { label: "Reports", href: "/dashboard/reports", icon: BarChart3, permission: "reports", roles: ["marketing"] },
  { label: "Shop now", href: "/products", icon: ShoppingBag, permission: "account" },
  { label: "Track an order", href: "/track-order", icon: PackageSearch, permission: "account" },
];

export const navForRole = (role) =>
  dashboardNav
    .map((g) => ({ ...g, items: g.items.filter((item) => can(role, item.permission)) }))
    .filter((g) => g.items.length);

export const quickActionsForRole = (role, limit = 3) =>
  quickActions.filter((a) => can(role, a.permission) && (!a.roles || a.roles.includes(role))).slice(0, limit);

// pages that aren't in the sidebar but still need a permission check and a breadcrumb
const extraPages = [
  { label: "New order", href: "/dashboard/orders/new", permission: "orders", parent: "/dashboard/orders" },
];

const allItems = () => [...extraPages, ...dashboardNav.flatMap((g) => g.items)];

// the nav item a path belongs to (longest matching href wins)
export const findNavItem = (pathname) =>
  allItems()
    .filter((item) => pathname === item.href || pathname.startsWith(`${item.href}/`))
    .sort((a, b) => b.href.length - a.href.length)[0];

export const findNavParent = (item) => (item?.parent ? allItems().find((i) => i.href === item.parent) : null);
