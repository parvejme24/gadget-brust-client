import { ROLE_INFO, STAFF_ROLES } from "@/lib/permissions";

// dashboard areas in the permissions matrix, in display order
export const AREAS = [
  ["dashboard", "Dashboard"],
  ["pos", "Point of sale"],
  ["orders", "Orders"],
  ["customers", "Customers"],
  ["payments", "Payments"],
  ["coupons", "Coupons"],
  ["catalog", "Products & catalog"],
  ["inventory", "Inventory"],
  ["reviews", "Reviews"],
  ["couriers", "Couriers"],
  ["shipping", "Shipping"],
  ["reports", "Reports"],
  ["settings", "Store settings"],
  ["staff", "Staff & roles"],
  ["account", "My orders, wishlist & reviews"],
];

export const roleTone = { admin: "bg-gray-900 text-white", manager: "bg-violet-100 text-violet-800", inventory: "bg-amber-100 text-amber-800", cashier: "bg-emerald-100 text-emerald-800", marketing: "bg-sky-100 text-sky-800", user: "bg-gray-100 text-gray-700" };
export const roleOptions = STAFF_ROLES.map((r) => ({ value: r, label: ROLE_INFO[r].label, description: ROLE_INFO[r].description }));
export const makePassword = () => `Gb${Math.random().toString(36).slice(2, 8)}${Math.floor(10 + Math.random() * 89)}!`;
