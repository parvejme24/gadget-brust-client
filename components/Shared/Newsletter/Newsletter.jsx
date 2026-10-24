"use client";

import { useState } from "react";
import Image from "next/image";
import { Mail, Send } from "lucide-react";
import { toast } from "sonner";

import gadgetsImage from "@/assets/gadgets1.svg";
import Reveal from "@/components/Shared/Motion/Reveal";

export default function Newsletter() {
  const [email, setEmail] = useState("");

  // no subscribe endpoint on the server yet, so this only confirms locally
  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success("Thanks for subscribing! Watch your inbox for deals.");
    setEmail("");
  };

  return (
    <section className="py-10 sm:py-14">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal variant="zoom" className="relative overflow-hidden rounded-3xl bg-gray-900 px-6 py-10 sm:px-10 lg:px-14">
          <div className="pointer-events-none absolute -left-20 -top-20 h-72 w-72 rounded-full bg-brand/30 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 right-10 h-72 w-72 rounded-full bg-emerald-400/10 blur-3xl" />

          <div className="relative grid grid-cols-1 items-center gap-8 md:grid-cols-2">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-emerald-300">
                <Mail className="h-3.5 w-3.5" />
                Newsletter
              </span>
              <h2 className="mt-4 text-2xl font-bold text-white sm:text-4xl">
                Get exclusive deals before anyone else
              </h2>
              <p className="mt-3 text-gray-400">
                New launches, flash sales and member-only coupons. No spam, unsubscribe anytime.
              </p>

              <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-3 sm:flex-row">
                <label htmlFor="newsletter-email" className="sr-only">
                  Email address
                </label>
                <input
                  id="newsletter-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="h-12 flex-1 rounded-full border border-white/10 bg-white/5 px-5 text-white placeholder:text-gray-500 outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/40"
                />
                <button
                  type="submit"
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-brand px-6 font-semibold text-white transition hover:bg-brand-dark"
                >
                  Subscribe
                  <Send className="h-4 w-4" />
                </button>
              </form>
            </div>

            <div className="hidden justify-end md:flex">
              <Image src={gadgetsImage} alt="" className="animate-float max-h-72 w-auto" draggable={false} />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
