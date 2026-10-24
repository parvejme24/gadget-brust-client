import { Flame, Home, LayoutGrid, Mail, Sparkles, Store, Tag } from "lucide-react";

// shared by the desktop nav bar and the mobile drawer
export const mainLinks = [
  { label: "Home", href: "/", icon: Home },
  { label: "Shop", href: "/products", icon: Store },
  { label: "Hot Deals", href: "/products?sort=discount", icon: Flame, highlight: true },
  { label: "New Arrivals", href: "/products?sort=newest", icon: Sparkles },
  { label: "Categories", href: "/categories", icon: LayoutGrid },
  { label: "Brands", href: "/brands", icon: Tag },
  { label: "Contact", href: "/contact", icon: Mail },
];
