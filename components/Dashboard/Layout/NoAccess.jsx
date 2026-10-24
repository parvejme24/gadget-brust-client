import Link from "next/link";
import { ShieldAlert } from "lucide-react";
import { buttonClass } from "@/components/Dashboard/Kit";
import { ROLE_INFO } from "@/lib/permissions";

export default function NoAccess({ role }) {
  return (
    <div className="flex flex-col items-center px-4 py-24 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
        <ShieldAlert className="h-6 w-6" />
      </span>
      <h1 className="mt-4 text-xl font-bold text-gray-900">You don&apos;t have access to this page</h1>
      <p className="mt-1 max-w-sm text-sm text-gray-500">
        Your role ({ROLE_INFO[role]?.label}) can&apos;t open this section. Ask an admin if you need access.
      </p>
      <Link href="/dashboard/dashboard" className={buttonClass("primary", "md", "mt-6")}>Back to dashboard</Link>
    </div>
  );
}
