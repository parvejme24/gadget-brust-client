"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { KeyRound, Loader2 } from "lucide-react";
import { useAppDispatch } from "@/lib/hooks/redux";
import { requestPasswordReset, resetPasswordAndSignIn } from "@/lib/services/session";
import AuthShell, { AuthInput, PasswordToggle } from "@/components/Module/Auth/AuthShell";

const submitClass =
  "flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-gray-900 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:opacity-60";

function ResetFlow() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();
  const [step, setStep] = useState("email"); // email -> code
  const [email, setEmail] = useState(searchParams.get("email") || "");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [devCode, setDevCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const sendCode = async (e) => {
    e?.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) return setError("Enter the email you signed up with.");
    setError("");
    setLoading(true);
    try {
      const result = await requestPasswordReset(email);
      setDevCode(result.devCode || "");
      setStep("code");
      toast.success("If that email has an account, we've sent a code.");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const reset = async (e) => {
    e.preventDefault();
    if (!/^\d{6}$/.test(code.trim())) return setError("Enter the 6-digit code from the email.");
    if (password.length < 6) return setError("Your new password needs at least 6 characters.");
    setError("");
    setLoading(true);
    try {
      const { user } = await resetPasswordAndSignIn(dispatch, { email, code, newPassword: password });
      toast.success(`Password changed. Welcome back, ${user?.fullName?.split(" ")[0] || "there"}!`);
      router.push("/dashboard/dashboard");
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  if (step === "email") {
    return (
      <form onSubmit={sendCode} className="space-y-4" noValidate>
        <AuthInput id="email" label="Email" type="email" autoComplete="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
        {error && <p className="rounded-xl bg-red-50 px-3.5 py-2.5 text-sm text-red-700" role="alert">{error}</p>}
        <button type="submit" disabled={loading} className={submitClass}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Send reset code"}
        </button>
      </form>
    );
  }

  return (
    <form onSubmit={reset} className="space-y-4" noValidate>
      <p className="rounded-xl bg-gray-50 px-3.5 py-2.5 text-sm text-gray-600">
        We sent a 6-digit code to <span className="font-semibold text-gray-900">{email}</span>. It expires in 10 minutes.
      </p>
      {devCode && (
        <p className="rounded-xl bg-amber-50 px-3.5 py-2.5 text-sm text-amber-800">
          Development mode: email isn&apos;t set up, so your code is <span className="font-mono font-bold tracking-widest">{devCode}</span>
        </p>
      )}
      <AuthInput
        id="code"
        label="Reset code"
        inputMode="numeric"
        autoComplete="one-time-code"
        maxLength={6}
        placeholder="123456"
        value={code}
        onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
      />
      <AuthInput
        id="new-password"
        label="New password"
        type={showPassword ? "text" : "password"}
        autoComplete="new-password"
        placeholder="At least 6 characters"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        trailing={<PasswordToggle shown={showPassword} onToggle={() => setShowPassword((s) => !s)} />}
      />
      {error && <p className="rounded-xl bg-red-50 px-3.5 py-2.5 text-sm text-red-700" role="alert">{error}</p>}
      <button type="submit" disabled={loading} className={submitClass}>
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Set new password"}
      </button>
      <div className="flex justify-between text-xs font-semibold text-gray-600">
        <button type="button" onClick={() => { setStep("email"); setCode(""); setError(""); }} className="underline-offset-4 hover:text-gray-900 hover:underline">
          Use a different email
        </button>
        <button type="button" onClick={sendCode} disabled={loading} className="underline-offset-4 hover:text-gray-900 hover:underline">
          Send a new code
        </button>
      </div>
    </form>
  );
}

export default function ForgotPasswordPage() {
  return (
    <AuthShell
      variant="login"
      icon={KeyRound}
      title="Reset your password"
      subtitle="We'll email you a code to set a new one."
      footer={
        <>
          Remembered it?{" "}
          <Link href="/login" className="font-semibold text-gray-900 underline-offset-4 hover:underline">
            Back to sign in
          </Link>
        </>
      }
    >
      <Suspense fallback={null}>
        <ResetFlow />
      </Suspense>
    </AuthShell>
  );
}
