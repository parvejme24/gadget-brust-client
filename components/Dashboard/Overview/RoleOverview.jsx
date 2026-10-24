"use client";

import { useDashboardUser } from "@/components/Dashboard/Layout/DashboardUser";
import CustomerOverview from "@/components/Dashboard/Account/CustomerOverview";
import StoreOverview from "./StoreOverview";
import CashierOverview from "./CashierOverview";
import StoreKeeperOverview from "./StoreKeeperOverview";
import MarketingOverview from "./MarketingOverview";

const views = {
  admin: StoreOverview,
  manager: StoreOverview,
  cashier: CashierOverview,
  inventory: StoreKeeperOverview,
  marketing: MarketingOverview,
  user: CustomerOverview,
};

// each role gets its own overview
export default function RoleOverview() {
  const user = useDashboardUser();
  const View = views[user?.role] || CustomerOverview;
  return <View user={user} />;
}
