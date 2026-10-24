"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Lock } from "lucide-react";
import logo from "@/assets/logo.svg";
import { BRAND_NAME } from "@/lib/config/brand";
import Reveal from "@/components/Shared/Motion/Reveal";

const themes = {
  login: {
    glowA: "bg-emerald-300/35",
    glowB: "bg-sky-300/30",
    badge: "bg-emerald-100 text-emerald-700",
  },
  register: {
    glowA: "bg-violet-300/35",
    glowB: "bg-rose-200/40",
    badge: "bg-violet-100 text-violet-700",
  },
};

// Minimal centered auth layout: soft canvas, faint color glows, one glass card
export default function AuthShell({ variant = "login", icon: Icon, title, subtitle, children, footer }) {
  const theme = themes[variant];

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-canvas">
      <div className={`pointer-events-none absolute -left-40 -top-40 h-[32rem] w-[32rem] rounded-full blur-3xl ${theme.glowA}`} />
      <div className={`pointer-events-none absolute -bottom-48 -right-32 h-[36rem] w-[36rem] rounded-full blur-3xl ${theme.glowB}`} />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(rgba(28,32,36,0.06)_1px,transparent_1px)] [background-size:24px_24px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" />

      <header className="relative flex items-center justify-between px-5 py-5 sm:px-10">
        <Link href="/" aria-label={`${BRAND_NAME} home`}>
          <Image src={logo} alt={BRAND_NAME} className="h-8 w-auto" priority />
        </Link>
        <Link href="/" className="inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-medium text-gray-600 transition hover:bg-surface/70 hover:text-gray-900">
          <ArrowLeft className="h-4 w-4" />
          Back to store
        </Link>
      </header>

      <main className="relative flex flex-1 items-center justify-center px-5 pb-10">
        <div className="w-full max-w-[400px]">
          <Reveal variant="blur" className="rounded-[28px] border border-white/70 bg-surface/80 p-7 shadow-[0_24px_70px_-24px_rgba(28,32,36,0.25)] backdrop-blur-xl sm:p-9">
            {Icon && (
              <div className={`mb-6 flex h-12 w-12 items-center justify-center rounded-2xl ${theme.badge}`}>
                <Icon className="h-5 w-5" />
              </div>
            )}
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">{title}</h1>
            {subtitle && <p className="mt-1.5 text-sm text-gray-500">{subtitle}</p>}
            <div className="mt-7">{children}</div>
          </Reveal>
          {footer && <div className="mt-6 text-center text-sm text-gray-600">{footer}</div>}
        </div>
      </main>

      <footer className="relative flex items-center justify-center gap-1.5 pb-6 text-xs text-gray-500">
        <Lock className="h-3 w-3" /> Secure sign-in · © {new Date().getFullYear()} {BRAND_NAME}
      </footer>
    </div>
  );
}

export function AuthInput({ label, id, error, trailing, ...props }) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm font-semibold text-gray-800">
        {label}
      </label>
      <div
        className={`flex h-12 items-center rounded-xl border bg-canvas/60 px-4 transition ${
          error ? "border-red-300" : "border-gray-200 focus-within:border-gray-300 focus-within:bg-surface"
        }`}
      >
        <input id={id} className="h-full min-w-0 flex-1 bg-transparent text-[15px] text-gray-900 outline-none placeholder:text-gray-400" {...props} />
        {trailing}
      </div>
      {error && <p className="mt-1.5 text-xs text-red-600">{error}</p>}
    </div>
  );
}

export function PasswordToggle({ shown, onToggle }) {
  return (
    <button type="button" onClick={onToggle} className="text-xs font-semibold text-gray-500 hover:text-gray-900">
      {shown ? "Hide" : "Show"}
    </button>
  );
}
