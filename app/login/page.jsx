"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Briefcase, Loader2, LogIn, Megaphone, ScanBarcode, ShieldCheck, User, Warehouse } from "lucide-react";
import { useAppDispatch } from "@/lib/hooks/redux";
import { signIn } from "@/lib/services/session";
import { demoAccounts } from "@/lib/config/demoAccounts";
import AuthShell, { AuthInput, PasswordToggle } from "@/components/Module/Auth/AuthShell";

const demoIcons = { admin: ShieldCheck, user: User, manager: Briefcase, cashier: ScanBarcode, inventory: Warehouse, marketing: Megaphone };

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loadingKey, setLoadingKey] = useState(null);
  const [error, setError] = useState("");

  const redirectTo = (user) => {
    const redirect = searchParams.get("redirect");
    const safe = redirect?.startsWith("/") && !redirect.startsWith("//");
    // every role has a dashboard; the page itself checks what the role may open
    if (safe) return router.push(redirect);
    router.push("/dashboard/dashboard");
  };

  const login = async (credentials, key) => {
    setError("");
    setLoadingKey(key);
    try {
      const { user } = await signIn(dispatch, credentials);
      toast.success(`Welcome back, ${user?.fullName?.split(" ")[0] || "there"}!`);
      redirectTo(user);
    } catch (err) {
      const message = typeof err === "string" ? err : err?.message;
      setError(message === "Login failed" || !message ? "Couldn't reach the server. Make sure the API is running." : message);
    } finally {
      setLoadingKey(null);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      setError("Please enter your email and password.");
      return;
    }
    login(form, "form");
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <AuthInput
          id="email"
          label="Email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <AuthInput
          id="password"
          label="Password"
          type={showPassword ? "text" : "password"}
          autoComplete="current-password"
          placeholder="••••••••"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          trailing={<PasswordToggle shown={showPassword} onToggle={() => setShowPassword((s) => !s)} />}
        />
        <div className="-mt-1 text-right">
          <Link href={`/forgot-password${form.email ? `?email=${encodeURIComponent(form.email)}` : ""}`} className="text-xs font-semibold text-gray-600 underline-offset-4 hover:text-gray-900 hover:underline">
            Forgot password?
          </Link>
        </div>

        {error && <p className="rounded-xl bg-red-50 px-3.5 py-2.5 text-sm text-red-700" role="alert">{error}</p>}

        <button
          type="submit"
          disabled={!!loadingKey}
          className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-gray-900 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:opacity-60"
        >
          {loadingKey === "form" ? <Loader2 className="h-4 w-4 animate-spin" /> : "Sign in"}
        </button>
      </form>

      <div className="my-6 flex items-center gap-3 text-[11px] font-medium uppercase tracking-wider text-gray-400">
        <span className="h-px flex-1 bg-gray-200" /> Quick demo access <span className="h-px flex-1 bg-gray-200" />
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        {demoAccounts.map((account, index) => {
          const Icon = demoIcons[account.role];
          return (
            <button
              key={account.role}
              type="button"
              onClick={() => login(account, account.role)}
              disabled={!!loadingKey}
              title={`${account.email} / ${account.password}`}
              className={`flex h-11 items-center justify-center gap-2 rounded-xl border border-gray-200 bg-surface text-sm font-semibold text-gray-700 transition hover:border-gray-400 hover:text-gray-900 disabled:opacity-60 ${index === 0 || index === demoAccounts.length - 1 ? "col-span-2" : ""}`}
            >
              {loadingKey === account.role ? <Loader2 className="h-4 w-4 animate-spin" /> : <Icon className="h-4 w-4" />}
              {account.label}
            </button>
          );
        })}
      </div>
      <p className="mt-3 text-center text-xs text-gray-400">Each demo opens the dashboard with that role&apos;s pages.</p>
    </>
  );
}

export default function LoginPage() {
  return (
    <AuthShell
      variant="login"
      icon={LogIn}
      title="Welcome back"
      subtitle="Sign in to continue to your account."
      footer={
        <>
          New to Gadget Brust?{" "}
          <Link href="/register" className="font-semibold text-gray-900 underline-offset-4 hover:underline">
            Create an account
          </Link>
        </>
      }
    >
      <Suspense fallback={null}>
        <LoginForm />
      </Suspense>
    </AuthShell>
  );
}
