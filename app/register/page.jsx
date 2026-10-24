"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, UserPlus } from "lucide-react";
import { useAppDispatch } from "@/lib/hooks/redux";
import { signUp } from "@/lib/services/session";
import AuthShell, { AuthInput, PasswordToggle } from "@/components/Module/Auth/AuthShell";

const scorePassword = (p) => [p.length >= 6, /\d/.test(p), /[a-z]/.test(p) && /[A-Z]/.test(p), p.length >= 10].filter(Boolean).length;
const strength = [
  { label: "", bar: "bg-gray-200" },
  { label: "Weak", bar: "bg-red-400" },
  { label: "Fair", bar: "bg-amber-400" },
  { label: "Good", bar: "bg-emerald-400" },
  { label: "Strong", bar: "bg-emerald-600" },
];

export default function RegisterPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [form, setForm] = useState({ fullName: "", email: "", password: "" });
  const [agree, setAgree] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const score = scorePassword(form.password);
  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const validate = () => {
    const next = {};
    if (form.fullName.trim().length < 2) next.fullName = "Please enter your full name.";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = "Please enter a valid email address.";
    if (form.password.length < 6) next.password = "Use at least 6 characters.";
    if (!agree) next.agree = "Please accept the terms to continue.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const { user } = await signUp(dispatch, form);
      toast.success(`Welcome to Gadget Brust, ${user?.fullName?.split(" ")[0] || "friend"}!`);
      router.push("/");
    } catch (err) {
      setErrors({ form: (typeof err === "string" ? err : err?.message) || "Registration failed. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      variant="register"
      icon={UserPlus}
      title="Create your account"
      subtitle="It's free and takes less than a minute."
      footer={
        <>
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-gray-900 underline-offset-4 hover:underline">
            Sign in
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <AuthInput id="fullName" label="Full name" autoComplete="name" placeholder="Your name" value={form.fullName} onChange={update("fullName")} error={errors.fullName} />
        <AuthInput id="email" label="Email" type="email" autoComplete="email" placeholder="you@example.com" value={form.email} onChange={update("email")} error={errors.email} />
        <div>
          <AuthInput
            id="password"
            label="Password"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            placeholder="At least 6 characters"
            value={form.password}
            onChange={update("password")}
            error={errors.password}
            trailing={<PasswordToggle shown={showPassword} onToggle={() => setShowPassword((s) => !s)} />}
          />
          {form.password && (
            <div className="mt-2 flex items-center gap-3">
              <div className="flex flex-1 gap-1">
                {[1, 2, 3, 4].map((level) => (
                  <span key={level} className={`h-1 flex-1 rounded-full transition ${score >= level ? strength[score].bar : "bg-gray-200"}`} />
                ))}
              </div>
              <span className="w-12 text-right text-xs font-medium text-gray-500">{strength[score].label}</span>
            </div>
          )}
        </div>

        <div>
          <label htmlFor="agree" className="flex items-start gap-2.5 text-[13px] text-gray-600">
            <input id="agree" type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} className="mt-0.5 h-4 w-4 accent-gray-900" />
            <span>I agree to the terms of service and privacy policy.</span>
          </label>
          {errors.agree && <p className="mt-1.5 text-xs text-red-600">{errors.agree}</p>}
        </div>

        {errors.form && <p className="rounded-xl bg-red-50 px-3.5 py-2.5 text-sm text-red-700" role="alert">{errors.form}</p>}

        <button
          type="submit"
          disabled={loading}
          className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-gray-900 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:opacity-60"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create account"}
        </button>
      </form>
    </AuthShell>
  );
}
