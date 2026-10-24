// Roles and permissions. Keep in sync with gadget-brust-server/shared/config/permissions.js

const ALL = [
  "dashboard",
  "reports",
  "catalog",
  "inventory",
  "reviews",
  "coupons",
  "pos",
  "orders",
  "payments",
  "customers",
  "couriers",
  "shipping",
  "settings",
  "staff",
];

const STAFF_PERMISSIONS = {
  admin: ALL,
  manager: ALL.filter((p) => !["settings", "staff"].includes(p)),
  inventory: ["dashboard", "catalog", "inventory", "reviews"],
  cashier: ["dashboard", "pos", "orders", "customers", "couriers"],
  marketing: ["dashboard", "reports", "coupons", "reviews", "catalog"],
};

// customers get their own area of the dashboard (orders, wishlist, reviews)
export const ROLE_PERMISSIONS = { ...STAFF_PERMISSIONS, user: ["account"] };

export const STAFF_ROLES = Object.keys(STAFF_PERMISSIONS);

export const ROLE_INFO = {
  admin: { label: "Admin", description: "Full access, including staff and store settings" },
  manager: { label: "Manager", description: "Runs the store day to day: everything except staff and settings" },
  inventory: { label: "Store keeper", description: "Products, categories, brands and stock levels" },
  cashier: { label: "Cashier", description: "Counter sales (POS), orders, customers and couriers" },
  marketing: { label: "Marketing", description: "Coupons, reviews, reports and the product catalog" },
  user: { label: "Customer", description: "Shops on the storefront" },
};

export const isStaff = (role) => STAFF_ROLES.includes(role);
export const hasDashboard = (role) => !!ROLE_PERMISSIONS[role];
// permission may be one name or a list (any of them is enough)
export const can = (role, permission) =>
  !permission || [].concat(permission).some((p) => !!ROLE_PERMISSIONS[role]?.includes(p));
