"use client";

import { useState } from "react";
import { toast } from "sonner";
import { MessageCircle, Send } from "lucide-react";
import { DropdownSelect } from "@/components/ui/dropdown-select";
import Reveal from "@/components/Shared/Motion/Reveal";

const subjects = ["Order & delivery", "Product question", "Warranty & returns", "Corporate / bulk order", "Other"];

// no contact API yet: the message is handed to the visitor's email app, addressed to the store email
export default function ContactForm({ email }) {
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: subjects[0], message: "" });
  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || form.message.trim().length < 10) {
      toast.error("Please add your name, email and a short message.");
      return;
    }
    if (!email) {
      toast.error("Our support email isn't available right now. Please call us instead.");
      return;
    }
    const body = `${form.message}\n\n${form.name}\n${form.email}${form.phone ? `\n${form.phone}` : ""}`;
    window.location.href = `mailto:${email}?subject=${encodeURIComponent(`[${form.subject}] Message from ${form.name}`)}&body=${encodeURIComponent(body)}`;
    toast.success("Opening your email app…", { description: "Send the email to reach our support team." });
  };

  return (
    <Reveal variant="left" className="lg:col-span-3">
      <form onSubmit={handleSubmit} className="rounded-3xl border border-gray-200/70 bg-surface shadow-sm shadow-gray-900/[0.03] p-6 sm:p-8" noValidate>
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand text-white">
            <MessageCircle className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Send us a message</h2>
            <p className="text-sm text-gray-500">We usually reply within one business day.</p>
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <Field label="Your name" id="name" value={form.name} onChange={update("name")} placeholder="Full name" autoComplete="name" />
          <Field label="Email" id="email" type="email" value={form.email} onChange={update("email")} placeholder="you@example.com" autoComplete="email" />
          <Field label="Phone (optional)" id="phone" type="tel" value={form.phone} onChange={update("phone")} placeholder="01XXXXXXXXX" autoComplete="tel" />
          <div>
            <label htmlFor="subject" className="mb-1.5 block text-sm font-medium text-gray-700">Topic</label>
            <DropdownSelect id="subject" size="lg" className="bg-canvas/50 shadow-none" value={form.subject} onChange={(subject) => setForm({ ...form, subject })} options={subjects.map((s) => ({ value: s, label: s }))} />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="message" className="mb-1.5 block text-sm font-medium text-gray-700">Message</label>
            <textarea
              id="message"
              rows={5}
              value={form.message}
              onChange={update("message")}
              placeholder="How can we help? Include your order number if you have one."
              className="w-full rounded-xl border border-gray-200 bg-canvas/50 p-4 text-sm outline-none transition focus:border-brand focus:bg-surface focus:ring-4 focus:ring-brand/10"
            />
          </div>
        </div>
        <button type="submit" className="press group mt-6 inline-flex h-12 items-center gap-2 rounded-xl bg-gray-900 px-6 font-semibold text-white transition hover:bg-gray-800">
          Send message <Send className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-1" />
        </button>
      </form>
    </Reveal>
  );
}

function Field({ label, id, ...props }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-gray-700">{label}</label>
      <input id={id} className="h-12 w-full rounded-xl border border-gray-200 bg-canvas/50 px-4 text-sm outline-none transition focus:border-brand focus:bg-surface focus:ring-4 focus:ring-brand/10" {...props} />
    </div>
  );
}
