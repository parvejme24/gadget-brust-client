"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useSession } from "@/lib/hooks/useSession";
import { hasDashboard } from "@/lib/permissions";
import { DashboardUserProvider } from "./DashboardUser";
import DashboardShell from "./DashboardShell";

// any signed-in role with a dashboard (staff and customers)
export default function DashboardLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, ready } = useSession();
  const allowed = ready && user && hasDashboard(user.role);

  useEffect(() => {
    if (!ready || allowed) return;
    toast.error("Please sign in to open your dashboard");
    router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
  }, [ready, allowed, pathname, router]);

  if (!allowed) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-canvas">
        <Loader2 className="h-8 w-8 animate-spin text-brand" />
      </div>
    );
  }

  return (
    <DashboardUserProvider value={user}>
      <DashboardShell user={user}>{children}</DashboardShell>
    </DashboardUserProvider>
  );
}
