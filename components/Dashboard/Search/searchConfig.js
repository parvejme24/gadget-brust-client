import { Package, ReceiptText, Search, TicketPercent, User, UserCog } from "lucide-react";
import { can, isStaff, ROLE_INFO } from "@/lib/permissions";
import { formatTaka } from "@/lib/format";
import { navForRole, quickActionsForRole } from "@/components/Dashboard/Layout/navConfig";

// what the search box offers to look for, per role
export const searchPlaceholder = (role) => {
  if (!isStaff(role)) return "Search products and your orders…";
  const parts = [
    (can(role, "catalog") || can(role, "inventory") || can(role, "pos")) && "products",
    can(role, "orders") && "orders",
    can(role, "customers") && "customers",
    can(role, "coupons") && "coupons",
  ].filter(Boolean);
  return `Search ${parts.join(", ") || "pages"}…`;
};

const pageItems = (role) =>
  navForRole(role).flatMap((g) => g.items.map((i) => ({ id: i.href, label: i.label, sub: g.group, href: i.href, icon: i.icon })));

// pages and shortcuts shown before anything is typed
export const suggestionGroups = (role) => [
  {
    key: "actions",
    title: "Quick actions",
    items: quickActionsForRole(role, 4).map((a) => ({ id: `qa:${a.href}`, label: a.label, href: a.href, icon: a.icon })),
  },
  { key: "pages", title: "Go to", items: pageItems(role).slice(0, 6) },
];

// turn the /api/search response into groups of links for this role
export const resultGroups = (role, query, data = {}) => {
  const staff = isStaff(role);
  const q = query.toLowerCase();
  const groups = [
    {
      key: "pages",
      title: "Pages",
      items: pageItems(role).filter((p) => p.label.toLowerCase().includes(q) || p.sub.toLowerCase().includes(q)).slice(0, 4),
    },
    {
      key: "products",
      title: "Products",
      items: (data.products || []).map((p) => ({
        id: `p:${p._id}`,
        label: p.title,
        sub: `${formatTaka(p.discountPrice || p.price)} · ${p.stock > 0 ? `${p.stock} in stock` : "Out of stock"}`,
        image: p.image?.url,
        icon: Package,
        href: staff && can(role, "catalog") ? `/dashboard/products/${p._id}` : `/products/${p._id}`,
      })),
    },
    {
      key: "orders",
      title: staff ? "Orders" : "Your orders",
      items: (data.orders || []).map((o) => ({
        id: `o:${o._id}`,
        label: o.invoiceNumber,
        sub: `${staff ? `${o.customer} · ` : ""}${formatTaka(o.total)} · ${o.orderStatus.charAt(0).toUpperCase()}${o.orderStatus.slice(1)}`,
        icon: ReceiptText,
        href: staff ? `/dashboard/orders/${o._id}` : `/dashboard/my-orders/${o._id}`,
      })),
    },
    {
      key: "customers",
      title: "Customers",
      items: (data.customers || []).map((c) => ({
        id: `c:${c._id}`,
        label: c.fullName,
        sub: c.email || c.phone,
        icon: User,
        href: `/dashboard/customers/${c._id}`,
      })),
    },
    {
      key: "coupons",
      title: "Coupons",
      items: (data.coupons || []).map((c) => ({
        id: `cp:${c._id}`,
        label: c.code,
        sub: `${c.title}${c.isActive ? "" : " · inactive"}`,
        icon: TicketPercent,
        href: `/dashboard/coupons/${c._id}`,
      })),
    },
    {
      key: "staff",
      title: "Staff",
      items: (data.staff || []).map((s) => ({
        id: `s:${s._id}`,
        label: s.fullName,
        sub: `${ROLE_INFO[s.role]?.label || s.role} · ${s.email}`,
        icon: UserCog,
        href: `/dashboard/staff?q=${encodeURIComponent(s.email)}`,
      })),
    },
  ].filter((g) => g.items.length);

  // always offer a full product search as the last row
  const seeAll = staff && can(role, "catalog") ? `/dashboard/products?q=${encodeURIComponent(query)}` : `/products?q=${encodeURIComponent(query)}`;
  groups.push({
    key: "all",
    title: "",
    items: [{ id: "all", label: `Search all products for “${query}”`, href: seeAll, icon: Search }],
  });
  return groups;
};
